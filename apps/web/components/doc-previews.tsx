'use client';

import {
  EmoteAutocomplete,
  EmoteInput,
  EmoteList,
  EmoteProvider,
  EmoteTextArea,
  isLocalEmote,
  LocalEmote,
  ReactionButton,
  ReactionCounter,
  ReactionSlider,
  type Emote,
  type Reaction,
} from '@emoteer/react';
import { useState, type ReactNode } from 'react';

const customEmotes: LocalEmote[] = [
  {
    id: 'catJam',
    name: 'catJam',
    src: 'https://cdn.betterttv.net/emote/5f1b0186cf6d2144653d2970/3x.webp',
    category: 'Custom Emotes'
  },
  {
    id: 'parrot',
    name: 'parrot',
    src: 'https://cdn.betterttv.net/emote/59f06613ba7cdd47e9a4cad2/3x.webp',
    category: 'Custom Emotes'
  }
]

function Preview({
  children,
  wide,
}: {
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <EmoteProvider locals={customEmotes}>
      <div className="not-prose my-6 flex min-h-48 items-center justify-center rounded-2xl border border-fd-border bg-fd-card/50 p-8">
        <div className={`w-full ${wide ? 'max-w-xl' : 'max-w-sm'}`}>
          {children}
        </div>
      </div>
    </EmoteProvider>
  );
}

export function EmoteListPreview() {
  const [selected, setSelected] = useState<Emote | null>(null);

  return (
    <Preview>
      <div className="flex flex-col gap-3">
        <EmoteList.Root
          onSelect={setSelected}
          className="w-full"
        >
          <EmoteList.Search />
          <EmoteList.Tabs />
          <EmoteList.Grid height={240} />
          <EmoteList.Preview />
        </EmoteList.Root>
        {selected && (
          <div className="flex items-center justify-between rounded-lg border border-fd-border bg-fd-background px-3 py-2 text-xs">
            <span className="text-fd-muted-foreground">Selected</span>
            <span className="flex items-center gap-2">
              {isLocalEmote(selected) ? (
                <img
                  src={selected.src}
                  alt={selected.name}
                  className="inline-block h-5 w-5 object-contain"
                />
              ) : (
                <span className="text-lg">{selected.unicode}</span>
              )}
              <span className="font-mono text-fd-muted-foreground">
                :{isLocalEmote(selected) ? selected.name : selected.shortcodes[0]}:
              </span>
            </span>
          </div>
        )}
      </div>
    </Preview>
  );
}

export function EmoteAutocompletePreview() {
  const [value, setValue] = useState('');

  return (
    <Preview>
      <div className="flex flex-col gap-3">
        <EmoteAutocomplete.Root onSelect={(_, next) => setValue(next)}>
          <EmoteAutocomplete.Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Type :grin for suggestions"
            className="w-full rounded-xl border border-fd-border bg-fd-background px-4 py-2.5 text-sm outline-none focus:border-fd-primary"
          />
          <EmoteAutocomplete.Content>
            <EmoteAutocomplete.List className="overflow-hidden rounded-xl border border-fd-border bg-fd-popover shadow-xl" />
          </EmoteAutocomplete.Content>
        </EmoteAutocomplete.Root>
        <div className="rounded-lg border border-dashed border-fd-border px-3 py-2 text-xs">
          <span className="text-fd-muted-foreground">Value: </span>
          <span className="font-mono">{value || '(empty)'}</span>
        </div>
      </div>
    </Preview>
  );
}

export function EmoteInputPreview() {
  const [input, setInput] = useState('');
  const [area, setArea] = useState('');

  return (
    <Preview>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-fd-muted-foreground">
            Single line (controlled)
          </label>
          <EmoteInput
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Try typing :star:"
            className="w-full rounded-xl border border-fd-border bg-fd-background px-4 py-2.5 text-sm outline-none focus:border-fd-primary"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-fd-muted-foreground">
            Textarea (controlled)
          </label>
          <EmoteTextArea
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="Try typing :grinning_face:"
            className="min-h-24 w-full rounded-xl border border-fd-border bg-fd-background px-4 py-2.5 text-sm outline-none focus:border-fd-primary"
          />
        </div>
      </div>
    </Preview>
  );
}

const INITIAL_REACTIONS: Reaction[] = [
  { emoji: '👍', count: 12, active: false },
  { emoji: '❤️', count: 5, active: true },
  { emoji: '🎉', count: 8, active: false },
  { emoji: '😎', count: 2, active: false },
  { emoji: '👾', count: 4, active: false },
  { emoji: '🎀', count: 10, active: false },
];

export function ReactionCounterPreview() {
  const [reactions, setReactions] = useState<Reaction[]>(INITIAL_REACTIONS);

  return (
    <Preview>
      <ReactionCounter
        reactions={reactions}
        onToggle={(emoji, active) => {
          setReactions((prev) =>
            prev.map((r) =>
              r.emoji === emoji
                ? { ...r, active, count: r.count + (active ? 1 : -1) }
                : r,
            ),
          );
        }}
      />
    </Preview>
  );
}

