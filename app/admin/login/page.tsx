"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "登录失败");
      }
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "登录失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f9f8] flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h1 className="text-lg font-black text-[#0e6b4a] mb-1">VibeFix · 管理后台</h1>
        <p className="text-xs text-gray-400 mb-6">输入管理密码以继续</p>
        <input
          type="password"
          autoFocus
          required
          placeholder="管理密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#0e6b4a] focus:bg-white transition-all mb-3"
        />
        {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0e6b4a] hover:bg-[#0a5a3d] disabled:opacity-50 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors"
        >
          {loading ? "登录中..." : "登录"}
        </button>
      </form>
    </div>
  );
}
