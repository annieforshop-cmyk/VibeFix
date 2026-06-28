"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Problem } from "@/lib/data";
import { CATEGORY_DARK, DIFFICULTY_DARK, STATUS_DARK, AI_DARK } from "@/design/ui-tokens";

export default function ProblemCardFull({
  problem,
  index,
}: {
  problem: Problem;
  index: number;
}) {
  const router = useRouter();
  const [upvoted, setUpvoted] = useState(false);
  const [count, setCount] = useState(problem.upvotes);
  const [building, setBuilding] = useState(false);

  const cat  = CATEGORY_DARK[problem.category];
  const diff = DIFFICULTY_DARK[problem.difficulty];
  const stat = STATUS_DARK[problem.status];
  const ai   = AI_DARK[problem.aiPotential];

  const num = String(index + 1).padStart(2, "0");

  function handleUpvote(e: React.MouseEvent) {
    e.stopPropagation();
    setCount((c) => (upvoted ? c - 1 : c + 1));
    setUpvoted((u) => !u);
  }

  function handleBuild(e: React.MouseEvent) {
    e.stopPropagation();
    setBuilding((b) => !b);
  }

  return (
    <div
      className="relative flex flex-col overflow-hidden rounded-[1.75rem] border border-white/[0.055]"
      style={{
        background: `radial-gradient(ellipse 80% 50% at 100% 0%, ${cat.glow} 0%, transparent 60%), #0F0E1B`,
        minHeight: "clamp(520px, 68vh, 720px)",
      }}
    >
      {/* 大背景序号 — 装饰性水印 */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-6 top-3 select-none font-black leading-none tracking-tighter"
        style={{
          fontSize: "clamp(7rem, 16vw, 11rem)",
          color: "rgba(255,255,255,0.028)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {num}
      </span>

      {/* ── 主体内容 ───────────────────────────────────────── */}
      <div className="relative z-10 flex flex-1 flex-col gap-5 p-7 md:p-10">

        {/* 顶部 meta */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${cat.badge}`}>
              {problem.category}
            </span>
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${diff}`}>
              {problem.difficulty}
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 text-xs text-white/30">
            <span className="text-base">{problem.countryFlag}</span>
            <span className="hidden sm:inline">{problem.country}</span>
          </div>
        </div>

        {/* 标题区 */}
        <div className="flex flex-col gap-2">
          <h2
            className="font-bold text-[#F0F0F5] leading-[1.25] tracking-[-0.02em]"
            style={{ fontSize: "clamp(1.45rem, 3.2vw, 1.85rem)" }}
          >
            {problem.title}
          </h2>
          <p className="text-[13px] text-white/30">
            <span className="text-white/18 mr-1">适合</span>
            {problem.targetUsers}
          </p>
        </div>

        {/* 描述 */}
        <p className="text-[15px] leading-[1.75] text-white/50 line-clamp-4">
          {problem.description}
        </p>

        {/* 为什么是现在 */}
        <div
          className="rounded-[1.25rem] px-5 py-4"
          style={{ background: "rgba(255,255,255,0.028)", border: "1px solid rgba(255,255,255,0.055)" }}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/25 mb-1.5">
            为什么是现在
          </p>
          <p className="text-[13.5px] leading-[1.65] text-white/42 line-clamp-2">
            {problem.whyNow}
          </p>
        </div>

        {/* 技术标签 */}
        <div className="flex flex-wrap gap-1.5">
          {problem.techHints.map((hint) => (
            <span
              key={hint}
              className="text-[11px] px-2.5 py-1 rounded-xl text-white/30"
              style={{ background: "rgba(255,255,255,0.038)", border: "1px solid rgba(255,255,255,0.055)" }}
            >
              {hint}
            </span>
          ))}
        </div>

        {/* ── 底部 footer ─────────────────────────────────── */}
        <div
          className="mt-auto flex items-center justify-between gap-3 flex-wrap pt-5"
          style={{ borderTop: "1px solid rgba(255,255,255,0.055)" }}
        >
          {/* 状态 + AI */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${stat.dot}`} />
              <span className={`text-[12px] font-medium ${stat.label}`}>{problem.status}</span>
            </div>
            <span className={`text-[12px] font-medium ${ai}`}>
              AI {problem.aiPotential}
            </span>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleUpvote}
              className={`flex items-center gap-1.5 text-[13px] font-semibold px-3 py-1.5 rounded-xl transition-all duration-150 ${
                upvoted
                  ? "bg-violet-500/15 text-violet-300"
                  : "text-white/30 hover:text-white/60 hover:bg-white/[0.06]"
              }`}
              style={{ background: upvoted ? undefined : "rgba(255,255,255,0.04)" }}
            >
              <svg
                width="11" height="11" viewBox="0 0 24 24"
                fill={upvoted ? "currentColor" : "none"}
                stroke="currentColor" strokeWidth="2.5"
              >
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
              {count}
            </button>

            <button
              onClick={handleBuild}
              className={`text-[13px] font-semibold px-4 py-1.5 rounded-xl transition-all duration-150 ${
                building
                  ? "bg-[#8875F8] text-white shadow-lg shadow-violet-500/20"
                  : "text-white/55 hover:text-white hover:bg-[#8875F8]/20"
              }`}
              style={{ background: building ? undefined : "rgba(255,255,255,0.055)" }}
            >
              {building ? "✓ 我来做" : "我来做"}
            </button>

            <button
              onClick={() => router.push(`/problems/${problem.id}`)}
              className="text-[12px] text-white/25 hover:text-white/55 transition-colors duration-150 px-2 py-1.5"
            >
              详情 →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
