import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
    exclude: ['dist/**', 'node_modules/**', 'src/**/*.e2e.test.ts', 'src/**/*.db.e2e.test.ts'],
    pool: 'forks',
    maxWorkers: 1,
    testTimeout: 10000,
  },
});
