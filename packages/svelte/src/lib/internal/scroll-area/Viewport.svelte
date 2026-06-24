<script lang="ts">
  import { useScrollAreaContext } from './context.svelte.js';
  import type { ScrollAreaViewportProps } from './types.js';

  let {
    children,
    class: className,
    element = $bindable(null),
    onscroll,
    ...rest
  }: ScrollAreaViewportProps = $props();

  const getApi = useScrollAreaContext();
  const api = $derived(getApi());
  const viewportProps = $derived(api.getViewportProps());
  const contentProps = $derived(api.getContentProps());
</script>

<div
  {...viewportProps}
  {...rest}
  bind:this={element}
  class={className ? `emoteer-scroll-viewport ${className}` : 'emoteer-scroll-viewport'}
  onscroll={(event) => {
    // Forward to Zag (it positions the scrollbar thumbs) and then the consumer.
    (viewportProps as { onscroll?: (e: Event) => void }).onscroll?.(event);
    onscroll?.(event);
  }}
>
  <div {...contentProps}>
    {@render children?.()}
  </div>
</div>
