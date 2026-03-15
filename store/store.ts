"use-client";
import { makeAutoObservable } from "mobx";
import {
  GameStates,
  SocketEvents,
  TMessage,
  TRoom,
  TUser,
} from "@/server/types";
import { socket } from "@/lib/socket";
import { TypedStorage } from "@/utils/storage";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "@heroui/react";

export enum LoginType {
  Join = "join",
  Create = "create",
}

type TLoginForm = {
  roomCode: string;
  type: LoginType;
};

type TChat = {
  inputMessage: string;
  messages: TMessage[];
};

const nameStorageKey = "nameKey";

class Store {
  loginForm: TLoginForm = this._getLoginFormDefaultState();
  chat: TChat = {
    inputMessage: "",
    messages: [],
  };

  private _nameStorage = new TypedStorage<string | undefined>(
    nameStorageKey,
    undefined,
  );

  userName: string | undefined = undefined;

  room: TRoom | undefined = undefined;

  fromPath: string | undefined = undefined;

  router: ReturnType<typeof useRouter> | undefined = undefined;
  pathname: ReturnType<typeof usePathname> | undefined = undefined;

  constructor() {
    makeAutoObservable(this);
  }

  get isSpectator() {
    if (this.room === undefined) return false;

    return this.room.spectators.some((user) => user.name === this.userName);
  }

  get isPlayer() {
    if (this.room === undefined) return false;

    return this.room.tables.some(
      (table) => table.player?.name === this.userName,
    );
  }

  get currentTableId() {
    return this.room?.currentTableId;
  }

  get currentTable() {
    if (this.room === undefined) return undefined;
    const { currentTableId } = this.room;
    if (currentTableId === undefined) return undefined;

    return this.room.tables.find((t) => t.id === currentTableId);
  }

  get currentPlayerName() {
    if (this.currentTable === undefined) return undefined;

    return this.currentTable.player?.name;
  }

  get isMyTurn() {
    if (this.room === undefined) return false;

    if (this.currentPlayerName === undefined) return false;

    return this.isPlaying && this.currentPlayerName === this.userName;
  }

  get isPlaying() {
    if (this.room === undefined) return false;
    return this.room.state === GameStates.Playing;
  }

  /** Столы с игроками (для индикатора отгадываний) */
  get playerTables() {
    if (this.room === undefined) return [];
    return this.room.tables.filter((t) => t.player != null);
  }

  get guessedCount() {
    return this.playerTables.filter((t) => t.isGuessed).length;
  }

  get totalPlayerCount() {
    return this.playerTables.length;
  }

  /** Сколько игроков загадали (ввели) слово */
  get wordsSetCount() {
    return this.playerTables.filter(
      (t) => typeof t.secret === "string" && t.secret.trim() !== "",
    ).length;
  }

  /** Все ли игроки загадали слово (можно начинать игру) */
  get allPlayersHaveSetWords() {
    const total = this.totalPlayerCount;
    return total > 0 && this.wordsSetCount === total;
  }

  get isAdmin() {
    if (this.room === undefined || this.userName === undefined) return false;
    const { room, userName } = this;
    return (
      room.spectators.some(
        (user) => user.name === userName && user.isAdmin === true,
      ) ||
      room.tables.some((table) => {
        const player = table.player;
        return (
          player !== undefined &&
          player.name === userName &&
          player.isAdmin === true
        );
      })
    );
  }

  get canConfirmGuess() {
    return (
      this.isPlaying &&
      this.isPlayer &&
      !!this.currentPlayerName &&
      !this.isMyTurn
    );
  }

  get canBecomeSpectator() {
    if (this.room === undefined) return false;
    return this.isPlayer && this.room.state === GameStates.Idle;
  }

  public requestStoredName() {
    const name = this._nameStorage.get();

    if (name === undefined) {
      this.fromPath = this.pathname;
      this.router?.push("/register");
    }

    this.userName = name;
  }

  public register() {
    this._nameStorage.set(this.userName);

    const toPath = this.fromPath ? this.fromPath : "/";

    if (this.fromPath) {
      this.joinRoomByLink(this.fromPath.split("/").at(-1));
    }

    this.router?.push(toPath);
    this.fromPath = undefined;
  }

  public setRoomState(state: GameStates) {
    const { room } = this;

    if (room === undefined) return;

    const { roomCode } = room;

    socket.emit(SocketEvents.UpdateRoomState, {
      roomCode,
      state,
    });
  }

  public setName(name: string) {
    this.userName = name;
  }

  public setLoginFormField<K extends keyof TLoginForm>(
    field: K,
    value: TLoginForm[K],
  ) {
    this.loginForm[field] = value;
  }

  public setChatMessage(message: string) {
    this.chat.inputMessage = message;
  }

