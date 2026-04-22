# Emoteer

<img width="1500" height="500" alt="emoteer-promocional" src="./assets/promotional-cover.png" />

The modern emoji SDK for the web. Headless and styled React components for emoji pickers, reactions, inline autocomplete, shortcode-to-unicode inputs, and reaction intensity sliders — built on [Zag.js](https://zagjs.com/) state machines, Tailwind CSS v4, and [emojibase](https://emojibase.dev/) data.

```bash
npm install @emoteer/react
```

```css
/* your app's main CSS, processed by Tailwind v4 */
@import "tailwindcss";
@import "@emoteer/react/tailwind";
```

```tsx
import { EmoteProvider, EmoteListPicker, isLocalEmote } from "@emoteer/react";

export function App() {
  return (
    <EmoteProvider locale="en">
      <EmoteListPicker
        onSelect={(e) =>
          console.log(isLocalEmote(e) ? `:${e.name}:` : e.unicode)
        }
      />
    </EmoteProvider>
  );
}
```

## Features

- **Headless primitives** — every component is exposed as a compound (`Root` + subcomponents) so layouts, labels, and styles can be overridden without forking.
- **Accessible by default** — WAI-ARIA patterns for combobox, grid, tooltip, popover and slider; keyboard navigation everywhere interactive.
- **SSR-safe** — no DOM access during render, compatible with Next.js `app/` and Remix.
- **Tree-shakeable** — ESM output, per-locale code splitting of emoji data so apps ship only what they use.
- **28 locales** — BCP 47 tags with native-language labels and shortcodes (emojibase + CLDR providers).
- **TypeScript first** — strict typings, discriminated unions for emoji tiers, `Locale` union with IDE autocomplete.
- **Zero runtime resets** — the Tailwind preset only contributes utilities used by the components and the `--em-*` tokens, no Tailwind preflight, so it never overrides consumer base styles.

## Packages

| Package | Purpose | npm |
| --- | --- | --- |
| [`@emoteer/core`](./packages/core) | Framework-agnostic loader, shortcode utilities, indexes, and types. Use directly if you're building a non-React UI. | [![npm](https://img.shields.io/npm/v/@emoteer/core.svg)](https://www.npmjs.com/package/@emoteer/core) |
| [`@emoteer/theme`](./packages/theme) | CSS-only design tokens and Tailwind CSS v4 preset. Consumed transitively by `@emoteer/react`. | [![npm](https://img.shields.io/npm/v/@emoteer/theme.svg)](https://www.npmjs.com/package/@emoteer/theme) |
| [`@emoteer/react`](./packages/react) | Ready-to-use React 19 components (picker, autocomplete, reactions, slider, tooltip, inputs). | [![npm](https://img.shields.io/npm/v/@emoteer/react.svg)](https://www.npmjs.com/package/@emoteer/react) |

Support for Svelte and Vue is planned — Zag's state machines already run framework-agnostic, so porting the UI layer is the main work.

## Requirements

- **Node** ≥ 20 (development).
- **React** ^19 (peer dependency of `@emoteer/react`).
- **Modern evergreen browsers** — Chromium, Firefox, Safari. No IE11.
- **Tailwind CSS v4** — required, since `@emoteer/react/tailwind` is a preset processed by your app's Tailwind pipeline.

## Monorepo

The repository is a [Turborepo](https://turbo.build/) with [pnpm](https://pnpm.io/) workspaces. To work on a single package:

```bash
pnpm install
pnpm --filter @emoteer/react build
pnpm --filter @emoteer/react check-types
```

Or across the whole workspace:

```bash
pnpm build
pnpm check-types
pnpm lint
```

## Roadmap

In progress:

- [ ] `@emoteer/svelte` — first non-React binding, built on Svelte 5 runes
- [ ] Skin-tone selector (long-press), state stored per-provider
- [ ] Recently used list with a pluggable storage adapter
- [ ] Expanded recipes (chat composer, feedback widget, live-chat)

Next:

- [ ] `@emoteer/vue` — Vue 3 binding with the same primitive surface
- [ ] Cloud sync for tenant-scoped custom emoji packs
- [ ] Animated emoji support (APNG / WebP / Lottie)
- [ ] Bundled picker themes (Slack-like, Discord-like, compact)
- [ ] Full i18n for category names and screen reader labels

See the [full roadmap](https://emoteer.vyers.dev/docs/roadmap) for shipped milestones, items under consideration, and anti-goals.

## License

[MIT](./LICENSE) © vyers
