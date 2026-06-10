/**
 * IP 信息查询处理器
 * 获取客户端 IP 地址、地理位置、ISP 等信息
 */

import type { Context } from 'hono';
import type { RequestWithCf, IPInfo } from '../../types/env';
import { identifyISP } from '../services/isp';
import { translateColo } from '../services/colo';
import { successResponse } from '../utils/response';

/**
 * 获取 IP 信息
 * @param c - Hono Context
 * @returns IP 信息 JSON 响应
 */
export async function getIPInfo(c: Context) {
  const request = c.req.raw as RequestWithCf;
  // L3 修复：使用类型安全的方式访问 cf 属性
  const cf = request.cf || {};
  const ip = request.headers.get('CF-Connecting-IP') || '0.0.0.0';
  const colo = cf.colo || 'UNK';
  const rawIsp = cf.asOrganization || '';
  const asn = cf.asn || 0;

  const nodeInfo = translateColo(colo);
  const ispInfo = identifyISP(rawIsp, asn);

  const data: IPInfo = {
    ip,
    location: {
      country: cf.country || '',
      region: cf.region || '',
      city: cf.city || '',
    },
    node: {
      code: colo,
      name: nodeInfo.name,
      iso: nodeInfo.iso,
    },
    asn,
    isp: {
      name: ispInfo.name,
      raw: rawIsp,
    },
    rtt: Number(cf.clientTcpRtt) || 0,
  };

  return successResponse(c, data);
}
