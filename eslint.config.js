import eslint from '@eslint/js';
import tsEslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier/recommended';
import { defineConfig } from 'eslint/config';

export default defineConfig(
  eslint.configs.recommended,
  ...tsEslint.configs.recommended,
  {
    plugins: {},
    files: ['src/**/*.js'],
    ignores: ['**/*.config.js'],
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    rules: {
      indent: ['error', 2, { SwitchCase: 1 }],
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
    },
    languageOptions: {},
  },
  prettier,
);
