"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Problem } from "@/lib/data";
import ProblemCardFull from "@/components/ProblemCardFull";

function collectedKey(id: string) {
  return `vibefix_collected_${id}`;
}

export default function CardDeck({ problems }: { problems: Problem[] }) {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [dir, setDir] = useState<"left" | "right">("left");
  const [busy, setBusy] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [collectedOverrides, setCollectedOverrides] = useState<Record<string, boolean>>({});
  const pointerStartX = useRef(0);
  const touchStartX = useRef(0);
  const touchStartTime = useRef(0);

  useEffect(() => {
    setCurrent(0);
    setPrev(null);
    setBusy(false);
    setDragX(0);
    setDragging(false);
  }, [problems]);

  const currentId = problems[current]?.id;
  const collected =
    currentId !== undefined
      ? collectedOverrides[currentId] ??
        (typeof window !== "undefined" && window.localStorage.getItem(collectedKey(currentId)) === "1")
      : false;

  async function toggleSave() {
    const id = currentId;
    if (!id) return;
    setCollectedOverrides((o) => ({ ...o, [id]: !collected }));
    try {
      const res = await fetch(`/api/problems/${id}/collect`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        window.localStorage.setItem(collectedKey(id), data.collected ? "1" : "0");
        setCollectedOverrides((o) => ({ ...o, [id]: !!data.collected }));
      }
    } catch {
      // best-effort — keep optimistic local state on network failure
    }
  }

  const navigate = useCallback(
    (next: number) => {
      if (busy || next < 0 || next >= problems.length) return;
      setDir(next > current ? "left" : "right");
      setPrev(current);
      setCurrent(next);
      setBusy(true);
      const t = setTimeout(() => { setPrev(null); setBusy(false); }, 360);
      return () => clearTimeout(t);
    },
    [busy, current, problems.length]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") navigate(current + 1);
      if (e.key === "ArrowLeft")  navigate(current - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, navigate]);

  function onPointerDown(e: React.PointerEvent) {
    if (busy) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pointerStartX.current = e.clientX;
    setDragging(true);
    setDragX(0);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging) return;
    setDragX(e.clientX - pointerStartX.current);
  }

  function onPointerUp(e: React.PointerEvent) {
    if (!dragging) return;
    setDragging(false);
    const dx = e.clientX - pointerStartX.current;
    if (Math.abs(dx) > 60) navigate(dx < 0 ? current + 1 : current - 1);
    setDragX(0);
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchStartTime.current = Date.now();
  }

  function onTouchEnd(e: React.TouchEvent) {
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    const dt = Date.now() - touchStartTime.current;
    if (Math.abs(dx) > 40 && dt < 500) navigate(dx > 0 ? current + 1 : current - 1);
  }

  if (problems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-300">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <span className="text-sm">没有匹配的问题</span>
      </div>
    );
  }

  const exitClass  = dir === "left" ? "card-exit-left"  : "card-exit-right";
  const enterClass = dir === "left" ? "card-enter-right" : "card-enter-left";

  const dragRotate = dragging ? dragX * 0.04 : 0;

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Swipe hint */}
      <p className="text-[11px] text-gray-400 tracking-wide">左右滑动探索 · 寻找灵感</p>

      {/* Card area */}
      <div
        className={`relative w-full overflow-hidden select-none ${dragging ? "card-dragging" : ""}`}
        style={{ minHeight: "clamp(480px, 70vh, 680px)" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => { setDragging(false); setDragX(0); }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Exit card */}
        {busy && prev !== null && (
          <div className={`absolute inset-0 z-10 ${exitClass}`} style={{ borderRadius: "1.5rem" }}>
            <ProblemCardFull problem={problems[prev]} index={prev} />
          </div>
        )}

        {/* Current card */}
        <div
          className={busy ? `relative z-20 ${enterClass}` : "relative z-20"}
          style={
            dragging
              ? { transform: `translateX(${dragX}px) rotate(${dragRotate}deg)`, transition: "none", borderRadius: "1.5rem" }
              : { borderRadius: "1.5rem" }
          }
        >
          <ProblemCardFull problem={problems[current]} index={current} />
        </div>

        {/* Drag labels */}
        {dragging && dragX < -30 && current < problems.length - 1 && (
          <div
            className="absolute right-5 top-1/2 -translate-y-1/2 z-30 bg-red-100 text-red-500 text-[12px] font-bold px-3 py-1.5 rounded-full pointer-events-none"
            style={{ opacity: Math.min(1, (Math.abs(dragX) - 30) / 80) }}
          >
            无感 »
          </div>
        )}
        {dragging && dragX > 30 && current > 0 && (
          <div
            className="absolute left-5 top-1/2 -translate-y-1/2 z-30 bg-green-100 text-green-600 text-[12px] font-bold px-3 py-1.5 rounded-full pointer-events-none"
            style={{ opacity: Math.min(1, (dragX - 30) / 80) }}
          >
            « 感兴趣
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-5">
        <button
          onClick={() => navigate(current + 1)}
          disabled={current === problems.length - 1 || busy}
          aria-label="无感"
          className="w-14 h-14 rounded-full bg-white shadow-lg border border-red-100 flex items-center justify-center text-red-400 hover:bg-red-50 disabled:opacity-30 transition-all active:scale-95"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <button
          onClick={() => navigate(current - 1)}
          disabled={current === 0 || busy}
          aria-label="感兴趣"
          className="w-16 h-16 rounded-full bg-[#0e6b4a] shadow-lg shadow-green-200 flex items-center justify-center text-white hover:bg-[#0a5a3d] disabled:opacity-30 transition-all active:scale-95"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>

        <button
          onClick={toggleSave}
          aria-label="收藏"
          className={`w-14 h-14 rounded-full bg-white shadow-lg border flex items-center justify-center transition-all active:scale-95 ${
            collected ? "border-teal-300 text-teal-600 bg-teal-50" : "border-teal-100 text-teal-500 hover:bg-teal-50"
          }`}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill={collected ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5">
            {collected ? (
              <path d="M12 17.75l-6.172 3.245 1.179-6.873-4.993-4.867 6.9-1.002L12 2l3.086 6.253 6.9 1.002-4.993 4.867 1.179 6.873z" />
            ) : (
              <path d="M12 5v14M5 12h14" />
            )}
          </svg>
        </button>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-1.5">
        {problems.slice(0, 15).map((_, i) => (
          <button
            key={i}
            onClick={() => navigate(i)}
            className="rounded-full transition-all duration-200"
            style={{
              width:  i === current ? "1.25rem" : "0.375rem",
              height: "0.375rem",
              background: i === current ? "#0e6b4a" : "#d1fae5",
            }}
          />
        ))}
        {problems.length > 15 && (
          <span className="text-[11px] text-gray-400 ml-1">+{problems.length - 15}</span>
        )}
      </div>

      <p className="text-[11px] text-gray-400 tabular-nums">
        {current + 1} / {problems.length}
      </p>
    </div>
  );
}
