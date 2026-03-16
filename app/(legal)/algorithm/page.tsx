/**
 * Spec: /docs/specs/legal-pages.md
 *
 * FluentWJ 算法服务说明页面
 * 展示算法服务说明内容，新窗口打开
 */

"use client";

import { useEffect, useState } from "react";

export default function AlgorithmPage() {
  const [mounted, setMounted] = useState(false);

  // 确保客户端渲染，避免 hydration 问题
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a1a] py-8 px-4">
      {/* 页面容器 - 限制最大宽度，提升阅读体验 */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-[#0f0f23] rounded-2xl shadow-xl p-8 md:p-12">
        
        {/* 页面标题 */}
        <header className="mb-10 border-b border-gray-200 dark:border-white/10 pb-6 text-center">
          <h1 className="text-3xl font-bold text-[#0c0c1d] dark:text-white mb-2">
            FluentWJ 算法服务说明
          </h1>
          <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
            <p>版本号：V1.0</p>
            <p>更新日期：2026年3月16日</p>
            <p>生效日期：2026年3月16日</p>
          </div>
        </header>

        {/* 协议内容区域 */}
        <article className="text-gray-700 dark:text-gray-300 space-y-8">
          
          {/* 一、算法基本原理 */}
          <section>
            <h2 className="text-xl font-bold text-[#0c0c1d] dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-white/10">
              一、算法基本原理
            </h2>
            <p className="leading-relaxed mb-4">
              本算法服务基于<strong>大语言模型（LLM）技术</strong>构建。
            </p>
            <p className="leading-relaxed mb-4">
              当用户在前端输入商务场景、收件人信息、核心要点等文本指令时，系统将这些信息通过 API 接口提交给底层大语言模型（DeepSeek-V3）进行语义理解和内容生成。生成的内容经过安全审核后，返回给用户。整个过程为<strong>实时请求-响应模式</strong>，不涉及用户数据的长期存储或模型训练。
            </p>
            <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-4 mt-4">
              <ul className="space-y-2 text-sm">
                <li><span className="font-medium">底层模型：</span>DeepSeek-V3</li>
                <li><span className="font-medium">模型提供者：</span>杭州深度求索人工智能基础技术研究有限公司</li>
                <li><span className="font-medium">技术特点：</span>多语言理解、上下文推理、文本生成</li>
              </ul>
            </div>
          </section>

          {/* 二、算法目的意图 */}
          <section>
            <h2 className="text-xl font-bold text-[#0c0c1d] dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-white/10">
              二、算法目的意图
            </h2>
            <p className="leading-relaxed">
              本算法旨在为使用 FluentWJ 跨境商务写作助手的用户提供<strong>智能邮件撰写辅助服务</strong>。主要功能包括：
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
              <li>根据用户输入的场景和要点，自动生成专业的商务邮件正文</li>
              <li>支持多种语气风格（正式、友好、委婉等）的文案生成</li>
              <li>支持多语言（中英文）商务邮件撰写</li>
              <li>帮助用户快速生成高质量的跨境商务沟通内容，提升工作效率</li>
            </ul>
          </section>

          {/* 三、算法运行机制 */}
          <section>
            <h2 className="text-xl font-bold text-[#0c0c1d] dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-white/10">
              三、算法运行机制
            </h2>
            <p className="leading-relaxed mb-4">
              本算法服务链路严格遵循<strong>"安全前置、内容生成、双重标识"</strong>的运行机制，具体流程如下：
            </p>
            
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4">
                <h3 className="font-semibold text-[#0c0c1d] dark:text-white mb-2">1. 输入审核（第一道护栏）</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  接收用户输入的商务场景、收件人信息、核心要点等文本，通过阿里云 AI 安全护栏进行毫秒级敏感词检测，拦截涉政、涉黄、暴力等高危或违规指令。
                </p>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/10 rounded-lg p-4">
                <h3 className="font-semibold text-[#0c0c1d] dark:text-white mb-2">2. 模型生成</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  将用户输入作为 Prompt，结合系统内置的商务写作指令模板，调用 DeepSeek-V3 大模型生成符合用户需求的商务邮件内容。
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-4">
                <h3 className="font-semibold text-[#0c0c1d] dark:text-white mb-2">3. 输出审核（第二道护栏）</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  生成的回复再次经过安全检测，确保未产生违规内容或敏感信息。
                </p>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/10 rounded-lg p-4">
                <h3 className="font-semibold text-[#0c0c1d] dark:text-white mb-2">4. 显著标识与输出</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  算法在每条合规回复的末尾强制拼接<strong>「【AI 生成】本内容由 FluentWJ AI 算法辅助生成，仅供商务写作参考，不构成任何法律要约或承诺，请您在使用前核实全部信息真实性。」</strong>的显著标识，最终呈现在用户的生成结果中。
                </p>
              </div>
            </div>
          </section>

          {/* 四、算法服务范围 */}
          <section>
            <h2 className="text-xl font-bold text-[#0c0c1d] dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-white/10">
              四、算法服务范围
            </h2>
            
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-[#0c0c1d] dark:text-white mb-2">应用平台</h3>
                <p className="text-gray-600 dark:text-gray-400">FluentWJ 官方网站的工作台端（PC 端）及移动端网页。</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-[#0c0c1d] dark:text-white mb-2">展现形态</h3>
                <p className="text-gray-600 dark:text-gray-400">页面左侧的商务写作表单区域，用户填写场景、语气、收件人信息、核心要点后，点击"立即生成"按钮获取 AI 生成的邮件内容。</p>
              </div>

              <div>
                <h3 className="font-semibold text-[#0c0c1d] dark:text-white mb-2">服务边界</h3>
                <p className="text-gray-600 dark:text-gray-400">本算法服务仅限于<strong>商务邮件撰写辅助</strong>。不提供新闻信息采编发布服务，不具备社会动员能力，亦不提供医疗、法律、金融等专业领域的咨询建议。</p>
              </div>
            </div>
          </section>

          {/* 五、算法核心风险 */}
          <section>
            <h2 className="text-xl font-bold text-[#0c0c1d] dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-white/10">
              五、算法核心风险
            </h2>
            <p className="leading-relaxed mb-4">
              受限于当前生成式人工智能技术的客观发展水平，本算法在运行过程中可能存在以下潜在风险：
            </p>
            
            <div className="space-y-3">
              <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">1. 生成虚假信息风险（机器幻觉）</h3>
                <p className="text-yellow-900 dark:text-yellow-100 text-sm">
                  在处理特定细节（如具体的人名、日期、金额）时，由于模型推理的概率特性，偶尔可能生成与用户意图不符的错误信息。
                </p>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">2. 理解偏差与逻辑风险</h3>
                <p className="text-orange-900 dark:text-orange-100 text-sm">
                  面对包含错别字、表述极其模糊或极其复杂的输入时，算法可能无法准确捕捉用户真实意图，导致生成内容与用户期望存在偏差。
                </p>
              </div>

              <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">3. 被恶意利用风险</h3>
                <p className="text-red-900 dark:text-red-100 text-sm">
                  存在极少数恶意用户通过「提示词注入攻击」（Prompt Injection）等诱导性话术，试图绕过安全策略，诱发模型输出不当内容的风险。
                </p>
              </div>
            </div>
          </section>

          {/* 六、算法风险防控措施 */}
          <section>
            <h2 className="text-xl font-bold text-[#0c0c1d] dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-white/10">
              六、算法风险防控措施
            </h2>
            <p className="leading-relaxed mb-4">
              针对上述风险，我司已建立并落实多层次的安全防控与纠偏机制：
            </p>
            
            <div className="space-y-3">
              <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">1. 内容生态治理</h3>
                <p className="text-green-900 dark:text-green-100 text-sm">
                  部署「输入-输出」双重实时安全拦截系统，结合核心价值观词库，坚决防范和抵制任何违法违规及不良信息的生成与传播。
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">2. 显式标识机制</h3>
                <p className="text-blue-900 dark:text-blue-100 text-sm">
                  在所有 AI 生成内容的末尾均强制展示显著标识，明确告知用户内容由 AI 生成，请注意甄别。
                </p>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/10 rounded-lg p-4">
                <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">3. 人工巡检与纠偏闭环</h3>
                <p className="text-purple-900 dark:text-purple-100 text-sm">
                  设立专门的算法安全工作小组。每日对交互日志进行抽样审计，并对用户给予反馈的记录进行回溯。一旦发现违规或失实内容，立即执行后端物理删除、优化系统提示词。
                </p>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/10 rounded-lg p-4">
                <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">4. 应急熔断机制</h3>
                <p className="text-orange-900 dark:text-orange-100 text-sm">
                  建立监控预警机制。在遭遇大规模恶意攻击或模型产生严重性能漂移时，技术人员可一键切断大模型调用链路，防止危害扩大。
                </p>
              </div>
            </div>
          </section>

          {/* 七、用户权益保护与投诉举报机制 */}
          <section>
            <h2 className="text-xl font-bold text-[#0c0c1d] dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-white/10">
              七、用户权益保护与投诉举报机制
            </h2>
            
            <div className="space-y-4 mb-6">
              <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">1. 保障知情权</h3>
                <p className="text-green-900 dark:text-green-100 text-sm">
                  在所有 AI 生成内容的末尾均强制展示「【AI 生成】本内容由 FluentWJ AI 算法辅助生成...」的显著标识，告知用户内容由 AI 生成。
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">2. 保障选择权</h3>
                <p className="text-blue-900 dark:text-blue-100 text-sm">
                  用户可随时在「历史记录」中查看、管理已生成的邮件内容，或选择删除不需要的记录。
                </p>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/10 rounded-lg p-4">
                <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">3. 保障隐私权</h3>
                <p className="text-purple-900 dark:text-purple-100 text-sm">
                  算法仅在最小必要范围内处理您的输入数据，并在传输和存储过程中采用高强度加密技术，绝不向未授权的第三方共享您的个人隐私。详细隐私保护措施请参阅《FluentWJ 隐私政策》。
                </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-5">
              <h3 className="font-semibold text-[#0c0c1d] dark:text-white mb-4">投诉举报机制</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                若您在使用过程中发现算法生成了违法违规信息、存在算法歧视或严重事实错误，请随时通过以下方式向我们投诉举报：
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li><span className="font-medium">举报邮箱：</span>1536117956@qq.com</li>
                <li><span className="font-medium">处理时效：</span>我们将在收到举报后的 3 个工作日内进行受理核查，并在 7 个工作日内向您反馈处理结果。</li>
              </ul>
            </div>
          </section>

        </article>

        {/* 签名 */}
        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-white/10 text-right">
          <p className="text-gray-600 dark:text-gray-400">广州玮进科技有限公司</p>
          <p className="text-gray-500 dark:text-gray-500 text-sm">2026年3月16日</p>
        </div>

      </div>
    </div>
  );
}
