"use client";

import { observer } from "mobx-react-lite";
import { TUser } from "@/server/types";
import { CrownIcon, UserXIcon, WifiOffIcon } from "lucide-react";
import { Button, Surface } from "@heroui/react";
import { store } from "@/store/store";
import { useTranslation } from "react-i18next";

export type RoomUserCardProps = {
  user: TUser;
};

export const RoomUserCard = observer<RoomUserCardProps>(function RoomUserCard({
  user,
}) {
  const { t } = useTranslation();
  const canKick =
    store.isAdmin && store.userName !== undefined && user.name !== store.userName;

  return (
    <Surface className="flex flex-row items-center gap-2 min-w-0">
      {user.isAdmin && (
        <CrownIcon
          className="size-4 shrink-0 text-amber-500"
          aria-label={t("roomUser.admin")}
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
          aria-label={t("roomUser.offline")}
        />
      )}
      {canKick && (
        <Button
          isIconOnly
          size="sm"
          variant="danger-soft"
          aria-label={t("roomUser.kick")}
          onPress={() => store.kickUser(user.name)}
        >
          <UserXIcon className="size-4" />
        </Button>
      )}
    </Surface>
  );
});
