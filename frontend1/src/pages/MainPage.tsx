import React from "react";
import { Link } from "react-router-dom";

export default function MainPage() {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 font-sans relative overflow-hidden">
      {/* 배경 장식 요소들 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full opacity-40 animate-bounce"></div>
        <div className="absolute top-1/2 left-20 w-16 h-16 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full opacity-35"></div>
      </div>

      {/* 상단 좌측 홈 + 로그인 버튼 */}
      <div className="absolute top-6 left-6 flex items-center gap-3 z-50">
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-white/50">
          <img src="/assets/Home.png" alt="Home" className="w-5 h-5" />
          <span className="text-sm font-semibold text-gray-700">failly</span>
        </div>
        <Link to="/signin" className="text-sm px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg font-medium">
          Sign in
        </Link>
        <Link to="/register" className="text-sm px-4 py-2 bg-white/80 backdrop-blur-sm text-gray-700 rounded-full hover:bg-white transition-all duration-200 shadow-lg font-medium border border-white/50">
          Register
        </Link>
      </div>

      {/* 중앙: failly 로고 + 그림 */}
      <div className="flex flex-col items-center justify-center h-full text-center relative z-10">
        <div className="mb-8">
          <h1 className="text-7xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent drop-shadow-sm">
            failly
          </h1>
          <p className="text-lg text-gray-600 font-medium">실패를 공유하고 함께 성장해요 ✨</p>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl blur-xl opacity-20 scale-110"></div>
          <img
            src="/assets/main-bg.png"
            alt="Failly Main"
            className="relative w-[400px] md:w-[500px] rounded-3xl shadow-2xl border-4 border-white/50"
          />
        </div>
      </div>

      {/* 오른쪽 고정 메뉴 - 더 예쁘게 */}
      <div className="fixed top-1/2 right-8 transform -translate-y-1/2 flex flex-col gap-4 z-50">
        <Link
          to="/explore"
          className="group bg-gradient-to-r from-purple-500 to-purple-600 text-white text-lg font-semibold text-center py-4 px-6 rounded-2xl shadow-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 min-w-[140px] transform hover:scale-105 hover:shadow-2xl"
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl">🔍</span>
            <span>탐색</span>
          </div>
        </Link>
        <Link
          to="/chat"
          className="group bg-gradient-to-r from-pink-500 to-pink-600 text-white text-lg font-semibold text-center py-4 px-6 rounded-2xl shadow-xl hover:from-pink-600 hover:to-pink-700 transition-all duration-300 min-w-[140px] transform hover:scale-105 hover:shadow-2xl"
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl">💬</span>
            <span>채팅</span>
          </div>
        </Link>
        <Link
          to="/mypage"
          className="group bg-gradient-to-r from-blue-500 to-blue-600 text-white text-lg font-semibold text-center py-4 px-6 rounded-2xl shadow-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 min-w-[140px] transform hover:scale-105 hover:shadow-2xl"
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl">👤</span>
            <span>마이페이지</span>
          </div>
        </Link>
      </div>

      {/* 하단 장식 */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center z-10">
        <p className="text-sm text-gray-500 font-medium">함께 실패하고, 함께 성장하는 공간</p>
      </div>
    </div>
  );
}
