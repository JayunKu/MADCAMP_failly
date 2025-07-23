import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ChatRoom {
  id: number;
  name: string;
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
  avatar: string;
  isActive: boolean;
  timeLeft: number; // 남은 시간 (초 단위)
  category: string;
}

export default function ChatPage() {
  const navigate = useNavigate();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([
    {
      id: 1,
      name: "지각 실패 모임",
      lastMessage: "오늘도 또 늦었어요 ㅠㅠ",
      lastTime: "방금 전",
      unreadCount: 3,
      avatar: "⏰",
      isActive: true,
      timeLeft: 86400, // 24시간
      category: "지각"
    },
    {
      id: 2,
      name: "다이어트 포기 클럽",
      lastMessage: "치킨 먹고 싶다...",
      lastTime: "5분 전",
      unreadCount: 7,
      avatar: "🍗",
      isActive: true,
      timeLeft: 82800, // 23시간
      category: "다이어트"
    },
    {
      id: 3,
      name: "시험 망한 사람들",
      lastMessage: "다음엔 잘할 수 있을 거야!",
      lastTime: "12분 전",
      unreadCount: 0,
      avatar: "📚",
      isActive: true,
      timeLeft: 75600, // 21시간
      category: "시험"
    },
    {
      id: 4,
      name: "미룸의 달인들",
      lastMessage: "내일부터 진짜 할게요...",
      lastTime: "1시간 전",
      unreadCount: 12,
      avatar: "📅",
      isActive: true,
      timeLeft: 43200, // 12시간
      category: "미룸"
    },
    {
      id: 5,
      name: "소개팅 실패담",
      lastMessage: "다음엔 더 잘할 수 있을 거예요",
      lastTime: "3시간 전",
      unreadCount: 0,
      avatar: "💔",
      isActive: true,
      timeLeft: 21600, // 6시간
      category: "소개팅"
    },
    {
      id: 6,
      name: "늦잠 자는 사람들",
      lastMessage: "알람을 10개 맞춰도...",
      lastTime: "5시간 전",
      unreadCount: 2,
      avatar: "😴",
      isActive: true,
      timeLeft: 7200, // 2시간
      category: "늦잠"
    }
  ]);

  // 시간 포맷 함수
  const formatTimeLeft = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}시간 ${minutes}분`;
    } else if (minutes > 0) {
      return `${minutes}분`;
    } else {
      return `${seconds}초`;
    }
  };

  // 타이머 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setChatRooms(prev => 
        prev.map(room => ({
          ...room,
          timeLeft: Math.max(0, room.timeLeft - 1),
          isActive: room.timeLeft > 1
        })).filter(room => room.timeLeft > 0) // 시간이 다 된 방은 제거
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 진행률 계산 (24시간 기준)
  const getProgressPercentage = (timeLeft: number) => {
    return (timeLeft / 86400) * 100;
  };

  // 진행률에 따른 색상
  const getProgressColor = (percentage: number) => {
    if (percentage > 50) return '#22c55e'; // 초록
    if (percentage > 25) return '#f59e0b'; // 주황
    return '#ef4444'; // 빨강
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc, #f1f5f9, #e2e8f0)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      
      {/* 상단 헤더 */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: '1024px',
          margin: '0 auto',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              onClick={() => navigate(-1)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                background: '#f3f4f6',
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
                fontSize: '18px',
                color: '#6b7280',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e5e7eb';
                e.currentTarget.style.color = '#1f2937';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f3f4f6';
                e.currentTarget.style.color = '#6b7280';
              }}
            >
              ←
            </button>
            <div>
              <h1 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #1f2937, #4b5563, #6b7280)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                margin: 0
              }}>
                채팅방 목록
              </h1>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: 0
              }}>
                24시간 후 자동으로 사라지는 채팅방
              </p>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#f3f4f6',
            borderRadius: '12px',
            padding: '8px 12px'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              background: '#22c55e',
              borderRadius: '50%',
              animation: 'pulse 2s infinite'
            }}></div>
            <span style={{
              fontSize: '12px',
              fontWeight: '600',
              color: '#374151'
            }}>
              {chatRooms.length}개 활성 채팅방
            </span>
          </div>
        </div>
      </div>

      {/* 채팅방 목록 */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '24px 16px'
      }}>
        {chatRooms.length > 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {chatRooms.map(room => {
              const progressPercentage = getProgressPercentage(room.timeLeft);
              const progressColor = getProgressColor(progressPercentage);
              
              return (
                <div
                  key={room.id}
                  style={{
                    background: 'white',
                    borderRadius: '20px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                    border: '1px solid #f1f5f9',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.12)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = '#f1f5f9';
                  }}
                  onClick={() => {
                    // 개별 채팅방으로 이동하는 로직 (나중에 구현)
                    console.log(`채팅방 ${room.name} 입장`);
                  }}
                >
                  {/* 시간 진행률 바 */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '4px',
                    width: `${progressPercentage}%`,
                    background: `linear-gradient(90deg, ${progressColor}, ${progressColor}dd)`,
                    transition: 'all 1s ease',
                    borderRadius: '0 0 4px 0'
                  }}></div>

                  <div style={{
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                  }}>
                    {/* 아바타 */}
                    <div style={{
                      width: '60px',
                      height: '60px',
                      background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      position: 'relative'
                    }}>
                      {room.avatar}
                      {room.isActive && (
                        <div style={{
                          position: 'absolute',
                          bottom: '2px',
                          right: '2px',
                          width: '16px',
                          height: '16px',
                          background: '#22c55e',
                          borderRadius: '50%',
                          border: '2px solid white',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}></div>
                      )}
                    </div>

                    {/* 채팅방 정보 */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '4px'
                      }}>
                        <h3 style={{
                          fontSize: '18px',
                          fontWeight: '700',
                          color: '#1f2937',
                          margin: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {room.name}
                        </h3>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          {room.unreadCount > 0 && (
                            <div style={{
                              background: '#ef4444',
                              color: 'white',
                              borderRadius: '12px',
                              padding: '2px 8px',
                              fontSize: '12px',
                              fontWeight: '700',
                              minWidth: '20px',
                              textAlign: 'center'
                            }}>
                              {room.unreadCount > 99 ? '99+' : room.unreadCount}
                            </div>
                          )}
                          <span style={{
                            fontSize: '12px',
                            color: '#9ca3af',
                            fontWeight: '500'
                          }}>
                            {room.lastTime}
                          </span>
                        </div>
                      </div>

                      <p style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        margin: '0 0 8px 0',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {room.lastMessage}
                      </p>

                      {/* 카테고리와 남은 시간 */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <div style={{
                          display: 'inline-block',
                          background: '#f3f4f6',
                          color: '#6b7280',
                          borderRadius: '8px',
                          padding: '4px 8px',
                          fontSize: '11px',
                          fontWeight: '600'
                        }}>
                          #{room.category}
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <div style={{
                            width: '6px',
                            height: '6px',
                            background: progressColor,
                            borderRadius: '50%',
                            animation: progressPercentage < 25 ? 'pulse 1s infinite' : 'none'
                          }}></div>
                          <span style={{
                            fontSize: '12px',
                            fontWeight: '600',
                            color: progressColor
                          }}>
                            {formatTimeLeft(room.timeLeft)} 남음
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* 빈 상태 */
          <div style={{
            textAlign: 'center',
            padding: '80px 0'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '32px'
            }}>
              <div style={{
                width: '120px',
                height: '120px',
                background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '3px solid #e2e8f0',
                boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                fontSize: '48px'
              }}>
                💬
              </div>
            </div>
            
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '12px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
            }}>
              활성 채팅방이 없습니다
            </h3>
            <p style={{
              fontSize: '16px',
              color: '#9ca3af',
              marginBottom: '32px',
              fontWeight: '500'
            }}>
              실패 게시물을 작성하면 자동으로 채팅방이 생성됩니다
            </p>
            <button
              onClick={() => navigate('/explore')}
              style={{
                padding: '12px 24px',
                background: '#1f2937',
                color: 'white',
                borderRadius: '16px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(31, 41, 55, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#111827';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(31, 41, 55, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#1f2937';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(31, 41, 55, 0.3)';
              }}
            >
              탐색 페이지로 이동
            </button>
          </div>
        )}
      </div>

      {/* 하단 설명 */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '0 16px 40px',
        textAlign: 'center'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
        }}>
          <h4 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#374151',
            margin: '0 0 8px 0'
          }}>
            💡 채팅방 안내
          </h4>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            margin: 0,
            lineHeight: '1.5'
          }}>
            각 채팅방은 생성 후 24시간 동안만 유지됩니다. 시간이 지나면 자동으로 사라져요!<br/>
            같은 실패를 경험한 사람들과 서로 위로하고 격려해보세요. 🤗
          </p>
        </div>
      </div>

      {/* CSS 애니메이션 */}
      <style>{`
        @keyframes pulse {
          0%, 100% { 
            opacity: 1;
            transform: scale(1);
          }
          50% { 
            opacity: 0.5;
            transform: scale(0.95);
          }
        }
      `}</style>
    </div>
  );
}
