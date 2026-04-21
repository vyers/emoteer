import type { CSSProperties } from 'react';
import { cn } from '@/lib/cn';
import { Noise } from './noise';
import { Search } from 'lucide-react';

type Theme = {
  label: string;
  accent: string;
  vars: CSSProperties;
};

const THEMES: Theme[] = [
  {
    label: 'Default',
    accent: 'var(--color-fd-primary)',
    vars: {
      ['--preview-primary' as string]: 'var(--color-fd-primary)',
      ['--preview-radius' as string]: '0.5rem',
      ['--preview-radius-search' as string]: '0.5rem',
      ['--preview-radius-chip' as string]: '0.5rem',
      ['--preview-border-width' as string]: '1px',
      ['--preview-border-outer' as string]: 'var(--color-fd-border)',
      ['--preview-border-inner' as string]: 'var(--color-fd-border)',
      ['--preview-chip-bg' as string]: 'var(--color-fd-card)',
      ['--preview-tab-bg-active' as string]: 'var(--color-fd-foreground)',
      ['--preview-tab-fg-active' as string]: 'var(--color-fd-background)',
    },
  },
  {
    label: 'Custom',
    accent: 'var(--color-fd-primary)',
    vars: {
      ['--preview-primary' as string]: 'var(--color-fd-primary)',
      ['--preview-radius' as string]: '1.75rem',
      ['--preview-radius-search' as string]: '9999px',
      ['--preview-radius-chip' as string]: '9999px',
      ['--preview-border-width' as string]: '2px',
      ['--preview-border-outer' as string]: 'var(--color-fd-border)',
      ['--preview-border-inner' as string]: 'transparent',
      ['--preview-chip-bg' as string]: 'var(--color-fd-card)',
      ['--preview-tab-bg-active' as string]: 'var(--color-fd-primary)',
      ['--preview-tab-fg-active' as string]: 'var(--color-fd-primary-foreground)',
    },
  },
];

export function ThemingShowcase() {
  return (
    <section className="mx-auto w-full max-w-352 px-6 pt-16 pb-20 sm:pt-20">
      <div className="mb-10 flex flex-col items-center gap-3 text-center">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-fd-muted-foreground">
          Theming
        </span>
        <h2 className="max-w-2xl text-balance text-3xl font-bold tracking-tight text-fd-foreground sm:text-4xl">
          One primitive, infinite looks.
        </h2>
        <p className="max-w-xl text-balance text-sm text-fd-muted-foreground sm:text-base">
          Every slot exposes its own CSS variable. Set a few, ship a completely
          different picker — no Tailwind required. Bindings are framework-agnostic,
          themes are too.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {THEMES.map((theme) => (
          <ThemePanel key={theme.label} theme={theme} />
        ))}
      </div>
    </section>
  );
}

function ThemePanel({ theme }: { theme: Theme }) {
  return (
    <article
      className="relative flex flex-col overflow-hidden rounded-3xl border border-fd-border bg-fd-card"
      style={theme.vars}
    >
      <Noise opacity={0.06} />
      <div className="relative flex items-center justify-between border-b border-fd-border px-6 py-3">
        <div className="flex items-center gap-2">
          <span
            className="h-3 w-3 rounded-full"
            style={{ background: theme.accent }}
          />
          <span className="text-sm font-semibold tracking-tight">
            {theme.label}
          </span>
        </div>
        <span className="font-mono text-[11px] text-fd-muted-foreground">
          .theme-{theme.label.toLowerCase()}
        </span>
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center gap-5 px-6 py-10">
        <MockPicker isCustom={theme.label === 'Custom'} />
        <MockChips />
      </div>
    </article>
  );
}

