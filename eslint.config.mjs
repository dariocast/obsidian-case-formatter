import { defineConfig } from 'eslint/config';
import obsidianmd from 'eslint-plugin-obsidianmd';
import json from '@eslint/json';

export default defineConfig([
  {
    ignores: ['main.js', 'dist/**', 'node_modules/**', 'test-vault/**', 'tests/**', '**/*.mjs', '**/*.mts', 'docs/**'],
  },
  // Scope JavaScript-wide rules to code, not JSON's language-specific AST.
  ...obsidianmd.configs.recommended.map(config => config.files
    ? config
    : { ...config, files: ['**/*.{ts,js}'] }),
  {
    files: ['manifest.json'],
    plugins: { json, obsidianmd },
    language: 'json/json',
    rules: { 'obsidianmd/validate-manifest': 'error' },
  },
  {
    files: ['src/**/*.ts'],
    languageOptions: { parserOptions: { projectService: true } },
  },
]);
