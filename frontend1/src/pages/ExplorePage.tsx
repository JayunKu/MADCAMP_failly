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
    { id: 'late', name: '지각', icon: '⏰' },
    { id: 'exam', name: '시험 망함', icon: '📝' },
    { id: 'procrastination', name: '할 일 미룸', icon: '📅' },
    { id: 'dating', name: '소개팅 망함', icon: '💔' },
    { id: 'diet', name: '다이어트 실패', icon: '🍰' },
    { id: 'oversleep', name: '늦잠', icon: '😴' },
    { id: 'reality', name: '현타', icon: '😵' },
    { id: 'overthinking', name: '오버씽킹', icon: '🤯' },
    { id: 'cringe', name: '이불킥', icon: '🛏️' },
    { id: 'lazy', name: '게으름', icon: '🦥' },
    { id: 'burnout', name: '번아웃', icon: '🔥' },
    { id: 'smoking', name: '금연 실패', icon: '🚭' },
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
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc, #f1f5f9, #e2e8f0)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      
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
          maxWidth: '1024px',
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
              failly
            </h1>
          </div>
          <button
            onClick={() => setShowWriteModal(true)}
            style={{
              padding: '8px 16px',
              background: '#1f2937',
              color: 'white',
              borderRadius: '12px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(31, 41, 55, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#111827';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(31, 41, 55, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#1f2937';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(31, 41, 55, 0.3)';
            }}
          >
            + 게시물 작성
          </button>
        </div>
      </div>

      {/* 카테고리 탭 */}
      <div style={{
        position: 'sticky',
        top: '73px',
        zIndex: 40,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{
          maxWidth: '1024px',
          margin: '0 auto',
          padding: '12px 16px'
        }}>
          <div style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}>
            {failCategories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  background: selectedCategory === category.name ? '#1f2937' : '#f3f4f6',
                  color: selectedCategory === category.name ? 'white' : '#374151',
                  boxShadow: selectedCategory === category.name ? '0 4px 15px rgba(31, 41, 55, 0.3)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (selectedCategory !== category.name) {
                    e.currentTarget.style.background = '#e5e7eb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== category.name) {
                    e.currentTarget.style.background = '#f3f4f6';
                  }
                }}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 메인 피드 */}
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '24px 16px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {getCurrentPosts().length > 0 ? (
            getCurrentPosts().map(post => (
              <div key={post.id} style={{
                background: 'white',
                borderRadius: '20px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb',
                overflow: 'hidden',
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
              
                {/* 게시물 헤더 */}
                <div style={{
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #1f2937, #4b5563)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    {post.author[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontWeight: '600',
                      color: '#1f2937',
                      margin: 0,
                      fontSize: '16px'
                    }}>{post.author}</h3>
                    <p style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      margin: 0
                    }}>{post.time}</p>
                  </div>
                </div>

                {/* 게시물 내용 */}
                <div style={{ padding: '0 16px 12px' }}>
                  <p style={{
                    color: '#374151',
                    lineHeight: '1.6',
                    margin: 0,
                    fontSize: '15px'
                  }}>{post.content}</p>
                </div>

                {/* 액션 버튼 */}
                <div style={{
                  padding: '12px 16px',
                  borderTop: '1px solid #f3f4f6'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24px'
                  }}>
                    <button 
                      onClick={() => toggleLike(post.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#6b7280',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'color 0.2s ease',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#dc2626';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#6b7280';
                      }}
                    >
                      <span style={{ fontSize: '18px' }}>❤️</span>
                      <span>{post.likes}</span>
                    </button>
                    <button 
                      onClick={() => toggleComments(post.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#6b7280',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'color 0.2s ease',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#2563eb';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#6b7280';
                      }}
                    >
                      <span style={{ fontSize: '18px' }}>💬</span>
                      <span>{post.comments.length}</span>
                    </button>
                    <button style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#6b7280',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'color 0.2s ease',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#059669';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#6b7280';
                    }}
                    >
                      <span style={{ fontSize: '18px' }}>📤</span>
                      <span>공유</span>
                    </button>
                  </div>
                </div>

                {/* 댓글 섹션 */}
                {post.showComments && (
                  <div style={{
                    borderTop: '1px solid #f3f4f6',
                    background: '#f9fafb'
                  }}>
                    
                    {/* 기존 댓글 */}
                    {post.comments.length > 0 && (
                      <div style={{
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                      }}>
                        {post.comments.map(comment => (
                          <div key={comment.id} style={{
                            display: 'flex',
                            gap: '12px'
                          }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              background: 'linear-gradient(135deg, #6b7280, #4b5563)',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontWeight: 'bold',
                              fontSize: '14px'
                            }}>
                              {comment.author[0]}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{
                                background: 'white',
                                borderRadius: '12px',
                                padding: '12px'
                              }}>
                                <h4 style={{
                                  fontWeight: '600',
                                  fontSize: '14px',
                                  color: '#1f2937',
                                  margin: '0 0 4px 0'
                                }}>{comment.author}</h4>
                                <p style={{
                                  fontSize: '14px',
                                  color: '#374151',
                                  margin: 0
                                }}>{comment.content}</p>
                              </div>
                              <p style={{
                                fontSize: '12px',
                                color: '#6b7280',
                                margin: '4px 0 0 12px'
                              }}>{comment.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 댓글 입력 */}
                    <div style={{
                      padding: '16px',
                      borderTop: '1px solid #e5e7eb'
                    }}>
                      <div style={{
                        display: 'flex',
                        gap: '12px'
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
                          나
                        </div>
                        <div style={{
                          flex: 1,
                          display: 'flex',
                          gap: '8px'
                        }}>
                          <input
                            type="text"
                            placeholder="댓글을 입력하세요..."
                            value={commentInputs[post.id] || ''}
                            onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                            onKeyPress={(e) => e.key === 'Enter' && addComment(post.id)}
                            style={{
                              flex: 1,
                              padding: '8px 12px',
                              background: 'white',
                              border: '1px solid #d1d5db',
                              borderRadius: '12px',
                              fontSize: '14px',
                              outline: 'none',
                              transition: 'all 0.2s ease'
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.borderColor = '#6b7280';
                              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(107, 114, 128, 0.1)';
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.borderColor = '#d1d5db';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          />
                          <button
                            onClick={() => addComment(post.id)}
                            style={{
                              padding: '8px 16px',
                              background: '#1f2937',
                              color: 'white',
                              borderRadius: '12px',
                              fontSize: '14px',
                              fontWeight: '600',
                              border: 'none',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#111827';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = '#1f2937';
                            }}
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
            <div style={{
              textAlign: 'center',
              padding: '64px 0'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📝</div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#6b7280',
                marginBottom: '8px'
              }}>
                {selectedCategory} 카테고리에 게시물이 없어요
              </h3>
              <p style={{
                color: '#9ca3af',
                marginBottom: '24px'
              }}>첫 번째 게시물을 작성해보세요!</p>
              <button
                onClick={() => setShowWriteModal(true)}
                style={{
                  padding: '12px 24px',
                  background: '#1f2937',
                  color: 'white',
                  borderRadius: '16px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(31, 41, 55, 0.3)'
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
                + 게시물 작성하기
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 게시물 작성 모달 */}
      {showWriteModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
            width: '100%',
            maxWidth: '400px'
          }}>
            <div style={{ padding: '24px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
              }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  margin: 0
                }}>
                  새 게시물 작성
                </h3>
                <button 
                  onClick={() => setShowWriteModal(false)}
                  style={{
                    fontSize: '1.5rem',
                    color: '#6b7280',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#374151';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#6b7280';
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>내용</label>
                  <textarea
                    placeholder={`${selectedCategory}에 대한 이야기를 들려주세요...`}
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    style={{
                      width: '100%',
                      height: '128px',
                      padding: '16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '16px',
                      resize: 'none',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#6b7280';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(107, 114, 128, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#d1d5db';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div style={{
                  display: 'flex',
                  gap: '12px',
                  paddingTop: '16px'
                }}>
                  <button
                    onClick={() => setShowWriteModal(false)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: '#f3f4f6',
                      color: '#374151',
                      borderRadius: '16px',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#e5e7eb';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#f3f4f6';
                    }}
                  >
                    취소
                  </button>
                  <button
                    onClick={addPost}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: '#1f2937',
                      color: 'white',
                      borderRadius: '16px',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#111827';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#1f2937';
                    }}
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
