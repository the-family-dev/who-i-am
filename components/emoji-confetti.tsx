"use client";

import { getRandomEmoji } from "@/utils/emoji";
import { useCallback, useEffect, useState } from "react";

const PARTICLE_COUNT = 40;
const DURATION_MS = 2000;
const EVENT_NAME = "trigger-confetti";

type Particle = {
  id: number;
  emoji: string;
  angle: number;
  distance: number;
  rotation: number;
  size: number;
  delay: number;
};

function createParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    emoji: getRandomEmoji(),
    angle: Math.random() * Math.PI * 2,
    distance: 60 + Math.random() * 80,
    rotation: (Math.random() - 0.5) * 360,
    size: 20 + Math.random() * 16,
    delay: Math.random() * 0.1,
  }));
}

export function EmojiConfetti() {
  const [particles, setParticles] = useState<Particle[] | null>(null);

  const runConfetti = useCallback(() => {
    setParticles(createParticles());
    const t = setTimeout(() => setParticles(null), DURATION_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handler = () => runConfetti();
    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
  }, [runConfetti]);

  if (particles === null) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50"
      aria-hidden
    >
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0">
        {particles.map((p) => {
          const endX = Math.cos(p.angle) * p.distance;
          const endY = Math.sin(p.angle) * p.distance;
          return (
            <span
              key={p.id}
              className="absolute left-0 top-0 select-none will-change-transform"
              style={{
                fontSize: p.size,
                animation: `emoji-confetti-fly ${DURATION_MS}ms ease-out ${p.delay}s forwards`,
                // CSS variables для keyframes (задаём в style, анимация в CSS)
                ["--ex" as string]: `${endX}vw`,
                ["--ey" as string]: `${endY}vh`,
                ["--rot" as string]: `${p.rotation}deg`,
              }}
            >
              {p.emoji}
            </span>
          );
        })}
      </div>
    </div>
  );
}
