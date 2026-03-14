"use client";
import { Chat } from "@/components/chat";
import { observer } from "mobx-react-lite";
import { useParams } from "next/navigation";
import { store } from "@/store/store";
import { Button } from "@heroui/react";
import { GameTable } from "@/components/game-table";
import { AddTableButton } from "@/components/add-table-button";
import { useTranslation } from "react-i18next";

export default observer(function Game() {
  const { userName, room, isPlaying } = store;
  const { t } = useTranslation();
  const { code } = useParams<{ code?: string }>();

  if (userName === undefined) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <p className="text-default-500 text-sm">{t("game.needName")}</p>
          <Button
            className="min-w-40"
            onPress={() => store.router?.push("/register")}
          >
            {t("game.enterName")}
          </Button>
        </div>
      </div>
    );
  }

  if (room === undefined) {
    return (
      <div className="flex flex-col gap-4 w-50 max-w-sm">
        {code ? (
          <p className="text-default-500 text-lg text-center">
            {t("game.roomLabel")}{" "}
            <span className="font-mono font-semibold text-foreground">{code}</span>
          </p>
        ) : null}
        <Button className={"w-full"} onPress={() => store.joinRoomByLink(code)}>
          {t("common.enter")}
        </Button>
        <Button
          variant="secondary"
          className={"w-full"}
          onPress={() => store.router?.push("/")}
        >
          {t("game.toHome")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-4 h-full w-full justify-between relative">
      <div className="flex flex-row gap-8 flex-wrap w-full">
        {room.tables.map((table) => (
          <GameTable key={table.id} table={table} />
        ))}
        {isPlaying ? null : <AddTableButton />}
      </div>
      <Chat />
    </div>
  );
});
