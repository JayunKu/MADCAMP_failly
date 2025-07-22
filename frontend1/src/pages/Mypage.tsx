import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function MyPage() {
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: '사용자',
    bio: '안녕하세요! 반가워요 ✨'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [guestbook, setGuestbook] = useState([
    { id: 1, author: '친구1', message: '안녕! 놀러왔어요~', time: '2시간 전' },
    { id: 2, author: '친구2', message: '프로필 사진 너무 귀여워!', time: '1일 전' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const addGuestbookEntry = () => {
    if (newMessage.trim()) {
      setGuestbook([
        { id: Date.now(), author: '익명', message: newMessage, time: '방금 전' },
        ...guestbook
      ]);
      setNewMessage('');
    }
  };

  const renderContent = () => {
    switch(selectedMenu) {
      case 'profile':
        return (
          <div className="flex flex-col h-full">
            {/* 매우 작은 프로필 섹션 */}
            <div className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 backdrop-blur-md rounded-2xl shadow-xl border border-white/40 p-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/50">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
                </div>
                
                {isEditing ? (
                  <div className="flex-1 space-y-3">
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="w-full px-3 py-2 bg-white/80 backdrop-blur-sm border-2 border-blue-200 rounded-xl text-sm font-semibold placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-200 shadow-sm"
                      placeholder="이름을 입력하세요"
                    />
                    <input
                      type="text"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      className="w-full px-3 py-2 bg-white/80 backdrop-blur-sm border-2 border-purple-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all duration-200 shadow-sm"
                      placeholder="한줄소개를 입력하세요"
                    />
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-medium shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200"
                      >
                        ✓ 저장
                      </button>
                      <button 
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-xl text-sm font-medium shadow-lg hover:shadow-xl hover:from-gray-500 hover:to-gray-600 transform hover:scale-105 transition-all duration-200"
                      >
                        ✕ 취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold text-gray-800 truncate bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{profileData.name}</h2>
                    <p className="text-gray-600 text-sm truncate mt-1 font-medium">{profileData.bio}</p>
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="mt-2 px-3 py-1.5 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-xl text-sm font-medium shadow-sm hover:shadow-md hover:from-indigo-200 hover:to-purple-200 transform hover:scale-105 transition-all duration-200 border border-indigo-200"
                    >
                      ✏️ 수정
                    </button>
                  </div>
                )}
                
                {/* 통계 섹션 - 더 크고 넓게 */}
                <div className="flex gap-4 mt-3 w-full">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-3 rounded-xl shadow-sm flex-1 text-center border border-blue-200">
                    <div className="text-2xl font-extrabold text-blue-600 tracking-wider">12</div>
                    <div className="text-sm font-medium text-blue-700 mt-1">배지</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 px-4 py-3 rounded-xl shadow-sm flex-1 text-center border border-green-200">
                    <div className="text-2xl font-extrabold text-green-600 tracking-wider">48</div>
                    <div className="text-sm font-medium text-green-700 mt-1">방문</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 꾸밀 수 있는 공간 (중간) */}
            <div className="flex-1 bg-gradient-to-br from-pink-50/30 via-purple-50/20 to-indigo-50/30 backdrop-blur-md rounded-2xl border-2 border-dashed border-purple-200/60 flex items-center justify-center shadow-inner">
              <div className="text-center">
                <div className="text-6xl mb-4 animate-pulse">🎨</div>
                <p className="text-lg font-semibold mb-2 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">자유 공간</p>
                <p className="text-sm text-purple-600 font-medium">원하는 대로 꾸며보세요!</p>
                <div className="mt-4 flex justify-center gap-2">
                  <span className="w-2 h-2 bg-pink-300 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-purple-300 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                  <span className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'guestbook':
        return (
          <div className="bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/20 backdrop-blur-md rounded-2xl shadow-xl border border-white/40 p-6 h-full flex flex-col">
            <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">🏠 서랍룸 방문룩</h3>
            
            {/* 방문록 작성 */}
            <div className="bg-gradient-to-br from-white to-emerald-50/50 backdrop-blur-sm rounded-2xl border border-emerald-200/50 shadow-lg p-5 mb-6">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="💭 방문록을 남겨주세요..."
                className="w-full p-4 bg-white/80 backdrop-blur-sm border-2 border-emerald-200 rounded-xl resize-none text-sm placeholder-gray-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 shadow-sm"
                rows={3}
              />
              <button
                onClick={addGuestbookEntry}
                className="mt-3 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-200 text-sm"
              >
                ✨ 작성하기
              </button>
            </div>
            
            {/* 방문록 목록 */}
            <div className="flex-1 overflow-auto space-y-3">
              {guestbook.map(entry => (
                <div key={entry.id} className="bg-white p-4 rounded-lg shadow-sm border">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-sm">{entry.author}</span>
                    <span className="text-xs text-gray-500">{entry.time}</span>
                  </div>
                  <p className="text-gray-700">{entry.message}</p>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'outfits':
        return (
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-md h-full">
            <h3 className="text-lg font-bold mb-4">내가 획득한 상세룩</h3>
            <div className="grid grid-cols-3 gap-4">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 cursor-pointer transition-colors">
                  <span className="text-2xl">👕</span>
                </div>
              ))}
              <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 cursor-pointer transition-colors">
                <span className="text-gray-400">+</span>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-8 shadow-md h-full flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-6xl mb-4">🎨</div>
              <p className="text-lg mb-2">여기는 자유 공간이에요!</p>
              <p className="text-sm">원하는 대로 꾸며보세요</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-screen bg-gray-100 font-sans relative overflow-hidden" 
         style={{backgroundImage: 'url(/assets/texture.png)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
      
      {/* 상단 헤더 */}
      <div className="absolute top-4 left-6 flex items-center gap-4 z-50">
        <button 
          onClick={() => navigate(-1)}
          className="text-xl text-black hover:text-gray-600"
        >
          ←
        </button>
      </div>
      {/* 메인 컨텐츠 영역 */}
      <div className="flex h-full pt-48 pb-4">
        
        {/* 왼쪽 메뉴 영역 */}
        <div className="w-52 p-4 flex flex-col gap-6" style={{marginTop: '120px'}}>
          
          {/* 내 프로필 */}
          <button
            onClick={() => setSelectedMenu('profile')}
            className={`bg-gradient-to-br from-white via-blue-50/50 to-purple-50/30 backdrop-blur-md rounded-2xl shadow-lg border border-white/60 text-left hover:shadow-xl transform hover:scale-105 transition-all duration-200 ${selectedMenu === 'profile' ? 'ring-2 ring-blue-400 shadow-2xl' : ''}`}
          >
            <div className="flex items-center gap-4 p-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-800 text-sm">👤 내 프로필</h3>
                <p className="text-xs text-gray-600 mt-0.5">프로필을 관리해요</p>
              </div>
            </div>
          </button>

          {/* 서랍룸 방문룩 */}
          <button
            onClick={() => setSelectedMenu('guestbook')}
            className={`bg-gradient-to-br from-white via-emerald-50/50 to-teal-50/30 backdrop-blur-md rounded-2xl shadow-lg border border-white/60 text-left hover:shadow-xl transform hover:scale-105 transition-all duration-200 ${selectedMenu === 'guestbook' ? 'ring-2 ring-emerald-400 shadow-2xl' : ''}`}
          >
            <div className="flex items-center gap-4 p-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8 14H9v-2h2v2zm0-4H9V7h2v6z"/>
                </svg>
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-800 text-sm">🏠 서랍룸 방문룩</h3>
                <p className="text-xs text-gray-600 mt-0.5">친구들의 방문록</p>
              </div>
            </div>
          </button>

          {/* 내가 획득한 상세룩 */}
          <button
            onClick={() => setSelectedMenu('outfits')}
            className={`bg-gradient-to-br from-white via-pink-50/50 to-rose-50/30 backdrop-blur-md rounded-2xl shadow-lg border border-white/60 text-left hover:shadow-xl transform hover:scale-105 transition-all duration-200 ${selectedMenu === 'outfits' ? 'ring-2 ring-pink-400 shadow-2xl' : ''}`}
          >
            <div className="flex items-center gap-4 p-4">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-800 text-sm">✨ 내가 획득한 상세룩</h3>
                <p className="text-xs text-gray-600 mt-0.5">나의 패션 컬렉션</p>
              </div>
            </div>
          </button>

        </div>

        {/* 중앙 컨텐츠 영역 */}
        <div className="flex-1 p-4 pr-8">
          <div className="h-full">
            {renderContent()}
          </div>
        </div>

        {/* 오른쪽 배지 영역 */}
        <div className="w-44 p-4 pr-[290px]">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-md h-full">
            <h3 className="font-medium text-gray-800 mb-4 text-center text-sm">획득한 배지</h3>
            <div className="space-y-3">
              {/* 배지 추가 버튼 */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 cursor-pointer transition-colors text-center">
                <div className="text-2xl mb-2">+</div>
                <p className="text-xs text-gray-500">배지 추가</p>
              </div>
              
              {/* 빈 공간 표시 */}
              <div className="text-center text-gray-400 text-xs">
                <p>배지를 획득하면</p>
                <p>여기에 표시됩니다</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 오른쪽 고정 메뉴 */}
      <div className="fixed top-0 right-0 h-screen bg-black shadow-2xl z-50 w-[280px] flex flex-col" style={{backgroundColor: '#000000'}}>
        <Link
          to="/explore"
          className="flex-1 flex items-center justify-center bg-black text-white text-3xl font-bold hover:bg-gray-700 transition-all duration-200 border-b-2 border-gray-600"
          style={{backgroundColor: '#000000', color: '#ffffff'}}
        >
          탐색
        </Link>
        <Link
          to="/chat"
          className="flex-1 flex items-center justify-center bg-black text-white text-3xl font-bold hover:bg-gray-700 transition-all duration-200 border-b-2 border-gray-600"
          style={{backgroundColor: '#000000', color: '#ffffff'}}
        >
          채팅
        </Link>
        <Link
          to="/mypage"
          className="flex-1 flex items-center justify-center bg-gray-800 text-white text-3xl font-bold border-b-2 border-gray-600"
          style={{backgroundColor: '#333333', color: '#ffffff'}}
        >
          마이페이지
        </Link>
      </div>

    </div>
  );
}


