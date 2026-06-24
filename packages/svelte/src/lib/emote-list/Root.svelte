<script lang="ts">
  import { EmoteListStore, setEmoteListContext } from './store.svelte.js';
  import type { EmoteListRootProps } from './types.js';

  let { onSelect, class: className, children }: EmoteListRootProps = $props();

  const store = setEmoteListContext(new EmoteListStore());

  // Keep the select handler current as the prop changes (also sets the initial).
  $effect(() => {
    store.onSelect = onSelect;
  });

  // Favourites: hydrate once on mount, then persist on every change. Both run
  // client-only (effects don't run during SSR), so localStorage is never read
  // on the server.
  $effect(() => {
    store.hydrate();
  });
  $effect(() => {
    store.persist();
  });
</script>

<div data-scope="emote-list" data-part="root" class={className}>
  {@render children()}
</div>
