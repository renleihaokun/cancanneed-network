/**
 * 路由兼容性测试
 * 测试旧路由（/?act=xxx）的重定向功能
 */

import { describe, it, expect } from 'vitest';
import app from '../app';

describe('路由兼容性', () => {
  // 测试旧路由重定向
  describe('旧路由兼容', () => {
    it('应重定向 /?act=get_ip_info 到 /api/legacy', async () => {
      const res = await app.request('/?act=get_ip_info', {
        method: 'GET',
      });

      expect(res.status).toBe(302);
      expect(res.headers.get('location')).toContain('/api/legacy?act=get_ip_info');
    });

    it('应重定向 /?act=ping 到 /api/legacy', async () => {
      const res = await app.request('/?act=ping', {
        method: 'GET',
      });

      expect(res.status).toBe(302);
      expect(res.headers.get('location')).toContain('/api/legacy?act=ping');
    });

    it('应重定向 /?act=speed_down 到 /api/legacy', async () => {
      const res = await app.request('/?act=speed_down', {
        method: 'GET',
      });

      expect(res.status).toBe(302);
      expect(res.headers.get('location')).toContain('/api/legacy?act=speed_down');
    });

    it('应重定向 /?act=speed_locations 到 /api/legacy', async () => {
      const res = await app.request('/?act=speed_locations', {
        method: 'GET',
      });

      expect(res.status).toBe(302);
      expect(res.headers.get('location')).toContain('/api/legacy?act=speed_locations');
    });

    it('应重定向 /?act=analyze 到 /api/legacy', async () => {
      const res = await app.request('/?act=analyze', {
        method: 'GET',
      });

      expect(res.status).toBe(302);
      expect(res.headers.get('location')).toContain('/api/legacy?act=analyze');
    });
  });

  // 测试新路由
  describe('新路由', () => {
    it('应正确处理 /api/ip', async () => {
      const res = await app.request('/api/ip', {
        method: 'GET',
      });

      expect(res.status).toBe(200);
    });

    it('应正确处理 /api/ping', async () => {
      const res = await app.request('/api/ping', {
        method: 'GET',
      });

      expect(res.status).toBe(200);
    });
  });

  // 测试 404 处理
  describe('404 处理', () => {
    it('应返回 404 对于未知路由', async () => {
      const res = await app.request('/api/unknown', {
        method: 'GET',
      });

      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data).toHaveProperty('error');
      expect(data.error).toBe('Not Found');
    });

    it('应返回 404 对于不存在的页面', async () => {
      const res = await app.request('/nonexistent', {
        method: 'GET',
      });

      expect(res.status).toBe(404);
    });
  });

  // 测试安全响应头
  describe('安全响应头', () => {
    it('应设置 X-Content-Type-Options', async () => {
      const res = await app.request('/api/ping', {
        method: 'GET',
      });

      expect(res.headers.get('x-content-type-options')).toBe('nosniff');
    });

    it('应设置 X-Frame-Options', async () => {
      const res = await app.request('/api/ping', {
        method: 'GET',
      });

      expect(res.headers.get('x-frame-options')).toBe('DENY');
    });

    it('应设置 X-XSS-Protection', async () => {
      const res = await app.request('/api/ping', {
        method: 'GET',
      });

      expect(res.headers.get('x-xss-protection')).toBe('1; mode=block');
    });

    it('应设置 Referrer-Policy', async () => {
      const res = await app.request('/api/ping', {
        method: 'GET',
      });

      expect(res.headers.get('referrer-policy')).toBe('strict-origin-when-cross-origin');
    });
  });
});
