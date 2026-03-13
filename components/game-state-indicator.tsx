"use client";

import { observer } from "mobx-react-lite";
import { Chip, Surface } from "@heroui/react";
import { store } from "@/store/store";

export const GameStateIndicator = observer(function GameStateIndicator() {
  const { room, isPlaying } = store;

  if (room === undefined) return null;

  const label = "Состояние игры";
  const value = isPlaying ? "Игра" : "Ожидание";
  const chipColor = isPlaying ? "success" : "default";

  return (
    <Surface className="mt-1 px-3 py-1.5 rounded-lg flex flex-col gap-1 min-w-[140px]">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-neutral-400">{label}</span>
        <Chip size="sm" variant="soft" color={chipColor}>
          {value}
        </Chip>
      </div>
    </Surface>
  );
});
