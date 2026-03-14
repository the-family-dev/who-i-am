"use client";

import { observer } from "mobx-react-lite";
import { RoomUserCard } from "./room-user-card";
import { Button, Popover } from "@heroui/react";
import { UsersIcon } from "lucide-react";
import { store } from "@/store/store";
import { useTranslation } from "react-i18next";

export const RoomParticipantsList = observer(function RoomParticipantsList() {
  const { room } = store;
  const { t } = useTranslation();

  if (room === undefined) return null;

  const players = room.tables
    .map((t) => t.player)
    .filter((p): p is NonNullable<typeof p> => p !== undefined);
  const spectators = room.spectators;

  const playersCount = players.length;
  const spectatorsCount = spectators.length;

  return (
    <Popover>
      <Button className="shrink-0" variant="secondary" isIconOnly>
        <UsersIcon className="size-5" />
      </Button>
      <Popover.Content placement="left bottom" className="max-w-72">
        <Popover.Dialog>
          <div className="w-full flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <div className="text-xs text-neutral-400 font-medium">
                {t("participants.players")} ({playersCount})
              </div>
              <div className="flex flex-col gap-1.5">
                {playersCount === 0 ? (
                  <span className="text-sm text-muted">{t("participants.noPlayers")}</span>
                ) : (
                  players.map((user) => (
                    <RoomUserCard key={user.socketId} user={user} />
                  ))
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 border-t border-neutral-700/50 pt-2">
              <div className="text-xs text-neutral-400 font-medium">
                {t("participants.spectators")} ({spectatorsCount})
              </div>
              <div className="flex flex-col gap-1.5">
                {spectatorsCount === 0 ? (
                  <span className="text-sm text-muted">{t("participants.noSpectators")}</span>
                ) : (
                  spectators.map((user) => (
                    <RoomUserCard key={user.socketId} user={user} />
                  ))
                )}
              </div>
            </div>
          </div>
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  );
});
