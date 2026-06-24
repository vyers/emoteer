<script lang="ts">
  import { loadEmojis } from '@emoteer/core';
  import { untrack } from 'svelte';
  import { EmoteContext, setEmoteContext } from './context.svelte.js';
  import type { EmoteProviderProps } from './types.js';

  // `cloud` is reserved for the forthcoming Emoteer Cloud tier.
  let {
    natives = true,
    locals = [],
    cloud: _cloud,
    locale = 'en',
    children,
  }: EmoteProviderProps = $props();

  const ctx = setEmoteContext(new EmoteContext());

  // Match React's `useState(natives)` initial loading flag so the first paint
  // (server + client) shows a loading state instead of an empty one.
  ctx.isLoading = untrack(() => natives);

  // Keep developer-defined locals in sync with the prop.
  $effect(() => {
    ctx.locals = locals;
  });

  // Load native emojis lazily, re-loading when `natives` or `locale` changes.
  // Runs on the client only (effects don't run during SSR), so the server never
  // touches the dynamic emoji imports — matching React's `useEffect` behaviour.
  $effect(() => {
    if (!natives) {
      ctx.emojis = [];
      ctx.isLoading = false;
      return;
    }

    let cancelled = false;
    ctx.isLoading = true;
    ctx.error = null;

    loadEmojis(locale)
      .then((data) => {
        if (!cancelled) {
          ctx.emojis = data;
          ctx.isLoading = false;
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          ctx.error = err instanceof Error ? err : new Error(String(err));
          ctx.isLoading = false;
        }
      });

    return () => {
      cancelled = true;
    };
  });
</script>

{@render children()}
