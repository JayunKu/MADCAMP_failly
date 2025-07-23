import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';
let socket: Socket;

/**
 * 웹소켓 서버에 연결하고, 연결된 소켓 인스턴스를 반환합니다.
 * 이미 연결된 경우 기존 인스턴스를 반환합니다.
 * @param userId - 서버에 등록할 사용자의 ID
 * @returns {Socket} 연결된 소켓 인스턴스
 */
export const connectSocket = (userId: string): Socket => {
  if (socket) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    transports: ['websocket'], // WebSocket을 우선적으로 사용하도록 설정
  });

  socket.on('connect', () => {
    console.log(`Socket connected: ${socket.id}`);
    // 연결 성공 시, 서버에 사용자 등록
    socket.emit('register_user', { userId });
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  return socket;
};

/**
 * 특정 채팅방에 메시지를 전송합니다.
 * @param roomId - 메시지를 보낼 방의 ID
 * @param message - 전송할 메시지 내용
 */
export const sendMessage = (roomId: string, message: string) => {
  if (socket) {
    socket.emit('send_message', { roomId, message });
  } else {
    console.error('Socket is not connected.');
  }
};
