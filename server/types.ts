export enum SocketEvents {
  Disconnect = "disconnect",
  Connection = "connection",

  CreateRoom = "create-room",
  RoomCreated = "room-created",
  JoinRoom = "join-room",
  LeaveRoom = "leave-room",
  UserJoined = "user-joined",
  MyUserJoined = "my-user-joined",
  RoomNotFound = "room-not-found",
  UserReconnected = "user-reconnected",

  TakeTable = "take-table",
  BecomeSpectator = "become-spectator",
  AddTable = "add-table",
  DeleteTable = "delete-table",
  UpdateRoomState = "update-room-state",
  UpdateTable = "update-table",
  MakeGuess = "make-guess",
  WordGuessed = "word-guessed",
  NextTurn = "next-turn",
  RestartGame = "restart-game",

  KickUser = "kick-user",
  UserKicked = "user-kicked",

  UserNameExists = "user-name-exists",

  AnyError = "any-error",

  RoomUpdated = "room-updated",

  ReciveMessage = "recive-message",
  SendMessage = "send-message",
}

export enum GameStates {
  Idle = "idle",
  Playing = "playing",
}

export type TUser = {
  socketId: string;
  /** Уникальный идентификатор */
  name: string;
  isAdmin?: boolean;
  disconnected?: boolean;
};

export type TMessage = {
  content: string;
  sender: string;
};

export type TRoomTable = {
  id: string;
  secret: string;
  player?: TUser;
  typing?: string;
  isGuessed?: boolean;
};

export type TRoom = {
  roomCode: string; // uniq
  spectators: TUser[];
  tabels: TRoomTable[];
  state: GameStates;
  currentTableId?: string;
};

export type ClientToServerEvents = {
  [SocketEvents.JoinRoom]: ({
    roomCode,
    userName,
  }: {
    roomCode: string;
    userName: string;
  }) => void;
  [SocketEvents.CreateRoom]: (userName: string) => void;
  [SocketEvents.SendMessage]: ({
    roomCode,
    message,
  }: {
    roomCode: string;
    message: TMessage;
  }) => void;
  [SocketEvents.LeaveRoom]: (roomCode: string) => void;
  [SocketEvents.TakeTable]: ({
    tableId,
    userName,
    roomCode,
  }: {
    tableId: string;
    userName: string;
    roomCode: string;
  }) => void;
  [SocketEvents.UpdateTable]: ({
    tableId,
    table,
    roomCode,
  }: {
    tableId: string;
    table: Partial<TRoomTable>;
    roomCode: string;
  }) => void;
  [SocketEvents.BecomeSpectator]: ({
    userName,
    roomCode,
  }: {
    userName: string;
    roomCode: string;
  }) => void;
  [SocketEvents.AddTable]: (roomCode: string) => void;
  [SocketEvents.UpdateRoomState]: ({
    state,
    roomCode,
  }: {
    state: GameStates;
    roomCode: string;
  }) => void;
  [SocketEvents.DeleteTable]: ({
    roomCode,
    tableId,
  }: {
    tableId: string;
    roomCode: string;
  }) => void;
  [SocketEvents.MakeGuess]: (params: {
    roomCode: string;
    userName: string;
    guess: string;
  }) => void;
  [SocketEvents.NextTurn]: (roomCode: string) => void;
  [SocketEvents.RestartGame]: (roomCode: string) => void;
  [SocketEvents.KickUser]: ({
    roomCode,
    targetUserName,
  }: {
    roomCode: string;
    targetUserName: string;
  }) => void;
};

export type ServerToClientEvents = {
  [SocketEvents.RoomCreated]: (room: TRoom) => void;
  [SocketEvents.ReciveMessage]: (message: TMessage) => void;
  [SocketEvents.UserJoined]: (room: TRoom) => void;
  [SocketEvents.MyUserJoined]: (user: TUser) => void;
  [SocketEvents.UserReconnected]: (user: TUser) => void;
  [SocketEvents.RoomUpdated]: (room: TRoom) => void;
  [SocketEvents.UserKicked]: () => void;
  [SocketEvents.WordGuessed]: () => void;
  [SocketEvents.AnyError]: (message: string) => void;
};
