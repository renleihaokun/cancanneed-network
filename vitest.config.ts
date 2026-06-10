import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // 测试文件匹配模式
    include: ['**/*.test.ts'],
    // 排除目录
    exclude: ['node_modules', 'dist'],
    // 测试环境
    environment: 'node',
    // 全局变量
    globals: true,
  },
});
