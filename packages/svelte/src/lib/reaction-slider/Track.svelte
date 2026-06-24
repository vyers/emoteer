<script lang="ts">
  import { useReactionSliderContext } from './context.svelte.js';
  import type { ReactionSliderTrackProps } from './types.js';

  let { class: className, children }: ReactionSliderTrackProps = $props();

  const ctx = useReactionSliderContext();
</script>

<div {...ctx.api.getTrackProps()} class={className}>
  {@render children?.()}
</div>
