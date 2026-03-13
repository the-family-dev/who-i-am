"use client";
import { observer } from "mobx-react-lite";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect } from "react";
import { SocketEvents } from "@/server/types";
import { socket } from "@/lib/socket";
import { store } from "@/store/store";
import { toast } from "@heroui/react";

export const SocketEventsHandler = observer(function SocketEventsHandler() {
  const router = useRouter();
  const pathname = usePathname();

  useLayoutEffect(() => {
    store.setRouter(router);
    store.setPathname(pathname);

    store.requestStoredName();
  }, []);

  useEffect(() => {
    socket.on(SocketEvents.RoomCreated, (room) => {
      store.setRoom(room);
      router.push(`/game/${room.roomCode}`);
    });

    socket.on(SocketEvents.RoomUpdated, (room) => {
      store.setRoom(room);
    });

    socket.on(SocketEvents.WordGuessed, () => {
      store.triggerConfetti();
    });

    socket.on(SocketEvents.AnyError, (message) => {
      toast.danger(message);
    });

    socket.on(SocketEvents.UserKicked, () => {
      store.handleKicked();
      toast.warning("Вас исключили из комнаты");
    });

    socket.on(SocketEvents.ReciveMessage, (message) => {
      store.reciveMessage(message);
    });

    socket.on(SocketEvents.UserJoined, (room) => {
      store.setRoom(room);

      router.push(`/game/${room.roomCode}`);
    });

    return () => {
      socket.removeAllListeners();
    };
  }, []);

  return null;
});
