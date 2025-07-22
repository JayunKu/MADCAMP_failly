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

// Zod 스키마로 addFailpostReaction 요청 및 응답 타입을 정의합니다.
// const addReactionPayloadSchema = z.object({
//   reaction_type: z.string(),
// });

//type AddReactionPayload = z.infer<typeof addReactionPayloadSchema>;

const addReactionResponseSchema = z.object({
  message: z.literal('success'),
});

/**
 * 실패 게시물에 반응을 추가하는 API 함수
 * @param failpostId - 반응을 추가할 실패 게시물의 ID
 * @param payload - 추가할 반응의 종류를 포함하는 객체
 * @returns 성공 시 "success" 메시지
 */
export const addFailpostReaction = async (failpostId: string, reactionType: string, delta: number) => {
  try {
    const payload = { reaction_type: reactionType, delta: delta, };
    console.log('add_failpost_reaction call : ', reactionType);
    const response = await apiClient.post(`/failposts/${failpostId}/reactions`, payload);

    const validatedResponse = addReactionResponseSchema.parse(response.data);
    return validatedResponse;
  } catch (error) {
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
    if (error instanceof z.ZodError) {
      // Zod 유효성 검사 오류
      console.error('Validation error:', error.flatten().fieldErrors);
      throw new Error('요청 또는 응답 데이터 형식이 올바르지 않습니다.');
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

// Zod 스키마로 deleteFailpost 응답 타입을 정의합니다.
const deleteFailpostResponseSchema = z.object({
  message: z.literal('success'),
});

/**
 * 특정 실패 게시물을 삭제하는 API 함수
 * @param failpostId - 삭제할 실패 게시물의 ID
 * @param userId - 삭제를 요청하는 사용자의 ID
 * @returns 성공 시 "success" 메시지
 */
export const deleteFailpost = async (failpostId: string, userId: string) => {
  try {
    const response = await apiClient.delete(`/failposts/${failpostId}`, {
      params: { user_id: userId },
    });

    // 응답 데이터의 유효성을 Zod 스키마로 검사합니다.
    const validatedResponse = deleteFailpostResponseSchema.parse(response.data);
    return validatedResponse;
  } catch (error) {
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
    if (error instanceof z.ZodError) {
      // Zod 유효성 검사 오류
      console.error('Response validation error:', error.flatten().fieldErrors);
      throw new Error('서버로부터 받은 데이터 형식이 올바르지 않습니다.');
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

// Zod 스키마로 getFailpostDetail 응답 타입을 정의합니다.
const reactionSchema = z.object({
  type: z.string(),
  count: z.number(),
});

const failpostDetailSchema = z.object({
  id: z.string(),
  text: z.string(),
  tag: z.string(),
  image_url: z.string(),
  created_at: z.string().datetime(),
  reactions: z.array(reactionSchema),
});

const getFailpostDetailResponseSchema = z.object({
  message: z.literal('success'),
  failpost: failpostDetailSchema,
});

/**
 * 특정 실패 게시물의 상세 정보를 가져오는 API 함수
 * @param failpostId - 조회할 실패 게시물의 ID
 * @returns 성공 시 실패 게시물 상세 정보
 */
export const getFailpostDetail = async (failpostId: string) => {
  try {
    const response = await apiClient.get(`/failposts/${failpostId}`);

    // 응답 데이터의 유효성을 Zod 스키마로 검사합니다.
    const validatedResponse = getFailpostDetailResponseSchema.parse(response.data);
    return validatedResponse.failpost;
  } catch (error) {
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
    if (error instanceof z.ZodError) {
      // Zod 유효성 검사 오류
      console.error('Response validation error:', error.flatten().fieldErrors);
      throw new Error('서버로부터 받은 데이터 형식이 올바르지 않습니다.');
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

// Zod 스키마로 getFailposts 응답 타입을 정의합니다.
const failpostSchema = z.object({
  id: z.string(),
  user_id: z.string(), // 스펙에는 number로 되어있으나, 프로젝트 전반적으로 string(uuid)를 사용하므로 string으로 정의
  nickname: z.string(),
  text: z.string(),
  tag: z.string(),
  image_url: z.string(),
  created_at: z.string().datetime(),
});

const getFailpostsResponseSchema = z.object({
  message: z.literal('success'),
  failposts: z.array(failpostSchema),
});

/**
 * 실패 게시물 목록을 가져오는 API 함수
 * @param tag - (선택 사항) 특정 태그의 게시물만 필터링
 * @returns 성공 시 실패 게시물 배열
 */
export const getFailposts = async (tag?: string) => {
  try {
    const response = await apiClient.get('/failposts', {
      params: tag ? { tag } : {},
    });

    // 응답 데이터의 유효성을 Zod 스키마로 검사합니다.
    const validatedResponse = getFailpostsResponseSchema.parse(response.data);
    return validatedResponse.failposts;
  } catch (error) {
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
    if (error instanceof z.ZodError) {
      // Zod 유효성 검사 오류
      console.error('Response validation error:', error.flatten().fieldErrors);
      throw new Error('서버로부터 받은 데이터 형식이 올바르지 않습니다.');
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
