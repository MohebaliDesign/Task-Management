import type { Metadata, Viewport } from "next";
import "./globals.css";
import { vazirmatn } from "./fonts";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: {
    default: "سامانهٔ حاکمیت پروژه و پاسخگویی جلسات",
    template: "%s — سامانهٔ حاکمیت پروژه",
  },
  description:
    "فضای کاری حاکمیتی برای مدیران پروژه و مالکان محصول: مستندسازی جلسات، ثبت تصمیم‌ها و اقدامات، وابستگی‌ها، تأیید و امضا، و تاریخچهٔ کامل تغییرات پروژه.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning className={vazirmatn.variable}>
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
