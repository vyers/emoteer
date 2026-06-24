<script lang="ts">
  import { isLocalEmote } from '@emoteer/core';
  import { emoteKey, emoteLabel } from './helpers.js';
  import { useAutocompleteContext } from './store.svelte.js';
  import type { EmoteAutocompleteListProps } from './types.js';

  let { class: className }: EmoteAutocompleteListProps = $props();

  const store = useAutocompleteContext();
</script>

<div
  id={store.listboxId}
  role="listbox"
  aria-label="Emoji suggestions"
  data-scope="emote-autocomplete"
  data-part="list"
  class={className}
>
  {#each store.suggestions as emote, index (emoteKey(emote))}
    {@const label = emoteLabel(emote)}
    <button
      id={store.getOptionId(emoteKey(emote))}
      role="option"
      type="button"
      aria-selected={index === store.activeIndex}
      data-scope="emote-autocomplete"
      data-part="option"
      title={label}
      onmousedown={(event) => event.preventDefault()}
      onclick={() => store.selectSuggestion(emote)}
    >
      {#if isLocalEmote(emote)}
        <img
          src={emote.src}
          alt={emote.name}
          data-scope="emote-autocomplete"
          data-part="glyph"
          draggable="false"
        />
      {:else}
        {emote.unicode}
      {/if}
    </button>
  {/each}
</div>
