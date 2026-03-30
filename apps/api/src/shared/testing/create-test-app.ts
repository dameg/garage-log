import { buildApp } from '../../app';
import { createTestAppContainer } from '../di/test';

export async function createTestApp() {
  const app = await buildApp(createTestAppContainer());
  await app.ready();
  return app;
}
