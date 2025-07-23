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
import { PrismaService } from 'src/prisma/prisma.service'; // PrismaService import

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
  constructor(private prisma: PrismaService) {} // PrismaService 주입

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
  public async tryMatchUser(userId: string) {
    console.log(`🔥 [ChatGateway] tryMatchUser called for userId: ${userId}`);
    
    // 1. DB에서 사용자의 최신 정보 조회
    const currentUser = await this.prisma.user.findUnique({ where: { id: userId } });
    console.log(`🔥 [ChatGateway] User found in DB:`, currentUser ? `${currentUser.nickname} (${currentUser.id})` : 'null');
    if (!currentUser || !currentUser.current_tag) {
      console.log(`- Matching attempt failed: User ${userId} has no current_tag.`);
      return;
    }
    const tag = currentUser.current_tag;
    console.log(`- Matching attempt for user ${currentUser.nickname} (${userId}) with tag #${tag}`);

    // 2. 현재 사용자의 소켓 연결 확인
    const currentUserSocketId = this.connectedUsers.get(userId);
    if (!currentUserSocketId) {
      console.log(`- Matching attempt failed: User ${userId} is not connected.`);
      return;
    }

    // 3. 대기열에서 매칭 상대 찾기
    const waitingList = this.waitingUsers.get(tag) || [];
    const partnerIndex = waitingList.findIndex(p => p.userId !== userId);

    if (partnerIndex !== -1) {
      // 4. 매칭 성공
      const partner = waitingList[partnerIndex];
      const partnerUser = await this.prisma.user.findUnique({ where: { id: partner.userId } });

      if (!partnerUser) {
        console.error(`- Critical error: Partner user ${partner.userId} not found in DB.`);
        // 문제가 있는 파트너는 대기열에서 제거하고 현재 유저는 대기열에 추가
        this.waitingUsers.set(tag, waitingList.filter((_, i) => i !== partnerIndex));
        this.tryMatchUser(userId); // 현재 유저로 다시 시도 (다른 파트너 찾기)
        return;
      }
      
      console.log(`- Match found for tag #${tag}! -> ${currentUser.nickname} & ${partnerUser.nickname}`);
      
      // 대기열에서 파트너 제거
      waitingList.splice(partnerIndex, 1);
      this.waitingUsers.set(tag, waitingList);

      const roomId = uuidv4();
      const socketA = this.server.sockets.sockets.get(currentUserSocketId);
      const socketB = this.server.sockets.sockets.get(partner.socketId);

      if (socketA && socketB) {
        socketA.join(roomId);
        socketB.join(roomId);

        const payload = {
          roomId: roomId,
          users: [
            { userId: currentUser.id, nickname: currentUser.nickname },
            { userId: partnerUser.id, nickname: partnerUser.nickname }
          ],
          message: `'${tag}' 태그로 매칭되었습니다! 대화를 시작해보세요.`,
        };

        console.log(`🚀 [ChatGateway] About to emit 'matched' event:`);
        console.log(`   - Room ID: ${roomId}`);
        console.log(`   - Payload:`, JSON.stringify(payload, null, 2));
        console.log(`   - Socket A (${currentUser.nickname}): ${currentUserSocketId} -> Connected: ${socketA.connected}`);
        console.log(`   - Socket B (${partnerUser.nickname}): ${partner.socketId} -> Connected: ${socketB.connected}`);
        console.log(`   - Room members:`, Array.from(this.server.sockets.adapter.rooms.get(roomId) || []));

        this.server.to(roomId).emit('matched', payload);
        console.log(`✅ [ChatGateway] Event 'matched' emitted to room ${roomId}.`);
      } else {
        console.error('- Critical error: Matched user socket not found. Re-queuing partner.');
        // 파트너를 다시 대기열에 추가
        this.waitingUsers.set(tag, [...waitingList, partner]);
      }
    } else {
      // 5. 매칭 실패 -> 대기열에 추가
      if (!waitingList.some((u) => u.userId === userId)) {
        waitingList.push({ userId, socketId: currentUserSocketId });
        this.waitingUsers.set(tag, waitingList);
        console.log(
          `- User ${currentUser.nickname} added to waiting queue for tag #${tag}. Queue size: ${waitingList.length}`,
        );
      } else {
        console.log(
          `- User ${currentUser.nickname} is already in the waiting queue for tag #${tag}.`,
        );
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
