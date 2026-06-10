/**
 * Cloudflare Workers 环境变量类型定义
 */
export interface Env {
  /** 智谱 AI API Key */
  ZHIPU_API_KEY?: string;

  // 如果需要 KV 存储，取消注释以下代码
  // CACHE: KVNamespace;

  // 如果需要 D1 数据库，取消注释以下代码
  // DB: D1Database;
}

/**
 * Cloudflare 请求对象中的 cf 属性类型
 */
export interface CfProperties {
  /** 数据中心代码 */
  colo?: string;
  /** 国家代码 */
  country?: string;
  /** 城市 */
  city?: string;
  /** 地区 */
  region?: string;
  /** ASN 编号 */
  asn?: number;
  /** ISP 组织名称 */
  asOrganization?: string;
  /** 客户端 TCP RTT */
  clientTcpRtt?: number;
  /** HTTP 协议版本 */
  httpProtocol?: string;
  /** TLS 版本 */
  tlsVersion?: string;
  /** 是否使用 TLS */
  tlsCipher?: string;
}

/**
 * L3 修复：定义包含 cf 属性的请求类型
 * 使用类型别名而不是接口继承，避免与 Cloudflare Workers 类型冲突
 */
export type RequestWithCf = Request & {
  cf?: CfProperties;
};

/**
 * IP 信息响应数据
 */
export interface IPInfo {
  ip: string;
  location: {
    country: string;
    region: string;
    city: string;
  };
  node: {
    code: string;
    name: string;
    iso: string | null;
  };
  asn: number;
  isp: {
    name: string;
    raw: string;
  };
  rtt: number;
}

/**
 * ISP 识别结果
 */
export interface ISPInfo {
  name: string;
  color: string;
  bg: string;
}

/**
 * 节点信息
 */
export interface ColoInfo {
  name: string;
  iso: string | null;
}
