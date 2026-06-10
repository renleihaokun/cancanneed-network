# cancanneed_network
看看你的  
网！

### 如需使用 AI 功能，请先在cloudflare workers secrets中配置ZHIPU_API_KEY="你的密钥"

---

## 📚 API 文档

本工具提供了一套 RESTful API 接口，用于获取客户端连接的详细网络信息。

### 🔄 路由说明

**新路由（推荐）**：使用 RESTful 风格的路由，更加规范和清晰。

**旧路由兼容**：旧的 `/?act=xxx` 路由仍然可用，系统会自动重定向到新路由。

---

### 1️⃣ 获取 IP 信息

**接口地址**: `/api/ip`

**请求方式**: `GET`

**返回格式**: `JSON`

**示例请求**:
```bash
curl "https://ip.haokun.me/api/ip"
```

**响应示例**:
```json
{
  "ip": "0.0.0.0",
  "location": {
    "country": "JP",
    "region": "Tokyo",
    "city": "Tokyo"
  },
  "node": {
    "code": "NRT",
    "name": "东京",
    "iso": "jp"
  },
  "asn": 45102,
  "isp": {
    "name": "Shiodome Sumitomo Blog 1-9-2 TOKYO",
    "raw": "Shiodome Sumitomo Blog 1-9-2 TOKYO"
  },
  "rtt": 50
}
```

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `ip` | String | 客户端连接到 Cloudflare 的 IP 地址 |
| `location.country` | String | 客户端所属国家/地区代码 |
| `location.region` | String | 客户端所属区域/州/省 |
| `location.city` | String | 客户端所属城市 |
| `node.code` | String | Cloudflare 数据中心三字码 (如 LAX, NRT, HKG) |
| `node.name` | String | 数据中心所在城市中文名 |
| `node.iso` | String | 所在国家/地区 ISO 代码 (用于显示国旗) |
| `asn` | Number | 自治系统号 (ASN) |
| `isp.name` | String | 识别后的 ISP 中文名称 |
| `isp.raw` | String | 原始 ISP 组织名称 |
| `rtt` | Number | 客户端到 Cloudflare 边缘节点的连接往返延迟 (ms)(http/3会返回0且修不了一点) |

---

### 2️⃣ Ping 健康检查

**接口地址**: `/api/ping`

**请求方式**: `GET`

**返回格式**: `Text`

**示例请求**:
```bash
curl "https://ip.haokun.me/api/ping"
```

**响应示例**:

```text
pong
```

**用途**: 用于检测服务是否正常运行，或测量延迟。

---

### 3️⃣ 下载带宽测速

**接口地址**: `/api/speed/download`

**请求方式**: `GET`

**参数说明**:

| 参数 | 类型 | 必填 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- | :--- |
| `size` | String | 否 | `10m` | 下载大小，支持格式：`10m`、`50mb`、`1g` |
| `bytes` | Number | 否 | - | 下载字节数（优先级高于 size） |

**示例请求**:
```bash
# 使用 size 参数
curl "https://ip.haokun.me/api/speed/download?size=50m"

# 使用 bytes 参数
curl "https://ip.haokun.me/api/speed/download?bytes=50000000"
```

**响应**: 返回指定大小的随机数据流，用于测量下载速度。

**限制**:

- 最小下载量：1MB
- 最大下载量：200MB

---

### 4️⃣ 获取测速点列表

**接口地址**: `/api/speed/locations`

**请求方式**: `GET`

**返回格式**: `JSON`

**示例请求**:
```bash
curl "https://ip.haokun.me/api/speed/locations"
```

**响应示例**:
```json
[
  {
    "region": "亚洲",
    "city": "东京"
  },
  {
    "region": "北美洲",
    "city": "洛杉矶"
  }
]
```

**用途**: 获取 Cloudflare 全球测速点列表（已翻译为中文）。

---

### 5️⃣ AI 分析

**接口地址**: `/api/analyze`

**请求方式**: `POST`

**请求头**: `Content-Type: application/json`

**请求体参数**:

| 参数 | 类型 | 必填 | 描述 |
| :--- | :--- | :--- | :--- |
| `connection_ip` | String | 是 | 客户端 IP 地址 |
| `ipv4_address` | String | 否 | IPv4 地址 |
| `ipv6_address` | String | 否 | IPv6 地址 |
| `isp` | String | 是 | 运营商名称 |
| `cf_location` | String | 否 | Cloudflare 归属地 |
| `api_location` | String | 否 | API 归属地 |
| `latency` | String | 否 | 连接延迟 |
| `node` | String | 否 | 接入节点信息 |

**示例请求**:
```bash
curl -X POST "https://ip.haokun.me/api/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "connection_ip": "192.168.1.1",
    "isp": "中国电信",
    "cf_location": "上海, 中国",
    "latency": "50 ms",
    "node": "上海 (PVG)"
  }'
```

**响应**: 返回流式文本响应（SSE），包含 AI 分析结果。

**前置条件**: 需要在 Cloudflare Workers 环境变量中配置 `ZHIPU_API_KEY`。

---

## 🔄 路由对照表

| 旧路由 | 新路由 | 说明 |
| :--- | :--- | :--- |
| `/?act=get_ip_info` | `/api/ip` | IP 信息查询 |
| `/?act=ping` | `/api/ping` | Ping 健康检查 |
| `/?act=speed_down` | `/api/speed/download` | 下载测速 |
| `/?act=speed_locations` | `/api/speed/locations` | 测速点列表 |
| `/?act=analyze` | `/api/analyze` | AI 分析 |

**注意**: 旧路由仍然可用，系统会自动重定向到新路由。建议使用新路由以获得更好的性能。

---

## 🛠️ 本地开发

```bash
# 安装依赖
npm install

# 本地开发
npm run dev

# 运行测试
npm test

# 部署到 Cloudflare
npm run deploy
```

---

## 📝 更新日志

### 2026-06-10
- 重构项目架构，使用 Hono 框架
- 引入 TypeScript，提高代码质量
- 实现 RESTful API 路由
- 保持旧路由向后兼容
- 添加自动化测试
