import { generateCode } from "../utils/code-generator";
import { GameStates, TRoom, TRoomTable, TUser } from "./types";

class RoomService {
  rooms = new Map<string, TRoom>();
  existUserNames = new Set<string>();

  public createRoom(user: TUser) {
    const room: TRoom = {
      roomCode: generateCode(8),
      spectators: [],
      tabels: [],
      state: GameStates.Idle,
    };

    const table: TRoomTable = {
      id: crypto.randomUUID(),
    };

    room.tabels.push(table);

    room.spectators.push(user);

    this.rooms.set(room.roomCode, room);

    return room;
  }

  public addUserToRoom(user: TUser, roomCode: TRoom["roomCode"]) {
    const room = this.rooms.get(roomCode);

    if (room === undefined) return;

    room.spectators.push(user);
  }

  public reconnectUser(user: TUser, roomCode: TRoom["roomCode"]) {
    const room = this.rooms.get(roomCode);

    if (room === undefined) return;

    const targetUser = room.spectators.find((u) => u.name === user.name);

    if (targetUser === undefined) return;

    targetUser.disconnected = false;
  }

  // TODO потенциалньая проблема с
  public disconectUser(user: TUser) {
    for (const [, room] of this.rooms) {
      const targetUser = room.spectators.find((u) => u.name === user.name);

      if (targetUser === undefined) return;

      targetUser.disconnected = true;
    }
  }
}

export const roomService = new RoomService();
