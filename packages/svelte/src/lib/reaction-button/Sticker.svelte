<script lang="ts">
  import BurstParticles from '../internal/BurstParticles.svelte';
  import { createBurst } from '../internal/burst.svelte.js';
  import { useReactionButtonContext } from './context.svelte.js';
  import type { ReactionButtonStickerProps } from './types.js';

  let {
    emoji = '❤️',
    onClick,
    class: className,
    children,
    burst = true,
  }: ReactionButtonStickerProps = $props();

  const ctx = useReactionButtonContext();
  const particleBurst = createBurst();

  function handleClick(): void {
    onClick?.();
    ctx.onSelect?.(emoji);
    if (burst) particleBurst.trigger();
  }
</script>

<div data-scope="reaction-button" data-part="sticker-root" class={className}>
  <BurstParticles particles={particleBurst.particles} {emoji} />

  <button
    type="button"
    aria-label={`React with ${emoji}`}
    data-scope="reaction-button"
    data-part="sticker"
    onclick={handleClick}
  >
    {#if children}
      {@render children()}
    {:else}
      {emoji}
    {/if}
  </button>
</div>
