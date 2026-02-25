"use client";
import { observer } from "mobx-react-lite";
import { NameLabel } from "./name-label";
import { Button } from "@heroui/react";
import { store } from "@/store/store";

export const GameHeader = observer(() => {
  const { room } = store;

  return (
    <div className="flex flex-row items-end justify-between w-full h-fit">
      <NameLabel />
      {room ? (
        <Button onPress={() => store.leaveRoom()} variant="danger">
          Выйти
        </Button>
      ) : null}
    </div>
  );
});
