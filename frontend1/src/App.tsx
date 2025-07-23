import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ChatPage from './pages/ChatPage';
import ExplorePage from './pages/ExplorePage';
import MainPage from './pages/MainPage';
import MyPage from './pages/Mypage';
import SignInPage from './pages/SignInPage';
import RegisterPage from './pages/RegisterPage';
import { useEffect, useState } from 'react';
import './App.css';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: string;
  animationDuration: number;
}

function App() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // 마우스 위치 추적
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // 랜덤하게 반짝이 생성 (확률 조절)
      if (Math.random() < 0.3) {
        const newSparkle: Sparkle = {
          id: Date.now() + Math.random(),
          x: e.clientX + (Math.random() - 0.5) * 40, // 커서 주변에 랜덤 배치
          y: e.clientY + (Math.random() - 0.5) * 40,
          size: Math.random() * 8 + 4, // 4-12px 크기
          opacity: Math.random() * 0.8 + 0.2, // 0.2-1.0 투명도
          color: ['#fbbf24', '#f59e0b', '#ec4899', '#db2777', '#8b5cf6', '#7c3aed', '#06b6d4', '#0891b2'][Math.floor(Math.random() * 8)],
          animationDuration: Math.random() * 1000 + 800 // 0.8-1.8초
        };

        setSparkles(prev => [...prev, newSparkle]);

        // 일정 시간 후 반짝이 제거
        setTimeout(() => {
          setSparkles(prev => prev.filter(sparkle => sparkle.id !== newSparkle.id));
        }, newSparkle.animationDuration);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <AuthProvider>
      <Router>
        {/* 커서 따라다니는 반짝이 효과 */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 9999,
          overflow: 'hidden'
        }}>
          {/* 커서 주변 글로우 효과 */}
          <div style={{
            position: 'absolute',
            left: mousePosition.x - 20,
            top: mousePosition.y - 20,
            width: '40px',
            height: '40px',
            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, rgba(251, 191, 36, 0.1) 50%, transparent 100%)',
            borderRadius: '50%',
            transition: 'all 0.1s ease-out',
            animation: 'cursorGlow 2s ease-in-out infinite'
          }}></div>

          {/* 반짝이들 */}
          {sparkles.map(sparkle => (
            <div
              key={sparkle.id}
              style={{
                position: 'absolute',
                left: sparkle.x,
                top: sparkle.y,
                width: sparkle.size,
                height: sparkle.size,
                background: sparkle.color,
                borderRadius: '50%',
                opacity: sparkle.opacity,
                animation: `sparkleAnimation ${sparkle.animationDuration}ms ease-out forwards`,
                boxShadow: `0 0 ${sparkle.size * 2}px ${sparkle.color}`,
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}

          {/* 별 모양 반짝이들 */}
          {sparkles.filter((_, index) => index % 3 === 0).map(sparkle => (
            <div
              key={`star-${sparkle.id}`}
              style={{
                position: 'absolute',
                left: sparkle.x + 15,
                top: sparkle.y - 10,
                fontSize: `${sparkle.size + 2}px`,
                color: sparkle.color,
                opacity: sparkle.opacity * 0.8,
                animation: `starSparkle ${sparkle.animationDuration}ms ease-out forwards`,
                transform: 'translate(-50%, -50%)',
                textShadow: `0 0 ${sparkle.size}px ${sparkle.color}`
              }}
            >
              ✨
            </div>
          ))}

          {/* 하트 모양 반짝이들 */}
          {sparkles.filter((_, index) => index % 5 === 0).map(sparkle => (
            <div
              key={`heart-${sparkle.id}`}
              style={{
                position: 'absolute',
                left: sparkle.x - 12,
                top: sparkle.y + 8,
                fontSize: `${sparkle.size}px`,
                color: sparkle.color,
                opacity: sparkle.opacity * 0.6,
                animation: `heartSparkle ${sparkle.animationDuration}ms ease-out forwards`,
                transform: 'translate(-50%, -50%)',
                textShadow: `0 0 ${sparkle.size}px ${sparkle.color}`
              }}
            >
              💫
            </div>
          ))}
        </div>

        <Routes>
          <Route path="/" element={<Navigate to="/main" replace />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>

        {/* CSS 애니메이션 정의 */}
        <style>{`
          @keyframes cursorGlow {
            0%, 100% {
              transform: scale(1);
              opacity: 0.3;
            }
            50% {
              transform: scale(1.2);
              opacity: 0.6;
            }
          }

          @keyframes sparkleAnimation {
            0% {
              transform: translate(-50%, -50%) scale(0) rotate(0deg);
              opacity: 1;
            }
            50% {
              transform: translate(-50%, -50%) scale(1.2) rotate(180deg);
              opacity: 0.8;
            }
            100% {
              transform: translate(-50%, -50%) scale(0) rotate(360deg);
              opacity: 0;
            }
          }

          @keyframes starSparkle {
            0% {
              transform: translate(-50%, -50%) scale(0) rotate(0deg);
              opacity: 1;
            }
            25% {
              transform: translate(-50%, -50%) scale(1.5) rotate(90deg);
              opacity: 0.9;
            }
            50% {
              transform: translate(-50%, -50%) scale(1) rotate(180deg);
              opacity: 0.7;
            }
            75% {
              transform: translate(-50%, -50%) scale(1.3) rotate(270deg);
              opacity: 0.5;
            }
            100% {
              transform: translate(-50%, -50%) scale(0) rotate(360deg);
              opacity: 0;
            }
          }

          @keyframes heartSparkle {
            0% {
              transform: translate(-50%, -50%) scale(0) rotate(0deg);
              opacity: 1;
            }
            30% {
              transform: translate(-50%, -50%) scale(1.4) rotate(120deg);
              opacity: 0.8;
            }
            60% {
              transform: translate(-50%, -50%) scale(0.8) rotate(240deg);
              opacity: 0.6;
            }
            100% {
              transform: translate(-50%, -50%) scale(0) rotate(360deg);
              opacity: 0;
            }
          }

          /* 커서 스타일 변경 */
          * {
            cursor: none !important;
          }

          body {
            cursor: none !important;
          }

          /* 클릭 가능한 요소들에 대한 커서 표시 */
          button, a, input, textarea, select, [role="button"], [onclick] {
            cursor: pointer !important;
          }

          /* 커스텀 커서 */
          body::after {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, rgba(251, 191, 36, 0.8) 0%, rgba(251, 191, 36, 0.4) 50%, transparent 100%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            transform: translate(-50%, -50%);
            transition: all 0.1s ease-out;
            box-shadow: 0 0 20px rgba(251, 191, 36, 0.6);
          }
        `}</style>
      </Router>
    </AuthProvider>
  );
}

export default App;
