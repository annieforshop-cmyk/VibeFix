"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Problem, CATEGORY_COLORS } from "@/lib/data";

const DIFFICULTY_STYLES: Record<string, string> = {
  周末项目: "bg-green-50 text-green-600",
  "1-3个月": "bg-blue-50 text-blue-600",
  需要团队: "bg-orange-50 text-orange-600",
};

const STATUS_DOT: Record<string, string> = {
  无人在做: "bg-red-400",
  有人在做: "bg-green-400",
  部分解决: "bg-yellow-400",
};

export default function ProblemCard({ problem }: { problem: Problem }) {
  const router = useRouter();
  const [upvoted, setUpvoted] = useState(false);
  const [count, setCount] = useState(problem.upvotes);
  const [building, setBuilding] = useState(false);

  function handleUpvote(e: React.MouseEvent) {
    e.stopPropagation();
    setCount((c) => (upvoted ? c - 1 : c + 1));
    setUpvoted(!upvoted);
  }

  function handleBuild(e: React.MouseEvent) {
    e.stopPropagation();
    setBuilding(!building);
  }

  return (
    <div
      onClick={() => router.push(`/problems/${problem.id}`)}
      className="group bg-white border border-gray-100 rounded-2xl p-5 cursor-pointer hover:border-gray-200 hover:shadow-lg hover:shadow-gray-100 transition-all duration-200 flex flex-col gap-4"
    >
      {/* Top meta row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base leading-none">{problem.countryFlag}</span>
          <span className="text-xs text-gray-400 truncate">{problem.country}</span>
          <span className="text-gray-200">·</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${CATEGORY_COLORS[problem.category]}`}>
            {problem.category}
          </span>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${DIFFICULTY_STYLES[problem.difficulty]}`}>
          {problem.difficulty}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-[15px] font-semibold text-gray-900 leading-snug group-hover:text-gray-700 transition-colors">
        {problem.title}
      </h3>

      {/* Target users */}
      <p className="text-xs text-gray-400 -mt-2">
        <span className="text-gray-300 mr-1">适合 →</span>
        {problem.targetUsers}
      </p>

      {/* Description */}
      <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
        {problem.description}
      </p>

      {/* Tech hints */}
      <div className="flex flex-wrap gap-1.5">
        {problem.techHints.slice(0, 3).map((hint) => (
          <span key={hint} className="text-xs bg-gray-50 text-gray-400 px-2 py-0.5 rounded-md border border-gray-100">
            {hint}
          </span>
        ))}
        {problem.techHints.length > 3 && (
          <span className="text-xs text-gray-300 px-1">+{problem.techHints.length - 3}</span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 mt-auto border-t border-gray-50">
        <div className="flex items-center gap-3">
          {/* Status dot */}
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[problem.status]}`} />
            <span className="text-xs text-gray-400">{problem.status}</span>
          </div>
          {/* AI badge */}
          <span className="text-xs text-gray-300">AI {problem.aiPotential}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Upvote */}
          <button
            onClick={handleUpvote}
            className={`flex items-center gap-1 text-xs font-medium transition-colors px-2 py-1 rounded-lg ${
              upvoted
                ? "bg-violet-50 text-violet-600"
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
            }`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill={upvoted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
            {count}
          </button>
          {/* Build CTA */}
          <button
            onClick={handleBuild}
            className={`text-xs font-medium px-3 py-1 rounded-lg transition-all ${
              building
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-900 hover:text-white"
            }`}
          >
            {building ? "✓ 我来做" : "我来做"}
          </button>
        </div>
      </div>
    </div>
  );
}
