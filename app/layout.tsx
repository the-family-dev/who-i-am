import type { Metadata } from "next";
import { SocketEventsHandler } from "@/components/socket-event-handlers";
import { Toast } from "@heroui/react";
import classNames from "classnames";
import { GameHeader } from "@/components/game-header";
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
      <body className={classNames("flex flex-col gap-8 h-full p-4 dark")}>
        <GameHeader />
        <div className="flex items-center justify-center w-full h-full">
          {children}
        </div>
        <SocketEventsHandler />
        <Toast.Provider />
      </body>
    </html>
  );
}
