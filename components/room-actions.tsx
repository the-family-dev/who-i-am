import { store } from "@/store/store";
import { Dropdown, Label } from "@heroui/react";
import { observer } from "mobx-react-lite";
import {
  MoreVertical,
  Play,
  Square,
  SkipForward,
  RotateCw,
  CheckCircle,
  Eye,
  LogOut,
  Flag,
} from "lucide-react";
import { SpectatorsList } from "./spectators-list";
import { GameStates } from "@/server/types";

export const RoomActions = observer(function RoomActions() {
  const {
    room,
    isAdmin,
    isPlaying,
    isMyTurn,
    canConfirmGuess,
    canBecomeSpectator,
    totalPlayerCount,
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
        <MoreVertical className="size-6" />
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
                  <Play className="size-4 shrink-0 text-success" />
                  <Label className="text-success">Начать игру</Label>
                </Dropdown.Item>
                <Dropdown.Item
                  textValue="Завершить игру"
                  className="text-warning"
                  onPress={() => store.setRoomState(GameStates.Idle)}
                >
                  <Square className="size-4 shrink-0 text-warning" />
                  <Label className="text-warning">Завершить игру</Label>
                </Dropdown.Item>
                {isPlaying ? (
                  <Dropdown.Item
                    textValue="Следующий ход"
                    className="text-accent"
                    onPress={() => store.nextTurn()}
                  >
                    <SkipForward className="size-4 shrink-0 text-accent" />
                    <Label className="text-accent">Следующий ход</Label>
                  </Dropdown.Item>
                ) : null}
                <Dropdown.Item
                  textValue="Рестарт игры"
                  className="text-accent"
                  onPress={() => store.restartGame()}
                >
                  <RotateCw className="size-4 shrink-0 text-accent" />
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
                <Flag className="size-4 shrink-0 text-accent" />
                <Label className="text-accent">Закончить ход</Label>
              </Dropdown.Item>
            ) : null}
            {canConfirmGuess ? (
              <Dropdown.Item
                textValue="Слово угадано"
                className="text-success"
                onPress={() => store.makeGuess()}
              >
                <CheckCircle className="size-4 shrink-0 text-success" />
                <Label className="text-success">Слово угадано</Label>
              </Dropdown.Item>
            ) : null}
            {canBecomeSpectator ? (
              <Dropdown.Item
                textValue="Стать зрителем"
                className="text-muted"
                onPress={() => store.becomeSpectator()}
              >
                <Eye className="size-4 shrink-0 text-secondary-foreground" />
                <Label className="text-muted">Стать зрителем</Label>
              </Dropdown.Item>
            ) : null}
            <Dropdown.Section aria-label="Выход">
              <Dropdown.Item
                textValue="Выйти"
                className="text-danger"
                isDisabled={isPlaying}
                onPress={() => store.leaveRoom()}
              >
                <LogOut className="size-4 shrink-0 text-danger" />
                <Label className="text-danger">Выйти</Label>
              </Dropdown.Item>
            </Dropdown.Section>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
      <SpectatorsList />
    </div>
  );
});
