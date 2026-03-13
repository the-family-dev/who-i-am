import { store } from "@/store/store";
import { Button } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { SpectatorsList } from "./spectators-list";
import { AdminActions } from "./admin-actions";
import { GameStates } from "@/server/types";

export const RoomActions = observer(function RoomActions() {
  const { room, isPlayer, isPlaying, currentPlayerName, isMyTurn } = store;

  if (room === undefined) return null;

  const canConfirmGuess =
    isPlaying && isPlayer && !!currentPlayerName && !isMyTurn;

  const handleWordGuessed = () => {
    if (!canConfirmGuess) return;

    store.makeGuess();
  };

  const canBecomeSpectator = isPlayer && room.state === GameStates.Idle;

  return (
    <div className="flex flex-row gap-2">
      {canConfirmGuess ? (
        <div className="flex flex-row gap-2 items-center mt-1">
          <Button className="shrink-0 bg-success" onPress={handleWordGuessed}>
            Слово угадано
          </Button>
        </div>
      ) : null}
      <AdminActions />

      {canBecomeSpectator ? (
        <Button onPress={() => store.becomeSpectator()}>Стать зрителем</Button>
      ) : null}
      <Button onPress={() => store.leaveRoom()} variant="danger">
        Выйти
      </Button>
      <SpectatorsList />
    </div>
  );
});
