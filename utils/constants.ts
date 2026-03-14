import { GameStates } from "@/server/types";

export const cardHeight = 360;
export const cardWidth = 240;
export const confettiEvent = "trigger-confetti";

export const gameStateLabels: Record<GameStates, string> = {
  [GameStates.Idle]: "Ожидание",
  [GameStates.Playing]: "Игра",
}
