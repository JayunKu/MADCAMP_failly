import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Socket } from 'socket.io-client';
import { connectSocket, disconnectSocket } from '../api/socket';

interface User {
  id: string;
  nickname: string;
  email?: string;
}

// 매칭된 채팅방 정보를 위한 타입 정의
interface MatchUser {
  userId: string;
  nickname: string;
}

interface ChatRoomInfo {
  roomId: string;
  users: MatchUser[];
  message: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  hasNewMessage: boolean;
  chatRoomInfo: ChatRoomInfo | null; // 채팅방 정보 상태 추가
  clearChatNotification: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [chatRoomInfo, setChatRoomInfo] = useState<ChatRoomInfo | null>(null); // 채팅방 정보 상태

  // 소켓 연결 및 이벤트 리스너 설정
  useEffect(() => {
    if (user?.id) {
      console.log(`[AuthContext] 🔌 1. User logged in (${user.nickname}). Setting up socket...`);
      const socket = connectSocket(user.id);

      const handleConnect = () => {
        console.log(`[AuthContext] 🔌 2. Socket connected with id: ${socket.id}`);
      };

      const handleDisconnect = (reason: string) => {
        console.log(`[AuthContext] 🔌 Socket disconnected: ${reason}`);
      };
      
      const handleMatched = (data: ChatRoomInfo) => {
        console.log('%c[AuthContext] ✨ Matched event received!', 'color: #28a745; font-weight: bold;', data);
        console.log('[AuthContext] 📊 Current chatRoomInfo before update:', chatRoomInfo);
        console.log('[AuthContext] 📊 Received data structure:', {
          roomId: data.roomId,
          users: data.users,
          message: data.message,
          usersCount: data.users?.length
        });
        
        // 이미 채팅방이 있는 경우, 새로운 매칭 무시
        if (!chatRoomInfo) {
          console.log('[AuthContext] 🚀 Setting new chat room info.');
          setChatRoomInfo(data);
          console.log('[AuthContext] ✅ Chat room info updated successfully');
        } else {
          console.log('[AuthContext] ⚠️ Already in a chat room. Ignoring new match.');
        }
      };

      // 기존 리스너 제거 (중복 방지)
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('matched', handleMatched);

      // 새 리스너 부착
      socket.on('connect', handleConnect);
      socket.on('disconnect', handleDisconnect);
      socket.on('matched', handleMatched);
      console.log("[AuthContext] 🔌 3. Listeners for 'connect', 'disconnect', and 'matched' attached.");
      console.log("[AuthContext] 🔌 4. Socket instance:", socket);
      console.log("[AuthContext] 🔌 5. Socket connected:", socket.connected);
      console.log("[AuthContext] 🔌 6. Socket ID:", socket.id);

      return () => {
        console.log(`[AuthContext] 🧹 Cleaning up listeners for user ${user.id}`);
        socket.off('connect', handleConnect);
        socket.off('disconnect', handleDisconnect);
        socket.off('matched', handleMatched);
      };
    } else {
      console.log("[AuthContext] 😴 No user. Skipping socket setup.");
    }
  }, [user, chatRoomInfo]); // chatRoomInfo를 의존성 배열에 추가

  // 컴포넌트 마운트 시 localStorage에서 사용자 정보 복원
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userEmail = localStorage.getItem('userEmail');
    
    if (savedUser && isLoggedIn === 'true') {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
      }
    } else if (isLoggedIn === 'true' && userEmail) {
      // savedUser가 없지만 로그인 상태가 true인 경우, 기본 사용자 정보 생성
      const defaultUser = {
        id: userEmail,
        nickname: userEmail.split('@')[0],
        email: userEmail
      };
      setUser(defaultUser);
      localStorage.setItem('user', JSON.stringify(defaultUser));
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    disconnectSocket(); // 로그아웃 시 소켓 연결 해제
    setUser(null);
    setChatRoomInfo(null); // 로그아웃 시 채팅 정보 초기화
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('token'); // JWT 토큰도 제거 (혹시 있을 경우)
  };

  const clearChatNotification = () => {
    setChatRoomInfo(null);
  };

  const isAuthenticated = user !== null;
  const hasNewMessage = chatRoomInfo !== null; // chatRoomInfo 존재 여부로 알림 상태 결정

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated,
    hasNewMessage,
    chatRoomInfo, // 외부에 제공
    clearChatNotification,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
