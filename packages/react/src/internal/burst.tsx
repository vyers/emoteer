import { cn } from "./cn.js";
import { useCallback, useState, type CSSProperties } from "react";

interface Particle {
  id: number;
  tx: string;
  ty: string;
}

export interface UseBurstOptions {
  count?: number;
  spread?: number;
  duration?: number;
}

export function useBurst({
  count = 6,
  spread = 100,
  duration = 600,
}: UseBurstOptions = {}) {
  const [particles, setParticles] = useState<Particle[]>([]);

  const trigger = useCallback(() => {
    const newParticles = Array.from({ length: count }).map(() => ({
      id: Math.random(),
      tx: `${(Math.random() - 0.5) * spread}px`,
      ty: `${(Math.random() - 0.5) * spread}px`,
    }));

    setParticles((prev) => [...prev, ...newParticles]);

    setTimeout(() => {
      setParticles((prev) =>
        prev.filter((p) => !newParticles.find((np) => np.id === p.id)),
      );
    }, duration);
  }, [count, spread, duration]);

  return { particles, trigger };
}

export interface BurstParticlesProps {
  particles: Particle[];
  emoji: string;
  className?: string;
}

export function BurstParticles({
  particles,
  emoji,
  className,
}: BurstParticlesProps) {
  return (
    <>
      {particles.map((p) => (
        <span
          key={p.id}
          className={cn(
            "animate-burst pointer-events-none select-none absolute top-1/2 left-1/2 z-10",
            className,
          )}
          style={{ "--tx": p.tx, "--ty": p.ty } as CSSProperties}
        >
          {emoji}
        </span>
      ))}
    </>
  );
}
