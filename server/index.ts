import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketEvents,
  TRoom,
  TUser,
} from "./types";
import { generateCode } from "../utils/code-generaator";
import { rooms } from "./data";

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
    console.log("user connected ", socket.id);

    socket.on(SocketEvents.SendMessage, (params) => {
      io.to(params.roomCode).emit(SocketEvents.ReciveMessage, params.message);
    });

    socket.on(SocketEvents.LeaveRoom, (roomCode) => {
      console.log("user left room", socket.id, roomCode);

      const room = rooms.get(roomCode);

      if (room === undefined) return;

      const users = room.users.filter((user) => user.socketId !== socket.id);

      room.users = users;

      socket.leave(room.roomCode);

      io.to(room.roomCode).emit(SocketEvents.RoomUsersUpdated, room.users);
    });

    socket.on(SocketEvents.JoinRoom, (params) => {
      console.log(SocketEvents.JoinRoom, params);

      const { userName, roomCode } = params;

      const room = rooms.get(roomCode);

      if (room === undefined) {
        io.to(socket.id).emit(SocketEvents.RoomNotFound, roomCode);
        return;
      }

      socket.join(room.roomCode);

      const existUser = room.users.find((user) => user.name === userName);

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

      room.users.push(newUser);

      io.to(socket.id).emit(SocketEvents.MyUserJoined, newUser);

      io.to(room.roomCode).emit(SocketEvents.UserJoined, room);
    });

    socket.on(SocketEvents.CreateRoom, (userName) => {
      console.log(SocketEvents.CreateRoom, userName);

      const roomCode = generateCode(8);

      const newUser: TUser = {
        socketId: socket.id,
        name: userName,
        isAdmin: true,
      };

      const room: TRoom = {
        roomCode,
        users: [newUser],
      };

      rooms.set(roomCode, room);

      socket.join(roomCode);

      io.to(socket.id).emit(SocketEvents.MyUserJoined, newUser);

      io.to(socket.id).emit(SocketEvents.RoomCreated, room);
    });

    socket.on(SocketEvents.Disconnect, (reson) => {
      const room = Array.from(rooms.values()).find((room) =>
        room.users.find((user) => user.socketId === socket.id),
      );

      if (room) {
        const user = room.users.find((user) => user.socketId === socket.id);

        if (user) {
          user.disconnected = true;
          io.to(room.roomCode).emit(SocketEvents.RoomUsersUpdated, room.users);
        }
      }

      console.log(`user disconnected ${socket.id} by ${reson}`);
    });
  });

  // Запуск сервера
  httpServer.listen(port, () => {
    console.log(`Server running on http://${hostname}:${port}`);
  });
});
