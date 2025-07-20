// backend/src/gcs-test.ts
import { readFile } from 'fs/promises';
import { uploadToGCS } from './gcs.service';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../.env' }); // src 기준으로 상위 폴더에 있는 .env 명시


async function testUpload() {
  try {
    const buffer = await readFile('./test.png'); // 테스트용 이미지 경로
    const url = await uploadToGCS(buffer, 'test-uploads', 'image/png');
    console.log('✅ Uploaded to GCS:', url);
  } catch (err) {
    console.error('❌ Upload failed:', err);
  }
}

testUpload();
