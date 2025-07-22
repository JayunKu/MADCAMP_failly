import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { createUser } from "../api/auth";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await createUser({ email, password, nickname });
      console.log("회원가입 성공:", response);
      
      // 회원가입 성공 시 로그인 페이지로 이동
      navigate("/signin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "회원가입에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

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

      {/* 상단 좌측 홈 버튼 */}
      <div style={{
        position: 'absolute',
        top: '24px',
        left: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        zIndex: 50
      }}>
        <Link 
          to="/main"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '25px',
            padding: '12px 20px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.6)',
            transition: 'all 0.3s ease',
            textDecoration: 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
          }}
        >
          <img src="/assets/Home.png" alt="Home" style={{ width: '24px', height: '24px' }} />
          <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937' }}>failly</span>
        </Link>
      </div>

      {/* 중앙 회원가입 폼 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '60px',
          maxWidth: '900px',
          width: '100%',
          padding: '0 40px'
        }}>
          
          {/* 왼쪽: 고양이 GIF와 텍스트 */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <div style={{ marginBottom: '32px' }}>
              <h1 style={{
                fontSize: '4rem',
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
              <p style={{ fontSize: '18px', color: '#6b7280', fontWeight: '500', marginBottom: '24px' }}>
                실패를 공유하고 함께 성장해요 ✨
              </p>
            </div>
            
            {/* 고양이 GIF */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, #9ca3af, #6b7280)',
                borderRadius: '50%',
                filter: 'blur(20px)',
                opacity: 0.2,
                transform: 'scale(1.2)'
              }}></div>
              <img 
                src="/assets/cat.gif" 
                alt="Cat" 
                style={{
                  position: 'relative',
                  width: '200px',
                  height: '200px',
                  borderRadius: '50%',
                  boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
                  border: '6px solid rgba(255,255,255,0.8)',
                  objectFit: 'cover'
                }}
              />
            </div>
          </div>

          {/* 오른쪽: 회원가입 폼 */}
          <div style={{
            flex: 1,
            maxWidth: '400px'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '24px',
              boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
              padding: '40px',
              border: '1px solid rgba(255,255,255,0.8)'
            }}>
              <h2 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                textAlign: 'center',
                color: '#1f2937',
                marginBottom: '32px'
              }}>
                Register
              </h2>

              <form onSubmit={handleSubmit}>
                {/* 에러 메시지 */}
                {error && (
                  <div style={{
                    marginBottom: '20px',
                    padding: '12px 16px',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#dc2626',
                    borderRadius: '12px',
                    fontSize: '14px'
                  }}>
                    {error}
                  </div>
                )}

                {/* 이메일 */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="이메일을 입력하세요"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '12px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      background: '#f9fafb'
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

                {/* 닉네임 */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Nickname
                  </label>
                  <input
                    type="text"
                    placeholder="닉네임을 입력하세요"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '12px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      background: '#f9fafb'
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

                {/* 비밀번호 */}
                <div style={{ marginBottom: '32px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '12px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      background: '#f9fafb'
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

                {/* 회원가입 버튼 */}
                <button 
                  type="submit"
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: isLoading ? '#9ca3af' : '#1f2937',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '600',
                    borderRadius: '16px',
                    border: 'none',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    marginBottom: '20px',
                    boxShadow: '0 4px 15px rgba(31, 41, 55, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.background = '#111827';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(31, 41, 55, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.background = '#1f2937';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(31, 41, 55, 0.3)';
                    }
                  }}
                >
                  {isLoading ? "등록 중..." : "Register"}
                </button>

                {/* 로그인 링크 */}
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>이미 계정이 있으신가요? </span>
                  <Link
                    to="/signin"
                    style={{
                      fontSize: '14px',
                      color: '#1f2937',
                      textDecoration: 'none',
                      fontWeight: '600',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#374151';
                      e.currentTarget.style.textDecoration = 'underline';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#1f2937';
                      e.currentTarget.style.textDecoration = 'none';
                    }}
                  >
                    Sign In
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
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