function MockPicker({ isCustom = false }: { isCustom?: boolean }) {
  const tabs = ['Smileys', 'People', 'Animals', 'Food', 'Travel'];
  const grid = [
    '😀', '😁', '😂', '🤣', '😊', '😇', '🙂', '🙃',
    '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
    '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓',
  ];

  return (
    <div
      className="w-full max-w-sm overflow-hidden bg-fd-background"
      style={{
        borderRadius: 'var(--preview-radius)',
        borderStyle: 'solid',
        borderWidth: 'var(--preview-border-width)',
        borderColor: 'var(--preview-border-outer)',
      }}
    >
      <div
        className="p-3"
        style={{
          borderBottomStyle: 'solid',
          borderBottomWidth: 'var(--preview-border-width)',
          borderBottomColor: 'var(--preview-border-inner)',
        }}
      >
        <div
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-fd-muted-foreground"
          style={{
            borderRadius: 'var(--preview-radius-search)',
            borderStyle: 'solid',
            borderWidth: 'var(--preview-border-width)',
            borderColor: 'var(--preview-border-inner)',
            background: 'var(--color-fd-card)',
          }}
        >
          {!isCustom && (
            <span aria-hidden>
              <Search size={15}/>
            </span>
          )}
          <span>Search</span>
        </div>
      </div>
      <div
        className="flex gap-1 px-3 py-2 text-[11px]"
        style={{
          borderBottomStyle: 'solid',
          borderBottomWidth: 'var(--preview-border-width)',
          borderBottomColor: 'var(--preview-border-inner)',
        }}
      >
        {tabs.map((t, i) => (
          <span
            key={t}
            className={cn(
              'px-2 py-1 tracking-tight',
              i === 0 ? 'font-semibold' : 'text-fd-muted-foreground',
            )}
            style={{
              borderRadius: 'var(--preview-radius-search)',
              background:
                i === 0 ? 'var(--preview-tab-bg-active)' : 'transparent',
              color: i === 0 ? 'var(--preview-tab-fg-active)' : undefined,
            }}
          >
            {t}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-8 gap-1 p-3 text-xl">
        {grid.map((e, i) => (
          <span
            key={i}
            className="flex aspect-square items-center justify-center"
          >
            {e}
          </span>
        ))}
      </div>
      {isCustom && (
        <div
          className="flex items-center gap-2.5 px-3 py-2 text-xs"
          style={{
            borderTopStyle: 'solid',
            borderTopWidth: 'var(--preview-border-width)',
            borderTopColor: 'var(--preview-border-inner)',
          }}
        >
          <span className="text-xl leading-none" aria-hidden>
            😍
          </span>
          <div className="flex flex-1 flex-col leading-tight">
            <span className="text-sm font-medium capitalize text-fd-foreground">
              smiling face with heart-eyes
            </span>
            <span className="font-mono text-[10px] text-fd-muted-foreground">
              :smiling_face_with_heart_eyes:
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-fd-muted-foreground">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
              <rect x="9" y="9" width="11" height="11" rx="2" />
              <path d="M5 15V6a2 2 0 0 1 2-2h9" />
            </svg>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
              <polygon points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9 12 2" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

function MockChips() {
  const reactions = [
    { emoji: '👍', count: 12, active: false },
    { emoji: '❤️', count: 5, active: true },
    { emoji: '🎉', count: 8, active: false },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {reactions.map((r) => (
        <div
          key={r.emoji}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-sm"
          style={{
            borderRadius: 'var(--preview-radius-chip)',
            borderStyle: 'solid',
            borderWidth: 'var(--preview-border-width)',
            borderColor: r.active
              ? 'var(--preview-primary)'
              : 'var(--preview-border-inner)',
            background: r.active
              ? 'color-mix(in srgb, var(--preview-primary) 14%, transparent)'
              : 'var(--preview-chip-bg)',
            color: r.active
              ? 'var(--preview-primary)'
              : 'var(--color-fd-muted-foreground)',
            fontWeight: r.active ? 600 : 500,
          }}
        >
          <span className="text-base">{r.emoji}</span>
          <span>{r.count}</span>
        </div>
      ))}
    </div>
  );
}
