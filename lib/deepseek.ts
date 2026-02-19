// Spec: /docs/specs/deepseek-integration.md
// 说明: DeepSeek-V3 API 封装，提供统一的文本生成接口

import { AIServiceError } from '@/utils/error';

/**
 * DeepSeek 生成参数接口
 */
export interface DeepSeekParams {
  scenario: string;        // 业务场景
  tone: string;            // 语气
  language: string;        // 目标语言
  recipientName: string;   // 收件人姓名
  recipientRole: string;   // 收件人职位
  senderName?: string;     // 发件人姓名（可选）
  keyPoints: string;       // 核心要点
}

/**
 * DeepSeek API 响应接口
 */
interface DeepSeekResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * 获取场景名称（中文）
 */
function getScenarioName(scenario: string): string {
  const scenarioMap: Record<string, string> = {
    'email': '商务邮件',
    'report': '工作汇报',
    'proposal': '项目提案',
    'notice': '正式公告'
  };
  return scenarioMap[scenario] || '商务邮件';
}

/**
 * 获取场景化的详细写作指令
 * 
 * 优化点：为不同场景提供定制化的写作指导，避免一刀切
 */
function getScenarioInstructions(scenario: string): string {
  const instructions: Record<string, string> = {
    'email': `
邮件场景特殊要求：
1. 采用标准商务信函结构：开头礼貌语、事项分点说明、结尾期待反馈
2. 使用礼貌用语："您好"、"感谢"、"期待您的反馈"
3. 结尾使用得体的祝辞（但不包含"此致敬礼"等套话）
4. 适当使用敬辞："请"、"烦请"、"劳烦"`,
    'report': `
汇报场景特殊要求：
1. 采用总分总结构：总体概述、详细分点、总结展望
2. 突出数据和事实，用数字说话，避免空泛描述
3. 使用清晰的逻辑层次：第一、第二、第三
4. 语言客观中立，避免主观情感色彩`,
    'proposal': `
提案场景特殊要求：
1. 强调价值主张和 ROI（投资回报率）
2. 逻辑清晰：问题分析、解决方案、预期收益
3. 使用有说服力的数据和案例支撑
4. 语言具有说服力和前瞻性`,
    'notice': `
公告场景特殊要求：
1. 语言简练、准确，避免冗余表达
2. 信息完整：时间、地点、要求一应俱全
3. 采用正式的书面用语，避免口语化
4. 结构清晰，使用序号或编号分点说明`
  };
  return instructions[scenario] || instructions['email'];
}

/**
 * 获取语气详细指令
 * 
 * 优化点：将简单的语气名称扩展为详细的写作指导，帮助 AI 更准确地把握语气
 */
function getToneInstructions(tone: string): string {
  const toneInstructions: Record<string, string> = {
    'formal': `
正式语气要求：
1. 使用敬语："您"、"贵公司"、"尊敬的"
2. 避免口语化表达："搞"、"弄"、"咱们"、"随便"
3. 用词严谨："根据"、"按照"、"依照"、"鉴于"
4. 句式完整，避免省略主语或谓语
5. 使用正式的商务书面语`,
    'friendly': `
友好语气要求：
1. 适度使用口语化表达，但不失专业性
2. 适当表达关心和理解："理解您的需求"、"感谢您的支持"
3. 使用积极正面的词汇："携手"、"合作"、"共赢"
4. 可以适当使用表情符号（慎用，仅限内部沟通）
5. 保持温暖但不失礼貌的商务距离`,
    'urgent': `
紧急语气要求：
1. 开门见山，直接切入主题，省略寒暄
2. 使用时间敏感的词汇："尽快"、"紧急"、"立刻"、"第一时间"
3. 突出行动要求和截止日期
4. 删减所有不必要的寒暄和客套话
5. 简洁有力，每句话都要有实际信息`,
    'humorous': `
轻松语气要求：
1. 使用恰当的比喻和类比，让内容更生动
2. 适度使用幽默元素，但避免冒犯或不当玩笑
3. 保持轻松但不失专业性
4. 适用于内部沟通或长期合作伙伴
5. 避免在正式提案或公告中使用`
  };
  return toneInstructions[tone] || toneInstructions['formal'];
}

/**
 * 获取语言名称
 */
function getLanguageName(language: string): string {
  const languageMap: Record<string, string> = {
    'zh-CN': '简体中文',
    'en-US': 'English',
    'zh-TW': '繁體中文',
    'ja-JP': '日本語',
    'ko-KR': '한국어'
  };
  return languageMap[language] || '简体中文';
}

