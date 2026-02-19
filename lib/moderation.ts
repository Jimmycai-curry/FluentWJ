// Spec: /docs/specs/moderation-integration.md
// 说明: 阿里云 AI 安全护栏 API 封装，提供文本审核能力

import RPCClient from '@alicloud/pop-core';
import crypto from 'crypto';

/**
 * 审核结果接口
 */
export interface ModerationResult {
  pass: boolean;                          // 是否通过审核
  isSensitive: boolean;                   // 是否包含敏感内容
  externalAuditId?: string;               // 阿里云审核 ID（用于溯源）
  blockedReason?: string;                 // 拒绝原因
  riskLevel?: 'high' | 'medium' | 'low' | 'none';  // 风险等级
  sensitiveLevel?: string;                // 敏感等级（S0-S4）
  attackLevel?: 'high' | 'medium' | 'low' | 'none'; // 攻击等级
  labels?: string[];                      // 命中的标签
  sensitiveData?: string[];               // 检测到的敏感数据
  adviceAnswer?: string;                  // 自动拒答建议
}

/**
 * 阿里云 AI 安全护栏审核响应接口
 */
interface AliyunModerationResponse {
  Code: number;
  Message: string;
  RequestId: string;
  Data: {
    RiskLevel: 'high' | 'medium' | 'low' | 'none';  // 风险等级
    SensitiveLevel?: string;                        // 敏感等级（S0-S4）
    AttackLevel?: 'high' | 'medium' | 'low' | 'none'; // 攻击等级
    Result?: Array<{                                // 合规风险结果
      Label: string;
      Confidence: number;
      Riskwords?: string;
      Description?: string;
      CustomizedHit?: Array<{
        LibName: string;
        Keywords: string;
      }>;
    }>;
    SensitiveResult?: Array<{                       // 敏感信息结果
      Label: string;
      SensitiveLevel: string;
      Description?: string;
      SensitiveData?: string[];
    }>;
    AttackResult?: Array<{                          // 攻击检测结果
      Label: string;
      AttackLevel: string;
      Confidence: number;
      Description?: string;
    }>;
    Advice?: Array<{                                // 自动拒答建议
      Answer: string;
      HitLabel?: string;
      HitLibName?: string;
    }>;
  };
}

/**
 * 本地敏感词库（降级策略用）
 * 生产环境应从数据库或 Redis 加载
 *
 * 分类说明：
 * 1. 政治敏感 - 政治人物、敏感事件、敏感组织等
 * 2. 暴恐相关 - 暴力、恐怖主义、武器等
 * 3. 色情低俗 - 色情、低俗内容等
 * 4. 赌博相关 - 赌博、博彩等
 * 5. 毒品相关 - 毒品、吸毒等
 * 6. 辱骂攻击 - 人身攻击、脏话等
 * 7. 诈骗相关 - 诈骗、钓鱼等
 * 8. AI攻击相关 - 提示词注入、越狱攻击等
 */
