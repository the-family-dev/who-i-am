"use client";

import { observer } from "mobx-react-lite";
import { TUser } from "@/server/types";
import { Crown as CrownIcon, WifiOff as WifiOffIcon } from "lucide-react";
import { Surface } from "@heroui/react";

export type RoomUserCardProps = {
  user: TUser;
};

export const RoomUserCard = observer<RoomUserCardProps>(function RoomUserCard({
  user,
}) {
  return (
    <Surface className="flex flex-row items-center gap-2 min-w-0">
          {user.isAdmin && (
            <CrownIcon
              className="size-4 shrink-0 text-amber-500"
              aria-label="Администратор"
            />
          )}
          <span
            className={`font-medium truncate ${user.disconnected ? "text-muted opacity-70" : ""}`}
          >
            {user.name}
          </span>
          {user.disconnected && (
            <WifiOffIcon
              className="size-4 shrink-0 text-muted"
              aria-label="Не в сети"
            />
          )}
    </Surface>
  );
});
