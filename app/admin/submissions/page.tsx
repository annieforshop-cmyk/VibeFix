import Link from "next/link";
import { listSubmissions } from "@/lib/submissions";
import AdminSubmissionsTable from "@/components/admin/AdminSubmissionsTable";

export const dynamic = "force-dynamic";

export default async function AdminSubmissionsPage() {
  const submissions = await listSubmissions();
  const pending = submissions.filter((s) => s.status === "pending").length;

  return (
    <div className="min-h-screen bg-[#f8f9f8]">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center gap-4">
          <span className="font-black text-[15px] text-[#0e6b4a]">VibeFix · 社区提交审核</span>
          <span className="text-xs text-gray-400">共 {submissions.length} 条 · {pending} 条待审核</span>
          <div className="ml-auto flex items-center gap-3">
            <Link href="/admin" className="text-[13px] text-gray-400 hover:text-gray-700 transition-colors">
              返回灵感列表
            </Link>
            <Link href="/" className="text-[13px] text-gray-400 hover:text-gray-700 transition-colors">
              返回前台
            </Link>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-8">
        <AdminSubmissionsTable initialSubmissions={submissions} />
      </main>
    </div>
  );
}
