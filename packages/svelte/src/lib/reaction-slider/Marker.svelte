<script lang="ts">
  import { useReactionSliderContext } from './context.svelte.js';
  import type { ReactionSliderMarkerProps } from './types.js';

  let { class: className, children }: ReactionSliderMarkerProps = $props();

  const ctx = useReactionSliderContext();

  const value = $derived(ctx.api.value[0] ?? 0);
  const percentage = $derived(
    ctx.max > ctx.min ? ((value - ctx.min) / (ctx.max - ctx.min)) * 100 : 0,
  );
  const scale = $derived(ctx.scaleEffect ? 1 + (percentage / 100) * 1.2 : 1);
  const reverseScale = $derived(1 / scale);
</script>

{#if ctx.api.dragging}
  <div
    data-scope="reaction-slider"
    data-part="marker-positioner"
    style="transform:translateX(-50%) scale({reverseScale});transform-origin:bottom center;"
  >
    <div data-scope="reaction-slider" data-part="marker" class={className}>
      {#if children}
        {@render children(value)}
      {:else}
        {value}
      {/if}
    </div>
  </div>
{/if}
