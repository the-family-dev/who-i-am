"use client";

import { observer } from "mobx-react-lite";
import { Chip, Surface } from "@heroui/react";
import { store } from "@/store/store";
import { useTranslation } from "react-i18next";

export const GuessProgressIndicator = observer(function GuessProgressIndicator() {
  const { guessedCount, totalPlayerCount } = store;
  const { t } = useTranslation();

  const progressPercent =
    totalPlayerCount > 0 ? (guessedCount / totalPlayerCount) * 100 : 0;

  return (
    <Surface className="mt-1 px-3 py-1.5 rounded-lg flex flex-col gap-1 min-w-[140px]">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-neutral-400">{t("guessProgress.label")}</span>
        <Chip size="sm" variant="soft" color="success">
          {guessedCount} из {totalPlayerCount}
        </Chip>
      </div>
      <div
        className="h-1.5 w-full rounded-full bg-neutral-700 overflow-hidden"
        role="progressbar"
        aria-valuenow={guessedCount}
        aria-valuemin={0}
        aria-valuemax={totalPlayerCount}
        aria-label={t("guessProgress.aria", { count: guessedCount, total: totalPlayerCount })}
      >
        <div
          className="h-full bg-success rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </Surface>
  );
});
