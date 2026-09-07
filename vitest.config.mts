import { defineConfig } from 'vitest/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

/**
 * Vitest 配置（A3 测试加固）
 *
 * - environment: node —— 本项目被测对象全部是纯计算模块（排盘 / 四化 / 起卦 / 检索），
 *   不依赖 DOM，无需 jsdom，跑得更快。
 * - alias '@' —— 与 tsconfig.json 的 paths 保持一致，测试里可直接 import '@/lib/...'
 *
 * 注：用 .mts 扩展名是为了让 Vite 以 ESM 加载本文件（.ts 会被当 CJS，触发
 * configLoader 警告）。package.json 未设 "type": "module"，故不能靠 package.json 解决。
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    reporters: ['default'],
  },
  resolve: {
    alias: {
      '@': rootDir,
    },
  },
});
