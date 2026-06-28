// ════════════════════════════════════════════════════════════
// 未解 · Design System
// 在此文件修改全站所有视觉决策，无需触碰业务组件
// ════════════════════════════════════════════════════════════

import type { Category, Difficulty, Status, AIPotential } from "@/lib/data";

// ─── 核心色板 ────────────────────────────────────────────────
// 独立开发者工具美学：极夜紫 × 紫罗兰强调色
// 参考 Obsidian / Craft / Bear / Linear 的深色工具风格
export const palette = {
  // 背景层级
  bg:           "#09090F",  // 主背景 — 极夜紫黑
  bgAlt:        "#0C0B15",  // 次级背景（轻微区分）
  surface:      "#0F0E1B",  // 卡片/面板背景
  surfaceHover: "#141329",  // 卡片 hover 态
  surfaceAlt:   "#1B1A30",  // 嵌套信息块（"为什么是现在"）

  // 边框
  border:     "rgba(255,255,255,0.055)",
  borderMid:  "rgba(255,255,255,0.10)",
  borderHigh: "rgba(255,255,255,0.20)",

  // 文字层级
  text1: "#F0F0F5",   // 主文字
  text2: "#8C8CA0",   // 次级
  text3: "#50505E",   // 弱化
  text4: "#303040",   // 极弱（装饰）

  // 主题色 — 紫罗兰（独立开发者 signature）
  accent:      "#8875F8",  // 紫罗兰强调
  accentDeep:  "#6A57E0",  // 加深（hover/active）
  accentLight: "#A594FF",  // 浅紫（decorative）
  accentGlow:  "rgba(136,117,248,0.14)",
  accentDim:   "rgba(136,117,248,0.08)",

  // 功能色
  warm:    "#F59E0B",  // 热度/热门（琥珀）
  success: "#34D399",  // 绿（有人在做）
  danger:  "#F87171",  // 红（无人在做）
  warn:    "#FBBF24",  // 黄（部分解决）
} as const;

// ─── 排版比例 ─────────────────────────────────────────────────
export const type = {
  hero:   "clamp(2.2rem, 5vw, 3.25rem)",
  title:  "clamp(1.5rem, 3vw, 1.875rem)",
  label:  "0.6875rem",   // 11px — 分节标签
  mono:   "'SF Mono', 'Fira Code', monospace",
} as const;

// ─── 圆角 ────────────────────────────────────────────────────
export const radius = {
  card:   "1.75rem",   // 28px — 主卡片
  panel:  "1.25rem",   // 20px — 内嵌面板
  badge:  "999px",     // 全圆角徽标
  btn:    "0.875rem",  // 14px — 按钮
  input:  "0.875rem",
} as const;

// ─── 动效 ────────────────────────────────────────────────────
export const motion = {
  card:      "350ms cubic-bezier(0.22, 1, 0.36, 1)",
  fadeIn:    "200ms ease",
  hover:     "150ms ease",
  spring:    "cubic-bezier(0.34, 1.56, 0.64, 1)",  // 弹性
} as const;

// ─── 分类 × 品类 accent（深色模式）──────────────────────────────
// 每个分类有自己的渐变色，用于卡片背景微妙上色
export const CATEGORY_DARK: Record<Category, {
  badge: string;   // Tailwind 徽标样式
  dot:   string;   // Tailwind 圆点颜色
  glow:  string;   // 内联 CSS 渐变色（卡片背景）
}> = {
  自由职业: {
    badge: "bg-violet-500/10 text-violet-300 border border-violet-500/15",
    dot:   "bg-violet-400",
    glow:  "rgba(167,139,250,0.06)",
  },
  小生意: {
    badge: "bg-amber-500/10 text-amber-300 border border-amber-500/15",
    dot:   "bg-amber-400",
    glow:  "rgba(251,191,36,0.05)",
  },
  效率工具: {
    badge: "bg-blue-500/10 text-blue-300 border border-blue-500/15",
    dot:   "bg-blue-400",
    glow:  "rgba(96,165,250,0.06)",
  },
  创作者: {
    badge: "bg-pink-500/10 text-pink-300 border border-pink-500/15",
    dot:   "bg-pink-400",
    glow:  "rgba(244,114,182,0.06)",
  },
  学习成长: {
    badge: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/15",
    dot:   "bg-emerald-400",
    glow:  "rgba(52,211,153,0.05)",
  },
  本地生活: {
    badge: "bg-orange-500/10 text-orange-300 border border-orange-500/15",
    dot:   "bg-orange-400",
    glow:  "rgba(251,146,60,0.05)",
  },
  社交连接: {
    badge: "bg-cyan-500/10 text-cyan-300 border border-cyan-500/15",
    dot:   "bg-cyan-400",
    glow:  "rgba(34,211,238,0.05)",
  },
  个人财务: {
    badge: "bg-lime-500/10 text-lime-300 border border-lime-500/15",
    dot:   "bg-lime-400",
    glow:  "rgba(163,230,53,0.05)",
  },
  宠物生活: {
    badge: "bg-rose-500/10 text-rose-300 border border-rose-500/15",
    dot:   "bg-rose-400",
    glow:  "rgba(251,113,133,0.06)",
  },
  健身健康: {
    badge: "bg-teal-500/10 text-teal-300 border border-teal-500/15",
    dot:   "bg-teal-400",
    glow:  "rgba(45,212,191,0.05)",
  },
};

// ─── 难度徽标（深色模式）────────────────────────────────────────
export const DIFFICULTY_DARK: Record<Difficulty, string> = {
  周末项目:  "bg-emerald-500/10 text-emerald-300 border border-emerald-500/15",
  "1-3个月": "bg-sky-500/10 text-sky-300 border border-sky-500/15",
  需要团队:  "bg-orange-500/10 text-orange-300 border border-orange-500/15",
};

// ─── 状态（深色模式）─────────────────────────────────────────────
export const STATUS_DARK: Record<Status, { dot: string; label: string }> = {
  无人在做: { dot: "bg-red-400",     label: "text-red-300/80"     },
  有人在做: { dot: "bg-emerald-400", label: "text-emerald-300/80" },
  部分解决: { dot: "bg-amber-400",   label: "text-amber-300/80"   },
};

// ─── AI 潜力（深色模式）──────────────────────────────────────────
export const AI_DARK: Record<AIPotential, string> = {
  高: "text-violet-300/80",
  中: "text-sky-300/80",
  低: "text-zinc-500",
};
