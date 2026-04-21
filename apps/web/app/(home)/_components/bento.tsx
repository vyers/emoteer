import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Noise } from './noise';

export function Bento() {
  return (
    <section className="mx-auto w-full max-w-352 px-6 pt-16 pb-20 sm:pt-20">
      <div className="mb-10 flex flex-col items-center gap-3 text-center">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-fd-muted-foreground">
          What you get
        </span>
        <h2 className="max-w-2xl text-balance text-4xl font-bold tracking-tight text-fd-foreground sm:text-5xl">
          Every emoji primitive, in one coherent toolkit.
        </h2>
      </div>

      <div className="grid auto-rows-[minmax(220px,auto)] grid-cols-1 gap-4 md:grid-cols-6">
        <Card
          className="md:col-span-4 md:row-span-2"
          tone="indigo"
          eyebrow="Picker"
          title="A searchable emoji picker, ready to ship."
          description="Virtualized grid, tabs per category, shortcode search, keyboard navigation, preview panel. Style it or keep the defaults."
        >
          <PickerPreview />
        </Card>

        <Card
          className="md:col-span-2"
          tone="violet"
          eyebrow="Reactions"
          title="Counters and reaction bars."
          description="Stateful reactions with active states, counts and toggles."
        >
          <ReactionsPreview />
        </Card>

        <Card
          className="md:col-span-2"
          tone="indigo"
          eyebrow="Sliders"
          title="Intensity sliders."
          description="0–100 emoji sliders for feedback and ratings."
        >
          <SliderPreview />
        </Card>

        <Card
          className="md:col-span-3"
          tone="violet"
          eyebrow="Autocomplete"
          title="Inline shortcode suggestions."
          description="Type “:” in any input to trigger suggestions. Choose from keyboard, click or Tab."
        >
          <AutocompletePreview />
        </Card>

        <Card
          className="md:col-span-3"
          tone="indigo"
          eyebrow="Inputs"
          title="Auto-convert shortcodes to unicode."
          description="Typing :star: becomes ⭐ the moment you close the shortcode. Works on inputs and textareas."
        >
          <InputPreview />
        </Card>

        <Card
          className="md:col-span-6"
          tone="violet"
          eyebrow="Architecture"
          title="One core. Every framework."
          description="The @emoteer/core package ships the data, search, matching and state machines. Framework bindings are a thin layer on top."
        >
          <ArchitecturePreview />
        </Card>
      </div>
    </section>
  );
}

type Tone = 'indigo' | 'violet';

const TONE_BG: Record<Tone, string> = {
  indigo:
    'bg-[linear-gradient(135deg,hsla(85,80%,80%,0.1)_0%,hsla(85,80%,60%,0.05)_35%,hsla(85,80%,38%,0.075)_70%,hsla(85,80%,72%,0.09)_100%)]',
  violet:
    'bg-[linear-gradient(315deg,hsla(85,80%,80%,0.1)_0%,hsla(85,80%,60%,0.05)_35%,hsla(85,80%,38%,0.075)_70%,hsla(85,80%,72%,0.09)_100%)]',
};

function Card({
  className,
  eyebrow,
  title,
  description,
  tone = 'indigo',
  children,
}: {
  className?: string;
  eyebrow: string;
  title: string;
  description: string;
  tone?: Tone;
  children?: ReactNode;
}) {
  return (
    <article
      className={cn(
        'relative flex flex-col overflow-hidden rounded-3xl border border-fd-border bg-fd-card p-8',
        className,
      )}
    >
      <Noise opacity={0.07} />
      <div className="relative flex flex-col gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-fd-muted-foreground">
          {eyebrow}
        </span>
        <h3 className="text-2xl font-semibold tracking-tight text-fd-foreground">
          {title}
        </h3>
        <p className="text-sm text-fd-muted-foreground">{description}</p>
      </div>
      {children && (
        <div
          className={cn(
            'relative mt-6 flex flex-1 flex-col overflow-hidden rounded-2xl p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.22),inset_0_-2px_0_0_rgba(0,0,0,0.18)]',
            TONE_BG[tone],
          )}
        >
          <Noise opacity={0.08} />
          <div className="relative flex flex-1 flex-col">{children}</div>
        </div>
      )}
    </article>
  );
}

