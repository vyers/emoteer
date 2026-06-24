# @emoteer/svelte

<img width="1500" height="500" alt="emoteer-promocional" src="https://raw.githubusercontent.com/vyers/emoteer/main/assets/promotional-cover.png" />

Headless and styled **Svelte 5** components for emoji pickers, reactions, inline autocomplete, shortcode-to-unicode inputs, and reaction intensity sliders.

Built on [Zag.js](https://zagjs.com/) state machines and [emojibase](https://emojibase.dev/) data. Truly headless (style-free markup with `data-part` hooks), with prebuilt CSS that works with or without Tailwind v4. Tree-shakeable, accessible, typed, SSR-safe. This is the Svelte port of [`@emoteer/react`](https://www.npmjs.com/package/@emoteer/react) — same components, same styling contract.

## Install

```bash
npm install @emoteer/svelte
# or
pnpm add @emoteer/svelte
```

Peer dependencies:

| Package  | Range      |
| -------- | ---------- |
| `svelte` | `^5.20.0` |

`@emoteer/core` and `@emoteer/theme` come bundled as transitive dependencies — no need to install them directly.

> Requires **Svelte 5** (runes mode). The components use `$state`/`$derived`/`$props.id()` internally.

## Setup

### Styles

The components ship **no styling baked into the markup** — they render stable
`data-scope` / `data-part` hooks and accept your `class`. Pick the level that
fits your app. **Tailwind is optional.**

**1. Styled, without Tailwind** — import the prebuilt, framework-agnostic
stylesheet once (in your root layout or `+layout.svelte`):

```ts
import "@emoteer/svelte/styles.css";
```

That's it — plain CSS, no build pipeline required. It pulls in the `--em-*`
design tokens and styles every part with them, so you theme by overriding tokens
(see [`@emoteer/theme`](https://www.npmjs.com/package/@emoteer/theme)).

**2. Styled, with Tailwind v4** — import the preset from a CSS file in your
Tailwind pipeline. You get the default look **plus** `bg-em-*` / `rounded-em-*`
token utilities to override with:

```css
@import "tailwindcss";
@import "@emoteer/svelte/tailwind";
```

**3. Fully headless** — import nothing (or only `@emoteer/theme/css` for the
tokens) and write your own CSS against the styling contract. The logic,
accessibility and state all work with zero styles.

### Styling contract (`data-part`)

Identical to the React package: every rendered element carries
`data-scope="<component>"` + `data-part="<part>"`, and exposes state via `data-*`
/ ARIA attributes.

```css
[data-scope="emote-list"][data-part="cell"]:hover {
  background: rebeccapurple;
}
[data-scope="reaction-counter"][data-part="chip"][data-active] {
  outline: 2px solid hotpink;
}
```

### Provider

Every data-aware component expects an `EmoteProvider` ancestor. Place it once,
near the root:

```svelte
<script>
  import { EmoteProvider } from "@emoteer/svelte";
</script>

<EmoteProvider locale="en">
  <slot />
</EmoteProvider>
```

It loads emoji data lazily per locale and memoises the shortcode/unicode indexes
for every descendant.

## Quick start

```svelte
<script lang="ts">
  import {
    EmoteProvider,
    EmoteListPicker,
    ReactionButton,
    ReactionCounter,
    type Reaction,
  } from "@emoteer/svelte";

  let reactions = $state<Reaction[]>([{ emoji: "👍", count: 3, active: false }]);

  function addReaction(emoji: string) {
    /* … */
  }
  function toggle(emoji: string, active: boolean) {
    /* … */
  }
</script>

<EmoteProvider locale="en">
  <ReactionButton.Root onSelect={addReaction}>
    <ReactionButton.Item emoji="👍" />
    <ReactionButton.Item emoji="🎉" burst />
    <ReactionButton.Divider />
    <ReactionButton.Popover>
      <ReactionButton.Trigger />
      <ReactionButton.Content>
        <EmoteListPicker onSelect={(e) => addReaction(/* … */)} />
      </ReactionButton.Content>
    </ReactionButton.Popover>
  </ReactionButton.Root>

  <ReactionCounter {reactions} onToggle={toggle} />
</EmoteProvider>
```

## Core concepts

### Compound components

Every non-trivial component is a compound API: a `Root` that owns state +
subcomponents that read it from context. Svelte 5's dotted component syntax
(`<EmoteList.Root>`) makes this read just like the React version:

```svelte
<EmoteList.Root onSelect={handleSelect}>
  <EmoteList.Search />
  <EmoteList.Tabs />
  <EmoteList.Grid />
  <EmoteList.Preview />
</EmoteList.Root>
```

For the common case, convenience components (`EmoteListPicker`) compose the
default arrangement so you don't have to.

### Differences from the React API

The component set, behaviour, and `data-part` contract are identical. Only the
prop conventions follow Svelte idiom:

| React                       | Svelte                                          |
| --------------------------- | ----------------------------------------------- |
| `className`                 | `class`                                         |
| `onChange` (DOM)            | `oninput` / `bind:value`                        |
| render-prop `children`      | `{#snippet children(value)}…{/snippet}`         |
| `useEmoteContext()` hook    | `useEmoteContext()` (call in `<script>`)        |

Library-specific callbacks keep their names: `onSelect`, `onToggle`,
`onChange`/`onChangeEnd` (slider), `onOpenChange` (popover).

### Text inputs: `bind:value`

`EmoteInput` and `EmoteTextArea` expand `:shortcode:` to its unicode emoji as
you type, preserving the caret position across conversions:

```svelte
<EmoteInput bind:value={text} placeholder="Type :smile: to expand" />
<EmoteTextArea bind:value={text} rows={5} />
```

`EmoteAutocomplete.Input` is **uncontrolled by design** — the `Root` tracks the
live input value internally to detect the `:shortcode` trigger. Read the final
text via `onSelect(emote, value)`.

### SSR

Components don't touch `window`/`document` during render. `EmoteProvider` loads
emoji data inside an `$effect` (client-only), so the first server render sees an
empty dataset and loading-aware components render a placeholder until hydration.

## Components

| Component                              | Notes                                                                 |
| -------------------------------------- | --------------------------------------------------------------------- |
| `EmoteProvider`                        | Loads emoji data once; props: `natives`, `locals`, `locale`, `cloud`. |
| `EmoteList.*` / `EmoteListPicker`      | Virtualised picker: `Search`, `Tabs`, `Grid`, `Preview`.              |
| `EmoteAutocomplete.*`                  | Inline `:shortcode` suggestions via Floating UI.                      |
| `EmoteInput` / `EmoteTextArea`         | `:shortcode:` → unicode as you type (`bind:value`).                    |
| `ReactionButton.*`                     | Reaction bar + optional Zag popover picker; `Item`, `Plus`, `Sticker`, `Divider`. |
| `ReactionCounter`                      | Declarative grouped reactions with counts + pressed state.            |
| `ReactionSlider.*`                     | Intensity slider with an emoji thumb and drag marker.                |

### `useEmoteContext()`

Returns the reactive emote store provided by an ancestor `<EmoteProvider>`.
Call it at the top of a component `<script>`:

```svelte
<script lang="ts">
  import { useEmoteContext } from "@emoteer/svelte";
  const ctx = useEmoteContext();
  // ctx.emojis, ctx.locals, ctx.emotes, ctx.shortcodeIndex,
  // ctx.unicodeIndex, ctx.isLoading, ctx.error — all reactive.
</script>
```

Throws if called outside `EmoteProvider`.

## Types

Re-exported from `@emoteer/core` for convenience:

```ts
import {
  isLocalEmote,
  isNativeEmoji,
  type NativeEmoji,
  type LocalEmote,
  type Emote,
  type CloudConfig,
  type Reaction,
  type Locale,
  type SupportedLocale,
} from "@emoteer/svelte";
```

## License

MIT © vyers
