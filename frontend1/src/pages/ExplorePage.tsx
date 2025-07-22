import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

interface Comment {
  id: number;
  author: string;
  content: string;
  time: string;
}

interface Post {
  id: number;
  author: string;
  content: string;
  time: string;
  likes: number;
  image: string | null;
  comments: Comment[];
  showComments: boolean;
}

export default function ExplorePage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('지각');
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [postsByCategory, setPostsByCategory] = useState<{[key: string]: Post[]}>({
    '지각': [
      { 
        id: 1, 
        author: '지각왕', 
        content: '또 지각했어요... 알람을 5개나 맞췄는데도 😭', 
        time: '10분 전', 
        likes: 12, 
        image: null,
        comments: [
          { id: 1, author: '공감러', content: '저도 매일 그래요 ㅠㅠ', time: '5분 전' },
          { id: 2, author: '조언자', content: '알람을 침대에서 멀리 두세요!', time: '3분 전' }
        ],
        showComments: false
      },
      { 
        id: 2, 
        author: '늦잠러버', 
        content: '오늘도 15분 지각.. 상사가 째려보네요 ㅠㅠ', 
        time: '1시간 전', 
        likes: 8, 
        image: null,
        comments: [
          { id: 3, author: '위로봇', content: '힘내세요! 내일은 일찍 일어나실 거예요', time: '30분 전' }
        ],
        showComments: false
      },
      { 
        id: 3, 
        author: '타임마스터', 
        content: '지각 기록 갱신! 30분 늦었어요 🏃‍♂️', 
        time: '2시간 전', 
        likes: 15, 
        image: null,
        comments: [],
        showComments: false
      }
    ],
    '시험 망함': [
      { 
        id: 4, 
        author: '공부싫어', 
        content: '중간고사 망했어요... 다시 공부해야겠네요 📚', 
        time: '30분 전', 
        likes: 20, 
        image: null,
        comments: [],
        showComments: false
      },
      { 
        id: 5, 
        author: '야매학생', 
        content: '벼락치기의 한계를 느꼈습니다', 
        time: '2시간 전', 
        likes: 7, 
        image: null,
        comments: [],
        showComments: false
      }
    ],
    '다이어트 실패': [
      { 
        id: 6, 
        author: '치킨러버', 
        content: '다이어트 시작한지 3일만에 치킨 시켰어요... 🍗', 
        time: '1시간 전', 
        likes: 25, 
        image: null,
        comments: [],
        showComments: false
      }
    ]
  });
  const [commentInputs, setCommentInputs] = useState<{[key: number]: string}>({});

  // 실패 카테고리 목록
  const failCategories = [
    { id: 'late', name: '지각', icon: '⏰', color: 'from-red-400 to-red-500' },
    { id: 'exam', name: '시험 망함', icon: '📝', color: 'from-orange-400 to-orange-500' },
    { id: 'procrastination', name: '할 일 미룸', icon: '📅', color: 'from-yellow-400 to-yellow-500' },
    { id: 'dating', name: '소개팅 망함', icon: '💔', color: 'from-pink-400 to-pink-500' },
    { id: 'diet', name: '다이어트 실패', icon: '🍰', color: 'from-purple-400 to-purple-500' },
    { id: 'oversleep', name: '늦잠', icon: '😴', color: 'from-blue-400 to-blue-500' },
    { id: 'reality', name: '현타', icon: '😵', color: 'from-indigo-400 to-indigo-500' },
    { id: 'overthinking', name: '오버씽킹', icon: '🤯', color: 'from-teal-400 to-teal-500' },
    { id: 'cringe', name: '이불킥', icon: '🛏️', color: 'from-green-400 to-green-500' },
    { id: 'lazy', name: '게으름', icon: '🦥', color: 'from-gray-400 to-gray-500' },
    { id: 'burnout', name: '번아웃', icon: '🔥', color: 'from-red-400 to-pink-500' },
    { id: 'smoking', name: '금연 실패', icon: '🚭', color: 'from-slate-400 to-slate-500' },
  ];

  const toggleLike = (postId: number) => {
    setPostsByCategory(prev => {
      const newPosts = { ...prev };
      Object.keys(newPosts).forEach(category => {
        newPosts[category] = newPosts[category].map(post => 
          post.id === postId 
            ? { ...post, likes: post.likes + 1 }
            : post
        );
      });
      return newPosts;
    });
  };

  const toggleComments = (postId: number) => {
    setPostsByCategory(prev => {
      const newPosts = { ...prev };
      Object.keys(newPosts).forEach(category => {
        newPosts[category] = newPosts[category].map(post => 
          post.id === postId 
            ? { ...post, showComments: !post.showComments }
            : post
        );
      });
      return newPosts;
    });
  };

  const addComment = (postId: number) => {
    const commentText = commentInputs[postId];
    if (!commentText?.trim()) return;

    const newComment: Comment = {
      id: Date.now(),
      author: '나',
      content: commentText,
      time: '방금 전'
    };

    setPostsByCategory(prev => {
      const newPosts = { ...prev };
      Object.keys(newPosts).forEach(category => {
        newPosts[category] = newPosts[category].map(post => 
          post.id === postId 
            ? { ...post, comments: [...post.comments, newComment] }
            : post
        );
      });
      return newPosts;
    });

    setCommentInputs({ ...commentInputs, [postId]: '' });
  };

  const addPost = () => {
    if (!newPost.trim()) return;

    const post: Post = {
      id: Date.now(),
      author: '나',
      content: newPost,
      time: '방금 전',
      likes: 0,
      image: null,
      comments: [],
      showComments: false
    };

    setPostsByCategory(prev => ({
      ...prev,
      [selectedCategory]: [post, ...(prev[selectedCategory] || [])]
    }));
    
    setNewPost('');
    setShowWriteModal(false);
  };

  const getCurrentPosts = () => {
    return postsByCategory[selectedCategory] || [];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      
      {/* 상단 헤더 */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              ←
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              failly
            </h1>
          </div>
          <button
            onClick={() => setShowWriteModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            + 게시물 작성
          </button>
        </div>
      </div>

      {/* 카테고리 탭 */}
      <div className="sticky top-[73px] z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {failCategories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === category.name 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{category.icon}</span>
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 메인 피드 */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-8">
          {getCurrentPosts().length > 0 ? (
            getCurrentPosts().map(post => (
              <div key={post.id} className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
              
              {/* 게시물 헤더 */}
              <div className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {post.author[0]}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{post.author}</h3>
                  <p className="text-sm text-gray-500">{post.time}</p>
                </div>
              </div>

              {/* 게시물 내용 */}
              <div className="px-4 pb-3">
                <p className="text-gray-800 leading-relaxed">{post.content}</p>
              </div>

              {/* 액션 버튼 */}
              <div className="px-4 py-3 border-t border-gray-100">
                <div className="flex items-center gap-6">
                  <button 
                    onClick={() => toggleLike(post.id)}
                    className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <span className="text-xl">❤️</span>
                    <span className="font-medium">{post.likes}</span>
                  </button>
                  <button 
                    onClick={() => toggleComments(post.id)}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors"
                  >
                    <span className="text-xl">💬</span>
                    <span className="font-medium">{post.comments.length}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-green-500 transition-colors">
                    <span className="text-xl">📤</span>
                    <span className="font-medium">공유</span>
                  </button>
                </div>
              </div>

              {/* 댓글 섹션 */}
              {post.showComments && (
                <div className="border-t border-gray-100 bg-gray-50">
                  
                  {/* 기존 댓글 */}
                  {post.comments.length > 0 && (
                    <div className="p-4 space-y-3">
                      {post.comments.map(comment => (
                        <div key={comment.id} className="flex gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {comment.author[0]}
                          </div>
                          <div className="flex-1">
                            <div className="bg-white rounded-lg px-3 py-2">
                              <h4 className="font-semibold text-sm text-gray-900">{comment.author}</h4>
                              <p className="text-sm text-gray-700">{comment.content}</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 ml-3">{comment.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 댓글 입력 */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        나
                      </div>
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          placeholder="댓글을 입력하세요..."
                          value={commentInputs[post.id] || ''}
                          onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                          onKeyPress={(e) => e.key === 'Enter' && addComment(post.id)}
                          className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => addComment(post.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          게시
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {selectedCategory} 카테고리에 게시물이 없어요
              </h3>
              <p className="text-gray-500 mb-6">첫 번째 게시물을 작성해보세요!</p>
              <button
                onClick={() => setShowWriteModal(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                + 게시물 작성하기
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 게시물 작성 모달 */}
      {showWriteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  새 게시물 작성
                </h3>
                <button 
                  onClick={() => setShowWriteModal(false)}
                  className="text-2xl text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">내용</label>
                  <textarea
                    placeholder={`${selectedCategory}에 대한 이야기를 들려주세요...`}
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl resize-none text-sm placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowWriteModal(false)}
                    className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    onClick={addPost}
                    className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                  >
                    게시하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
