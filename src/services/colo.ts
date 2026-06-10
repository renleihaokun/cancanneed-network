/**
 * Cloudflare 数据中心节点翻译服务
 * 将数据中心代码翻译为中文名称和国旗代码
 */

import type { ColoInfo } from '../../types/env';

/**
 * 数据中心代码到中文名称的映射
 */
const COLO_MAP: Record<string, ColoInfo> = {
  HKG: { name: '香港', iso: 'hk' },
  TPE: { name: '台北', iso: 'tw' },
  NRT: { name: '东京', iso: 'jp' },
  KIX: { name: '大阪', iso: 'jp' },
  ICN: { name: '首尔', iso: 'kr' },
  SIN: { name: '新加坡', iso: 'sg' },
  KUL: { name: '吉隆坡', iso: 'my' },
  BKK: { name: '曼谷', iso: 'th' },
  SGN: { name: '胡志明市', iso: 'vn' },
  MNL: { name: '马尼拉', iso: 'ph' },
  LAX: { name: '洛杉矶', iso: 'us' },
  SJC: { name: '圣何塞', iso: 'us' },
  SFO: { name: '旧金山', iso: 'us' },
  SEA: { name: '西雅图', iso: 'us' },
  JFK: { name: '纽约', iso: 'us' },
  LHR: { name: '伦敦', iso: 'gb' },
  FRA: { name: '法兰克福', iso: 'de' },
  AMS: { name: '阿姆斯特丹', iso: 'nl' },
  SYD: { name: '悉尼', iso: 'au' },
};

/**
 * 翻译数据中心代码
 * @param coloCode - Cloudflare 数据中心代码（如 HKG、NRT）
 * @returns 节点信息，包含中文名称和国旗代码
 */
export function translateColo(coloCode: string): ColoInfo {
  const code = coloCode.toUpperCase();
  return COLO_MAP[code] || { name: code, iso: null };
}
