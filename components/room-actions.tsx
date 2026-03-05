import { store } from "@/store/store";
import { Button } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { SpectatorsList } from "./spectators-list";

export const RoomActions = observer(function RoomActions() {
  const { room, isPlayer, isSpectator } = store;

  if (room === undefined) return null;

  return (
    <div className="flex flex-row gap-2">
      {isPlayer ? (
        <Button onPress={() => store.becomeSpectator()}>Стать зрителем</Button>
      ) : null}
      <Button onPress={() => store.leaveRoom()} variant="danger">
        Выйти
      </Button>
      <SpectatorsList />
    </div>
  );
});
