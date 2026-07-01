"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ALL_CATEGORIES } from "@/lib/data";

const DIFFICULTIES = ["周末项目", "1-3个月", "需要团队"] as const;
const STATUSES = ["无人在做", "有人在做", "部分解决"] as const;
const AI_LEVELS = ["高", "中", "低"] as const;
const REGIONS = ["中国", "亚洲", "全球", "非洲", "欧洲", "美洲"] as const;

const inputCls =
  "w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#0e6b4a] focus:bg-white transition-all";

export default function AdminNewProblemPage() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: ALL_CATEGORIES[0] as string,
    subcategory: "",
    difficulty: DIFFICULTIES[0] as string,
    region: REGIONS[0] as string,
    status: STATUSES[0] as string,
    aiPotential: AI_LEVELS[0] as string,
    painScore: 5,
    targetUsers: "",
    whyNow: "",
    techHints: "",
    complaintCount: 0,
    growthRate: 0,
    source: "",
    sourceLinks: "",
    detailJson: "",
    publishStatus: "draft",
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);

    let detail;
    try {
      detail = form.detailJson.trim() ? JSON.parse(form.detailJson) : undefined;
    } catch {
      setError("详情 JSON 格式不正确");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          category: form.category,
          subcategory: form.subcategory,
          difficulty: form.difficulty,
          region: form.region,
          status: form.status,
          aiPotential: form.aiPotential,
          painScore: Number(form.painScore),
          targetUsers: form.targetUsers,
          whyNow: form.whyNow,
          techHints: form.techHints.split(",").map((s) => s.trim()).filter(Boolean),
          complaintCount: Number(form.complaintCount),
          growthRate: Number(form.growthRate),
          source: form.source || undefined,
          sourceLinks: form.sourceLinks.split(",").map((s) => s.trim()).filter(Boolean),
          detail,
          publishStatus: form.publishStatus,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "创建失败");
      }
      setMessage("创建成功");
      setTimeout(() => router.push("/admin"), 600);
    } catch (err) {
      setError(err instanceof Error ? err.message : "创建失败");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f9f8]">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center gap-4">
          <span className="font-black text-[15px] text-[#0e6b4a]">未解 · 新增灵感</span>
          <Link href="/admin" className="ml-auto text-[13px] text-gray-400 hover:text-gray-700 transition-colors">
            返回列表
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        <form onSubmit={handleCreate} className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-gray-900">新增单条灵感</h2>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">标题 *</label>
            <input required value={form.title} onChange={(e) => set("title", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">一句话描述 *</label>
            <textarea required rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} className={`${inputCls} resize-none`} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">行业分类 *</label>
              <select value={form.category} onChange={(e) => set("category", e.target.value)} className={inputCls}>
                {ALL_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">子分类</label>
              <input value={form.subcategory} onChange={(e) => set("subcategory", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">技术难度 *</label>
              <select value={form.difficulty} onChange={(e) => set("difficulty", e.target.value)} className={inputCls}>
                {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">地区</label>
              <select value={form.region} onChange={(e) => set("region", e.target.value)} className={inputCls}>
                {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">现状</label>
              <select value={form.status} onChange={(e) => set("status", e.target.value)} className={inputCls}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">AI 可解性</label>
              <select value={form.aiPotential} onChange={(e) => set("aiPotential", e.target.value)} className={inputCls}>
                {AI_LEVELS.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">痛点强度 (1-10)</label>
              <input type="number" min={1} max={10} value={form.painScore} onChange={(e) => set("painScore", Number(e.target.value))} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">发布状态</label>
              <select value={form.publishStatus} onChange={(e) => set("publishStatus", e.target.value)} className={inputCls}>
                <option value="draft">草稿</option>
                <option value="published">已发布</option>
                <option value="archived">已下架</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">目标用户</label>
            <input value={form.targetUsers} onChange={(e) => set("targetUsers", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">为什么现在可以做</label>
            <textarea rows={2} value={form.whyNow} onChange={(e) => set("whyNow", e.target.value)} className={`${inputCls} resize-none`} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">技术方向（逗号分隔）</label>
            <input value={form.techHints} onChange={(e) => set("techHints", e.target.value)} className={inputCls} placeholder="例如：微信小程序, LBS 匹配" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">相关抱怨数量</label>
              <input type="number" min={0} value={form.complaintCount} onChange={(e) => set("complaintCount", Number(e.target.value))} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">近30天增长率 (%)</label>
              <input type="number" value={form.growthRate} onChange={(e) => set("growthRate", Number(e.target.value))} className={inputCls} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">数据来源说明</label>
            <input value={form.source} onChange={(e) => set("source", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">原始帖子链接（逗号分隔）</label>
            <input value={form.sourceLinks} onChange={(e) => set("sourceLinks", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              详情 JSON（可选，evidence / market / tech 结构，参见 supabase/seed.sql 示例）
            </label>
            <textarea rows={6} value={form.detailJson} onChange={(e) => set("detailJson", e.target.value)} className={`${inputCls} resize-none font-mono text-xs`} placeholder='{"evidence": {"keywords": []}, "market": {}, "tech": {}}' />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}
          {message && <p className="text-xs text-green-600">{message}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="bg-[#0e6b4a] hover:bg-[#0a5a3d] disabled:opacity-50 text-white rounded-xl py-2.5 px-6 text-sm font-semibold transition-colors"
          >
            {submitting ? "创建中..." : "创建"}
          </button>
        </form>

        <BulkImportForm />
      </main>
    </div>
  );
}

function BulkImportForm() {
  const [json, setJson] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleImport(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setResult(null);
    try {
      const items = JSON.parse(json);
      const res = await fetch("/api/admin/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "导入失败");
      setResult(`成功创建 ${data.createdCount} 条，失败 ${data.errors?.length ?? 0} 条`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "JSON 格式不正确");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleImport} className="bg-white border border-gray-100 rounded-2xl p-6 space-y-3">
      <h2 className="text-sm font-bold text-gray-900">批量导入（粘贴审阅后的 Grok 输出）</h2>
      <p className="text-xs text-gray-400">
        粘贴一个 JSON 数组，每项字段与上方单条表单一致（title / description / category / difficulty 必填）。导入后默认状态为草稿，需要在列表页手动发布。
      </p>
      <textarea
        rows={8}
        value={json}
        onChange={(e) => setJson(e.target.value)}
        className={`${inputCls} resize-none font-mono text-xs`}
        placeholder='[{"title": "...", "description": "...", "category": "小生意", "difficulty": "周末项目"}]'
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      {result && <p className="text-xs text-green-600">{result}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="bg-gray-900 hover:bg-black disabled:opacity-50 text-white rounded-xl py-2.5 px-6 text-sm font-semibold transition-colors"
      >
        {submitting ? "导入中..." : "批量导入"}
      </button>
    </form>
  );
}
