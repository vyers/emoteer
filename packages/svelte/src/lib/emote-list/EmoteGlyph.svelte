<script lang="ts">
  import { isLocalEmote, type Emote } from '@emoteer/core';

  interface Props {
    emote: Emote;
    class?: string;
  }

  let { emote, class: className }: Props = $props();
</script>

{#if isLocalEmote(emote)}
  <img
    src={emote.src}
    alt={emote.name}
    data-scope="emote-list"
    data-part="glyph"
    class={className}
    draggable="false"
  />
{:else}
  <span class={className}>{emote.unicode}</span>
{/if}
