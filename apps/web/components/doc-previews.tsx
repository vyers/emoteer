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

function Preview({ children }: { children: ReactNode }) {
  return (
    <EmoteProvider locals={customEmotes}>
      <div className="not-prose my-6 flex min-h-48 items-center justify-center rounded-2xl border border-fd-border bg-fd-card/50 p-8">
        <div className="w-full max-w-sm">{children}</div>
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
