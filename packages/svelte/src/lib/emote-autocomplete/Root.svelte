<script lang="ts">
  import { EmoteAutocompleteStore, setAutocompleteContext } from './store.svelte.js';
  import type { EmoteAutocompleteRootProps } from './types.js';

  let { onSelect, children }: EmoteAutocompleteRootProps = $props();

  const baseId = $props.id();
  const store = setAutocompleteContext(new EmoteAutocompleteStore(baseId));

  // Keep the select handler current as the prop changes (also sets the initial).
  $effect(() => {
    store.onSelect = onSelect;
  });
</script>

{@render children()}
