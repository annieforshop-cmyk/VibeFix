"use client";

import { useState } from "react";
import { ALL_CATEGORIES } from "@/lib/data";

export default function SubmitModal({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [region, setRegion] = useState("");
  const [source, setSource] = useState("");

  const inputCls =
    "w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#0e6b4a] focus:bg-white transition-all";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, category, region, source }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "提交失败，请稍后重试");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "提交失败，请稍后重试");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border border-gray-100 rounded-2xl p-6 w-full max-w-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {submitted ? (
          <div className="text-center py-10">
            <div className="w-12 h-12 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0e6b4a" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">提交成功</h3>
            <p className="text-sm text-gray-400 mb-6">感谢你的贡献，我们会在审核后发布这个问题。</p>
            <button
              onClick={onClose}
              className="bg-[#0e6b4a] hover:bg-[#0a5a3d] text-white px-6 py-2 rounded-xl text-sm font-medium transition-colors"
            >
              关闭
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-gray-900">提交一个问题</h2>
              <button
                onClick={onClose}
                className="text-gray-300 hover:text-gray-600 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  问题标题 *
                </label>
                <input
                  required
                  type="text"
                  placeholder="用一句话描述这个问题"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  详细描述 *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="描述这个问题的规模、影响人群和为什么重要..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`${inputCls} resize-none`}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    所属领域 *
                  </label>
                  <select
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`${inputCls} appearance-none`}
                  >
                    <option value="">选择领域</option>
                    {ALL_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    发生地区
                  </label>
                  <input
                    type="text"
                    placeholder="国家 / 地区"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  数据来源（可选）
                </label>
                <input
                  type="text"
                  placeholder="报告链接或来源说明"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className={inputCls}
                />
              </div>
              {error && <p className="text-xs text-red-500">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="bg-[#0e6b4a] hover:bg-[#0a5a3d] disabled:opacity-50 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors mt-1"
              >
                {submitting ? "提交中..." : "提交审核"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
