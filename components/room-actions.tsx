import { store } from "@/store/store";
import { Button, Dropdown, Header, Label } from "@heroui/react";
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
  LinkIcon,
} from "lucide-react";
import { toast } from "@heroui/react";
import { RoomParticipantsList } from "@/components/room-participants-list";
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
    currentPlayerName,
  } = store;

  if (room === undefined) return null;


  const playerName = currentPlayerName ?? "—";

  const handleCopyRoomLink = async () => {
    try {
      const url =
        typeof window !== "undefined"
          ? `${window.location.origin}/game/${room.roomCode}`
          : "";
      await navigator.clipboard.writeText(url);
      toast.success("Ссылка на комнату скопирована");
    } catch {
      toast.danger("Не удалось скопировать");
    }
  };


  const otherSection = (
    <Dropdown.Section aria-label="Прочее">
      <Header>Прочее</Header>
      <Dropdown.Item
        textValue="Стать зрителем"
        className="text-muted"
        isDisabled={!canBecomeSpectator}
        onPress={() => store.becomeSpectator()}
      >
        <EyeIcon className="size-4 shrink-0 text-secondary-foreground" />
        <Label className="text-muted">Стать зрителем</Label>
      </Dropdown.Item>
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
      <Dropdown.Item
        textValue="Копировать ссылку на комнату"
        className="text-muted"
        onPress={handleCopyRoomLink}
      >
        <LinkIcon className="size-4 shrink-0 text-muted" />
        <Label className="text-muted">Копировать ссылку на комнату</Label>
      </Dropdown.Item>
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
  )

  const adminSection = (
    <Dropdown.Section aria-label="Управление">
      <Header>Управление</Header>
      <Dropdown.Item
        textValue="Начать игру"
        className="text-success"
        isDisabled={!allPlayersHaveSetWords || isPlaying}
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

  )

  const gameActions = (
    <>
      <Button
        variant="secondary"
        isDisabled={!isMyTurn}
        size="sm"
        onPress={() => store.finishMyTurn()}
        className="text-accent"
      >
        <FlagIcon className="size-4 shrink-0" />
        Закончить ход
      </Button>
      <Button
        variant="secondary"
        size="sm"
        isDisabled={!canConfirmGuess}
        onPress={() => store.makeGuess()}
        className="text-success"
      >
        <CheckCircleIcon className="size-4 shrink-0" />
        {playerName} угадал(а) слово
      </Button>
    </>
  )

  return (
    <div className="flex flex-row gap-2 items-center">
      {isPlaying ? gameActions : null}

      <Dropdown>
        <Dropdown.Trigger
          aria-label="Menu"
          className="button button-md button--secondary button--icon-only data-[focus-visible=true]:status-focused"
        >
          <MoreVerticalIcon className="size-6" />
        </Dropdown.Trigger>
        <Dropdown.Popover placement="bottom end">
          <Dropdown.Menu aria-label="Действия комнаты">
            {isAdmin ? adminSection : null}
            {otherSection}
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
      <RoomParticipantsList />
    </div>
  );
});
