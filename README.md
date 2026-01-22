# cancanneed_network
看看你的  
网！

### 如需使用 AI 功能，请先配置ZHIPU_API_KEY="你的密钥"


### API 文档

本工具提供了一个简单的 API 接口，用于获取客户端连接的详细网络信息。

### 获取 IP 信息

**接口地址**: `/?act=get_ip_info`

**请求方式**: `GET`

**返回格式**: `JSON`

**示例请求**:
```bash
curl "https://ip.haokun.me/?act=get_ip_info"
```

**响应示例**:
```json
{
  "ip": "0.0.0.0",
  "node": {
    "code": "NRT",
    "name": "东京",
    "iso": "jp"
  },
  "asn": 45102,
  "isp": {
    "name": "Shiodome Sumitomo Blog 1-9-2 TOKYO",
    "raw": "Shiodome Sumitomo Blog 1-9-2 TOKYO"
  }
}
```

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `ip` | String | 客户端连接到 Cloudflare 的 IP 地址 |
| `node.code` | String | Cloudflare 数据中心三字码 (如 LAX, NRT, HKG) |
| `node.name` | String | 数据中心所在城市中文名 |
| `node.iso` | String | 所在国家/地区 ISO 代码 (用于显示国旗) |
| `asn` | Number | 自治系统号 (ASN) |
| `isp.name` | String | 识别后的 ISP 中文名称 |
| `isp.raw` | String | 原始 ISP 组织名称 |