/**
 * 获取输出示例（Few-shot示例）
 *
 * 优化点：为不同场景提供高质量示例，让 AI 模仿学习（问题3）
 */
function getOutputExample(scenario: string, tone: string): string {
  const examples: Record<string, string> = {
    'email': `
---

示例格式（仅供参考，请模仿其结构和语气）：

您好！感谢您拨冗阅读本邮件。

关于[核心事项]，我想与您沟通以下几点：

第一，[具体要点1]。
第二，[具体要点2]。
第三，[具体要点3]。

期待您的反馈，谢谢。

[发件人姓名]

---

注意：
1. 上面的"[]"为占位符，请替换为实际内容
2. 移除"您好！"、"谢谢。"等套话，保留得体的礼貌用语
3. 不包含"尊敬的"称谓和"此致敬礼"结尾`,
    'report': `
---

示例格式（仅供参考，请模仿其结构和语气）：

【总体概述】
简要说明汇报的主要内容和工作进展。

【工作成果】
1. [成果1]：具体描述，包含数据支撑
2. [成果2]：具体描述，包含数据支撑
3. [成果3]：具体描述，包含数据支撑

【存在问题】
- [问题1]：原因分析，解决方案
- [问题2]：原因分析，解决方案

【下阶段计划】
1. [计划1]
2. [计划2]

【总结】
简要总结，展望未来。

---

注意：
1. 使用清晰的标题和编号结构
2. 突出数据和事实
3. 语言客观，避免主观评价`,
    'proposal': `
---

示例格式（仅供参考，请模仿其结构和语气）：

【项目背景】
简要说明项目的背景和提出原因。

【问题分析】
当前存在[具体问题]，主要体现在：
1. [表现1]
2. [表现2]
3. [表现3]

【解决方案】
针对上述问题，我们提出以下解决方案：

1. 方案一：[方案描述]
   - 实施步骤：[具体步骤]
   - 预期效果：[量化指标]

2. 方案二：[方案描述]
   - 实施步骤：[具体步骤]
   - 预期效果：[量化指标]

【预期收益】
实施该方案后，预期可获得以下收益：
- 收益1：[具体描述和量化指标]
- 收益2：[具体描述和量化指标]

【资源需求】
1. 人力资源：[具体需求]
2. 预算支持：[具体金额]

【结语】
该方案具有可行性和高 ROI，建议批准实施。

---

注意：
1. 强调价值主张和投资回报
2. 使用数据支撑方案
3. 逻辑清晰，层层递进`,
    'notice': `
---

示例格式（仅供参考，请模仿其结构和语气）：

【通知事项】
简要说明通知的核心内容。

一、[事项1]
具体说明时间、地点、要求等关键信息。

二、[事项2]
具体说明时间、地点、要求等关键信息。

三、[事项3]
具体说明时间、地点、要求等关键信息。

【联系方式】
如有疑问，请联系：[联系人] [联系电话]

---

注意：
1. 语言简练，避免冗余
2. 信息完整：时间、地点、要求一应俱全
3. 使用正式书面用语`
  };
  return examples[scenario] || examples['email'];
}

/**
 * 构建系统消息（System Message）
 *
 * 优化点：
 * 1. 负面约束改为正面引导（问题1）
 * 2. 抽象要求改为具体标准（问题2）
 * 3. 加入输出示例（问题3）
 * 4. 修复第5、6条与用户消息的冲突（问题4）
 * 6. 统一输出纯文本格式（不支持Markdown）（问题6修改）
 * 7. 加入语气和语言的详细说明（问题7）
 * 8. 加入明确的内容边界（问题8）
 * 9. 加入质量检查清单（问题9）
 */
