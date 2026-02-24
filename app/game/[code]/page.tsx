"use client";
import Link from "next/link";
import { Chat } from "@/components/chat";
import { observer } from "mobx-react-lite";
import { useParams } from "next/navigation";
import { store } from "@/store/store";
import { UsersList } from "@/components/users-list";
import { useEffect } from "react";

export default observer(function Game() {
  const { userName, room } = store;

  const { code } = useParams<{ code?: string }>();

  useEffect(() => {
    store.loginToRoom(code);
  }, []);

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
      <div className="flex flex-col ga-2">
        Комната не найдена
        <Link href={"/register"}>Ввести имя</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-4 h-full">
      <UsersList users={room.users} />
      <div>{room.roomCode}</div>
      <Chat />
    </div>
  );
});