const FALLBACK_SENSITIVE_KEYWORDS = [
  // ========== 政治敏感词 ==========
  // 敏感政治人物（部分示例）
  '习近平', '江泽民', '胡锦涛', '温家宝', '薄熙来', '周永康',
  '毛泽东', '邓小平', '周恩来', '蒋介石', '孙中山',
  '达赖', '喇嘛', '法轮功', '李洪志', '六四', '天安门',
  '台独', '藏独', '疆独', '港独', '东突', '分裂',
  // 敏感事件
  '文革', '大跃进', '反右', '镇压', '屠杀', '迫害',

  // ========== 暴恐相关 ==========
  // 恐怖主义
  '恐怖分子', '恐怖袭击', '恐怖组织', '基地组织', 'ISIS', '塔利班',
  '自杀式', '人肉炸弹', '汽车炸弹', '爆炸物',
  // 暴力行为
  '杀人', '谋杀', '暗杀', '行刺', '处决', '灭口',
  '肢解', '碎尸', '斩首', '活埋', '焚尸',
  '绑架', '劫持', '人质', '勒索',
  // 武器相关
  '炸弹', '炸药', '雷管', '手榴弹', '核武器', '生化武器',
  '枪支', '手枪', '步枪', '机关枪', '冲锋枪', '狙击枪',
  '弹药', '子弹', '炮弹', '导弹', '火箭弹',

  // ========== 色情低俗词 ==========
  // 色情行为
  '强奸', '轮奸', '强暴', '性侵', '猥亵', '乱伦',
  '嫖娼', '卖淫', '召妓', '援交', '约炮', '一夜情',
  '群交', '换妻', '3P', 'SM', '性虐',
  // 色情内容
  '黄片', 'AV', '色片', '淫秽', '黄色电影', '成人影片',
  '裸体', '裸照', '艳照', '私密照', '不雅照',
  // 低俗词汇
  '操你', '你妈', '妈的', '他妈', '草泥马', '尼玛',
  '傻逼', '傻B', '煞笔', '二逼', '逗比',
  '脑残', '白痴', '弱智', '智障', '脑瘫',

  // ========== 赌博相关 ==========
  // 赌博平台
  '赌场', '赌球', '赌马', '百家乐', '轮盘赌', '老虎机',
  '澳门赌场', '威尼斯人', '金沙', '永利',
  // 网络赌博
  '网赌', '线上赌场', '网络赌球', '赌球网站',
  '博彩', '博彩公司', '博彩平台', '投注平台',
  '时时彩', 'PK10', '六合彩', '时时彩', '极速赛车',
  // 赌博行为
  '下注', '押注', '庄家', '开盘', '赌局', '赌注',
  '高利贷', '放贷', '借贷赌博', '赌债',

  // ========== 毒品相关 ==========
  // 毒品种类
  '海洛因', '冰毒', '可卡因', '大麻', 'K粉', '摇头丸',
  '鸦片', '吗啡', '杜冷丁', '安非他命', '甲基苯丙胺',
  '新型毒品', '合成毒品', '软性毒品',
  // 毒品行为
  '吸毒', '贩毒', '运毒', '制毒', '种毒',
  '注射毒品', '吸食毒品', '毒品交易',
  '毒贩', '毒枭', '毒窝', '吸毒工具',
  // 毒品黑话
  '溜冰', '嗨', '嗨药', '嗑药', '溜果子', '打K',

  // ========== 辱骂攻击词 ==========
  // 人身攻击
  '滚蛋', '滚开', '滚粗', '爬', '爬开',
  '死全家', '全家死光', '不得好死', '断子绝孙',
  '出门被车撞', '被车撞死', '不得善终',
  '去死', '死吧', '去死吧', '你怎么不去死',
  // 歧视性词汇
  '傻X', 'SX', 'NC', '2B', '装B', '装逼',
  '土鳖', '穷逼', '穷鬼', '屌丝', '穷酸',
  '乡巴佬', '土包子', '农民', '乡下人',
  '娘炮', '伪娘', '人妖', '阴阳人',
  // 地域歧视
  '地域黑', '黑省', '某省人', '某地人',

  // ========== 诈骗相关 ==========
  // 诈骗类型
  '诈骗', '骗钱', '骗取', '电信诈骗', '网络诈骗',
  '杀猪盘', '庞氏骗局', '传销', '非法集资',
  '钓鱼网站', '钓鱼链接', '木马', '病毒链接',
  // 诈骗手段
  '冒充公检法', '冒充客服', '冒充银行', '冒充快递',
  '中奖通知', '领取奖金', '免费领取', '点击领取',
  '账户冻结', '异常登录', '需要验证', '安全验证',
  '转账', '汇款', '打款', '代付',

  // ========== AI攻击相关（提示词注入/越狱）==========
  // 提示词注入
  'ignore previous instructions', 'ignore all instructions',
  '忽略之前的指令', '忽略所有指令', '忘记之前的设定',
  'disregard all prior instructions', 'forget everything',
  '你是', '你现在扮演', '你现在是', 'your new role is',
  'system prompt', '系统提示词', '开发者模式',
  // 越狱攻击
  'DAN', 'Do Anything Now', 'Stanley', 'ChatGPT',
  '越狱模式', '解锁模式', '无限制模式',
  'no restrictions', 'no rules', 'no limitations',
  'bypass', '绕过', '突破限制',
  // 角色扮演攻击
  'pretend to be', 'act as if', 'simulate',
  '假装', '假装你是', '模拟', '扮演',
  'developer mode enabled', 'debug mode',
  // 敏感指令
  'how to make', '如何制造', '如何制作',
  'how to hack', '如何黑入', '黑客教程',
  'crack password', '破解密码', '绕过密码'
];

/**
 * 脱敏处理 AccessKey（用于日志）
 */
function maskAccessKey(key: string): string {
  if (!key || key.length < 8) return '***';
  return `${key.slice(0, 4)}***${key.slice(-4)}`;
}

/**
 * 延迟函数（用于重试）
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 解析阿里云 AI 安全护栏审核响应
 */
