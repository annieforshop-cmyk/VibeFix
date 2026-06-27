"use client";

import { useState } from "react";
import { ALL_CATEGORIES } from "@/lib/data";

interface SubmitModalProps {
  onClose: () => void;
}

export default function SubmitModal({ onClose }: SubmitModalProps) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {submitted ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">提交成功</h3>
            <p className="text-sm text-gray-500 mb-6">感谢你的贡献，我们会在审核后发布这个问题。</p>
            <button
              onClick={onClose}
              className="bg-gray-900 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              关闭
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-gray-900">提交一个问题</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">问题标题 *</label>
                <input
                  required
                  type="text"
                  placeholder="用一句话描述这个问题"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">详细描述 *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="描述这个问题的规模、影响人群和为什么重要..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 transition-all resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">所属领域 *</label>
                  <select
                    required
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 transition-all bg-white"
                  >
                    <option value="">选择领域</option>
                    {ALL_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">发生地区</label>
                  <input
                    type="text"
                    placeholder="国家 / 地区"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">数据来源（可选）</label>
                <input
                  type="text"
                  placeholder="报告链接或来源说明"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 transition-all"
                />
              </div>
              <button
                type="submit"
                className="bg-gray-900 text-white rounded-full py-2.5 text-sm font-medium hover:bg-gray-700 transition-colors mt-1"
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
