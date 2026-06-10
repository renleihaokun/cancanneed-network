/**
 * Ping 健康检查接口测试
 * 测试 /api/ping 接口的正常情况
 */

import { describe, it, expect } from 'vitest';
import app from '../app';

describe('Ping API', () => {
  // 测试正常返回情况
  describe('GET /api/ping', () => {
    it('应返回 pong', async () => {
      const res = await app.request('/api/ping', {
        method: 'GET',
      });

      expect(res.status).toBe(200);
      const text = await res.text();
      expect(text).toBe('pong');
    });

    it('应返回正确的 Content-Type', async () => {
      const res = await app.request('/api/ping', {
        method: 'GET',
      });

      expect(res.headers.get('content-type')).toContain('text/plain');
    });

    it('应设置正确的缓存控制头', async () => {
      const res = await app.request('/api/ping', {
        method: 'GET',
      });

      const cacheControl = res.headers.get('cache-control');
      expect(cacheControl).toContain('no-store');
      expect(cacheControl).toContain('no-cache');
    });

    it('应设置 CORS 头', async () => {
      const res = await app.request('/api/ping', {
        method: 'GET',
      });

      expect(res.headers.get('access-control-allow-origin')).toBe('*');
    });
  });
});
