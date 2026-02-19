/**
 * Spec: /docs/specs/legal-pages.md
 *
 * FluentWJ 用户服务协议页面
 * 展示用户服务协议内容，新窗口打开
 */

"use client";

import { useEffect, useState } from "react";

export default function TermsPage() {
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
            FluentWJ 用户服务协议
          </h1>
          <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
            <p>版本号：V1.0</p>
            <p>更新日期：2026年1月26日</p>
            <p>生效日期：2026年1月26日</p>
          </div>
        </header>

        {/* 协议内容区域 */}
        <article className="text-gray-700 dark:text-gray-300 space-y-8">
          
          {/* 导言 */}
          <section className="bg-gray-50 dark:bg-white/5 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-[#0c0c1d] dark:text-white mb-4">
              【首部及导言】
            </h2>
            <p className="leading-relaxed">
              欢迎您使用由<span className="font-medium">广州玮进科技有限公司</span>（以下简称"我们"或"玮进科技"）开发并运营的 FluentWJ 跨境商务写作助手（以下简称"本服务"或"本产品"）。
            </p>
          </section>

          {/* 重要提示 */}
          <section className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-4">
              【重要提示】
            </h2>
            <p className="text-amber-900 dark:text-amber-100 leading-relaxed">
              在此特别提醒您（以下亦称"用户"）在注册成为用户之前，请认真阅读本《FluentWJ 用户服务协议》（以下简称"本协议"），确保您充分理解本协议中各条款。请您审慎阅读并选择接受或不接受本协议。<span className="font-bold">特别是涉及免除或者限制责任的条款、法律适用和争议解决条款，我们已用粗体标识，请您重点阅读。</span>
            </p>
            <p className="text-amber-900 dark:text-amber-100 leading-relaxed mt-3">
              除非您接受本协议所有条款，否则您无权注册、登录或使用本协议所涉服务。您的注册、登录、使用等行为将视为对本协议的接受，并同意接受本协议各项条款的约束。
            </p>
          </section>

          {/* 一、账号注册与管理 */}
          <section>
            <h2 className="text-xl font-bold text-[#0c0c1d] dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-white/10">
              一、账号注册与管理
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-[#0c0c1d] dark:text-white mb-2">1. 【实名认证】</h3>
                <p className="leading-relaxed">
                  根据《互联网信息服务深度合成管理规定》及《中华人民共和国网络安全法》的要求，本产品严格实行<span className="font-bold">"后台实名、前台自愿"</span>的管理原则。您必须提供真实的手机号码完成实名验证（短信验证码登录）。拒绝提供真实身份信息或冒用他人信息的，我们有权拒绝为您提供服务。
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#0c0c1d] dark:text-white mb-2">2. 【账号安全】</h3>
                <p className="leading-relaxed">
                  您有责任妥善保管注册账号信息及账号密码的安全，因您保管不善可能导致遭受盗号或密码失窃，责任由您自行承担。
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#0c0c1d] dark:text-white mb-2">3. 【禁止转让】</h3>
                <p className="leading-relaxed">
                  您的账号仅限您本人或本企业内部使用。未经玮进科技书面同意，禁止以任何形式赠与、借用、出租、转让、售卖或以其他方式许可他人使用该账号。如果我们要发现使用者并非账号初始注册人，有权在未经通知的情况下回收该账号。
                </p>
              </div>
            </div>
          </section>

          {/* 二、服务内容与规范 */}
          <section>
            <h2 className="text-xl font-bold text-[#0c0c1d] dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-white/10">
              二、服务内容与规范
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-[#0c0c1d] dark:text-white mb-2">1. 【服务性质】</h3>
                <p className="leading-relaxed">
                  FluentWJ 是一款基于深度合成算法（DeepSeek-V3）技术的辅助写作工具，旨在为跨境贸易从业者提供商务邮件撰写、润色、翻译及改写建议。
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#0c0c1d] dark:text-white mb-2">2. 【生成内容标识】</h3>
                <p className="leading-relaxed">
                  您知悉并同意，本产品生成的文本内容属于"深度合成服务生成信息"。依据法律规定，我们会在产品界面显著位置对生成内容进行标识（如"由 AI 算法辅助生成"）。您不得采用技术手段删除、篡改、隐匿相关标识。
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#0c0c1d] dark:text-white mb-2">3. 【溯源水印告知】</h3>
                <p className="leading-relaxed">
                  为了保障算法安全与可追溯性，系统会在生成的文本中植入肉眼不可见的数字水印（Audit Token）。该水印包含生成该内容的用户 ID 及时间戳信息。若您利用本服务生成违法违规内容并传播，我们有权通过水印解码技术配合监管机关进行溯源取证。
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#0c0c1d] dark:text-white mb-2">4. 【使用限制】</h3>
                <p className="leading-relaxed mb-2">
                  您利用本服务生成的任何内容，仅供您在合法的商务活动中参考使用。您不得利用本服务：
                </p>
                <ul className="list-decimal list-inside space-y-1 ml-4 text-gray-600 dark:text-gray-400">
                  <li>解除、规避软件的权利管理电子措施；</li>
                  <li>进行反向工程、反向汇编、反向编译；</li>
                  <li>利用脚本或第三方工具对本服务进行高频自动化调用（如刷单、群发垃圾邮件）。</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 三、用户行为规范 */}
          <section>
            <h2 className="text-xl font-bold text-[#0c0c1d] dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-white/10">
              三、用户行为规范（"十不准"）
            </h2>
            <p className="leading-relaxed mb-4">
              您在使用本服务时，必须遵守中华人民共和国相关法律法规。您承诺绝不利用 FluentWJ 制作、复制、发布、传播含有下列内容的信息：
            </p>
            <ol className="list-decimal list-inside space-y-2 ml-4 text-gray-600 dark:text-gray-400">
              <li>反对宪法所确定的基本原则的；</li>
              <li>危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；</li>
              <li>损害国家荣誉和利益的；</li>
              <li>歪曲、丑化、亵渎、否定英雄烈士事迹和精神，以侮辱、诽谤或者其他方式侵害英雄烈士的姓名、肖像、名誉、荣誉的；</li>
              <li>宣扬恐怖主义、极端主义或者煽动实施恐怖活动、极端主义活动的；</li>
              <li>煽动民族仇恨、民族歧视，破坏民族团结的；</li>
              <li>破坏国家宗教政策，宣扬邪教和封建迷信的；</li>
              <li>散布谣言，扰乱经济秩序和社会秩序的；</li>
              <li>散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；</li>
              <li>
                <span className="font-bold text-gray-800 dark:text-gray-200">【特别条款】涉及跨境商务欺诈的：</span>
                包括但不限于生成虚假贸易单证、协助电信诈骗（BEC）、诱导非法汇款、洗钱话术或恶意商业诋毁内容的。
              </li>
            </ol>
            <p className="mt-4 text-red-600 dark:text-red-400 font-medium">
              若您违反上述规定，我们有权立即采取拒绝生成、封禁账号、保存记录并向网信、公安部门报告等措施。
            </p>
          </section>

          {/* 四、知识产权声明 */}
          <section>
            <h2 className="text-xl font-bold text-[#0c0c1d] dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-white/10">
              四、知识产权声明
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-[#0c0c1d] dark:text-white mb-2">1. 【平台知识产权】</h3>
                <p className="leading-relaxed">
                  玮进科技在本服务中提供的内容（包括但不限于软件、技术、程序、网页、文字、图片、图像、音频、视频、图表、版面设计、电子文档等）的知识产权属于玮进科技所有。
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#0c0c1d] dark:text-white mb-2">2. 【输入内容权利】</h3>
                <p className="leading-relaxed">
                  您输入到本平台的"核心要点"或原始草稿，其知识产权归您所有。您授权我们为了提供服务之目的（如内容安全检测、上下文理解）使用该内容。
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#0c0c1d] dark:text-white mb-2">3. 【输出内容权利】</h3>
                <p className="leading-relaxed">
                  鉴于 AI 生成内容的法律属性尚存争议，在法律允许的范围内，我们赋予您对生成内容在商务场景下的使用权。但您应知悉，AI 生成内容可能不被视为具有著作权的作品，您在主张权利时应自行承担风险。
                </p>
              </div>
            </div>
          </section>

          {/* 五、数据安全与隐私保护 */}
          <section>
            <h2 className="text-xl font-bold text-[#0c0c1d] dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-white/10">
              五、数据安全与隐私保护
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-[#0c0c1d] dark:text-white mb-2">1. 【隐私政策】</h3>
                <p className="leading-relaxed">
                  保护用户个人信息是玮进科技的一项基本原则。我们将按照《FluentWJ 隐私政策》收集、使用、存储和分享您的个人信息。本协议对隐私保护的规定与《隐私政策》不一致的，以《隐私政策》为准。
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#0c0c1d] dark:text-white mb-2">2. 【数据本地化】</h3>
                <p className="leading-relaxed">
                  我们承诺，您的所有业务数据及生成日志均存储于中国境内的服务器。未经国家网信部门批准，我们不会向境外第三方提供您的原始数据。
                </p>
              </div>
            </div>
          </section>

          {/* 六、免责声明 */}
          <section className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-700 dark:text-red-300 mb-4">
              六、免责声明（重要）
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              鉴于人工智能技术的局限性，我们特别向您做出如下免责声明，请您务必知悉：
            </p>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-red-700 dark:text-red-300 mb-2">1. 【机器幻觉风险】</h3>
                <p className="leading-relaxed">
                  AI 模型可能会生成看似合理但实际上错误、荒谬或与事实不符的内容（机器幻觉）。本服务生成的邮件、提案、翻译等内容仅供参考，不代表专业法律或商业建议。在发送任何商务邮件前，您有义务进行人工核实和校对。<span className="font-bold">因您未加核实直接使用生成内容而导致的商业损失（如报价错误、合同纠纷），由您自行承担，玮进科技不承担任何法律责任。</span>
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-red-700 dark:text-red-300 mb-2">2. 【不可抗力】</h3>
                <p className="leading-relaxed">
                  因台风、地震、海啸、洪水、停电、战争、恐怖袭击等不可抗力，或黑客攻击、电信部门技术调整等原因导致服务中断、数据丢失的，玮进科技不承担责任，但我们将尽力减少因此给您造成的损失。
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-red-700 dark:text-red-300 mb-2">3. 【合规熔断】</h3>
                <p className="leading-relaxed">
                  若因国家法律法规调整或监管部门要求，导致本服务必须暂停或终止的，不视为玮进科技违约。
                </p>
              </div>
            </div>
          </section>

          {/* 七、违约处理 */}
          <section>
            <h2 className="text-xl font-bold text-[#0c0c1d] dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-white/10">
              七、违约处理
            </h2>
            <div className="space-y-3 leading-relaxed">
              <p>
                1. 如果玮进科技发现或收到他人举报您违反本协议约定的，我们有权不经通知随时对相关内容进行删除、屏蔽，并视行为情节对违规账号处以包括但不限于警告、限制或禁止使用部分或全部功能、账号封禁直至注销的处罚。
              </p>
              <p>
                2. 您理解并同意，玮进科技有权依合理判断对违反有关法律法规或本协议规定的行为进行处罚，对违法违规的任何用户采取适当的法律行动，并依据法律法规保存有关信息向有关部门报告等，用户应独自承担由此而产生的一切法律责任。
              </p>
            </div>
          </section>

          {/* 八、法律适用与争议解决 */}
          <section>
            <h2 className="text-xl font-bold text-[#0c0c1d] dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-white/10">
              八、法律适用与争议解决
            </h2>
            <div className="space-y-3 leading-relaxed">
              <p>
                <span className="font-bold">1. 【法律适用】</span><br/>
                本协议的成立、生效、履行、解释及纠纷解决，适用中华人民共和国大陆地区法律（不包括冲突法）。
              </p>
              <p>
                <span className="font-bold">2. 【管辖法院】</span><br/>
                <span className="font-bold">若您和玮进科技之间发生任何纠纷或争议，首先应友好协商解决；协商不成的，您同意将纠纷或争议提交广州玮进科技有限公司所在地（广州市）有管辖权的人民法院管辖。</span>
              </p>
            </div>
          </section>

          {/* 九、其他 */}
          <section>
            <h2 className="text-xl font-bold text-[#0c0c1d] dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-white/10">
              九、其他
            </h2>
            <div className="space-y-3 leading-relaxed">
              <p>
                <span className="font-semibold">1. 【协议修改】</span><br/>
                我们有权在必要时修改本协议条款。您可以在相关服务页面查阅最新版本的协议条款。本协议条款变更后，如果您继续使用本服务，即视为您已接受修改后的协议。
              </p>
              <p>
                <span className="font-semibold">2. 【联系方式】</span><br/>
                如您对本协议或本服务有任何疑问、投诉或建议，请通过以下方式联系我们：
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-600 dark:text-gray-400">
                <li>举报/投诉邮箱：1536117956@qq.com</li>
                <li>联系地址：广州市南沙区黄阁镇蕉西路130号402房4015</li>
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
