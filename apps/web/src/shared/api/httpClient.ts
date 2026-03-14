import { ApiError } from './apiError';

export async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const hasBody = init?.body != null;

  const res = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
    credentials: 'include',
    ...init,
    headers: {
      ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
      ...(init?.headers ?? {}),
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(data?.message ?? res.statusText ?? 'Request failed', res.status, data);
  }

  return data as T;
}
