# @emoteer/core

Framework-agnostic core for [Emoteer](https://github.com/vyers/emoteer): emoji loading, indexes, types, shortcode utilities, and a small SVG icon set.

Zero UI. Zero framework. Use this directly when you're integrating emoji data into a non-React surface (Svelte, Vue, server-side pipelines, CLIs, tests) — or let [`@emoteer/react`](https://www.npmjs.com/package/@emoteer/react) consume it transitively.

## Install

```bash
npm install @emoteer/core
# or
pnpm add @emoteer/core
```

## Loading emoji data

`loadEmojis(locale?)` asynchronously resolves the full native Unicode emoji set for a locale. Each locale lives in its own dynamic import, so bundlers split the payload per language and your app only pays for what it uses.

```ts
import { loadEmojis, buildShortcodeIndex, buildUnicodeIndex } from "@emoteer/core";

const emojis = await loadEmojis("en");
const byShortcode = buildShortcodeIndex(emojis);
const byUnicode = buildUnicodeIndex(emojis);
```

Unsupported locales fall back to `'en'` at runtime.

### Supported locales

28 BCP 47 tags ship with bundled labels and shortcodes:

```
bn  da  de     en  en-gb  es  es-mx  et  fi  fr
hi  hu  it     ja  ko     lt  ms     nb  nl  pl
pt  ru  sv     th  uk     vi  zh     zh-hant
```

Exposed both as a runtime array and as a TypeScript union:

```ts
import { SUPPORTED_LOCALES, type SupportedLocale, type Locale } from "@emoteer/core";
```

- `SupportedLocale` — strict union of the 28 tags, useful for constraint checks.
- `Locale = SupportedLocale | (string & {})` — accepts any string while keeping IDE autocomplete. Pass unknown tags without compilation errors; they fall back at runtime.

## Indexes

Two O(1) lookup builders. Both return `Map<string, NativeEmoji>`.

| Builder                           | Key                             | Use case                                  |
| --------------------------------- | ------------------------------- | ----------------------------------------- |
| `buildShortcodeIndex(emojis)`     | `":shortcode:"` (colons included) | Matching inline shortcodes in text input. |
| `buildUnicodeIndex(emojis)`       | The unicode glyph               | Reverse lookup by rendered emoji.         |

Index once per dataset, reuse for the lifetime of the app.

## Utilities

### `textToEmoji(text, shortcodeIndex)`

Replaces every `:shortcode:` occurrence in a string with its unicode glyph.

```ts
import { textToEmoji } from "@emoteer/core";

textToEmoji("Hello :grinning_face:, good night :crescent_moon:", index);
// → "Hello 😀, good night 🌙"
```

Unicode-aware (`\p{L}` regex): works for shortcodes in Cyrillic, Hangul, Devanagari, and other scripts.

### `findEmojiByShortcode(":smile:", index)` · `findEmojiByUnicode("😀", index)`

Single-emoji lookup helpers. Return `NativeEmoji | null`.

## Types

```ts
import type {
  NativeEmoji,
  LocalEmote,
  CloudConfig,
  EmojiGroupNumber,
  EmojiGroupName,
  EmoteTier,
  Locale,
  SupportedLocale,
} from "@emoteer/core";
```

### `NativeEmoji`

```ts
interface NativeEmoji {
  unicode: string;      // "😀"
  label: string;        // "grinning face"
  shortcodes: string[]; // ["grinning_face"]
  group: number;        // emojibase group number (0–9)
  hexcode: string;      // "1F600"
  tags?: string[];
}
```

### `LocalEmote`

Developer-defined custom emote (local or remote image). Tier 1 of the emoji model.

```ts
interface LocalEmote {
  id: string;
  name: string;     // display name, used as shortcode without colons
  src: string;      // URL or local path
  category?: string;
}
```

### `CloudConfig`

Credentials for the planned Emoteer Cloud tier. Reserved — not used yet.

## Groups

`EMOJI_GROUPS` maps emojibase group numbers to display names. Use it to render category tabs:

```ts
import { EMOJI_GROUPS } from "@emoteer/core";

// -1: "Most Used"     0: "Smileys & Emotion"  1: "People & Body"
//  3: "Animals & Nature"  4: "Food & Drink"   5: "Travel & Places"
//  6: "Activities"    7: "Objects"            8: "Symbols"   9: "Flags"
```

Group `2` (skin-tone components) is skipped at load time.

## Shortcode providers

Each locale uses the best shortcode provider emojibase-data ships:

- **`emojibase.json`** — snake_case Latin shortcodes (`grinning_face`). Available in: `en`, `en-gb`, `fr`, `ja`, `ru`, `sv`, `zh`.
- **`cldr.json`** — natural-language phrases ("grinning face", "flag: United States"), normalized to snake_case at load time by a Unicode-aware slug function. Available for the remaining 21 locales.

The normalization preserves non-Latin scripts — a Hangul CLDR phrase like `"활짝 웃는 얼굴"` becomes the shortcode `활짝_웃는_얼굴`, usable via `textToEmoji`.

## Icons

A bundled set of outline SVG path strings (`copy`, `check`, `plus`, `star`, and more) used internally by `@emoteer/react`. Useful if you're building your own UI on top of `@emoteer/core` and want visual continuity.

```ts
import { Icons, type IconName } from "@emoteer/core";

const path = Icons.star; // SVG `d` attribute
```

## Bundle behaviour

- ESM-only, `sideEffects: false`.
- Each locale's `data.json` + shortcodes live in their own chunks; bundlers (Webpack, Vite, Turbopack, Rollup) split them automatically thanks to the static dynamic-import map.
- Core ships in ~7 KB minified; each locale data chunk is ~100–200 KB of raw JSON (loaded lazily).

## License

MIT © vyers
