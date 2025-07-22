import { useState, useRef, useEffect } from "react";
import AppLayout from "../components/AppLayout";

interface Message {
  id: number;
  sender: string;
  message: string;
  time: string;
  isMe: boolean;
  avatar?: string;
  colorTheme?: string;
}

export default function ChatPage() {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      sender: '냥이친구', 
      message: '안녕하세요! 🐱', 
      time: '오후 3:20', 
      isMe: false,
      avatar: '🐱',
      colorTheme: 'pink'
    },
    { 
      id: 2, 
      sender: '나', 
      message: '안녕! 잘 지내?', 
      time: '오후 3:21', 
      isMe: true,
      colorTheme: 'blue'
    },
    { 
      id: 3, 
      sender: '냥이친구', 
      message: '오늘 날씨 정말 좋다냥~ ☀️', 
      time: '오후 3:22', 
      isMe: false,
      avatar: '🐱',
      colorTheme: 'green'
    },
    { 
      id: 4, 
      sender: '냥이친구', 
      message: '같이 놀자냥! 🐾✨', 
      time: '오후 3:24', 
      isMe: false,
      avatar: '🐱',
      colorTheme: 'purple'
    },
    { 
      id: 5, 
      sender: '나', 
      message: '좋아! 어디서 만날까?', 
      time: '오후 3:25', 
      isMe: true,
      colorTheme: 'orange'
    },
    { 
      id: 6, 
      sender: '냥이친구', 
      message: '공원에서 만나자냥! 🌳', 
      time: '오후 3:26', 
      isMe: false,
      avatar: '🐱',
      colorTheme: 'teal'
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const now = new Date();
      const currentTime = now.getHours() > 12 
        ? `오후 ${now.getHours() - 12}:${now.getMinutes().toString().padStart(2, '0')}` 
        : `오전 ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      const colorThemes = ['pink', 'blue', 'green', 'purple', 'orange', 'teal'];
      const randomTheme = colorThemes[Math.floor(Math.random() * colorThemes.length)];
      
      const newMsg: Message = {
        id: Date.now(),
        sender: '나',
        message: newMessage,
        time: currentTime,
        isMe: true,
        colorTheme: randomTheme
      };

      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');
    }
  };

  const formatTime = (timeStr: string) => {
    return timeStr;
  };

  const getColorTheme = (theme: string, isMe: boolean) => {
    const themes = {
      pink: {
        bubble: isMe ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white' : 'bg-gradient-to-r from-pink-100 to-rose-100 text-gray-800 border border-pink-200',
        tail: isMe ? 'bg-rose-400' : 'bg-rose-100 border-l border-b border-pink-200',
        avatar: 'bg-gradient-to-br from-pink-400 to-rose-500'
      },
      blue: {
        bubble: isMe ? 'bg-gradient-to-r from-blue-400 to-indigo-400 text-white' : 'bg-gradient-to-r from-blue-100 to-indigo-100 text-gray-800 border border-blue-200',
        tail: isMe ? 'bg-indigo-400' : 'bg-indigo-100 border-l border-b border-blue-200',
        avatar: 'bg-gradient-to-br from-blue-400 to-indigo-500'
      },
      green: {
        bubble: isMe ? 'bg-gradient-to-r from-green-400 to-emerald-400 text-white' : 'bg-gradient-to-r from-green-100 to-emerald-100 text-gray-800 border border-green-200',
        tail: isMe ? 'bg-emerald-400' : 'bg-emerald-100 border-l border-b border-green-200',
        avatar: 'bg-gradient-to-br from-green-400 to-emerald-500'
      },
      purple: {
        bubble: isMe ? 'bg-gradient-to-r from-purple-400 to-violet-400 text-white' : 'bg-gradient-to-r from-purple-100 to-violet-100 text-gray-800 border border-purple-200',
        tail: isMe ? 'bg-violet-400' : 'bg-violet-100 border-l border-b border-purple-200',
        avatar: 'bg-gradient-to-br from-purple-400 to-violet-500'
      },
      orange: {
        bubble: isMe ? 'bg-gradient-to-r from-orange-400 to-amber-400 text-white' : 'bg-gradient-to-r from-orange-100 to-amber-100 text-gray-800 border border-orange-200',
        tail: isMe ? 'bg-amber-400' : 'bg-amber-100 border-l border-b border-orange-200',
        avatar: 'bg-gradient-to-br from-orange-400 to-amber-500'
      },
      teal: {
        bubble: isMe ? 'bg-gradient-to-r from-teal-400 to-cyan-400 text-white' : 'bg-gradient-to-r from-teal-100 to-cyan-100 text-gray-800 border border-teal-200',
        tail: isMe ? 'bg-cyan-400' : 'bg-cyan-100 border-l border-b border-teal-200',
        avatar: 'bg-gradient-to-br from-teal-400 to-cyan-500'
      }
    };

    return themes[theme as keyof typeof themes] || themes.blue;
  };

  return (
    <AppLayout showSidebar={false}>
      <div className="flex h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50">
        {/* 메인 채팅 컨테이너 */}
        <div className="flex-1 flex flex-col max-w-4xl mx-auto bg-white shadow-2xl rounded-t-3xl overflow-hidden">
          
          {/* 채팅방 헤더 */}
          <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-md">
                    🐱
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h1 className="text-white font-bold text-lg">냥이친구</h1>
                  <p className="text-white/80 text-sm">온라인</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                  📞
                </button>
                <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                  📹
                </button>
                <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                  ⚙️
                </button>
              </div>
            </div>
          </div>

          {/* 메시지 영역 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-blue-50/30 to-purple-50/30">
            {messages.map((message, index) => {
              const showAvatar = !message.isMe && (index === 0 || messages[index - 1].isMe || messages[index - 1].sender !== message.sender);
              const showTime = index === messages.length - 1 || 
                              messages[index + 1].isMe !== message.isMe || 
                              messages[index + 1].sender !== message.sender;
              
              const colorTheme = getColorTheme(message.colorTheme || 'blue', message.isMe);
              
              return (
                <div key={message.id} className={`flex ${message.isMe ? 'justify-end' : 'justify-start'} items-end space-x-2 chat-bubble-enter`}>
                  {/* 상대방 아바타 */}
                  {!message.isMe && (
                    <div className="w-8 h-8 flex-shrink-0">
                      {showAvatar && (
                        <div className={`w-8 h-8 ${colorTheme.avatar} rounded-full flex items-center justify-center text-sm shadow-md transform hover:scale-110 transition-transform duration-200`}>
                          {message.avatar || '🐱'}
                        </div>
                      )}
                    </div>
                  )}

                  <div className={`flex flex-col ${message.isMe ? 'items-end' : 'items-start'} max-w-xs lg:max-w-md`}>
                    {/* 발신자 이름 (상대방만) */}
                    {!message.isMe && showAvatar && (
                      <span className="text-xs text-gray-500 mb-1 ml-2 font-medium">{message.sender}</span>
                    )}
                    
                    {/* 메시지 버블 */}
                    <div className={`relative px-4 py-3 rounded-2xl shadow-lg transform hover:scale-[1.02] transition-all duration-200 ${
                      message.isMe ? 'rounded-br-md' : 'rounded-bl-md'
                    } ${colorTheme.bubble}`}>
                      <p className="text-sm leading-relaxed break-words font-medium">{message.message}</p>
                      
                      {/* 말풍선 꼬리 */}
                      <div className={`absolute bottom-0 w-3 h-3 ${
                        message.isMe 
                          ? `right-0 ${colorTheme.tail} transform translate-x-1 translate-y-1` 
                          : `left-0 ${colorTheme.tail} transform -translate-x-1 translate-y-1`
                      }`} 
                      style={{
                        clipPath: message.isMe 
                          ? 'polygon(0 0, 100% 0, 0 100%)' 
                          : 'polygon(100% 0, 100% 100%, 0 0)'
                      }}></div>
                    </div>
                    
                    {/* 시간 표시 */}
                    {showTime && (
                      <span className={`text-xs text-gray-400 mt-1 ${message.isMe ? 'mr-2' : 'ml-2'} font-medium`}>
                        {formatTime(message.time)}
                      </span>
                    )}
                  </div>

                  {/* 내 아바타 공간 (균형을 위해) */}
                  {message.isMe && <div className="w-8 h-8 flex-shrink-0"></div>}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* 메시지 입력 영역 */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex items-end space-x-3">
              <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
                📎
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="메시지를 입력하세요..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm resize-none"
                />
              </div>
              <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
                😊
              </button>
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-all ${
                  newMessage.trim() 
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 shadow-md' 
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                ➤
              </button>
            </div>
          </div>
        </div>

        {/* 배경 장식 요소들 */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {/* 떠다니는 고양이 발자국들 */}
          <div className="absolute top-20 left-10 text-2xl opacity-20 animate-bounce" style={{ animationDelay: '0s', animationDuration: '4s' }}>
            🐾
          </div>
          <div className="absolute top-40 right-20 text-xl opacity-15 animate-pulse" style={{ animationDelay: '2s', animationDuration: '3s' }}>
            🐾
          </div>
          <div className="absolute bottom-32 left-16 text-lg opacity-25 animate-bounce" style={{ animationDelay: '1s', animationDuration: '5s' }}>
            🐾
          </div>
          <div className="absolute bottom-20 right-32 text-2xl opacity-20" style={{ animation: 'float 6s ease-in-out infinite', animationDelay: '3s' }}>
            🐾
          </div>
          
          {/* 하트 모양들 */}
          <div className="absolute top-32 left-1/4 text-pink-300 opacity-30 animate-pulse" style={{ animationDelay: '1.5s' }}>
            💕
          </div>
          <div className="absolute bottom-40 right-1/4 text-yellow-300 opacity-25" style={{ animation: 'float 4s ease-in-out infinite', animationDelay: '2.5s' }}>
            ✨
          </div>
        </div>
      </div>

      {/* 애니메이션 스타일 */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        
        .chat-bubble-enter {
          animation: bubbleIn 0.3s ease-out;
        }
        
        @keyframes bubbleIn {
          0% { opacity: 0; transform: scale(0.8) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </AppLayout>
  );
}
