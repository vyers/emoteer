<script lang="ts">
  import BurstParticles from '../internal/BurstParticles.svelte';
  import { createBurst } from '../internal/burst.svelte.js';
  import { useReactionSliderContext } from './context.svelte.js';
  import type { ReactionSliderThumbProps } from './types.js';

  let { class: className, children }: ReactionSliderThumbProps = $props();

  const ctx = useReactionSliderContext();
  const particleBurst = createBurst();

  const value = $derived(ctx.api.value[0] ?? 0);
  const percentage = $derived(
    ctx.max > ctx.min ? ((value - ctx.min) / (ctx.max - ctx.min)) * 100 : 0,
  );
  const scale = $derived(ctx.scaleEffect ? 1 + (percentage / 100) * 1.2 : 1);

  const thumbProps = $derived(ctx.api.getThumbProps({ index: 0 }));

  // Fire the burst when the user releases the thumb.
  let wasDragging = false;
  $effect(() => {
    const dragging = ctx.api.dragging;
    if (wasDragging && !dragging && ctx.burst) {
      particleBurst.trigger();
    }
    wasDragging = dragging;
  });
</script>

<div
  {...thumbProps}
  class={className}
  style="{thumbProps.style ??
    ''};width:48px;height:48px;top:50%;transform:translate(-50%,-50%) scale({scale});transition:transform 75ms ease-out;transform-origin:center;"
>
  <BurstParticles particles={particleBurst.particles} emoji={ctx.emoji ?? ''} />
  <span data-scope="reaction-slider" data-part="thumb-glyph">{ctx.emoji}</span>
  {@render children?.()}
</div>