export function ReactionButtonPreview() {
  const [last, setLast] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const emojis = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

  return (
    <Preview>
      <div className="flex flex-col items-center gap-8">
        <ReactionButton.Root
          onSelect={(emoji) => setLast(emoji)}
          className="w-fit gap-0 rounded-full border border-fd-border bg-fd-card px-2 py-1 shadow-2xl"
        >
          {emojis.map((emoji) => (
            <ReactionButton.Item
              key={emoji}
              emoji={emoji}
              burst
              className="flex h-10 w-10 items-center justify-center rounded-full border-transparent bg-transparent text-2xl transition-all hover:-translate-y-1 hover:scale-110 hover:border-transparent hover:bg-fd-accent"
            />
          ))}

          <ReactionButton.Divider className="mx-1 bg-fd-border" />

          <ReactionButton.Popover
            open={open}
            onOpenChange={(d) => setOpen(d.open)}
          >
            <ReactionButton.Trigger>
              <ReactionButton.Plus className="h-10 w-10 cursor-pointer rounded-full border-transparent bg-transparent text-fd-muted-foreground transition-all hover:border-transparent hover:bg-fd-accent hover:text-fd-foreground" />
            </ReactionButton.Trigger>
            <ReactionButton.Content>
              <EmoteList.Root
                onSelect={(e) => {
                  setLast(isLocalEmote(e) ? `:${e.name}:` : e.unicode);
                  setOpen(false);
                }}
                className="w-80 rounded-3xl border border-fd-border bg-fd-popover"
              >
                <EmoteList.Search />
                <EmoteList.Tabs />
                <EmoteList.Grid height={220} />
              </EmoteList.Root>
            </ReactionButton.Content>
          </ReactionButton.Popover>
        </ReactionButton.Root>

        <p className="text-xs text-fd-muted-foreground">
          {last ? `Last tapped: ${last}` : 'Tap any sticker.'}
        </p>
      </div>
    </Preview>
  );
}

export function ReactionSliderPreview() {
  const [value, setValue] = useState(50);

  return (
    <Preview>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-fd-muted-foreground">
            Intensity
          </span>
          <span className="font-mono text-xs text-fd-primary">
            {Math.round(value)}
          </span>
        </div>
        <ReactionSlider.Root emoji="❤️" value={value} onChange={setValue}>
          <ReactionSlider.Track>
            <ReactionSlider.Range />
          </ReactionSlider.Track>
          <ReactionSlider.Thumb>
            <ReactionSlider.Marker />
          </ReactionSlider.Thumb>
        </ReactionSlider.Root>
      </div>
    </Preview>
  );
}

// ─── Recipe previews ─────────────────────────────────────────────────────────
// Live React renders of the recipe patterns, shown above each recipe's code.

export function PostReactionsPreview() {
  const [reactions, setReactions] = useState<Reaction[]>([
    { emoji: '👍', count: 8, active: false },
    { emoji: '❤️', count: 3, active: true },
    { emoji: '🎉', count: 2, active: false },
  ]);
  const [pickerOpen, setPickerOpen] = useState(false);

  const handleToggle = (emoji: string, active: boolean) => {
    setReactions((prev) =>
      prev
        .map((r) =>
          r.emoji === emoji
            ? { ...r, active, count: r.count + (active ? 1 : -1) }
            : r,
        )
        .filter((r) => r.count > 0),
    );
  };

  const handleAdd = (emoji: string) => {
    setReactions((prev) => {
      const existing = prev.find((r) => r.emoji === emoji);
      if (existing) {
        return prev
          .map((r) =>
            r.emoji === emoji
              ? {
                  ...r,
                  active: !r.active,
                  count: r.count + (!r.active ? 1 : -1),
                }
              : r,
          )
          .filter((r) => r.count > 0);
      }
      return [...prev, { emoji, count: 1, active: true }];
    });
    setPickerOpen(false);
  };

  return (
    <Preview wide>
      <div className="flex w-full gap-3">
        <div
          aria-hidden
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-fd-primary/15 text-lg"
        >
          🦊
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-fd-foreground">vyers</span>
            <span className="text-[11px] text-fd-muted-foreground">
              Today at 12:42
            </span>
          </div>
          <p className="text-sm text-fd-foreground">
            Shipping the Svelte bindings today 🚀 — react with whatever fits.
          </p>
          <div className="mt-0.5 flex flex-wrap items-center gap-2">
            <ReactionCounter reactions={reactions} onToggle={handleToggle} />

            <ReactionButton.Popover
              open={pickerOpen}
              onOpenChange={(d) => setPickerOpen(d.open)}
            >
              <ReactionButton.Trigger>
                <button
                  aria-label="Add reaction"
                  className="flex h-7 items-center rounded-full border border-fd-border px-2.5 text-sm text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-foreground"
                >
                  ＋
                </button>
              </ReactionButton.Trigger>
              <ReactionButton.Content>
                <EmoteList.Root
                  onSelect={(e) =>
                    handleAdd(isLocalEmote(e) ? `:${e.name}:` : e.unicode)
                  }
                  className="w-80 rounded-3xl border border-fd-border bg-fd-popover"
                >
                  <EmoteList.Search />
                  <EmoteList.Tabs />
                  <EmoteList.Grid height={220} />
                </EmoteList.Root>
              </ReactionButton.Content>
            </ReactionButton.Popover>
          </div>
        </div>
      </div>
    </Preview>
  );
}

