"use client";
import { observer } from "mobx-react-lite";
import { NameLabel } from "./name-label";
import { RoomActions } from "./room-actions";
import { store } from "@/store/store";
import { GameStates } from "@/server/types";
import { Button } from "@heroui/react";

export const GameHeader = observer(() => {
  const { room, userName, isPlayer } = store;

  const isPlaying = room?.state === GameStates.Playing;

  const currentTable = room?.currentTableId
    ? room.tabels.find((t) => t.id === room.currentTableId)
    : undefined;

  const currentPlayerName = currentTable?.player?.name;
  const isMyTurn = isPlaying && currentPlayerName === userName;
  const canConfirmGuess =
    isPlaying && isPlayer && !!currentPlayerName && !isMyTurn;

  const handleWordGuessed = () => {
    if (!canConfirmGuess) return;

    store.makeGuess();
  };

  return (
    <div className="flex flex-row items-end justify-between w-full h-fit gap-4">
      <NameLabel />
      <div className="flex flex-col items-center gap-1 flex-1">
        {room ? (
          <>
            <div className="text-sm text-neutral-400">
              Состояние игры:{" "}
              {room.state === GameStates.Playing ? "Игра" : "Ожидание"}
            </div>
            <div className="text-sm">
              Текущий ход: {currentPlayerName ?? "—"}
            </div>
            {canConfirmGuess ? (
              <div className="flex flex-row gap-2 items-center mt-1">
                <Button
                  size="sm"
                  variant="secondary"
                  className="shrink-0"
                  onPress={handleWordGuessed}
                >
                  Слово угадано
                </Button>
              </div>
            ) : null}
          </>
        ) : null}
      </div>
      <RoomActions />
    </div>
  );
});
