/**
 * @param {Request} request
 * @param {object} env - The environment object containing secrets.
 * @returns {Promise<Response>}
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const action = url.searchParams.get('act');

    // === 路由分发 ===
    
    // 1. AI 分析接口
    if (action === 'analyze') {
      return handleAIAnalyze(request, env);
    }

    // 2. Ping 测速接口
    if (action === 'ping') {
      return handlePing();
    }

    // 3. 获取 IP 信息接口 (新增)
    if (action === 'get_ip_info') {
      return handleGetIPInfo(request);
    }
    
    // 4. 默认：渲染主页面
    return renderHTML(request);
  },
};

// =========================================
//            后端逻辑处理函数
// =========================================

/**
 * 获取客户端 IP 及网络信息 API
 */
function handleGetIPInfo(request) {
    const cf = request.cf || {};
    const rawIsp = cf.asOrganization || "";
    const asn = cf.asn || 0;
    const ip = request.headers.get("CF-Connecting-IP") || "0.0.0.0";
    const colo = cf.colo || "UNK";
    const country = cf.country || "";
    const city = cf.city || "";
    const region = cf.region || "";
    const nodeInfo = translateColo(colo);
    const ispInfo = identifyISP(rawIsp, asn);

    const data = {
        ip: ip,
        location: {
            country: country,
            region: region,
            city: city
        },
        node: {
            code: colo,
            name: nodeInfo.name,
            iso: nodeInfo.iso
        },
        asn: asn,
        isp: {
            name: ispInfo.name,
            raw: rawIsp
        },
        rtt: Number(cf.clientTcpRtt) || 0
    };

    return new Response(JSON.stringify(data, null, 2), {
        headers: {
            "content-type": "application/json;charset=UTF-8",
            "access-control-allow-origin": "*"
        }
    });
}

/**
 * 处理 AI 分析请求
 */
