import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketEvents,
  TRoomTable,
  TUser,
} from "./types";
import { roomService } from "./room-service";
import { logEvent } from "./log-service";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

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

    socket.on(SocketEvents.DeleteTable, (params) => {
      const { roomCode, tableId } = params;

      const room = roomService.rooms.get(roomCode);

      if (room === undefined) return;

      room.tabels = room.tabels.filter((t) => t.id !== tableId);

      io.to(room.roomCode).emit(SocketEvents.RoomUpdated, room);
    });

    socket.on(SocketEvents.AddTable, (roomCode) => {
      const room = roomService.rooms.get(roomCode);

      if (room === undefined) return;

      const table: TRoomTable = {
        id: crypto.randomUUID(),
      };

      room.tabels.push(table);

      io.to(room.roomCode).emit(SocketEvents.RoomUpdated, room);
    });

    socket.on(SocketEvents.TakeTable, (params) => {
      const { roomCode, tableId, userName } = params;

      const room = roomService.rooms.get(roomCode);

      if (room === undefined) return;

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

    socket.on(SocketEvents.LeaveRoom, (roomCode) => {
      logEvent(SocketEvents.LeaveRoom, roomCode);

      const room = roomService.rooms.get(roomCode);

      if (room === undefined) return;

      const users = room.spectators.filter(
        (user) => user.socketId !== socket.id,
      );

      room.spectators = users;

      socket.leave(room.roomCode);

      io.to(room.roomCode).emit(SocketEvents.RoomUpdated, room);
    });

    socket.on(SocketEvents.JoinRoom, (params) => {
      const { userName, roomCode } = params;

      const room = roomService.rooms.get(roomCode);

      if (room === undefined) {
        io.to(socket.id).emit(SocketEvents.RoomNotFound, roomCode);
        return;
      }

      socket.join(room.roomCode);

      const existUser = room.spectators.find((user) => user.name === userName);

      if (existUser && existUser.disconnected) {
        // переподключение пользователя к комнате
        existUser.disconnected = false;
        existUser.socketId = socket.id;

        io.to(socket.id).emit(SocketEvents.UserReconnected, existUser);

        io.to(socket.id).emit(SocketEvents.MyUserJoined, existUser);

        io.to(room.roomCode).emit(SocketEvents.UserJoined, room);

        return;
      }

      if (existUser && !existUser.disconnected) {
        io.to(socket.id).emit(SocketEvents.UserNameExists, existUser.name);
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
      const room = Array.from(roomService.rooms.values()).find((room) =>
        room.spectators.find((user) => user.socketId === socket.id),
      );

      if (room) {
        const user = room.spectators.find(
          (user) => user.socketId === socket.id,
        );

        if (user) {
          user.disconnected = true;
          io.to(room.roomCode).emit(SocketEvents.RoomUpdated, room);
        }
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
