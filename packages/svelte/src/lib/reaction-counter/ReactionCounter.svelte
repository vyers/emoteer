<script lang="ts">
  import type { Reaction, ReactionCounterProps } from './types.js';

  let { reactions, onToggle, class: className }: ReactionCounterProps = $props();

  function handleClick(event: MouseEvent, reaction: Reaction): void {
    event.preventDefault();
    onToggle?.(reaction.emoji, !reaction.active);
  }
</script>

<div
  role="group"
  aria-label="Reactions"
  data-scope="reaction-counter"
  data-part="root"
  class={className}
>
  {#each reactions as reaction (reaction.emoji)}
    <button
      type="button"
      aria-label={`${reaction.emoji} ${reaction.count} reaction${reaction.count !== 1 ? 's' : ''}${reaction.active ? ', you reacted' : ''}`}
      aria-pressed={reaction.active}
      data-scope="reaction-counter"
      data-part="chip"
      data-active={reaction.active || undefined}
      onclick={(event) => handleClick(event, reaction)}
    >
      <span aria-hidden="true">{reaction.emoji}</span>
      <span>{reaction.count}</span>
    </button>
  {/each}
</div>
