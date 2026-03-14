import { http } from '@/shared/api/httpClient';
import type { LoginInput, LoginResponse, RegisterInput } from './types';

export const me = () => {
  return http<LoginResponse>(`/auth/me`, {
    method: 'GET',
  });
};

export async function register(payload: RegisterInput) {
  return http<RegisterInput>(`/auth/register`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function login(payload: LoginInput) {
  return http<LoginResponse>(`/auth/login`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function logout() {
  return http<void>(`/auth/logout`, {
    method: 'POST',
  });
}
