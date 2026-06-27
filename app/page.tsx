"use client";

import { useState, useMemo } from "react";
import { PROBLEMS, Category, Difficulty } from "@/lib/data";
import ProblemCard from "@/components/ProblemCard";
import FilterBar from "@/components/FilterBar";
import SubmitModal from "@/components/SubmitModal";

type SortMode = "热门" | "最新" | "随机";

const DIFFICULTY_FILTERS: Difficulty[] = ["周末项目", "1-3个月", "需要团队"];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>("热门");
  const [search, setSearch] = useState("");
  const [showSubmit, setShowSubmit] = useState(false);

  const filtered = useMemo(() => {
    let list = [...PROBLEMS];

    if (selectedCategory) list = list.filter((p) => p.category === selectedCategory);
    if (selectedDifficulty) list = list.filter((p) => p.difficulty === selectedDifficulty);

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.targetUsers.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (sortMode === "热门") return list.sort((a, b) => b.upvotes - a.upvotes);
    if (sortMode === "最新") return [...list].reverse();
    return list.sort(() => Math.random() - 0.5);
  }, [selectedCategory, selectedDifficulty, sortMode, search]);

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#F8F7F4]/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight shrink-0">未解</h1>

          {/* Search */}
          <div className="flex-1 max-w-xs relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="搜索问题、行业..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-sm bg-white border border-gray-200 rounded-full text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-400 transition-colors"
            />
          </div>

          <span className="text-xs text-gray-400 hidden md:block flex-1">为独立开发者整理的真实待解问题</span>

          <button
            onClick={() => setShowSubmit(true)}
            className="bg-gray-900 text-white text-sm font-medium px-4 py-1.5 rounded-full hover:bg-gray-700 transition-colors shrink-0"
          >
            提交问题
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-2">
            找到值得你全力以赴的那个问题
          </h2>
          <p className="text-gray-500 text-sm sm:text-base max-w-xl">
            这里汇集了真实存在、还没有好产品解决的细分痛点。每一张卡片都是一个独立开发者可以动手做的方向。
          </p>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-5 mb-6 text-sm">
          <span className="text-gray-400">
            <strong className="text-gray-900">{PROBLEMS.length}</strong> 个问题
          </span>
          <span className="text-gray-400">
            <strong className="text-gray-900">10</strong> 个场景
          </span>
          <span className="bg-green-50 text-green-600 text-xs px-2 py-0.5 rounded-full">
            {PROBLEMS.filter((p) => p.difficulty === "周末项目").length} 个周末可做
          </span>
        </div>

        {/* Category filter */}
        <div className="mb-3">
          <FilterBar selected={selectedCategory} onSelect={setSelectedCategory} />
        </div>

        {/* Controls row: difficulty filter + sort */}
        <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-400 mr-1">难度</span>
            {DIFFICULTY_FILTERS.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDifficulty(selectedDifficulty === d ? null : d)}
                className={`text-xs px-3 py-1 rounded-full border transition-all ${
                  selectedDifficulty === d
                    ? "bg-gray-900 text-white border-gray-900"
                    : "border-gray-200 text-gray-500 hover:border-gray-400"
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
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
        </div>

        {/* Search result indicator */}
        {search.trim() && (
          <p className="text-sm text-gray-500 mb-4">
            搜索「{search}」共找到 <strong>{filtered.length}</strong> 个问题
          </p>
        )}

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-sm mb-2">没有找到匹配的问题</p>
            <button
              onClick={() => { setSearch(""); setSelectedCategory(null); setSelectedDifficulty(null); }}
              className="text-xs text-gray-500 underline"
            >
              清除筛选
            </button>
          </div>
        )}

        {/* Founder note */}
        <div className="mt-20 mb-8 max-w-2xl mx-auto">
          <div className="border-t border-gray-200 pt-10">
            <p className="text-xs text-gray-400 font-medium mb-4 tracking-widest uppercase">创始人的话</p>
            <blockquote className="text-gray-600 text-sm leading-loose space-y-4">
              <p>我相信 AI 是这个时代最重要的力量——不是因为它酷，而是因为它第一次让普通人有能力解决原本只有大机构才能触碰的问题。</p>
              <p>但我注意到一件奇怪的事：有能力的人越来越多，世界的问题却好像没有变少。</p>
              <p>原因不是人们不愿意去解决，而是我们都活在自己的信息茧房里。一个能做出改变的独立开发者，可能从来没有听说过某个地方正在发生的某个真实的困境。而那个困境里的人，也不知道世界上某个角落有人恰好能帮到他们。</p>
              <p>这个平台想做的事很简单：把世界上真实存在的问题，放到那些有能力解决它们的人面前。</p>
              <p>不宏大，不复杂。就是一张卡片，一个问题，一个也许会因此改变方向的人。</p>
              <p>如果 AI 真的能推动人类文明进步，那一定是因为有足够多的人，找到了值得他们全力以赴的那个问题。</p>
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