function buildSystemMessage(params: DeepSeekParams): string {
  // 所有场景统一使用纯文本格式，不使用 Markdown
  const formatRequirement = '使用纯文本格式，避免任何 Markdown 符号（如加粗符号、列表符号、标题符号等）';

  // 根据场景确定字数范围
  const lengthRequirement = {
    'notice': '150-300 字',
    'email': '200-400 字',
    'report': '300-600 字',
    'proposal': '400-800 字'
  }[params.scenario] || '200-400 字';

  return `你是一位专业的商务写作助手，擅长撰写各类商务邮件和文档。

核心任务：
根据用户提供的收件人信息和核心要点，生成一份符合要求的${getScenarioName(params.scenario)}正文。

场景化要求：
${getScenarioInstructions(params.scenario)}

语气要求：
${getToneInstructions(params.tone)}

语言要求：
目标语言：${getLanguageName(params.language)}
请确保完全使用目标语言进行撰写，包括礼貌用语和商务术语。

格式规范：
1. 采用标准商务信函结构：开头礼貌语、事项分点说明、结尾期待反馈
2. 每段聚焦一个核心观点，段落之间用空行分隔
3. 使用得体的敬辞和礼貌用语："您"、"请"、"感谢"、"期待"
4. ${formatRequirement}

字数控制：
${lengthRequirement}（根据内容密度合理调整，可适当浮动）

输出示例：
${getOutputExample(params.scenario, params.tone)}

输出边界说明：

必须包含：
1. 用户提供的所有核心要点（不得遗漏）
2. 符合目标语言的商务礼仪
3. 与指定语气一致的表达方式
4. 清晰的逻辑结构和层次

严禁包含：
1. "尊敬的XXX"、"亲爱的XXX"等称谓（在正文开头）
2. "此致敬礼"、"顺祝商祺"等结尾套话
3. 邮件主题行（Subject）
4. 任何 Markdown 格式符号（加粗符号、列表符号、标题符号等）

关于收件人和发件人信息：
用户会提供收件人和发件人的信息，这些信息仅供参考：
1. 请根据收件人的职位/背景调整用词和语气（如对总监用更正式的措辞）
2. 如果用户提供了发件人姓名，可在结尾处使用该姓名作为签名
3. 但不要在正文开头添加称谓套话

质量检查清单（生成前自查）：
1. 是否覆盖了用户输入的所有核心要点？
2. 语言是否符合${getLanguageName(params.language)}的商务礼仪？
3. 表达是否符合${params.tone}的语气要求？
4. 是否避免了敏感或不当词汇？
5. 长度是否在${lengthRequirement}范围内？
6. 是否符合场景化的特殊要求？

请确保满足上述所有要求后再输出。`;
}

/**
 * 构建用户消息（User Message）
 *
 * 优化点：修复与系统提示词的冲突（问题4）
 * - 明确说明收件人信息仅供参考
 * - 明确说明发件人信息的使用方式
 * - 移除所有 Markdown 符号，统一使用纯文本
 */
function buildUserMessage(params: DeepSeekParams): string {
  // 基础信息
  let message = `请为我撰写一份${getScenarioName(params.scenario)}：

收件人信息（仅供参考，用于调整语气和用词）：
姓名：${params.recipientName}
职位/背景：${params.recipientRole}
`;

  // 如果提供了发件人姓名，增加到 Prompt 中
  if (params.senderName && params.senderName.trim()) {
    message += `
发件人信息（仅在结尾作为签名使用）：
姓名：${params.senderName}
`;
  }

  // 核心要点
  message += `
核心要点（必须全部包含在生成内容中）：
${params.keyPoints}

请直接输出邮件正文内容。`;

  // 如果提供了发件人姓名，提示 AI 在结尾使用
  if (params.senderName && params.senderName.trim()) {
    message += `（注意：仅在正文最后一行使用"${params.senderName}"作为签名，不要添加"祝好"、"此致"等套话）`;
  }

  message += `请开始撰写。`;

  return message;
}

/**
 * 脱敏处理 API Key（用于日志）
 */
function maskApiKey(key: string): string {
  if (!key || key.length < 8) return '***';
  return `${key.slice(0, 3)}***${key.slice(-4)}`;
}

/**
 * 延迟函数（用于重试）
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * DeepSeek API 内部调用（单次）
 */
