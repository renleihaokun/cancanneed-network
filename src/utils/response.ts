/**
 * 响应工具函数
 * 提供统一的响应格式和错误处理
 */

import type { Context } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

/**
 * 返回错误响应
 * @param c - Hono Context
 * @param message - 错误信息
 * @param status - HTTP 状态码
 * @returns Response
 */
export function errorResponse(c: Context, message: string, status: ContentfulStatusCode = 500) {
  console.error(`[Error] ${message}`);
  return c.json({ error: message }, status);
}

/**
 * 返回成功响应
 * @param c - Hono Context
 * @param data - 响应数据
 * @returns Response
 */
export function successResponse(c: Context, data: unknown) {
  return c.json(data);
}
