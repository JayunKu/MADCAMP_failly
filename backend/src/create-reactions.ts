import { PrismaClient } from '@prisma/client';
import { readdir, readFile } from 'fs/promises';
import { uploadToGCS } from './gcs.service';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config(); // .env 로드
const prisma = new PrismaClient();

/**
 * 개별 리액션 생성
 */
async function createReaction(reactionType: string, localImagePath: string) {
  try {
    const buffer = await readFile(localImagePath); // 이미지 읽기
    const imageUrl = await uploadToGCS(buffer, 'reactions', 'image/png'); // GCS 업로드

    const reaction = await prisma.reaction.create({
      data: {
        reaction_type: reactionType,
        image_url: imageUrl,
      },
    });

    console.log(`✅ Reaction created: ${reactionType}`);
  } catch (err) {
    console.error(`❌ Failed to create reaction [${reactionType}]:`, err);
  }
}

/**
 * 여러 리액션 일괄 생성
 */
async function seedReactions() {
  const reactionsDir = path.resolve(__dirname, 'assets/reactions');
  const files = await readdir(reactionsDir);

  for (const file of files) {
    if (file.endsWith('.png')) {
      const imagePath = path.join(reactionsDir, file);
      const reactionType = file.replace('reaction_', '').replace('.png', '').replace(/_/g, ' ');
      await createReaction(reactionType, imagePath);
    }
  }

  await prisma.$disconnect();
}

seedReactions();
