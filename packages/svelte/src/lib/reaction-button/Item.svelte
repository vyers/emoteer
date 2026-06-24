<script lang="ts">
  import BurstParticles from '../internal/BurstParticles.svelte';
  import { createBurst } from '../internal/burst.svelte.js';
  import { useReactionButtonContext } from './context.svelte.js';
  import type { ReactionButtonItemProps } from './types.js';

  let {
    emoji,
    label,
    class: className,
    burst = false,
    onclick,
    ...rest
  }: ReactionButtonItemProps = $props();

  const ctx = useReactionButtonContext();
  const particleBurst = createBurst({ spread: 80 });

  function handleClick(
    event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement },
  ): void {
    onclick?.(event);
    ctx.onSelect?.(emoji);
    if (burst) particleBurst.trigger();
  }
</script>

<button
  type="button"
  aria-label={label ?? emoji}
  data-scope="reaction-button"
  data-part="item"
  {...rest}
  onclick={handleClick}
  class={className}
>
  <BurstParticles particles={particleBurst.particles} {emoji} />
  <span data-scope="reaction-button" data-part="item-glyph">{emoji}</span>
</button>
