import axios from 'axios';
import apiClient from './axios';
import { z } from 'zod';

// Zod 스키마로 API 요청 본문의 타입을 정의하고 유효성을 검사합니다.
const createFailpostPayloadSchema = z.object({
  user_id: z.string(),
  text: z.string().min(1, { message: '내용을 입력해주세요.' }),
  tag: z.string().min(1, { message: '태그를 입력해주세요.' }),
  image: z.instanceof(File).optional(), // 이미지를 선택사항으로 변경
});

// 요청 본문의 타입을 스키마로부터 추론합니다.
type CreateFailpostPayload = z.infer<typeof createFailpostPayloadSchema>;

// Zod 스키마로 API 응답 타입을 정의합니다.
const createFailpostResponseSchema = z.object({
  message: z.literal('success'),
  failpost_id: z.string(),
});

/**
 * 새로운 실패 게시물을 생성하는 API 함수 (이미지 포함)
 * @param payload - user_id, text, tag, image를 포함하는 객체
 * @returns 성공 시 "success" 메시지와 생성된 failpost_id
 */
export const createFailpost = async (payload: CreateFailpostPayload) => {
  try {
    // 보내기 전에 데이터 유효성 검사
    createFailpostPayloadSchema.parse(payload);

    const formData = new FormData();
    formData.append('user_id', payload.user_id);
    formData.append('text', payload.text);
    formData.append('tag', payload.tag);
    if (payload.image) {
      formData.append('image', payload.image);
    }

    const response = await apiClient.post('/failposts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // 응답 데이터의 유효성을 Zod 스키마로 검사합니다.
    const validatedResponse = createFailpostResponseSchema.parse(response.data);
    return validatedResponse;
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Zod 유효성 검사 오류
      console.error('Validation error:', error.flatten().fieldErrors);
      const firstError = Object.values(error.flatten().fieldErrors).flat()[0];
      throw new Error(String(firstError || '입력 값에 오류가 있습니다.'));
    }
    if (axios.isAxiosError(error)) {
      // Axios 오류
      const responseData = error.response?.data as { message?: unknown };
      let errorMessage = '서버와의 통신에 실패했습니다.';
      if (responseData && typeof responseData.message === 'string') {
        errorMessage = responseData.message;
      }
      console.error('Axios error:', errorMessage);
      throw new Error(String(errorMessage));
    }
    if (error instanceof Error) {
      // 일반 오류
      console.error('Unexpected error:', error.message);
      throw new Error(String(error.message));
    }
    // 최종 fallback
    console.error('An unknown error occurred:', error);
    throw new Error('알 수 없는 오류가 발생했습니다.');
  }
};
