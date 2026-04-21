import Link from 'next/link';
import type { CSSProperties } from 'react';
import { Noise } from './noise';

type FloatingEmoji = {
  emoji: string;
  className: string;
  rotate: number;
  duration: number;
  delay: number;
  size: string;
};

const CTA_EMOJIS: FloatingEmoji[] = [
  { emoji: '🎉', className: 'top-6 left-8 sm:top-10 sm:left-16', rotate: -18, duration: 6, delay: 0, size: 'text-5xl sm:text-6xl' },
  { emoji: '🚀', className: 'top-10 right-8 sm:top-14 sm:right-20', rotate: 20, duration: 7.5, delay: 0.8, size: 'text-4xl sm:text-5xl' },
  { emoji: '✨', className: 'bottom-10 left-14 sm:bottom-14 sm:left-28', rotate: 8, duration: 5.5, delay: 1.4, size: 'text-3xl sm:text-4xl' },
  { emoji: '💚', className: 'bottom-8 right-12 sm:bottom-12 sm:right-24', rotate: -12, duration: 7, delay: 0.3, size: 'text-4xl sm:text-5xl' },
  { emoji: '🔥', className: 'top-20 left-32 sm:top-24 sm:left-60', rotate: 14, duration: 6.8, delay: 1.8, size: 'text-3xl sm:text-4xl' },
  { emoji: '❤️', className: 'top-24 right-32 sm:top-28 sm:right-60', rotate: -10, duration: 6.3, delay: 1.2, size: 'text-3xl sm:text-4xl' },
  { emoji: '👏', className: 'bottom-20 left-40 sm:bottom-24 sm:left-72', rotate: 18, duration: 7.2, delay: 0.6, size: 'text-3xl sm:text-4xl' },
  { emoji: '💫', className: 'bottom-16 right-40 sm:bottom-20 sm:right-72', rotate: -16, duration: 5.8, delay: 2, size: 'text-3xl sm:text-4xl' },
];

export function CTA() {
  return (
    <section className="mx-auto w-full max-w-352 px-6 pb-24">
      <div className="relative flex flex-col items-center gap-6 overflow-hidden rounded-3xl border border-fd-border bg-fd-card px-8 py-16 text-center">
        <Noise opacity={0.07} />

        {CTA_EMOJIS.map((e) => (
          <span
            key={e.emoji}
            aria-hidden
            className={`pointer-events-none absolute ${e.className} ${e.size} select-none opacity-80`}
            style={
              {
                '--emote-rot': `${e.rotate}deg`,
                animation: `emote-float ${e.duration}s ease-in-out ${e.delay}s infinite`,
              } as CSSProperties
            }
          >
            {e.emoji}
          </span>
        ))}

        <h2 className="relative max-w-xl text-balance text-4xl font-bold tracking-tight text-fd-foreground sm:text-5xl">
          Start shipping emojis in minutes.
        </h2>
        <p className="relative max-w-lg text-balance text-fd-muted-foreground">
          Open source, MIT licensed, and designed to grow with your stack.
        </p>
        <div className="relative flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/docs"
            className="rounded-full bg-fd-foreground px-6 py-3 text-sm font-semibold tracking-tight text-fd-background shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3),inset_0_-2px_0_0_rgba(0,0,0,0.4),0_2px_4px_0_rgba(0,0,0,0.25)] transition-[filter,box-shadow] duration-300 ease-out hover:brightness-110"
          >
            Get started
          </Link>
          <Link
            href="https://github.com/vyers/emoteer"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-background px-6 py-3 text-sm font-semibold tracking-tight text-fd-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18),inset_0_-1px_0_0_rgba(0,0,0,0.2),0_2px_4px_0_rgba(0,0,0,0.1)] transition-[filter,box-shadow] duration-300 ease-out hover:brightness-110"
          >
            <AnimatedStar />
            Star on GitHub
          </Link>
        </div>
      </div>
    </section>
  );
}

function AnimatedStar() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M12 2.5 14.9 9l7 .6-5.3 4.6 1.6 6.9L12 17.6 5.8 21l1.6-6.9L2.1 9.6 9 9l3-6.5Z" />
    </svg>
  );
}
