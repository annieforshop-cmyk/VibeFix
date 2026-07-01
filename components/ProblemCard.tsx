"use client";

import { useState } from "react";
import Link from "next/link";
import { Problem } from "@/lib/data";

const HOT_THRESHOLD = 800;

const CAT_COLORS: Record<string, string> = {
  自由职业: "bg-violet-100 text-violet-700",
  小生意:   "bg-amber-100 text-amber-700",
  效率工具: "bg-blue-100 text-blue-700",
  创作者:   "bg-pink-100 text-pink-700",
  学习成长: "bg-emerald-100 text-emerald-700",
  本地生活: "bg-orange-100 text-orange-700",
  社交连接: "bg-cyan-100 text-cyan-700",
  个人财务: "bg-lime-100 text-lime-700",
  宠物生活: "bg-rose-100 text-rose-700",
  健身健康: "bg-teal-100 text-teal-700",
};

export default function ProblemCard({
  problem,
  featured = false,
}: {
  problem: Problem;
  featured?: boolean;
}) {
  const [interested, setInterested] = useState(false);
  const [count, setCount] = useState(problem.upvotes);

  const isHot = problem.upvotes >= HOT_THRESHOLD;

  function handleInterested(e: React.MouseEvent) {
    e.stopPropagation();
    setCount((c) => (interested ? c - 1 : c + 1));
    setInterested((v) => !v);
  }

  return (
    <div
      className={`group relative flex flex-col bg-white border border-gray-100 rounded-2xl p-5 hover:border-gray-200 hover:shadow-md transition-all duration-200 ${
        featured ? "sm:col-span-2" : ""
      }`}
    >
      <Link
        href={`/problems/${problem.id}`}
        className="absolute inset-0 z-0 rounded-2xl"
        aria-label={problem.title}
      />

      {/* Top badges */}
      <div className="flex items-center gap-1.5 flex-wrap mb-3">
        {isHot && (
          <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-red-100 text-red-600">
            🔥 HOT PROBLEM
          </span>
        )}
        <span
          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
            CAT_COLORS[problem.category] ?? "bg-gray-100 text-gray-600"
          }`}
        >
          {problem.category}
        </span>
        <span className="ml-auto text-[11px] text-gray-400 flex items-center gap-1">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          {count.toLocaleString()}
        </span>
      </div>

      {/* Title */}
      <h3
        className={`font-bold text-gray-900 leading-snug mb-2 group-hover:text-[#0e6b4a] transition-colors ${
          featured ? "text-xl" : "text-[15px]"
        }`}
      >
        {problem.title}
      </h3>

      {/* Description */}
      <p
        className={`text-gray-500 leading-relaxed mb-3 ${
          featured ? "text-[14px] line-clamp-3" : "text-[13px] line-clamp-2"
        }`}
      >
        {problem.description}
      </p>

      {/* Hashtags */}
      <div className="flex flex-wrap gap-1 mb-4">
        {problem.techHints.slice(0, 3).map((h) => (
          <span
            key={h}
            className="text-[11px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100"
          >
            #{h}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between gap-2 pt-3 border-t border-gray-50">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-green-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
            {problem.submittedBy === "创始人精选" ? "F" : "U"}
          </div>
          <span className="text-[11px] text-gray-400">
            {problem.submittedBy === "创始人精选" ? "创始人精选" : "社区提交"}
          </span>
          {problem.submittedBy !== "创始人精选" && (
            <span className="text-[10px] text-gray-300">· {Math.floor(Math.random() * 5) + 1}天前发布</span>
          )}
        </div>
        <button
          onClick={handleInterested}
          className={`relative z-10 text-[12px] font-semibold px-3.5 py-1.5 rounded-full transition-all duration-150 shrink-0 ${
            interested
              ? "bg-[#0e6b4a] text-white"
              : "border border-[#0e6b4a] text-[#0e6b4a] hover:bg-[#0e6b4a] hover:text-white"
          }`}
        >
          {interested ? "✓ 感兴趣" : "感兴趣"}
        </button>
      </div>
    </div>
  );
}