async function handleAIAnalyze(request, env) {
  try {
    const userInfo = await request.json();
    const apiKey = env.ZHIPU_API_KEY;

    if (!apiKey) {
      return new Response("服务器未配置 ZHIPU_API_KEY，无法进行AI分析。", { status: 500 });
    }

    const zhipuRequest = {
      model: "GLM-4-Flash-250414",
      messages: [
        {
          role: "user",
          content: `你是一个非常“有梗”的网络分析助手。请根据以下JSON信息，用通俗易懂、极其俏皮的语言，对用户的网络情况进行一段简短的分析和总结。
          你的分析要“有态度”，可以根据用户的运营商（ISP）给出一些有趣的吐槽。不要使用markdown语法。
          信息如下：\n\n${JSON.stringify(userInfo, null, 2)}`
        }
      ],
      stream: true,
      temperature: 1.0,
    };

    const zhipuResponse = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(zhipuRequest)
    });

    if (!zhipuResponse.ok) {
        const errorText = await zhipuResponse.text();
        throw new Error(`智谱AI API 请求失败: ${zhipuResponse.status} ${errorText}`);
    }

    // 创建流式响应
    const {readable, writable} = new TransformStream();
    const writer = writable.getWriter();
    const reader = zhipuResponse.body.getReader();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    (async () => {
      let buffer = '';
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          let boundary;
          while ((boundary = buffer.indexOf('\n')) !== -1) {
            const line = buffer.substring(0, boundary).trim();
            buffer = buffer.substring(boundary + 1);

            if (line.startsWith('data: ')) {
              const jsonStr = line.substring(6);
              if (jsonStr.trim() === '[DONE]') continue;
              try {
                const data = JSON.parse(jsonStr);
                const content = data.choices[0]?.delta?.content || "";
                if (content) {
                  await writer.write(encoder.encode(content));
                }
              } catch (e) {
                console.error("JSON parse error:", e);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error processing stream:', error);
        await writer.abort(error);
      } finally {
        await writer.close();
      }
    })();

    return new Response(readable, {
      headers: { "Content-Type": "text/html; charset=utf-8" }
    });

  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}

/**
 * 处理 Ping 请求
 */
function handlePing() {
  return new Response("pong", {
    headers: { 
        "content-type": "text/plain",
        "cache-control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "access-control-allow-origin": "*"
    },
  });
}

// =========================================
//            页面渲染逻辑
// =========================================

/**
 * 渲染主 HTML 页面
 */
function renderHTML(request) {
    const cf = request.cf || {};
    const rawIsp = cf.asOrganization || "";
    const asn = cf.asn || 0;
    const city = cf.city || "地球某处";
    const region = cf.region || "";
    const ip = request.headers.get("CF-Connecting-IP") || "0.0.0.0";
    const colo = cf.colo || "UNK";
    const nodeInfo = translateColo(colo);
    
    let coloHtml = nodeInfo.name;
    if (nodeInfo.iso) {
        coloHtml = `<img src="https://flagcdn.com/w40/${nodeInfo.iso}.png" class="flag-img" alt="${nodeInfo.iso}"> ${nodeInfo.name} <span style="opacity:0.6">(${colo})</span>`;
    } else {
        coloHtml = `${nodeInfo.name} <span style="opacity:0.6">(${colo})</span>`;
    }

    // 初始 RTT 计算与展示
    let rtt = Number(cf.clientTcpRtt) || 0;
    let rttDisplay = rtt + " ms";
    let rttColor = "#10b981"; 
    let isHttp3 = false;

    if (rtt === 0) {
        isHttp3 = true;
        rttDisplay = `<span class="blink">测速中...</span>`; 
    } else {
        if (rtt > 350) rttColor = "#ef4444";      
        else if (rtt > 150) rttColor = "#f59e0b"; 
    }

    const ispInfo = identifyISP(rawIsp, asn);
    const locationStr = [city, region].filter(Boolean).join(", ");

    // 返回完整的 HTML 字符串
    return new Response(`
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>让我看看你的网！</title>
        <link rel="icon" href="https://imgbed.haokun.me/file/1768399588443_00007.png">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
        <style>
            :root {
                --primary-color: #2b5876;
                --text-main: #333;
                --text-sub: #666;
                --bg-glass: rgba(255, 255, 255, 0.1);
                --border-glass: rgba(255, 255, 255, 0.6);
            }
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", "Segoe UI", Roboto, sans-serif;
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: flex-start;
                background: url('https://elaina.haokun.me/') no-repeat center center fixed;
                background-size: cover;
                padding: 2rem 1rem;
                color: #555;
            }
            .decoration { position: absolute; border-radius: 50%; filter: blur(40px); z-index: 0; animation: float 6s ease-in-out infinite; }
            .circle-1 { width: 200px; height: 200px; background: rgba(255, 255, 255, 0.2); top: 10%; left: 20%; }
            .circle-2 { width: 300px; height: 300px; background: rgba(161, 239, 255, 0.2); bottom: 10%; right: 15%; animation-delay: -3s; }
            
            .card {
                position: relative; z-index: 1;
                background: var(--bg-glass);
                backdrop-filter: blur(7px); -webkit-backdrop-filter: blur(25px);
                border: 1px solid var(--border-glass);
                padding: 2.5rem 2rem; border-radius: 24px;
                box-shadow: 0 15px 50px 0 rgba(0, 0, 0, 0.2);
                text-align: center; width: 480px; max-width: 100%;
                margin: 0;
                animation: fadeIn 0.8s ease-out;
            }
            h1 { font-size: 1.4rem; color: var(--text-main); margin-bottom: 0.5rem; }
            
            .isp-tag {
                display: inline-block; color: ${ispInfo.color}; background: ${ispInfo.bg};
                padding: 4px 12px; border-radius: 8px; font-family: monospace;
                font-size: 1.3em; font-weight: 800; margin-top: 5px;
                border: 1px solid ${ispInfo.color}20;
            }
            
            .info-box {
                margin: 20px 0; padding: 15px; background: rgba(255,255,255,0.5);
                border-radius: 12px; font-size: 0.95rem; color: var(--text-sub);
                line-height: 1.6; text-align: left; border: 1px solid rgba(255,255,255,0.4);
            }
            .info-row { 
                display: flex; justify-content: space-between; align-items: center;
                border-bottom: 1px dashed #cbd5e1; padding-bottom: 8px; margin-bottom: 8px; 
            }
            .info-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
            .label { font-weight: bold; color: #57606f; white-space: nowrap; margin-right: 15px; flex-shrink: 0; }
            .value { font-family: monospace; color: var(--text-main); text-align: right; word-break: break-word; display: flex; align-items: center; justify-content: flex-end; }
            .flag-img { width: 20px; height: auto; margin-right: 6px; border-radius: 2px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); vertical-align: middle; }
            .status-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${rttColor}; margin-right: 6px; transition: background-color 0.3s; }
            
            .btn {
                display: inline-block; padding: 12px 24px;
                background: linear-gradient(135deg, #2b5876 0%, #4e4376 100%);
                color: white; border-radius: 50px; text-decoration: none; font-weight: bold;
                box-shadow: 0 4px 15px rgba(43, 88, 118, 0.35); transition: 0.3s;
                margin-top: 10px; border: none; cursor: pointer;
            }
            .btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(43, 88, 118, 0.5); }
            
            .ai-result {
                margin-top: 20px; padding: 15px;
                background: rgba(230, 245, 230, 0.7); border-radius: 12px;
                text-align: left; font-size: 0.9em; line-height: 1.6;
                color: var(--text-main); border: 1px solid #a8e063; animation: fadeIn 0.5s ease-out;
            }
            .ai-result .loading { color: #555; text-align: center; animation: jump 1s ease-in-out infinite; }
            .ai-result .error { color: #d9534f; font-weight: bold; }
            .signature-img { margin-top: 20px; max-width: 100%; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); display: block; margin-left: auto; margin-right: auto; }
            .blink { animation: blinker 1.5s linear infinite; }
            
            /* Canvas & Switcher */
            .chart-wrapper { margin-top: 10px; padding-bottom: 10px; border-bottom: 1px dashed #cbd5e1; position: relative; }
            .chart-header {
                display: flex; justify-content: space-between; align-items: center;
                font-size: 0.85em; color: #777; margin-bottom: 5px;
            }
            .chart-container {
                width: 100%; height: 90px; 
                background: rgba(255,255,255,0.3); border-radius: 8px;
                position: relative; overflow: hidden;
                border: 1px solid rgba(255,255,255,0.2);
            }
            canvas { width: 100%; height: 100%; display: block; }
            
            .expand-btn {
                position: absolute; top: 4px; right: 4px; width: 22px; height: 22px;
                background: rgba(255,255,255,0.5); backdrop-filter: blur(2px);
                border-radius: 4px; cursor: pointer;
                display: flex; align-items: center; justify-content: center;
                z-index: 10; transition: all 0.1s cubic-bezier(0.4, 0, 0.2, 1); color: #666;
            }
            .expand-btn:hover { background: #fff; transform: scale(1.1); color: var(--primary-color); box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
            .expand-btn:active { transform: scale(0.9); background: rgba(255,255,255,0.9); }
            .expand-btn svg { width: 14px; height: 14px; fill: currentColor; }

            /* Modal */
            .modal-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(5px);
                z-index: 9999; 
                display: flex; align-items: center; justify-content: center;
                opacity: 0; visibility: hidden; pointer-events: none;
                transition: opacity 0.3s ease, visibility 0.3s ease;
            }
            .modal-overlay.active { opacity: 1; visibility: visible; pointer-events: auto; }
            
            .modal-content {
                background: #fff; width: 90%; max-width: 900px; max-height: 85vh; height: 600px;
                border-radius: 16px; padding: 20px; position: relative;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                display: flex; flex-direction: column;
                transform: scale(0.8); opacity: 0;
                transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
            }
            .modal-overlay.active .modal-content { transform: scale(1); opacity: 1; }
            
            .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px; flex-shrink: 0; }
            .modal-title { font-size: 1.2rem; font-weight: bold; color: var(--text-main); }
            .modal-close { cursor: pointer; font-size: 1.5rem; color: #999; line-height: 1; padding: 0 10px; transition: color 0.2s; }
            .modal-close:hover { color: #ef4444; }
            
            .modal-chart-box { flex: 1; width: 100%; position: relative; background: #f9f9f9; border-radius: 8px; border: 1px solid #eee; min-height: 0; margin-bottom: 10px; display: flex; }
            .modal-stats { display: flex; gap: 20px; font-size: 0.9rem; color: var(--text-sub); flex-shrink: 0; padding-top: 5px; border-top: 1px dashed #eee; }
            .stat-item b { font-family: monospace; color: var(--primary-color); }

            /* Switch */
            .switch-container {
                display: flex; align-items: center; justify-content: space-between;
                background: rgba(255, 255, 255, 0.4); border-radius: 20px;
                padding: 3px; margin-bottom: 8px; position: relative;
                border: 1px solid rgba(255,255,255,0.3); height: 32px; flex-shrink: 0;
            }
            .modal-content .switch-container { background: #f0f2f5; border: 1px solid #e1e4e8; margin-bottom: 15px; }
            .switch-option {
                flex: 1; text-align: center; z-index: 2; cursor: pointer;
                font-size: 0.75rem; color: var(--text-sub); font-weight: 600;
                transition: color 0.3s, transform 0.1s ease; user-select: none; line-height: 26px;
                display: flex; align-items: center; justify-content: center;
            }
            .switch-option i {
                font-size: 14px;
                margin-right: 4px;
            }
            .switch-option:active { transform: scale(0.9); }
            .switch-input { display: none; }
            .switch-glider {
                position: absolute; top: 3px; left: 3px; height: calc(100% - 6px);
                width: calc((100% - 6px) / 7); background: #fff; border-radius: 16px;
                transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
                z-index: 1; box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }

            /* Switch Logic */
            #s-opt-1:checked ~ .switch-glider { transform: translateX(0%); }
            #s-opt-2:checked ~ .switch-glider { transform: translateX(100%); }
            #s-opt-3:checked ~ .switch-glider { transform: translateX(200%); }
            #s-opt-4:checked ~ .switch-glider { transform: translateX(300%); }
            #s-opt-5:checked ~ .switch-glider { transform: translateX(400%); }
            #s-opt-6:checked ~ .switch-glider { transform: translateX(500%); }
            #s-opt-7:checked ~ .switch-glider { transform: translateX(600%); }
            
            #m-opt-1:checked ~ .switch-glider { transform: translateX(0%); }
            #m-opt-2:checked ~ .switch-glider { transform: translateX(100%); }
            #m-opt-3:checked ~ .switch-glider { transform: translateX(200%); }
            #m-opt-4:checked ~ .switch-glider { transform: translateX(300%); }
            #m-opt-5:checked ~ .switch-glider { transform: translateX(400%); }
            #m-opt-6:checked ~ .switch-glider { transform: translateX(500%); }
            #m-opt-7:checked ~ .switch-glider { transform: translateX(600%); }

            input:checked + label { color: var(--primary-color); }
            input:checked + label[for$="-2"] { color: #E3007F; }
            input:checked + label[for$="-3"] { color: #0078D4; }
            input:checked + label[for$="-4"] { color: #1a1f71; }
            input:checked + label[for$="-5"] { color: #4285F4; }
            input:checked + label[for$="-6"] { color: #171a21; } /* Steam Black/Blue */
            input:checked + label[for$="-7"] { color: #F38020; } /* Cloudflare Orange */

            @keyframes blinker { 50% { opacity: 0.5; } }
            @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-20px); } 100% { transform: translateY(0px); } }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes jump { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        </style>
    </head>
    <body>
        <div class="decoration circle-1"></div>
        <div class="decoration circle-2"></div>
        <div class="card">
            <h1>当前流量来源</h1>
            <div class="isp-tag">${ispInfo.name}</div>
            <div class="info-box">
                <div class="info-row"><span class="label">当前连接使用的IP</span> <span class="value">${ip}</span></div>
                <div class="info-row"><span class="label">IPv4 地址</span> <span class="value" id="ipv4-addr"><span class="blink">查询中...</span></span></div>
                <div class="info-row"><span class="label">IPv6 地址</span> <span class="value" id="ipv6-addr"><span class="blink">查询中...</span></span></div>
                <div class="info-row"><span class="label">CF归属地</span> <span class="value">${locationStr}</span></div>
                <div class="info-row"><span class="label">API归属地 (IPv4)</span> <span class="value" id="ext-loc">查询中...</span></div>
                
                <div class="info-row">
                    <span class="label">连接延迟 (握手)</span> 
                    <span class="value" style="color:${rttColor}; font-weight:bold;" id="rtt-value">
                        <span class="status-dot" id="rtt-dot"></span>${rttDisplay}
                    </span>
                </div>

                <div class="chart-wrapper">
                    <div class="switch-container">
                        <input type="radio" id="s-opt-1" name="switch" class="switch-input" checked onchange="changePingTarget(1)">
                        <label for="s-opt-1" class="switch-option" title="本站">
                            <i class="fa-solid fa-house"></i>
                        </label>
                        <input type="radio" id="s-opt-2" name="switch" class="switch-input" onchange="changePingTarget(2)">
                        <label for="s-opt-2" class="switch-option" title="Bilibili">
                            <i class="fa-brands fa-bilibili"></i>
                        </label>
                        <input type="radio" id="s-opt-3" name="switch" class="switch-input" onchange="changePingTarget(3)">
                        <label for="s-opt-3" class="switch-option" title="Microsoft">
                            <i class="fa-brands fa-microsoft"></i>
                        </label>
                        <input type="radio" id="s-opt-4" name="switch" class="switch-input" onchange="changePingTarget(4)">
                        <label for="s-opt-4" class="switch-option" title="Visa">
                            <i class="fa-brands fa-cc-visa"></i>
                        </label>
                        <input type="radio" id="s-opt-5" name="switch" class="switch-input" onchange="changePingTarget(5)">
                        <label for="s-opt-5" class="switch-option" title="Google">
                            <i class="fa-brands fa-google"></i>
                        </label>
                        <input type="radio" id="s-opt-6" name="switch" class="switch-input" onchange="changePingTarget(6)">
                        <label for="s-opt-6" class="switch-option" title="Steam">
                            <i class="fa-brands fa-steam"></i>
                        </label>
                        <input type="radio" id="s-opt-7" name="switch" class="switch-input" onchange="changePingTarget(7)">
                        <label for="s-opt-7" class="switch-option" title="Cloudflare">
                            <i class="fa-brands fa-cloudflare"></i>
                        </label>
                        <div class="switch-glider"></div>
                    </div>

                    <div class="chart-header">
                        <span id="ping-target-name">网络真连接连通性 (本站)</span>
                        <span id="rt-ping-value" style="font-family:monospace; font-weight:bold;">-- ms</span>
                    </div>
                    
                    <div class="chart-container">
                        <div class="expand-btn" onclick="openModal()" title="放大查看详细历史">
                            <svg viewBox="0 0 24 24"><path d="M15 3l2.3 2.3-2.89 2.87 1.42 1.42L18.7 6.7 21 9V3zM3 9l2.3-2.3 2.87 2.89 1.42-1.42L6.7 5.3 9 3H3zM9 21l-2.3-2.3 2.89-2.87-1.42-1.42L5.3 17.3 3 15v6zM21 15l-2.3 2.3-2.87-2.89-1.42 1.42 2.89 2.87L15 21h6z"/></svg>
                        </div>
                        <canvas id="ping-chart"></canvas>
                    </div>
                </div>

                <div class="info-row" style="margin-top:8px"><span class="label">接入节点</span> <span class="value">${coloHtml}</span></div>
                <div class="info-row"><span class="label">ASN编码</span> <span class="value">AS${asn}</span></div>
                <div class="info-row"><span class="label">原始ISP</span> <span class="value" style="font-size:0.9em">${rawIsp}</span></div>
            </div>
            <a href="https://blog.haokun.me" class="btn">前往博客</a>
            <div id="ai-result-container" class="ai-result">
                <p class="loading">🤖 AI 正在分析您的网络...</p>
            </div>
            <img src="https://tool.lu/netcard/" class="signature-img" alt="IP Signature">
        </div>

        <div class="modal-overlay" id="chart-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="modal-title" id="modal-title-text">详细延迟历史记录</div>
                    <div class="modal-close" onclick="closeModal()">×</div>
                </div>
                
                <div class="switch-container">
                    <input type="radio" id="m-opt-1" name="modal-switch" class="switch-input" checked onchange="changePingTarget(1)">
                    <label for="m-opt-1" class="switch-option"><i class="fa-solid fa-house"></i> 本站</label>
                    <input type="radio" id="m-opt-2" name="modal-switch" class="switch-input" onchange="changePingTarget(2)">
                    <label for="m-opt-2" class="switch-option"><i class="fa-brands fa-bilibili"></i> Bilibili</label>
                    <input type="radio" id="m-opt-3" name="modal-switch" class="switch-input" onchange="changePingTarget(3)">
                    <label for="m-opt-3" class="switch-option"><i class="fa-brands fa-microsoft"></i> Msft</label>
                    <input type="radio" id="m-opt-4" name="modal-switch" class="switch-input" onchange="changePingTarget(4)">
                    <label for="m-opt-4" class="switch-option"><i class="fa-brands fa-cc-visa"></i> Visa</label>
                    <input type="radio" id="m-opt-5" name="modal-switch" class="switch-input" onchange="changePingTarget(5)">
                    <label for="m-opt-5" class="switch-option"><i class="fa-brands fa-google"></i> Google</label>
                    <input type="radio" id="m-opt-6" name="modal-switch" class="switch-input" onchange="changePingTarget(6)">
                    <label for="m-opt-6" class="switch-option"><i class="fa-brands fa-steam"></i> Steam</label>
                    <input type="radio" id="m-opt-7" name="modal-switch" class="switch-input" onchange="changePingTarget(7)">
                    <label for="m-opt-7" class="switch-option"><i class="fa-brands fa-cloudflare"></i> Cloudflare</label>
                    <div class="switch-glider"></div>
                </div>

                <div class="modal-chart-box">
                    <canvas id="large-ping-chart"></canvas>
                </div>
                <div class="modal-stats">
                    <div class="stat-item">当前: <b id="stat-curr">--</b> ms</div>
                    <div class="stat-item">平均: <b id="stat-avg">--</b> ms</div>
                    <div class="stat-item">最大: <b id="stat-max">--</b> ms</div>
                    <div class="stat-item">最小: <b id="stat-min">--</b> ms</div>
                    <div class="stat-item">抖动: <b id="stat-jitter">--</b> ms</div>
                    <div class="stat-item" style="margin-left:auto; font-size:0.8em; opacity:0.7">显示最近 200 次记录</div>
                </div>
            </div>
        </div>

        <script>
            // === 1. IP & Geo ===
            async function fetchIpDetails() {
                fetch('https://ipv6.icanhazip.com').then(res => res.text()).then(ipv6 => {
                    document.getElementById('ipv6-addr').innerText = ipv6.trim();
                }).catch(() => {
                    document.getElementById('ipv6-addr').innerText = '不可用';
                });

                fetch('https://ipv4.icanhazip.com').then(res => res.text()).then(ipv4 => {
                    const cleanIpv4 = ipv4.trim();
                    document.getElementById('ipv4-addr').innerText = cleanIpv4;
                    return cleanIpv4;
                }).then(ipv4 => {
                    if (!ipv4) {
                        document.getElementById('ext-loc').innerText = '查询失败';
                        startAiAnalysis();
                        return;
                    }
                    fetch(\`https://ipapi.co/\${ipv4}/json/\`)
                        .then(r => r.json())
                        .then(d => {
                            const loc = [d.city, d.region, d.country_name].filter(Boolean).join(', ');
                            document.getElementById('ext-loc').innerText = loc || '未知';
                        })
                        .catch(() => { document.getElementById('ext-loc').innerText = '查询超时'; })
                        .finally(() => { startAiAnalysis(); });
                }).catch(() => {
                    document.getElementById('ipv4-addr').innerText = '不可用';
                    startAiAnalysis();
                });
            }
            fetchIpDetails();

            // === 2. Initial HTTP RTT ===
            const isHttp3 = ${isHttp3}; 
            function updateConnectionRttUI(duration, note) {
                const rttElem = document.getElementById('rtt-value');
                let color = "#10b981";
                if (duration > 350) color = "#ef4444";
                else if (duration > 150) color = "#f59e0b";
                
                rttElem.innerHTML = '<span class="status-dot" id="rtt-dot"></span>' + duration + ' ms <span style="font-size:0.8em;opacity:0.7">(' + note + ')</span>';
                rttElem.style.color = color;
                document.getElementById('rtt-dot').style.backgroundColor = color;
            }

            if (isHttp3) {
                const pingUrl = window.location.pathname + '?act=ping&t=' + Date.now();
                fetch(pingUrl).then(() => {
                    const measureUrl = window.location.pathname + '?act=ping&t=' + (Date.now() + 1);
                    const startTime = performance.now();
                    fetch(measureUrl).then(() => {
                        const endTime = performance.now();
                        const entries = performance.getEntriesByName(measureUrl);
                        let duration = 0;
                        if (entries.length > 0) {
                            const entry = entries[entries.length - 1];
                            duration = Math.round(entry.responseStart - entry.requestStart);
                        } else {
                            duration = Math.round(endTime - startTime);
                        }
                        if (duration <= 0) duration = 1;
                        updateConnectionRttUI(duration, "HTTP/3");
                    });
                });
            }

            // === 3. Real-time Ping Chart ===
            const smallCanvas = document.getElementById('ping-chart');
            const smallCtx = smallCanvas.getContext('2d');
            const largeCanvas = document.getElementById('large-ping-chart');
            const largeCtx = largeCanvas.getContext('2d');
            const rtValueElem = document.getElementById('rt-ping-value');
            const targetNameElem = document.getElementById('ping-target-name');
            const modal = document.getElementById('chart-modal');
            const modalTitle = document.getElementById('modal-title-text');
            
            const historyLimit = 200;
            const smallViewLimit = 50;
            let pingData = new Array(historyLimit).fill(0);
            let pingInterval = null;
            let isModalOpen = false;
            
            const pingTargets = {
                1: { name: '本站', url: window.location.pathname + '?act=ping' },
                2: { name: 'Bilibili', url: 'https://www.bilibili.com/favicon.ico' },
                3: { name: 'Microsoft', url: 'https://www.microsoft.com/favicon.ico' },
                4: { name: 'Visa', url: 'https://www.visa.cn/favicon.ico' },
                5: { name: 'Google', url: 'https://www.google.com/favicon.ico' },
                6: { name: 'Steam', url: 'https://store.steampowered.com/favicon.ico' },
                7: { name: 'Cloudflare', url: 'https://www.cloudflare.com/favicon.ico' }
            };
            let currentTargetId = 1;

            window.changePingTarget = function(id) {
                currentTargetId = id;
                const name = pingTargets[id].name;
                targetNameElem.innerText = '网络真连接连通性 (' + name + ')';
                modalTitle.innerText = name + ' - 详细延迟历史';
                document.getElementById('s-opt-' + id).checked = true;
                document.getElementById('m-opt-' + id).checked = true;
                pingData.fill(0);
                rtValueElem.innerText = '-- ms';
            }

            // Debounce function
            function debounce(func, wait) {
                let timeout;
                return function() {
                    const context = this, args = arguments;
                    clearTimeout(timeout);
                    timeout = setTimeout(() => func.apply(context, args), wait);
                };
            }

            function resizeCanvas(canvas, ctx) {
                const dpr = window.devicePixelRatio || 1;
                const w = canvas.parentElement.clientWidth;
                const h = canvas.parentElement.clientHeight;
                if (!w || !h) return;
                canvas.width = w * dpr;
                canvas.height = h * dpr;
                ctx.scale(dpr, dpr);
                canvas.style.width = w + 'px';
                canvas.style.height = h + 'px';
            }

            window.openModal = function() {
                modal.classList.add('active');
                isModalOpen = true;
                setTimeout(() => {
                    resizeCanvas(largeCanvas, largeCtx);
                    drawCharts(); 
                }, 50);
            }
            window.closeModal = function() {
                modal.classList.remove('active');
                isModalOpen = false;
            }
            
            const handleResize = debounce(() => {
                resizeCanvas(smallCanvas, smallCtx);
                if (isModalOpen) resizeCanvas(largeCanvas, largeCtx);
                drawCharts();
            }, 200);
            window.addEventListener('resize', handleResize);
            
            resizeCanvas(smallCanvas, smallCtx);

            function renderLineChart(ctx, canvas, dataPoints, showGrid = false) {
                const w = canvas.parentElement.clientWidth; 
                const h = canvas.parentElement.clientHeight;
                ctx.clearRect(0, 0, w, h);
                const validPoints = dataPoints.filter(p => p > 0);
                let maxVal = Math.max(100, ...validPoints);
                if (maxVal > 1000) maxVal = 2000; 

                if (showGrid) {
                    ctx.beginPath();
                    ctx.strokeStyle = 'rgba(0,0,0,0.05)';
                    ctx.lineWidth = 1;
                    for (let i = 1; i < 4; i++) {
                        const y = h - (i * 0.25 * h);
                        ctx.moveTo(0, y);
                        ctx.lineTo(w, y);
                    }
                    ctx.stroke();
                }

                const count = dataPoints.length;
                const stepX = w / (count - 1);
                ctx.beginPath();
                for (let i = 0; i < count; i++) {
                    const val = dataPoints[i];
                    const x = i * stepX;
                    const y = h - (val / maxVal) * (h * 0.85); 
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.lineJoin = 'round';
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#2b5876'; 
                ctx.stroke();

                ctx.lineTo(w, h);
                ctx.lineTo(0, h);
                ctx.closePath();
                const grad = ctx.createLinearGradient(0, 0, 0, h);
                grad.addColorStop(0, 'rgba(43, 88, 118, 0.4)');
                grad.addColorStop(1, 'rgba(43, 88, 118, 0.0)');
                ctx.fillStyle = grad;
                ctx.fill();
            }

            function updateStats(lastVal) {
                const valid = pingData.filter(x => x > 0);
                if (valid.length === 0) return;
                const min = Math.min(...valid);
                const max = Math.max(...valid);
                const avg = Math.round(valid.reduce((a,b)=>a+b,0) / valid.length);
                let sumDiff = 0;
                for (let i = 1; i < valid.length; i++) sumDiff += Math.abs(valid[i] - valid[i - 1]);
                const jitter = valid.length > 1 ? Math.round(sumDiff / (valid.length - 1)) : 0;
                document.getElementById('stat-curr').innerText = lastVal;
                document.getElementById('stat-avg').innerText = avg;
                document.getElementById('stat-max').innerText = max;
                document.getElementById('stat-min').innerText = min;
                document.getElementById('stat-jitter').innerText = jitter;
            }

            function drawCharts() {
                const smallData = pingData.slice(-smallViewLimit);
                renderLineChart(smallCtx, smallCanvas, smallData, false);
                if (isModalOpen) renderLineChart(largeCtx, largeCanvas, pingData, true);
            }

            async function doRealTimePing() {
                const start = performance.now();
                const target = pingTargets[currentTargetId];
                const separator = target.url.includes('?') ? '&' : '?';
                const url = target.url + separator + 'ts=' + Date.now();
                
                let dur = 0;
                try {
                    const fetchOpts = { cache: 'no-store' };
                    if (currentTargetId !== 1) fetchOpts.mode = 'no-cors';
                    await fetch(url, fetchOpts);
                    dur = Math.round(performance.now() - start);
                    
                    if (dur > 300) rtValueElem.style.color = '#ef4444';
                    else if (dur > 150) rtValueElem.style.color = '#f59e0b';
                    else rtValueElem.style.color = '#10b981';
                } catch (e) {
                    dur = 0; 
                    rtValueElem.style.color = '#aaa';
                }

                pingData.shift();
                pingData.push(dur);
                rtValueElem.innerText = (dur > 0 ? dur : '超时') + ' ms';
                if (isModalOpen) updateStats(dur);
                requestAnimationFrame(drawCharts);
            }

            function startMonitor() {
                if (pingInterval) clearInterval(pingInterval);
                doRealTimePing(); 
                pingInterval = setInterval(doRealTimePing, 1000); 
            }
            function stopMonitor() {
                if (pingInterval) { clearInterval(pingInterval); pingInterval = null; }
            }
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) stopMonitor(); else startMonitor();
            });
            startMonitor();
            
            // === 4. AI Analysis ===
            async function startAiAnalysis() {
                const aiResultContainer = document.getElementById('ai-result-container');
                const p = aiResultContainer.querySelector('p'); 
                let isFirstChunk = true;

                try {
                    const userInfo = {
                        connection_ip: '${ip}',
                        ipv4_address: document.getElementById('ipv4-addr').innerText,
                        ipv6_address: document.getElementById('ipv6-addr').innerText,
                        isp: '${ispInfo.name}',
                        cf_location: '${locationStr}',
                        api_location: document.getElementById('ext-loc').innerText,
                        latency: document.getElementById('rtt-value').innerText.replace(/<[^>]*>/g, '').trim(),
                        node: '${nodeInfo.name} (${colo})'
                    };
                    const response = await fetch(window.location.pathname + '?act=analyze', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(userInfo)
                    });
                    
                    if (!response.ok) {
                        const errText = await response.text();
                        // 尝试解析 JSON 错误
                        try {
                           const jsonErr = JSON.parse(errText);
                           throw new Error(jsonErr.error || errText);
                        } catch(e) {
                           throw new Error(errText || \`服务器错误: \${response.status}\`);
                        }
                    }
                    
                    const reader = response.body.getReader();
                    const decoder = new TextDecoder();
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        const chunk = decoder.decode(value, { stream: true });
                        const formattedChunk = chunk.replace(/\\n/g, '<br>');

                        if (isFirstChunk && /[\u4e00-\u9fa5]/.test(chunk)) {
                            p.classList.remove('loading');
                            p.innerHTML = formattedChunk;
                            isFirstChunk = false;
                        } else if (!isFirstChunk) {
                            p.innerHTML += formattedChunk;
                        }
                    }
                } catch (error) {
                    p.classList.remove('loading');
                    p.innerHTML = '<span class="error">分析失败：' + error.message + '</span>';
                }
            }
        </script>
    </body>
    </html>
    `, {
      headers: { "content-type": "text/html;charset=UTF-8" },
    });
}

// =========================================
//            辅助工具函数
// =========================================

function identifyISP(rawIsp, asn) {
    const isp = rawIsp.toLowerCase();
    
    // 默认样式
    let result = { name: rawIsp || "未知网络", color: "#555555", bg: "rgba(85, 85, 85, 0.1)" };

    // 1. 中国大陆
    if (isp.includes("chinanet") || isp.includes("telecom")) 
        return { name: "中国电信", color: "#0066CC", bg: "rgba(0, 102, 204, 0.1)" };
    if (isp.includes("unicom")) 
        return { name: "中国联通", color: "#E60012", bg: "rgba(230, 0, 18, 0.1)" };
    if (isp.includes("mobile") || isp.includes("cmcc") || isp.includes("tietong")) 
        return { name: "中国移动", color: "#0085D0", bg: "rgba(0, 133, 208, 0.1)" };
    if (isp.includes("broadnet") || isp.includes("cable") || isp.includes("gehua")) 
        return { name: "中国广电", color: "#7CB342", bg: "rgba(124, 179, 66, 0.15)" };
    if (isp.includes("cernet")) 
        return { name: "中国教育网", color: "#00A0E9", bg: "rgba(0, 160, 233, 0.1)" };
    if (isp.includes("dr.peng") || isp.includes("great wall")) 
        return { name: "长城/鹏博士", color: "#E85928", bg: "rgba(232, 89, 40, 0.1)" };

    // 2. 港澳台
    if (isp.includes("hkt") || isp.includes("pccw")) 
        return { name: "HKT (香港电讯)", color: "#00539F", bg: "rgba(0, 83, 159, 0.1)" };
    if (isp.includes("hkbn")) 
        return { name: "HKBN (香港宽频)", color: "#743C8F", bg: "rgba(116, 60, 143, 0.1)" };
    if (isp.includes("hgc")) 
        return { name: "HGC", color: "#E3007F", bg: "rgba(227, 0, 127, 0.1)" };
    if (isp.includes("cmhk")) 
        return { name: "CMHK", color: "#0085D0", bg: "rgba(0, 133, 208, 0.1)" };
    if (isp.includes("ctm")) 
        return { name: "CTM (澳门电讯)", color: "#00A651", bg: "rgba(0, 166, 81, 0.1)" };
    if (isp.includes("chunghwa") || isp.includes("hinet")) 
        return { name: "中华电信 (HiNet)", color: "#2E57A6", bg: "rgba(46, 87, 166, 0.1)" };

    // 3. 云厂商
    if (isp.includes("alibaba") || isp.includes("aliyun")) 
        return { name: "阿里云", color: "#FF6A00", bg: "rgba(255, 106, 0, 0.1)" };
    if (isp.includes("tencent")) 
        return { name: "腾讯云", color: "#0052D9", bg: "rgba(0, 82, 217, 0.1)" };
    if (isp.includes("huawei")) 
        return { name: "华为云", color: "#C7000B", bg: "rgba(199, 0, 11, 0.1)" };
    if (isp.includes("google")) 
        return { name: "Google Cloud", color: "#4285F4", bg: "rgba(66, 133, 244, 0.1)" };
    if (isp.includes("amazon") || isp.includes("aws")) 
        return { name: "AWS", color: "#FF9900", bg: "rgba(255, 153, 0, 0.1)" };
    if (isp.includes("microsoft") || isp.includes("azure")) 
        return { name: "Microsoft Azure", color: "#0078D4", bg: "rgba(0, 120, 212, 0.1)" };
    if (isp.includes("oracle")) 
        return { name: "Oracle Cloud", color: "#C74634", bg: "rgba(199, 70, 52, 0.1)" };
    if (isp.includes("digitalocean")) 
        return { name: "DigitalOcean", color: "#0080FF", bg: "rgba(0, 128, 255, 0.1)" };
    if (isp.includes("vultr")) 
        return { name: "Vultr", color: "#0057E7", bg: "rgba(0, 87, 231, 0.1)" };
    if (isp.includes("linode")) 
        return { name: "Linode", color: "#02B159", bg: "rgba(2, 177, 89, 0.1)" };
    if (isp.includes("cloudflare")) 
        return { name: "Cloudflare WARP", color: "#F38020", bg: "rgba(243, 128, 32, 0.1)" };

    return result;
}

function translateColo(coloCode) {
    const code = coloCode.toUpperCase();
    const map = {
        "HKG": { name: "香港", iso: "hk" },
        "TPE": { name: "台北", iso: "tw" },
        "NRT": { name: "东京", iso: "jp" },
        "KIX": { name: "大阪", iso: "jp" },
        "ICN": { name: "首尔", iso: "kr" },
        "SIN": { name: "新加坡", iso: "sg" },
        "KUL": { name: "吉隆坡", iso: "my" },
        "BKK": { name: "曼谷", iso: "th" },
        "SGN": { name: "胡志明市", iso: "vn" },
        "MNL": { name: "马尼拉", iso: "ph" },
        "LAX": { name: "洛杉矶", iso: "us" },
        "SJC": { name: "圣何塞", iso: "us" },
        "SFO": { name: "旧金山", iso: "us" },
        "SEA": { name: "西雅图", iso: "us" },
        "JFK": { name: "纽约", iso: "us" },
        "LHR": { name: "伦敦", iso: "gb" },
        "FRA": { name: "法兰克福", iso: "de" },
        "AMS": { name: "阿姆斯特丹", iso: "nl" },
        "SYD": { name: "悉尼", iso: "au" },
    };
    return map[code] || { name: code, iso: null };
}