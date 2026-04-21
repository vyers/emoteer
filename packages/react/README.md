# @emoteer/react

<img width="1500" height="500" alt="emoteer-promocional" src="https://raw.githubusercontent.com/vyers/emoteer/main/assets/promotional-cover.png" />

Headless and styled React components for emoji pickers, reactions, inline autocomplete, shortcode-to-unicode inputs, and reaction intensity sliders.

Built on [Zag.js](https://zagjs.com/) state machines, Tailwind CSS v4, and [emojibase](https://emojibase.dev/) data. Tree-shakeable, accessible, typed, SSR-safe.

## Install

```bash
npm install @emoteer/react
# or
pnpm add @emoteer/react
```

Peer dependencies:

| Package     | Range    |
| ----------- | -------- |
| `react`     | `^19.0.0` |
| `react-dom` | `^19.0.0` |

`@emoteer/core` and `@emoteer/theme` come bundled as transitive dependencies — no need to install them directly.

## Setup

### Styles

The package ships a Tailwind v4 preset at `@emoteer/react/tailwind`. Import it from a CSS file processed by your app's Tailwind, after the main Tailwind import:

```css
@import "tailwindcss";
@import "@emoteer/react/tailwind";
```

The preset pulls in the `--em-*` design tokens and points Tailwind at the compiled components so it generates only the utilities they actually use — inside your app's own `@layer utilities`, with no pre-compiled rules to clash with the rest of your styles. **Tailwind CSS v4 is required** in the consuming app.

If you only want the tokens and not the component styles, import the theme directly:

```css
@import "@emoteer/theme/tailwind";
```

### Provider

Every data-aware component expects an `EmoteProvider` ancestor:

```tsx
import { EmoteProvider } from "@emoteer/react";

export function App({ children }) {
  return (
    <EmoteProvider locale="en">
      {children}
    </EmoteProvider>
  );
}
```

Place it once, near the root. It loads emoji data lazily per locale and memoises the shortcode/unicode indexes for every descendant.

## Quick start

```tsx
import {
  EmoteProvider,
  EmoteListPicker,
  ReactionButton,
  ReactionCounter,
} from "@emoteer/react";

export function Message() {
  const [reactions, setReactions] = useState([
    { emoji: "👍", count: 3, active: false },
  ]);

  return (
    <EmoteProvider locale="en">
      <ReactionButton.Root onSelect={addReaction}>
        <ReactionButton.Item emoji="👍" />
        <ReactionButton.Item emoji="🎉" burst />
        <ReactionButton.Divider />
        <ReactionButton.Popover>
          <ReactionButton.Trigger />
          <ReactionButton.Content>
            <EmoteListPicker onSelect={addEmoji} />
          </ReactionButton.Content>
        </ReactionButton.Popover>
      </ReactionButton.Root>

      <ReactionCounter reactions={reactions} onToggle={toggle} />
    </EmoteProvider>
  );
}
```

## Core concepts

### Compound components

Every non-trivial component is exposed as a compound API: a `Root` that owns state via a Zag machine + subcomponents that read from context via getter-prop patterns.

```tsx
<EmoteList.Root onSelect={…}>
  <EmoteList.Search />
  <EmoteList.Tabs />
  <EmoteList.Grid />
  <EmoteList.Preview />
</EmoteList.Root>
```

Swap or skip any subcomponent, wrap it, style it — the state lives in the `Root`.

For the common case, convenience exports (`EmoteListPicker`) compose the default arrangement so you don't have to.

### Text inputs: controlled or uncontrolled

`EmoteInput` and `EmoteTextArea` support both modes:

- **Controlled** — pass `value` + `onChange`. The caret position is preserved across conversions via a layout effect, so typing `:sm` → `:smile:` → `😄` feels natural even in the middle of a word.
- **Uncontrolled** — pass `defaultValue` (or nothing). The component manages its own value and mutates the DOM in place.

In both modes, `onChange(e)` receives the **already-converted** text via `e.target.value`.

```tsx
// Controlled
<EmoteInput value={value} onChange={(e) => setValue(e.target.value)} />

// Uncontrolled
<EmoteInput defaultValue="" onChange={(e) => console.log(e.target.value)} />
```

`EmoteAutocomplete.Input` is **uncontrolled by design** — the `Root` tracks the live input value internally to detect the `:shortcode` trigger. Pass `defaultValue`, read the final text via `onSelect(emoji, value)`.

### SSR

Components do not touch `window` or `document` during render. `EmoteProvider` loads emoji data inside a `useEffect`, so the first server render always sees an empty dataset and loading-aware components (`EmoteList.Grid`) gracefully render a placeholder until hydration.

## Components

### `EmoteProvider`

Loads emoji data once per app and exposes it via context.

```tsx
<EmoteProvider locale="en" natives locals={[]}>
  {children}
</EmoteProvider>
```

| Prop      | Type                      | Default | Description                                                      |
| --------- | ------------------------- | ------- | ---------------------------------------------------------------- |
| `natives` | `boolean`                 | `true`  | Load native Unicode emoji.                                       |
| `locals`  | `LocalEmote[]`            | `[]`    | Developer-defined custom emotes (Tier 1).                        |
| `locale`  | `Locale`                  | `'en'`  | BCP 47 tag. IDE autocompletes the 28 supported locales.          |
| `cloud`   | `CloudConfig`             | —       | Reserved for the forthcoming Emoteer Cloud tier.                 |

Access context with `useEmoteContext()`:

```tsx
const { emojis, shortcodeIndex, unicodeIndex, isLoading, error } =
  useEmoteContext();
```

`error` is populated if `loadEmojis` rejects — useful for surfacing retry UI.

### `EmoteList` / `EmoteListPicker`

Virtualized emoji picker with search, category tabs, and a hover preview panel.

```tsx
<EmoteList.Root onSelect={handleSelect}>
  <EmoteList.Search placeholder="Search emojis…" />
  <EmoteList.Tabs display="emoji" />
  <EmoteList.Grid height={320} />
  <EmoteList.Preview />
</EmoteList.Root>
```

`EmoteListPicker` is the default arrangement — same composition, zero config.

```tsx
<EmoteListPicker onSelect={(emoji) => insert(emoji.unicode)} />
```

**Root props**

| Prop        | Type                                | Default | Description                                   |
| ----------- | ----------------------------------- | ------- | --------------------------------------------- |
| `onSelect`  | `(emoji: NativeEmoji) => void`      | —       | Fires when a cell is clicked.                 |
| `className` | `string`                            | —       | Override the outer container classes.         |

**Subcomponents**

| Component            | Notable props                                             |
| -------------------- | --------------------------------------------------------- |
| `EmoteList.Search`   | `placeholder`, `className`                                |
| `EmoteList.Tabs`     | `display: 'emoji' \| 'label'` (default `'emoji'`), `groups: EmojiGroupNumber[]` to filter |
| `EmoteList.Grid`     | `height: number` (default `280`)                          |
| `EmoteList.Preview`  | `className`                                                |

**Features**

- Virtualised via `@tanstack/react-virtual` — renders only visible rows.
- Sticky section headers synchronized with scroll position.
- Persistent favourites via `localStorage` (key `emoteer-favorites`). Favourites surface as a "Most Used" tab pinned to the top.
- Copy-on-click and favourite toggle in the preview panel.
- Full `role="grid"` / `role="row"` / `role="rowheader"` / `role="gridcell"` semantics.

### `EmoteAutocomplete`

Inline `:shortcode` suggestions anchored to an input via Floating UI. Implements the [WAI-ARIA combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/).

```tsx
<EmoteAutocomplete.Root onSelect={(emoji, value) => setText(value)}>
  <EmoteAutocomplete.Input defaultValue="" />
  <EmoteAutocomplete.Content>
    <EmoteAutocomplete.List />
  </EmoteAutocomplete.Content>
</EmoteAutocomplete.Root>
```

**Keyboard**

| Key                      | Action                                |
| ------------------------ | ------------------------------------- |
| `ArrowDown` / `Tab`      | Next suggestion                       |
| `ArrowUp` / `Shift+Tab`  | Previous suggestion                   |
| `Enter`                  | Select highlighted suggestion         |
| `Escape`                 | Close the suggestion list             |

**a11y**

The input carries `role="combobox"`, `aria-autocomplete="list"`, `aria-expanded`, `aria-controls` and `aria-activedescendant`. The listbox has a stable `id` tied to the combobox.

> **Uncontrolled by design.** The `Root` tracks the live input value internally to detect the `:shortcode` trigger. Use `defaultValue`, read the final text via `onSelect(emoji, value)`.

### `EmoteInput` / `EmoteTextArea`

Drop-in input / textarea that expands `:shortcode:` to its unicode emoji as the user types. Works in any script — Latin, Cyrillic, Hangul, Han, Devanagari, etc.

```tsx
// Controlled
<EmoteInput
  value={value}
  onChange={(e) => setValue(e.target.value)}
  placeholder="Type :smile: to expand"
/>

// Uncontrolled
<EmoteTextArea
  defaultValue=""
  rows={5}
  onChange={(e) => setValue(e.target.value)}
/>
```

Extends `InputHTMLAttributes<HTMLInputElement>` / `TextareaHTMLAttributes<HTMLTextAreaElement>`. After a conversion, the caret position is adjusted by the delta between original and converted lengths, so typing feels natural even when shortcodes expand in the middle of a word.

Both props work — pass `value` for controlled, `defaultValue` for uncontrolled. `onChange(e)` always fires with the converted text in `e.target.value`.

### `ReactionButton`

Composable reaction bar with item buttons, a divider, and an optional popover trigger for an emoji picker.

```tsx
<ReactionButton.Root onSelect={(emoji) => addReaction(emoji)}>
  <ReactionButton.Item emoji="👍" />
  <ReactionButton.Item emoji="🎉" burst />
  <ReactionButton.Divider />
  <ReactionButton.Popover>
    <ReactionButton.Trigger />
    <ReactionButton.Content>
      <EmoteListPicker />
    </ReactionButton.Content>
  </ReactionButton.Popover>
</ReactionButton.Root>
```

For a floating Instagram-style sticker button:

```tsx
<ReactionButton.Sticker emoji="❤️" onClick={like} />
```

**Subcomponents**

| Component                  | Purpose                                                    |
| -------------------------- | ---------------------------------------------------------- |
| `ReactionButton.Root`      | Context provider. Accepts `onSelect(emoji)`.               |
| `ReactionButton.Item`      | Emoji button. Props: `emoji`, `label`, `burst`, standard button attributes. |
| `ReactionButton.Plus`      | "+" button for a custom trigger.                           |
| `ReactionButton.Sticker`   | Large circular sticker button with burst on click.         |
| `ReactionButton.Divider`   | Thin vertical separator.                                   |
| `ReactionButton.Popover`   | Wraps `Trigger` + `Content` with a `@zag-js/popover` machine. |
| `ReactionButton.Trigger`   | Cloned-element trigger, defaults to a `Plus` button.       |
| `ReactionButton.Content`   | Portaled popover content; typically wraps an `EmoteListPicker`. |

`burst` turns on the particle animation on click — scales, color, timing driven by `--animate-burst` from `@emoteer/theme`.

### `ReactionCounter`

Grouped reactions with counts and pressed state. Fully declarative.

```tsx
<ReactionCounter
  reactions={[
    { emoji: "👍", count: 3, active: true },
    { emoji: "🎉", count: 1, active: false },
  ]}
  onToggle={(emoji, active) => toggle(emoji, active)}
/>
```

Each button carries `aria-pressed` and a descriptive `aria-label` (`"👍 3 reactions, you reacted"`).

### `ReactionSlider`

Intensity slider (0–100 by default) built on `@zag-js/slider`, with an emoji thumb that scales with the value and a value marker that only appears while dragging.

```tsx
<ReactionSlider.Root value={value} onChange={setValue} emoji="🔥">
  <ReactionSlider.Track>
    <ReactionSlider.Range />
  </ReactionSlider.Track>
  <ReactionSlider.Thumb>
    <ReactionSlider.Marker>
      {(v) => `${Math.round(v)}%`}
    </ReactionSlider.Marker>
  </ReactionSlider.Thumb>
</ReactionSlider.Root>
```

**Root props**

| Prop            | Type                              | Default   | Description                                                  |
| --------------- | --------------------------------- | --------- | ------------------------------------------------------------ |
| `value`         | `number`                          | —         | Controlled value.                                            |
| `onChange`      | `(value: number) => void`         | —         | Fires on every value change.                                 |
| `onChangeEnd`   | `(value: number) => void`         | —         | Fires when the user releases the thumb.                      |
| `min` / `max`   | `number`                          | `0` / `100` | Range bounds.                                                |
| `emoji`         | `string`                          | `'❤️'`    | Thumb glyph.                                                 |
| `burst`         | `boolean`                         | `true`    | Particle burst on release.                                   |
| `scaleEffect`   | `boolean`                         | `true`    | Whether the thumb scales with the value.                     |
| `ariaLabel`     | `string`                          | `'Reaction intensity'` | Screen-reader label for the slider.                       |

## Hooks

### `useEmoteContext()`

Returns the full emoji context:

```ts
{
  emojis: NativeEmoji[];
  shortcodeIndex: Map<string, NativeEmoji>;
  unicodeIndex: Map<string, NativeEmoji>;
  locals: LocalEmote[];
  isLoading: boolean;
  error: Error | null;
}
```

Throws if called outside `EmoteProvider`.

## Types

Re-exported from `@emoteer/core` for consumer convenience:

```ts
import type {
  NativeEmoji,
  LocalEmote,
  CloudConfig,
  Reaction,
  Locale,
  SupportedLocale,
} from "@emoteer/react";
```

## Accessibility

- Every interactive element is keyboard reachable.
- Labels, roles, and states follow WAI-ARIA authoring practices for combobox, grid, slider, and popover.
- Focus rings use the `em-primary` token so they remain visible through theme overrides.
- `@emoteer/theme` ships no base reset — focus outlines from consumer styles and the browser's default focus ring are preserved.

## License

MIT © vyers
