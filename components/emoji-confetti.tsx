"use client";
import { confettiEvent } from "@/utils/constants";
import { getRandomEmoji } from "@/utils/emoji";
import { useCallback, useEffect, useRef, useState } from "react";

const PARTICLE_COUNT = 40;
const DURATION_MS = 2000;

type Particle = {
  id: number;
  emoji: string;
  angle: number;
  distance: number;
  rotation: number;
  size: number;
  delay: number;
};

type Burst = {
  id: number;
  particles: Particle[];
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

let nextBurstId = 0;

export function EmojiConfetti() {
  const [bursts, setBursts] = useState<Burst[]>([]);
  const timeoutsRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const runConfetti = useCallback(() => {
    const id = ++nextBurstId;
    const particles = createParticles();
    setBursts((prev) => [...prev, { id, particles }]);
    const t = setTimeout(() => {
      setBursts((prev) => prev.filter((b) => b.id !== id));
      timeoutsRef.current.delete(id);
    }, DURATION_MS);
    timeoutsRef.current.set(id, t);
  }, []);

  useEffect(() => {
    const handler = () => runConfetti();
    window.addEventListener(confettiEvent, handler);
    return () => {
      window.removeEventListener(confettiEvent, handler);
      timeoutsRef.current.forEach((t) => clearTimeout(t));
      timeoutsRef.current.clear();
    };
  }, [runConfetti]);

  if (bursts.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50"
      aria-hidden
    >
      {bursts.map((burst) => (
        <div
          key={burst.id}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0"
        >
          {burst.particles.map((p) => {
            const endX = Math.cos(p.angle) * p.distance;
            const endY = Math.sin(p.angle) * p.distance;
            return (
              <span
                key={`${burst.id}-${p.id}`}
                className="absolute left-0 top-0 select-none will-change-transform"
                style={{
                  fontSize: p.size,
                  animation: `emoji-confetti-fly ${DURATION_MS}ms ease-out ${p.delay}s forwards`,
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
      ))}
    </div>
  );
}
