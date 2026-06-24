<script lang="ts">
  import { useScrollAreaContext } from './context.svelte.js';
  import Thumb from './Thumb.svelte';
  import type { ScrollAreaScrollbarProps } from './types.js';

  let {
    orientation = 'vertical',
    class: className,
    children,
  }: ScrollAreaScrollbarProps = $props();

  const getApi = useScrollAreaContext();
  const api = $derived(getApi());
  const visible = $derived(
    orientation === 'vertical' ? api.hasOverflowY : api.hasOverflowX,
  );
</script>

{#if visible}
  <div {...api.getScrollbarProps({ orientation })} class={className}>
    {#if children}
      {@render children()}
    {:else}
      <Thumb {orientation} />
    {/if}
  </div>
{/if}
