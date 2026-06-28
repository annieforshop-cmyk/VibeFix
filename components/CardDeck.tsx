"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Problem } from "@/lib/data";
import ProblemCardFull from "@/components/ProblemCardFull";

export default function CardDeck({ problems }: { problems: Problem[] }) {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [dir, setDir] = useState<"left" | "right">("left");
  const [busy, setBusy] = useState(false);

  const touchStartX = useRef(0);
  const touchStartTime = useRef(0);

  // 重置到第一张（当 problems 列表变化时）
  useEffect(() => {
    setCurrent(0);
    setPrev(null);
    setBusy(false);
  }, [problems]);

  const navigate = useCallback(
    (next: number) => {
      if (busy || next < 0 || next >= problems.length) return;
      setDir(next > current ? "left" : "right");
      setPrev(current);
      setCurrent(next);
      setBusy(true);
      const t = setTimeout(() => {
        setPrev(null);
        setBusy(false);
      }, 320);
      return () => clearTimeout(t);
    },
    [busy, current, problems.length]
  );

  // 键盘左右导航
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") navigate(current + 1);
      if (e.key === "ArrowLeft") navigate(current - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, navigate]);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchStartTime.current = Date.now();
  }

  function onTouchEnd(e: React.TouchEvent) {
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    const dt = Date.now() - touchStartTime.current;
    if (Math.abs(dx) > 45 && dt < 500) {
      navigate(dx > 0 ? current + 1 : current - 1);
    }
  }

  if (problems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-28 gap-3 text-white/25">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <span className="text-sm">没有匹配的问题</span>
      </div>
    );
  }

  const exitClass = dir === "left" ? "card-exit-left" : "card-exit-right";
  const enterClass = dir === "left" ? "card-enter-right" : "card-enter-left";

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      {/* ── 卡片区域 + 左右箭头 ────────────────────── */}
      <div className="w-full flex items-center gap-3 md:gap-4">
        {/* 上一张 */}
        <button
          onClick={() => navigate(current - 1)}
          disabled={current === 0 || busy}
          className="hidden md:flex shrink-0 w-9 h-9 items-center justify-center rounded-full bg-white/[0.04] border border-white/[0.07] text-white/30 hover:bg-white/[0.08] hover:text-white/60 disabled:opacity-15 disabled:cursor-not-allowed transition-all"
          aria-label="上一个"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* 卡片容器：overflow-hidden 裁切动画出界部分 */}
        <div
          className="flex-1 relative overflow-hidden rounded-3xl"
          style={{ minHeight: 500 }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* 离场卡片（绝对覆盖） */}
          {busy && prev !== null && (
            <div className={`absolute inset-0 z-10 ${exitClass}`}>
              <ProblemCardFull problem={problems[prev]} index={prev} />
            </div>
          )}
          {/* 进场 / 当前卡片 */}
          <div className={busy ? `relative z-20 ${enterClass}` : ""}>
            <ProblemCardFull problem={problems[current]} index={current} />
          </div>
        </div>

        {/* 下一张 */}
        <button
          onClick={() => navigate(current + 1)}
          disabled={current === problems.length - 1 || busy}
          className="hidden md:flex shrink-0 w-9 h-9 items-center justify-center rounded-full bg-white/[0.04] border border-white/[0.07] text-white/30 hover:bg-white/[0.08] hover:text-white/60 disabled:opacity-15 disabled:cursor-not-allowed transition-all"
          aria-label="下一个"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* ── 圆点导航 ───────────────────────────────── */}
      <div className="flex items-center gap-1.5">
        {problems.map((_, i) => (
          <button
            key={i}
            onClick={() => navigate(i)}
            aria-label={`第 ${i + 1} 个`}
            className={`rounded-full transition-all duration-200 ${
              i === current
                ? "w-5 h-1.5 bg-indigo-400/70"
                : "w-1.5 h-1.5 bg-white/15 hover:bg-white/35"
            }`}
          />
        ))}
      </div>

      {/* ── 计数 ───────────────────────────────────── */}
      <p className="text-[11px] text-white/20 tracking-[0.15em] tabular-nums">
        {String(current + 1).padStart(2, "0")} / {String(problems.length).padStart(2, "0")}
      </p>
    </div>
  );
}
