"use client";

import { Button, Popover } from "@heroui/react";
import { Settings as SettingsIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

export function SettingsPanel() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith("en") ? "en" : "ru";

  return (
    <div className="fixed bottom-12 right-4 z-40">
      <Popover>
        <Button
          variant="outline"
          size="lg"
          isIconOnly
          className="opacity-60 hover:opacity-100"
          aria-label={t("settings.aria")}
        >
          <SettingsIcon size={20} />
        </Button>
        <Popover.Content placement="top" className="min-w-48">
          <Popover.Dialog>
            <div className="flex flex-col gap-1 py-1 gap-4">
              <div className="px-2 py-1 text-xs text-neutral-500 border-b border-neutral-700">
                {t("settings.title")}
              </div>
              <div className="flex flex-col gap-1">
                <span className="px-2 text-xs text-neutral-400">
                  {t("settings.language")}
                </span>
                <div className="flex flex-row gap-2 px-2">
                  <Button
                    size="sm"
                    variant={lang === "ru" ? "primary" : "secondary"}
                    onPress={() => i18n.changeLanguage("ru")}
                  >
                    {t("settings.langRu")}
                  </Button>
                  <Button
                    size="sm"
                    variant={lang === "en" ? "primary" : "secondary"}
                    onPress={() => i18n.changeLanguage("en")}
                  >
                    {t("settings.langEn")}
                  </Button>
                </div>
              </div>
            </div>
          </Popover.Dialog>
        </Popover.Content>
      </Popover>
    </div>
  );
}
