"use client";

import { useState } from "react";
import { ALL_CATEGORIES } from "@/lib/data";

export default function SubmitModal({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  const inputCls =
    "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white/80 placeholder-white/20 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all";

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#141419] border border-white/[0.08] rounded-2xl p-6 w-full max-w-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {submitted ? (
          <div className="text-center py-10">
            <div className="w-12 h-12 rounded-full bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center mx-auto mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-white/90 mb-2">提交成功</h3>
            <p className="text-sm text-white/40 mb-6">感谢你的贡献，我们会在审核后发布这个问题。</p>
            <button
              onClick={onClose}
              className="bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-2 rounded-xl text-sm font-medium transition-colors"
            >
              关闭
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-white/90">提交一个问题</h2>
              <button
                onClick={onClose}
                className="text-white/25 hover:text-white/60 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-white/35 mb-1.5">
                  问题标题 *
                </label>
                <input
                  required
                  type="text"
                  placeholder="用一句话描述这个问题"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/35 mb-1.5">
                  详细描述 *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="描述这个问题的规模、影响人群和为什么重要..."
                  className={`${inputCls} resize-none`}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-white/35 mb-1.5">
                    所属领域 *
                  </label>
                  <select
                    required
                    className={`${inputCls} appearance-none`}
                    style={{ background: "rgba(255,255,255,0.04)" }}
                  >
                    <option value="" style={{ background: "#1C1C26" }}>选择领域</option>
                    {ALL_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} style={{ background: "#1C1C26" }}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/35 mb-1.5">
                    发生地区
                  </label>
                  <input
                    type="text"
                    placeholder="国家 / 地区"
                    className={inputCls}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/35 mb-1.5">
                  数据来源（可选）
                </label>
                <input
                  type="text"
                  placeholder="报告链接或来源说明"
                  className={inputCls}
                />
              </div>
              <button
                type="submit"
                className="bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors mt-1"
              >
                提交审核
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
