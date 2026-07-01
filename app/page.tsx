"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ALL_CATEGORIES, Category, Difficulty, Problem } from "@/lib/data";
import ProblemCard from "@/components/ProblemCard";
import CardDeck from "@/components/CardDeck";
import SubmitModal from "@/components/SubmitModal";

type SortMode = "热门" | "最新" | "随机";
type ViewMode = "card" | "grid";
type NavTab = "discover" | "saved" | "profile";

const DIFFICULTY_OPTS: Difficulty[] = ["周末项目", "1-3个月", "需要团队"];

function collectedKey(id: string) {
  return `vibefix_collected_${id}`;
}

const CAT_EMOJI: Record<string, string> = {
  效率工具: "⚡",
  创作者:   "🎨",
  学习成长: "📚",
  小生意:   "💼",
  自由职业: "🖥️",
  本地生活: "📍",
  社交连接: "🤝",
  个人财务: "💰",
  宠物生活: "🐾",
  健身健康: "💪",
};

const CAT_BG: Record<string, string> = {
  效率工具: "bg-blue-50",
  创作者:   "bg-pink-50",
  学习成长: "bg-emerald-50",
  小生意:   "bg-amber-50",
  自由职业: "bg-violet-50",
  本地生活: "bg-orange-50",
  社交连接: "bg-cyan-50",
  个人财务: "bg-lime-50",
  宠物生活: "bg-rose-50",
  健身健康: "bg-teal-50",
};

