# Emoteer

<img width="1500" height="500" alt="emoteer-promocional" src="./assets/promotional-cover.png" />

The modern emoji SDK for the web. Headless and styled React components for emoji pickers, reactions, inline autocomplete, shortcode-to-unicode inputs, and reaction intensity sliders — built on [Zag.js](https://zagjs.com/) state machines and [emojibase](https://emojibase.dev/) data, with prebuilt CSS that works with or without Tailwind v4.

```bash
npm install @emoteer/react
```

```ts
// prebuilt styles — plain CSS, no Tailwind required
import "@emoteer/react/styles.css";
```

> On Tailwind v4? Use the preset instead: `@import "@emoteer/react/tailwind";`.
> Prefer headless? Skip the import and style the `data-part` contract yourself.
> See the [package README](./packages/react#setup).

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

- **Truly headless** — no styling is baked into the markup. Every element exposes stable `data-scope`/`data-part` hooks (plus `data-*` state), so you can drop in the prebuilt CSS, theme via tokens, or bring your own styles entirely — no Tailwind needed, no forking.
- **Compound API** — every component is a compound (`Root` + subcomponents) so layouts, labels, and arrangement can be recomposed freely.
- **Accessible by default** — WAI-ARIA patterns for combobox, grid, tooltip, popover and slider; keyboard navigation everywhere interactive.
- **SSR-safe** — no DOM access during render, compatible with Next.js `app/` and Remix.
- **Tree-shakeable** — ESM output, per-locale code splitting of emoji data so apps ship only what they use.
- **28 locales** — BCP 47 tags with native-language labels and shortcodes (emojibase + CLDR providers).
- **TypeScript first** — strict typings, discriminated unions for emoji tiers, `Locale` union with IDE autocomplete.
- **Zero resets** — ships no CSS reset and no Tailwind `preflight`; styles are scoped to the components' own `data-part` selectors, so they never override your base styles.

## Packages

| Package | Purpose | npm |
| --- | --- | --- |
| [`@emoteer/core`](./packages/core) | Framework-agnostic loader, shortcode utilities, indexes, and types. Use directly if you're building a non-React UI. | [![npm](https://img.shields.io/npm/v/@emoteer/core.svg)](https://www.npmjs.com/package/@emoteer/core) |
| [`@emoteer/theme`](./packages/theme) | CSS-only design tokens and Tailwind CSS v4 preset. Consumed transitively by `@emoteer/react`. | [![npm](https://img.shields.io/npm/v/@emoteer/theme.svg)](https://www.npmjs.com/package/@emoteer/theme) |
| [`@emoteer/react`](./packages/react) | Ready-to-use React 19 components (picker, autocomplete, reactions, slider, tooltip, inputs). | [![npm](https://img.shields.io/npm/v/@emoteer/react.svg)](https://www.npmjs.com/package/@emoteer/react) |
| [`@emoteer/svelte`](./packages/svelte) | The same component set for Svelte 5 (runes) — picker, autocomplete, reactions, slider, inputs. | [![npm](https://img.shields.io/npm/v/@emoteer/svelte.svg)](https://www.npmjs.com/package/@emoteer/svelte) |

Support for Vue is planned — Zag's state machines already run framework-agnostic, so porting the UI layer is the main work.

## Requirements

- **Node** ≥ 20 (development).
- **React** ^19 (peer dependency of `@emoteer/react`).
- **Svelte** ^5 (peer dependency of `@emoteer/svelte`).
- **Modern evergreen browsers** — Chromium, Firefox, Safari. No IE11. (The default stylesheet uses `color-mix()`.)
- **Tailwind CSS v4** — optional. Only needed if you opt into `@emoteer/react/tailwind`; the prebuilt `@emoteer/react/styles.css` and the headless path need no Tailwind.

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

Shipped:

- [x] `@emoteer/svelte` — first non-React binding, built on Svelte 5 runes

In progress:

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