  public sendMessage() {
    if (this.room === undefined) return;

    if (this.userName === undefined) return;

    if (this.chat.inputMessage.trim() === "") return;

    socket.emit(SocketEvents.SendMessage, {
      roomCode: this.room.roomCode,
      message: {
        content: this.chat.inputMessage,
        sender: this.userName,
      },
    });

    this.chat.inputMessage = "";
  }

  public reciveMessage(message: TMessage) {
    this.chat.messages.push(message);
  }

  public setRoom(room: TRoom) {
    this.room = room;
  }

  public setRoomUsers(users: TUser[]) {
    if (this.room === undefined) return;

    this.room.spectators = users;
  }

  public setRouter(router: ReturnType<typeof useRouter>) {
    this.router = router;
  }

  public setPathname(pathname: ReturnType<typeof usePathname>) {
    this.pathname = pathname;
  }

  /** Запускает взрыв конфетти (видят все в комнате при WordGuessed; можно вызывать и в других местах) */
  public triggerConfetti() {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("trigger-confetti"));
    }
  }

  public leaveRoom() {
    if (this.room === undefined) return;

    socket.emit(SocketEvents.LeaveRoom, this.room.roomCode);

    this.room = undefined;
    this.chat = this._getChatDefaultState();

    this.router?.push("/");
  }

  /** Исключить участника из комнаты (только для админа). Вызывается при получении UserKicked — сброс комнаты и переход на главную. */
  public handleKicked() {
    this.room = undefined;
    this.chat = this._getChatDefaultState();
    this.router?.push("/");
  }

  public kickUser(targetUserName: string) {
    if (this.room === undefined) return;

    socket.emit(SocketEvents.KickUser, {
      roomCode: this.room.roomCode,
      targetUserName,
    });
  }

  public joinRoom() {
    const { roomCode } = this.loginForm;
    const { userName } = this;

    if (userName === undefined) {
      return;
    }

    socket.emit(SocketEvents.JoinRoom, {
      userName,
      roomCode,
    });

    this.loginForm = this._getLoginFormDefaultState();
  }

  public joinRoomByLink(roomCode?: string) {
    if (this.room) return;

    const { userName } = this;

    if (userName === undefined || roomCode === undefined) {
      toast.warning("userName or roomCode undefined");
      return;
    }

    socket.emit(SocketEvents.JoinRoom, {
      userName,
      roomCode,
    });
  }

  public takeTable(tableId: string) {
    if (this.userName === undefined) return;
    if (this.room == undefined) return;

    socket.emit(SocketEvents.TakeTable, {
      roomCode: this.room.roomCode,
      userName: this.userName,
      tableId,
    });
  }

  public setTableTyping(tableId: string) {
    if (this.room == undefined) return;
    if (this.userName === undefined) return;

    socket.emit(SocketEvents.UpdateTable, {
      tableId,
      roomCode: this.room.roomCode,
      table: {
        typing: this.userName,
      },
    });
  }

  public setTableSecret(tableId: string, secret: string) {
    if (this.room == undefined) return;
    if (this.userName === undefined) return;

    socket.emit(SocketEvents.UpdateTable, {
      tableId,
      roomCode: this.room.roomCode,
      table: {
        secret,
        typing: undefined,
      },
    });
  }

  public addTable() {
    if (this.room === undefined) return;

    socket.emit(SocketEvents.AddTable, this.room.roomCode);
  }

  public deleteTable(tableId: string) {
    if (this.room === undefined) return;

    socket.emit(SocketEvents.DeleteTable, {
      roomCode: this.room.roomCode,
      tableId,
    });
  }

  public becomeSpectator() {
    if (this.userName === undefined) return;
    if (this.room == undefined) return;

    socket.emit(SocketEvents.BecomeSpectator, {
      roomCode: this.room.roomCode,
      userName: this.userName,
    });
  }

  public async createRoom() {
    const { userName } = this;

    if (userName === undefined) {
      return;
    }

    socket.emit(SocketEvents.CreateRoom, userName);

    this.loginForm = this._getLoginFormDefaultState();
  }

  public makeGuess() {
    if (this.room === undefined) return;
    if (this.userName === undefined) return;

    socket.emit(SocketEvents.MakeGuess, {
      roomCode: this.room.roomCode,
      userName: this.userName,
      guess: "",
    });
  }

  public nextTurn() {
    if (this.room === undefined) return;

    socket.emit(SocketEvents.NextTurn, this.room.roomCode);
  }

  /** Закончить свой ход (может вызвать только игрок, чей сейчас ход). */
  public finishMyTurn() {
    if (this.room === undefined) return;

    socket.emit(SocketEvents.FinishTurn, this.room.roomCode);
  }

  public restartGame() {
    if (this.room === undefined) return;

    socket.emit(SocketEvents.RestartGame, this.room.roomCode);
  }

  private _getLoginFormDefaultState(): TLoginForm {
    return {
      roomCode: "",
      type: LoginType.Join,
    };
  }

  private _getChatDefaultState(): TChat {
    return {
      inputMessage: "",
      messages: [],
    };
  }
}

export const store = new Store();
