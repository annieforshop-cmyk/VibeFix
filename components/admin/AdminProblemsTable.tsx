"use client";

import { useState } from "react";
import { AdminProblem, PublishStatus } from "@/lib/problems";

const STATUS_LABEL: Record<PublishStatus, string> = {
  draft: "草稿",
  published: "已发布",
  archived: "已下架",
};

const STATUS_STYLE: Record<PublishStatus, string> = {
  draft: "bg-gray-100 text-gray-500",
  published: "bg-green-50 text-green-700",
  archived: "bg-red-50 text-red-500",
};

export default function AdminProblemsTable({ initialProblems }: { initialProblems: AdminProblem[] }) {
  const [problems, setProblems] = useState(initialProblems);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function updateStatus(dbId: string, publishStatus: PublishStatus) {
    setBusyId(dbId);
    try {
      const res = await fetch(`/api/admin/problems/${dbId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publishStatus }),
      });
      if (res.ok) {
        setProblems((list) => list.map((p) => (p.dbId === dbId ? { ...p, publishStatus } : p)));
      }
    } finally {
      setBusyId(null);
    }
  }

  async function remove(dbId: string) {
    if (!window.confirm("确认删除这条灵感吗？此操作不可撤销。")) return;
    setBusyId(dbId);
    try {
      const res = await fetch(`/api/admin/problems/${dbId}`, { method: "DELETE" });
      if (res.ok) {
        setProblems((list) => list.filter((p) => p.dbId !== dbId));
      }
    } finally {
      setBusyId(null);
    }
  }

  if (problems.length === 0) {
    return <p className="text-sm text-gray-400">还没有任何灵感，点击右上角「新增 / 批量导入」开始。</p>;
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
            <th className="px-4 py-3 font-medium">标题</th>
            <th className="px-4 py-3 font-medium">分类</th>
            <th className="px-4 py-3 font-medium">状态</th>
            <th className="px-4 py-3 font-medium">收藏数</th>
            <th className="px-4 py-3 font-medium">关注数</th>
            <th className="px-4 py-3 font-medium text-right">操作</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((p) => (
            <tr key={p.dbId} className="border-b border-gray-50 last:border-0">
              <td className="px-4 py-3 max-w-xs">
                <p className="font-medium text-gray-800 line-clamp-1">{p.title}</p>
                <p className="text-xs text-gray-400 line-clamp-1">{p.description}</p>
              </td>
              <td className="px-4 py-3 text-gray-500">{p.category}</td>
              <td className="px-4 py-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLE[p.publishStatus]}`}>
                  {STATUS_LABEL[p.publishStatus]}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-500">{p.collectCount}</td>
              <td className="px-4 py-3 text-gray-500">{p.upvotes}</td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  {p.publishStatus !== "published" && (
                    <button
                      disabled={busyId === p.dbId}
                      onClick={() => updateStatus(p.dbId, "published")}
                      className="text-xs px-2.5 py-1 rounded-full bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-40"
                    >
                      发布
                    </button>
                  )}
                  {p.publishStatus !== "archived" && (
                    <button
                      disabled={busyId === p.dbId}
                      onClick={() => updateStatus(p.dbId, "archived")}
                      className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-40"
                    >
                      下架
                    </button>
                  )}
                  <button
                    disabled={busyId === p.dbId}
                    onClick={() => remove(p.dbId)}
                    className="text-xs px-2.5 py-1 rounded-full bg-red-50 text-red-500 hover:bg-red-100 disabled:opacity-40"
                  >
                    删除
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
