"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Problem } from "@/lib/data";
import ProblemCardFull from "@/components/ProblemCardFull";

export default function CardDeck({ problems }: { problems: Problem[] }) {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [dir, setDir] = useState<"left" | "right">("left");
  const [busy, setBusy] = useState(false);

  // 拖拽状态
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const pointerStartX = useRef(0);
  const pointerStartTime = useRef(0);
  const touchStartX = useRef(0);
  const touchStartTime = useRef(0);

  useEffect(() => {
    setCurrent(0);
    setPrev(null);
    setBusy(false);
    setDragX(0);
    setDragging(false);
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
      }, 380);
      return () => clearTimeout(t);
    },
    [busy, current, problems.length]
  );

  // 键盘导航
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") navigate(current + 1);
      if (e.key === "ArrowLeft")  navigate(current - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, navigate]);

  // 鼠标拖拽
  function onPointerDown(e: React.PointerEvent) {
    if (busy) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pointerStartX.current = e.clientX;
    pointerStartTime.current = Date.now();
    setDragging(true);
    setDragX(0);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging) return;
    const dx = e.clientX - pointerStartX.current;
    setDragX(dx);
  }

  function onPointerUp(e: React.PointerEvent) {
    if (!dragging) return;
    setDragging(false);
    const dx = e.clientX - pointerStartX.current;
    const dt = Date.now() - pointerStartTime.current;
    const threshold = dt < 300 ? 40 : 90;
    if (Math.abs(dx) > threshold) {
      navigate(dx < 0 ? current + 1 : current - 1);
    }
    setDragX(0);
  }

  // 触摸滑动
  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchStartTime.current = Date.now();
  }
  function onTouchEnd(e: React.TouchEvent) {
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    const dt = Date.now() - touchStartTime.current;
    if (Math.abs(dx) > 40 && dt < 500) {
      navigate(dx > 0 ? current + 1 : current - 1);
    }
  }

  if (problems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3 text-white/20">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <span className="text-sm">没有匹配的问题</span>
      </div>
    );
  }

  const exitClass  = dir === "left" ? "card-exit-left"  : "card-exit-right";
  const enterClass = dir === "left" ? "card-enter-right" : "card-enter-left";

  // 拖拽时的实时倾斜效果
  const dragRotate  = dragging ? dragX * 0.03 : 0;
  const dragOpacity = dragging ? Math.max(0.7, 1 - Math.abs(dragX) / 600) : 1;

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      {/* ── 卡片区域 ───────────────────────────────────── */}
      <div className="w-full flex items-center gap-3 md:gap-5">

        {/* 上一张 */}
        <button
          onClick={() => navigate(current - 1)}
          disabled={current === 0 || busy}
          aria-label="上一个"
          className="hidden md:flex shrink-0 w-9 h-9 items-center justify-center rounded-full border border-white/[0.07] text-white/25 transition-all duration-150 hover:border-white/15 hover:text-white/55 disabled:opacity-10 disabled:cursor-not-allowed"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* 卡片容器 */}
        <div
          className={`flex-1 relative overflow-hidden rounded-[1.75rem] card-deck-viewport select-none ${dragging ? "card-dragging" : ""}`}
          style={{ minHeight: "clamp(520px, 68vh, 720px)" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={() => { setDragging(false); setDragX(0); }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* 堆叠阴影效果 — 显示后两张卡片的边缘 */}
          {problems.length > 2 && (
            <div
              className="absolute inset-x-4 bottom-[-10px] h-full rounded-[1.75rem] border border-white/[0.035]"
              style={{ background: "#0D0C18", zIndex: 0 }}
            />
          )}
          {problems.length > 1 && (
            <div
              className="absolute inset-x-2 bottom-[-5px] h-full rounded-[1.75rem] border border-white/[0.05]"
              style={{ background: "#100F1C", zIndex: 1 }}
            />
          )}

          {/* 离场卡片 */}
          {busy && prev !== null && (
            <div className={`absolute inset-0 z-10 ${exitClass}`} style={{ borderRadius: "1.75rem" }}>
              <ProblemCardFull problem={problems[prev]} index={prev} />
            </div>
          )}

          {/* 当前卡片（含实时拖拽变换） */}
          <div
            className={busy ? `relative z-20 ${enterClass}` : "relative z-20"}
            style={
              dragging
                ? {
                    transform: `translateX(${dragX}px) rotateY(${dragRotate}deg)`,
                    opacity: dragOpacity,
                    transition: "none",
                    borderRadius: "1.75rem",
                  }
                : { borderRadius: "1.75rem" }
            }
          >
            <ProblemCardFull problem={problems[current]} index={current} />
          </div>

          {/* 拖拽方向指示器 */}
          {dragging && (
            <>
              {dragX < -20 && current < problems.length - 1 && (
                <div
                  className="absolute right-6 top-1/2 -translate-y-1/2 z-30 text-white/40 text-xs font-medium pointer-events-none"
                  style={{ opacity: Math.min(1, (Math.abs(dragX) - 20) / 80) }}
                >
                  下一个 →
                </div>
              )}
              {dragX > 20 && current > 0 && (
                <div
                  className="absolute left-6 top-1/2 -translate-y-1/2 z-30 text-white/40 text-xs font-medium pointer-events-none"
                  style={{ opacity: Math.min(1, (dragX - 20) / 80) }}
                >
                  ← 上一个
                </div>
              )}
            </>
          )}
        </div>

        {/* 下一张 */}
        <button
          onClick={() => navigate(current + 1)}
          disabled={current === problems.length - 1 || busy}
          aria-label="下一个"
          className="hidden md:flex shrink-0 w-9 h-9 items-center justify-center rounded-full border border-white/[0.07] text-white/25 transition-all duration-150 hover:border-white/15 hover:text-white/55 disabled:opacity-10 disabled:cursor-not-allowed"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* ── 进度条圆点 ─────────────────────────────────── */}
      <div className="flex items-center gap-1.5">
        {problems.slice(0, 20).map((_, i) => (
          <button
            key={i}
            onClick={() => navigate(i)}
            aria-label={`第 ${i + 1} 个`}
            className="rounded-full transition-all duration-200"
            style={{
              width:  i === current ? "1.5rem" : "0.375rem",
              height: "0.375rem",
              background: i === current ? "#8875F8" : "rgba(255,255,255,0.12)",
            }}
          />
        ))}
        {problems.length > 20 && (
          <span className="text-[11px] text-white/20 ml-1">+{problems.length - 20}</span>
        )}
      </div>

      {/* ── 计数 + 提示 ───────────────────────────────── */}
      <div className="flex items-center gap-3 text-[11px] text-white/18 tracking-[0.12em] tabular-nums">
        <span>{String(current + 1).padStart(2, "0")} / {String(problems.length).padStart(2, "0")}</span>
        <span className="text-white/10">·</span>
        <span className="text-white/15 hidden sm:inline">← → 键盘导航 · 拖拽或滑动切换</span>
      </div>
    </div>
  );
}
