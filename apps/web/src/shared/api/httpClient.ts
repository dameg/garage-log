import { ApiError } from './apiError';

export async function http<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(data?.message ?? 'Request failed', res.status, data);
  }

  return data;
}
