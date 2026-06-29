"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PROBLEMS, ALL_CATEGORIES, Category, Difficulty } from "@/lib/data";
import ProblemCard from "@/components/ProblemCard";
import CardDeck from "@/components/CardDeck";
import SubmitModal from "@/components/SubmitModal";

type SortMode = "热门" | "最新" | "随机";
const DIFFICULTY_OPTS: Difficulty[] = ["周末项目", "1-3个月", "需要团队"];

export default function Home() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory]     = useState<Category | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [sortMode, setSortMode]     = useState<SortMode>("热门");
  const [search, setSearch]         = useState("");
  const [showSubmit, setShowSubmit] = useState(false);
  const [activeNav, setActiveNav]   = useState<"discover" | "saved" | "profile">("discover");

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
          p.category.toLowerCase().includes(q)
      );
    }
    if (sortMode === "热门") return list.sort((a, b) => b.upvotes - a.upvotes);
    if (sortMode === "最新") return [...list].reverse();
    return list.sort(() => Math.random() - 0.5);
  }, [selectedCategory, selectedDifficulty, sortMode, search]);

  const activeFilterCount = [selectedCategory, selectedDifficulty].filter(Boolean).length;

  // ── Desktop layout ──────────────────────────────────────────────
  const DesktopLayout = () => (
    <div className="hidden md:flex min-h-screen flex-col bg-[#f8f9f8]">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-6">
          {/* Logo */}
          <button onClick={() => router.push("/")} className="shrink-0 font-black text-[17px] text-[#0e6b4a] tracking-tight">
            Unresolved
          </button>

          {/* Nav tabs */}
          <nav className="flex items-center gap-0.5">
            {(["Discover", "Categories", "Resources"] as const).map((tab) => (
              <button
                key={tab}
                className={`text-[13px] px-3.5 py-1.5 rounded-lg transition-colors ${
                  tab === "Discover"
                    ? "text-gray-900 font-medium bg-gray-100"
                    : "text-gray-400 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>

          {/* Search */}
          <div className="flex-1 max-w-xs relative ml-2">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
              width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="搜索问题..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-[13px] text-gray-700 placeholder-gray-300 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-[#0e6b4a] focus:bg-white transition-all"
            />
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={() => setShowSubmit(true)}
              className="text-[13px] font-semibold px-4 py-1.5 rounded-full bg-[#0e6b4a] text-white hover:bg-[#0a5a3d] transition-colors"
            >
              Submit Problem
            </button>
            <button className="text-[13px] text-gray-500 hover:text-gray-800 transition-colors">
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="bg-[#0e6b4a] text-white">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="max-w-2xl">
            <h1 className="text-[2.5rem] font-black leading-tight tracking-tight mb-4">
              找到值得你<br />全力以赴的那个问题
            </h1>
            <p className="text-[15px] text-white/70 mb-6 leading-relaxed">
              我们为了那些真正解决用户问题的方案。成功了一个特别的奋斗，一个一个逐步解决问题的开发者。
            </p>

            {/* Hero search */}
            <div className="relative max-w-lg">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="搜索、查看、发现更多..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-20 py-3.5 text-[14px] text-gray-900 bg-white rounded-2xl focus:outline-none shadow-lg"
              />
              <button
                onClick={() => {}}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#0e6b4a] text-white text-[13px] font-semibold px-4 py-1.5 rounded-xl"
              >
                搜索
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Body: Sidebar + Grid ── */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8 flex-1">

        {/* Sidebar */}
        <aside className="w-52 shrink-0">
          <div className="sticky top-20 space-y-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                Refine your search
              </p>

              {/* Filters arrow */}
              <div className="flex items-center gap-2 mb-4 text-[13px] text-gray-500">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
                </svg>
                筛选{activeFilterCount > 0 ? ` · ${activeFilterCount}` : ""}
              </div>

              {/* Difficulty */}
              <div className="mb-4">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Difficulty</p>
                <div className="space-y-1.5">
                  {(["Easy", "Medium", "Hard"] as const).map((d, i) => {
                    const opts = DIFFICULTY_OPTS;
                    const opt = opts[i];
                    return (
                      <label key={d} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedDifficulty === opt}
                          onChange={() => setSelectedDifficulty(selectedDifficulty === opt ? null : opt)}
                          className="w-3.5 h-3.5 rounded border-gray-300 accent-[#0e6b4a]"
                        />
                        <span className={`text-[13px] transition-colors ${selectedDifficulty === opt ? "text-[#0e6b4a] font-medium" : "text-gray-600 group-hover:text-gray-900"}`}>
                          {d}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Duration */}
              <div className="mb-4">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Duration</p>
                <div className="space-y-1.5">
                  {(["周末项目", "1-3个月"] as Difficulty[]).map((d) => (
                    <label key={d} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedDifficulty === d}
                        onChange={() => setSelectedDifficulty(selectedDifficulty === d ? null : d)}
                        className="w-3.5 h-3.5 rounded border-gray-300 accent-[#0e6b4a]"
                      />
                      <span className={`text-[13px] transition-colors ${selectedDifficulty === d ? "text-[#0e6b4a] font-medium" : "text-gray-600 group-hover:text-gray-900"}`}>
                        {d === "周末项目" ? "Weekend Project" : "1-3 Months"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="mb-4">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Categories</p>
                <div className="space-y-1.5">
                  {ALL_CATEGORIES.map((cat) => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedCategory === cat}
                        onChange={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                        className="w-3.5 h-3.5 rounded border-gray-300 accent-[#0e6b4a]"
                      />
                      <span className={`text-[13px] transition-colors ${selectedCategory === cat ? "text-[#0e6b4a] font-medium" : "text-gray-600 group-hover:text-gray-900"}`}>
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {activeFilterCount > 0 && (
                <button
                  onClick={() => { setSelectedCategory(null); setSelectedDifficulty(null); }}
                  className="text-[12px] text-gray-400 hover:text-[#0e6b4a] transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Sort bar */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-[13px] text-gray-500">
              {search.trim()
                ? `「${search}」找到 ${filtered.length} 个结果`
                : `共 ${filtered.length} 个问题`}
            </p>
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl overflow-hidden">
              {(["热门", "最新", "随机"] as SortMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSortMode(mode)}
                  className={`text-[12px] px-3 py-1.5 transition-all ${
                    sortMode === mode ? "bg-[#0e6b4a] text-white font-medium" : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Cards grid */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-300 gap-3">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <span className="text-sm text-gray-400">没有匹配的问题</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filtered.map((p, i) => (
                <ProblemCard key={p.id} problem={p} featured={i === filtered.length - 1 && filtered.length % 2 === 1} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 bg-white py-5 mt-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <span className="text-[13px] font-black text-[#0e6b4a]">Unresolved</span>
          <div className="flex items-center gap-5">
            {["About", "Contact", "Terms", "Privacy"].map((l) => (
              <button key={l} className="text-[12px] text-gray-400 hover:text-gray-700 transition-colors">{l}</button>
            ))}
          </div>
          <span className="text-[11px] text-gray-300">© 2024 Unresolved Platform</span>
        </div>
      </footer>
    </div>
  );

  // ── Mobile layout ──────────────────────────────────────────────
  const MobileLayout = () => (
    <div className="flex md:hidden flex-col min-h-screen bg-[#f0f4f2]">
      {/* Mobile Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <span className="font-black text-[16px] text-[#0e6b4a]">Unresolved</span>
        <div className="flex items-center gap-3">
          <button className="w-8 h-8 flex items-center justify-center text-gray-400">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </button>
          <button className="w-8 h-8 flex items-center justify-center text-gray-400">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>
        </div>
      </header>

      {/* Card swipe area */}
      <main className="flex-1 px-4 pt-4 pb-2">
        <div className="text-center mb-4">
          <h2 className="font-bold text-[16px] text-gray-900">寻找灵感</h2>
          <p className="text-[12px] text-gray-400">左右滑动探索市场真实痛点</p>
        </div>
        <CardDeck problems={filtered} />
      </main>

      {/* Bottom navigation */}
      <nav className="bg-white border-t border-gray-100 px-6 py-3 flex items-center justify-around">
        {(["discover", "saved", "profile"] as const).map((nav) => {
          const icons = {
            discover: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
            saved:    <path d="M12 17.75l-6.172 3.245 1.179-6.873-4.993-4.867 6.9-1.002L12 2l3.086 6.253 6.9 1.002-4.993 4.867 1.179 6.873z" />,
            profile:  <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
          };
          const labels = { discover: "探索", saved: "星", profile: "我的" };
          const active = activeNav === nav;
          return (
            <button
              key={nav}
              onClick={() => setActiveNav(nav)}
              className="flex flex-col items-center gap-1"
            >
              <svg
                width="22" height="22" viewBox="0 0 24 24"
                fill={active ? "#0e6b4a" : "none"}
                stroke={active ? "#0e6b4a" : "#9ca3af"}
                strokeWidth="2"
              >
                {icons[nav]}
              </svg>
              <span className={`text-[10px] font-medium ${active ? "text-[#0e6b4a]" : "text-gray-400"}`}>
                {labels[nav]}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      <DesktopLayout />
      <MobileLayout />
      {showSubmit && <SubmitModal onClose={() => setShowSubmit(false)} />}
    </>
  );
}
