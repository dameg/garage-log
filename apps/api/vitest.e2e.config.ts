import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    pool: 'forks',
    fileParallelism: false,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.e2e.test.ts', 'src/**/*.db.e2e.test.ts'],
    exclude: ['dist/**', 'node_modules/**'],
  },
});
