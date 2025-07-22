import axios from 'axios';
import apiClient from './axios';
import { z } from 'zod';

// Zod 스키마로 API 응답의 user 객체 타입을 정의합니다.
const badgeSchema = z.object({
  badge_tag: z.string(),
  badge_name: z.string(),
  badge_image_url: z.string(),
});

const userSchema = z.object({
  id: z.string(), // 서버에서 string 타입의 UUID를 반환하므로 string으로 수정
  email: z.string().email(),
  nickname: z.string(),
  created_at: z.string().datetime(),
  current_badges: z.array(badgeSchema),
});

// API 전체 응답 타입을 정의합니다.
const userInfoResponseSchema = z.object({
  message: z.literal('success'),
  user: userSchema,
});

/**
 * 특정 사용자의 정보를 가져오는 API 함수
 * @param userId - 조회할 사용자의 ID
 * @returns 성공 시 사용자 정보가 담긴 객체
 */
export const getUserInfo = async (userId: string) => {
  try {
    // const token = localStorage.getItem('token'); // 예: 로컬 스토리지에서 토큰 가져오기
    const response = await apiClient.get(`/users/${userId}`, {
      // headers: {
      //   Authorization: `Bearer ${token}`, // 인증이 필요한 경우 헤더에 토큰 추가
      // },
    });

    // 응답 데이터의 유효성을 Zod 스키마로 검사합니다.
    const validatedResponse = userInfoResponseSchema.parse(response.data);
    return validatedResponse.user;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Axios 오류 (서버 응답 오류)
      const responseData = error.response?.data as { message?: unknown };
      let errorMessage = '서버와의 통신에 실패했습니다.';
      
      if (responseData && typeof responseData.message === 'string') {
        errorMessage = responseData.message;
      }
      
      console.error('Axios error:', errorMessage);
      throw new Error(String(errorMessage));
    }
    if (error instanceof z.ZodError) {
      // Zod 유효성 검사 오류 (응답 데이터 형식이 다를 경우)
      console.error('Response validation error:', error.flatten().fieldErrors);
      throw new Error('서버로부터 받은 데이터 형식이 올바르지 않습니다.');
    }
    if (error instanceof Error) {
      // 일반 오류
      console.error('Unexpected error:', error.message);
      throw new Error(String(error.message));
    }
    // 모든 경우를 처리하기 위한 최종 fallback
    console.error('An unknown error occurred:', error);
    throw new Error('알 수 없는 오류가 발생했습니다.');
  }
};

// Zod 스키마로 failpost 객체와 응답 타입을 정의합니다.
const failpostBadgeSchema = z.object({
  tag: z.string(),
  badge_name: z.string(),
});

const failpostSchema = z.object({
  id: z.string(),
  text: z.string(),
  tag: z.string(),
  image_id: z.string(),
  created_at: z.string().datetime(),
  badge: failpostBadgeSchema,
});

const userFailpostsResponseSchema = z.object({
  message: z.literal('success'),
  failposts: z.array(failpostSchema),
});

/**
 * 특정 사용자의 모든 실패 게시물을 가져오는 API 함수
 * @param userId - 조회할 사용자의 ID
 * @returns 성공 시 해당 사용자의 실패 게시물 배열
 */
export const getUserFailposts = async (userId: string) => {
  try {
    const response = await apiClient.get(`/users/${userId}/failposts`);

    // 응답 데이터의 유효성을 Zod 스키마로 검사합니다.
    const validatedResponse = userFailpostsResponseSchema.parse(response.data);
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

// Zod 스키마로 뱃지 획득 요청 및 응답 타입을 정의합니다.
const obtainBadgeBodySchema = z.object({
  tag: z.string(),
});

const obtainBadgeResponseSchema = z.object({
  message: z.literal('success'),
  badge: z.object({
    tag: z.string(),
    badge_name: z.string(),
  }),
  obtained_at: z.string(),
});

type ObtainBadgePayload = z.infer<typeof obtainBadgeBodySchema>;

/**
 * 특정 사용자가 뱃지를 획득하도록 하는 API 함수
 * @param userId - 뱃지를 획득할 사용자의 ID
 * @param payload - 획득할 뱃지의 태그를 포함하는 객체
 * @returns 성공 시 획득한 뱃지 정보
 */
export const obtainBadge = async (userId: string, payload: ObtainBadgePayload) => {
  try {
    obtainBadgeBodySchema.parse(payload);
    const response = await apiClient.post(`/users/${userId}/badges`, payload);

    // 응답 데이터의 유효성을 Zod 스키마로 검사합니다.
    const validatedResponse = obtainBadgeResponseSchema.parse(response.data);
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
