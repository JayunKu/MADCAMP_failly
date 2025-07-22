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
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{
        backgroundImage: "url(/assets/texture.png)",
      }}
    >
      {/* 고양이 + 회원가입 카드 전체 컨테이너 */}
      <div className="flex flex-col items-center">
        
        {/* 고양이 GIF */}
        <div className="mb-4">
          <img 
            src="/assets/cat.gif" 
            alt="Cat" 
            className="w-12 h-12 rounded-full shadow-lg"
          />
        </div>

        {/* 회원가입 카드 */}
        <div className="relative w-[320px] bg-white rounded-xl shadow-md px-6 py-8 border border-gray-300">

          {/* ← 버튼 */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-3 left-3 text-lg text-black hover:text-gray-600"
          >
            ←
          </button>

          {/* 로고 */}
          <h1 className="text-3xl font-bold text-center text-black font-[cursive] mb-8 mt-2">
            failly
          </h1>

          <form onSubmit={handleSubmit}>
            {/* 에러 메시지 */}
            {error && (
              <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                {error}
              </div>
            )}

            {/* 이메일 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Value"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>

            {/* 닉네임 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nickname
              </label>
              <input
                type="text"
                placeholder="Value"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>

            {/* 비밀번호 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Value"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>

            {/* 회원가입 버튼 */}
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-2 bg-black text-white text-sm rounded-md hover:bg-gray-800 transition-colors mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "등록 중..." : "Register"}
            </button>
          </form>

          {/* 로그인으로 이동 */}
          <div className="text-right">
            <span className="text-xs text-gray-600">Already have an account? </span>
            <Link
              to="/signin"
              className="text-xs text-blue-600 hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      
      </div>
    </div>
  );
}
