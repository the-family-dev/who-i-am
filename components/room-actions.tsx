import { store } from "@/store/store";
import { Dropdown, Label } from "@heroui/react";
import { observer } from "mobx-react-lite";
import {
  MoreVerticalIcon,
  PlayIcon,
  SquareIcon,
   SkipForwardIcon,
   RotateCwIcon,
  CheckCircleIcon,
  EyeIcon,
   LogOutIcon,
   FlagIcon,
   CopyIcon,
} from "lucide-react";
import { toast } from "@heroui/react";
import { RoomParticipantsList } from "./room-participants-list";
import { GameStates } from "@/server/types";

export const RoomActions = observer(function RoomActions() {
  const {
    room,
    isAdmin,
    isPlaying,
    isMyTurn,
    canConfirmGuess,
    canBecomeSpectator,
    allPlayersHaveSetWords,
  } = store;

  if (room === undefined) return null;

  return (
    <div className="flex flex-row gap-2 items-center">
      <Dropdown>
      <Dropdown.Trigger
        aria-label="Menu"
        className="button button-md button--secondary button--icon-only data-[focus-visible=true]:status-focused"
      >
        <MoreVerticalIcon className="size-6" />
      </Dropdown.Trigger>
        <Dropdown.Popover placement="bottom end">
          <Dropdown.Menu aria-label="Действия комнаты">
            {isAdmin ? (
              <Dropdown.Section aria-label="Управление игрой">
                <Dropdown.Item
                  textValue="Начать игру"
                  className="text-success"
                  isDisabled={!allPlayersHaveSetWords}
                  onPress={() => store.setRoomState(GameStates.Playing)}
                >
                  <PlayIcon className="size-4 shrink-0 text-success" />
                  <Label className="text-success">Начать игру</Label>
                </Dropdown.Item>
                <Dropdown.Item
                  textValue="Завершить игру"
                  className="text-warning"
                  onPress={() => store.setRoomState(GameStates.Idle)}
                >
                  <SquareIcon className="size-4 shrink-0 text-warning" />
                  <Label className="text-warning">Завершить игру</Label>
                </Dropdown.Item>
                {isPlaying ? (
                  <Dropdown.Item
                    textValue="Следующий ход"
                    className="text-accent"
                    onPress={() => store.nextTurn()}
                  >
                    <SkipForwardIcon className="size-4 shrink-0 text-accent" />
                    <Label className="text-accent">Следующий ход</Label>
                  </Dropdown.Item>
                ) : null}
                <Dropdown.Item
                  textValue="Рестарт игры"
                  className="text-accent"
                  onPress={() => store.restartGame()}
                >
                  <RotateCwIcon className="size-4 shrink-0 text-accent" />
                  <Label className="text-accent">Рестарт игры</Label>
                </Dropdown.Item>
              </Dropdown.Section>
            ) : null}
            {isMyTurn ? (
              <Dropdown.Item
                textValue="Закончить ход"
                className="text-accent"
                onPress={() => store.nextTurn()}
              >
                <FlagIcon className="size-4 shrink-0 text-accent" />
                <Label className="text-accent">Закончить ход</Label>
              </Dropdown.Item>
            ) : null}
            {canConfirmGuess ? (
              <Dropdown.Item
                textValue="Слово угадано"
                className="text-success"
                onPress={() => store.makeGuess()}
              >
                <CheckCircleIcon className="size-4 shrink-0 text-success" />
                <Label className="text-success">Слово угадано</Label>
              </Dropdown.Item>
            ) : null}
            {canBecomeSpectator ? (
              <Dropdown.Item
                textValue="Стать зрителем"
                className="text-muted"
                onPress={() => store.becomeSpectator()}
              >
                <EyeIcon className="size-4 shrink-0 text-secondary-foreground" />
                <Label className="text-muted">Стать зрителем</Label>
              </Dropdown.Item>
            ) : null}
            <Dropdown.Item
              textValue="Копировать код комнаты"
              className="text-muted"
              onPress={async () => {
                try {
                  await navigator.clipboard.writeText(room.roomCode);
                  toast.success("Код комнаты скопирован");
                } catch {
                  toast.danger("Не удалось скопировать");
                }
              }}
            >
              <CopyIcon className="size-4 shrink-0 text-muted" />
              <Label className="text-muted">Копировать код комнаты</Label>
            </Dropdown.Item>
            <Dropdown.Section aria-label="Выход">
              <Dropdown.Item
                textValue="Выйти"
                className="text-danger"
                isDisabled={isPlaying}
                onPress={() => store.leaveRoom()}
              >
                <LogOutIcon className="size-4 shrink-0 text-danger" />
                <Label className="text-danger">Выйти</Label>
              </Dropdown.Item>
            </Dropdown.Section>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
      <RoomParticipantsList />
    </div>
  );
});
