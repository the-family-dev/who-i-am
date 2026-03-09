"use client";
import Link from "next/link";
import { Chat } from "@/components/chat";
import { observer } from "mobx-react-lite";
import { useParams } from "next/navigation";
import { store } from "@/store/store";
import { Button } from "@heroui/react";
import { GameTable } from "../../../components/game-table";
import { AddTableButton } from "../../../components/add-table-button";
import { EmojiConfetti } from "@/components/emoji-confetti";

export default observer(function Game() {
  const { userName, room, isPlaying } = store;

  const { code } = useParams<{ code?: string }>();

  if (userName === undefined) {
    return (
      <div className="flex flex-col ga-2">
        Нет имени
        <Link href={"/register"}>Ввести имя</Link>
      </div>
    );
  }

  if (room === undefined) {
    return (
      <div className="flex flex-col gap-4 w-50">
        <Button className={"w-full"} onPress={() => store.joinRoomByLink(code)}>
          Войти
        </Button>
        <Button
          variant="secondary"
          className={"w-full"}
          onPress={() => store.router?.push("/")}
        >
          На глвную
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-4 h-full w-full justify-between relative">
      <EmojiConfetti />
      <div className="flex flex-row gap-8 flex-wrap w-full">
        {room.tabels.map((table) => (
          <GameTable key={table.id} table={table} />
        ))}
        {isPlaying ? null : <AddTableButton />}
      </div>
      <Chat />
    </div>
  );
});
