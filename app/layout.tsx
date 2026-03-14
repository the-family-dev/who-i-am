import type { Metadata } from "next";
import { EmojiConfetti } from "@/components/emoji-confetti";
import { AppFooter } from "@/components/app-footer";
import AppContent from "@/components/app-content";
import "./globals.css";

export const metadata: Metadata = {
  title: "А хто я",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="dark h-full" lang="ru" suppressHydrationWarning>
      <body className={"flex flex-col h-full p-4"}>
        <AppContent>{children}</AppContent>
        <EmojiConfetti />
        <AppFooter />
      </body>
    </html>
  );
} 
