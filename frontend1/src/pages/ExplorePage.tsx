import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getFailposts, createFailpost, addFailpostReaction, getFailpostDetail } from "../api/failposts";
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

  // 실패 카테고리 목록 - CSS 아이콘으로 교체
  const failCategories = [
    { id: 'late', name: '지각', icon: null, iconType: 'clock' },
    { id: 'exam', name: '시험 망함', icon: null, iconType: 'document' },
    { id: 'procrastination', name: '미룸', icon: null, iconType: 'calendar' },
    { id: 'dating', name: '소개팅 망함', icon: null, iconType: 'heart' },
    { id: 'diet', name: '다이어트 실패', icon: null, iconType: 'scale' },
    { id: 'oversleep', name: '늦잠', icon: null, iconType: 'bed' },
    { id: 'reality', name: '현타', icon: null, iconType: 'lightning' },
    { id: 'overthinking', name: '지나친 걱정', icon: null, iconType: 'brain' },
    { id: 'cringe', name: '이불킥', icon: null, iconType: 'pillow' },
    { id: 'lazy', name: '게으름', icon: null, iconType: 'pause' },
    { id: 'burnout', name: '번아웃', icon: null, iconType: 'fire' },
    { id: 'smoking', name: '금연 실패', icon: null, iconType: 'no-smoking' },
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
      case 'document':
        return (
          <div style={{
            width: iconSize,
            height: iconSize,
            border: `2px solid ${iconColor}`,
            borderRadius: '2px',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '2px',
              left: '2px',
              right: '2px',
              height: '2px',
              backgroundColor: iconColor
            }}></div>
            <div style={{
              position: 'absolute',
              top: '6px',
              left: '2px',
              right: '2px',
              height: '2px',
              backgroundColor: iconColor
            }}></div>
          </div>
        );
      case 'calendar':
        return (
          <div style={{
            width: iconSize,
            height: iconSize,
            border: `2px solid ${iconColor}`,
            borderRadius: '2px',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '-2px',
              left: '3px',
              width: '2px',
              height: '4px',
              backgroundColor: iconColor
            }}></div>
            <div style={{
              position: 'absolute',
              top: '-2px',
              right: '3px',
              width: '2px',
              height: '4px',
              backgroundColor: iconColor
            }}></div>
            <div style={{
              position: 'absolute',
              top: '4px',
              left: '2px',
              right: '2px',
              height: '1px',
              backgroundColor: iconColor
            }}></div>
          </div>
        );
      case 'heart':
        return (
          <div style={{
            width: iconSize,
            height: iconSize,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              border: `2px solid ${iconColor}`,
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
              transform: 'rotate(-45deg)'
            }}></div>
          </div>
        );
      case 'scale':
        return (
          <div style={{
            width: iconSize,
            height: iconSize,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '12px',
              height: '2px',
              backgroundColor: iconColor,
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                left: '0',
                top: '-3px',
                width: '4px',
                height: '2px',
                backgroundColor: iconColor
              }}></div>
              <div style={{
                position: 'absolute',
                right: '0',
                top: '-3px',
                width: '4px',
                height: '2px',
                backgroundColor: iconColor
              }}></div>
            </div>
          </div>
        );
      case 'bed':
        return (
          <div style={{
            width: iconSize,
            height: iconSize,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '12px',
              height: '6px',
              border: `2px solid ${iconColor}`,
              borderRadius: '2px',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '-4px',
                left: '2px',
                width: '6px',
                height: '4px',
                backgroundColor: iconColor,
                borderRadius: '2px'
              }}></div>
            </div>
          </div>
        );
      case 'lightning':
        return (
          <div style={{
            width: iconSize,
            height: iconSize,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '0',
              height: '0',
              borderLeft: `4px solid transparent`,
              borderRight: `4px solid transparent`,
              borderBottom: `8px solid ${iconColor}`,
              transform: 'rotate(15deg)'
            }}></div>
          </div>
        );
      case 'brain':
        return (
          <div style={{
            width: iconSize,
            height: iconSize,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '10px',
              height: '10px',
              border: `2px solid ${iconColor}`,
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%'
            }}></div>
          </div>
        );
      case 'pillow':
        return (
          <div style={{
            width: iconSize,
            height: iconSize,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '12px',
              height: '8px',
              border: `2px solid ${iconColor}`,
              borderRadius: '4px'
            }}></div>
          </div>
        );
      case 'pause':
        return (
          <div style={{
            width: iconSize,
            height: iconSize,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2px'
          }}>
            <div style={{
              width: '3px',
              height: '10px',
              backgroundColor: iconColor,
              borderRadius: '1px'
            }}></div>
            <div style={{
              width: '3px',
              height: '10px',
              backgroundColor: iconColor,
              borderRadius: '1px'
            }}></div>
          </div>
        );
      case 'fire':
        return (
          <div style={{
            width: iconSize,
            height: iconSize,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '8px',
              height: '12px',
              border: `2px solid ${iconColor}`,
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
              transform: 'rotate(15deg)'
            }}></div>
          </div>
        );
      case 'no-smoking':
        return (
          <div style={{
            width: iconSize,
            height: iconSize,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              border: `2px solid ${iconColor}`,
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '14px',
                height: '2px',
                backgroundColor: iconColor,
                transform: 'translate(-50%, -50%) rotate(45deg)'
              }}></div>
            </div>
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
      
      // 각 게시물의 상세 정보를 가져와서 실제 반응 수를 설정
      const transformedPosts: Post[] = await Promise.all(
        fetchedPosts.map(async (post) => {
          try {
            const postDetail = await getFailpostDetail(post.id);
            
            // 반응 배열을 객체로 변환
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
              userReaction: null // TODO: 사용자의 현재 반응 상태를 가져오는 API가 있다면 여기서 설정
            };
          } catch (err) {
            console.error(`Failed to load reactions for post ${post.id}:`, err);
            // 실패한 경우 기본값 사용
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

  // 컴포넌트 마운트 시 게시물 로드
  useEffect(() => {
    loadPosts(selectedCategory);
  }, [selectedCategory]);

  // 반응 토글
  const toggleReaction = async (postId: string, reactionType: 'drink!' | 'me too' | 'it\'s okay') => {
    try {
      // 먼저 현재 상태를 확인하여 delta 값을 결정
      const currentPost = posts.find(post => post.id === postId);
      if (!currentPost) return;
      
      const currentUserReaction = currentPost.userReaction;
      let delta = 1; // 기본값: 반응 추가
      
      // 이미 같은 반응을 눌렀다면 제거
      if (currentUserReaction === reactionType) {
        delta = -1;
      }
      
      // 상태 업데이트
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          const newReactions = { ...post.reactions };
          const currentUserReaction = post.userReaction;
          
          // 이미 같은 반응을 눌렀다면 제거
          if (currentUserReaction === reactionType) {
            newReactions[reactionType] = Math.max(0, newReactions[reactionType] - 1);
            return { ...post, reactions: newReactions, userReaction: null };
          }
          
          // 다른 반응이 있었다면 제거
          if (currentUserReaction) {
            newReactions[currentUserReaction] = Math.max(0, newReactions[currentUserReaction] - 1);
          }
          
          // 새 반응 추가
          newReactions[reactionType] = newReactions[reactionType] + 1;
          return { ...post, reactions: newReactions, userReaction: reactionType };
        }
        return post;
      }));
      
      // 실제 API 호출 - 반응이 켜지면 1, 꺼지면 -1
      await addFailpostReaction(postId, reactionType, delta);
    } catch (err) {
      console.error('Failed to toggle reaction:', err);
    }
  };

  // 게시물 추가
  const addPost = async () => {
    if (!newPost.trim()) return;
    
    // 로그인 확인
    if (!isAuthenticated || !user?.id) {
      setError('로그인이 필요합니다.');
      navigate('/signin');
      return;
    }

    try {
      setLoading(true);
      
      // 실제 API 호출 - 로그인된 사용자의 실제 user_id 사용
      const result = await createFailpost({
        user_id: user.id,
        text: newPost,
        tag: selectedCategory,
        image: selectedImage || undefined
      });

      // 게시물 작성 성공 시 배지 획득 시도
      try {
        await obtainBadge(user.id, { tag: selectedCategory });
        console.log(`Badge obtained for category: ${selectedCategory}`);
      } catch (badgeError) {
        // 배지 획득 실패는 게시물 작성 성공에 영향을 주지 않음
        console.warn('Failed to obtain badge:', badgeError);
      }

      // 성공 시 게시물 목록 새로고침
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

  // 이미지 선택 핸들러
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
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.background = '#111827';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(31, 41, 55, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.background = '#1f2937';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(31, 41, 55, 0.3)';
              }
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
                onMouseEnter={(e) => {
                  if (selectedCategory !== category.name && !loading) {
                    e.currentTarget.style.background = '#e5e7eb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== category.name && !loading) {
                    e.currentTarget.style.background = '#f3f4f6';
                  }
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
        padding: '24px 16px'
      }}>
        {loading && posts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 0',
            color: '#6b7280'
          }}>
            {/* 커스텀 로딩 스피너 */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '32px'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                {/* 외부 원 */}
                <div style={{
                  position: 'absolute',
                  width: '80px',
                  height: '80px',
                  border: '4px solid #e5e7eb',
                  borderTop: '4px solid #1f2937',
                  borderRadius: '50%',
                  animation: 'spin 1.5s linear infinite'
                }}></div>
                
                {/* 내부 원 */}
                <div style={{
                  position: 'absolute',
                  width: '50px',
                  height: '50px',
                  border: '3px solid #f3f4f6',
                  borderBottom: '3px solid #6b7280',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite reverse'
                }}></div>
                
                {/* 중앙 점 */}
                <div style={{
                  width: '12px',
                  height: '12px',
                  background: '#1f2937',
                  borderRadius: '50%',
                  animation: 'pulse 2s ease-in-out infinite'
                }}></div>
              </div>
            </div>
            
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '12px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
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
            
            {/* CSS 애니메이션 정의 */}
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              
              @keyframes pulse {
                0%, 100% { 
                  opacity: 1;
                  transform: scale(1);
                }
                50% { 
                  opacity: 0.5;
                  transform: scale(0.8);
                }
              }
            `}</style>
          </div>
        ) : (
          /* 인스타그램 스타일 그리드 레이아웃 */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '24px',
            alignItems: 'start'
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
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.12)';
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.borderColor = '#f1f5f9';
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

                  {/* 고양이 반응 버튼 */}
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
                      {/* 한잔해~ (drink!) */}
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
                            justifyContent: 'center',
                            boxShadow: post.userReaction === 'drink!' 
                              ? '0 8px 25px rgba(245, 158, 11, 0.3)' 
                              : '0 4px 15px rgba(0, 0, 0, 0.1)',
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.1)';
                            e.currentTarget.style.boxShadow = post.userReaction === 'drink!' 
                              ? '0 12px 35px rgba(245, 158, 11, 0.4)' 
                              : '0 8px 25px rgba(0, 0, 0, 0.15)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = post.userReaction === 'drink!' 
                              ? '0 8px 25px rgba(245, 158, 11, 0.3)' 
                              : '0 4px 15px rgba(0, 0, 0, 0.1)';
                          }}
                        >
                          <img 
                            src="/assets/reaction/drink.png" 
                            alt="한잔해~" 
                            style={{
                              width: '100px',
                              height: '100px',
                              objectFit: 'cover',
                              filter: post.userReaction === 'drink!' ? 'brightness(1.1)' : 'none'
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

                      {/* 나도! (me too) */}
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
                            justifyContent: 'center',
                            boxShadow: post.userReaction === 'me too' 
                              ? '0 8px 25px rgba(59, 130, 246, 0.3)' 
                              : '0 4px 15px rgba(0, 0, 0, 0.1)',
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.1)';
                            e.currentTarget.style.boxShadow = post.userReaction === 'me too' 
                              ? '0 12px 35px rgba(59, 130, 246, 0.4)' 
                              : '0 8px 25px rgba(0, 0, 0, 0.15)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = post.userReaction === 'me too' 
                              ? '0 8px 25px rgba(59, 130, 246, 0.3)' 
                              : '0 4px 15px rgba(0, 0, 0, 0.1)';
                          }}
                        >
                          <img 
                            src="/assets/reaction/metoo.png" 
                            alt="나도!" 
                            style={{
                              width: '85px',
                              height: '85px',
                              objectFit: 'cover',
                              filter: post.userReaction === 'me too' ? 'brightness(1.1)' : 'none'
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

                      {/* 괜찮아 (it's okay) */}
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
                            justifyContent: 'center',
                            boxShadow: post.userReaction === 'it\'s okay' 
                              ? '0 8px 25px rgba(34, 197, 94, 0.3)' 
                              : '0 4px 15px rgba(0, 0, 0, 0.1)',
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.1)';
                            e.currentTarget.style.boxShadow = post.userReaction === 'it\'s okay' 
                              ? '0 12px 35px rgba(34, 197, 94, 0.4)' 
                              : '0 8px 25px rgba(0, 0, 0, 0.15)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = post.userReaction === 'it\'s okay' 
                              ? '0 8px 25px rgba(34, 197, 94, 0.3)' 
                              : '0 4px 15px rgba(0, 0, 0, 0.1)';
                          }}
                        >
                          <img 
                            src="/assets/reaction/thatsok.png" 
                            alt="괜찮아" 
                            style={{
                              width: '60px',
                              height: '60px',
                              objectFit: 'cover',
                              filter: post.userReaction === 'it\'s okay' ? 'brightness(1.1)' : 'none'
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
                {/* 깔끔한 빈 상태 아이콘 */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: '32px'
                }}>
                  <div style={{
                    width: '120px',
                    height: '120px',
                    background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '3px solid #e2e8f0',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                    position: 'relative'
                  }}>
                    {/* 문서 아이콘 */}
                    <div style={{
                      width: '50px',
                      height: '60px',
                      background: '#ffffff',
                      borderRadius: '6px',
                      border: '2px solid #cbd5e1',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}>
                      {/* 문서 라인들 */}
                      <div style={{
                        width: '30px',
                        height: '2px',
                        background: '#e2e8f0',
                        borderRadius: '1px'
                      }}></div>
                      <div style={{
                        width: '24px',
                        height: '2px',
                        background: '#e2e8f0',
                        borderRadius: '1px'
                      }}></div>
                      <div style={{
                        width: '28px',
                        height: '2px',
                        background: '#e2e8f0',
                        borderRadius: '1px'
                      }}></div>
                      
                      {/* 플러스 아이콘 */}
                      <div style={{
                        position: 'absolute',
                        bottom: '-8px',
                        right: '-8px',
                        width: '20px',
                        height: '20px',
                        background: '#1f2937',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(31, 41, 55, 0.3)'
                      }}>
                        <div style={{
                          width: '10px',
                          height: '2px',
                          background: 'white',
                          borderRadius: '1px',
                          position: 'relative'
                        }}>
                          <div style={{
                            position: 'absolute',
                            top: '-4px',
                            left: '4px',
                            width: '2px',
                            height: '10px',
                            background: 'white',
                            borderRadius: '1px'
                          }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '12px',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
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
        )}
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
                  onClick={() => {
                    setShowWriteModal(false);
                    setNewPost('');
                    setSelectedImage(null);
                  }}
                  style={{
                    fontSize: '1.5rem',
                    color: '#6b7280',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#1f2937';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#6b7280';
                  }}
                >
                  ×
                </button>
              </div>

              {/* 카테고리 표시 */}
              <div style={{
                padding: '8px 16px',
                background: '#f3f4f6',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#6b7280',
                marginBottom: '16px',
                textAlign: 'center'
              }}>
                {selectedCategory} 카테고리
              </div>

              {/* 게시물 내용 입력 */}
              <textarea
                placeholder="실패 경험을 공유해주세요..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                style={{
                  width: '100%',
                  height: '120px',
                  padding: '16px',
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  resize: 'none',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  marginBottom: '16px'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#6b7280';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(107, 114, 128, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />

              {/* 이미지 업로드 */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  이미지 첨부 (선택사항)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
                {selectedImage && (
                  <div style={{
                    marginTop: '8px',
                    padding: '8px',
                    background: '#f0f9ff',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#0369a1'
                  }}>
                    선택된 파일: {selectedImage.name}
                  </div>
                )}
              </div>

              {/* 버튼 */}
              <div style={{
                display: 'flex',
                gap: '12px'
              }}>
                <button
                  onClick={() => {
                    setShowWriteModal(false);
                    setNewPost('');
                    setSelectedImage(null);
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#f3f4f6',
                    color: '#6b7280',
                    borderRadius: '12px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#e5e7eb';
                    e.currentTarget.style.color = '#374151';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f3f4f6';
                    e.currentTarget.style.color = '#6b7280';
                  }}
                >
                  취소
                </button>
                <button
                  onClick={addPost}
                  disabled={!newPost.trim() || loading}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: (!newPost.trim() || loading) ? '#9ca3af' : '#1f2937',
                    color: 'white',
                    borderRadius: '12px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: (!newPost.trim() || loading) ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (newPost.trim() && !loading) {
                      e.currentTarget.style.background = '#111827';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (newPost.trim() && !loading) {
                      e.currentTarget.style.background = '#1f2937';
                    }
                  }}
                >
                  {loading ? '게시 중...' : '게시하기'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
