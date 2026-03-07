"use client";
import { observer } from "mobx-react-lite";
import { NameLabel } from "./name-label";
import { RoomActions } from "./room-actions";
import { store } from "@/store/store";
import { GameStates } from "@/server/types";
import { Button } from "@heroui/react";

export const GameHeader = observer(() => {
  const { room, currentPlayerName } = store;

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
          </>
        ) : null}
      </div>
      <RoomActions />
    </div>
  );
});
