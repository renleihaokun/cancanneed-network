/**
 * IP 信息查询接口测试
 * 测试 /api/ip 接口的正常和异常情况
 */

import { describe, it, expect } from 'vitest';
import app from '../app';

describe('IP API', () => {
  // 测试正常返回情况
  describe('GET /api/ip', () => {
    it('应返回 IP 信息', async () => {
      const res = await app.request('/api/ip', {
        method: 'GET',
        headers: {
          'CF-Connecting-IP': '192.168.1.1',
        },
      });

      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain('application/json');

      const data = await res.json();
      expect(data).toHaveProperty('ip');
      expect(data).toHaveProperty('location');
      expect(data).toHaveProperty('node');
      expect(data).toHaveProperty('asn');
      expect(data).toHaveProperty('isp');
      expect(data).toHaveProperty('rtt');
    });

    it('应返回正确的 IP 地址', async () => {
      const testIp = '203.0.113.1';
      const res = await app.request('/api/ip', {
        method: 'GET',
        headers: {
          'CF-Connecting-IP': testIp,
        },
      });

      const data = await res.json();
      expect(data.ip).toBe(testIp);
    });

    it('当没有 CF-Connecting-IP 时应返回默认 IP', async () => {
      const res = await app.request('/api/ip', {
        method: 'GET',
      });

      const data = await res.json();
      expect(data.ip).toBe('0.0.0.0');
    });

    it('应返回正确的 location 结构', async () => {
      const res = await app.request('/api/ip', {
        method: 'GET',
      });

      const data = await res.json();
      expect(data.location).toHaveProperty('country');
      expect(data.location).toHaveProperty('region');
      expect(data.location).toHaveProperty('city');
      expect(typeof data.location.country).toBe('string');
      expect(typeof data.location.region).toBe('string');
      expect(typeof data.location.city).toBe('string');
    });

    it('应返回正确的 node 结构', async () => {
      const res = await app.request('/api/ip', {
        method: 'GET',
      });

      const data = await res.json();
      expect(data.node).toHaveProperty('code');
      expect(data.node).toHaveProperty('name');
      expect(data.node).toHaveProperty('iso');
    });

    it('应返回正确的 isp 结构', async () => {
      const res = await app.request('/api/ip', {
        method: 'GET',
      });

      const data = await res.json();
      expect(data.isp).toHaveProperty('name');
      expect(data.isp).toHaveProperty('raw');
      expect(typeof data.isp.name).toBe('string');
    });

    it('rtt 应为数字类型', async () => {
      const res = await app.request('/api/ip', {
        method: 'GET',
      });

      const data = await res.json();
      expect(typeof data.rtt).toBe('number');
      expect(data.rtt).toBeGreaterThanOrEqual(0);
    });
  });

  // 测试错误处理
  describe('错误处理', () => {
    it('应正确处理空的 CF-Connecting-IP', async () => {
      const res = await app.request('/api/ip', {
        method: 'GET',
        headers: {
          'CF-Connecting-IP': '',
        },
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.ip).toBe('0.0.0.0');
    });
  });
});
