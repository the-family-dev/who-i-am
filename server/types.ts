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

  UserNameExists = "user-name-exists",

  RoomUpdated = "room-updated",

  ReciveMessage = "recive-message",
  SendMessage = "send-message",
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
  player?: TUser;
};

export type TRoom = {
  roomCode: string; // uniq
  spectators: TUser[];
  tabels: TRoomTable[];
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
  [SocketEvents.BecomeSpectator]: ({
    userName,
    roomCode,
  }: {
    userName: string;
    roomCode: string;
  }) => void;
  [SocketEvents.AddTable]: (roomCode: string) => void;
  [SocketEvents.DeleteTable]: ({
    roomCode,
    tableId,
  }: {
    tableId: string;
    roomCode: string;
  }) => void;
};

export type ServerToClientEvents = {
  [SocketEvents.RoomCreated]: (room: TRoom) => void;
  [SocketEvents.ReciveMessage]: (message: TMessage) => void;
  [SocketEvents.UserJoined]: (room: TRoom) => void;
  [SocketEvents.RoomNotFound]: (roomCode: string) => void;
  [SocketEvents.MyUserJoined]: (user: TUser) => void;
  [SocketEvents.UserReconnected]: (user: TUser) => void;
  [SocketEvents.RoomUpdated]: (room: TRoom) => void;
  [SocketEvents.UserNameExists]: (userName: string) => void;
};
