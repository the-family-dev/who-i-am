"use client";
import { observer } from "mobx-react-lite";
import { NameLabel } from "./name-label";
import { Button } from "@heroui/react";
import { store } from "@/store/store";
import { SpectatorsList } from "./spectators-list";

export const GameHeader = observer(() => {
  const { room } = store;

  return (
    <div className="flex flex-row items-end justify-between w-full h-fit">
      <NameLabel />
      <div className="flex flex-row gap-2">
        {room ? (
          <Button onPress={() => store.becomeSpectator()}>
            Стать зрителем
          </Button>
        ) : null}
        <SpectatorsList />
        {room ? (
          <Button onPress={() => store.leaveRoom()} variant="danger">
            Выйти
          </Button>
        ) : null}
      </div>
    </div>
  );
});
