# web

<img width="1500" height="500" alt="emoteer-promocional" src="https://raw.githubusercontent.com/vyers/emoteer/main/assets/promotional-cover.png" />

The [emoteer.vyers.dev](https://emoteer.vyers.dev) marketing site and documentation portal. Built with [Next.js](https://nextjs.org/) 16 (App Router) and [Fumadocs](https://fumadocs.dev/) on top of Tailwind CSS v4.

Run the development server:

```bash
pnpm dev
# or from the monorepo root:
pnpm --filter web dev
```

Open [http://localhost:3000](http://localhost:3000).

## Layout

| Route                     | Description                                                               |
| ------------------------- | ------------------------------------------------------------------------- |
| `app/(home)`              | Landing page (hero, bento, theming showcase, stats, CTA, footer).         |
| `app/docs`                | Documentation, authored as MDX under `content/docs/` and loaded by Fumadocs. |
| `app/api/search/route.ts` | Fumadocs search index route handler.                                      |
| `app/og`                  | Dynamic Open Graph image route.                                           |
| `app/llms.txt`, `llms-full.txt`, `llms.mdx` | Machine-readable docs exports for LLM ingestion.        |

### Landing page components

Each section of the home page is its own component under `app/(home)/_components/`:

- `hero.tsx` — main headline with animated floating emojis and install CTA.
- `bento.tsx` — six-card feature grid with animated previews.
- `theming-showcase.tsx` — side-by-side picker panels driven by per-slot CSS variables.
- `stats.tsx` — real data about the core package (locales, emoji count, bundle size).
- `cta.tsx` — final call-to-action block.
- `footer.tsx` — packages, resources, author pill.

### Docs content

MDX pages live under `content/docs/` and are organised into groups via `meta.json` files (Getting started, Components, Guides, Recipes, Reference, Project). Interactive component previews are wired up through `components/doc-previews.tsx` and registered in `components/mdx.tsx`.

## Fumadocs MDX

`source.config.ts` configures the MDX source — customise frontmatter schema and plugins there. See [Fumadocs MDX docs](https://fumadocs.dev/docs/mdx).

## Local package consumption

The site consumes `@emoteer/react` and `@emoteer/theme` directly from the workspace via `workspace:*` dependencies. When you change a package, re-run `pnpm --filter @emoteer/react build` (or just `pnpm build` at the root) so the compiled output picks up.

## Learn more

- [Next.js Documentation](https://nextjs.org/docs)
- [Fumadocs](https://fumadocs.dev)
