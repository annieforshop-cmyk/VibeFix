import Link from "next/link";
import { listProblemsForAdmin } from "@/lib/problems";
import AdminProblemsTable from "@/components/admin/AdminProblemsTable";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const problems = await listProblemsForAdmin();

  return (
    <div className="min-h-screen bg-[#f8f9f8]">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center gap-4">
          <span className="font-black text-[15px] text-[#0e6b4a]">VibeFix · 管理后台</span>
          <span className="text-xs text-gray-400">共 {problems.length} 条</span>
          <div className="ml-auto flex items-center gap-3">
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
