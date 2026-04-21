import Link from 'next/link';
import EmoteerLogo from '@/components/emoteer-logo';
import { Noise } from './noise';

const RESOURCES = [
  { label: 'Documentation', href: '/docs' },
  { label: 'Installation', href: '/docs/installation' },
  { label: 'Components', href: '/docs/components/emote-list' },
  { label: 'Recipes', href: '/docs/recipes/chat-composer' },
  { label: 'Roadmap', href: '/docs/roadmap' },
  { label: 'Changelog', href: 'https://github.com/vyers/emoteer/releases' },
];

const PROJECT = [
  { label: 'GitHub', href: 'https://github.com/vyers/emoteer' },
  { label: 'Issues', href: 'https://github.com/vyers/emoteer/issues' },
  { label: 'Discussions', href: 'https://github.com/vyers/emoteer/discussions' },
  { label: 'MIT license', href: 'https://github.com/vyers/emoteer/blob/main/LICENSE' },
];

const PACKAGES = [
  { label: '@emoteer/core', status: 'stable' },
  { label: '@emoteer/react', status: 'stable' },
  { label: '@emoteer/svelte', status: 'soon' },
  { label: '@emoteer/vue', status: 'soon' },
];

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-352 px-4 pb-4 sm:px-6 sm:pb-6">
      <div className="relative overflow-hidden rounded-3xl border border-fd-border bg-fd-card/40 sm:rounded-[2.5rem]">
        <Noise opacity={0.06} />
        <div className="relative grid grid-cols-1 gap-10 px-8 py-12 sm:px-12 md:grid-cols-4 md:gap-8">
          <div className="flex flex-col gap-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <EmoteerLogo className="size-7" />
              <span className="text-lg font-bold tracking-tight text-fd-foreground">
                emoteer
              </span>
            </div>
            <p className="max-w-xs text-sm text-fd-muted-foreground">
              The emoji toolkit for the modern web. Open source, MIT licensed.
            </p>
          </div>

          <Column title="Resources" items={RESOURCES} />
          <Column title="Project" items={PROJECT} />

          <div className="flex flex-col gap-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-fd-muted-foreground">
              Packages
            </h3>
            <ul className="flex flex-col gap-2">
              {PACKAGES.map((p) => (
                <li
                  key={p.label}
                  className="flex items-center justify-between gap-3 font-mono text-xs"
                >
                  <span className="text-fd-foreground">{p.label}</span>
                  <span
                    className={
                      p.status === 'stable'
                        ? 'rounded-full bg-fd-primary/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-fd-primary'
                        : 'rounded-full border border-fd-border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-fd-muted-foreground'
                    }
                  >
                    {p.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative flex flex-col items-start justify-between gap-3 border-t border-fd-border px-8 py-6 text-sm text-fd-muted-foreground sm:flex-row sm:items-center sm:px-12">
          <span>© {new Date().getFullYear()} emoteer. MIT licensed.</span>
          <span className="inline-flex items-center gap-2 tracking-tight">
            built by
            <Link
              href="https://github.com/vyers"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-0.5 rounded-full bg-linear-to-br from-[hsl(85,80%,55%)] via-[hsl(85,80%,75%)] to-[hsl(85,80%,45%)] py-0.5 pl-0.5 pr-2 text-sm font-bold text-black shadow-[inset_0_1px_0_0_rgba(255,255,255,0.45),inset_0_-1px_0_0_rgba(0,0,0,0.25),0_1px_2px_0_rgba(0,0,0,0.15)] transition-[filter,box-shadow] duration-300 ease-in-out hover:brightness-110 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5),inset_0_-1px_0_0_rgba(0,0,0,0.25),0_6px_16px_-4px_hsla(85,80%,55%,0.45)] active:brightness-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://github.com/vyers.png"
                alt=""
                width={24}
                height={24}
                className="h-6 w-6 rounded-full border border-white/20 object-cover transition-transform duration-200 group-hover:rotate-6"
              />
              @vyers
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}

function Column({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-fd-muted-foreground">
        {title}
      </h3>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="text-sm tracking-tight text-fd-foreground"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
