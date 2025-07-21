import axios from 'axios';
import apiClient from './axios';
import { z } from 'zod';

// Zod 스키마를 사용하여 요청 본문의 타입을 정의하고 유효성을 검사합니다.
const createUserSchema = z.object({
  email: z.string().email({ message: "유효하지 않은 이메일 주소입니다." }),
  password: z.string(),
  nickname: z.string()
});

// 요청 본문의 타입을 스키마로부터 추론합니다.
type CreateUserPayload = z.infer<typeof createUserSchema>;


// Zod 스키마로 로그인 요청 본문의 타입을 정의하고 유효성을 검사합니다.
const loginUserSchema = z.object({
  email: z.string().email({ message: "유효하지 않은 이메일 주소입니다." }),
  password: z.string(),
});

// 로그인 요청 본문의 타입을 스키마로부터 추론합니다.
type LoginUserPayload = z.infer<typeof loginUserSchema>;

/**
 * 새로운 사용자를 생성하는 create_user API 함수 (회원가입)
 * @param userData - email, password, nickname을 포함하는 객체
 * @returns 성공 시 "success" 메시지
 */
export const createUser = async (userData: CreateUserPayload) => {
  try {
    // 보내기 전에 데이터 유효성 검사
    createUserSchema.parse(userData);

    const response = await apiClient.post('/auth/signup', userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Zod 유효성 검사 오류
      const fieldErrors = error.flatten().fieldErrors;
      console.error('Validation error:', fieldErrors);
      const firstError = Object.values(fieldErrors).flat()[0];
      throw new Error(String(firstError || '입력 값에 오류가 있습니다.'));
    }
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

/**
 * 사용자를 로그인시키는 login API 함수
 * @param userData - email, password를 포함하는 객체
 * @returns 성공 시 "success" 메시지와 user_id
 */
export const loginUser = async (userData: LoginUserPayload) => {
  try {
    // 보내기 전에 데이터 유효성 검사
    loginUserSchema.parse(userData);

    const response = await apiClient.post('/auth/login', userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Zod 유효성 검사 오류
      const fieldErrors = error.flatten().fieldErrors;
      console.error('Validation error:', fieldErrors);
      const firstError = Object.values(fieldErrors).flat()[0];
      throw new Error(String(firstError || '입력 값에 오류가 있습니다.'));
    }
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
