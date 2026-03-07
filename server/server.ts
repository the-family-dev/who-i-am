import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";
import {
  ClientToServerEvents,
  GameStates,
  ServerToClientEvents,
  SocketEvents,
  TRoom,
  TRoomTable,
  TUser,
} from "./types";
import { roomService } from "./room-service";
import { logEvent } from "./log-service";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

function isAdminSocket(room: TRoom, socketId: string): boolean {
  const spectatorAdmin = room.spectators.find(
    (user) => user.socketId === socketId && user.isAdmin,
  );

  if (spectatorAdmin) return true;

  for (const table of room.tabels) {
    if (
      table.player &&
      table.player.socketId === socketId &&
      table.player.isAdmin
    ) {
      return true;
    }
  }

  return false;
}

function getNextTableId(room: TRoom): string | undefined {
  if (room.tabels.length === 0) return undefined;

  const tables = room.tabels;
  const currentId = room.currentTableId;
  const startIndex = currentId
    ? tables.findIndex((t) => t.id === currentId)
    : -1;

  const total = tables.length;

  for (let step = 1; step <= total; step++) {
    const index = (startIndex + step) % total;
    const table = tables[index];

    if (table.player && !table.isGuessed) {
      return table.id;
    }
  }

  return undefined;
}

// Инициализация Next.js
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer);

  io.on(SocketEvents.Connection, (socket) => {
    socket.onAny((event) => {
      console.log(event);
    });

    socket.on(SocketEvents.UpdateRoomState, (params) => {
      const { roomCode, state } = params;

      const room = roomService.rooms.get(roomCode);

      if (room === undefined) return;

      if (!isAdminSocket(room, socket.id)) {
        io.to(socket.id).emit(
          SocketEvents.AnyError,
          "Только админ может управлять состоянием игры",
        );
        return;
      }

      room.state = state;

      if (state === GameStates.Playing) {
        const firstTable = room.tabels.find((t) => t.player && !t.isGuessed);

        room.currentTableId = firstTable ? firstTable.id : undefined;
      } else {
        room.currentTableId = undefined;
      }

      io.to(room.roomCode).emit(SocketEvents.RoomUpdated, room);
    });

    socket.on(SocketEvents.DeleteTable, (params) => {
      const { roomCode, tableId } = params;

      const room = roomService.rooms.get(roomCode);

      if (room === undefined) return;

      if (!isAdminSocket(room, socket.id)) {
        io.to(socket.id).emit(
          SocketEvents.AnyError,
          "Только админ может управлять столами",
        );
        return;
      }

      room.tabels = room.tabels.filter((t) => t.id !== tableId);

      io.to(room.roomCode).emit(SocketEvents.RoomUpdated, room);
    });

    socket.on(SocketEvents.AddTable, (roomCode) => {
      const room = roomService.rooms.get(roomCode);

      if (room === undefined) return;

      if (!isAdminSocket(room, socket.id)) {
        io.to(socket.id).emit(
          SocketEvents.AnyError,
          "Только админ может управлять столами",
        );
        return;
      }

      const table = roomService.generateTable();

      room.tabels.push(table);

      io.to(room.roomCode).emit(SocketEvents.RoomUpdated, room);
    });

    socket.on(SocketEvents.UpdateTable, (params) => {
      const { roomCode, tableId, table } = params;

      const room = roomService.rooms.get(roomCode);

      if (room === undefined) return;

      const targetTable = room.tabels.find((t) => t.id === tableId);

      if (targetTable === undefined) return;

      Object.assign(targetTable, {
        ...table,
      });

      if (table.typing === undefined) {
        targetTable.typing = table.typing;
      }

      io.to(room.roomCode).emit(SocketEvents.RoomUpdated, room);
    });

    socket.on(SocketEvents.TakeTable, (params) => {
      const { roomCode, tableId, userName } = params;

      const room = roomService.rooms.get(roomCode);

      if (room === undefined) return;

      const alreadyPlayer = room.tabels.find(
        (s) => s.player?.name === userName,
      );

      if (alreadyPlayer) {
        io.to(socket.id).emit(
          SocketEvents.AnyError,
          "Вы уже за игровым столом",
        );
        return;
      }

      const user = room.spectators.find((s) => s.name === userName);

      if (user === undefined) return;

      const table = room.tabels.find((t) => t.id === tableId);

      if (table === undefined) return;

      table.player = user;
      room.spectators = room.spectators.filter((s) => s.name !== user.name);

      io.to(room.roomCode).emit(SocketEvents.RoomUpdated, room);
    });

    socket.on(SocketEvents.BecomeSpectator, (params) => {
      const { roomCode, userName } = params;

      const room = roomService.rooms.get(roomCode);

      if (room === undefined) return;
      if (room.state !== GameStates.Idle) {
        io.to(socket.id).emit(
          SocketEvents.AnyError,
          "Стать зрителем можно только во время ожидания",
        );
        return;
      }

      const alreadySpectator = room.spectators.find((s) => s.name === userName);

      if (alreadySpectator) {
        io.to(socket.id).emit(SocketEvents.AnyError, "Вы уже зритель");
        return;
      }

      let user: TUser | undefined = undefined;

      for (const table of room.tabels) {
        if (table.player === undefined) continue;

        if (table.player.name === userName) {
          user = table.player;
          table.player = undefined;
        }
      }

      if (user === undefined) return;

      room.spectators.push(user);

      io.to(room.roomCode).emit(SocketEvents.RoomUpdated, room);
    });

    socket.on(SocketEvents.SendMessage, (params) => {
      io.to(params.roomCode).emit(SocketEvents.ReciveMessage, params.message);
    });

    socket.on(SocketEvents.MakeGuess, (params) => {
      const { roomCode, userName } = params;

      const room = roomService.rooms.get(roomCode);

      if (room === undefined) return;
      if (room.state !== GameStates.Playing) return;

      const currentTableId = room.currentTableId;

      if (currentTableId === undefined) return;

      const table = room.tabels.find((t) => t.id === currentTableId);

      if (table === undefined || table.player === undefined) return;

      if (table.player.name === userName) {
        io.to(socket.id).emit(
          SocketEvents.AnyError,
          "Игрок, который отгадывает, не может подтверждать отгадку",
        );
        return;
      }

      if (!table.secret.trim()) {
        io.to(socket.id).emit(
          SocketEvents.AnyError,
          "Секретное слово еще не задано",
        );
        return;
      }

      table.isGuessed = true;

      const nextTableId = getNextTableId(room);

      if (nextTableId === undefined) {
        room.state = GameStates.Idle;
        room.currentTableId = undefined;
      } else {
        room.currentTableId = nextTableId;
      }

      io.to(room.roomCode).emit(SocketEvents.RoomUpdated, room);
    });

    socket.on(SocketEvents.NextTurn, (roomCode) => {
      const room = roomService.rooms.get(roomCode);

      if (room === undefined) return;

      if (!isAdminSocket(room, socket.id)) {
        io.to(socket.id).emit(
          SocketEvents.AnyError,
          "Только админ может переключать ход",
        );
        return;
      }

      const nextTableId = getNextTableId(room);

      if (nextTableId === undefined) {
        room.state = GameStates.Idle;
        room.currentTableId = undefined;
      } else {
        room.currentTableId = nextTableId;
      }

      io.to(room.roomCode).emit(SocketEvents.RoomUpdated, room);
    });

    socket.on(SocketEvents.RestartGame, (roomCode) => {
      const room = roomService.rooms.get(roomCode);

      if (room === undefined) return;

      if (!isAdminSocket(room, socket.id)) {
        io.to(socket.id).emit(
          SocketEvents.AnyError,
          "Только админ может перезапускать игру",
        );
        return;
      }

      room.state = GameStates.Idle;
      room.currentTableId = undefined;

      for (const table of room.tabels) {
        table.secret = "";
        table.typing = undefined;
        table.isGuessed = false;
      }

      io.to(room.roomCode).emit(SocketEvents.RoomUpdated, room);
    });

    socket.on(SocketEvents.LeaveRoom, (roomCode) => {
      logEvent(SocketEvents.LeaveRoom, roomCode);

      const room = roomService.rooms.get(roomCode);

      if (room === undefined) return;

      const users = room.spectators.filter(
        (user) => user.socketId !== socket.id,
      );

      room.spectators = users;

      const table = room.tabels.find((t) => t.player?.socketId === socket.id);

      if (table) {
        table.player = undefined;
      }

      socket.leave(room.roomCode);

      io.to(room.roomCode).emit(SocketEvents.RoomUpdated, room);
    });

    socket.on(SocketEvents.JoinRoom, (params) => {
      const { userName, roomCode } = params;

      const room = roomService.rooms.get(roomCode);

      if (room === undefined) {
        io.to(socket.id).emit(
          SocketEvents.AnyError,
          `Комната ${roomCode} не найдена`,
        );
        return;
      }

      socket.join(room.roomCode);

      const existUser = room.tabels.find(
        (table) => table.player?.name === userName,
      )?.player;
      const existSpectator = room.spectators.find(
        (user) => user.name === userName,
      );

      if (existSpectator) {
        io.to(socket.id).emit(
          SocketEvents.AnyError,
          `Пользователь с именем ${existSpectator.name} уже существует`,
        );

        return;
      }

      if (existUser && existUser.disconnected) {
        // переподключение пользователя к комнате
        existUser.disconnected = false;
        existUser.socketId = socket.id;

        // io.to(socket.id).emit(SocketEvents.UserReconnected, existUser);

        // io.to(socket.id).emit(SocketEvents.MyUserJoined, existUser);

        // io.to(room.roomCode).emit(SocketEvents.UserJoined, room);

        io.to(room.roomCode).emit(SocketEvents.RoomUpdated, room);

        return;
      }

      if (existUser && !existUser.disconnected) {
        io.to(socket.id).emit(
          SocketEvents.AnyError,
          `Пользователь с именем ${existUser.name} уже существует`,
        );
        return;
      }

      const newUser: TUser = {
        socketId: socket.id,
        name: userName,
      };

      room.spectators.push(newUser);

      io.to(socket.id).emit(SocketEvents.MyUserJoined, newUser);

      io.to(room.roomCode).emit(SocketEvents.UserJoined, room);
    });

    socket.on(SocketEvents.CreateRoom, (userName) => {
      const newUser: TUser = {
        socketId: socket.id,
        name: userName,
        isAdmin: true,
      };

      const room = roomService.createRoom(newUser);

      socket.join(room.roomCode);

      io.to(socket.id).emit(SocketEvents.MyUserJoined, newUser);

      io.to(socket.id).emit(SocketEvents.RoomCreated, room);
    });

    socket.on(SocketEvents.Disconnect, (reson) => {
      const room = Array.from(roomService.rooms.values()).find(
        (room) =>
          room.spectators.find((user) => user.socketId === socket.id) ||
          room.tabels.find((table) => table.player?.socketId === socket.id),
      );

      if (room === undefined) return;

      const spectator = room.spectators.find(
        (user) => user.socketId === socket.id,
      );

      if (spectator) {
        room.spectators = room.spectators.filter(
          (user) => user.socketId !== socket.id,
        );
      }

      const player = room.tabels.find(
        (table) => table.player?.socketId === socket.id,
      )?.player;

      if (player) {
        player.disconnected = true;
        io.to(room.roomCode).emit(SocketEvents.RoomUpdated, room);
      }

      console.log(`user disconnected ${socket.id} by ${reson}`);
    });
  });

  // Запуск сервера
  httpServer.listen(port, () => {
    console.log("dev:", dev);
    console.log(`Server running on http://${hostname}:${port}`);
  });
});
