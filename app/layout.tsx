import type { Metadata } from "next";
import { SocketEventsHandler } from "@/components/socket-event-handlers";
import { Toast } from "@heroui/react";
import { Comic_Relief } from "next/font/google";
import classNames from "classnames";
import "./globals.css";
import { GameHeader } from "@/components/game-header";

export const metadata: Metadata = {
  title: "who-i-am",
};

const comicRelief = Comic_Relief({
  subsets: ["latin", "cyrillic"], // Добавляем кириллицу, если нужно
  weight: ["400", "700"], // Указываем нужные начертания
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="dark h-full" lang="ru">
      <body
        className={classNames(
          comicRelief.className,
          "flex flex-col gap-8 h-full p-4 dark",
        )}
      >
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
