import Link from 'next/link';
import type { CSSProperties } from 'react';
import { CopyCommand } from './copy-command';
import { ReactLogo, SvelteLogo, VueLogo } from './logos';
import { Noise } from './noise';

const HERO_EMOJIS = [
  { emoji: '👋', className: 'top-10 left-20 sm:top-16 sm:left-56', rotate: -14, duration: 6.5, delay: 0, size: 'text-3xl sm:text-4xl' },
  { emoji: '😀', className: 'top-14 right-20 sm:top-20 sm:right-56', rotate: 12, duration: 7, delay: 0.6, size: 'text-3xl sm:text-4xl' },
  { emoji: '✨', className: 'top-32 left-32 sm:top-48 sm:left-80', rotate: 8, duration: 5.5, delay: 1.2, size: 'text-2xl sm:text-3xl' },
  { emoji: '🎈', className: 'bottom-20 left-24 sm:bottom-28 sm:left-64', rotate: -10, duration: 7.5, delay: 0.3, size: 'text-3xl sm:text-4xl' },
  { emoji: '💬', className: 'bottom-24 right-24 sm:bottom-32 sm:right-64', rotate: 14, duration: 6, delay: 1, size: 'text-3xl sm:text-4xl' },
  { emoji: '🎯', className: 'top-36 right-32 sm:top-52 sm:right-80', rotate: -6, duration: 6.8, delay: 1.6, size: 'text-2xl sm:text-3xl' },
] as const;

export function Hero() {
  return (
    <section className="relative isolate mx-auto w-full max-w-384 px-4 pt-4 sm:px-6 sm:pt-6">
      <div className="relative overflow-hidden rounded-3xl border border-fd-border bg-fd-card/40 sm:rounded-[2.5rem]">
        <BackgroundDecor />

        {HERO_EMOJIS.map((e) => (
          <span
            key={e.emoji}
            aria-hidden
            className={`pointer-events-none absolute ${e.className} ${e.size} select-none opacity-50`}
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

        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 pt-16 pb-10 text-center sm:pt-18 sm:pb-14">
        <div className="inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-card/60 px-3 py-1 text-xs font-medium tracking-tight text-fd-muted-foreground shadow-sm backdrop-blur">
          <span aria-hidden className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-fd-primary/60" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-fd-primary" />
          </span>
          Introducing Emoteer
        </div>

        <h1 className="text-balance text-4xl font-bold leading-none tracking-tight sm:text-5xl md:text-6xl">
          <span className="bg-linear-to-b from-fd-foreground via-fd-foreground to-fd-foreground/55 bg-clip-text text-transparent">
            The emoji toolkit
          </span>{' '}
          <span className="bg-linear-to-b from-[hsl(85,80%,78%)] via-[hsl(85,80%,62%)] to-[hsl(85,80%,40%)] bg-clip-text text-transparent">
            for the modern web.
          </span>
        </h1>

        <p className="max-w-2xl text-balance text-sm text-fd sm:text-base font-medium">
          Pickers, reactions, autocomplete and inputs. Headless primitives and
          styled components. Framework-agnostic core, one source of truth for
          emojis across your stack.
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/docs"
            className="rounded-full bg-fd-foreground px-6 py-3 text-sm font-semibold tracking-tight text-fd-background shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3),inset_0_-2px_0_0_rgba(0,0,0,0.4),0_2px_4px_0_rgba(0,0,0,0.25)] transition-[filter,box-shadow] duration-300 ease-out hover:brightness-110"
          >
            Read the docs
          </Link>
          <Link
            href="https://github.com/vyers/emoteer"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-fd-border bg-fd-card px-6 py-3 text-sm font-semibold tracking-tight text-fd-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18),inset_0_-1px_0_0_rgba(0,0,0,0.2),0_2px_4px_0_rgba(0,0,0,0.1)] transition-[filter,box-shadow] duration-300 ease-out hover:brightness-110"
          >
            View on GitHub
          </Link>
        </div>

        <CopyCommand pkg="@emoteer/react" />

        <div className="mt-2 flex flex-col items-center gap-3">
          <div className="flex items-center gap-4">
            <span aria-hidden className="h-px w-10 bg-fd-border" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-fd-muted-foreground">
              Built for every framework
            </span>
            <span aria-hidden className="h-px w-10 bg-fd-border" />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <FrameworkChip label="React" available>
              <ReactLogo className="h-4 w-4 text-[#58C4DC]" />
            </FrameworkChip>
            <FrameworkChip label="Svelte">
              <SvelteLogo className="h-4 w-4" />
            </FrameworkChip>
            <FrameworkChip label="Vue">
              <VueLogo className="h-4 w-4" />
            </FrameworkChip>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}

function BackgroundDecor() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-[hsl(85,80%,75%,0.3)] via-transparent to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-160 max-w-5xl bg-linear-to-br from-[hsl(85,80%,75%,0.3)] to-[hsl(85,80%,38%,0.3)] blur-3xl mask-[radial-gradient(closest-side,black,transparent)]"
      />
      <Noise opacity={0.05} />
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full text-fd-border/60 mask-[radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      >
        <defs>
          <pattern id="hero-grid" width="56" height="56" patternUnits="userSpaceOnUse">
            <path d="M 56 0 L 0 0 0 56" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
      </svg>
    </>
  );
}

function FrameworkChip({
  label,
  available,
  children,
}: {
  label: string;
  available?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-card/60 px-3 py-1.5 text-xs font-semibold tracking-tight text-fd-foreground shadow-sm backdrop-blur">
      <span className={available ? '' : 'opacity-40 grayscale'}>{children}</span>
      <span>{label}</span>
      {available ? (
        <span className="rounded-full bg-fd-primary/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-fd-primary">
          ready
        </span>
      ) : (
        <span className="rounded-full border border-fd-border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-fd-muted-foreground">
          soon
        </span>
      )}
    </div>
  );
}
