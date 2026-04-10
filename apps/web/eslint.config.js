import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist']),

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'simple-import-sort': simpleImportSort,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      ...reactHooks.configs.flat.recommended.rules,

      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      'react-hooks/incompatible-library': 'off',

      '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      // 🔥 Import sorting (FSD-friendly)
      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            // 1. React + external libs
            ['^react$', '^@?\\w'],

            // 2. Shared
            ['^@/shared(/.*|$)'],

            // 3. Entities
            ['^@/entities(/.*|$)'],

            // 4. Features
            ['^@/features(/.*|$)'],

            // 5. Widgets
            ['^@/widgets(/.*|$)'],

            // 6. Pages
            ['^@/pages(/.*|$)'],

            // 7. App (jeśli masz)
            ['^@/app(/.*|$)'],

            // 8. Parent imports
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],

            // 9. Same-folder imports
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],

            // 10. Styles
            ['^.+\\.?(css)$'],
          ],
        },
      ],

      'simple-import-sort/exports': 'warn',
    },
  },
]);
