import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketEvents,
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
    logEvent(SocketEvents.Connection, socket.id);

    socket.on(SocketEvents.SendMessage, (params) => {
      logEvent(SocketEvents.SendMessage, params);
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
      logEvent(SocketEvents.JoinRoom, params);

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
      logEvent(SocketEvents.CreateRoom, userName);

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
      logEvent(SocketEvents.Disconnect, reson);

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
