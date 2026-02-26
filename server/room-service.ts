import { generateCode } from "../utils/code-generaator";
import { TRoom, TUser } from "./types";

class RoomService {
  rooms = new Map<string, TRoom>();
  existUserNames = new Set<string>();

  public createRoom(user: TUser) {
    const room: TRoom = {
      roomCode: generateCode(8),
      users: [],
      tabels: [],
    };

    room.users.push(user);

    this.rooms.set(room.roomCode, room);

    return room;
  }

  // TODO потенциалньая проблема с
  public disconectUser(user: TUser) {
    for (const [, room] of this.rooms) {
      const targetUser = room.users.find((u) => u.name === user.name);

      if (targetUser === undefined) return;

      targetUser.disconnected = true;
    }
  }
}

export const roomService = new RoomService();
