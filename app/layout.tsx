import type { Metadata } from "next";
import { SocketEventsHandler } from "@/components/socket-event-handlers";
import "./globals.css";

export const metadata: Metadata = {
  title: "who-i-am",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="dark h-full" lang="ru">
      <body className="flex h-full items-center justify-center relative p-4">
        {children}
        <SocketEventsHandler />
      </body>
    </html>
  );
}
