import { config } from 'dotenv';
import path from 'path';
import { defineConfig } from 'vitest/config';

config({ path: path.resolve(__dirname, '.env.development') });

export default defineConfig({
  resolve: {
    alias: {
      '@': './',
    },
  },
  test: {
    environment: 'node',
    globals: true,
    pool: 'forks',
    fileParallelism: false,
    forceRerunTriggers: ['**/src/**/*.ts', '**/pages/**/*.ts*'],
    globalSetup: './src/tests/globalSetup.ts',
  },
});
