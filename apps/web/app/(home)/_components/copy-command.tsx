'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';

type Manager = 'pnpm' | 'npm' | 'yarn' | 'bun';

const MANAGERS: { id: Manager; command: (pkg: string) => string }[] = [
  { id: 'pnpm', command: (p) => `pnpm add ${p}` },
  { id: 'npm', command: (p) => `npm install ${p}` },
  { id: 'yarn', command: (p) => `yarn add ${p}` },
  { id: 'bun', command: (p) => `bun add ${p}` },
];

export function CopyCommand({ pkg }: { pkg: string }) {
  const [active, setActive] = useState<Manager>('pnpm');
  const [copied, setCopied] = useState(false);

  const activeCommand =
    MANAGERS.find((m) => m.id === active)?.command(pkg) ?? '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeCommand);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard unavailable — silently ignore
    }
  };

  return (
    <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-fd-border bg-fd-card text-left shadow-sm">
      <div
        role="tablist"
        aria-label="Package manager"
        className="flex items-center gap-1 border-b border-fd-border bg-fd-muted px-2 py-1.5"
      >
        {MANAGERS.map((m) => (
          <button
            key={m.id}
            role="tab"
            type="button"
            aria-selected={active === m.id}
            onClick={() => {
              setActive(m.id);
              setCopied(false);
            }}
            className={cn(
              'rounded-full px-3 py-1 font-mono text-xs font-semibold tracking-tight transition-colors',
              active === m.id
                ? 'bg-fd-foreground text-fd-background'
                : 'text-fd-muted-foreground',
            )}
          >
            {m.id}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 bg-fd-background px-4 py-3 font-mono text-sm">
        <span aria-hidden className="text-fd-primary">
          $
        </span>
        <code className="flex-1 truncate text-fd-foreground">
          {activeCommand}
        </code>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={`Copy ${active} install command`}
          className={cn(
            'grid h-7 w-7 shrink-0 place-items-center rounded-full border border-fd-border transition-colors',
            copied
              ? 'bg-fd-primary/10 text-fd-primary'
              : 'bg-fd-card text-fd-foreground',
          )}
        >
          {copied ? <AnimatedCheck /> : <CopyIcon />}
          <span className="sr-only">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
    </div>
  );
}

function CopyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
    >
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V6a2 2 0 0 1 2-2h9" />
    </svg>
  );
}

function AnimatedCheck() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
    >
      <path
        d="M5 12.5L10 17.5L19 7.5"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1}
      >
        <animate
          attributeName="stroke-dashoffset"
          from="1"
          to="0"
          dur="0.35s"
          fill="freeze"
        />
      </path>
    </svg>
  );
}
