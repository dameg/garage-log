import { createTestAppContainer } from '../di/test';
import type { AppContainer } from '../di/types';

import { registerAndGetCookie } from './register-and-get-cookie';

import { buildApp } from '@/app';

export type TestAppHarness = {
  app: Awaited<ReturnType<typeof buildApp>>;
  container: AppContainer;
  close: () => Promise<void>;
  registerAndGetCookie: (email?: string) => Promise<{
    email: string;
    cookie: string;
  }>;
};

export async function createTestApp(
  overrides: Partial<AppContainer> = {},
): Promise<TestAppHarness> {
  const container: AppContainer = {
    ...createTestAppContainer(),
    ...overrides,
  };

  const app = await buildApp(container);
  await app.ready();

  return {
    app,
    container,
    close: () => app.close(),
    registerAndGetCookie: (email?: string) => registerAndGetCookie(app, email),
  };
}