function parseModerationResponse(response: AliyunModerationResponse): ModerationResult {
  // 检查响应码
  if (response.Code !== 200) {
    throw new Error(`阿里云审核服务返回错误: ${response.Message}`);
  }

  // 直接使用 RiskLevel（API 已计算好）
  const riskLevel = response.Data.RiskLevel || 'none';
  const sensitiveLevel = response.Data.SensitiveLevel || 'S0';
  const attackLevel = response.Data.AttackLevel || 'none';

  // 判断是否通过（高风险、中风险、攻击高风险都拒绝）
  const hasRisk = riskLevel === 'high' || riskLevel === 'medium';
  const hasAttack = attackLevel === 'high';
  const hasSensitive = sensitiveLevel !== 'S0' && parseInt(sensitiveLevel.substring(1)) >= 3; // S3, S4 拒绝
  
  const pass = !hasRisk && !hasAttack && !hasSensitive;

  // 提取标签
  const labels: string[] = [];
  if (response.Data.Result) {
    labels.push(...response.Data.Result.map(r => r.Label));
  }
  if (response.Data.AttackResult) {
    labels.push(...response.Data.AttackResult.map(r => r.Label));
  }

  // 提取拒绝原因
  const reasons: string[] = [];
  
  // 合规风险原因
  if (response.Data.Result && response.Data.Result.length > 0) {
    const highRiskResults = response.Data.Result.filter(r => r.Confidence >= 80);
    reasons.push(...highRiskResults.map(r => r.Description || r.Label));
  }

  // 攻击检测原因
  if (response.Data.AttackResult && response.Data.AttackResult.length > 0) {
    const highAttackResults = response.Data.AttackResult.filter(r => r.AttackLevel === 'high');
    reasons.push(...highAttackResults.map(r => r.Description || r.Label));
  }

  // 敏感信息原因
  if (response.Data.SensitiveResult && response.Data.SensitiveResult.length > 0) {
    const highSensitiveResults = response.Data.SensitiveResult.filter(r => {
      const level = parseInt(r.SensitiveLevel.substring(1));
      return level >= 3;
    });
    reasons.push(...highSensitiveResults.map(r => r.Description || `敏感信息(${r.SensitiveLevel})`));
  }

  // 提取敏感数据（用于日志记录，不返回给用户）
  const sensitiveData: string[] = [];
  if (response.Data.SensitiveResult) {
    response.Data.SensitiveResult.forEach(sr => {
      if (sr.SensitiveData) {
        sensitiveData.push(...sr.SensitiveData);
      }
    });
  }

  // 提取自动拒答建议
  let adviceAnswer: string | undefined;
  if (response.Data.Advice && response.Data.Advice.length > 0) {
    adviceAnswer = response.Data.Advice[0].Answer;
  }

  const blockedReason = reasons.length > 0 ? reasons.join('; ') : undefined;

  return {
    pass,
    isSensitive: hasRisk || hasSensitive,
    externalAuditId: response.RequestId,
    blockedReason: !pass ? blockedReason : undefined,
    riskLevel,
    sensitiveLevel,
    attackLevel,
    labels: labels.length > 0 ? labels : undefined,
    sensitiveData: sensitiveData.length > 0 ? sensitiveData : undefined,
    adviceAnswer: !pass ? adviceAnswer : undefined
  };
}

/**
 * 降级策略：本地关键词过滤
 * 当阿里云审核服务不可用时使用
 */
function applyFallbackStrategy(text: string): ModerationResult {
  console.warn('[Moderation] 使用降级策略：本地关键词过滤');

  // 转为小写进行匹配
  const lowerText = text.toLowerCase();

  // 检测是否包含敏感词
  for (const keyword of FALLBACK_SENSITIVE_KEYWORDS) {
    if (lowerText.includes(keyword.toLowerCase())) {
      console.warn('[Moderation] 本地过滤检测到敏感内容:', keyword);
      return {
        pass: false,
        isSensitive: true,
        blockedReason: `检测到敏感内容（本地过滤）`,
        riskLevel: 'high',
        labels: ['本地过滤']
      };
    }
  }

  // 未检测到敏感词，通过审核
  console.log('[Moderation] 本地过滤通过');
  return {
    pass: true,
    isSensitive: false,
    riskLevel: 'low'
  };
}

/**
 * 阿里云内容审核内部调用（单次）
 */
