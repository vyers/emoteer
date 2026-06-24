<script lang="ts">
  import { portal } from '../internal/portal.js';
  import { useReactionButtonPopoverContext } from './popover-context.svelte.js';
  import type { ReactionButtonContentProps } from './types.js';

  let { children, class: className }: ReactionButtonContentProps = $props();

  const ctx = useReactionButtonPopoverContext();
</script>

{#if ctx.api.open}
  <div use:portal {...ctx.api.getPositionerProps()} data-emoteer-positioner="">
    <div {...ctx.api.getContentProps()} class={className}>
      {@render children()}
    </div>
  </div>
{/if}
