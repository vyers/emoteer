export interface Particle {
  id: number;
  tx: string;
  ty: string;
}

export interface CreateBurstOptions {
  count?: number;
  spread?: number;
  duration?: number;
}

/**
 * Reactive particle-burst controller. Call `trigger()` to spawn a short-lived
 * batch of particles that animate outward (see the `em-burst` keyframes). The
 * returned `particles` getter is rune-backed, so a component reading it stays in
 * sync. Svelte equivalent of the React `useBurst` hook.
 */
export function createBurst({
  count = 6,
  spread = 100,
  duration = 600,
}: CreateBurstOptions = {}) {
  let particles = $state<Particle[]>([]);

  function trigger() {
    const fresh: Particle[] = Array.from({ length: count }).map(() => ({
      id: Math.random(),
      tx: `${(Math.random() - 0.5) * spread}px`,
      ty: `${(Math.random() - 0.5) * spread}px`,
    }));

    particles = [...particles, ...fresh];

    setTimeout(() => {
      particles = particles.filter((p) => !fresh.some((np) => np.id === p.id));
    }, duration);
  }

  return {
    get particles() {
      return particles;
    },
    trigger,
  };
}
