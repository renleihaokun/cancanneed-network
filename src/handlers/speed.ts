/**
 * 测速处理器
 * 处理下载带宽测速和测速点列表查询
 */

import type { Context } from 'hono';
import { errorResponse } from '../utils/response';
import { localizeSpeedLocations } from '../utils/speed-locale-maps';

/** 测速下载最小字节数 */
const SPEED_MIN_BYTES = 1_000_000;

/** 测速下载最大字节数 */
const SPEED_MAX_BYTES = 200_000_000;

/**
 * 解析测速大小参数
 * @param param - 大小参数（如 "10m", "50mb", "1g"）
 * @returns 字节数，无效返回 null
 */
function parseSpeedSizeParam(param: string): number | null {
  const s = String(param || '').trim();
  if (!s) return 10_000_000;

  const match = s.match(/^(\d+)([a-z]{0,2})$/i);
  if (!match) return null;

  const size = parseInt(match[1], 10);
  if (!Number.isFinite(size) || size <= 0) return null;

  const unit = match[2].toLowerCase();
  const multipliers: Record<string, number> = {
    k: 1000,
    kb: 1000,
    m: 1_000_000,
    mb: 1_000_000,
    g: 1_000_000_000,
    gb: 1_000_000_000,
  };

  return size * (multipliers[unit] ?? 1);
}

/**
 * 处理下载测速请求
 * 代理 Cloudflare 的 __down 接口进行带宽测速
 * @param c - Hono Context
 * @returns 测速数据流响应
 */
export async function download(c: Context) {
  console.log('[Speed] Download test started');

  const request = c.req.raw;
  const baseHeaders: Record<string, string> = {
    'Access-Control-Allow-Origin': '*',
  };

  // 处理 CORS 预检请求
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        ...baseHeaders,
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  // 仅允许 GET 请求
  if (request.method !== 'GET') {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: baseHeaders,
    });
  }

  const url = new URL(request.url);
  const rawBytes = url.searchParams.get('bytes');
  let bytes: number;

  // 解析下载字节数
  if (rawBytes != null && rawBytes !== '') {
    bytes = parseInt(rawBytes, 10);
    if (!Number.isFinite(bytes) || bytes <= 0) {
      return errorResponse(c, 'bytes 无效', 400);
    }
  } else {
    const sizeParam = url.searchParams.get('size') || '10mb';
    const parsed = parseSpeedSizeParam(sizeParam);
    if (parsed == null) {
      return errorResponse(c, 'size 格式不正确，例如 10m、50mb、1g', 400);
    }
    bytes = parsed;
  }

  // 限制字节数范围
  bytes = Math.min(Math.max(bytes, SPEED_MIN_BYTES), SPEED_MAX_BYTES);

  console.log(`[Speed] Downloading ${bytes} bytes`);

  // 代理 Cloudflare 测速接口
  const targetUrl = `https://speed.cloudflare.com/__down?bytes=${bytes}`;
  const headers = new Headers();
  headers.set('referer', 'https://speed.cloudflare.com/');

  const upstream = await fetch(targetUrl, { method: 'GET', headers, redirect: 'follow' });

  if (!upstream.ok) {
    const errorText = await upstream.text();
    console.error(`[Speed] Upstream error: ${upstream.status}`);
    return new Response(errorText || '上游测速源错误', {
      status: upstream.status,
      headers: { ...baseHeaders, 'Cache-Control': 'no-store' },
    });
  }

  // 构建响应头
  const out = new Headers();
  const ct = upstream.headers.get('content-type');
  if (ct) out.set('content-type', ct);
  out.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  out.set('Access-Control-Allow-Origin', '*');

  console.log('[Speed] Download test completed');
  return new Response(upstream.body, { status: upstream.status, headers: out });
}

/**
 * 获取测速点列表
 * 从 Cloudflare 获取测速点并翻译为中文
 * @param c - Hono Context
 * @returns 测速点列表 JSON 响应
 */
export async function locations(c: Context) {
  console.log('[Speed] Fetching locations');

  const baseHeaders: Record<string, string> = {
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const response = await fetch('https://speed.cloudflare.com/locations', {
      headers: { referer: 'https://speed.cloudflare.com/' },
    });

    if (!response.ok) {
      console.error(`[Speed] Locations fetch failed: ${response.status}`);
      return new Response(JSON.stringify({ error: '上游 locations 失败' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json;charset=UTF-8', ...baseHeaders },
      });
    }

    const locations = await response.json() as Array<{ region?: string; city?: string }>;
    localizeSpeedLocations(locations);

    return new Response(JSON.stringify(locations, null, 2), {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Cache-Control': 'public, max-age=300', // M5 修复：缩短缓存时间到 5 分钟
        ...baseHeaders,
      },
    });
  } catch (e: any) {
    console.error(`[Speed] Locations error: ${e.message}`);
    return new Response(
      JSON.stringify({ error: String(e && e.message ? e.message : e) }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json;charset=UTF-8', ...baseHeaders },
      }
    );
  }
}
