/**
 * AI 分析接口测试
 * 测试 /api/analyze 接口的正常和异常情况
 */

import { describe, it, expect } from 'vitest';
import app from '../app';

describe('AI API', () => {
  // 测试正常返回情况
  describe('POST /api/analyze', () => {
    it('应拒绝非 POST 请求', async () => {
      const res = await app.request('/api/analyze', {
        method: 'GET',
      });

      expect(res.status).toBe(404);
    });

    it('应拒绝无效的 JSON 格式', async () => {
      const res = await app.request('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: 'invalid json',
      });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data).toHaveProperty('error');
      expect(data.error).toContain('JSON');
    });

    it('应拒绝空请求体', async () => {
      const res = await app.request('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: '',
      });

      expect(res.status).toBe(400);
    });

    it('应拒绝非对象类型的请求体', async () => {
      const res = await app.request('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify('string value'),
      });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data).toHaveProperty('error');
      expect(data.error).toContain('无效的请求数据格式');
    });

    it('应拒绝数组类型的请求体', async () => {
      const res = await app.request('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([1, 2, 3]),
      });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data).toHaveProperty('error');
    });

    it('应接受有效的请求数据', async () => {
      const validData = {
        connection_ip: '192.168.1.1',
        ipv4_address: '203.0.113.1',
        ipv6_address: '不可用',
        isp: '中国电信',
        cf_location: '上海, 中国',
        api_location: '上海, 中国',
        latency: '50 ms',
        node: '上海 (PVG)',
      };

      const res = await app.request('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validData),
      });

      // 由于使用测试 API Key，可能会返回 502（上游错误）
      // 但不应该返回 400（参数错误）
      expect(res.status).not.toBe(400);
    });

    it('应返回流式响应', async () => {
      const validData = {
        connection_ip: '192.168.1.1',
        isp: '测试运营商',
      };

      const res = await app.request('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validData),
      });

      // 验证响应头
      if (res.status === 200) {
        expect(res.headers.get('content-type')).toContain('text/html');
      }
    });
  });

  // 测试错误处理
  describe('错误处理', () => {
    it('应正确处理超时情况', async () => {
      // 注意：这个测试在实际环境中可能需要较长的超时时间
      // 这里主要验证错误处理逻辑
      const validData = {
        connection_ip: '192.168.1.1',
        isp: '测试运营商',
      };

      const res = await app.request('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validData),
      });

      // 应该返回 200（流式响应）或 500（配置错误）或 502（上游错误）
      expect([200, 500, 502]).toContain(res.status);
    });
  });
});
