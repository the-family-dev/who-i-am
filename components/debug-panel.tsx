"use client";

import { Button, Popover } from "@heroui/react";
import { Bug as BugIcon } from "lucide-react";
import { store } from "@/store/store";
import { useTranslation } from "react-i18next";

export function DebugPanel() {
  const { t } = useTranslation();

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 z-40">
      <Popover>
        <Button
          variant="outline"
          size="lg"
          isIconOnly
          className="opacity-60 hover:opacity-100"
          aria-label={t("debug.aria")}
        >
          <BugIcon size={20} />
        </Button>
        <Popover.Content placement="top" className="min-w-48">
          <Popover.Dialog>
            <div className="flex flex-col gap-1 py-1 gap-4">
              <div className="px-2 py-1 text-xs text-neutral-500 border-b border-neutral-700">
                {t("debug.title")}
              </div>
              <div className="flex flex-col gap-1">
                <Button onPress={() => store.triggerConfetti()}>{t("debug.confetti")}</Button>
              </div>
            </div>
          </Popover.Dialog>
        </Popover.Content>
      </Popover>
    </div>
  );
}

