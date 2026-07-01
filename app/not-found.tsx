import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f8f9f8] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-sm font-black text-[#0e6b4a] mb-2">未解</p>
        <p className="text-gray-400 text-sm mb-4">找不到这个页面</p>
        <Link href="/" className="text-[#0e6b4a] text-sm underline">
          返回首页
        </Link>
      </div>
    </div>
  );
}
