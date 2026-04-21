import { Noise } from './noise';

export function Principles() {
  const items = [
    {
      title: 'Headless first.',
      description:
        'Compound primitives give you full control over markup, ARIA and styling.',
    },
    {
      title: 'Framework agnostic.',
      description:
        'Shared core with the same data, matching and state across every binding.',
    },
    {
      title: 'Themeable defaults.',
      description:
        'Tailwind-ready styles ship with the library and can be overridden per slot.',
    },
  ];
  return (
    <section className="mx-auto w-full max-w-352 px-6 pt-16 pb-8 sm:pt-20">
      <div className="mb-10 flex flex-col items-center gap-3 text-center">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-fd-muted-foreground">
          Principles
        </span>
        <h2 className="max-w-2xl text-balance text-3xl font-bold tracking-tight text-fd-foreground sm:text-4xl">
          Designed to grow with your stack.
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {items.map((item, i) => (
          <article
            key={item.title}
            className="relative overflow-hidden rounded-3xl border border-fd-border bg-fd-card p-8"
          >
            <Noise opacity={0.07} />
            <div className="relative flex flex-col gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-fd-primary/10 font-mono text-xs font-bold text-fd-primary">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="text-xl font-semibold tracking-tight text-fd-foreground">
                {item.title}
              </h3>
              <p className="text-sm text-fd-muted-foreground">
                {item.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
