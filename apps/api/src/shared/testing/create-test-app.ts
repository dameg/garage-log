import { buildApp } from '../../app';
import { createTestDeps } from '../di/test';

export async function createTestApp() {
  const app = await buildApp(createTestDeps());
  await app.ready();
  return app;
}
