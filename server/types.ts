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

  UserNameExists = "user-name-exists",

  RoomUsersUpdated = "room-users-updated",
  RoomUpdated = "room-updated",

  ReciveMessage = "recive-message",
  SendMessage = "send-message",

  HealthCheck = "health-check",
  ConnectionsCount = "connections-count",
}

export type TUser = {
  socketId: string;
  name: string;
  isAdmin?: boolean;
  disconnected?: boolean;
};

export type TMessage = {
  content: string;
  sender: TUser;
};

export type TRoom = {
  roomCode: string; // uniq
  users: TUser[];
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
};

export type ServerToClientEvents = {
  [SocketEvents.RoomCreated]: (room: TRoom) => void;
  [SocketEvents.ReciveMessage]: (message: TMessage) => void;
  [SocketEvents.UserJoined]: (room: TRoom) => void;
  [SocketEvents.RoomNotFound]: (roomCode: string) => void;
  [SocketEvents.MyUserJoined]: (user: TUser) => void;
  [SocketEvents.RoomUsersUpdated]: (users: TUser[]) => void;
  [SocketEvents.UserReconnected]: (user: TUser) => void;
  [SocketEvents.RoomUpdated]: (room: TRoom) => void;
  [SocketEvents.UserNameExists]: (userName: string) => void;
};
