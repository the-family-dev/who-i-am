import type { Metadata } from "next";
import { SocketEventsHandler } from "@/components/socket-event-handlers";
import { Toast } from "@heroui/react";
import classNames from "classnames";
import { GameHeader } from "@/components/game-header";
import { DebugPanel } from "@/components/debug-panel";
import { EmojiConfetti } from "@/components/emoji-confetti";
import { AppFooter } from "@/components/app-footer";
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
    <html className="dark h-full" lang="ru">
      <body className={"flex flex-col h-full p-4"}>
        <div className="flex flex-col gap-8 h-full">
          <GameHeader />
          <div className="flex min-h-0 flex-1 items-center justify-center w-full">
            {children}
          </div>
          <SocketEventsHandler />
          <Toast.Provider />
          <DebugPanel />
        </div>
        <EmojiConfetti />
        <AppFooter />
      </body>
    </html>
  );
}
