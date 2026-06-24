<script lang="ts">
  import { emoteKey } from './helpers.js';
  import { useAutocompleteContext } from './store.svelte.js';
  import type { EmoteAutocompleteInputProps } from './types.js';

  let {
    class: className,
    oninput,
    onkeydown,
    ...rest
  }: EmoteAutocompleteInputProps = $props();

  const store = useAutocompleteContext();

  let el = $state<HTMLInputElement | null>(null);

  // Register this input as the floating reference for the suggestion list.
  $effect(() => {
    store.referenceEl = el;
  });

  const expanded = $derived(store.isOpen && store.suggestions.length > 0);
  const activeDescendant = $derived.by(() => {
    if (!expanded) return undefined;
    const active = store.suggestions[store.activeIndex];
    return active ? store.getOptionId(emoteKey(active)) : undefined;
  });
</script>

<input
  bind:this={el}
  type="text"
  role="combobox"
  aria-autocomplete="list"
  aria-expanded={expanded}
  aria-controls={store.listboxId}
  aria-activedescendant={activeDescendant}
  data-scope="emote-autocomplete"
  data-part="input"
  {...rest}
  oninput={(event) => {
    store.handleInput(event.currentTarget.value);
    oninput?.(event);
  }}
  onkeydown={(event) => {
    store.handleKeyDown(event);
    onkeydown?.(event);
  }}
  class={className}
/>
