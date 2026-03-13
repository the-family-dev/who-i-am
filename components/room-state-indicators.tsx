"use client";

import { observer } from "mobx-react-lite";
import { GameStateIndicator } from "./game-state-indicator";
import { CurrentTurnIndicator } from "./current-turn-indicator";
import { WordsSetIndicator } from "./words-set-indicator";
import { GuessProgressIndicator } from "./guess-progress-indicator";
import { store } from "@/store/store";

/**
 * Индикаторы состояния комнаты:
 * - Состояние игры — всегда
 * - Текущий ход — только когда игра начата (Playing)
 * - Загадано слов — только когда игра в ожидании (Idle), внутри WordsSetIndicator
 * - Отгадали слово — только когда игра в процессе (Playing)
 */
export const RoomStateIndicators = observer(function RoomStateIndicators() {
  const { room, isPlaying } = store;

  if (room === undefined) return null;

  return (
    <div className="flex flex-row gap-2">
      <GameStateIndicator />
      {isPlaying ? <CurrentTurnIndicator /> : null}
      <WordsSetIndicator />
      {isPlaying ? <GuessProgressIndicator /> : null}
    </div>
  );
});
