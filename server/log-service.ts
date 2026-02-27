import { SocketEvents } from "./types";

export function logEvent(eventType: SocketEvents, data: unknown) {
  if (process.env.NODE_ENV === "development") {
    console.log(eventType, data);
  }
}
