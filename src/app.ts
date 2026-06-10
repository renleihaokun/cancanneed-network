/**
 * Hono 应用实例
 * 配置中间件和路由
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Env } from '../types/env';
import apiRoutes from './routes/api';
import pageRoutes from './routes/pages';

const app = new Hono<{ Bindings: Env }>();

// 安全响应头中间件 - H5 修复
app.use('/*', async (c, next) => {
  await next();
  // 防止 MIME 类型嗅探攻击
  c.res.headers.set('X-Content-Type-Options', 'nosniff');
  // 防止 Clickjacking 攻击
  c.res.headers.set('X-Frame-Options', 'DENY');
  // XSS 防护
  c.res.headers.set('X-XSS-Protection', '1; mode=block');
  // 控制 Referer 信息
  c.res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
});

// CORS 中间件 - H4 修复：配置更严格的 CORS 策略
app.use('/api/*', cors({
  origin: '*', // 保持通配符，因为是公开 API
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
  maxAge: 86400,
  exposeHeaders: ['Content-Length'],
}));

// 请求日志中间件 - M1 优化：减少日志输出，只记录关键信息
app.use('/*', async (c, next) => {
  const start = Date.now();
  await next();
  const duration = Date.now() - start;
  // 只记录慢请求（超过 1 秒）
  if (duration > 1000) {
    console.warn(`[Slow] ${c.req.method} ${c.req.path} - ${duration}ms`);
  }
});

// API 路由
app.route('/api', apiRoutes);

// 页面路由（已在 pages.ts 中处理兼容逻辑）- H3 修复
app.route('/', pageRoutes);

// 404 处理
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404);
});

// 错误处理 - M7 修复：隐藏敏感错误信息
app.onError((err, c) => {
  console.error(`[Error] ${err.message}`);
  return c.json({ error: '服务器内部错误，请稍后重试' }, 500);
});

export default app;
