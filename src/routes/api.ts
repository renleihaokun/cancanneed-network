/**
 * API 路由
 * 定义所有 RESTful API 接口
 */

import { Hono } from 'hono';
import type { Env } from '../../types/env';
import * as ipHandler from '../handlers/ip';
import * as pingHandler from '../handlers/ping';
import * as speedHandler from '../handlers/speed';
import * as aiHandler from '../handlers/ai';

const api = new Hono<{ Bindings: Env }>();

// IP 信息查询
api.get('/ip', ipHandler.getIPInfo);

// Ping 健康检查
api.get('/ping', pingHandler.ping);

// 下载带宽测速
api.get('/speed/download', speedHandler.download);

// 测速点列表
api.get('/speed/locations', speedHandler.locations);

// AI 分析
api.post('/analyze', aiHandler.analyze);

// 兼容旧路由（/?act=xxx）
api.get('/legacy', (c) => {
  const action = c.req.query('act');
  console.log(`[Legacy Route] action: ${action}`);

  switch (action) {
    case 'get_ip_info':
      return ipHandler.getIPInfo(c);
    case 'ping':
      return pingHandler.ping(c);
    case 'speed_down':
      return speedHandler.download(c);
    case 'speed_locations':
      return speedHandler.locations(c);
    default:
      return c.json({ error: 'Unknown action' }, 400);
  }
});

// 兼容旧路由的 POST 请求
api.post('/legacy', async (c) => {
  const action = c.req.query('act');
  console.log(`[Legacy Route] POST action: ${action}`);

  if (action === 'analyze') {
    return aiHandler.analyze(c);
  }

  return c.json({ error: 'Unknown action' }, 400);
});

export default api;
