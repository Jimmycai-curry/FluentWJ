// Spec: /docs/specs/watermark-service.md
// 说明: 水印生成工具，为 AI 生成的内容植入显式和隐式水印

import { createHash } from 'crypto';

/**
 * 零宽字符定义
 */
const ZERO_WIDTH_CHARS = {
  ZERO: '\u200B',      // Zero Width Space（表示 0）
  ONE: '\u200C',       // Zero Width Non-Joiner（表示 1）
  SEPARATOR: '\u200D'  // Zero Width Joiner（字符分隔符）
} as const;

/**
 * 添加显式水印（可见声明）
 * 
 * 满足《互联网信息服务深度合成管理规定》第十七条要求：
 * "深度合成服务提供者应当在生成或者编辑的信息内容的合理位置、区域进行显著标识"
 * 
 * 在内容末尾追加一行可见声明，确保内容离开系统后（如被复制到邮件）接收方仍能看到标识。
 * 不暴露 auditToken，仅声明 AI 生成来源。
 * 
 * @param content - 原始内容
 * @returns 追加了显式声明的内容
 */
function addVisibleWatermark(content: string): string {
  const declaration = '\n\n【AI 生成】本内容由 FluentWJ AI 算法辅助生成，仅供商务写作参考，不构成任何法律要约或承诺，请您在使用前核实全部信息真实性。';
  return content + declaration;
}

/**
 * 将字符串编码为零宽字符（二进制编码方式）
 * 
 * @param token - 待编码的字符串（如 UUID）
 * @returns 零宽字符编码后的字符串
 */
function encodeToZeroWidth(token: string): string {
  let encoded = '';

  // 遍历每个字符
  for (const char of token) {
    // 获取字符的 Unicode 码点
    const charCode = char.charCodeAt(0);
    
    // 转为二进制（8位）
    const binary = charCode.toString(2).padStart(8, '0');

    // 将每个二进制位转为零宽字符
    for (const bit of binary) {
      encoded += bit === '0' ? ZERO_WIDTH_CHARS.ZERO : ZERO_WIDTH_CHARS.ONE;
    }

    // 添加字符分隔符
    encoded += ZERO_WIDTH_CHARS.SEPARATOR;
  }

  return encoded;
}

/**
 * 从零宽字符解码为字符串
 * 
 * @param encoded - 零宽字符编码的字符串
 * @returns 解码后的原始字符串
 */
function decodeFromZeroWidth(encoded: string): string {
  // 按字符分隔符拆分
  const chars = encoded.split(ZERO_WIDTH_CHARS.SEPARATOR).filter(c => c.length > 0);
  let decoded = '';

  for (const charBits of chars) {
    let binary = '';
    
    // 将零宽字符转回二进制
    for (const bit of charBits) {
      if (bit === ZERO_WIDTH_CHARS.ZERO) {
        binary += '0';
      } else if (bit === ZERO_WIDTH_CHARS.ONE) {
        binary += '1';
      }
      // 忽略其他字符
    }

    // 二进制转为字符
    if (binary.length > 0) {
      const charCode = parseInt(binary, 2);
      decoded += String.fromCharCode(charCode);
    }
  }

  return decoded;
}

/**
 * 将隐式水印嵌入到内容中
 * 策略：在内容的前 100 个字符的第一个句号后插入
 * 
 * @param content - 原始内容
 * @param watermark - 零宽字符水印
 * @returns 嵌入水印后的内容
 */
function embedInvisibleWatermark(content: string, watermark: string): string {
  // 在前 100 个字符中找第一个句号
  const searchRange = content.slice(0, 100);
  let insertPosition = searchRange.indexOf('。');
  
  // 如果没有中文句号，找英文句号
  if (insertPosition === -1) {
    insertPosition = searchRange.indexOf('.');
  }
  
  // 如果都没有，就在第 50 个字符位置插入
  if (insertPosition === -1) {
    insertPosition = Math.min(50, content.length);
  } else {
    insertPosition += 1; // 在句号后面插入
  }

  // 插入水印
  return content.slice(0, insertPosition) + watermark + content.slice(insertPosition);
}

