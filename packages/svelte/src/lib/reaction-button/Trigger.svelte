<script lang="ts">
  import Icon from '../internal/Icon.svelte';
  import { useReactionButtonPopoverContext } from './popover-context.svelte.js';
  import type { ReactionButtonTriggerProps } from './types.js';

  let { children }: ReactionButtonTriggerProps = $props();

  const ctx = useReactionButtonPopoverContext();
</script>

<button {...ctx.api.getTriggerProps()} data-emoteer-trigger="">
  {#if children}
    {@render children()}
  {:else}
    <Icon name="plus" size={18} />
  {/if}
</button>
