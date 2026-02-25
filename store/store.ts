"use-client";
import { makeAutoObservable, toJS } from "mobx";
import { SocketEvents, TMessage, TRoom, TUser } from "@/server/types";
import { socket } from "@/lib/socket";
import { TypedStorage } from "../utils/storage";
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

  user: TUser | undefined = undefined;

  fromPath: string | undefined = undefined;

  router: ReturnType<typeof useRouter> | undefined = undefined;
  pathname: ReturnType<typeof usePathname> | undefined = undefined;

  constructor() {
    makeAutoObservable(this);
  }

  public requestStoredName() {
    const name = this._nameStorage.get();

    console.log(toJS(this.pathname));

    if (name === undefined) {
      this.fromPath = this.pathname;
      this.router?.push("/register");
    }

    this.userName = name;
    console.log("requestStoredName");
  }

  public register() {
    this._nameStorage.set(this.userName);

    const toPath = this.fromPath ? this.fromPath : "/";

    this.router?.push(toPath);
    this.fromPath = undefined;
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

    if (this.user === undefined) return;

    if (this.chat.inputMessage.trim() === "") return;

    socket.emit(SocketEvents.SendMessage, {
      roomCode: this.room.roomCode,
      message: {
        content: this.chat.inputMessage,
        sender: this.user,
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

    this.room.users = users;
  }

  public setRouter(router: ReturnType<typeof useRouter>) {
    this.router = router;
  }

  public setPathname(pathname: ReturnType<typeof usePathname>) {
    this.pathname = pathname;
  }

  public setUser(user: TUser) {
    this.user = user;
  }

  public leaveRoom() {
    console.log("leaveRoom");
    if (this.room === undefined) return;

    socket.emit(SocketEvents.LeaveRoom, this.room.roomCode);

    this.room = undefined;
    this.user = undefined;
    this.chat = this._getChatDefaultState();

    this.router?.push("/");
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

  public loginToRoom(roomCode?: string) {
    console.log("loginToRoom");

    if (this.room) return;

    const { userName } = this;

    if (userName === undefined || roomCode === undefined) {
      toast.warning("userName roomCode undefined");
      return;
    }

    socket.emit(SocketEvents.JoinRoom, {
      userName,
      roomCode,
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
