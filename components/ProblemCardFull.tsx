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

  const cat = CATEGORY_DARK[problem.category];
  const diff = DIFFICULTY_DARK[problem.difficulty];
  const stat = STATUS_DARK[problem.status];
  const ai = AI_DARK[problem.aiPotential];

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
    <div className="relative bg-[#141419] border border-white/[0.07] rounded-3xl p-7 md:p-9 flex flex-col gap-5 overflow-hidden">
      {/* 大背景序号 — 装饰性 */}
      <span
        aria-hidden="true"
        className="absolute top-4 right-7 font-black text-[110px] leading-none select-none pointer-events-none"
        style={{ color: "rgba(255,255,255,0.025)" }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* ── 顶部 meta ─────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="flex flex-wrap gap-1.5">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${cat.badge}`}>
            {problem.category}
          </span>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${diff}`}>
            {problem.difficulty}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 text-xs text-white/30">
          <span className="text-sm">{problem.countryFlag}</span>
          <span>{problem.country}</span>
        </div>
      </div>

      {/* ── 标题 ──────────────────────────────────────── */}
      <div className="relative z-10">
        <h2 className="text-2xl md:text-[28px] font-bold text-[#EEEEF0] leading-snug tracking-tight">
          {problem.title}
        </h2>
        <p className="mt-2 text-sm text-white/35">
          <span className="text-white/20 mr-1.5">适合</span>
          {problem.targetUsers}
        </p>
      </div>

      {/* ── 描述 ──────────────────────────────────────── */}
      <p className="text-[15px] text-white/55 leading-relaxed line-clamp-3 relative z-10">
        {problem.description}
      </p>

      {/* ── 为什么是现在 ──────────────────────────────── */}
      <div className="bg-white/[0.03] border border-white/[0.05] rounded-2xl px-4 py-3.5 relative z-10">
        <p className="text-[10px] text-white/25 font-semibold uppercase tracking-[0.15em] mb-1.5">
          为什么是现在
        </p>
        <p className="text-sm text-white/45 leading-relaxed line-clamp-2">
          {problem.whyNow}
        </p>
      </div>

      {/* ── 技术标签 ──────────────────────────────────── */}
      <div className="flex flex-wrap gap-1.5 relative z-10">
        {problem.techHints.map((hint) => (
          <span
            key={hint}
            className="text-xs bg-white/[0.04] text-white/35 border border-white/[0.06] px-2.5 py-1 rounded-lg"
          >
            {hint}
          </span>
        ))}
      </div>

      {/* ── 底部 footer ───────────────────────────────── */}
      <div className="flex items-center justify-between pt-4 border-t border-white/[0.06] mt-auto relative z-10 gap-3 flex-wrap">
        {/* 左：状态 + AI */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full shrink-0 ${stat.dot}`} />
            <span className={`text-xs font-medium ${stat.label}`}>{problem.status}</span>
          </div>
          <span className={`text-xs font-medium ${ai}`}>
            AI {problem.aiPotential}
          </span>
        </div>

        {/* 右：操作按钮 */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleUpvote}
            className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-xl transition-all ${
              upvoted
                ? "bg-indigo-500/15 text-indigo-300"
                : "bg-white/[0.05] text-white/35 hover:bg-white/[0.08] hover:text-white/60"
            }`}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill={upvoted ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
            {count}
          </button>

          <button
            onClick={handleBuild}
            className={`text-sm font-semibold px-4 py-1.5 rounded-xl transition-all ${
              building
                ? "bg-indigo-500 text-white"
                : "bg-white/[0.06] text-white/60 hover:bg-indigo-500/20 hover:text-indigo-300"
            }`}
          >
            {building ? "✓ 我来做" : "我来做"}
          </button>

          <button
            onClick={() => router.push(`/problems/${problem.id}`)}
            className="text-xs text-white/30 hover:text-white/60 transition-colors px-2 py-1.5"
          >
            详情 →
          </button>
        </div>
      </div>
    </div>
  );
}
