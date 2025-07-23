import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import { connectSocket, sendMessage as sendSocketMessage } from "../api/socket";
import { useAuth } from "../contexts/AuthContext";

interface Message {
  id: number;
  sender: string;
  message: string;
  time: string;
  isMe: boolean;
  avatar?: string;
}

export default function ChatPage() {
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { user, chatRoomInfo, clearChatNotification } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  const userId = user?.id;

  // 채팅 상대 유저를 chatRoomInfo로부터 실시간 계산
  const opponent = chatRoomInfo?.users.find(u => u.userId !== userId);

  // 디버깅을 위한 로그
  console.log('=== ChatPage Debug Info ===');
  console.log('userId:', userId);
  console.log('chatRoomInfo:', chatRoomInfo);
  console.log('opponent:', opponent);
  console.log('chatRoomInfo exists:', !!chatRoomInfo);
  console.log('opponent exists:', !!opponent);
  console.log('Input should be enabled:', !!(chatRoomInfo && opponent));

  // 페이지 떠날 때 알림 제거
  useEffect(() => {
    return () => {
      clearChatNotification();
    };
  }, [clearChatNotification]);

  // 소켓 연결 및 이벤트 설정
  useEffect(() => {
    if (!userId) {
      navigate('/signin');
      return;
    }

    const newSocket = connectSocket(userId);
    setSocket(newSocket);

    // 상대방 메시지 수신
    const handleNewMessage = (data: { senderId: string; message: string; }) => {
      if (data.senderId !== userId) {
        const newMsg: Message = {
          id: Date.now(),
          sender: opponent?.nickname || '상대방',
          message: data.message,
          time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
          isMe: false,
          avatar: '🐱'
        };
        setMessages(prev => [...prev, newMsg]);
      }
    };

    newSocket.on('new_message', handleNewMessage);

    return () => {
      newSocket.off('new_message', handleNewMessage);
    };
  }, [userId, opponent, navigate]);

  // chatRoomInfo가 바뀔 때마다 시스템 메시지 초기화
  useEffect(() => {
    if (chatRoomInfo) {
      const systemMessage: Message = {
        id: Date.now(),
        sender: 'system',
        message: chatRoomInfo.message,
        time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        isMe: false,
      };
      setMessages([systemMessage]);
    }
  }, [chatRoomInfo]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() && socket && chatRoomInfo?.roomId) {
      const newMsg: Message = {
        id: Date.now(),
        sender: '나',
        message: newMessage,
        time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        isMe: true
      };
      setMessages(prev => [...prev, newMsg]);
      
      // 서버에 메시지 전송
      sendSocketMessage(chatRoomInfo.roomId, newMessage);
      setNewMessage('');
    } else {
      console.error("Socket not connected or not in a room.");
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc, #f1f5f9, #e2e8f0)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      
      {/* 배경 장식 요소들 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none'
      }}>
        <div style={{
          position: 'absolute',
          top: '80px',
          left: '40px',
          width: '120px',
          height: '120px',
          background: 'linear-gradient(135deg, #e2e8f0, #cbd5e1)',
          borderRadius: '50%',
          opacity: 0.3,
          animation: 'pulse 2s infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '80px',
          right: '80px',
          width: '90px',
          height: '90px',
          background: 'linear-gradient(135deg, #d1d5db, #9ca3af)',
          borderRadius: '50%',
          opacity: 0.4
        }}></div>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '80px',
          width: '60px',
          height: '60px',
          background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
          borderRadius: '50%',
          opacity: 0.35
        }}></div>
      </div>

      {/* 핸드폰 프레임 */}
      <div style={{
        width: '380px',
        height: '700px',
        background: 'linear-gradient(145deg, #1f2937, #374151)',
        borderRadius: '40px',
        padding: '8px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
        position: 'relative',
        zIndex: 10
      }}>
        
        {/* 핸드폰 노치 */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '120px',
          height: '25px',
          background: '#111827',
          borderRadius: '15px',
          zIndex: 20
        }}></div>

        {/* 핸드폰 스크린 */}
        <div style={{
          width: '100%',
          height: '100%',
          background: 'white',
          borderRadius: '32px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}>
          
          {/* 상태바 */}
          <div style={{
            height: '44px',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            paddingTop: '8px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#1f2937'
          }}>
            <span>9:41</span>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <div style={{ width: '18px', height: '10px', border: '1px solid #1f2937', borderRadius: '2px', position: 'relative' }}>
                <div style={{ width: '70%', height: '100%', background: '#1f2937', borderRadius: '1px' }}></div>
              </div>
              <span style={{ fontSize: '12px' }}>📶</span>
              <span style={{ fontSize: '12px' }}>📶</span>
            </div>
          </div>

          {/* 채팅 헤더 */}
          <div style={{
            background: 'linear-gradient(135deg, #1f2937, #4b5563)',
            padding: '16px 20px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button 
                onClick={() => navigate(-1)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '50%',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  color: 'white',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                }}
              >
                ←
              </button>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}>
                {'🐱'}
              </div>
              <div>
                <h3 style={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  margin: 0
                }}>{opponent?.nickname || '대화상대 찾는중...'}</h3>
                <p style={{
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '12px',
                  margin: 0
                }}>{opponent ? '온라인' : ''}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{
                width: '32px',
                height: '32px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
              }}
              >📞</button>
              <button style={{
                width: '32px',
                height: '32px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
              }}
              >⚙️</button>
            </div>
          </div>

          {/* 메시지 영역 */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            background: 'linear-gradient(to bottom, #f9fafb, #f3f4f6)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {messages.map((message, index) => {
              if (message.sender === 'system') {
                return (
                  <div key={message.id} style={{ textAlign: 'center', margin: '10px 0', fontSize: '12px', color: '#6b7280' }}>
                    {message.message}
                  </div>
                )
              }

              const showAvatar = !message.isMe && (index === 0 || messages[index - 1].isMe || messages[index - 1].sender !== message.sender);
              const showTime = index === messages.length - 1 || 
                              messages[index + 1].isMe !== message.isMe || 
                              messages[index + 1].sender !== message.sender;
              
              return (
                <div key={message.id} style={{
                  display: 'flex',
                  justifyContent: message.isMe ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-end',
                  gap: '8px'
                }}>
                  
                  {/* 상대방 아바타 */}
                  {!message.isMe && (
                    <div style={{ width: '28px', height: '28px', flexShrink: 0 }}>
                      {showAvatar && (
                        <div style={{
                          width: '28px',
                          height: '28px',
                          background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                        }}>
                          {message.avatar || '🐱'}
                        </div>
                      )}
                    </div>
                  )}

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: message.isMe ? 'flex-end' : 'flex-start',
                    maxWidth: '240px'
                  }}>
                    
                    {/* 발신자 이름 (상대방만) */}
                    {!message.isMe && showAvatar && (
                      <span style={{
                        fontSize: '11px',
                        color: '#6b7280',
                        marginBottom: '4px',
                        marginLeft: '8px',
                        fontWeight: '500'
                      }}>{message.sender}</span>
                    )}
                    
                    {/* 메시지 버블 */}
                    <div style={{
                      position: 'relative',
                      padding: '12px 16px',
                      borderRadius: '18px',
                      fontSize: '14px',
                      lineHeight: '1.4',
                      wordBreak: 'break-word',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      background: message.isMe 
                        ? 'linear-gradient(135deg, #1f2937, #374151)' 
                        : 'white',
                      color: message.isMe ? 'white' : '#1f2937',
                      border: message.isMe ? 'none' : '1px solid #e5e7eb',
                      borderBottomRightRadius: message.isMe ? '6px' : '18px',
                      borderBottomLeftRadius: message.isMe ? '18px' : '6px'
                    }}>
                      {message.message}
                    </div>
                    
                    {/* 시간 표시 */}
                    {showTime && (
                      <span style={{
                        fontSize: '10px',
                        color: '#9ca3af',
                        marginTop: '4px',
                        marginLeft: message.isMe ? '0' : '8px',
                        marginRight: message.isMe ? '8px' : '0'
                      }}>
                        {message.time}
                      </span>
                    )}
                  </div>

                  {/* 내 아바타 공간 (균형을 위해) */}
                  {message.isMe && <div style={{ width: '28px', height: '28px', flexShrink: 0 }}></div>}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* 메시지 입력 영역 */}
          <div style={{
            padding: '16px',
            background: 'white',
            borderTop: '1px solid #e5e7eb'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '8px'
            }}>
              <button style={{
                width: '36px',
                height: '36px',
                background: '#f3f4f6',
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                color: '#6b7280',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e5e7eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f3f4f6';
              }}
              >📎</button>
              
              <div style={{ flex: 1, position: 'relative' }}>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={chatRoomInfo && opponent ? "메시지를 입력하세요..." : "매칭 대기 중입니다..."}
                    disabled={!chatRoomInfo || !opponent}
                    style={{
                      width: '100%',
                    padding: '12px 16px',
                    background: (!chatRoomInfo || !opponent) ? '#f3f4f6' : '#f9fafb',
                    border: '1px solid #d1d5db',
                    borderRadius: '20px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    opacity: (!chatRoomInfo || !opponent) ? 0.6 : 1
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#6b7280';
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(107, 114, 128, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.background = '#f9fafb';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>
              
              <button style={{
                width: '36px',
                height: '36px',
                background: '#f3f4f6',
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                color: '#6b7280',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e5e7eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f3f4f6';
              }}
              >😊</button>
              
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || !chatRoomInfo || !opponent}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: 'none',
                  cursor: (newMessage.trim() && chatRoomInfo && opponent) ? 'pointer' : 'not-allowed',
                  fontSize: '16px',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  background: (newMessage.trim() && chatRoomInfo && opponent)
                    ? 'linear-gradient(135deg, #1f2937, #374151)' 
                    : '#9ca3af',
                  boxShadow: (newMessage.trim() && chatRoomInfo && opponent) ? '0 4px 12px rgba(31, 41, 55, 0.3)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (newMessage.trim() && chatRoomInfo && opponent) {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #111827, #1f2937)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (newMessage.trim() && chatRoomInfo && opponent) {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #1f2937, #374151)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
              >
                ➤
              </button>
            </div>
          </div>

          {/* 홈 인디케이터 */}
          <div style={{
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '120px',
              height: '4px',
              background: '#d1d5db',
              borderRadius: '2px'
            }}></div>
          </div>
        </div>
      </div>

      {/* 고양이 GIF 장식 */}
      <div style={{
        position: 'absolute',
        bottom: '40px',
        right: '40px',
        zIndex: 5
      }}>
        <img 
          src="/assets/cat.gif" 
          alt="Cat" 
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            border: '3px solid rgba(255,255,255,0.8)',
            objectFit: 'cover',
            opacity: 0.8
          }}
        />
      </div>

      {/* 하단 브랜딩 */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        zIndex: 10
      }}>
        <p style={{ 
          fontSize: '14px', 
          color: '#9ca3af', 
          fontWeight: '500',
          margin: 0
        }}>failly 채팅</p>
      </div>

      {/* CSS 애니메이션 */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
