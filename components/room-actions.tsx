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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  if (room === undefined) return null;

  const playerName = currentPlayerName ?? "—";

  const handleCopyRoomLink = async () => {
    try {
      const url =
        typeof window !== "undefined"
          ? `${window.location.origin}/game/${room.roomCode}`
          : "";
      await navigator.clipboard.writeText(url);
      toast.success(t("toast.roomLinkCopied"));
    } catch {
      toast.danger(t("toast.copyFailed"));
    }
  };

  const otherSection = (
    <Dropdown.Section aria-label={t("roomActions.other")}>
      <Header>{t("roomActions.other")}</Header>
      <Dropdown.Item
        textValue={t("roomActions.becomeSpectator")}
        className="text-muted"
        isDisabled={!canBecomeSpectator}
        onPress={() => store.becomeSpectator()}
      >
        <EyeIcon className="size-4 shrink-0 text-secondary-foreground" />
        <Label className="text-muted">{t("roomActions.becomeSpectator")}</Label>
      </Dropdown.Item>
      <Dropdown.Item
        textValue={t("roomActions.copyRoomCode")}
        className="text-muted"
        onPress={async () => {
          try {
            await navigator.clipboard.writeText(room.roomCode);
            toast.success(t("toast.roomCodeCopied"));
          } catch {
            toast.danger(t("toast.copyFailed"));
          }
        }}
      >
        <CopyIcon className="size-4 shrink-0 text-muted" />
        <Label className="text-muted">{t("roomActions.copyRoomCode")}</Label>
      </Dropdown.Item>
      <Dropdown.Item
        textValue={t("roomActions.copyRoomLink")}
        className="text-muted"
        onPress={handleCopyRoomLink}
      >
        <LinkIcon className="size-4 shrink-0 text-muted" />
        <Label className="text-muted">{t("roomActions.copyRoomLink")}</Label>
      </Dropdown.Item>
      <Dropdown.Item
        textValue={t("roomActions.leave")}
        className="text-danger"
        isDisabled={isPlaying}
        onPress={() => store.leaveRoom()}
      >
        <LogOutIcon className="size-4 shrink-0 text-danger" />
        <Label className="text-danger">{t("roomActions.leave")}</Label>
      </Dropdown.Item>
    </Dropdown.Section>
  );

  const adminSection = (
    <Dropdown.Section aria-label={t("roomActions.management")}>
      <Header>{t("roomActions.management")}</Header>
      <Dropdown.Item
        textValue={t("roomActions.startGame")}
        className="text-success"
        isDisabled={!allPlayersHaveSetWords || isPlaying}
        onPress={() => store.setRoomState(GameStates.Playing)}
      >
        <PlayIcon className="size-4 shrink-0 text-success" />
        <Label className="text-success">{t("roomActions.startGame")}</Label>
      </Dropdown.Item>
      <Dropdown.Item
        textValue={t("roomActions.endGame")}
        className="text-warning"
        onPress={() => store.setRoomState(GameStates.Idle)}
      >
        <SquareIcon className="size-4 shrink-0 text-warning" />
        <Label className="text-warning">{t("roomActions.endGame")}</Label>
      </Dropdown.Item>
      {isPlaying ? (
        <Dropdown.Item
          textValue={t("roomActions.nextTurn")}
          className="text-accent"
          onPress={() => store.nextTurn()}
        >
          <SkipForwardIcon className="size-4 shrink-0 text-accent" />
          <Label className="text-accent">{t("roomActions.nextTurn")}</Label>
        </Dropdown.Item>
      ) : null}
      <Dropdown.Item
        textValue={t("roomActions.restartGame")}
        className="text-accent"
        onPress={() => store.restartGame()}
      >
        <RotateCwIcon className="size-4 shrink-0 text-accent" />
        <Label className="text-accent">{t("roomActions.restartGame")}</Label>
      </Dropdown.Item>
    </Dropdown.Section>
  );

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
        {t("roomActions.finishTurn")}
      </Button>
      <Button
        variant="secondary"
        size="sm"
        isDisabled={!canConfirmGuess}
        onPress={() => store.makeGuess()}
        className="text-success"
      >
        <CheckCircleIcon className="size-4 shrink-0" />
        {t("roomActions.guessedWord", { name: playerName })}
      </Button>
    </>
  );

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
          <Dropdown.Menu aria-label={t("roomActions.menuAria")}>
            {isAdmin ? adminSection : null}
            {otherSection}
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
      <RoomParticipantsList />
    </div>
  );
});
