<script lang="ts">
  import { useReactionSliderContext } from './context.svelte.js';
  import type { ReactionSliderRangeProps } from './types.js';

  let { class: className }: ReactionSliderRangeProps = $props();

  const ctx = useReactionSliderContext();
</script>

<div {...ctx.api.getRangeProps()} class={className}></div>
