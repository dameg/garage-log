import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const vitestGlobals = {
  ...globals.node,
  afterAll: 'readonly',
  afterEach: 'readonly',
  beforeAll: 'readonly',
  beforeEach: 'readonly',
  describe: 'readonly',
  expect: 'readonly',
  it: 'readonly',
  test: 'readonly',
  vi: 'readonly',
};

export default defineConfig([
  globalIgnores(['dist']),

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ['**/*.{js,cjs,mjs,ts}'],
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            ['^node:', '^@?\\w'],
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'warn',
    },
  },

  {
    files: ['**/*.{test,spec}.ts', 'vitest.setup.ts'],
    languageOptions: {
      globals: vitestGlobals,
    },
  },
]);
