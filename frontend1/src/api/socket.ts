import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';
let socket: Socket | null = null;

/**
 * 웹소켓 서버에 연결하고, 연결된 소켓 인스턴스를 반환합니다.
 * 이미 연결되어 있다면 기존 인스턴스를 반환합니다.
 * @param userId - 서버에 등록할 사용자의 ID
 * @returns {Socket} 연결된 소켓 인스턴스
 */
export const connectSocket = (userId: string): Socket => {
  if (socket && socket.connected) {
    return socket;
  }

  // 이전 소켓이 있다면 정리
  if (socket) {
    socket.disconnect();
  }

  socket = io(SOCKET_URL, {
    transports: ['websocket'], // WebSocket을 우선적으로 사용하도록 설정
    reconnection: true,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log(`[SocketAPI] ✅ Socket connected: ${socket?.id}. Registering user: ${userId}`);
    // 연결 성공 시, 서버에 사용자 등록
    if (socket) {
      socket.emit('register_user', { userId });
    }
  });

  socket.on('disconnect', (reason) => {
    console.log(`[SocketAPI] ❌ Socket disconnected: ${reason}`);
    // 서버 측에서 연결을 끊은게 아니라면, 소켓 인스턴스 정리
    if (reason !== 'io server disconnect') {
      socket = null;
    }
  });

  return socket;
};

/**
 * 소켓 연결을 명시적으로 종료합니다.
 */
export const disconnectSocket = () => {
  if (socket) {
    console.log('Disconnecting socket explicitly.');
    socket.disconnect();
    socket = null;
  }
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
