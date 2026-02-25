"use client";
import Link from "next/link";
import { Chat } from "@/components/chat";
import { observer } from "mobx-react-lite";
import { useParams } from "next/navigation";
import { store } from "@/store/store";
import { useEffect } from "react";
import UserCard from "../../../components/user-card";

export default observer(function Game() {
  const { userName, room } = store;

  const { code } = useParams<{ code?: string }>();

  useEffect(() => {
    store.loginToRoom(code);

    return () => {
      store.leaveRoom();
    };
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
