import { http } from '@/shared/api';

import type { AuthResponse } from '../model';

import type { LoginInput, RegisterInput } from './auth.contracts';

export function me() {
  return http<AuthResponse>(`/auth/me`, {
    method: 'GET',
  });
}

export function login(input: LoginInput) {
  return http<AuthResponse>(`/auth/login`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function register(input: RegisterInput) {
  return http<AuthResponse>(`/auth/register`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function logout() {
  return http<void>(`/auth/logout`, {
    method: 'POST',
  });
}
