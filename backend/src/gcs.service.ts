// backend/src/gcs.service.ts
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';

/**
 * Google Cloud Storage에 파일을 업로드하고, public URL을 반환합니다.
 * @param fileBuffer 업로드할 파일의 버퍼
 * @param folder 저장할 GCS 내 폴더명 (예: "badges" 또는 "failposts")
 * @param mimetype 파일의 MIME 타입 (예: image/png)
 * @returns 업로드된 이미지의 public URL
 */
export async function uploadToGCS(
  fileBuffer: Buffer,
  folder: string,
  mimetype: string,
): Promise<string> {
  const storage = new Storage(); // 환경변수로 인증 자동 처리
  const bucketName = process.env.GOOGLE_CLOUD_BUCKET!;
  console.log('GCS Bucket Name:', bucketName); // 디버그용

  const filename = `${folder}/${uuidv4()}`;
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(filename);

  await file.save(fileBuffer, {
    metadata: {
      contentType: mimetype,
    },
  });

  return `https://storage.googleapis.com/${bucketName}/${filename}`;
}