export function ChatComposerPreview() {
  const [value, setValue] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);

  const send = () => {
    const text = value.trim();
    if (!text) return;
    setMessages((prev) => [...prev, text]);
    setValue('');
  };

  return (
    <Preview wide>
      <div className="flex w-full flex-col gap-3">
        {messages.length > 0 && (
          <div className="flex flex-col items-end gap-1.5">
            {messages.map((message, i) => (
              <div
                key={i}
                className="max-w-[80%] rounded-2xl rounded-br-sm bg-fd-primary px-3 py-1.5 text-sm text-fd-primary-foreground"
              >
                {message}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-1 rounded-2xl border border-fd-border bg-fd-background p-1 focus-within:border-fd-primary">
          <EmoteAutocomplete.Root onSelect={(_, next) => setValue(next)}>
            <EmoteAutocomplete.Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                // Enter sends — unless the autocomplete already consumed it
                // (selecting a suggestion calls preventDefault).
                if (e.key === 'Enter' && !e.defaultPrevented) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Message… type : for emoji"
              className="min-w-0 flex-1 border-0 bg-transparent px-3 py-1.5 text-sm font-normal outline-none focus:shadow-none"
            />
            <EmoteAutocomplete.Content>
              <EmoteAutocomplete.List className="overflow-hidden rounded-xl border border-fd-border bg-fd-popover shadow-xl" />
            </EmoteAutocomplete.Content>
          </EmoteAutocomplete.Root>

          <ReactionButton.Popover
            open={pickerOpen}
            onOpenChange={(d) => setPickerOpen(d.open)}
          >
            <ReactionButton.Trigger>
              <ReactionButton.Plus className="h-8 w-8 shrink-0 cursor-pointer rounded-full border-transparent bg-transparent text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-foreground" />
            </ReactionButton.Trigger>
            <ReactionButton.Content>
              <EmoteList.Root
                onSelect={(e) => {
                  setValue(
                    (prev) =>
                      `${prev}${isLocalEmote(e) ? `:${e.name}:` : e.unicode}`,
                  );
                  setPickerOpen(false);
                }}
                className="w-80 rounded-3xl border border-fd-border bg-fd-popover"
              >
                <EmoteList.Search />
                <EmoteList.Tabs />
                <EmoteList.Grid height={220} />
              </EmoteList.Root>
            </ReactionButton.Content>
          </ReactionButton.Popover>

          <button
            type="button"
            onClick={send}
            className="shrink-0 rounded-full bg-fd-primary px-4 py-1.5 text-sm font-semibold text-fd-primary-foreground"
          >
            Send
          </button>
        </div>
      </div>
    </Preview>
  );
}

const FEEDBACK_LEVELS = ['😞', '🙁', '😐', '🙂', '🤩'];

export function FeedbackWidgetPreview() {
  const [value, setValue] = useState(50);
  const [submitted, setSubmitted] = useState<number | null>(null);
  const level = Math.max(0, Math.min(4, Math.floor(value / 20)));
  const emoji = FEEDBACK_LEVELS[level];

  return (
    <Preview>
      <div className="flex w-full flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold tracking-tight">
            How was your experience?
          </h3>
          <span className="font-mono text-xs text-fd-muted-foreground">
            {level + 1} / 5
          </span>
        </div>

        <ReactionSlider.Root emoji={emoji} value={value} onChange={setValue}>
          <ReactionSlider.Track>
            <ReactionSlider.Range />
          </ReactionSlider.Track>
          <ReactionSlider.Thumb>
            <ReactionSlider.Marker />
          </ReactionSlider.Thumb>
        </ReactionSlider.Root>

        <button
          type="button"
          onClick={() => setSubmitted(level + 1)}
          className="rounded-full bg-fd-primary px-4 py-2 text-sm font-semibold text-fd-primary-foreground"
        >
          Send feedback
        </button>

        {submitted !== null && (
          <p className="text-xs text-fd-muted-foreground">
            Submitted rating:{' '}
            <span className="font-mono text-fd-foreground">
              {submitted} / 5
            </span>
          </p>
        )}
      </div>
    </Preview>
  );
}
