import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function MainPage() {
  const { user, isAuthenticated, logout } = useAuth();
  return (
    <div style={{
      width: '100%',
      height: '100vh',
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

      {/* 상단 좌측 홈 + 로그인 버튼 */}
      <div style={{
        position: 'absolute',
        top: '24px',
        left: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        zIndex: 50
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '25px',
          padding: '12px 20px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.6)',
          transition: 'all 0.3s ease'
        }}>
          <img src="/assets/Home.png" alt="Home" style={{ width: '24px', height: '24px' }} />
          <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937' }}>failly</span>
        </div>
        
        {isAuthenticated ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '8px 16px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255,255,255,0.6)'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(135deg, #1f2937, #4b5563)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                {user?.nickname?.[0] || 'U'}
              </div>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                {user?.nickname || '사용자'}님
              </span>
            </div>
            <button
              onClick={logout}
              style={{
                padding: '8px 16px',
                background: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#b91c1c';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#dc2626';
              }}
            >
              로그아웃
            </button>
          </div>
        ) : (
          <>
            <Link 
              to="/signin" 
              style={{
                display: 'inline-block',
                padding: '12px 28px',
                background: '#1f2937',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '20px',
                fontWeight: '600',
                fontSize: '14px',
                boxShadow: '0 4px 15px rgba(31, 41, 55, 0.3)',
                border: '1px solid #374151',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
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
              Sign in
            </Link>
            
            <Link 
              to="/register" 
              style={{
                display: 'inline-block',
                padding: '12px 28px',
                background: 'white',
                color: '#1f2937',
                textDecoration: 'none',
                borderRadius: '20px',
                fontWeight: '600',
                fontSize: '14px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f9fafb';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
              }}
            >
              Register
            </Link>
          </>
        )}
      </div>

      {/* 중앙: failly 로고 + 추억 액자들 */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        textAlign: 'center',
        position: 'relative',
        zIndex: 10,
        padding: '0 40px'
      }}>
        {/* 더 크고 예쁜 failly 로고 */}
        <div style={{ marginBottom: '48px' }}>
          <h1 style={{
            fontSize: '7rem',
            fontWeight: '300',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", "Arial", sans-serif',
            marginBottom: '20px',
            color: '#1e293b',
            textShadow: '0 8px 32px rgba(30, 41, 59, 0.3), 0 4px 16px rgba(30, 41, 59, 0.2), 0 2px 8px rgba(30, 41, 59, 0.1)',
            letterSpacing: '-0.05em',
            position: 'relative',
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 25%, #475569 50%, #64748b 75%, #94a3b8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 4px 8px rgba(30, 41, 59, 0.15))'
          }}>
            <span style={{
              position: 'relative',
              display: 'inline-block'
            }}>
              failly
              {/* 로고 하이라이트 효과 */}
              <div style={{
                position: 'absolute',
                top: '10%',
                left: '10%',
                right: '10%',
                height: '30%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                borderRadius: '50px',
                filter: 'blur(8px)',
                zIndex: -1
              }}></div>
            </span>
          </h1>
          <p style={{ 
            fontSize: '20px', 
            color: '#64748b', 
            fontWeight: '600',
            textShadow: '0 1px 2px rgba(0,0,0,0.1)'
          }}>
            실패를 공유하고 함께 성장하는 우리들의 이야기 ✨
          </p>
        </div>
        
        {/* 추억 액자 갤러리 */}
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '800px',
          height: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* 액자 1 - 큰 중앙 액자 */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-2deg)',
            width: '280px',
            height: '200px',
            background: 'linear-gradient(145deg, #ffffff, #f1f5f9)',
            borderRadius: '12px',
            boxShadow: '0 15px 35px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.8)',
            border: '8px solid #e2e8f0',
            zIndex: 4,
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translate(-50%, -50%) rotate(-2deg) scale(1.05)';
            e.currentTarget.style.boxShadow = '0 20px 45px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.8)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translate(-50%, -50%) rotate(-2deg) scale(1)';
            e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.8)';
          }}
          >
            <img 
              src="/assets/h1.png" 
              alt="추억 1"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '4px'
              }}
            />
          </div>

          {/* 액자 2 - 왼쪽 상단 */}
          <div style={{
            position: 'absolute',
            top: '10%',
            left: '15%',
            transform: 'rotate(8deg)',
            width: '180px',
            height: '140px',
            background: 'linear-gradient(145deg, #fefefe, #f8fafc)',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.9)',
            border: '6px solid #f1f5f9',
            zIndex: 3,
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'rotate(8deg) scale(1.08)';
            e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.9)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'rotate(8deg) scale(1)';
            e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.9)';
          }}
          >
            <img 
              src="/assets/h2.png" 
              alt="추억 2"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '2px'
              }}
            />
          </div>

          {/* 액자 3 - 오른쪽 상단 */}
          <div style={{
            position: 'absolute',
            top: '15%',
            right: '10%',
            transform: 'rotate(-12deg)',
            width: '160px',
            height: '120px',
            background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
            borderRadius: '10px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)',
            border: '5px solid #e2e8f0',
            zIndex: 2,
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'rotate(-12deg) scale(1.1)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.8)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'rotate(-12deg) scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)';
          }}
          >
            <img 
              src="/assets/h3.png" 
              alt="추억 3"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '3px'
              }}
            />
          </div>

          {/* 액자 4 - 왼쪽 하단 */}
          <div style={{
            position: 'absolute',
            bottom: '20%',
            left: '8%',
            transform: 'rotate(-5deg)',
            width: '140px',
            height: '100px',
            background: 'linear-gradient(145deg, #fefefe, #f1f5f9)',
            borderRadius: '6px',
            boxShadow: '0 6px 18px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
            border: '4px solid #f8fafc',
            zIndex: 1,
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'rotate(-5deg) scale(1.12)';
            e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.9)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'rotate(-5deg) scale(1)';
            e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)';
          }}
          >
            <img 
              src="/assets/h4.png" 
              alt="추억 4"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '2px'
              }}
            />
          </div>

          {/* 배경 장식 요소들 */}
          <div style={{
            position: 'absolute',
            top: '30%',
            right: '25%',
            width: '20px',
            height: '20px',
            background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
            borderRadius: '50%',
            opacity: 0.6,
            animation: 'pulse 2s infinite',
            zIndex: 0
          }}></div>
          
          <div style={{
            position: 'absolute',
            bottom: '35%',
            right: '15%',
            width: '15px',
            height: '15px',
            background: 'linear-gradient(45deg, #ec4899, #db2777)',
            borderRadius: '50%',
            opacity: 0.5,
            zIndex: 0
          }}></div>

          <div style={{
            position: 'absolute',
            top: '60%',
            left: '25%',
            width: '12px',
            height: '12px',
            background: 'linear-gradient(45deg, #8b5cf6, #7c3aed)',
            borderRadius: '50%',
            opacity: 0.4,
            zIndex: 0
          }}></div>
        </div>
      </div>

      {/* 오른쪽 고정 메뉴 */}
      <div style={{
        position: 'fixed',
        top: '50%',
        right: '32px',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        zIndex: 50
      }}>
        <Link
          to="/explore"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            background: 'linear-gradient(135deg, #374151, #4b5563)',
            color: 'white',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: '600',
            textAlign: 'center',
            padding: '18px 28px',
            borderRadius: '20px',
            boxShadow: '0 8px 25px rgba(55, 65, 81, 0.3)',
            minWidth: '160px',
            transition: 'all 0.3s ease',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #1f2937, #374151)';
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 12px 35px rgba(55, 65, 81, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #374151, #4b5563)';
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(55, 65, 81, 0.3)';
          }}
        >
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            border: '2px solid currentColor',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'currentColor'
            }}></div>
          </div>
          <span>탐색</span>
        </Link>
        
        <Link
          to="/chat"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            background: 'linear-gradient(135deg, #6b7280, #9ca3af)',
            color: 'white',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: '600',
            textAlign: 'center',
            padding: '18px 28px',
            borderRadius: '20px',
            boxShadow: '0 8px 25px rgba(107, 114, 128, 0.3)',
            minWidth: '160px',
            transition: 'all 0.3s ease',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #4b5563, #6b7280)';
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 12px 35px rgba(107, 114, 128, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #6b7280, #9ca3af)';
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(107, 114, 128, 0.3)';
          }}
        >
          <div style={{
            width: '20px',
            height: '16px',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '16px',
              height: '12px',
              border: '2px solid currentColor',
              borderRadius: '8px',
              backgroundColor: 'transparent'
            }}></div>
            <div style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              width: '6px',
              height: '6px',
              backgroundColor: 'currentColor',
              borderRadius: '50%'
            }}></div>
          </div>
          <span>채팅</span>
        </Link>
        
        <Link
          to="/mypage"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            background: 'linear-gradient(135deg, #ffffff, #f8fafc)',
            color: '#1f2937',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: '600',
            textAlign: 'center',
            padding: '18px 28px',
            borderRadius: '20px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb',
            minWidth: '160px',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #f9fafb, #f3f4f6)';
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 12px 35px rgba(0,0,0,0.15)';
            e.currentTarget.style.borderColor = '#d1d5db';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #ffffff, #f8fafc)';
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
            e.currentTarget.style.borderColor = '#e5e7eb';
          }}
        >
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            border: '2px solid currentColor',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'currentColor',
              marginBottom: '2px'
            }}></div>
            <div style={{
              position: 'absolute',
              bottom: '2px',
              width: '10px',
              height: '4px',
              borderRadius: '2px',
              backgroundColor: 'currentColor'
            }}></div>
          </div>
          <span>마이페이지</span>
        </Link>
      </div>

      {/* 하단 장식 */}
      <div style={{
        position: 'absolute',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        zIndex: 10
      }}>
        <p style={{ fontSize: '14px', color: '#9ca3af', fontWeight: '500' }}>함께 실패하고, 함께 성장하는 공간</p>
      </div>
    </div>
  );
}
