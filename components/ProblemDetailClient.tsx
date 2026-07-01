"use client";

import { useState } from "react";
import Link from "next/link";
import { PROBLEMS, CATEGORY_COLORS, Problem } from "@/lib/data";

const DIFFICULTY_STYLES: Record<string, string> = {
  周末项目:  "bg-green-50 text-green-700 border-green-100",
  "1-3个月": "bg-blue-50 text-blue-700 border-blue-100",
  需要团队:  "bg-orange-50 text-orange-700 border-orange-100",
};

const AI_STYLES: Record<string, string> = {
  高: "bg-violet-50 text-violet-700",
  中: "bg-sky-50 text-sky-700",
  低: "bg-gray-50 text-gray-500",
};

const STATUS_STYLES: Record<string, string> = {
  无人在做: "bg-red-50 text-red-600",
  有人在做: "bg-green-50 text-green-700",
  部分解决: "bg-yellow-50 text-yellow-700",
};

export default function ProblemDetailClient({ problem }: { problem: Problem }) {
  const [upvoted, setUpvoted] = useState(false);
  const [count, setCount] = useState(problem.upvotes);
  const [building, setBuilding] = useState(false);
  const [builderCount] = useState(Math.floor(problem.upvotes * 0.12));

  return (
    <div className="min-h-screen bg-[#f8f9f8]">
      {/* Header */}
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
          <span className="text-sm font-black text-[#0e6b4a]">Unresolved</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        {/* Category + country */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-xl">{problem.countryFlag}</span>
          <span className="text-sm text-gray-400">{problem.country}</span>
          <span className="text-gray-200">·</span>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${CATEGORY_COLORS[problem.category]}`}>
            {problem.category}
          </span>
          <span className="text-xs text-gray-400">{problem.subcategory}</span>
        </div>

        {/* Upvotes badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#0e6b4a] bg-green-50 px-3 py-1 rounded-full">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            {count.toLocaleString()} 关注
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-snug mb-6 tracking-tight">
          {problem.title}
        </h1>

        {/* Status badges row */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <span className={`text-xs px-3 py-1 rounded-full border font-medium ${DIFFICULTY_STYLES[problem.difficulty]}`}>
            {problem.difficulty}
          </span>
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_STYLES[problem.status]}`}>
            {problem.status}
          </span>
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${AI_STYLES[problem.aiPotential]}`}>
            AI 可解性 {problem.aiPotential}
          </span>
        </div>

        {/* Content sections */}
        <div className="space-y-8">
          <section>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">问题描述</h2>
            <p className="text-gray-700 leading-relaxed text-[15px]">{problem.description}</p>
          </section>

          <section>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">目标用户</h2>
            <div className="bg-white border border-gray-100 rounded-xl p-4">
              <p className="text-gray-700 text-[15px]">{problem.targetUsers}</p>
            </div>
          </section>

          <section>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">为什么现在可以做</h2>
            <div className="bg-white border border-gray-100 rounded-xl p-4">
              <p className="text-gray-700 text-[15px] leading-relaxed">{problem.whyNow}</p>
            </div>
          </section>

          <section>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">技术方向参考</h2>
            <div className="flex flex-wrap gap-2">
              {problem.techHints.map((hint) => (
                <span
                  key={hint}
                  className="text-sm bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-xl"
                >
                  {hint}
                </span>
              ))}
            </div>
          </section>

          {problem.source && (
            <p className="text-xs text-gray-400 italic">数据来源：{problem.source}</p>
          )}
        </div>

        {/* CTA block */}
        <div className="mt-12 bg-white border border-gray-100 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-gray-900 mb-1">
                {building ? "✓ 已加入「正在做」名单" : "这个问题值得被解决"}
              </p>
              <p className="text-xs text-gray-400">
                已有 <strong className="text-gray-700">{building ? builderCount + 1 : builderCount}</strong> 位开发者表示感兴趣
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setBuilding(!building)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  building
                    ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    : "bg-[#0e6b4a] text-white hover:bg-[#0a5a3d]"
                }`}
              >
                {building ? "取消" : "👋 我来做这个"}
              </button>
              <button
                onClick={() => {
                  setCount((c) => (upvoted ? c - 1 : c + 1));
                  setUpvoted(!upvoted);
                }}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                  upvoted
                    ? "bg-green-50 text-[#0e6b4a] border-green-200"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill={upvoted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                {count}
              </button>
            </div>
          </div>
        </div>

        {/* Related */}
        <div className="mt-12">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">同类问题</h2>
          <div className="space-y-3">
            {PROBLEMS.filter((p) => p.category === problem.category && p.id !== problem.id)
              .slice(0, 2)
              .concat(PROBLEMS.filter((p) => p.id !== problem.id).slice(0, 2))
              .filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i)
              .slice(0, 3)
              .map((related) => (
                <Link
                  key={related.id}
                  href={`/problems/${related.id}`}
                  className="block w-full text-left bg-white border border-gray-100 rounded-xl px-4 py-3 hover:border-[#0e6b4a]/30 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors line-clamp-1">
                      {related.title}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${CATEGORY_COLORS[related.category]}`}>
                      {related.category}
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white py-6 mt-16">
        <div className="max-w-3xl mx-auto px-4 flex items-center justify-between">
          <span className="text-sm font-black text-[#0e6b4a]">Unresolved</span>
          <span className="text-xs text-gray-400">Problems Worth Building For</span>
        </div>
      </footer>
    </div>
  );
}
