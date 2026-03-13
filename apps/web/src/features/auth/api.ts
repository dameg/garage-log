import { http } from '@/shared/api/httpClient';
import type { LoginInput, LoginResponse, RegisterInput } from './types';

export async function register(payload: RegisterInput) {
  return http<LoginResponse>('http://localhost:3001/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function login(payload: LoginInput) {
  return http<LoginResponse>('http://localhost:3001/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
