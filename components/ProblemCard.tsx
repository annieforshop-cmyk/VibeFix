"use client";

import { useState } from "react";
import { Problem, CATEGORY_COLORS, CATEGORY_DOTS } from "@/lib/data";

const AI_BADGE: Record<string, string> = {
  高: "bg-violet-100 text-violet-700",
  中: "bg-sky-100 text-sky-700",
  低: "bg-gray-100 text-gray-500",
};

const STATUS_BADGE: Record<string, string> = {
  无人在做: "bg-red-50 text-red-600",
  有人在做: "bg-green-50 text-green-600",
  部分解决: "bg-yellow-50 text-yellow-600",
};

export default function ProblemCard({ problem }: { problem: Problem }) {
  const [upvoted, setUpvoted] = useState(false);
  const [count, setCount] = useState(problem.upvotes);
  const [expanded, setExpanded] = useState(false);

  function handleUpvote(e: React.MouseEvent) {
    e.stopPropagation();
    if (upvoted) {
      setCount((c) => c - 1);
    } else {
      setCount((c) => c + 1);
    }
    setUpvoted(!upvoted);
  }

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="group bg-white border border-gray-100 rounded-2xl p-5 cursor-pointer hover:border-gray-300 hover:shadow-md transition-all duration-200 flex flex-col gap-3"
    >
      {/* Top row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{problem.countryFlag}</span>
          <span className="text-xs text-gray-400 font-medium">{problem.country}</span>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[problem.status]}`}>
          {problem.status}
        </span>
      </div>

      {/* Category dot + label */}
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${CATEGORY_DOTS[problem.category]}`} />
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[problem.category]}`}>
          {problem.category}
        </span>
        <span className="text-xs text-gray-400">{problem.subcategory}</span>
      </div>

      {/* Title */}
      <h3 className="text-[15px] font-semibold text-gray-900 leading-snug">
        {problem.title}
      </h3>

      {/* Description - collapsed by default */}
      <p className={`text-sm text-gray-500 leading-relaxed transition-all duration-200 ${expanded ? "" : "line-clamp-2"}`}>
        {problem.description}
      </p>

      {expanded && problem.source && (
        <p className="text-xs text-gray-400 italic">来源：{problem.source}</p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 mt-auto">
        <div className="flex items-center gap-3">
          <button
            onClick={handleUpvote}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
              upvoted ? "text-violet-600" : "text-gray-400 hover:text-gray-700"
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={upvoted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
            {count}
          </button>
          <span className="text-xs text-gray-300">·</span>
          <span className="text-xs text-gray-400">{problem.views.toLocaleString()} 次浏览</span>
        </div>

        <span className={`text-xs px-2 py-0.5 rounded-full ${AI_BADGE[problem.aiPotential]}`}>
          AI 可解性 {problem.aiPotential}
        </span>
      </div>
    </div>
  );
}
