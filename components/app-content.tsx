"use client";

import { useEffect } from "react";
import { SocketEventsHandler } from "@/components/socket-event-handlers";
import { Toast } from "@heroui/react";
import { GameHeader } from "@/components/game-header";
import { DebugPanel } from "@/components/debug-panel";
import { SettingsPanel } from "@/components/settings-panel";
import i18n from "@/lib/i18n";

const STORAGE_KEY = "who-i-am-locale";

export default function AppContent({
  children,
}: {
  children: React.ReactNode;
}) {
  // Применяем сохранённую локаль после гидрации, чтобы первый рендер совпадал с сервером (ru).
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "ru") {
      i18n.changeLanguage(stored);
      document.documentElement.lang = stored === "en" ? "en" : "ru";
    }
  }, []);

  return (
    <div className="flex flex-col gap-8 h-full">
      <GameHeader />
      <div className="flex min-h-0 flex-1 items-center justify-center w-full">
        {children}
      </div>
      <SocketEventsHandler />
      <Toast.Provider />
      <DebugPanel />
      <SettingsPanel />
    </div>
  );
}
