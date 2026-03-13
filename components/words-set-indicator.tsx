"use client";

import { observer } from "mobx-react-lite";
import { Chip, Surface } from "@heroui/react";
import { store } from "@/store/store";
import { GameStates } from "@/server/types";

export const WordsSetIndicator = observer(function WordsSetIndicator() {
  const { room, wordsSetCount, totalPlayerCount } = store;

  if (
    room === undefined ||
    room.state !== GameStates.Idle ||
    totalPlayerCount === 0
  ) {
    return null;
  }

  const progressPercent =
    totalPlayerCount > 0 ? (wordsSetCount / totalPlayerCount) * 100 : 0;

  return (
    <Surface className="mt-1 px-3 py-1.5 rounded-lg flex flex-col gap-1 min-w-[140px]">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-neutral-400">Загадано слов</span>
        <Chip size="sm" variant="soft" color="default">
          {wordsSetCount} из {totalPlayerCount}
        </Chip>
      </div>
      <div
        className="h-1.5 w-full rounded-full bg-neutral-700 overflow-hidden"
        role="progressbar"
        aria-valuenow={wordsSetCount}
        aria-valuemin={0}
        aria-valuemax={totalPlayerCount}
        aria-label={`Загадано слов ${wordsSetCount} из ${totalPlayerCount}`}
      >
        <div
          className="h-full bg-accent rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </Surface>
  );
});
