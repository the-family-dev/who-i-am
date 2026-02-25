import { TRoom } from "./types";

export const rooms = new Map<string, TRoom>();

rooms.set("test", {
  roomCode: "test",
  users: [],
});
