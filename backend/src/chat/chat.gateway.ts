import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

interface WaitingUser {
  userId: string;
  socketId: string;
}

@WebSocketGateway({
  cors: {
    origin: '*', // 실제 프로덕션에서는 특정 도메인으로 제한하세요.
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // key: userId, value: socketId
  private connectedUsers: Map<string, string> = new Map();
  // key: tag, value: WaitingUser[]
  private waitingUsers: Map<string, WaitingUser[]> = new Map();

  handleConnection(client: Socket) {
    console.log(`- Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`- Client disconnected: ${client.id}`);

    let userIdToRemove: string | null = null;

    // 1. connectedUsers에서 해당 socket.id를 가진 userId 찾기
    for (const [userId, socketId] of this.connectedUsers.entries()) {
      if (socketId === client.id) {
        userIdToRemove = userId;
        break;
      }
    }

    if (userIdToRemove) {
      // 2. connectedUsers에서 제거
      this.connectedUsers.delete(userIdToRemove);
      console.log(`- User unregistered: ${userIdToRemove}`);

      // 3. 모든 waitingUsers 대기열에서 해당 유저 제거
      for (const [tag, queue] of this.waitingUsers.entries()) {
        const newQueue = queue.filter((user) => user.userId !== userIdToRemove);
        if (newQueue.length < queue.length) {
          this.waitingUsers.set(tag, newQueue);
          console.log(
            `- User ${userIdToRemove} removed from waiting queue for tag #${tag}.`,
          );
        }
      }
    }
  }

  @SubscribeMessage('register_user')
  handleRegisterUser(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.connectedUsers.set(data.userId, client.id);
    console.log(`- User registered: ${data.userId} -> ${client.id}`);
  }

  /**
   * FailpostsService에서 호출되는 메서드
   * 사용자를 대기열에 추가하고 매칭을 시도합니다.
   */
  public tryMatchUser(userId: string, tag: string) {
    console.log(`- Matching attempt for user ${userId} with tag #${tag}`);
    const socketId = this.connectedUsers.get(userId);

    if (!socketId) {
      console.log(`- Matching attempt failed: User ${userId} is not connected.`);
      return;
    }

    const waitingList = this.waitingUsers.get(tag) || [];

    // 이미 대기열에 있는지 확인 (중복 추가 방지)
    if (waitingList.some((user) => user.userId === userId)) {
      console.log(
        `- User ${userId} is already in the waiting queue for tag #${tag}.`,
      );
      return;
    }

    waitingList.push({ userId, socketId });
    this.waitingUsers.set(tag, waitingList);

    console.log(
      `- User ${userId} added to waiting queue for tag #${tag}. Queue size: ${waitingList.length}`,
    );

    if (waitingList.length >= 2) {
      console.log(`- Match found for tag #${tag}!`);

      const userA = waitingList.shift();
      const userB = waitingList.shift();

      // 타입스크립트 오류 방지를 위해 userA와 userB가 존재하는지 확인
      if (userA && userB) {
        this.waitingUsers.set(tag, waitingList);

        const roomId = uuidv4();
        const socketA = this.server.sockets.sockets.get(userA.socketId);
        const socketB = this.server.sockets.sockets.get(userB.socketId);

        if (socketA && socketB) {
          socketA.join(roomId);
          socketB.join(roomId);

          this.server.to(roomId).emit('matched', {
            roomId: roomId,
            users: [{ userId: userA.userId }, { userId: userB.userId }],
            message: `매칭이 성사되었습니다! '${tag}'에 대한 대화를 시작해보세요.`,
          });
          console.log(
            `- Room ${roomId} created for ${userA.userId} and ${userB.userId}`,
          );
        } else {
          console.error('- Critical error: Matched user socket not found.');
          // 예외 처리: 매칭 실패한 사용자들을 다시 대기열 앞으로 추가
          waitingList.unshift(userB);
          waitingList.unshift(userA);
          this.waitingUsers.set(tag, waitingList);
        }
      }
    }
  }

  @SubscribeMessage('send_message')
  handleSendMessage(
    @MessageBody() data: { roomId: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    let senderId: string | null = null;
    for (const [userId, socketId] of this.connectedUsers.entries()) {
      if (socketId === client.id) {
        senderId = userId;
        break;
      }
    }

    if (senderId) {
      this.server.to(data.roomId).emit('new_message', {
        senderId: senderId,
        message: data.message,
      });
      console.log(
        `- Message from ${senderId} to room ${data.roomId}: ${data.message}`,
      );
    } else {
      console.error(
        `- Error: Could not find sender for socket ${client.id}. Message not sent.`,
      );
    }
  }
}
