import { Noise } from './noise';

const ITEMS = [
  {
    q: 'Is it production ready?',
    a: 'The React package exposes a stable API. Other framework bindings share the same core and will land behind the same semver guarantees.',
  },
  {
    q: 'Do I need Tailwind?',
    a: 'No. Styled components ship with plain CSS classes. Tailwind is supported out of the box but not required.',
  },
  {
    q: 'What about bundle size?',
    a: 'Tree-shakeable imports keep the picker around 12kb gzipped including the virtualized grid and shortcode matcher.',
  },
  {
    q: 'Can I add custom emojis?',
    a: 'Yes. Pass a locale or a custom emoji list through EmoteProvider. Shortcodes and search integrate automatically.',
  },
  {
    q: 'When are Svelte and Vue ready?',
    a: 'Both are on the roadmap. The framework-agnostic core already ships most of the logic, so bindings will stay thin.',
  },
];

export function Faq() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-20">
      <div className="mb-10 flex flex-col items-center gap-3 text-center">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-fd-muted-foreground">
          FAQ
        </span>
        <h2 className="max-w-2xl text-balance text-3xl font-bold tracking-tight text-fd-foreground sm:text-4xl">
          Frequently asked questions.
        </h2>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-fd-border bg-fd-card">
        <Noise opacity={0.06} />
        <div className="relative divide-y divide-fd-border">
          {ITEMS.map((item) => (
            <details key={item.q} className="group p-6 sm:p-8">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6">
                <h3 className="text-base font-semibold tracking-tight text-fd-foreground sm:text-lg">
                  {item.q}
                </h3>
                <PlusIcon />
              </summary>
              <p className="mt-3 text-sm text-fd-muted-foreground sm:text-base">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      className="h-5 w-5 shrink-0 text-fd-muted-foreground transition-transform group-open:rotate-45"
      aria-hidden
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
