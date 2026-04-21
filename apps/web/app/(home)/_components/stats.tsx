import { Noise } from './noise';

const STATS = [
  { value: '1,933', label: 'Emojis', hint: 'emojibase dataset, per locale' },
  { value: '28', label: 'Locales', hint: 'Bundled shortcode dictionaries' },
  { value: '~11 kb', label: 'Gzipped', hint: 'Core + React bindings JS' },
  { value: 'MIT', label: 'License', hint: 'Free and open source' },
];

export function Stats() {
  return (
    <section className="mx-auto w-full max-w-352 px-6 py-12 sm:py-16">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {STATS.map((item) => (
          <article
            key={item.label}
            className="relative overflow-hidden rounded-2xl border border-fd-border bg-fd-card p-6"
          >
            <Noise opacity={0.06} />
            <div className="relative flex flex-col gap-1">
              <div className="bg-linear-to-b from-fd-foreground to-fd-foreground/60 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
                {item.value}
              </div>
              <div className="text-sm font-semibold tracking-tight text-fd-foreground">
                {item.label}
              </div>
              <div className="text-xs text-fd-muted-foreground">{item.hint}</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
