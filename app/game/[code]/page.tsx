"use client";
import Link from "next/link";
import { Chat } from "@/components/chat";
import { observer } from "mobx-react-lite";
import { useParams } from "next/navigation";
import { store } from "@/store/store";
import UserCard from "@/components/user-card";
import { Button } from "@heroui/react";

export default observer(function Game() {
  const { userName, room } = store;

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
    <div className="flex flex-row gap-4 h-full w-full justify-between">
      <div className="flex flex-row gap-8 flex-wrap w-full">
        {room.users.map((user) => (
          <UserCard key={user.socketId} user={user} secret={"user.secret"} />
        ))}
      </div>
      <Chat />
    </div>
  );
});
