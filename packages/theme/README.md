# @emoteer/theme

<img width="1500" height="500" alt="emoteer-promocional" src="https://raw.githubusercontent.com/vyers/emoteer/main/assets/promotional-cover.png" />

Design tokens, base CSS and Tailwind CSS v4 preset for [emoteer](https://emoteer.vyers.dev).

**CSS-only.** This package ships no JavaScript — just two CSS entry points. It is normally consumed transitively via [`@emoteer/react`](https://www.npmjs.com/package/@emoteer/react); install it directly only if you want the raw tokens or the Tailwind preset without the components.

## Install

```bash
npm install @emoteer/theme
# or
pnpm add @emoteer/theme
```

## Entry points

Two CSS files, pick one based on your setup:

| Import                          | Format          | Use when…                                                  |
| ------------------------------- | --------------- | ---------------------------------------------------------- |
| `@emoteer/theme/css`            | Plain CSS       | You're not on Tailwind. Ships CSS custom properties only.  |
| `@emoteer/theme/tailwind`       | Tailwind v4 `@theme` | You use Tailwind v4 and want `bg-em-*` / `text-em-*` utilities. |

### `@emoteer/theme/css` — CSS variables

```ts
// app entry
import "@emoteer/theme/css";
```

Defines the full `--em-*` token set on `:root` and a dark override on `.dark`. Each token falls back to a neutral default and can be overridden by user-level tokens (`--background`, `--foreground`, `--primary`, …) so the theme slots into existing design systems without collisions.

### `@emoteer/theme/tailwind` — Tailwind v4 preset

```css
/* your tailwind entry css */
@import "@emoteer/theme/tailwind";
```

Re-exports the base CSS and adds a `@theme` block that exposes each `--em-*` token as a Tailwind utility — color utilities (`bg-em-bg`, `text-em-fg`, `border-em-border`, …), radius utilities (`rounded-em`, `rounded-em-search`, …) and border-width utilities (`border-em`, `border-em-reaction-sticker`, …) — plus the `animate-burst` keyframe used by the reaction particle effects.

Peer dependency: `tailwindcss@^4`. Marked optional — `npm` won't warn if you don't install it.

## Tokens

### Base tokens

| Token            | Default (light)                | Purpose                                                  |
| ---------------- | ------------------------------ | -------------------------------------------------------- |
| `--em-bg`        | `hsl(0 0% 100%)`               | Background of pickers, popovers, reaction bars           |
| `--em-fg`        | `hsl(0 0% 9%)`                 | Primary foreground text                                  |
| `--em-border`    | `hsl(0 0% 85%)`                | Borders on controls, scrollbars, separators             |
| `--em-primary`   | `hsl(0 0% 87%)`                | Focus rings, emphasized states                           |
| `--em-muted`     | `hsl(215.4 16.3% 46.9%)`       | Secondary text, de-emphasized labels                     |
| `--em-hover`     | `hsl(210 40% 96.1%)`           | Hover background for rows and buttons                    |
| `--em-active`    | `hsl(210 40% 91%)`             | Pressed / active background                              |
| `--em-shadow`    | `hsl(0 0% 0%)`                 | Shadow color (consumed by components as needed)          |
| `--em-radius`    | `0.5rem`                       | Base border radius                                       |
| `--em-border-width` | `0.5px`                     | Base border width for form controls                      |

Every token reads from a higher-level variable first — e.g. `--em-bg: var(--background, hsl(0 0% 100%))` — so overriding `--background` in your own stylesheet cascades automatically.

### Per-slot overrides

The base tokens above set the default look across the library. For finer control, every styled slot also exposes its own variable that defaults to the base token. Set just the slots you want to change and leave everything else untouched.

Four properties cascade this way: **radius**, **background**, **border color** and **border width**.

```
--em-<property>              ← global default for this property
--em-<property>-<slot>       ← per-slot override, defaults to the global
```

Slots:

| Slot                     | Used by                                            |
| ------------------------ | -------------------------------------------------- |
| `root`                   | Outer container of `EmoteList` / picker.           |
| `search`                 | `EmoteList.Search` input.                          |
| `preview`                | `EmoteList.Preview` panel.                         |
| `input`                  | `EmoteInput`.                                      |
| `textarea`               | `EmoteTextArea`.                                   |
| `autocomplete-input`     | `EmoteAutocomplete.Input`.                         |
| `autocomplete-list`      | `EmoteAutocomplete.List`.                          |
| `reaction-item`          | `ReactionButton.Item`.                             |
| `reaction-sticker`       | `ReactionButton.Sticker`.                          |
| `reaction-chip`          | `ReactionCounter` chip.                            |

Example — pill-shaped search and autocomplete, everything else unchanged:

```css
:root {
  --em-radius-search: 9999px;
  --em-radius-autocomplete-input: 9999px;
}
```

Example — thicker border on the sticker button only:

```css
:root {
  --em-border-width-reaction-sticker: 3px;
}
```

A couple of slots ship non-default values out of the box so the base look stays consistent:

- `--em-border-width-root: 1px` — the outer picker frame uses a visible edge.
- `--em-border-width-reaction-sticker: 2px` — stickers are heavier by design.
- `--em-border-width-autocomplete-list: 1px` — popover listbox borders are full-pixel.

## Dark mode

Apply the `dark` class to any ancestor (commonly `<html>`):

```html
<html class="dark">
  …
</html>
```

The `.dark` selector overrides the token subset that changes between schemes. If you're using a theme-switcher library like `next-themes` with `attribute="class"`, you're already set.

## Customization

Override tokens anywhere in your own CSS — they cascade like any custom property:

```css
:root {
  --em-primary: hsl(280 90% 60%);     /* brand accent */
  --em-radius: 0.25rem;                /* tighter corners everywhere */
  --em-radius-search: 9999px;          /* …except the search box */
}

.dark {
  --em-border: hsl(260 20% 30%);       /* dark border tint */
}
```

Because per-slot tokens default to their base token, a change to `--em-radius` propagates to every slot unless you've explicitly overridden one.

Or map them to an existing design system's own tokens:

```css
:root {
  --em-bg: var(--surface-01);
  --em-fg: var(--text-primary);
  --em-border: var(--border-subtle);
  --em-primary: var(--accent-500);
}
```

## Zag.js scroll-area CSS

`base.css` also includes a tiny block that hides native scrollbars on any element with `data-part="viewport"` (emitted by `@zag-js/scroll-area`). This is framework-agnostic and will remain compatible with future Svelte and Vue bindings that use the same Zag machines.

## License

MIT © vyers
