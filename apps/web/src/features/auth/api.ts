import { http } from '@/shared/api/httpClient';
import type { AuthResponse, LoginInput, RegisterInput } from './types';

export function me() {
  return http<AuthResponse>(`/auth/me`, {
    method: 'GET',
  });
}

export function login(payload: LoginInput) {
  return http<AuthResponse>(`/auth/login`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function register(payload: RegisterInput) {
  return http<AuthResponse>(`/auth/register`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function logout() {
  return http<void>(`/auth/logout`, {
    method: 'POST',
  });
}
