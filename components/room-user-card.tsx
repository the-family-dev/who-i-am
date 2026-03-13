"use client";

import { observer } from "mobx-react-lite";
import { TUser } from "@/server/types";
import {
  Crown as CrownIcon,
  UserX as UserXIcon,
  WifiOff as WifiOffIcon,
} from "lucide-react";
import { Button, Surface } from "@heroui/react";
import { store } from "@/store/store";

export type RoomUserCardProps = {
  user: TUser;
};

export const RoomUserCard = observer<RoomUserCardProps>(function RoomUserCard({
  user,
}) {
  const canKick =
    store.isAdmin && store.userName !== undefined && user.name !== store.userName;

  return (
    <Surface className="flex flex-row items-center gap-2 min-w-0">
      {user.isAdmin && (
        <CrownIcon
          className="size-4 shrink-0 text-amber-500"
          aria-label="Администратор"
        />
      )}
      <span
        className={`font-medium truncate flex-1 min-w-0 ${user.disconnected ? "text-muted opacity-70" : ""}`}
      >
        {user.name}
      </span>
      {user.disconnected && (
        <WifiOffIcon
          className="size-4 shrink-0 text-muted"
          aria-label="Не в сети"
        />
      )}
      {canKick && (
        <Button
          isIconOnly
          size="sm"
          variant="danger-soft"
          aria-label="Исключить из комнаты"
          onPress={() => store.kickUser(user.name)}
        >
          <UserXIcon className="size-4" />
        </Button>
      )}
    </Surface>
  );
});
