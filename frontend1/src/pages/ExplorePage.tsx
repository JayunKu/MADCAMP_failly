import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getFailposts, createFailpost, addFailpostReaction, getFailpostDetail, deleteFailpost } from "../api/failposts";
import { obtainBadge } from "../api/users";
import { useAuth } from "../contexts/AuthContext";

interface Post {
  id: string;
  user_id: string;
  nickname: string;
  text: string;
  tag: string;
  image_url: string;
  created_at: string;
  reactions: {
    'drink!': number;
    'me too': number;
    'it\'s okay': number;
  };
  userReaction?: 'drink!' | 'me too' | 'it\'s okay' | null;
}

export default function ExplorePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('지각');
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 실패 카테고리 목록
  const failCategories = [
    { id: 'late', name: '지각', iconType: 'clock' },
    { id: 'exam', name: '시험 망함', iconType: 'document' },
    { id: 'procrastination', name: '미룸', iconType: 'calendar' },
    { id: 'dating', name: '소개팅 망함', iconType: 'heart' },
    { id: 'diet', name: '다이어트 실패', iconType: 'scale' },
    { id: 'oversleep', name: '늦잠', iconType: 'bed' },
    { id: 'reality', name: '현타', iconType: 'lightning' },
    { id: 'overthinking', name: '지나친 걱정', iconType: 'brain' },
    { id: 'cringe', name: '이불킥', iconType: 'pillow' },
    { id: 'lazy', name: '게으름', iconType: 'pause' },
    { id: 'burnout', name: '번아웃', iconType: 'fire' },
    { id: 'smoking', name: '금연 실패', iconType: 'no-smoking' },
  ];

  // 아이콘 렌더링 함수
  const renderIcon = (iconType: string, isSelected: boolean) => {
    const iconColor = isSelected ? 'white' : '#6b7280';
    const iconSize = '16px';
    
    switch (iconType) {
      case 'clock':
        return (
          <div style={{
            width: iconSize,
            height: iconSize,
            borderRadius: '50%',
            border: `2px solid ${iconColor}`,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              position: 'absolute',
              width: '6px',
              height: '2px',
              backgroundColor: iconColor,
              transformOrigin: 'left center',
              transform: 'rotate(90deg)'
            }}></div>
            <div style={{
              position: 'absolute',
              width: '4px',
              height: '2px',
              backgroundColor: iconColor,
              transformOrigin: 'left center',
              transform: 'rotate(0deg)'
            }}></div>
          </div>
        );
      default:
        return <span style={{ color: iconColor }}>●</span>;
    }
  };

  // 시간 포맷 함수
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`;
    return `${Math.floor(diffInMinutes / 1440)}일 전`;
  };

  // 게시물 로드
  const loadPosts = async (tag?: string) => {
    try {
      setLoading(true);
      setError(null);
      const fetchedPosts = await getFailposts(tag);
      
      const transformedPosts: Post[] = await Promise.all(
        fetchedPosts.map(async (post) => {
          try {
            const postDetail = await getFailpostDetail(post.id);
            
            const reactions = {
              'drink!': 0,
              'me too': 0,
              'it\'s okay': 0
            };
            
            postDetail.reactions.forEach(reaction => {
              if (reaction.type === 'drink!' || reaction.type === 'me too' || reaction.type === 'it\'s okay') {
                reactions[reaction.type] = reaction.count;
              }
            });
            
            return {
              ...post,
              reactions,
              userReaction: null
            };
          } catch (err) {
            console.error(`Failed to load reactions for post ${post.id}:`, err);
            return {
              ...post,
              reactions: {
                'drink!': 0,
                'me too': 0,
                'it\'s okay': 0
              },
              userReaction: null
            };
          }
        })
      );
      
      setPosts(transformedPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : '게시물을 불러오는데 실패했습니다.');
      console.error('Failed to load posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts(selectedCategory);
  }, [selectedCategory]);

  // 반응 토글
  const toggleReaction = async (postId: string, reactionType: 'drink!' | 'me too' | 'it\'s okay') => {
    try {
      const currentPost = posts.find(post => post.id === postId);
      if (!currentPost) return;
      
      const currentUserReaction = currentPost.userReaction;
      let delta = 1;
      
      if (currentUserReaction === reactionType) {
        delta = -1;
      }
      
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          const newReactions = { ...post.reactions };
          const currentUserReaction = post.userReaction;
          
          if (currentUserReaction === reactionType) {
            newReactions[reactionType] = Math.max(0, newReactions[reactionType] - 1);
            return { ...post, reactions: newReactions, userReaction: null };
          }
          
          if (currentUserReaction) {
            newReactions[currentUserReaction] = Math.max(0, newReactions[currentUserReaction] - 1);
          }
          
          newReactions[reactionType] = newReactions[reactionType] + 1;
          return { ...post, reactions: newReactions, userReaction: reactionType };
        }
        return post;
      }));
      
      await addFailpostReaction(postId, reactionType, delta);
    } catch (err) {
      console.error('Failed to toggle reaction:', err);
    }
  };

  // 게시물 삭제
  const handleDeletePost = async (postId: string) => {
    if (!isAuthenticated || !user?.id) {
      setError('로그인이 필요합니다.');
      return;
    }

    if (!confirm('정말로 이 게시물을 삭제하시겠습니까?')) {
      return;
    }

    try {
      setLoading(true);
      await deleteFailpost(postId, user.id);
      
      setPosts(prev => prev.filter(post => post.id !== postId));
    } catch (err) {
      setError(err instanceof Error ? err.message : '게시물 삭제에 실패했습니다.');
      console.error('Failed to delete post:', err);
    } finally {
      setLoading(false);
    }
  };

  // 게시물 추가
  const addPost = async () => {
    if (!newPost.trim()) return;
    
    if (!isAuthenticated || !user?.id) {
      setError('로그인이 필요합니다.');
      navigate('/signin');
      return;
    }

    try {
      setLoading(true);
      
      const result = await createFailpost({
        user_id: user.id,
        text: newPost,
        tag: selectedCategory,
        image: selectedImage || undefined
      });

      try {
        await obtainBadge(user.id, { tag: selectedCategory });
        console.log(`Badge obtained for category: ${selectedCategory}`);
      } catch (badgeError) {
        console.warn('Failed to obtain badge:', badgeError);
      }

      await loadPosts(selectedCategory);
      
      setNewPost('');
      setSelectedImage(null);
      setShowWriteModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : '게시물 작성에 실패했습니다.');
      console.error('Failed to create post:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
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
            disabled={loading}
            style={{
              padding: '8px 16px',
              background: loading ? '#9ca3af' : '#1f2937',
              color: 'white',
              borderRadius: '12px',
              fontWeight: '600',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(31, 41, 55, 0.3)'
            }}
          >
            {loading ? '로딩...' : '+ 게시물 작성'}
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
                disabled={loading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  background: selectedCategory === category.name ? '#1f2937' : '#f3f4f6',
                  color: selectedCategory === category.name ? 'white' : '#374151',
                  boxShadow: selectedCategory === category.name ? '0 4px 15px rgba(31, 41, 55, 0.3)' : 'none',
                  opacity: loading ? 0.6 : 1
                }}
              >
                {renderIcon(category.iconType, selectedCategory === category.name)}
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div style={{
          maxWidth: '600px',
          margin: '16px auto',
          padding: '12px 16px',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '12px',
          color: '#dc2626',
          fontSize: '14px'
        }}>
          {error}
          <button
            onClick={() => setError(null)}
            style={{
              marginLeft: '8px',
              background: 'none',
              border: 'none',
              color: '#dc2626',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* 메인 피드 */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '24px 16px',
        position: 'relative',
        zIndex: 10
      }}>
        {loading && posts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 0',
            color: '#6b7280'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '12px'
            }}>
              게시물을 불러오는 중
            </h3>
            <p style={{
              fontSize: '16px',
              color: '#9ca3af',
              fontWeight: '500'
            }}>
              잠시만 기다려주세요...
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: posts.length === 1 
              ? '1fr' 
              : 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '24px',
            alignItems: 'start',
            maxWidth: posts.length === 1 ? '500px' : 'none',
            margin: posts.length === 1 ? '0 auto' : '0'
          }}>
            {posts.length > 0 ? (
              posts.map(post => (
                <div key={post.id} style={{
                  background: 'white',
                  borderRadius: '24px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                  border: '1px solid #f1f5f9',
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative'
                }}>
                
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
                      {post.nickname ? post.nickname[0] : 'U'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontWeight: '600',
                        color: '#1f2937',
                        margin: 0,
                        fontSize: '16px'
                      }}>{post.nickname || '익명'}</h3>
                      <p style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        margin: 0
                      }}>{formatTime(post.created_at)}</p>
                    </div>
                    <div style={{
                      padding: '4px 12px',
                      background: '#f3f4f6',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#6b7280'
                    }}>
                      {post.tag}
                    </div>
                    
                    {/* 삭제 버튼 - 본인 게시물만 표시 */}
                    {user?.id === post.user_id && (
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: '#fee2e2',
                          border: '1px solid #fecaca',
                          color: '#dc2626',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#fecaca';
                          e.currentTarget.style.color = '#b91c1c';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#fee2e2';
                          e.currentTarget.style.color = '#dc2626';
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>

                  {/* 게시물 내용 */}
                  <div style={{ padding: '0 16px 12px' }}>
                    <p style={{
                      color: '#374151',
                      lineHeight: '1.6',
                      margin: 0,
                      fontSize: '15px'
                    }}>{post.text}</p>
                  </div>

                  {/* 이미지 */}
                  {post.image_url && (
                    <div style={{ padding: '0 16px 12px' }}>
                      <img 
                        src={post.image_url} 
                        alt="게시물 이미지"
                        style={{
                          width: '100%',
                          borderRadius: '12px',
                          maxHeight: '300px',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  )}

                  {/* 반응 버튼 */}
                  <div style={{
                    padding: '16px',
                    borderTop: '1px solid #f3f4f6',
                    background: '#fafafa'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-around',
                      gap: '12px'
                    }}>
                      {/* 한잔해~ */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <button 
                          onClick={() => toggleReaction(post.id, 'drink!')}
                          style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: post.userReaction === 'drink!' 
                              ? 'linear-gradient(135deg, #fef3c7, #fde68a)' 
                              : 'linear-gradient(135deg, #ffffff, #f9fafb)',
                            border: post.userReaction === 'drink!' ? '3px solid #f59e0b' : '3px solid #e5e7eb',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <img 
                            src="/assets/reaction/drink.png" 
                            alt="한잔해~" 
                            style={{
                              width: '60px',
                              height: '60px',
                              objectFit: 'cover'
                            }}
                          />
                        </button>
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '2px'
                        }}>
                          <span style={{
                            fontSize: '11px',
                            fontWeight: '600',
                            color: post.userReaction === 'drink!' ? '#f59e0b' : '#6b7280'
                          }}>한잔해~</span>
                          <span style={{
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: post.userReaction === 'drink!' ? '#f59e0b' : '#9ca3af',
                            background: post.userReaction === 'drink!' ? '#fef3c7' : '#f3f4f6',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            minWidth: '24px',
                            textAlign: 'center'
                          }}>{post.reactions['drink!']}</span>
                        </div>
                      </div>

                      {/* 나도! */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <button 
                          onClick={() => toggleReaction(post.id, 'me too')}
                          style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: post.userReaction === 'me too' 
                              ? 'linear-gradient(135deg, #dbeafe, #bfdbfe)' 
                              : 'linear-gradient(135deg, #ffffff, #f9fafb)',
                            border: post.userReaction === 'me too' ? '3px solid #3b82f6' : '3px solid #e5e7eb',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <img 
                            src="/assets/reaction/metoo.png" 
                            alt="나도!" 
                            style={{
                              width: '60px',
                              height: '60px',
                              objectFit: 'cover'
                            }}
                          />
                        </button>
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '2px'
                        }}>
                          <span style={{
                            fontSize: '11px',
                            fontWeight: '600',
                            color: post.userReaction === 'me too' ? '#3b82f6' : '#6b7280'
                          }}>나도!</span>
                          <span style={{
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: post.userReaction === 'me too' ? '#3b82f6' : '#9ca3af',
                            background: post.userReaction === 'me too' ? '#dbeafe' : '#f3f4f6',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            minWidth: '24px',
                            textAlign: 'center'
                          }}>{post.reactions['me too']}</span>
                        </div>
                      </div>

                      {/* 괜찮아 */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <button 
                          onClick={() => toggleReaction(post.id, 'it\'s okay')}
                          style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: post.userReaction === 'it\'s okay' 
                              ? 'linear-gradient(135deg, #dcfce7, #bbf7d0)' 
                              : 'linear-gradient(135deg, #ffffff, #f9fafb)',
                            border: post.userReaction === 'it\'s okay' ? '3px solid #22c55e' : '3px solid #e5e7eb',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <img 
                            src="/assets/reaction/thatsok.png" 
                            alt="괜찮아" 
                            style={{
                              width: '60px',
                              height: '60px',
                              objectFit: 'cover'
                            }}
                          />
                        </button>
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '2px'
                        }}>
                          <span style={{
                            fontSize: '11px',
                            fontWeight: '600',
                            color: post.userReaction === 'it\'s okay' ? '#22c55e' : '#6b7280'
                          }}>괜찮아</span>
                          <span style={{
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: post.userReaction === 'it\'s okay' ? '#22c55e' : '#9ca3af',
                            background: post.userReaction === 'it\'s okay' ? '#dcfce7' : '#f3f4f6',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            minWidth: '24px',
                            textAlign: 'center'
                          }}>{post.reactions['it\'s okay']}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              ))
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '80px 0'
              }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '12px'
                }}>
                  {selectedCategory} 카테고리가 비어있어요
                </h3>
                <p style={{
                  fontSize: '16px',
                  color: '#9ca3af',
                  marginBottom: '32px',
                  fontWeight: '500'
                }}>첫 번째 게시물로 이야기를 시작해보세요</p>
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
                >
                  + 게시물 작성하기
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 게시물 작성 모달 */}
      {showWriteModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '16px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '24px',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: 0
              }}>새 게시물 작성</h2>
              <button
                onClick={() => setShowWriteModal(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#f3f4f6',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '18px',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>카테고리: {selectedCategory}</label>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="무슨 일이 있었나요?"
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '16px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>이미지 첨부 (선택사항)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              {selectedImage && (
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  marginTop: '8px'
                }}>선택된 파일: {selectedImage.name}</p>
              )}
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setShowWriteModal(false)}
                style={{
                  padding: '10px 20px',
                  background: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                취소
              </button>
              <button
                onClick={addPost}
                disabled={!newPost.trim() || loading}
                style={{
                  padding: '10px 20px',
                  background: (!newPost.trim() || loading) ? '#9ca3af' : '#1f2937',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '600',
                  cursor: (!newPost.trim() || loading) ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? '작성 중...' : '게시하기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
