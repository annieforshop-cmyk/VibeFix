import Link from "next/link";
import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "关于我们",
  description: "VibeFix 是为独立开发者和创业者准备的问题发现平台。了解我们的使命、工作方式，以及我们对这个产品的长期愿景。",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f8f9f8]">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            返回
          </Link>
          <span className="text-gray-200">·</span>
          <span className="text-sm font-black text-[#0e6b4a]">{SITE_NAME}</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-4">
          关于 {SITE_NAME}
        </h1>
        <p className="text-gray-500 text-[15px] leading-relaxed mb-12">
          {SITE_NAME} 是一个为独立开发者、创业者和产品人准备的「问题发现」平台。
          我们相信好产品的起点不是灵感，而是一个被真实验证过、值得被解决的问题。
        </p>

        <section className="space-y-4 mb-12">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">我们做什么</h2>
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <p className="text-gray-700 text-[15px] leading-relaxed">
              我们从社交平台、社区讨论和行业报告里，持续收集真实用户的抱怨和未被满足的需求，
              再由人工与 AI 一起整理成结构化的「灵感卡片」——标注痛点强度、开发难度、目标用户和市场机会。
              你不需要再从零开始想创意，只需要挑一个真正让人头疼的问题，动手去解决它。
            </p>
          </div>
        </section>

        <section className="space-y-4 mb-12">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">我们如何工作</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { step: "01", title: "收集", desc: "抓取真实世界的抱怨和讨论" },
              { step: "02", title: "结构化", desc: "AI 提炼痛点、证据与市场信号" },
              { step: "03", title: "审核", desc: "人工复核，确保每张卡片可信" },
              { step: "04", title: "发布", desc: "开发者浏览、收藏、动手去做" },
            ].map((s) => (
              <div key={s.step} className="bg-white border border-gray-100 rounded-xl p-4">
                <span className="text-[11px] font-mono text-[#0e6b4a]/60 font-bold">{s.step}</span>
                <h3 className="text-sm font-bold text-gray-900 mt-1 mb-1">{s.title}</h3>
                <p className="text-[13px] text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="space-y-4 mb-12 scroll-mt-20">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">联系我们</h2>
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <p className="text-gray-700 text-[15px] leading-relaxed">
              有问题想反馈、想投稿一个值得关注的痛点，或者想聊聊合作？
              欢迎通过站内的「提交一个问题」功能联系我们，我们会认真看每一条提交。
            </p>
          </div>
        </section>

        <section id="terms" className="space-y-4 mb-12 scroll-mt-20">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">服务条款</h2>
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <p className="text-gray-700 text-[15px] leading-relaxed">
              {SITE_NAME} 上的问题卡片仅供参考，用于帮助你发现创业和产品方向，不构成任何商业、法律或投资建议。
              内容来自公开渠道整理，如有侵权或信息有误，请联系我们及时处理。
            </p>
          </div>
        </section>

        <section id="privacy" className="space-y-4 mb-16 scroll-mt-20">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">隐私政策</h2>
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <p className="text-gray-700 text-[15px] leading-relaxed">
              我们只通过匿名设备标识（cookie）记录你的收藏行为，用于统计问题热度，不收集任何个人身份信息。
              提交问题时留下的联系方式仅用于必要的沟通，不会用于其他用途或对外提供。
            </p>
          </div>
        </section>

        {/* ── 愿景：全站最大、最重的一段话，放在最下面 ── */}
        <section id="vision" className="scroll-mt-20 -mx-4 sm:-mx-6">
          <div className="bg-[#0e6b4a] px-6 sm:px-12 py-16 sm:py-24 rounded-3xl">
            <p className="text-[13px] font-bold text-white/50 uppercase tracking-[0.2em] mb-6">
              我们的愿景 · Our Vision
            </p>
            <p className="text-white font-black leading-[1.25] tracking-tight text-[2rem] sm:text-[3.25rem]">
              让每一个愿意行动的人，
              <br />
              都能找到一个值得他
              <br />
              全力以赴的方向。
            </p>
            <p className="text-white/70 text-[15px] sm:text-lg leading-relaxed mt-8 max-w-2xl">
              世界上从不缺少问题，缺的是被认真对待的问题。我们想把散落在评论区、深夜吐槽、
              行业报告里的真实痛点，变成看得见、摸得着、可以立刻动手的产品机会。
              终有一天，{SITE_NAME} 上的每一张卡片，都会变成某个人正在使用的产品。
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100 bg-white py-6">
        <div className="max-w-3xl mx-auto px-4 flex items-center justify-between">
          <span className="text-sm font-black text-[#0e6b4a]">{SITE_NAME}</span>
          <span className="text-xs text-gray-400">Problems Worth Building For</span>
        </div>
      </footer>
    </div>
  );
}