function PickerPreview() {
  const tabs = ['Smileys', 'People', 'Animals', 'Food', 'Travel'];
  const grid = [
    '😀', '😁', '😂', '🤣', '😊', '😇', '🙂', '🙃',
    '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
    '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓',
    '😎', '🥸', '🤩', '🥳', '😏', '😒', '😞', '😔',
  ];
  return (
    <div className="flex h-full items-end justify-center">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-fd-border bg-fd-background shadow-2xl">
        <div className="border-b border-fd-border p-3">
          <div className="flex items-center gap-2 rounded-full border border-fd-border bg-fd-card px-3 py-1.5 text-xs text-fd-muted-foreground">
            <SearchIcon className="h-3 w-3" />
            <span>smiley</span>
            <span
              aria-hidden
              className="inline-block h-3 w-0.5 bg-fd-foreground"
              style={{ animation: 'caret-blink 1s steps(1) infinite' }}
            />
          </div>
        </div>
        <div className="flex gap-1 border-b border-fd-border px-3 py-2 text-[11px]">
          {tabs.map((t, i) => (
            <span
              key={t}
              className={cn(
                'rounded-full px-2 py-1 font-medium tracking-tight',
                i === 0
                  ? 'bg-fd-foreground text-fd-background'
                  : 'text-fd-muted-foreground',
              )}
            >
              {t}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-8 gap-1 p-3 text-xl">
          {grid.map((e, i) => (
            <span
              key={i}
              className={cn(
                'relative flex aspect-square items-center justify-center rounded-md',
                i === 10 &&
                  'bg-fd-primary/15 ring-1 ring-fd-primary/30 [animation:chip-pulse_2.4s_ease-in-out_infinite]',
              )}
            >
              {e}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReactionsPreview() {
  const reactions = [
    { emoji: '👍', count: 12, active: false },
    { emoji: '❤️', count: 6, active: true },
    { emoji: '🎉', count: 8, active: false },
    { emoji: '🚀', count: 3, active: false },
  ];
  return (
    <div className="flex h-full flex-wrap items-end gap-2">
      {reactions.map((r) => (
        <div
          key={r.emoji}
          className={cn(
            'flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm shadow-sm',
            r.active
              ? 'border-fd-primary/40 bg-fd-primary/15 text-fd-primary'
              : 'border-fd-border bg-fd-background text-fd-muted-foreground',
          )}
          style={
            r.active
              ? { animation: 'chip-pulse 2.4s ease-in-out infinite' }
              : undefined
          }
        >
          <span className="text-base">{r.emoji}</span>
          <span className="font-semibold tracking-tight">{r.count}</span>
        </div>
      ))}
      <div className="flex items-center gap-1 rounded-full border border-dashed border-fd-border px-3 py-1.5 text-sm text-fd-muted-foreground">
        <span>+</span>
      </div>
    </div>
  );
}

function SliderPreview() {
  return (
    <div className="flex h-full flex-col justify-end gap-4">
      <div className="relative h-2 w-full rounded-full bg-fd-background shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)]">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-orange-400 to-rose-500"
          style={{ animation: 'slider-fill 5s ease-in-out infinite' }}
        />
        <div
          className="absolute top-1/2 grid h-9 w-9 place-items-center rounded-full border border-fd-border bg-fd-card text-xl shadow-lg"
          style={{
            animation:
              'slider-thumb-pos 5s ease-in-out infinite, slider-thumb-scale 5s ease-in-out infinite',
          }}
        >
          🔥
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-fd-muted-foreground">
        <span>cold</span>
        <span
          className="rounded-full bg-fd-primary/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-fd-primary"
        >
          intensity
        </span>
        <span>scorching</span>
      </div>
    </div>
  );
}

function AutocompletePreview() {
  const emojis = ['😀', '😃', '😄', '😁', '😆', '😅'];
  return (
    <div className="flex h-full flex-col justify-end gap-3">
      <div className="flex items-center rounded-xl border border-fd-border bg-fd-background px-4 py-3 text-sm shadow-sm">
        <span>
          Hey team, let&apos;s celebrate{' '}
          <span className="rounded bg-fd-primary/10 px-0.5 font-mono text-fd-primary">
            :grin
          </span>
        </span>
        <svg
          viewBox="0 0 2 16"
          className="ml-0.5 h-4 w-0.5 text-fd-foreground"
          aria-hidden
        >
          <rect width="2" height="16" fill="currentColor">
            <animate
              attributeName="opacity"
              values="1;0;1"
              dur="1s"
              repeatCount="indefinite"
            />
          </rect>
        </svg>
      </div>
      <div className="relative flex w-fit items-center gap-1 rounded-xl border border-fd-border bg-fd-background p-2 shadow-lg">
        <div
          aria-hidden
          className="pointer-events-none absolute top-2 left-2 h-10 w-10 rounded-md bg-fd-primary/15 ring-1 ring-fd-primary/30"
          style={{ animation: 'autocomplete-x 6s steps(1) infinite' }}
        />
        {emojis.map((e) => (
          <span
            key={e}
            className="relative flex h-10 w-10 items-center justify-center rounded-md text-2xl"
          >
            {e}
          </span>
        ))}
      </div>
    </div>
  );
}

function InputPreview() {
  return (
    <div className="flex h-full flex-col justify-end">
      <div className="relative h-12 overflow-hidden rounded-xl border border-fd-border bg-fd-background text-sm shadow-sm">
        <div className="absolute inset-0 flex items-center px-4">
          <span
            className="overflow-hidden whitespace-nowrap border-r-2 border-fd-foreground font-mono text-fd-muted-foreground"
            style={{ animation: 'typing-rocket 6s steps(17, end) infinite' }}
          >
            ship it :rocket:
          </span>
        </div>
        <div
          className="absolute inset-0 flex items-center px-4 text-fd-foreground"
          style={{ animation: 'typing-converted 6s ease-in-out infinite' }}
        >
          <span>ship it 🚀</span>
          <span
            aria-hidden
            className="ml-0.5 inline-block h-4 w-0.5 bg-fd-foreground"
            style={{ animation: 'caret-blink 1s steps(1) infinite' }}
          />
        </div>
      </div>
    </div>
  );
}

function ArchitecturePreview() {
  const bindings = [
    { name: 'React', ready: true },
    { name: 'Svelte', ready: false },
    { name: 'Vue', ready: false },
  ];
  return (
    <div className="relative grid grid-cols-1 gap-4 md:grid-cols-4">
      <div className="relative md:col-span-1">
        <div className="relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl border border-fd-border bg-fd-background p-5">
          <Noise opacity={0.05} />
          <span className="relative text-[10px] font-semibold uppercase tracking-[0.2em] text-fd-muted-foreground">
            @emoteer/core
          </span>
          <p className="relative text-sm font-semibold tracking-tight text-fd-foreground">
            Data, search & state.
          </p>
          <p className="relative text-xs text-fd-muted-foreground">
            Framework-agnostic logic. Zero DOM dependencies.
          </p>
        </div>
      </div>

      <div className="md:col-span-3 grid grid-cols-1 gap-4 md:grid-cols-3">
        {bindings.map((f) => (
          <div
            key={f.name}
            className="relative flex flex-col gap-2 overflow-hidden rounded-2xl border border-fd-border bg-fd-background p-5"
          >
            <Noise opacity={0.05} />
            <span className="relative text-[10px] font-semibold uppercase tracking-[0.2em] text-fd-muted-foreground">
              @emoteer/{f.name.toLowerCase()}
            </span>
            <span className="relative text-sm font-semibold tracking-tight text-fd-foreground">
              {f.name}
            </span>
            <span
              className={cn(
                'relative mt-auto inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                f.ready
                  ? 'bg-fd-primary/10 text-fd-primary'
                  : 'border border-fd-border text-fd-muted-foreground',
              )}
            >
              {f.ready && <PulseDot />}
              {f.ready ? 'available' : 'soon'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PulseDot() {
  return (
    <svg viewBox="0 0 12 12" className="h-2 w-2" aria-hidden>
      <circle cx="6" cy="6" r="3" fill="currentColor" />
      <circle cx="6" cy="6" r="3" fill="none" stroke="currentColor" strokeWidth="1.5">
        <animate attributeName="r" from="3" to="6" dur="1.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.8" to="0" dur="1.6s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
