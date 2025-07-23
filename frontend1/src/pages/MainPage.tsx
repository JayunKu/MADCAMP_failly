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

      {/* 중앙: failly 로고 + 그림 */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        textAlign: 'center',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '4.5rem',
            fontWeight: 'bold',
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #1f2937, #4b5563, #6b7280)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
          }}>
            failly
          </h1>
          <p style={{ fontSize: '18px', color: '#6b7280', fontWeight: '500' }}>실패를 공유하고 함께 성장해요 ✨</p>
        </div>
        
        <div style={{ 
          position: 'relative',
          width: '500px',
          height: '400px'
        }}>
          {/* 배경 글로우 효과 */}
          <div style={{
            position: 'absolute',
            inset: '-20px',
            background: 'radial-gradient(ellipse at center, rgba(156, 163, 175, 0.3) 0%, rgba(156, 163, 175, 0.1) 40%, transparent 70%)',
            filter: 'blur(30px)',
            zIndex: 1
          }}></div>
          
          {/* 메인 이미지 컨테이너 */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            zIndex: 2
          }}>
            <img
              src="/assets/main-bg.png"
              alt="Failly Main"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'relative',
                zIndex: 1
              }}
            />
            
            {/* 페이드 아웃 마스크 오버레이 */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: `
                radial-gradient(ellipse 80% 70% at center, transparent 30%, rgba(248, 250, 252, 0.1) 50%, rgba(248, 250, 252, 0.3) 70%, rgba(248, 250, 252, 0.6) 85%, rgba(248, 250, 252, 0.9) 95%, rgba(248, 250, 252, 1) 100%),
                linear-gradient(to bottom, transparent 20%, rgba(248, 250, 252, 0.05) 60%, rgba(248, 250, 252, 0.2) 80%, rgba(248, 250, 252, 0.5) 90%, rgba(248, 250, 252, 0.8) 95%, rgba(248, 250, 252, 1) 100%),
                linear-gradient(to top, transparent 20%, rgba(248, 250, 252, 0.05) 60%, rgba(248, 250, 252, 0.2) 80%, rgba(248, 250, 252, 0.5) 90%, rgba(248, 250, 252, 0.8) 95%, rgba(248, 250, 252, 1) 100%),
                linear-gradient(to right, transparent 20%, rgba(248, 250, 252, 0.05) 60%, rgba(248, 250, 252, 0.2) 80%, rgba(248, 250, 252, 0.5) 90%, rgba(248, 250, 252, 0.8) 95%, rgba(248, 250, 252, 1) 100%),
                linear-gradient(to left, transparent 20%, rgba(248, 250, 252, 0.05) 60%, rgba(248, 250, 252, 0.2) 80%, rgba(248, 250, 252, 0.5) 90%, rgba(248, 250, 252, 0.8) 95%, rgba(248, 250, 252, 1) 100%)
              `,
              zIndex: 2,
              pointerEvents: 'none'
            }}></div>
            
            {/* 중앙 하이라이트 */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '60%',
              height: '60%',
              background: 'radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(255, 255, 255, 0.1) 70%, rgba(255, 255, 255, 0.2) 100%)',
              borderRadius: '50%',
              zIndex: 3,
              pointerEvents: 'none'
            }}></div>
          </div>
          
          {/* 부드러운 그림자 */}
          <div style={{
            position: 'absolute',
            bottom: '-40px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80%',
            height: '20px',
            background: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.05) 50%, transparent 100%)',
            filter: 'blur(10px)',
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
            gap: '8px',
            background: '#374151',
            color: 'white',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: '600',
            textAlign: 'center',
            padding: '16px 24px',
            borderRadius: '16px',
            boxShadow: '0 4px 15px rgba(55, 65, 81, 0.3)',
            minWidth: '140px',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#1f2937';
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(55, 65, 81, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#374151';
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(55, 65, 81, 0.3)';
          }}
        >
          <span style={{ fontSize: '20px' }}>🔍</span>
          <span>탐색</span>
        </Link>
        
        <Link
          to="/chat"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: '#6b7280',
            color: 'white',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: '600',
            textAlign: 'center',
            padding: '16px 24px',
            borderRadius: '16px',
            boxShadow: '0 4px 15px rgba(107, 114, 128, 0.3)',
            minWidth: '140px',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#4b5563';
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(107, 114, 128, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#6b7280';
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(107, 114, 128, 0.3)';
          }}
        >
          <span style={{ fontSize: '20px' }}>💬</span>
          <span>채팅</span>
        </Link>
        
        <Link
          to="/mypage"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: 'white',
            color: '#1f2937',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: '600',
            textAlign: 'center',
            padding: '16px 24px',
            borderRadius: '16px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb',
            minWidth: '140px',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f9fafb';
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
          }}
        >
          <span style={{ fontSize: '20px' }}>👤</span>
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
