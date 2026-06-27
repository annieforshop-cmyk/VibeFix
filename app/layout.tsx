import type { Metadata } from "next";
import { Noto_Sans_SC } from "next/font/google";
import "./globals.css";

const notoSansSC = Noto_Sans_SC({
  variable: "--font-noto-sc",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "未解 — 值得被解决的世界问题",
  description: "为独立开发者和创业者整理真实世界的待解难题。找到你值得全力以赴的那个方向。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${notoSansSC.variable} h-full antialiased`}>
      <body className={`min-h-full flex flex-col font-[var(--font-noto-sc)]`}>{children}</body>
    </html>
  );
}
