/**
 * Spec: /docs/specs/legal-pages.md
 *
 * FluentWJ 隐私政策页面
 * 展示隐私政策内容，新窗口打开
 */

"use client";

import { useEffect, useState } from "react";

export default function PrivacyPage() {
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
            FluentWJ 隐私政策
          </h1>
          <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
            <p>版本号：V1.0</p>
            <p>更新日期：2026年1月26日</p>
            <p>生效日期：2026年1月26日</p>
          </div>
        </header>

        {/* 协议内容区域 */}
        <article className="text-gray-700 dark:text-gray-300 space-y-8">
          
          {/* 引言 */}
          <section className="bg-gray-50 dark:bg-white/5 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-[#0c0c1d] dark:text-white mb-4">
              【引言】
            </h2>
            <p className="leading-relaxed">
              <span className="font-medium">广州玮进科技有限公司</span>（以下简称"我们"或"玮进科技"）非常重视用户的隐私和个人信息保护。您在使用我们的 FluentWJ 跨境商务写作助手（以下简称"本产品"或"本服务"）时，我们可能会收集和使用您的相关信息。
            </p>
            <p className="leading-relaxed mt-3">
              本《隐私政策》（以下简称"本政策"）旨在向您说明，在使用本服务时，我们如何收集、使用、存储、分享和保护您的个人信息，以及您如何行使您的权利。
            </p>
          </section>

          {/* 特别提示 */}
          <section className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-4">
              【特别提示】
            </h2>
            <p className="text-green-900 dark:text-green-100 leading-relaxed">
              请您在使用本服务前，仔细阅读并了解本政策。<span className="font-bold">重点内容我们已采用粗体/下划线表示，请您特别关注。</span>一旦您点击"同意"或开始使用本服务，即表示您已充分理解并同意本政策。
            </p>
          </section>

          {/* 一、我们如何收集和使用您的个人信息 */}
          <section>
            <h2 className="text-xl font-bold text-[#0c0c1d] dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-white/10">
              一、我们如何收集和使用您的个人信息
            </h2>
            <p className="leading-relaxed mb-4">
              我们将遵循"合法、正当、必要"的原则，收集和使用您在使用服务过程中主动提供或因使用服务而产生的信息：
            </p>
            
            <div className="space-y-6">
              {/* 1. 账号注册与登录 */}
              <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-5">
                <h3 className="font-semibold text-[#0c0c1d] dark:text-white mb-3">1. 账号注册与登录</h3>
                <p className="leading-relaxed mb-2">
                  为满足《中华人民共和国网络安全法》及《互联网信息服务深度合成管理规定》关于"后台实名"的要求，当您注册或登录 FluentWJ 时，我们需要收集您的<span className="font-bold">手机号码</span>。
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-gray-600 dark:text-gray-400 text-sm">
                  <li><span className="font-medium">用途：</span>用于发送短信验证码以验证身份，创建唯一的用户 ID（UID）。</li>
                  <li><span className="font-medium">性质：</span>手机号码属于敏感个人信息，若您拒绝提供，将无法使用本服务的 AI 生成功能。</li>
                </ul>
              </div>

              {/* 2. 商务写作服务 */}
              <div className="bg-purple-50 dark:bg-purple-900/10 rounded-lg p-5">
                <h3 className="font-semibold text-[#0c0c1d] dark:text-white mb-3">2. 商务写作服务（核心功能）</h3>
                <p className="leading-relaxed mb-2">
                  当您使用 AI 撰写、润色或回复邮件功能时，我们需要收集您输入的业务场景、收件人信息、核心要点（Prompt）以及生成的邮件内容。
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-gray-600 dark:text-gray-400 text-sm">
                  <li><span className="font-medium">用途：</span>上述信息将作为算法模型的输入参数，用于生成您所需的商务文本。</li>
                  <li><span className="font-medium">特别说明：</span>为了提供服务，我们需要将上述去标识化后的文本数据传输给合作的基座模型服务商（DeepSeek）及内容安全服务商（阿里云）进行处理。<span className="font-bold">我们承诺，仅将该数据用于当次生成和安全检测，不会将其用于训练通用大模型。</span></li>
                </ul>
              </div>

              {/* 3. 安全保障与日志审计 */}
              <div className="bg-orange-50 dark:bg-orange-900/10 rounded-lg p-5">
                <h3 className="font-semibold text-[#0c0c1d] dark:text-white mb-3">3. 安全保障与日志审计</h3>
                <p className="leading-relaxed mb-2">
                  为了保障系统安全、履行法定审计义务（算法备案要求），我们会自动收集您的设备信息和日志信息：
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-gray-600 dark:text-gray-400 text-sm">
                  <li><span className="font-medium">设备信息：</span>包括设备型号、操作系统版本、浏览器类型。</li>
                  <li><span className="font-medium">日志信息：</span>包括登录 IP 地址、访问日期和时间、API 调用记录、操作日志。</li>
                  <li><span className="font-medium">用途：</span>用于防范恶意攻击、溯源违规内容以及应对监管部门的安全检查。</li>
                </ul>
              </div>

              {/* 4. 客户服务 */}
              <div>
                <h3 className="font-semibold text-[#0c0c1d] dark:text-white mb-3">4. 客户服务</h3>
                <p className="leading-relaxed">
                  当您联系我们进行投诉、举报或反馈（Feedback）时，我们可能会收集您的联系方式、沟通记录以及您提供的相关证据（如截图），以便解决问题并联系您。
                </p>
              </div>
            </div>
          </section>

          {/* 二、我们如何使用 Cookie 和同类技术 */}
          <section>
            <h2 className="text-xl font-bold text-[#0c0c1d] dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-white/10">
              二、我们如何使用 Cookie 和同类技术
            </h2>
            <p className="leading-relaxed mb-3">
              为确保网站正常运转、为您提供更个性化的用户体验，我们会在您的计算机或移动设备上存储名为 Cookie 的小数据文件。
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4 text-gray-600 dark:text-gray-400">
              <li><span className="font-medium">用途：</span>Cookie 主要用于验证您的登录状态（Session/Token），保存您的语言偏好设置。</li>
              <li><span className="font-medium">管理：</span>您可以通过浏览器设置清除 Cookie，但清除后您可能需要重新登录。</li>
            </ul>
          </section>

          {/* 三、我们如何共享、转让、公开披露您的个人信息 */}
          <section>
            <h2 className="text-xl font-bold text-[#0c0c1d] dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-white/10">
              三、我们如何共享、转让、公开披露您的个人信息
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-[#0c0c1d] dark:text-white mb-2">1. 共享</h3>
                <p className="leading-relaxed mb-2">
                  我们不会与玮进科技以外的公司、组织和个人共享您的个人信息，但以下情况除外（委托处理）：
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-gray-600 dark:text-gray-400">
                  <li><span className="font-medium">AI 算法服务：</span>为实现写作功能，我们需要通过 API 接口将您的输入文本传输给深度合成技术支持者（DeepSeek）。</li>
                  <li><span className="font-medium">内容安全服务：</span>为过滤违法违规信息，我们需要将您的输入和输出内容传输给<span className="font-bold">云安全服务商（华为云/阿里云）</span>进行实时检测。</li>
                  <li><span className="font-medium">短信服务：</span>为发送验证码，我们需要将您的手机号传输给短信服务商（华为云 SMS）。</li>
                </ul>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2 italic">
                  上述服务商均受严格的保密协议约束，且无权将您的信息用于其他用途。
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#0c0c1d] dark:text-white mb-2">2. 转让</h3>
                <p className="leading-relaxed">
                  我们不会将您的个人信息转让给任何第三方，除非发生公司合并、收购或破产清算。届时，我们会要求新的持有您个人信息的公司继续受本政策约束。
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#0c0c1d] dark:text-white mb-2">3. 公开披露</h3>
                <p className="leading-relaxed mb-2">我们仅在以下情况下，公开披露您的个人信息：</p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-gray-600 dark:text-gray-400">
                  <li>获得您的明确同意；</li>
                  <li><span className="font-medium">基于法律的披露：</span>在法律、法律程序、诉讼或政府主管部门强制性要求的情况下（如公安机关调查取证），我们可能会公开披露您的个人信息。</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 四、我们如何存储和保护您的个人信息 */}
          <section>
            <h2 className="text-xl font-bold text-[#0c0c1d] dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-white/10">
              四、我们如何存储和保护您的个人信息
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-[#0c0c1d] dark:text-white mb-2">1. 存储地点</h3>
                <p className="leading-relaxed">
                  我们依照法律规定，将境内运营过程中收集和产生的个人信息存储于中华人民共和国境内（华为云广州数据中心）。
                </p>
                <p className="font-bold text-[#0c0c1d] dark:text-white mt-2">
                  我们承诺：未经国家网信部门的安全评估及批准，不会向境外传输您的原始个人信息。
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#0c0c1d] dark:text-white mb-2">2. 存储期限</h3>
                <ul className="list-disc list-inside space-y-1 ml-4 text-gray-600 dark:text-gray-400">
                  <li><span className="font-medium">业务数据：</span>我们在为您提供服务所需的期限内保留您的个人信息（如账号存续期间）。</li>
                  <li><span className="font-medium">审计日志：</span>依据《互联网信息服务深度合成管理规定》，涉及算法生成的日志信息（含输入输出内容、时间、IP）将物理保存至少 <span className="font-bold">180 天</span>。</li>
                  <li>超出保存期限后，我们会对您的个人信息进行删除或匿名化处理。</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-[#0c0c1d] dark:text-white mb-2">3. 安全措施</h3>
                <ul className="list-disc list-inside space-y-1 ml-4 text-gray-600 dark:text-gray-400">
                  <li><span className="font-medium">传输加密：</span>全站采用 HTTPS (TLS/SSL) 协议加密传输。</li>
                  <li><span className="font-medium">存储加密：</span>您的登录密码采用不可逆加密算法存储；核心数据采用静态加密技术。</li>
                  <li><span className="font-medium">访问控制：</span>我们建立了严格的数据访问权限制度，仅授权人员可访问，并记录访问日志。</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 五、您的权利 */}
          <section>
            <h2 className="text-xl font-bold text-[#0c0c1d] dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-white/10">
              五、您的权利
            </h2>
            <p className="leading-relaxed mb-4">
              依据《个人信息保护法》，您享有以下权利：
            </p>
            <div className="space-y-3">
              <div className="flex gap-3">
                <span className="font-bold text-[#0c0c1d] dark:text-white whitespace-nowrap">1. 查询与复制：</span>
                <p className="text-gray-600 dark:text-gray-400">您可以登录账号，在"个人中心"或"历史记录"中查询您的个人信息和生成记录。</p>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-[#0c0c1d] dark:text-white whitespace-nowrap">2. 更正与补充：</span>
                <p className="text-gray-600 dark:text-gray-400">若发现信息有误，您有权联系我们要更正。</p>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-[#0c0c1d] dark:text-white whitespace-nowrap">3. 删除权：</span>
                <div className="text-gray-600 dark:text-gray-400">
                  <p>在以下情形下，您可以向我们提出删除个人信息的请求：</p>
                  <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                    <li>我们处理个人信息的行为违反法律法规；</li>
                    <li>您注销了账号；</li>
                    <li>我们停止提供产品或服务。</li>
                  </ul>
                  <p className="text-sm italic mt-2">注：对于必须留存 180 天的审计日志，在法定留存期内我们无法响应删除请求，但会对其进行封存处理。</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-[#0c0c1d] dark:text-white whitespace-nowrap">4. 注销账号：</span>
                <p className="text-gray-600 dark:text-gray-400">您可以通过【个人中心-账号安全-注销账号】或联系客服申请注销。注销后，我们将停止为您提供服务并删除您的数据（法律法规另有规定的除外）。</p>
              </div>
            </div>
          </section>

          {/* 六、未成年人保护 */}
          <section className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-yellow-800 dark:text-yellow-200 mb-4">
              六、未成年人保护
            </h2>
            <p className="leading-relaxed">
              本产品主要面向企事业单位及成年商务人士（B端工具）。<span className="font-bold">我们不向未满 18 周岁的未成年人提供服务。</span>
            </p>
            <p className="leading-relaxed mt-2">
              若您是未成年人，请立即停止注册和使用。若我们发现误收集了未成年人的个人信息，将立即予以删除。
            </p>
          </section>

          {/* 七、政策更新 */}
          <section>
            <h2 className="text-xl font-bold text-[#0c0c1d] dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-white/10">
              七、政策更新
            </h2>
            <p className="leading-relaxed">
              随着业务的发展和法律法规的变更，我们可能会适时修订本政策。
            </p>
            <p className="leading-relaxed mt-2">
              当本政策发生重大变更时，我们会通过页面弹窗、站内信或公告等方式通知您。若您继续使用本服务，即表示同意受修订后的政策约束。
            </p>
          </section>

          {/* 八、联系我们 */}
          <section>
            <h2 className="text-xl font-bold text-[#0c0c1d] dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-white/10">
              八、联系我们
            </h2>
            <p className="leading-relaxed mb-4">
              如您对本隐私政策有任何疑问、意见或投诉，或需要行使您的权利，请通过以下方式联系我们：
            </p>
            <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-5">
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <span className="text-lg">📧</span>
                  <span className="font-medium">个人信息保护负责人邮箱：</span>
                  <span className="text-[#0052D9]">1536117956@qq.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-lg">📍</span>
                  <span className="font-medium">联系地址：</span>
                  <span>广州市南沙区黄阁镇蕉西路130号402房4015</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-lg">⏱️</span>
                  <span className="font-medium">响应时效：</span>
                  <span>我们将在收到您的请求并验证您的身份后 <span className="font-bold">15 个工作日</span> 内予以回复。</span>
                </li>
              </ul>
            </div>
          </section>

        </article>

        {/* 签名 */}
        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-white/10 text-right">
          <p className="text-gray-600 dark:text-gray-400">广州玮进科技有限公司</p>
          <p className="text-gray-500 dark:text-gray-500 text-sm">2026年1月26日</p>
        </div>

      </div>
    </div>
  );
}
