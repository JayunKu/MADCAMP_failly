import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserInfo } from "../api/users";
import { useAuth } from "../contexts/AuthContext";

export default function MyPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [guestbook, setGuestbook] = useState([
    { id: 1, author: '냥이친구', message: '프로필 너무 귀여워요! 🐱', time: '2시간 전' },
    { id: 2, author: '실패왕', message: '같이 실패 공유해요~', time: '1일 전' },
    { id: 3, author: '익명', message: '화이팅! 응원합니다 ✨', time: '3일 전' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [showBadges, setShowBadges] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<any>(null);
  const [placedBadges, setPlacedBadges] = useState<Array<{
    badge: any;
    x: number;
    y: number;
    id: string;
  }>>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // 사용자 정보 로드
  useEffect(() => {
    const loadUserInfo = async () => {
      if (!isAuthenticated || !user?.id) {
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const userData = await getUserInfo(user.id);
        setUserInfo(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : '사용자 정보를 불러오는데 실패했습니다.');
        console.error('Failed to load user info:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUserInfo();
  }, [isAuthenticated, user?.id]);

  const addGuestbookEntry = () => {
    if (newMessage.trim()) {
      setGuestbook([
        { id: Date.now(), author: '익명', message: newMessage, time: '방금 전' },
        ...guestbook
      ]);
      setNewMessage('');
    }
  };

  // 배지 선택 핸들러
  const handleBadgeSelect = (badge: any) => {
    setSelectedBadge(badge);
  };

  // 드래그 시작
  const handleDragStart = (e: React.MouseEvent, badge: any) => {
    e.preventDefault();
    setSelectedBadge(badge);
    setIsDragging(true);
    
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // 드래그 중
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && selectedBadge) {
      // 마우스 커서를 따라다니는 배지 표시 (실제 구현에서는 포인터 이벤트 사용)
    }
  };

  // 드롭 핸들러
  const handleDrop = (e: React.MouseEvent) => {
    if (isDragging && selectedBadge) {
      const centerArea = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - centerArea.left - dragOffset.x) / centerArea.width) * 100;
      const y = ((e.clientY - centerArea.top - dragOffset.y) / centerArea.height) * 100;
      
      // 경계 체크
      if (x >= 0 && x <= 95 && y >= 0 && y <= 95) {
        const newPlacedBadge = {
          badge: selectedBadge,
          x: Math.max(0, Math.min(95, x)),
          y: Math.max(0, Math.min(95, y)),
          id: `${selectedBadge.badge_name}-${Date.now()}`
        };
        
        setPlacedBadges(prev => [...prev, newPlacedBadge]);
      }
      
      setIsDragging(false);
      setSelectedBadge(null);
    }
  };

  // 배치된 배지 제거
  const removePlacedBadge = (id: string) => {
    setPlacedBadges(prev => prev.filter(badge => badge.id !== id));
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc, #f1f5f9, #e2e8f0)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative',
      overflow: 'hidden'
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
          maxWidth: '1200px',
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
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #1f2937, #4b5563, #6b7280)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              마이페이지
            </h1>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '8px 16px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.6)'
          }}>
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937' }}>failly</span>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '32px 16px',
        display: 'grid',
        gridTemplateColumns: showBadges ? '280px 1fr 320px' : '280px 1fr 80px',
        gap: '24px',
        transition: 'grid-template-columns 0.3s ease',
        minHeight: 'calc(100vh - 120px)'
      }}>
        
        {/* 왼쪽 메뉴 영역 */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          
          {/* 내 프로필 */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: 'linear-gradient(135deg, #1f2937, #4b5563)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '20px',
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(31, 41, 55, 0.3)'
              }}>
                😊
              </div>
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  margin: 0
                }}>내 프로필</h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: 0
                }}>프로필을 관리해요</p>
              </div>
            </div>
            
            <div style={{
              background: '#f9fafb',
              borderRadius: '12px',
              padding: '16px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '12px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#1f2937'
                  }}>12</div>
                  <div style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    fontWeight: '500'
                  }}>획득 배지</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#1f2937'
                  }}>48</div>
                  <div style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    fontWeight: '500'
                  }}>방문자 수</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#1f2937'
                  }}>156</div>
                  <div style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    fontWeight: '500'
                  }}>실패 공유</div>
                </div>
              </div>
            </div>
          </div>

          {/* 서랍룸 방문룩 */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: 'linear-gradient(135deg, #059669, #10b981)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '20px',
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(5, 150, 105, 0.3)'
              }}>
              📝
              </div>
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  margin: 0
                }}>서랍룸 방문룩</h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: 0
                }}>친구들의 방문록을 확인해요</p>
              </div>
            </div>
            
            {/* 방문록 작성 */}
            <div style={{
              background: '#f0fdf4',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '16px'
            }}>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="방문록을 남겨주세요..."
                style={{
                  width: '100%',
                  height: '80px',
                  padding: '12px',
                  background: 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  resize: 'none',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#10b981';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <button
                onClick={addGuestbookEntry}
                style={{
                  marginTop: '8px',
                  padding: '8px 16px',
                  background: '#10b981',
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#059669';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#10b981';
                }}
              >
                작성하기
              </button>
            </div>
            
            {/* 최근 방문록 미리보기 */}
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '8px',
              fontWeight: '600'
            }}>최근 방문록</div>
            <div style={{
              maxHeight: '120px',
              overflowY: 'auto'
            }}>
              {guestbook.slice(0, 2).map(entry => (
                <div key={entry.id} style={{
                  background: '#f9fafb',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '8px',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '4px'
                  }}>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#1f2937'
                    }}>{entry.author}</span>
                    <span style={{
                      fontSize: '10px',
                      color: '#9ca3af'
                    }}>{entry.time}</span>
                  </div>
                  <p style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    margin: 0,
                    lineHeight: '1.4'
                  }}>{entry.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 내가 획득한 상세룩 */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '20px',
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3)'
              }}>
                ✨
              </div>
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  margin: 0
                }}>내가 획득한 상세룩</h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: 0
                }}>나만의 특별한 컬렉션</p>
              </div>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px'
            }}>
              {[1,2,3,4,5,6].map(i => (
                <div key={i} style={{
                  aspectRatio: '1',
                  background: '#f3f4f6',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: '1px solid #e5e7eb'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#e5e7eb';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f3f4f6';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                >
                  {i <= 3 ? '🏆' : '🔒'}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 중앙 꾸밀 수 있는 공간 */}
        <div 
          style={{
            background: 'white',
            borderRadius: '20px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            border: isDragging ? '3px dashed #0ea5e9' : '1px solid #e5e7eb',
            overflow: 'hidden',
            position: 'relative',
            transition: 'all 0.2s ease',
            cursor: isDragging ? 'copy' : 'default'
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <img 
            src="/assets/background.png" 
            alt="Background" 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
          
          {/* 드래그 중일 때 오버레이 */}
          {isDragging && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(14, 165, 233, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '16px',
                padding: '20px',
                textAlign: 'center',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎯</div>
                <p style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#0ea5e9',
                  margin: 0
                }}>여기에 배지를 놓아주세요!</p>
              </div>
            </div>
          )}

          {/* 배치된 배지들 */}
          {placedBadges.map((placedBadge) => (
            <div
              key={placedBadge.id}
              className="placed-badge"
              style={{
                position: 'absolute',
                left: `${placedBadge.x}%`,
                top: `${placedBadge.y}%`,
                width: '60px',
                height: '60px',
                zIndex: 5,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onClick={() => removePlacedBadge(placedBadge.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.zIndex = '6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.zIndex = '5';
              }}
            >
              <div style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(245, 158, 11, 0.4)',
                border: '3px solid white',
                overflow: 'hidden',
                position: 'relative'
              }}>
                {placedBadge.badge.badge_image_url ? (
                  <img 
                    src={placedBadge.badge.badge_image_url} 
                    alt={placedBadge.badge.badge_name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <span style={{ fontSize: '24px' }}>🏆</span>
                )}
                
                {/* 제거 버튼 (호버 시 표시) */}
                <div style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  width: '20px',
                  height: '20px',
                  background: '#dc2626',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  opacity: 0,
                  transition: 'opacity 0.2s ease',
                  cursor: 'pointer'
                }}
                className="remove-btn"
                >
                  ×
                </div>
              </div>
              
              {/* 배지 이름 툴팁 */}
              <div style={{
                position: 'absolute',
                bottom: '-30px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '10px',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                opacity: 0,
                transition: 'opacity 0.2s ease',
                pointerEvents: 'none'
              }}
              className="badge-tooltip"
              >
                {placedBadge.badge.badge_name}
              </div>
            </div>
          ))}

          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '12px 16px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            <p style={{
              fontSize: '14px',
              color: '#1f2937',
              fontWeight: '600',
              margin: 0
            }}>나만의 특별한 공간 ✨</p>
            {placedBadges.length > 0 && (
              <p style={{
                fontSize: '12px',
                color: '#6b7280',
                margin: '4px 0 0 0'
              }}>배지 {placedBadges.length}개 배치됨</p>
            )}
          </div>

          {/* 안내 메시지 (배지가 없을 때) */}
          {placedBadges.length === 0 && !isDragging && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎨</div>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: 0,
                fontWeight: '500'
              }}>오른쪽에서 배지를 선택하고<br/>여기로 드래그해서 꾸며보세요!</p>
            </div>
          )}
        </div>

        {/* 오른쪽 영역 */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: showBadges ? 'stretch' : 'center',
          paddingTop: '20px',
          overflow: 'hidden'
        }}>
          {/* 원형 버튼 */}
          <button
            onClick={() => setShowBadges(!showBadges)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '60px',
              height: '60px',
              background: showBadges 
                ? 'linear-gradient(135deg, #1f2937, #374151)' 
                : 'linear-gradient(135deg, #f59e0b, #fbbf24)',
              color: 'white',
              borderRadius: '50%',
              border: 'none',
              cursor: 'pointer',
              fontSize: '24px',
              transition: 'all 0.3s ease',
              boxShadow: showBadges 
                ? '0 8px 25px rgba(31, 41, 55, 0.4)' 
                : '0 8px 25px rgba(245, 158, 11, 0.4)',
              alignSelf: showBadges ? 'flex-end' : 'center',
              marginBottom: showBadges ? '20px' : '0'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = showBadges 
                ? '0 12px 35px rgba(31, 41, 55, 0.5)' 
                : '0 12px 35px rgba(245, 158, 11, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = showBadges 
                ? '0 8px 25px rgba(31, 41, 55, 0.4)' 
                : '0 8px 25px rgba(245, 158, 11, 0.4)';
            }}
          >
            {showBadges ? '✕' : '⭐'}
          </button>

          {/* 배지 패널 */}
          {showBadges && (
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
              border: '1px solid #e5e7eb',
              animation: 'slideInRight 0.3s ease-out',
              height: 'fit-content',
              maxHeight: 'calc(100vh - 200px)',
              overflowY: 'auto'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '20px',
                textAlign: 'center'
              }}>🏆 획득한 배지</h3>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {/* 로딩 상태 */}
                {loading && (
                  <div style={{
                    textAlign: 'center',
                    padding: '20px',
                    color: '#6b7280'
                  }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>⏳</div>
                    <p>배지 정보를 불러오는 중...</p>
                  </div>
                )}

                {/* 에러 상태 */}
                {error && (
                  <div style={{
                    padding: '12px',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    color: '#dc2626',
                    fontSize: '14px'
                  }}>
                    {error}
                  </div>
                )}

                {/* 실제 획득한 배지들 */}
                {userInfo?.current_badges?.map((badge: any, index: number) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: selectedBadge === badge ? '#e0f2fe' : '#f9fafb',
                    borderRadius: '12px',
                    padding: '12px',
                    border: selectedBadge === badge ? '2px solid #0ea5e9' : '1px solid #e5e7eb',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleBadgeSelect(badge)}
                  onMouseDown={(e) => handleDragStart(e, badge)}
                  onMouseEnter={(e) => {
                    if (selectedBadge !== badge) {
                      e.currentTarget.style.background = '#f3f4f6';
                      e.currentTarget.style.transform = 'translateX(-4px)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedBadge !== badge) {
                      e.currentTarget.style.background = '#f9fafb';
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
                      flexShrink: 0,
                      overflow: 'hidden'
                    }}>
                      {badge.badge_image_url ? (
                        <img 
                          src={badge.badge_image_url} 
                          alt={badge.badge_name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      ) : (
                        '🏆'
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#1f2937',
                        marginBottom: '2px'
                      }}>{badge.badge_name}</div>
                      <div style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        lineHeight: '1.3'
                      }}>{badge.badge_tag} 카테고리</div>
                    </div>
                    {selectedBadge === badge && (
                      <div style={{
                        fontSize: '12px',
                        color: '#0ea5e9',
                        fontWeight: '600'
                      }}>드래그하세요!</div>
                    )}
                  </div>
                ))}

                {/* 배지가 없을 때 */}
                {!loading && !error && (!userInfo?.current_badges || userInfo.current_badges.length === 0) && (
                  <div style={{
                    textAlign: 'center',
                    padding: '20px',
                    color: '#6b7280'
                  }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🏆</div>
                    <p>아직 획득한 배지가 없어요!</p>
                    <p style={{ fontSize: '12px', marginTop: '4px' }}>게시물을 작성해서 배지를 획득해보세요.</p>
                  </div>
                )}

                {/* 빈 배지 슬롯 */}
                {!loading && !error && userInfo?.current_badges && userInfo.current_badges.length > 0 && [1,2].map(i => (
                  <div key={`empty-${i}`} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: '#f9fafb',
                    borderRadius: '12px',
                    padding: '12px',
                    border: '2px dashed #d1d5db',
                    opacity: 0.6
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: '#e5e7eb',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      color: '#9ca3af',
                      flexShrink: 0
                    }}>
                      🔒
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#9ca3af',
                        marginBottom: '2px'
                      }}>???</div>
                      <div style={{
                        fontSize: '12px',
                        color: '#9ca3af',
                        lineHeight: '1.3'
                      }}>배지를 획득해보세요!</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CSS 애니메이션 */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        /* 배지 호버 효과 */
        .placed-badge:hover .remove-btn {
          opacity: 1 !important;
        }
        .placed-badge:hover .badge-tooltip {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}