async function moderateContentInternal(text: string): Promise<ModerationResult> {
  // 检查环境变量
  if (!process.env.ALIYUN_ACCESS_KEY_ID) {
    throw new Error('阿里云 AccessKey ID 未配置');
  }

  if (!process.env.ALIYUN_ACCESS_KEY_SECRET) {
    throw new Error('阿里云 AccessKey Secret 未配置');
  }

  // 创建阿里云客户端（AI 安全护栏）
  const client = new RPCClient({
    accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID,
    accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET,
    endpoint: process.env.ALIYUN_MODERATION_ENDPOINT || 'https://green-cip.cn-shanghai.aliyuncs.com',
    apiVersion: '2022-03-02'
  });

  // 记录日志（脱敏）
  console.log('[Moderation] 开始审核内容 (AI 安全护栏)...', {
    textLength: text.length,
    accessKeyId: maskAccessKey(process.env.ALIYUN_ACCESS_KEY_ID),
    endpoint: process.env.ALIYUN_MODERATION_ENDPOINT || 'https://green-cip.cn-shanghai.aliyuncs.com',
    timestamp: new Date().toISOString()
  });

  const startTime = Date.now();

  try {
    // 生成唯一的 chatId（标识一轮对话）
    const chatId = crypto.randomUUID();

    // 构建请求参数（AI 安全护栏格式）
    const params = {
      Service: 'query_security_check',  // AI 输入内容安全检测
      ServiceParameters: JSON.stringify({
        content: text,
        chatId: chatId  // 用于标识一轮对话
      })
    };

    const requestOption = {
      method: 'POST',
      timeout: parseInt(process.env.ALIYUN_MODERATION_TIMEOUT || '10000')
    };

    // 调用阿里云 AI 安全护栏 API
    const response: AliyunModerationResponse = await client.request(
      'TextModerationPlus',  // AI 安全护栏 API
      params,
      requestOption
    );

    // 解析响应
    const result = parseModerationResponse(response);

    // 记录成功日志
    const duration = Date.now() - startTime;
    console.log('[Moderation] 审核完成 (AI 安全护栏)', {
      pass: result.pass,
      isSensitive: result.isSensitive,
      riskLevel: result.riskLevel,
      sensitiveLevel: result.sensitiveLevel,
      attackLevel: result.attackLevel,
      hasSensitiveData: result.sensitiveData ? result.sensitiveData.length : 0,
      externalAuditId: result.externalAuditId,
      duration: `${duration}ms`
    });

    // 如果检测到敏感数据，单独记录警告日志
    if (result.sensitiveData && result.sensitiveData.length > 0) {
      console.warn('[Moderation] 检测到敏感信息!', {
        sensitiveLevel: result.sensitiveLevel,
        sensitiveCount: result.sensitiveData.length,
        // 不记录具体数据，只记录数量
        externalAuditId: result.externalAuditId
      });
    }

    // 如果检测到攻击，单独记录警告日志
    if (result.attackLevel === 'high' || result.attackLevel === 'medium') {
      console.warn('[Moderation] 检测到恶意攻击行为!', {
        attackLevel: result.attackLevel,
        labels: result.labels,
        externalAuditId: result.externalAuditId
      });
    }

    return result;

  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error('[Moderation] 审核失败', {
      error: error.message,
      statusCode: error.statusCode,
      duration: `${duration}ms`
    });

    throw error;
  }
}

/**
 * 调用阿里云内容安全 API 审核文本内容（带重试和降级）
 * 
 * @param text - 待审核的文本内容
 * @returns 审核结果
 * @throws Error - 降级策略失败
 */
export async function moderateContent(text: string): Promise<ModerationResult> {
  // 空内容直接通过
  if (!text || text.trim().length === 0) {
    console.log('[Moderation] 内容为空，直接通过');
    return {
      pass: true,
      isSensitive: false,
      riskLevel: 'low'
    };
  }

  try {
    // 第一次尝试
    console.log('[Moderation] 第 1 次调用阿里云审核...');
    return await moderateContentInternal(text);
  } catch (firstError: any) {
    console.warn('[Moderation] 第 1 次调用失败，准备重试', { error: firstError.message });

    // 判断错误类型
    const isRetriableError = 
      firstError.code === 'ECONNREFUSED' ||
      firstError.code === 'ETIMEDOUT' ||
      firstError.code === 'ENOTFOUND' ||
      firstError.statusCode === 503 ||
      firstError.statusCode === 429;

    // 认证失败不重试
    if (firstError.statusCode === 401 || firstError.statusCode === 403) {
      console.error('[Moderation] 阿里云认证失败，执行降级策略');
      return applyFallbackStrategy(text);
    }

    // 可重试的错误，等待 1 秒后重试
    if (isRetriableError) {
      await sleep(1000);

      try {
        console.log('[Moderation] 第 2 次调用阿里云审核...');
        return await moderateContentInternal(text);
      } catch (secondError: any) {
        console.error('[Moderation] 第 2 次调用仍失败，执行降级策略', {
          error: secondError.message
        });
        return applyFallbackStrategy(text);
      }
    }

    // 不可重试的错误，直接降级
    console.error('[Moderation] 不可重试的错误，执行降级策略');
    return applyFallbackStrategy(text);
  }
}

/**
 * 从 Redis 或数据库加载敏感词库（可选，用于降级策略优化）
 * 生产环境应实现此函数
 */
export async function loadSensitiveKeywords(): Promise<string[]> {
  // TODO: 从 Redis 或数据库加载
  // const cached = await redis.get('sensitive_keywords');
  // if (cached) return JSON.parse(cached);
  
  // 暂时返回默认词库
  return FALLBACK_SENSITIVE_KEYWORDS;
}
