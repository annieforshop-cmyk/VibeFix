// ════════════════════════════════════════════════════════
// 未解 · UI Design Tokens
// 所有设计决策集中在此，改这一个文件即可调整全站风格
// ════════════════════════════════════════════════════════

import type { Category, Difficulty, Status, AIPotential } from "@/lib/data";

// ─── 核心色板 ─────────────────────────────────────────────
// 参考 Linear / Raycast 的深色开发者工具美学
// 背景：带蓝灰调的近黑；强调色：靛蓝 #6366F1
export const palette = {
  bg:           "#0E0E14",   // 页面底色
  surface:      "#141419",   // 卡片/面板背景
  surfaceAlt:   "#1C1C26",   // 次级面板（嵌套信息块）
  border:       "rgba(255,255,255,0.06)",
  borderMid:    "rgba(255,255,255,0.10)",
  borderHigh:   "rgba(255,255,255,0.18)",
  text1:        "#EEEEF0",   // 主文字
  text2:        "#9494A0",   // 次级文字
  text3:        "#55555F",   // 弱化文字
  accent:       "#6366F1",   // 靛蓝强调 — 独立开发者最爱的 Linear 蓝
  accentLight:  "#818CF8",
  accentDim:    "rgba(99,102,241,0.14)",
} as const;

// ─── 分类徽标（深色模式版）─────────────────────────────────
export const CATEGORY_DARK: Record<Category, { badge: string; dot: string }> = {
  自由职业: { badge: "bg-violet-500/10 text-violet-300",  dot: "bg-violet-400" },
  小生意:   { badge: "bg-amber-500/10 text-amber-300",    dot: "bg-amber-400"  },
  效率工具: { badge: "bg-blue-500/10 text-blue-300",      dot: "bg-blue-400"   },
  创作者:   { badge: "bg-pink-500/10 text-pink-300",      dot: "bg-pink-400"   },
  学习成长: { badge: "bg-emerald-500/10 text-emerald-300",dot: "bg-emerald-400"},
  本地生活: { badge: "bg-orange-500/10 text-orange-300",  dot: "bg-orange-400" },
  社交连接: { badge: "bg-cyan-500/10 text-cyan-300",      dot: "bg-cyan-400"   },
  个人财务: { badge: "bg-lime-500/10 text-lime-300",      dot: "bg-lime-400"   },
  宠物生活: { badge: "bg-rose-500/10 text-rose-300",      dot: "bg-rose-400"   },
  健身健康: { badge: "bg-teal-500/10 text-teal-300",      dot: "bg-teal-400"   },
};

// ─── 难度徽标（深色模式版）─────────────────────────────────
export const DIFFICULTY_DARK: Record<Difficulty, string> = {
  周末项目:  "bg-emerald-500/10 text-emerald-300",
  "1-3个月": "bg-sky-500/10 text-sky-300",
  需要团队:  "bg-orange-500/10 text-orange-300",
};

// ─── 状态色（深色模式版）──────────────────────────────────
export const STATUS_DARK: Record<Status, { dot: string; label: string }> = {
  无人在做: { dot: "bg-red-400",     label: "text-red-300"     },
  有人在做: { dot: "bg-emerald-400", label: "text-emerald-300" },
  部分解决: { dot: "bg-amber-400",   label: "text-amber-300"   },
};

// ─── AI 潜力色（深色模式版）───────────────────────────────
export const AI_DARK: Record<AIPotential, string> = {
  高: "text-violet-300",
  中: "text-sky-300",
  低: "text-zinc-500",
};
