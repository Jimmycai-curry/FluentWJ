/**
 * Footer 组件
 * 工作台底部信息栏，包含版权、链接和备案号
 */
export function Footer() {
  return (
    <footer className="h-10 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 text-[10px] text-slate-400">
      {/* 左侧版权和链接 */}
      <div className="flex items-center gap-4">
        <span>© 2026 FluentWJ. All rights reserved.</span>
        <span className="h-3 w-[1px] bg-slate-200 dark:bg-slate-800"></span>
        {/* 隐私政策 - 新窗口打开 */}
        <a
          className="hover:text-primary transition-colors"
          href="/privacy"
          target="_blank"
          rel="noopener noreferrer"
        >
          隐私政策
        </a>
        {/* 服务协议 - 新窗口打开 */}
        <a
          className="hover:text-primary transition-colors"
          href="/terms"
          target="_blank"
          rel="noopener noreferrer"
        >
          服务协议
        </a>
        {/* 算法服务说明 - 新窗口打开 */}
        <a
          className="hover:text-primary transition-colors"
          href="/algorithm"
          target="_blank"
          rel="noopener noreferrer"
        >
          算法服务说明
        </a>
      </div>

      {/* 右侧备案信息 */}
      <div className="flex items-center gap-4">
        <span>粤ICP备2025514736号-1</span>
        {/* 算法备案号：备案下来后取消注释 */}
        {/* <span>算法备案号：FluentWJ-LLM-2024-001</span> */}
      </div>
    </footer>
  );
}

