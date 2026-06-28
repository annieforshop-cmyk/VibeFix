"use client";

import { useState, useMemo } from "react";
import { PROBLEMS, ALL_CATEGORIES, Category, Difficulty } from "@/lib/data";
import CardDeck from "@/components/CardDeck";
import SubmitModal from "@/components/SubmitModal";

type SortMode = "热门" | "最新" | "随机";
const DIFFICULTY_OPTS: Difficulty[] = ["周末项目", "1-3个月", "需要团队"];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>("热门");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
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
          p.category.toLowerCase().includes(q) ||
          p.targetUsers.toLowerCase().includes(q)
      );
    }
    if (sortMode === "热门") return list.sort((a, b) => b.upvotes - a.upvotes);
    if (sortMode === "最新") return [...list].reverse();
    return list.sort(() => Math.random() - 0.5);
  }, [selectedCategory, selectedDifficulty, sortMode, search]);

  const activeCount = [selectedCategory, selectedDifficulty].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#0E0E14] text-[#EEEEF0]">
      {/* ══ Header ══════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 bg-[#0E0E14]/90 backdrop-blur-xl border-b border-white/[0.05]">
        <div className="max-w-4xl mx-auto px-4 md:px-6 h-14 flex items-center gap-3">
          {/* Logo */}
          <div className="shrink-0 flex items-center gap-2 mr-1">
            <span className="text-[15px] font-black tracking-tight text-white">未解</span>
            <span className="hidden sm:inline text-[11px] text-white/20">· Wèi Jiě</span>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-xs relative">
            <svg
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/20"
              width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="搜索问题..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-sm bg-white/[0.05] border border-white/[0.07] rounded-xl text-white/75 placeholder-white/20 focus:outline-none focus:border-white/[0.16] focus:bg-white/[0.07] transition-all"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters((f) => !f)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border transition-all ${
                showFilters || activeCount > 0
                  ? "bg-indigo-500/15 border-indigo-500/30 text-indigo-300"
                  : "bg-white/[0.04] border-white/[0.07] text-white/35 hover:text-white/60 hover:bg-white/[0.07]"
              }`}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
              </svg>
              筛选{activeCount > 0 ? ` ${activeCount}` : ""}
            </button>

            {/* Submit */}
            <button
              onClick={() => setShowSubmit(true)}
              className="text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white transition-colors shrink-0"
            >
              提交
            </button>
          </div>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="border-t border-white/[0.05]">
            <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 space-y-3">
              {/* Categories */}
              <div className="flex flex-wrap gap-1.5">
                {ALL_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                    className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                      selectedCategory === cat
                        ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-200"
                        : "bg-white/[0.03] border-white/[0.07] text-white/40 hover:text-white/65 hover:bg-white/[0.06]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Difficulty + Sort */}
              <div className="flex items-center gap-5 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-white/20 mr-0.5">难度</span>
                  {DIFFICULTY_OPTS.map((d) => (
                    <button
                      key={d}
                      onClick={() => setSelectedDifficulty(selectedDifficulty === d ? null : d)}
                      className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                        selectedDifficulty === d
                          ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-200"
                          : "bg-white/[0.03] border-white/[0.07] text-white/40 hover:text-white/65"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-white/20 mr-0.5">排序</span>
                  {(["热门", "最新", "随机"] as SortMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setSortMode(mode)}
                      className={`text-xs px-3 py-1.5 rounded-xl transition-all ${
                        sortMode === mode
                          ? "bg-white/[0.10] text-white/80"
                          : "text-white/30 hover:text-white/60"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>

                {(selectedCategory || selectedDifficulty) && (
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setSelectedDifficulty(null);
                    }}
                    className="text-[11px] text-white/25 hover:text-white/50 transition-colors ml-auto"
                  >
                    清除筛选
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ══ Main ════════════════════════════════════════════ */}
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-12">
        {/* Hero */}
        <div className="mb-12 text-center">
          <p className="text-[11px] text-white/25 font-semibold uppercase tracking-[0.2em] mb-4">
            为独立开发者整理的真实待解问题
          </p>
          <h1 className="text-3xl md:text-[42px] font-black tracking-tight text-white leading-[1.15] mb-4">
            找到值得你
            <span className="text-indigo-400"> 全力以赴 </span>
            的那个问题
          </h1>
          <p className="text-sm text-white/35 max-w-md mx-auto leading-relaxed">
            每一张卡片都是一个细分痛点，一个可以动手做的方向。<br />
            左右划动或按方向键浏览。
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-5 mt-6">
            <span className="text-xs text-white/25">
              <strong className="text-white/50 font-semibold">{PROBLEMS.length}</strong> 个问题
            </span>
            <span className="text-white/10">·</span>
            <span className="text-xs text-white/25">
              <strong className="text-emerald-400 font-semibold">
                {PROBLEMS.filter((p) => p.difficulty === "周末项目").length}
              </strong>{" "}
              个周末可做
            </span>
            <span className="text-white/10">·</span>
            <span className="text-xs text-white/25">
              <strong className="text-white/50 font-semibold">10</strong> 个场景
            </span>
          </div>

          {search.trim() && (
            <p className="mt-4 text-xs text-white/30">
              「{search}」找到{" "}
              <strong className="text-white/55 font-semibold">{filtered.length}</strong> 个结果
            </p>
          )}
        </div>

        {/* Card Deck */}
        <CardDeck problems={filtered} />

        {/* ── 创始人的话 ──────────────────────────────── */}
        <div className="mt-28 mb-6">
          <div className="border-t border-white/[0.05] pt-14 max-w-xl mx-auto">
            <p className="text-[10px] text-white/20 font-semibold uppercase tracking-[0.22em] mb-6">
              创始人的话
            </p>
            <blockquote className="text-sm text-white/35 leading-[2.1] space-y-4">
              <p>
                我相信 AI 是这个时代最重要的力量——不是因为它酷，而是因为它第一次让普通人有能力解决原本只有大机构才能触碰的问题。
              </p>
              <p>
                但我注意到一件奇怪的事：有能力的人越来越多，世界的问题却好像没有变少。
              </p>
              <p>
                这个平台想做的事很简单：把世界上真实存在的问题，放到那些有能力解决它们的人面前。不宏大，不复杂。就是一张卡片，一个问题，一个也许会因此改变方向的人。
              </p>
            </blockquote>
            <p className="text-[10px] text-white/18 mt-6">—— 创始人</p>
          </div>
        </div>
      </main>

      {/* ══ Footer ══════════════════════════════════════════ */}
      <footer className="border-t border-white/[0.04] py-7">
        <div className="max-w-4xl mx-auto px-4 md:px-6 flex items-center justify-between">
          <span className="text-sm font-black text-white/20">未解</span>
          <span className="text-[11px] text-white/12">
            Unsolved · Problems Worth Building For
          </span>
        </div>
      </footer>

      {showSubmit && <SubmitModal onClose={() => setShowSubmit(false)} />}
    </div>
  );
}