async function callDeepSeekInternal(params: DeepSeekParams): Promise<string> {
  // 检查环境变量
  if (!process.env.DEEPSEEK_API_KEY) {
    throw new AIServiceError('DeepSeek API Key 未配置');
  }

  if (!process.env.DEEPSEEK_API_URL) {
    throw new AIServiceError('DeepSeek API URL 未配置');
  }

  // 构建 Prompt
  const systemMessage = buildSystemMessage(params);
  const userMessage = buildUserMessage(params);

  // 构建请求体
  const requestBody = {
    model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
    messages: [
      { role: 'system', content: systemMessage },
      { role: 'user', content: userMessage }
    ],
    temperature: parseFloat(process.env.DEEPSEEK_TEMPERATURE || '0.7'),
    max_tokens: parseInt(process.env.DEEPSEEK_MAX_TOKENS || '2000'),
    stream: false // 非流式模式
  };

  // 记录日志（脱敏）
  console.log('[DeepSeek] 开始调用 API...', {
    model: requestBody.model,
    scenario: params.scenario,
    tone: params.tone,
    language: params.language,
    apiKey: maskApiKey(process.env.DEEPSEEK_API_KEY),
    timestamp: new Date().toISOString()
  });

  const startTime = Date.now();

  try {
    // 发起 HTTP 请求
    const timeout = parseInt(process.env.DEEPSEEK_TIMEOUT || '45000');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(process.env.DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    // 检查 HTTP 状态码
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[DeepSeek] API 返回错误:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });

      // 根据状态码处理
      switch (response.status) {
        case 401:
          throw new AIServiceError('DeepSeek API 认证失败，请检查 API Key');
        case 429:
          throw new Error('DeepSeek 请求频率超限');
        case 503:
          throw new Error('DeepSeek 服务暂时不可用');
        default:
          throw new Error(`DeepSeek API 返回错误: ${response.status}`);
      }
    }

    // 解析响应
    const data: DeepSeekResponse = await response.json();

    // 检查响应结构
    if (!data.choices || data.choices.length === 0) {
      console.error('[DeepSeek] 响应结构异常:', data);
      throw new Error('DeepSeek API 返回结果为空');
    }

    // 提取生成内容
    const generatedContent = data.choices[0].message.content.trim();

    // 记录成功日志
    const duration = Date.now() - startTime;
    console.log('[DeepSeek] API 调用成功', {
      contentLength: generatedContent.length,
      tokens: data.usage?.total_tokens || 0,
      promptTokens: data.usage?.prompt_tokens || 0,
      completionTokens: data.usage?.completion_tokens || 0,
      duration: `${duration}ms`
    });

    return generatedContent;

  } catch (error: unknown) {
    const duration = Date.now() - startTime;

    // 类型守卫：检查是否为 Error 对象
    const isError = error instanceof Error;
    
    // 类型守卫：检查是否有 code 属性（网络错误）
    const hasCode = typeof error === 'object' && error !== null && 'code' in error;
    
    // 处理超时错误
    if (isError && error.name === 'AbortError') {
      console.error('[DeepSeek] 请求超时', { duration: `${duration}ms` });
      throw new AIServiceError('AI 生成超时，请重试');
    }

    // 处理网络错误
    if (hasCode) {
      const errorCode = (error as { code: string }).code;
      if (errorCode === 'ECONNREFUSED' || errorCode === 'ENOTFOUND') {
        const errorMessage = isError ? error.message : '网络错误';
        console.error('[DeepSeek] 网络连接失败', { error: errorMessage });
        throw new AIServiceError('无法连接到 DeepSeek 服务');
      }
    }

    // 抛出原始错误
    throw error;
  }
}

/**
 * 调用 DeepSeek-V3 生成文本内容（带重试机制）
 * 
 * @param params - 生成参数
 * @returns 生成的文本内容
 * @throws AIServiceError - API 调用失败
 */
export async function callDeepSeek(params: DeepSeekParams): Promise<string> {
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[DeepSeek] 尝试调用 (${attempt}/${maxRetries})`);
      return await callDeepSeekInternal(params);
    } catch (error: unknown) {
      // 安全地提取错误信息
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      
      console.error(`[DeepSeek] 第 ${attempt} 次调用失败:`, errorMessage);

      // 最后一次尝试失败，直接抛出错误
      if (attempt === maxRetries) {
        console.error('[DeepSeek] 所有重试均失败');
        throw new AIServiceError('DeepSeek API 调用失败，请稍后重试');
      }

      // 判断是否需要重试
      const shouldRetry = 
        errorMessage.includes('频率超限') ||
        errorMessage.includes('暂时不可用') ||
        errorMessage.includes('网络') ||
        errorMessage.includes('超时');

      if (!shouldRetry) {
        // 不可重试的错误（如认证失败），直接抛出
        throw error;
      }

      // 指数退避重试（2s, 4s, 8s）
      const delay = Math.pow(2, attempt) * 1000;
      console.log(`[DeepSeek] 等待 ${delay}ms 后重试...`);
      await sleep(delay);
    }
  }

  // 理论上不会到达这里
  throw new AIServiceError('DeepSeek API 调用失败');
}
