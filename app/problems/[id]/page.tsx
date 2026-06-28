"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PROBLEMS, CATEGORY_COLORS } from "@/lib/data";

const DIFFICULTY_STYLES: Record<string, string> = {
  周末项目: "bg-green-50 text-green-600 border-green-100",
  "1-3个月": "bg-blue-50 text-blue-600 border-blue-100",
  需要团队: "bg-orange-50 text-orange-600 border-orange-100",
};

const AI_STYLES: Record<string, string> = {
  高: "bg-violet-50 text-violet-600",
  中: "bg-sky-50 text-sky-600",
  低: "bg-gray-50 text-gray-500",
};

const STATUS_STYLES: Record<string, string> = {
  无人在做: "bg-red-50 text-red-500",
  有人在做: "bg-green-50 text-green-600",
  部分解决: "bg-yellow-50 text-yellow-600",
};

export default function ProblemDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const problem = PROBLEMS.find((p) => p.id === id);

  const [upvoted, setUpvoted] = useState(false);
  const [count, setCount] = useState(problem?.upvotes ?? 0);
  const [building, setBuilding] = useState(false);
  const [builderCount] = useState(Math.floor((problem?.upvotes ?? 0) * 0.12));

  if (!problem) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-4">找不到这个问题</p>
          <button onClick={() => router.push("/")} className="text-gray-900 text-sm underline">
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#F8F7F4]/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            返回
          </button>
          <span className="text-gray-200">·</span>
          <span className="text-sm font-semibold text-gray-900">未解</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        {/* Category + country */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">{problem.countryFlag}</span>
          <span className="text-sm text-gray-400">{problem.country}</span>
          <span className="text-gray-200">·</span>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${CATEGORY_COLORS[problem.category]}`}>
            {problem.category}
          </span>
          <span className="text-xs text-gray-400">{problem.subcategory}</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug mb-6">
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
          {/* Description */}
          <section>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">问题描述</h2>
            <p className="text-gray-700 leading-relaxed text-[15px]">{problem.description}</p>
          </section>

          {/* Target users */}
          <section>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">目标用户</h2>
            <div className="bg-white border border-gray-100 rounded-xl p-4">
              <p className="text-gray-700 text-[15px]">{problem.targetUsers}</p>
            </div>
          </section>

          {/* Why now */}
          <section>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">为什么现在可以做</h2>
            <div className="bg-white border border-gray-100 rounded-xl p-4">
              <p className="text-gray-700 text-[15px] leading-relaxed">{problem.whyNow}</p>
            </div>
          </section>

          {/* Tech hints */}
          <section>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">技术方向参考</h2>
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

          {/* Source */}
          {problem.source && (
            <p className="text-xs text-gray-400 italic">数据来源：{problem.source}</p>
          )}
        </div>

        {/* CTA block */}
        <div className="mt-12 bg-white border border-gray-100 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1">
                {building ? "✓ 已加入「正在做」名单" : "这个问题值得被解决"}
              </p>
              <p className="text-xs text-gray-400">
                已有 <strong className="text-gray-700">{building ? builderCount + 1 : builderCount}</strong> 位开发者表示感兴趣
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setBuilding(!building)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  building
                    ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    : "bg-gray-900 text-white hover:bg-gray-700"
                }`}
              >
                {building ? "取消" : "👋 我来做这个"}
              </button>
              <button
                onClick={() => {
                  setCount((c) => (upvoted ? c - 1 : c + 1));
                  setUpvoted(!upvoted);
                }}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium transition-all border ${
                  upvoted
                    ? "bg-violet-50 text-violet-600 border-violet-200"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill={upvoted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
                {count}
              </button>
            </div>
          </div>
        </div>

        {/* Related — show 3 other problems from same category */}
        <div className="mt-12">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">同类问题</h2>
          <div className="space-y-3">
            {PROBLEMS.filter((p) => p.category === problem.category && p.id !== problem.id)
              .slice(0, 2)
              .concat(PROBLEMS.filter((p) => p.id !== problem.id).slice(0, 2))
              .filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i)
              .slice(0, 3)
              .map((related) => (
                <button
                  key={related.id}
                  onClick={() => router.push(`/problems/${related.id}`)}
                  className="w-full text-left bg-white border border-gray-100 rounded-xl px-4 py-3 hover:border-gray-200 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors line-clamp-1">
                      {related.title}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${CATEGORY_COLORS[related.category]}`}>
                      {related.category}
                    </span>
                  </div>
                </button>
              ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 mt-16">
        <div className="max-w-3xl mx-auto px-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-400">未解 Wèi Jiě</span>
          <span className="text-xs text-gray-400">Unsolved · Problems Worth Building For</span>
        </div>
      </footer>
    </div>
  );
}
