import { PrismaClient } from '@prisma/client';
import { readFile } from 'fs/promises';
import { uploadToGCS } from './gcs.service';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config(); // .env 로드
const prisma = new PrismaClient();

/**
 * 개별 배지 생성
 */
async function createBadge(tag: string, badgeName: string, localImagePath: string) {
  try {
    const buffer = await readFile(localImagePath); // 이미지 읽기
    const imageUrl = await uploadToGCS(buffer, 'badges', 'image/png'); // GCS 업로드

    const badge = await prisma.badge.create({
      data: {
        tag,
        badge_name: badgeName,
        image_url: imageUrl,
      },
    });

    console.log(`✅ Badge created: ${badgeName} (${tag})`);
  } catch (err) {
    console.error(`❌ Failed to create badge [${tag}]:`, err);
  }
}

/**
 * 여러 뱃지 일괄 생성
 */
async function seedBadges() {
  const badgeData = [
    // { tag: '번아웃', badgeName: '불태웠냥', file: 'burnout.png' },
    // { tag: '소개팅 망함', badgeName: '외롭냥', file: 'date_fail.png' },
    // { tag: '다이어트 실패', badgeName: '살쪘냥', file: 'diet_fail.png' },
    // { tag: '시험 망함', badgeName: 'F냥', file: 'exam_fail.png' },
    // { tag: '현타', badgeName: '현자냥', file: 'hyunta.png' },
    // { tag: '당당하게 지각', badgeName: '꼽냥', file: 'late_confidently.png' },
    // { tag: '지각', badgeName: '늦었냥', file: 'late.png' },
    // { tag: '게으름', badgeName: '귀찮냥', file: 'laziness.png' },
    // { tag: '금연 실패', badgeName: '인생 쓰다냥', file: 'no_smoking_fail.png' },
    { tag: '늦잠', badgeName: '졸리냥', file: 'overslept.png' },
    { tag: '지나친 걱정', badgeName: '그냥', file: 'overthinking.png' },
    { tag: '미룸', badgeName: '안하냥', file: 'procrastination.png' },
    { tag: '이불킥', badgeName: '부끄럽냥', file: 'shy.png' },
  ];

  for (const badge of badgeData) {
    const imagePath = path.resolve(__dirname, `assets/badges/${badge.file}`);
    await createBadge(badge.tag, badge.badgeName, imagePath);
  }

  await prisma.$disconnect();
}

seedBadges();
