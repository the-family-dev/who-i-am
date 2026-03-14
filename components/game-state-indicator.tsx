"use client";

import { observer } from "mobx-react-lite";
import { Chip, Surface } from "@heroui/react";
import { store } from "@/store/store";
import { useTranslation } from "react-i18next";
import { GameStates } from "@/server/types";

export const GameStateIndicator = observer(function GameStateIndicator() {
  const { room, isPlaying } = store;
  const { t } = useTranslation();

  if (room === undefined) return null;

  const { state } = room;
  const value =
    state === GameStates.Idle
      ? t("gameState.idle")
      : state === GameStates.Playing
        ? t("gameState.playing")
        : t("gameState.unknown");
  const chipColor = isPlaying ? "success" : "default";

  return (
    <Surface className="mt-1 px-3 py-1.5 rounded-lg flex flex-col gap-1 min-w-[140px]">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-neutral-400">{t("gameState.label")}</span>
        <Chip size="sm" variant="soft" color={chipColor}>
          {value}
        </Chip>
      </div>
    </Surface>
  );
});
