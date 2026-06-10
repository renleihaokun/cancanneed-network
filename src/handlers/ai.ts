/**
 * AI 分析处理器
 * 调用智谱 AI 对用户网络信息进行分析
 */

import type { Context } from 'hono';
import type { Env } from '../../types/env';
import { errorResponse } from '../utils/response';

/** AI API 超时时间（毫秒） - M2 修复 */
const AI_API_TIMEOUT = 30000;

/**
 * 处理 AI 分析请求
 * 接收用户网络信息，调用智谱 AI 生成分析报告
 * @param c - Hono Context
 * @returns 流式响应，包含 AI 分析结果
 */
export async function analyze(c: Context<{ Bindings: Env }>) {
  try {
    // H2 修复：添加输入验证
    let userInfo: Record<string, unknown>;
    try {
      userInfo = await c.req.json();
      if (!userInfo || typeof userInfo !== 'object' || Array.isArray(userInfo)) {
        return errorResponse(c, '无效的请求数据格式', 400);
      }
    } catch {
      return errorResponse(c, '无效的 JSON 格式', 400);
    }

    const apiKey = c.env.ZHIPU_API_KEY;

    if (!apiKey) {
      console.error('[AI] ZHIPU_API_KEY not configured');
      return errorResponse(c, 'AI 服务暂时不可用', 500);
    }

    // 构建智谱 AI 请求
    const zhipuRequest = {
      model: 'GLM-4-Flash-250414',
      messages: [
        {
          role: 'user',
          content: `你是一个非常"有梗"的网络分析助手。请根据以下JSON信息，用通俗易懂、极其俏皮的语言，对用户的网络情况进行一段简短的分析和总结。
          你的分析要"有态度"，可以根据用户的运营商（ISP）给出一些有趣的吐槽。不要使用markdown语法。
          信息如下：\n\n${JSON.stringify(userInfo, null, 2)}`,
        },
      ],
      stream: true,
      temperature: 1.0,
    };

    // M2 修复：添加超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), AI_API_TIMEOUT);

    let zhipuResponse: Response;
    try {
      zhipuResponse = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(zhipuRequest),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!zhipuResponse.ok) {
      // M7 修复：隐藏敏感错误信息，详细错误记录到日志
      const errorText = await zhipuResponse.text();
      console.error(`[AI] Zhipu API error: ${zhipuResponse.status} ${errorText}`);
      return errorResponse(c, 'AI 服务暂时不可用，请稍后重试', 502);
    }

    // 创建流式响应
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const reader = zhipuResponse.body!.getReader();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    // H1 修复：使用 ctx.waitUntil() 确保流式响应完成
    c.executionCtx.waitUntil(
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
                  const content = data.choices[0]?.delta?.content || '';
                  if (content) {
                    await writer.write(encoder.encode(content));
                  }
                } catch {
                  // 忽略解析错误，继续处理下一个数据块
                }
              }
            }
          }
        } catch (error) {
          console.error('[AI] Stream processing error:', error);
          await writer.abort(error);
        } finally {
          await writer.close();
        }
      })()
    );

    return new Response(readable, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch (error: any) {
    // M7 修复：隐藏敏感错误信息
    console.error(`[AI] Error: ${error.message}`);
    return errorResponse(c, 'AI 分析服务出现异常', 500);
  }
}
