"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CATEGORY_COLORS, Problem } from "@/lib/data";

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

function collectedKey(id: string) {
  return `vibefix_collected_${id}`;
}

export default function ProblemDetailClient({ problem }: { problem: Problem }) {
  const [upvoted, setUpvoted] = useState(
    () => typeof window !== "undefined" && window.localStorage.getItem(collectedKey(problem.id)) === "1"
  );
  const [count, setCount] = useState(problem.upvotes);
  const [building, setBuilding] = useState(false);
  const [builderCount] = useState(Math.floor(problem.upvotes * 0.12));
  const [related, setRelated] = useState<Problem[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/problems?category=${encodeURIComponent(problem.category)}&limit=6`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const items = ((data.items ?? []) as Problem[]).filter((p) => p.id !== problem.id).slice(0, 3);
        setRelated(items);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [problem.category, problem.id]);

  async function handleCollectClick() {
    const nextUpvoted = !upvoted;
    setUpvoted(nextUpvoted);
    setCount((c) => (nextUpvoted ? c + 1 : c - 1));
    try {
      const res = await fetch(`/api/problems/${problem.id}/collect`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (typeof data.count === "number") setCount(data.count);
        window.localStorage.setItem(collectedKey(problem.id), data.collected ? "1" : "0");
      }
    } catch {
      // best-effort — keep optimistic local state on network failure
    }
  }

  const evidence = problem.detail?.evidence;
  const market = problem.detail?.market;

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
          {typeof problem.complaintCount === "number" && (
            <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              📊 {problem.complaintCount} 条真实抱怨
            </span>
          )}
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
          {typeof problem.painScore === "number" && (
            <span className="text-xs px-3 py-1 rounded-full font-medium bg-rose-50 text-rose-600">
              🎯 痛点强度 {problem.painScore}/10
            </span>
          )}
          {typeof problem.growthRate === "number" && problem.growthRate !== 0 && (
            <span className="text-xs px-3 py-1 rounded-full font-medium bg-emerald-50 text-emerald-700">
              近30天 +{problem.growthRate}%
            </span>
          )}
        </div>

        {/* Content sections */}
        <div className="space-y-8">
          <section>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">问题描述</h2>
            <p className="text-gray-700 leading-relaxed text-[15px]">{problem.description}</p>
          </section>

          {(evidence?.keywords?.length || evidence?.quotes?.length) ? (
            <section>
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">📊 数据证据</h2>
              <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-4">
                {!!evidence?.keywords?.length && (
                  <div className="flex flex-wrap gap-2">
                    {evidence.keywords.map((kw) => (
                      <span key={kw} className="text-xs bg-gray-50 border border-gray-100 text-gray-500 px-2.5 py-1 rounded-full">
                        #{kw}
                      </span>
                    ))}
                  </div>
                )}
                {!!evidence?.quotes?.length && (
                  <div className="space-y-2">
                    {evidence.quotes.map((q, i) => (
                      <blockquote key={i} className="text-[13px] text-gray-600 border-l-2 border-gray-200 pl-3 italic">
                        “{q.text}”
                        <span className="not-italic text-gray-400"> — {q.author}</span>
                      </blockquote>
                    ))}
                  </div>
                )}
              </div>
            </section>
          ) : null}

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

          {market && (market.market_size || market.competitors?.length || market.monetization?.length || market.willingness_to_pay) ? (
            <section>
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">💰 市场机会</h2>
              <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-3 text-[14px] text-gray-700">
                {market.market_size && (
                  <p><span className="font-semibold text-gray-500">市场规模：</span>{market.market_size}</p>
                )}
                {!!market.competitors?.length && (
                  <p><span className="font-semibold text-gray-500">现有竞品：</span>{market.competitors.join("、")}</p>
                )}
                {!!market.monetization?.length && (
                  <p><span className="font-semibold text-gray-500">变现模式：</span>{market.monetization.join("、")}</p>
                )}
                {market.willingness_to_pay && (
                  <p><span className="font-semibold text-gray-500">付费意愿：</span>{market.willingness_to_pay}</p>
                )}
              </div>
            </section>
          ) : null}

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
            {problem.detail?.tech?.timeline && (
              <p className="text-[13px] text-gray-400 mt-3">预计开发周期：{problem.detail.tech.timeline}</p>
            )}
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
                onClick={handleCollectClick}
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
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">同类问题</h2>
            <div className="space-y-3">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/problems/${r.id}`}
                  className="block w-full text-left bg-white border border-gray-100 rounded-xl px-4 py-3 hover:border-[#0e6b4a]/30 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors line-clamp-1">
                      {r.title}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${CATEGORY_COLORS[r.category]}`}>
                      {r.category}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
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