/**
 * 为内容添加完整水印（隐式 + 显式双重标识）
 * 
 * 执行顺序：
 * 1. 隐式水印：通过零宽字符将 auditToken 编码嵌入，用户不可见，用于技术溯源
 * 2. 显式声明：在内容末尾追加一行可见的 AI 生成声明，满足监管要求
 * 
 * @param content - 原始内容
 * @param auditToken - 审计日志 UUID（用于溯源，不会明文出现在内容中）
 * @returns 带双重水印的内容
 */
export function addWatermark(content: string, auditToken: string): string {
  console.log('[Watermark] 添加双重水印...', { 
    auditToken,
    contentLength: content.length 
  });

  try {
    // 步骤 1：嵌入隐式水印（零宽字符，用户不可见）
    const invisibleWatermark = encodeToZeroWidth(auditToken);
    const contentWithInvisible = embedInvisibleWatermark(content, invisibleWatermark);

    // 步骤 2：追加显式声明（末尾可见文本，满足监管要求）
    const contentWithBoth = addVisibleWatermark(contentWithInvisible);

    console.log('[Watermark] 双重水印添加完成', {
      originalLength: content.length,
      finalLength: contentWithBoth.length,
      invisibleWatermarkLength: invisibleWatermark.length
    });

    return contentWithBoth;

  } catch (error) {
    console.error('[Watermark] 水印添加失败:', error);
    
    // 降级：至少保留显式声明，确保合规
    console.warn('[Watermark] 降级：添加显式声明，溯源依赖数据库记录');
    return addVisibleWatermark(content);
  }
}

/**
 * 计算内容的 SHA-256 哈希值
 * 
 * 用途：存入 audit_logs.content_hash，用于事后验证内容是否被篡改
 * 
 * @param content - 带水印的最终内容
 * @returns 64 位十六进制 SHA-256 哈希字符串
 */
export function calculateContentHash(content: string): string {
  return createHash('sha256').update(content, 'utf8').digest('hex');
}

/**
 * 从显式水印中提取 auditToken
 * 
 * @param content - 带水印的内容
 * @returns 提取的 auditToken，如果不存在则返回 null
 */
function extractVisibleWatermark(content: string): string | null {
  // 匹配显式水印中的 UUID
  const match = content.match(/溯源标识：([a-f0-9\-]{36})/);
  if (match) {
    return match[1];
  }
  return null;
}

/**
 * 从内容中提取隐式水印（auditToken）
 * 
 * @param content - 带水印的内容
 * @returns 提取的 auditToken，如果不存在则返回 null
 */
export function extractWatermark(content: string): string | null {
  console.log('[Watermark] 提取水印...', {
    contentLength: content.length
  });

  try {
    // 1. 尝试提取显式水印
    const visibleToken = extractVisibleWatermark(content);
    if (visibleToken) {
      console.log('[Watermark] 从显式水印提取成功:', visibleToken);
      return visibleToken;
    }

    // 2. 尝试提取隐式水印
    const zeroWidthChars = content.match(/[\u200B\u200C\u200D]+/g);
    if (zeroWidthChars) {
      for (const encoded of zeroWidthChars) {
        try {
          const decoded = decodeFromZeroWidth(encoded);

          // 验证是否为有效的 UUID（36 字符，包含连字符）
          if (/^[a-f0-9\-]{36}$/.test(decoded)) {
            console.log('[Watermark] 从隐式水印提取成功:', decoded);
            return decoded;
          }
        } catch (e) {
          // 解码失败，继续尝试下一个
          continue;
        }
      }
    }

    console.warn('[Watermark] 未找到有效水印');
    return null;

  } catch (error) {
    console.error('[Watermark] 水印提取失败:', error);
    return null;
  }
}

/**
 * 验证 auditToken 是否为有效的 UUID v4
 * 
 * @param token - 待验证的 token
 * @returns 是否有效
 */
export function isValidAuditToken(token: string): boolean {
  // UUID v4 格式：xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  const uuidV4Regex = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
  return uuidV4Regex.test(token);
}
