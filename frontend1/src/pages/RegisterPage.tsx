import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();

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

        {/* 이메일 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="Value"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>

        {/* 회원가입 버튼 */}
        <button className="w-full py-2 bg-black text-white text-sm rounded-md hover:bg-gray-800 transition-colors mb-4">
          Register
        </button>

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
