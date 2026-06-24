<script lang="ts">
  import { useEmoteListContext } from './store.svelte.js';
  import type { EmoteListSearchProps } from './types.js';

  let { placeholder = 'Search emojis…', class: className }: EmoteListSearchProps =
    $props();

  const store = useEmoteListContext();
</script>

<div data-scope="emote-list" data-part="search">
  <input
    type="search"
    bind:value={store.query}
    {placeholder}
    aria-label="Search emojis"
    data-scope="emote-list"
    data-part="search-input"
    class={className}
  />
</div>
