"use client";

import { useState } from "react";
import Link from "next/link";
import { Problem } from "@/lib/data";

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

const HOT_THRESHOLD = 800;

export default function ProblemCardFull({
  problem,
}: {
  problem: Problem;
  index: number;
}) {
  const [interested, setInterested] = useState(false);

  const isHot = problem.upvotes >= HOT_THRESHOLD;

  return (
    <div
      className="relative flex flex-col bg-white rounded-3xl overflow-hidden"
      style={{ minHeight: "clamp(480px, 70vh, 680px)" }}
    >
      {/* Card content */}
      <div className="flex flex-col flex-1 p-6 gap-4">
        {/* Top badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {isHot && (
            <span className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full bg-red-100 text-red-600">
              🔥 HOT PROBLEM
            </span>
          )}
          <span
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
              CAT_COLORS[problem.category] ?? "bg-gray-100 text-gray-600"
            }`}
          >
            {problem.category}
          </span>
          <span className="ml-auto text-[11px] text-gray-400 flex items-center gap-1">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            {problem.upvotes.toLocaleString()}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-[22px] font-black text-gray-900 leading-tight tracking-tight">
          {problem.title}
        </h2>

        {/* Description */}
        <p className="text-[14px] text-gray-500 leading-relaxed line-clamp-4 flex-1">
          {problem.description}
        </p>

        {/* Hashtags */}
        <div className="flex flex-wrap gap-1.5">
          {problem.techHints.slice(0, 3).map((h) => (
            <span key={h} className="text-[11px] text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
              #{h}
            </span>
          ))}
        </div>

        {/* User row */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-green-600 flex items-center justify-center text-white text-[11px] font-bold">
              {problem.submittedBy === "创始人精选" ? "F" : "U"}
            </div>
            <div>
              <p className="text-[12px] font-semibold text-gray-700">
                {problem.submittedBy === "创始人精选" ? "Founder" : "社区用户"}
              </p>
              <p className="text-[10px] text-gray-400">2小时前发布</p>
            </div>
          </div>
          <Link
            href={`/problems/${problem.id}`}
            onClick={(e) => e.stopPropagation()}
            className="text-[12px] font-semibold text-[#0e6b4a] flex items-center gap-1 hover:gap-2 transition-all"
          >
            详情
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
