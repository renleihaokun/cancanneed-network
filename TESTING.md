# 测试指南

## 📋 测试概述

本项目使用 [Vitest](https://vitest.dev/) 作为测试框架，为核心 API 接口编写了单元测试。

### 测试覆盖范围

| 测试文件 | 测试数量 | 测试内容 |
|----------|----------|----------|
| `ip.test.ts` | 10 | IP 信息查询接口 |
| `ping.test.ts` | 4 | Ping 健康检查接口 |
| `speed.test.ts` | 10 | 测速相关接口 |
| `ai.test.ts` | 8 | AI 分析接口 |
| `routes.test.ts` | 11 | 路由兼容性和安全响应头 |
| **总计** | **43** | - |

---

## 🚀 运行测试

### 运行所有测试

```bash
npm test
```

### 监听模式（文件变化时自动运行）

```bash
npm run test:watch
```

### 生成覆盖率报告

```bash
npm run test:coverage
```

---

## 📁 测试文件结构

```
src/
├── __tests__/
│   ├── ip.test.ts           # IP 接口测试
│   ├── ping.test.ts         # Ping 接口测试
│   ├── speed.test.ts        # 测速接口测试
│   ├── ai.test.ts           # AI 分析接口测试
│   └── routes.test.ts       # 路由兼容性测试
├── handlers/
├── services/
├── routes/
└── ...
```

---

## 🧪 测试用例说明

### IP 接口测试 (`ip.test.ts`)

**正常情况测试：**
- ✅ 应返回 IP 信息
- ✅ 应返回正确的 IP 地址
- ✅ 应返回正确的 location 结构
- ✅ 应返回正确的 node 结构
- ✅ 应返回正确的 isp 结构
- ✅ rtt 应为数字类型

**异常情况测试：**
- ✅ 当没有 CF-Connecting-IP 时应返回默认 IP
- ✅ 应正确处理空的 CF-Connecting-IP

### Ping 接口测试 (`ping.test.ts`)

- ✅ 应返回 pong
- ✅ 应返回正确的 Content-Type
- ✅ 应设置正确的缓存控制头
- ✅ 应设置 CORS 头

### 测速接口测试 (`speed.test.ts`)

**下载测速测试：**
- ✅ 应拒绝非 GET 请求
- ✅ 应处理 OPTIONS 预检请求
- ✅ 应拒绝无效的 bytes 参数
- ✅ 应拒绝无效的 size 参数
- ✅ 应接受有效的 size 参数
- ✅ 应接受有效的 bytes 参数
- ✅ 应设置正确的 CORS 头

**测速点列表测试：**
- ✅ 应返回测速点列表
- ✅ 应设置正确的缓存控制头
- ✅ 应设置正确的 Content-Type

### AI 分析接口测试 (`ai.test.ts`)

**正常情况测试：**
- ✅ 应拒绝非 POST 请求
- ✅ 应接受有效的请求数据
- ✅ 应返回流式响应

**异常情况测试：**
- ✅ 应拒绝无效的 JSON 格式
- ✅ 应拒绝空请求体
- ✅ 应拒绝非对象类型的请求体
- ✅ 应拒绝数组类型的请求体
- ✅ 应正确处理超时情况

### 路由兼容性测试 (`routes.test.ts`)

**旧路由兼容测试：**
- ✅ 应重定向 /?act=get_ip_info 到 /api/legacy
- ✅ 应重定向 /?act=ping 到 /api/legacy
- ✅ 应重定向 /?act=speed_down 到 /api/legacy
- ✅ 应重定向 /?act=speed_locations 到 /api/legacy
- ✅ 应重定向 /?act=analyze 到 /api/legacy

**新路由测试：**
- ✅ 应正确处理 /api/ip
- ✅ 应正确处理 /api/ping

**404 处理测试：**
- ✅ 应返回 404 对于未知路由
- ✅ 应返回 404 对于不存在的页面

**安全响应头测试：**
- ✅ 应设置 X-Content-Type-Options
- ✅ 应设置 X-Frame-Options
- ✅ 应设置 X-XSS-Protection
- ✅ 应设置 Referrer-Policy

---

## 🔧 测试配置

### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
    environment: 'node',
    globals: true,
  },
});
```

---

## 📝 编写新测试

### 测试文件命名规范

- 测试文件应放在 `src/__tests__/` 目录下
- 文件名格式：`<模块名>.test.ts`
- 例如：`ip.test.ts`、`ping.test.ts`

### 测试用例编写规范

```typescript
import { describe, it, expect } from 'vitest';
import app from '../app';

describe('模块名称', () => {
  describe('接口路径', () => {
    it('测试描述', async () => {
      // 1. 准备测试数据
      const res = await app.request('/api/xxx', {
        method: 'GET',
        headers: {
          'CF-Connecting-IP': '192.168.1.1',
        },
      });

      // 2. 验证响应状态码
      expect(res.status).toBe(200);

      // 3. 验证响应数据
      const data = await res.json();
      expect(data).toHaveProperty('ip');
    });
  });
});
```

### 常用断言方法

```typescript
// 相等比较
expect(value).toBe(expected);

// 包含属性
expect(object).toHaveProperty('key');

// 数组包含
expect(array).toContain(item);

// 类型检查
expect(typeof value).toBe('string');

// 数字比较
expect(number).toBeGreaterThanOrEqual(0);

// 响应状态码
expect(response.status).toBe(200);
```

---

## 🐛 调试测试

### 查看详细输出

```bash
npm test -- --reporter=verbose
```

### 运行特定测试文件

```bash
npm test -- ip.test.ts
```

### 运行特定测试用例

```bash
npm test -- -t "应返回 IP 信息"
```

---

## ✅ 最佳实践

1. **测试独立性**：每个测试用例应该独立运行，不依赖其他测试
2. **清晰的测试名称**：测试名称应该清楚地描述测试内容
3. **完整的断言**：验证响应状态码、响应头、响应数据
4. **边界条件**：测试正常情况和异常情况
5. **保持简单**：每个测试用例只测试一个功能点

---

## 📚 相关资源

- [Vitest 官方文档](https://vitest.dev/)
- [Hono 测试文档](https://hono.dev/docs/guides/testing)
- [Cloudflare Workers 测试](https://developers.cloudflare.com/workers/testing/)

---

**最后更新**: 2026-06-10
