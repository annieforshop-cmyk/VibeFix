"use client";

import { useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";

type Mode = "signin" | "signup";

export default function AuthModal({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const inputCls =
    "w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#0e6b4a] focus:bg-white transition-all";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setError("登录功能未配置（缺少 Supabase 环境变量）");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
        setNotice("注册成功。如果你的项目开启了邮箱验证，请查收邮件后再登录。");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "操作失败");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white border border-gray-100 rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-gray-900">{mode === "signin" ? "登录" : "注册"} VibeFix</h2>
          <button onClick={onClose} className="text-gray-300 hover:text-gray-600 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">邮箱</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">密码</label>
            <input required type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} placeholder="至少 6 位" />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          {notice && <p className="text-xs text-[#0e6b4a]">{notice}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="bg-[#0e6b4a] hover:bg-[#0a5a3d] disabled:opacity-50 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors mt-1"
          >
            {submitting ? "处理中..." : mode === "signin" ? "登录" : "注册"}
          </button>
        </form>

        <button
          onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); setNotice(null); }}
          className="w-full text-center text-xs text-gray-400 hover:text-gray-700 mt-4 transition-colors"
        >
          {mode === "signin" ? "还没有账号？去注册" : "已有账号？去登录"}
        </button>
      </div>
    </div>
  );
}
