/**
 * ISP（互联网服务提供商）识别服务
 * 根据组织名称和 ASN 识别运营商类型
 */

import type { ISPInfo } from '../../types/env';

/**
 * 中国主要运营商 ASN 列表 - M6 修复：结合 ASN 号码提高识别准确性
 */
const CHINA_TELECOM_ASNS = [4134, 4809, 4811, 4812, 4813, 4814, 4815, 4816];
const CHINA_UNICOM_ASNS = [4837, 9929, 10099, 17621, 17622, 17623];
const CHINA_MOBILE_ASNS = [9808, 56040, 56041, 56042, 56044, 56046, 56047, 56048];

/**
 * 识别 ISP 运营商
 * @param rawIsp - 原始 ISP 组织名称
 * @param asn - ASN 编号
 * @returns ISP 识别结果，包含名称、颜色和背景色
 */
export function identifyISP(rawIsp: string, asn: number): ISPInfo {
  const isp = rawIsp.toLowerCase();

  // 默认样式
  const defaultResult: ISPInfo = {
    name: rawIsp || '未知网络',
    color: '#555555',
    bg: 'rgba(85, 85, 85, 0.1)',
  };

  // 1. 中国大陆运营商 - M6 修复：优先使用 ASN 判断，其次使用名称匹配
  if (CHINA_TELECOM_ASNS.includes(asn) || isp.includes('chinanet') || isp.includes('telecom')) {
    return { name: '中国电信', color: '#0066CC', bg: 'rgba(0, 102, 204, 0.1)' };
  }
  if (CHINA_UNICOM_ASNS.includes(asn) || isp.includes('unicom')) {
    return { name: '中国联通', color: '#E60012', bg: 'rgba(230, 0, 18, 0.1)' };
  }
  if (CHINA_MOBILE_ASNS.includes(asn) || isp.includes('cmcc') || isp.includes('tietong')) {
    return { name: '中国移动', color: '#0085D0', bg: 'rgba(0, 133, 208, 0.1)' };
  }
  if (isp.includes('broadnet') || isp.includes('cable') || isp.includes('gehua')) {
    return { name: '中国广电', color: '#7CB342', bg: 'rgba(124, 179, 66, 0.15)' };
  }
  if (isp.includes('cernet')) {
    return { name: '中国教育网', color: '#00A0E9', bg: 'rgba(0, 160, 233, 0.1)' };
  }
  if (isp.includes('dr.peng') || isp.includes('great wall')) {
    return { name: '长城/鹏博士', color: '#E85928', bg: 'rgba(232, 89, 40, 0.1)' };
  }

  // 2. 港澳台运营商
  if (isp.includes('hkt') || isp.includes('pccw')) {
    return { name: 'HKT (香港电讯)', color: '#00539F', bg: 'rgba(0, 83, 159, 0.1)' };
  }
  if (isp.includes('hkbn')) {
    return { name: 'HKBN (香港宽频)', color: '#743C8F', bg: 'rgba(116, 60, 143, 0.1)' };
  }
  if (isp.includes('hgc')) {
    return { name: 'HGC', color: '#E3007F', bg: 'rgba(227, 0, 127, 0.1)' };
  }
  if (isp.includes('cmhk')) {
    return { name: 'CMHK', color: '#0085D0', bg: 'rgba(0, 133, 208, 0.1)' };
  }
  if (isp.includes('ctm')) {
    return { name: 'CTM (澳门电讯)', color: '#00A651', bg: 'rgba(0, 166, 81, 0.1)' };
  }
  if (isp.includes('chunghwa') || isp.includes('hinet')) {
    return { name: '中华电信 (HiNet)', color: '#2E57A6', bg: 'rgba(46, 87, 166, 0.1)' };
  }

  // 3. 云厂商 - M6 修复：使用更精确的匹配规则
  if (isp.includes('alibaba') || isp.includes('aliyun')) {
    return { name: '阿里云', color: '#FF6A00', bg: 'rgba(255, 106, 0, 0.1)' };
  }
  if (isp.includes('tencent')) {
    return { name: '腾讯云', color: '#0052D9', bg: 'rgba(0, 82, 217, 0.1)' };
  }
  if (isp.includes('huawei')) {
    return { name: '华为云', color: '#C7000B', bg: 'rgba(199, 0, 11, 0.1)' };
  }
  if (isp.includes('google') && !isp.includes('google cloud')) {
    return { name: 'Google', color: '#4285F4', bg: 'rgba(66, 133, 244, 0.1)' };
  }
  if (isp.includes('google cloud') || isp.includes('gcp')) {
    return { name: 'Google Cloud', color: '#4285F4', bg: 'rgba(66, 133, 244, 0.1)' };
  }
  if (isp.includes('amazon') || isp.includes('aws')) {
    return { name: 'AWS', color: '#FF9900', bg: 'rgba(255, 153, 0, 0.1)' };
  }
  if (isp.includes('microsoft') || isp.includes('azure')) {
    return { name: 'Microsoft Azure', color: '#0078D4', bg: 'rgba(0, 120, 212, 0.1)' };
  }
  if (isp.includes('oracle')) {
    return { name: 'Oracle Cloud', color: '#C74634', bg: 'rgba(199, 70, 52, 0.1)' };
  }
  if (isp.includes('digitalocean')) {
    return { name: 'DigitalOcean', color: '#0080FF', bg: 'rgba(0, 128, 255, 0.1)' };
  }
  if (isp.includes('vultr')) {
    return { name: 'Vultr', color: '#0057E7', bg: 'rgba(0, 87, 231, 0.1)' };
  }
  if (isp.includes('linode')) {
    return { name: 'Linode', color: '#02B159', bg: 'rgba(2, 177, 89, 0.1)' };
  }
  if (isp.includes('cloudflare')) {
    return { name: 'Cloudflare WARP', color: '#F38020', bg: 'rgba(243, 128, 32, 0.1)' };
  }

  return defaultResult;
}
