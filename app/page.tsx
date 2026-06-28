"use client";

import { useState, useMemo } from "react";
import { PROBLEMS, ALL_CATEGORIES, Category, Difficulty } from "@/lib/data";
import CardDeck from "@/components/CardDeck";
import SubmitModal from "@/components/SubmitModal";

type SortMode = "热门" | "最新" | "随机";
const DIFFICULTY_OPTS: Difficulty[] = ["周末项目", "1-3个月", "需要团队"];

export default function Home() {
  const [selectedCategory, setSelectedCategory]   = useState<Category | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [sortMode, setSortMode]   = useState<SortMode>("热门");
  const [search, setSearch]       = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showSubmit, setShowSubmit]   = useState(false);

  const filtered = useMemo(() => {
    let list = [...PROBLEMS];
    if (selectedCategory)   list = list.filter((p) => p.category === selectedCategory);
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

  const activeFilterCount = [selectedCategory, selectedDifficulty].filter(Boolean).length;

  return (
    <div className="min-h-screen" style={{ background: "#09090F", color: "#F0F0F5" }}>

      {/* ══ Header ══════════════════════════════════════════ */}
      <header
        className="sticky top-0 z-40 backdrop-blur-xl"
        style={{
          background: "rgba(9,9,15,0.85)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 md:px-8 h-14 flex items-center gap-3">

          {/* Logo */}
          <div className="shrink-0 flex items-center gap-2">
            <span className="text-[15px] font-black tracking-tight text-white">未解</span>
            <span className="hidden sm:inline text-[11px] text-white/18 tracking-widest">Wèi Jiě</span>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-[260px] relative ml-2">
            <svg
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/20"
              width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="搜索问题..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-[13px] text-white/70 placeholder-white/18 focus:outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.045)",
                border: "1px solid rgba(255,255,255,0.065)",
                borderRadius: "0.875rem",
              }}
              onFocus={(e) => {
                e.target.style.background = "rgba(255,255,255,0.07)";
                e.target.style.borderColor = "rgba(255,255,255,0.13)";
              }}
              onBlur={(e) => {
                e.target.style.background = "rgba(255,255,255,0.045)";
                e.target.style.borderColor = "rgba(255,255,255,0.065)";
              }}
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* 排序 — 三个 pill，横排在 header */}
            <div className="hidden sm:flex items-center rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.06)" }}>
              {(["热门", "最新", "随机"] as SortMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSortMode(mode)}
                  className="text-[12px] px-3 py-1.5 transition-all duration-150"
                  style={{
                    color: sortMode === mode ? "#F0F0F5" : "rgba(255,255,255,0.28)",
                    background: sortMode === mode ? "rgba(136,117,248,0.16)" : "transparent",
                  }}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* 筛选 */}
            <button
              onClick={() => setShowFilters((f) => !f)}
              className="flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-xl transition-all duration-150"
              style={{
                background: showFilters || activeFilterCount > 0 ? "rgba(136,117,248,0.13)" : "rgba(255,255,255,0.035)",
                border: showFilters || activeFilterCount > 0 ? "1px solid rgba(136,117,248,0.25)" : "1px solid rgba(255,255,255,0.06)",
                color: showFilters || activeFilterCount > 0 ? "#A594FF" : "rgba(255,255,255,0.30)",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
              </svg>
              筛选{activeFilterCount > 0 ? ` · ${activeFilterCount}` : ""}
            </button>

            {/* 提交 */}
            <button
              onClick={() => setShowSubmit(true)}
              className="text-[12px] font-semibold px-3.5 py-1.5 rounded-xl text-white transition-all duration-150 hover:opacity-85 active:scale-95"
              style={{ background: "#8875F8" }}
            >
              提交
            </button>
          </div>
        </div>

        {/* 筛选面板 */}
        {showFilters && (
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="max-w-5xl mx-auto px-4 md:px-8 py-4 space-y-3">
              {/* 分类 */}
              <div className="flex flex-wrap gap-1.5">
                {ALL_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                    className="text-[12px] px-3 py-1.5 rounded-full transition-all duration-150"
                    style={
                      selectedCategory === cat
                        ? { background: "rgba(136,117,248,0.15)", border: "1px solid rgba(136,117,248,0.3)", color: "#A594FF" }
                        : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.35)" }
                    }
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* 难度 */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-white/20 mr-0.5">难度</span>
                  {DIFFICULTY_OPTS.map((d) => (
                    <button
                      key={d}
                      onClick={() => setSelectedDifficulty(selectedDifficulty === d ? null : d)}
                      className="text-[12px] px-3 py-1.5 rounded-full transition-all duration-150"
                      style={
                        selectedDifficulty === d
                          ? { background: "rgba(136,117,248,0.15)", border: "1px solid rgba(136,117,248,0.3)", color: "#A594FF" }
                          : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.35)" }
                      }
                    >
                      {d}
                    </button>
                  ))}
                </div>

                {/* 移动端排序 */}
                <div className="flex sm:hidden items-center gap-1">
                  <span className="text-[11px] text-white/20 mr-0.5">排序</span>
                  {(["热门", "最新", "随机"] as SortMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setSortMode(mode)}
                      className="text-[12px] px-2.5 py-1.5 rounded-full transition-all"
                      style={{
                        color: sortMode === mode ? "#F0F0F5" : "rgba(255,255,255,0.28)",
                        background: sortMode === mode ? "rgba(255,255,255,0.08)" : "transparent",
                      }}
                    >
                      {mode}
                    </button>
                  ))}
                </div>

                {activeFilterCount > 0 && (
                  <button
                    onClick={() => { setSelectedCategory(null); setSelectedDifficulty(null); }}
                    className="ml-auto text-[11px] transition-colors duration-150"
                    style={{ color: "rgba(255,255,255,0.22)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.50)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.22)")}
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
      <main className="max-w-5xl mx-auto px-4 md:px-8 pt-10 pb-16">

        {/* ── Hero ─────────────────────────────────────────── */}
        <div className="mb-10">
          {/* 顶部小标签 */}
          <p
            className="text-[10px] font-bold uppercase tracking-[0.25em] mb-4"
            style={{ color: "rgba(255,255,255,0.22)" }}
          >
            为独立开发者整理的真实待解问题
          </p>

          {/* 主标题 */}
          <h1
            className="font-black tracking-[-0.03em] leading-[1.15] mb-4"
            style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "#F0F0F5" }}
          >
            找到值得你
            <span style={{ color: "#A594FF" }}> 全力以赴 </span>
            的那个问题
          </h1>

          {/* 副标题 + 统计 — 同一行 */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 sm:justify-between">
            <p className="text-[14px] leading-relaxed" style={{ color: "rgba(255,255,255,0.30)" }}>
              每一张卡片，一个细分痛点，一个可以动手的方向
            </p>

            <div className="flex items-center gap-4">
              <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.22)" }}>
                <strong className="font-semibold" style={{ color: "rgba(255,255,255,0.45)" }}>
                  {PROBLEMS.length}
                </strong>{" "}个问题
              </span>
              <span style={{ color: "rgba(255,255,255,0.08)" }}>·</span>
              <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.22)" }}>
                <strong className="font-semibold" style={{ color: "#34D399" }}>
                  {PROBLEMS.filter((p) => p.difficulty === "周末项目").length}
                </strong>{" "}个周末可做
              </span>
              <span style={{ color: "rgba(255,255,255,0.08)" }}>·</span>
              <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.22)" }}>
                <strong className="font-semibold" style={{ color: "rgba(255,255,255,0.45)" }}>10</strong>{" "}个场景
              </span>
            </div>
          </div>

          {/* 搜索结果提示 */}
          {search.trim() && (
            <p className="mt-3 text-[12px]" style={{ color: "rgba(255,255,255,0.25)" }}>
              「{search}」找到{" "}
              <strong className="font-semibold" style={{ color: "rgba(255,255,255,0.50)" }}>
                {filtered.length}
              </strong>{" "}个结果
            </p>
          )}
        </div>

        {/* ── Card Deck ─────────────────────────────────────── */}
        <CardDeck problems={filtered} />

        {/* ── 创始人的话 ──────────────────────────────────── */}
        <div className="mt-28">
          <div
            className="max-w-xl mx-auto pt-12"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            <p
              className="text-[10px] font-bold uppercase tracking-[0.22em] mb-7"
              style={{ color: "rgba(255,255,255,0.18)" }}
            >
              创始人的话
            </p>
            <blockquote className="space-y-5">
              <p className="text-[14px] leading-[2.0]" style={{ color: "rgba(255,255,255,0.30)" }}>
                我相信 AI 是这个时代最重要的力量——不是因为它酷，而是因为它第一次让普通人有能力解决原本只有大机构才能触碰的问题。
              </p>
              <p className="text-[14px] leading-[2.0]" style={{ color: "rgba(255,255,255,0.30)" }}>
                但我注意到一件奇怪的事：有能力的人越来越多，世界的问题却好像没有变少。
              </p>
              <p className="text-[14px] leading-[2.0]" style={{ color: "rgba(255,255,255,0.30)" }}>
                这个平台想做的事很简单：把世界上真实存在的问题，放到那些有能力解决它们的人面前。不宏大，不复杂。就是一张卡片，一个问题，一个也许会因此改变方向的人。
              </p>
            </blockquote>
            <p className="mt-6 text-[11px]" style={{ color: "rgba(255,255,255,0.15)" }}>—— 创始人</p>
          </div>
        </div>
      </main>

      {/* ══ Footer ══════════════════════════════════════════ */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }} className="py-7">
        <div className="max-w-5xl mx-auto px-4 md:px-8 flex items-center justify-between">
          <span className="text-sm font-black" style={{ color: "rgba(255,255,255,0.18)" }}>未解</span>
          <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.10)" }}>
            Unsolved · Problems Worth Building For
          </span>
        </div>
      </footer>

      {showSubmit && <SubmitModal onClose={() => setShowSubmit(false)} />}
    </div>
  );
}
