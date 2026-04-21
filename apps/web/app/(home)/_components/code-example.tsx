import type { ReactNode } from 'react';
import { Noise } from './noise';

export function CodeExample() {
  return (
    <section className="mx-auto w-full max-w-352 px-6 pt-16 pb-20 sm:pt-20">
      <div className="mb-10 flex flex-col items-center gap-3 text-center">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-fd-muted-foreground">
          Example
        </span>
        <h2 className="max-w-2xl text-balance text-3xl font-bold tracking-tight text-fd-foreground sm:text-4xl">
          Ship a full picker in ten lines.
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        <div className="relative overflow-hidden rounded-3xl border border-fd-border bg-fd-card md:col-span-3">
          <div className="flex items-center gap-3 border-b border-fd-border bg-fd-muted px-4 py-2.5">
            <span className="font-mono text-xs text-fd-muted-foreground">
              App.tsx
            </span>
          </div>
          <pre className="overflow-x-auto bg-fd-background px-6 py-5 font-mono text-sm leading-7 text-fd-foreground">
            <code>
              <Line>
                <Kw>import</Kw> {'{ '}
                <Id>EmoteList</Id>, <Id>EmoteProvider</Id>
                {' } '}
                <Kw>from</Kw> <Str>{"'@emoteer/react'"}</Str>;
              </Line>
              <Line />
              <Line>
                <Kw>export default function</Kw> <Fn>App</Fn>() {'{'}
              </Line>
              <Line indent={1}>
                <Kw>return</Kw> (
              </Line>
              <Line indent={2}>
                {'<'}
                <Tag>EmoteProvider</Tag>
                {'>'}
              </Line>
              <Line indent={3}>
                {'<'}
                <Tag>EmoteList.Root</Tag> <Prop>onSelect</Prop>={'{'}
                <Id>handleSelect</Id>
                {'}'}
                {'>'}
              </Line>
              <Line indent={4}>
                {'<'}
                <Tag>EmoteList.Search</Tag> {'/>'}
              </Line>
              <Line indent={4}>
                {'<'}
                <Tag>EmoteList.Tabs</Tag> {'/>'}
              </Line>
              <Line indent={4}>
                {'<'}
                <Tag>EmoteList.Grid</Tag> {'/>'}
              </Line>
              <Line indent={3}>
                {'</'}
                <Tag>EmoteList.Root</Tag>
                {'>'}
              </Line>
              <Line indent={2}>
                {'</'}
                <Tag>EmoteProvider</Tag>
                {'>'}
              </Line>
              <Line indent={1}>);</Line>
              <Line>{'}'}</Line>
            </code>
          </pre>
        </div>

        <div className="relative flex flex-col gap-6 overflow-hidden rounded-3xl border border-fd-border bg-fd-card p-8 md:col-span-2">
          <Noise opacity={0.07} />
          <div className="relative flex flex-col gap-4">
            <Highlight
              title="Compound API"
              description="Every slot is a separate component you can swap, remove or style."
            />
            <Highlight
              title="No config required"
              description="Defaults render a complete picker. Override only what you need."
            />
            <Highlight
              title="Typed end-to-end"
              description="First-class TypeScript types for every event and slot."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Line({ indent = 0, children }: { indent?: number; children?: ReactNode }) {
  return (
    <div>
      {'  '.repeat(indent)}
      {children ?? '\u00A0'}
    </div>
  );
}

function Kw({ children }: { children: ReactNode }) {
  return <span className="text-violet-400">{children}</span>;
}
function Fn({ children }: { children: ReactNode }) {
  return <span className="text-sky-400">{children}</span>;
}
function Id({ children }: { children: ReactNode }) {
  return <span className="text-fd-foreground">{children}</span>;
}
function Tag({ children }: { children: ReactNode }) {
  return <span className="text-rose-400">{children}</span>;
}
function Prop({ children }: { children: ReactNode }) {
  return <span className="text-amber-400">{children}</span>;
}
function Str({ children }: { children: ReactNode }) {
  return <span className="text-emerald-400">{children}</span>;
}

function Highlight({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <span
        aria-hidden
        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-fd-primary"
      />
      <div>
        <h3 className="text-sm font-semibold tracking-tight text-fd-foreground">
          {title}
        </h3>
        <p className="mt-1 text-sm text-fd-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
