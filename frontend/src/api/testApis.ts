import { createUser, loginUser } from './auth';
import { createFailpost, getFailposts, getFailpostDetail, deleteFailpost, addFailpostReaction } from './failposts';
import { getUserInfo, getUserFailposts, obtainBadge } from './users';

async function runApiTests() {
  // 회원가입 테스트 (필요 시 주석 해제)
  // try {
  //   const userRes = await createUser({
  //     email: 'test1@example.com',
  //     password: '12345678',
  //     nickname: '테스터',
  //   });
  //   console.log('✅ createUser:', userRes);
  // } catch (err) {
  //   console.error('❌ createUser error:', err);
  // }

  // 로그인 및 연계 테스트
  try {
    const loginRes = await loginUser({
      email: 'test1@example.com',
      password: '12345678',
    });
    console.log('✅ loginUser:', loginRes);

    if (loginRes.user_id) {
      const userId = loginRes.user_id;

      // get_user_info 테스트
      // try {
      //   const userInfo = await getUserInfo(userId);
      //   console.log('✅ getUserInfo:', userInfo);
      // } catch (err) {
      //   console.error('❌ getUserInfo error:', err instanceof Error ? err.message : err);
      // }

      // get_user_failposts 테스트
      // try {
      //   const failposts = await getUserFailposts(userId);
      //   console.log('✅ getUserFailposts:', failposts);
      // } catch (err) {
      //   console.error('❌ getUserFailposts error:', err instanceof Error ? err.message : err);
      // }

      // 뱃지 획득 테스트
      // try {
      //   const badgeRes = await obtainBadge(userId, { tag: '미룸' });
      //   console.log('✅ obtainBadge:', badgeRes);
      // } catch (err) {
      //   console.error('❌ obtainBadge error:', err instanceof Error ? err.message : err);
      // }

      // 실패 게시물 생성 테스트 (이미지 없이)
      // try {
      //   const failpostRes = await createFailpost({
      //     user_id: userId,
      //     text: '오늘도 어김없이 침대에서 나오지 못했다...',
      //     tag: '미룸',
      //   });
      //   console.log('✅ createFailpost:', failpostRes);
      // } catch (err) {
      //   console.error('❌ createFailpost error:', err instanceof Error ? err.message : err);
      // }

      // 전체 실패 게시물 목록 조회 테스트
      // try {
      //   const allFailposts = await getFailposts();
      //   console.log('✅ getFailposts (all):', allFailposts);
      // } catch (err) {
      //   console.error('❌ getFailposts (all) error:', err instanceof Error ? err.message : err);
      // }

      // '미룸' 태그로 필터링된 실패 게시물 목록 조회 테스트
      // try {
      //   const taggedFailposts = await getFailposts('미룸');
      //   console.log('✅ getFailposts (tagged):', taggedFailposts);
      // } catch (err) {
      //   console.error('❌ getFailposts (tagged) error:', err instanceof Error ? err.message : err);
      // }

      // 특정 ID로 상세 게시물 조회 테스트
      // try {
      //   const failpostId = 'e5b4969e-b599-406d-a0e3-acd338e776cb';
      //   const failpostDetail = await getFailpostDetail(failpostId);
      //   console.log('✅ getFailpostDetail:', failpostDetail);
      // } catch (err) {
      //   console.error('❌ getFailpostDetail error:', err instanceof Error ? err.message : err);
      // }

      // 게시물 삭제 테스트
      // try {
      //   const failpostIdToDelete = '5480209d-fc78-40f1-9a86-a1dcce990b4c';
      //   const userIdForDelete = 'be64a536-3298-4165-8076-35819dd48798';
        
      //   const deleteRes = await deleteFailpost(failpostIdToDelete, userIdForDelete);
      //   console.log('✅ deleteFailpost:', deleteRes);
      // } catch (err) {
      //   console.error('❌ deleteFailpost test error:', err instanceof Error ? err.message : err);
      // }
      // 게시물 리액션 추가 테스트
      try {
        const targetFailpostId = 'c758a67e-5078-4335-8d6e-98decf66fa7f'; // 여기에 실제 존재하는 failpost ID 사용
        const reaction = await addFailpostReaction(targetFailpostId, "it's okay")
        console.log('✅ addFailpostReaction:', reaction);
      } catch (err) {
        console.error('❌ addFailpostReaction error:', err instanceof Error ? err.message : err);
      }
      
      
    }
  } catch (err) {
    console.error('❌ loginUser error:', err instanceof Error ? err.message : err);
  }
}

runApiTests();
