"use client";

import { useState, useMemo } from "react";
import { PROBLEMS, Category } from "@/lib/data";
import ProblemCard from "@/components/ProblemCard";
import FilterBar from "@/components/FilterBar";
import SubmitModal from "@/components/SubmitModal";

type SortMode = "热门" | "最新" | "随机";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>("热门");
  const [showSubmit, setShowSubmit] = useState(false);

  const filtered = useMemo(() => {
    let list = selectedCategory
      ? PROBLEMS.filter((p) => p.category === selectedCategory)
      : [...PROBLEMS];

    if (sortMode === "热门") return list.sort((a, b) => b.upvotes - a.upvotes);
    if (sortMode === "最新") return list.reverse();
    return list.sort(() => Math.random() - 0.5);
  }, [selectedCategory, sortMode]);

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#F8F7F4]/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">未解</h1>
            <span className="text-xs text-gray-400 hidden sm:block">值得被解决的世界问题</span>
          </div>
          <button
            onClick={() => setShowSubmit(true)}
            className="bg-gray-900 text-white text-sm font-medium px-4 py-1.5 rounded-full hover:bg-gray-700 transition-colors"
          >
            提交问题
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-2">
            世界上还有哪些问题<br className="sm:hidden" />等待被解决？
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">
            为独立开发者和创业者整理真实世界的待解难题。找到你值得全力以赴的那个方向。
          </p>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-6 mb-6 text-sm text-gray-400">
          <span><strong className="text-gray-900">{PROBLEMS.length}</strong> 个问题</span>
          <span><strong className="text-gray-900">10</strong> 个领域</span>
          <span><strong className="text-gray-900">1</strong> 个国家</span>
        </div>

        {/* Filter bar */}
        <div className="mb-4">
          <FilterBar selected={selectedCategory} onSelect={setSelectedCategory} />
        </div>

        {/* Sort tabs */}
        <div className="flex items-center gap-1 mb-6">
          {(["热门", "最新", "随机"] as SortMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setSortMode(mode)}
              className={`text-xs px-3 py-1 rounded-full transition-all ${
                sortMode === mode
                  ? "bg-gray-200 text-gray-900 font-medium"
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-sm">该分类暂无问题，欢迎提交</p>
          </div>
        )}

        {/* Founder note */}
        <div className="mt-20 mb-8 max-w-2xl mx-auto">
          <div className="border-t border-gray-200 pt-10">
            <p className="text-xs text-gray-400 font-medium mb-4 tracking-widest uppercase">创始人的话</p>
            <blockquote className="text-gray-600 text-sm leading-loose space-y-4">
              <p>
                我相信 AI 是这个时代最重要的力量——不是因为它酷，而是因为它第一次让普通人有能力解决原本只有大机构才能触碰的问题。
              </p>
              <p>
                但我注意到一件奇怪的事：有能力的人越来越多，世界的问题却好像没有变少。
              </p>
              <p>
                原因不是人们不愿意去解决，而是我们都活在自己的信息茧房里。一个能做出改变的独立开发者，可能从来没有听说过某个地方正在发生的某个真实的困境。而那个困境里的人，也不知道世界上某个角落有人恰好能帮到他们。
              </p>
              <p>
                这个平台想做的事很简单：把世界上真实存在的问题，放到那些有能力解决它们的人面前。
              </p>
              <p>
                不宏大，不复杂。就是一张卡片，一个问题，一个也许会因此改变方向的人。
              </p>
              <p>
                如果 AI 真的能推动人类文明进步，那一定是因为有足够多的人，找到了值得他们全力以赴的那个问题。
              </p>
            </blockquote>
            <p className="text-xs text-gray-400 mt-6">—— 创始人</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-400">未解 Wèi Jiě</span>
          <span className="text-xs text-gray-400">Unsolved · Problems Worth Building For</span>
        </div>
      </footer>

      {showSubmit && <SubmitModal onClose={() => setShowSubmit(false)} />}
    </div>
  );
}
