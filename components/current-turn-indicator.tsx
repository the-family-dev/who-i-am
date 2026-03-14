"use client";

import { observer } from "mobx-react-lite";
import { Chip, Surface } from "@heroui/react";
import { store } from "@/store/store";
import { useTranslation } from "react-i18next";

export const CurrentTurnIndicator = observer(function CurrentTurnIndicator() {
  const { room, currentPlayerName } = store;
  const { t } = useTranslation();

  if (room === undefined) return null;

  const value = currentPlayerName ?? "—";

  return (
    <Surface className="mt-1 px-3 py-1.5 rounded-lg flex flex-col gap-1 min-w-[140px]">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-neutral-400">{t("currentTurn.label")}</span>
        <Chip size="sm" variant="soft" color="accent">
          {value}
        </Chip>
      </div>
    </Surface>
  );
});