function MobileGridCard({ problem }: { problem: Problem }) {
  const [saved, setSaved] = useState(
    () => typeof window !== "undefined" && window.localStorage.getItem(collectedKey(problem.id)) === "1"
  );

  async function handleSave(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    const next = !saved;
    setSaved(next);
    try {
      const res = await fetch(`/api/problems/${problem.id}/collect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collected: saved }),
      });
      if (res.ok) {
        const data = await res.json();
        window.localStorage.setItem(collectedKey(problem.id), data.collected ? "1" : "0");
        setSaved(!!data.collected);
      }
    } catch {
      // best-effort — keep optimistic local state on network failure
    }
  }

  return (
    <div className="relative text-left bg-white border border-gray-100 rounded-2xl p-3.5 hover:border-[#0e6b4a]/30 hover:shadow-sm transition-all active:scale-95">
      <Link href={`/problems/${problem.id}`} className="absolute inset-0 z-0 rounded-2xl" aria-label={problem.title} />
      <div className="flex items-center gap-1 mb-2 flex-wrap">
        {problem.upvotes >= 800 && (
          <span className="text-[9px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full">🔥</span>
        )}
        <span className="text-[9px] text-gray-400 ml-auto flex items-center gap-0.5">
          <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          {problem.upvotes >= 1000 ? `${(problem.upvotes / 1000).toFixed(1)}k` : problem.upvotes}
        </span>
        <button
          onClick={handleSave}
          aria-label={saved ? "取消收藏" : "收藏"}
          className={`relative z-10 w-5 h-5 flex items-center justify-center rounded-full transition-colors ${saved ? "text-[#0e6b4a]" : "text-gray-300 hover:text-gray-400"}`}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M12 17.75l-6.172 3.245 1.179-6.873-4.993-4.867 6.9-1.002L12 2l3.086 6.253 6.9 1.002-4.993 4.867 1.179 6.873z" />
          </svg>
        </button>
      </div>
      <h3 className="text-[12px] font-bold text-gray-900 leading-snug line-clamp-3 mb-2">{problem.title}</h3>
      <div className="flex items-center justify-between">
        <span className="text-[9px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{problem.category}</span>
        <span className="text-[9px] text-[#0e6b4a] font-medium">详情 →</span>
      </div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory]     = useState<Category | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [sortMode, setSortMode]     = useState<SortMode>("热门");
  const [search, setSearch]         = useState("");
  const [viewMode, setViewMode]     = useState<ViewMode>("grid");
  const [showSubmit, setShowSubmit] = useState(false);
  const [activeNav, setActiveNav]   = useState<NavTab>("discover");
  const [showSearch, setShowSearch] = useState(false);
  const [problems, setProblems]     = useState<Problem[]>([]);
  const [loading, setLoading]       = useState(true);
  const [savedIds, setSavedIds]     = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    fetch("/api/problems?limit=100&sort=hot")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const items: Problem[] = data.items ?? [];
        setProblems(items);
        setSavedIds(new Set(items.filter((p) => window.localStorage.getItem(collectedKey(p.id)) === "1").map((p) => p.id)));
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    let list = [...problems];
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
  }, [problems, selectedCategory, selectedDifficulty, sortMode, search]);

  const hotProblems = useMemo(
    () => [...problems].sort((a, b) => b.upvotes - a.upvotes).slice(0, 5),
    [problems]
  );

  function refreshSavedIds() {
    setSavedIds(
      new Set(problems.filter((p) => window.localStorage.getItem(collectedKey(p.id)) === "1").map((p) => p.id))
    );
  }

  function handleNavClick(nav: NavTab) {
    if (nav === "saved") refreshSavedIds();
    setActiveNav(nav);
  }

  const savedProblems = useMemo(() => problems.filter((p) => savedIds.has(p.id)), [problems, savedIds]);

  function handleCategoryClick(cat: Category) {
    setSelectedCategory(selectedCategory === cat ? null : cat);
    // scroll to problems section
    document.getElementById("problems-section")?.scrollIntoView({ behavior: "smooth" });
  }

  // ── Desktop layout ─────────────────────────────────────────────
  const DesktopLayout = () => (
    <div className="hidden md:flex min-h-screen flex-col bg-[#f8f9f8]">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-6">
          <button onClick={() => router.push("/")} className="shrink-0 font-black text-[17px] text-[#0e6b4a] tracking-tight">
            VibeFix
          </button>
          <nav className="flex items-center gap-0.5">
            <button onClick={() => router.push("/")} className="text-[13px] px-3.5 py-1.5 rounded-lg transition-colors text-gray-900 font-medium bg-gray-100">
              Discover
            </button>
            <button
              onClick={() => document.getElementById("categories-filter")?.scrollIntoView({ behavior: "smooth", block: "start" })}
              className="text-[13px] px-3.5 py-1.5 rounded-lg transition-colors text-gray-400 hover:text-gray-700"
            >
              Categories
            </button>
          </nav>
          <div className="flex-1 max-w-xs relative ml-2">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input type="text" placeholder="搜索问题..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-[13px] text-gray-700 placeholder-gray-300 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-[#0e6b4a] focus:bg-white transition-all" />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button onClick={() => setShowSubmit(true)} className="text-[13px] font-semibold px-4 py-1.5 rounded-full bg-[#0e6b4a] text-white hover:bg-[#0a5a3d] transition-colors">
              Submit Problem
            </button>
            <button className="text-[13px] text-gray-500 hover:text-gray-800 transition-colors">Sign In</button>
          </div>
        </div>
      </header>

      <section className="bg-[#0e6b4a] text-white">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="max-w-2xl">
            <h1 className="text-[2.5rem] font-black leading-tight tracking-tight mb-4">找到值得你<br />全力以赴的那个问题</h1>
            <p className="text-[15px] text-white/70 mb-6 leading-relaxed">每一张卡片，一个细分痛点，一个可以动手的方向。</p>
            <div className="relative max-w-lg">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input type="text" placeholder="搜索、查看、发现更多..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 text-[14px] text-gray-900 bg-white rounded-2xl focus:outline-none shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8 flex-1">
        <aside className="w-52 shrink-0">
          <div className="sticky top-20 space-y-5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Refine your search</p>
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Difficulty</p>
              <div className="space-y-1.5">
                {DIFFICULTY_OPTS.map((d) => (
                  <label key={d} className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" checked={selectedDifficulty === d} onChange={() => setSelectedDifficulty(selectedDifficulty === d ? null : d)} className="w-3.5 h-3.5 rounded border-gray-300 accent-[#0e6b4a]" />
                    <span className={`text-[13px] ${selectedDifficulty === d ? "text-[#0e6b4a] font-medium" : "text-gray-600"}`}>{d}</span>
                  </label>
                ))}
              </div>
            </div>
            <div id="categories-filter" className="scroll-mt-20">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Categories</p>
              <div className="space-y-1.5">
                {ALL_CATEGORIES.map((cat) => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" checked={selectedCategory === cat} onChange={() => setSelectedCategory(selectedCategory === cat ? null : cat)} className="w-3.5 h-3.5 rounded border-gray-300 accent-[#0e6b4a]" />
                    <span className={`text-[13px] ${selectedCategory === cat ? "text-[#0e6b4a] font-medium" : "text-gray-600"}`}>{cat}</span>
                  </label>
                ))}
              </div>
            </div>
            {(selectedCategory || selectedDifficulty) && (
              <button onClick={() => { setSelectedCategory(null); setSelectedDifficulty(null); }} className="text-[12px] text-gray-400 hover:text-[#0e6b4a] transition-colors">
                Clear All Filters
              </button>
            )}
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-5">
            <p className="text-[13px] text-gray-500">{search.trim() ? `「${search}」找到 ${filtered.length} 个结果` : `共 ${filtered.length} 个问题`}</p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl overflow-hidden">
                {(["热门", "最新", "随机"] as SortMode[]).map((mode) => (
                  <button key={mode} onClick={() => setSortMode(mode)} className={`text-[12px] px-3 py-1.5 transition-all ${sortMode === mode ? "bg-[#0e6b4a] text-white font-medium" : "text-gray-500 hover:text-gray-800"}`}>{mode}</button>
                ))}
              </div>
            </div>
          </div>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-300 gap-3">
              <span className="text-sm text-gray-400">加载中...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-300 gap-3">
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

      <footer className="border-t border-gray-100 bg-white py-5 mt-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <span className="text-[13px] font-black text-[#0e6b4a]">VibeFix</span>
          <div className="flex items-center gap-5">
            <Link href="/about" className="text-[12px] text-gray-400 hover:text-gray-700 transition-colors">About</Link>
            <Link href="/about#contact" className="text-[12px] text-gray-400 hover:text-gray-700 transition-colors">Contact</Link>
            <Link href="/about#terms" className="text-[12px] text-gray-400 hover:text-gray-700 transition-colors">Terms</Link>
            <Link href="/about#privacy" className="text-[12px] text-gray-400 hover:text-gray-700 transition-colors">Privacy</Link>
          </div>
          <span className="text-[11px] text-gray-300">© 2026 VibeFix</span>
        </div>
      </footer>
    </div>
  );

  // ── Mobile layout ──────────────────────────────────────────────
  const MobileLayout = () => (
    <div className="flex md:hidden flex-col min-h-screen bg-[#f4f6f4]">

      {/* ── 顶部 Header ── */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <button onClick={() => setActiveNav("discover")} className="font-black text-[17px] text-[#0e6b4a]">VibeFix</button>
        <div className="flex items-center gap-2">
          {showSearch ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                type="text"
                placeholder="搜索问题..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-40 text-[13px] border border-gray-200 rounded-full px-3 py-1 focus:outline-none focus:border-[#0e6b4a]"
              />
              <button onClick={() => { setShowSearch(false); setSearch(""); }} className="text-gray-400 text-[12px]">取消</button>
            </div>
          ) : (
            <>
              <button onClick={() => setShowSearch(true)} className="w-8 h-8 flex items-center justify-center text-gray-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
              </button>
              <button onClick={() => setShowSubmit(true)} className="w-8 h-8 flex items-center justify-center text-gray-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
            </>
          )}
        </div>
      </header>

      {/* ── 可滚动主体 ── */}
      <main className="flex-1 overflow-y-auto" style={{ paddingBottom: "calc(5rem + env(safe-area-inset-bottom))" }}>
      {activeNav === "discover" && (
      <>
        {/* ① Hero */}
        <section className="bg-[#0e6b4a] px-5 pt-7 pb-8">
          <p className="text-[11px] font-bold text-white/50 uppercase tracking-widest mb-2">为独立开发者精选</p>
          <h1 className="text-[24px] font-black text-white leading-tight tracking-tight mb-1">
            找到值得你<br />全力以赴的问题
          </h1>
          <p className="text-[13px] text-white/60 mb-5">每张卡片，一个可以动手的方向</p>

          {/* Stats chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1.5">
              <span className="text-white font-bold text-[13px]">{problems.length}</span>
              <span className="text-white/70 text-[11px]">个问题</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1.5">
              <span className="text-white font-bold text-[13px]">{problems.filter(p => p.difficulty === "周末项目").length}</span>
              <span className="text-white/70 text-[11px]">周末可做</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1.5">
              <span className="text-white font-bold text-[13px]">{ALL_CATEGORIES.length}</span>
              <span className="text-white/70 text-[11px]">个场景</span>
            </div>
          </div>
        </section>

        {/* ② 热门精选 */}
        <section className="pt-6 pb-2">
          <div className="px-4 flex items-center justify-between mb-3">
            <div>
              <h2 className="text-[15px] font-bold text-gray-900">🔥 热门精选</h2>
              <p className="text-[11px] text-gray-400">最多人关注的问题</p>
            </div>
            <button className="text-[12px] text-[#0e6b4a] font-medium">查看全部</button>
          </div>

          <div className="flex gap-3 px-4 overflow-x-auto scrollbar-hide pb-2">
            {hotProblems.map((p) => (
              <button
                key={p.id}
                onClick={() => router.push(`/problems/${p.id}`)}
                className="shrink-0 w-[220px] bg-white rounded-2xl p-4 text-left border border-gray-100 hover:border-[#0e6b4a]/30 transition-all active:scale-95"
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">🔥 HOT</span>
                  <span className="text-[10px] text-gray-400 ml-auto flex items-center gap-0.5">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    {p.upvotes.toLocaleString()}
                  </span>
                </div>
                <h3 className="text-[13px] font-bold text-gray-900 leading-snug line-clamp-2 mb-2">{p.title}</h3>
                <p className="text-[11px] text-gray-400 line-clamp-2">{p.description}</p>
              </button>
            ))}
          </div>
        </section>

        {/* ③ 按分类浏览 */}
        <section className="px-4 pt-5 pb-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-[15px] font-bold text-gray-900">按场景浏览</h2>
              <p className="text-[11px] text-gray-400">选择你感兴趣的方向</p>
            </div>
            {selectedCategory && (
              <button onClick={() => setSelectedCategory(null)} className="text-[12px] text-gray-400 border border-gray-200 rounded-full px-2.5 py-1">
                清除
              </button>
            )}
          </div>

          <div className="grid grid-cols-5 gap-2">
            {ALL_CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all active:scale-95 ${
                    active ? "bg-[#0e6b4a] shadow-sm shadow-green-200" : `${CAT_BG[cat] ?? "bg-gray-50"}`
                  }`}
                >
                  <span className="text-[20px] leading-none">{CAT_EMOJI[cat]}</span>
                  <span className={`text-[9px] font-medium leading-tight text-center ${active ? "text-white" : "text-gray-500"}`}>
                    {cat}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ④ 探索问题 */}
        <section id="problems-section" className="px-4 pt-5">
          {/* Section header + view toggle */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-[15px] font-bold text-gray-900">
                {selectedCategory ? `${CAT_EMOJI[selectedCategory]} ${selectedCategory}` : "探索全部"}
              </h2>
              <p className="text-[11px] text-gray-400">{filtered.length} 个问题</p>
            </div>

            <div className="flex items-center gap-2">
              {/* Sort */}
              <select
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as SortMode)}
                className="text-[12px] text-gray-500 border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none"
              >
                <option value="热门">热门</option>
                <option value="最新">最新</option>
                <option value="随机">随机</option>
              </select>

              {/* View toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode("card")}
                  className={`w-7 h-7 flex items-center justify-center rounded-md transition-all ${viewMode === "card" ? "bg-white shadow-sm text-[#0e6b4a]" : "text-gray-400"}`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`w-7 h-7 flex items-center justify-center rounded-md transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-[#0e6b4a]" : "text-gray-400"}`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Difficulty filter pills */}
          <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1">
            {DIFFICULTY_OPTS.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDifficulty(selectedDifficulty === d ? null : d)}
                className={`shrink-0 text-[11px] font-medium px-3 py-1.5 rounded-full transition-all ${
                  selectedDifficulty === d
                    ? "bg-[#0e6b4a] text-white"
                    : "bg-white text-gray-500 border border-gray-200"
                }`}
              >
                {d}
              </button>
            ))}
            {(selectedCategory || selectedDifficulty) && (
              <button
                onClick={() => { setSelectedCategory(null); setSelectedDifficulty(null); }}
                className="shrink-0 text-[11px] text-gray-400 px-3 py-1.5 rounded-full border border-dashed border-gray-200"
              >
                清除筛选
              </button>
            )}
          </div>

          {/* Card swipe mode */}
          {viewMode === "card" && (
            <div className="pb-6">
              <CardDeck problems={filtered} />
            </div>
          )}

          {/* Grid mode */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-2 gap-3 pb-6">
              {loading ? (
                <div className="col-span-2 flex flex-col items-center py-16 text-gray-300 gap-2">
                  <span className="text-sm text-gray-400">加载中...</span>
                </div>
              ) : filtered.length === 0 ? (
                <div className="col-span-2 flex flex-col items-center py-16 text-gray-300 gap-2">
                  <span className="text-3xl">🔍</span>
                  <span className="text-sm text-gray-400">没有匹配的问题</span>
                </div>
              ) : (
                filtered.map((p) => <MobileGridCard key={p.id} problem={p} />)
              )}
            </div>
          )}
        </section>
      </>
      )}

      {activeNav === "saved" && (
        <section className="px-4 pt-5 pb-8">
          <h2 className="text-[15px] font-bold text-gray-900 mb-1">⭐ 我的收藏</h2>
          <p className="text-[11px] text-gray-400 mb-4">{savedProblems.length} 个已收藏的问题</p>
          {savedProblems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-300 gap-3">
              <span className="text-3xl">⭐</span>
              <span className="text-sm text-gray-400">还没有收藏的问题</span>
              <button
                onClick={() => setActiveNav("discover")}
                className="mt-2 text-[12px] font-semibold px-4 py-2 rounded-full bg-[#0e6b4a] text-white active:scale-95 transition-all"
              >
                去探索
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {savedProblems.map((p) => <MobileGridCard key={p.id} problem={p} />)}
            </div>
          )}
        </section>
      )}

      {activeNav === "profile" && (
        <section className="px-4 pt-6 pb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-[#0e6b4a] flex items-center justify-center text-white font-black text-lg shrink-0">V</div>
            <div>
              <p className="text-[15px] font-bold text-gray-900">VibeFix 探索者</p>
              <p className="text-[11px] text-gray-400">{savedProblems.length} 个收藏 · {problems.length} 个问题库</p>
            </div>
          </div>

          <button
            onClick={() => setShowSubmit(true)}
            className="w-full mb-6 flex items-center justify-center gap-2 text-[13px] font-semibold py-3 rounded-2xl bg-[#0e6b4a] text-white active:scale-95 transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
            提交一个问题
          </button>

          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden mb-6">
            {[
              { label: "关于 VibeFix", href: "/about" },
              { label: "联系我们", href: "/about#contact" },
              { label: "服务条款", href: "/about#terms" },
              { label: "隐私政策", href: "/about#privacy" },
            ].map((item, i, arr) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3.5 text-[13px] text-gray-700 active:bg-gray-50 transition-colors ${i !== arr.length - 1 ? "border-b border-gray-50" : ""}`}
              >
                {item.label}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300"><path d="M9 18l6-6-6-6" /></svg>
              </Link>
            ))}
          </div>

          <div className="bg-[#0e6b4a] rounded-2xl p-5">
            <p className="text-[11px] font-bold text-white/50 uppercase tracking-widest mb-2">我们的愿景</p>
            <p className="text-[14px] text-white leading-relaxed">
              让每一个愿意行动的人，都能找到一个值得他全力以赴的方向。
            </p>
            <Link href="/about#vision" className="inline-block mt-3 text-[12px] text-white/70 underline">
              阅读完整愿景 →
            </Link>
          </div>
        </section>
      )}
      </main>

      {/* ── 底部导航 ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 pt-2 flex items-center justify-around z-40 md:hidden"
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      >
        {(["discover", "saved", "profile"] as NavTab[]).map((nav) => {
          const icons: Record<NavTab, React.ReactNode> = {
            discover: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
            saved:    <path d="M12 17.75l-6.172 3.245 1.179-6.873-4.993-4.867 6.9-1.002L12 2l3.086 6.253 6.9 1.002-4.993 4.867 1.179 6.873z" />,
            profile:  <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
          };
          const labels: Record<NavTab, string> = { discover: "探索", saved: "收藏", profile: "我的" };
          const active = activeNav === nav;
          return (
            <button key={nav} onClick={() => handleNavClick(nav)} className="flex flex-col items-center gap-0.5 py-1">
              <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "#0e6b4a" : "none"} stroke={active ? "#0e6b4a" : "#9ca3af"} strokeWidth="2">
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
