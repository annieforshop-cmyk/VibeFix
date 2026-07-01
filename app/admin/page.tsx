import Link from "next/link";
import { listProblemsForAdmin } from "@/lib/problems";
import { listSubmissions } from "@/lib/submissions";
import AdminProblemsTable from "@/components/admin/AdminProblemsTable";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [problems, submissions] = await Promise.all([listProblemsForAdmin(), listSubmissions()]);
  const pendingCount = submissions.filter((s) => s.status === "pending").length;

  return (
    <div className="min-h-screen bg-[#f8f9f8]">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center gap-4">
          <span className="font-black text-[15px] text-[#0e6b4a]">VibeFix · 管理后台</span>
          <span className="text-xs text-gray-400">共 {problems.length} 条</span>
          <div className="ml-auto flex items-center gap-3">
            <Link href="/admin/submissions" className="relative text-[13px] text-gray-500 hover:text-gray-800 transition-colors">
              社区提交审核
              {pendingCount > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center text-[10px] font-bold text-white bg-amber-500 rounded-full min-w-[16px] h-4 px-1">
                  {pendingCount}
                </span>
              )}
            </Link>
            <Link href="/admin/new" className="text-[13px] font-semibold px-4 py-1.5 rounded-full bg-[#0e6b4a] text-white hover:bg-[#0a5a3d] transition-colors">
              新增 / 批量导入
            </Link>
            <Link href="/" className="text-[13px] text-gray-400 hover:text-gray-700 transition-colors">
              返回前台
            </Link>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-8">
        <AdminProblemsTable initialProblems={problems} />
      </main>
    </div>
  );
}
