/**
 * Ping 健康检查处理器
 * 用于检测服务是否正常运行
 */

import type { Context } from 'hono';

/**
 * 处理 Ping 请求
 * @param c - Hono Context
 * @returns "pong" 响应
 */
export async function ping(c: Context) {
  console.log('[Ping] Health check');

  return new Response('pong', {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
