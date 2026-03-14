import { TRoom } from "../server/types";

export function isAdminSocket(room: TRoom, socketId: string): boolean {
  const spectatorAdmin = room.spectators.find(
    (user) => user.socketId === socketId && user.isAdmin,
  );

  if (spectatorAdmin) return true;

  for (const table of room.tables) {
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

export function getNextTableId(room: TRoom): string | undefined {
  if (room.tables.length === 0) return undefined;

  const tables = room.tables;
  const currentId = room.currentTableId;
  const startIndex = currentId
    ? tables.findIndex((t) => t.id === currentId)
    : -1;

  const total = tables.length;
  
  for (let step = 1; step <= total; step++) {
    const index = (startIndex + step) % total;
    const table = tables.at(index);
    if (table?.player && !table.isGuessed) {
      return table.id;
    }
  }

  return undefined;
}
