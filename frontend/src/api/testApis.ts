import { createUser, loginUser } from './auth';
import { createFailpost } from './failposts';
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
      try {
        const failpostRes = await createFailpost({
          user_id: userId,
          text: '오늘도 어김없이 침대에서 나오지 못했다...',
          tag: '미룸',
        });
        console.log('✅ createFailpost:', failpostRes);
      } catch (err) {
        console.error('❌ createFailpost error:', err instanceof Error ? err.message : err);
      }
    }
  } catch (err) {
    console.error('❌ loginUser error:', err instanceof Error ? err.message : err);
  }
}

runApiTests();
