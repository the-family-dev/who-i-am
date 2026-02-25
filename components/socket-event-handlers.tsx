"use client";
import { observer } from "mobx-react-lite";
import { useEffect, useLayoutEffect } from "react";
import { SocketEvents } from "@/server/types";
import { socket } from "@/lib/socket";
import { store } from "../store/store";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "@heroui/react";

export const SocketEventsHandler = observer(function SocketEventsHandler() {
  console.log("socket handler rendered");

  const router = useRouter();
  const pathname = usePathname();

  useLayoutEffect(() => {
    store.setRouter(router);
    store.setPathname(pathname);

    store.requestStoredName();
  }, []);

  useEffect(() => {
    socket.on(SocketEvents.RoomCreated, (room) => {
      console.log(SocketEvents.RoomCreated, room);

      store.setRoom(room);
      router.push(`/game/${room.roomCode}`);
    });

    socket.on(SocketEvents.RoomUsersUpdated, (users) => {
      console.log(SocketEvents.RoomUsersUpdated, users);

      store.setRoomUsers(users);
    });

    socket.on(SocketEvents.RoomNotFound, (code) => {
      toast.danger(`Комната ${code} не найдена`);
      router.push(`/`);
    });

    socket.on(SocketEvents.UserNameExists, (name) => {
      toast.warning(`Имя ${name} уже занято`);
    });

    socket.on(SocketEvents.ReciveMessage, (message) => {
      store.reciveMessage(message);
    });

    socket.on(SocketEvents.MyUserJoined, (user) => {
      console.log(SocketEvents.MyUserJoined, { user });
      store.setUser(user);
    });

    socket.on(SocketEvents.UserJoined, (room) => {
      console.log(SocketEvents.UserJoined, room);

      store.setRoom(room);

      router.push(`/game/${room.roomCode}`);
    });

    return () => {
      console.log("socket handler unmounted");
    };
  }, []);

  return null;
});
