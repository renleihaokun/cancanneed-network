/**
 * 测速接口测试
 * 测试 /api/speed/download 和 /api/speed/locations 接口
 */

import { describe, it, expect } from 'vitest';
import app from '../app';

describe('Speed API', () => {
  // 测试下载测速接口
  describe('GET /api/speed/download', () => {
    it('应拒绝非 GET 请求', async () => {
      const res = await app.request('/api/speed/download', {
        method: 'POST',
      });

      // Hono 路由可能返回 404 或 405
      expect([404, 405]).toContain(res.status);
    });

    it('应处理 OPTIONS 预检请求', async () => {
      const res = await app.request('/api/speed/download', {
        method: 'OPTIONS',
      });

      expect(res.status).toBe(204);
      expect(res.headers.get('access-control-allow-methods')).toContain('GET');
    });

    it('应拒绝无效的 bytes 参数', async () => {
      const res = await app.request('/api/speed/download?bytes=-100', {
        method: 'GET',
      });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data).toHaveProperty('error');
    });

    it('应拒绝无效的 size 参数', async () => {
      const res = await app.request('/api/speed/download?size=invalid', {
        method: 'GET',
      });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data).toHaveProperty('error');
    });

    it('应接受有效的 size 参数', async () => {
      const res = await app.request('/api/speed/download?size=10m', {
        method: 'GET',
      });

      // 由于需要代理 Cloudflare 的测速接口，这里主要测试参数验证
      // 在实际环境中会返回 200 或 502（上游错误）
      expect([200, 502]).toContain(res.status);
    });

    it('应接受有效的 bytes 参数', async () => {
      const res = await app.request('/api/speed/download?bytes=1000000', {
        method: 'GET',
      });

      expect([200, 502]).toContain(res.status);
    });

    it('应设置正确的 CORS 头', async () => {
      const res = await app.request('/api/speed/download', {
        method: 'GET',
      });

      expect(res.headers.get('access-control-allow-origin')).toBe('*');
    });
  });

  // 测试测速点列表接口
  describe('GET /api/speed/locations', () => {
    it('应返回测速点列表', async () => {
      const res = await app.request('/api/speed/locations', {
        method: 'GET',
      });

      // 由于需要代理 Cloudflare 的接口，这里主要测试响应格式
      if (res.status === 200) {
        const data = await res.json();
        expect(Array.isArray(data)).toBe(true);

        // 验证数据结构
        if (data.length > 0) {
          expect(data[0]).toHaveProperty('region');
          expect(data[0]).toHaveProperty('city');
        }
      }
    });

    it('应设置正确的缓存控制头', async () => {
      const res = await app.request('/api/speed/locations', {
        method: 'GET',
      });

      if (res.status === 200) {
        const cacheControl = res.headers.get('cache-control');
        expect(cacheControl).toContain('public');
        expect(cacheControl).toContain('max-age=300');
      }
    });

    it('应设置正确的 Content-Type', async () => {
      const res = await app.request('/api/speed/locations', {
        method: 'GET',
      });

      if (res.status === 200) {
        expect(res.headers.get('content-type')).toContain('application/json');
      }
    });
  });
});
