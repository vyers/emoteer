# @emoteer/theme

Design tokens, base CSS and Tailwind CSS v4 preset for [emoteer](https://github.com/vyers/emoteer).

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

Re-exports the base CSS and adds a `@theme` block that exposes each `--em-*` token as a Tailwind color utility (`bg-em-bg`, `text-em-fg`, `border-em-border`, …), plus the `animate-burst` keyframe used by the reaction particle effects.

Peer dependency: `tailwindcss@^4`. Marked optional — `npm` won't warn if you don't install it.

## Tokens

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

Every token reads from a higher-level variable first — e.g. `--em-bg: var(--background, hsl(0 0% 100%))` — so overriding `--background` in your own stylesheet cascades automatically.

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
  --em-radius: 0.25rem;                /* tighter corners */
}

.dark {
  --em-border: hsl(260 20% 30%);       /* dark border tint */
}
```

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
