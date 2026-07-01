"use client";

import { useState } from "react";
import { Submission, SubmissionStatus } from "@/lib/submissions";

const STATUS_LABEL: Record<SubmissionStatus, string> = {
  pending: "待审核",
  approved: "已通过",
  rejected: "已拒绝",
};

const STATUS_STYLE: Record<SubmissionStatus, string> = {
  pending: "bg-amber-50 text-amber-700",
  approved: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-500",
};

export default function AdminSubmissionsTable({ initialSubmissions }: { initialSubmissions: Submission[] }) {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function act(id: string, action: "approve" | "reject") {
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? "操作失败");
      setSubmissions((list) =>
        list.map((s) => (s.id === id ? { ...s, status: action === "approve" ? "approved" : "rejected" } : s))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "操作失败");
    } finally {
      setBusyId(null);
    }
  }

  if (submissions.length === 0) {
    return <p className="text-sm text-gray-400">还没有社区提交的问题。</p>;
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      {error && <p className="text-xs text-red-500 px-4 pt-3">{error}</p>}
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
            <th className="px-4 py-3 font-medium">标题 / 描述</th>
            <th className="px-4 py-3 font-medium">分类</th>
            <th className="px-4 py-3 font-medium">地区</th>
            <th className="px-4 py-3 font-medium">来源</th>
            <th className="px-4 py-3 font-medium">状态</th>
            <th className="px-4 py-3 font-medium text-right">操作</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((s) => (
            <tr key={s.id} className="border-b border-gray-50 last:border-0 align-top">
              <td className="px-4 py-3 max-w-sm">
                <p className="font-medium text-gray-800 line-clamp-1">{s.title}</p>
                <p className="text-xs text-gray-400 line-clamp-2">{s.description}</p>
              </td>
              <td className="px-4 py-3 text-gray-500">{s.category ?? "—"}</td>
              <td className="px-4 py-3 text-gray-500">{s.region ?? "—"}</td>
              <td className="px-4 py-3 text-gray-500 max-w-[10rem] truncate">{s.source ?? "—"}</td>
              <td className="px-4 py-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLE[s.status]}`}>
                  {STATUS_LABEL[s.status]}
                </span>
              </td>
              <td className="px-4 py-3">
                {s.status === "pending" ? (
                  <div className="flex items-center justify-end gap-2">
                    <button
                      disabled={busyId === s.id}
                      onClick={() => act(s.id, "approve")}
                      className="text-xs px-2.5 py-1 rounded-full bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-40"
                    >
                      通过 → 生成草稿
                    </button>
                    <button
                      disabled={busyId === s.id}
                      onClick={() => act(s.id, "reject")}
                      className="text-xs px-2.5 py-1 rounded-full bg-red-50 text-red-500 hover:bg-red-100 disabled:opacity-40"
                    >
                      拒绝
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-gray-300 block text-right">已处理</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
