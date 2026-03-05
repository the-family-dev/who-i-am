"use client";
import { observer } from "mobx-react-lite";
import { NameLabel } from "./name-label";
import { store } from "@/store/store";
import { RoomActions } from "./room-actions";

export const GameHeader = observer(() => {
  return (
    <div className="flex flex-row items-end justify-between w-full h-fit">
      <NameLabel />
      <RoomActions />
    </div>
  );
});
