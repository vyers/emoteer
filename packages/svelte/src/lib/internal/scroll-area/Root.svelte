<script lang="ts">
  import * as scrollArea from '@zag-js/scroll-area';
  import { normalizeProps, useMachine } from '@zag-js/svelte';
  import { setScrollAreaContext } from './context.svelte.js';
  import type { ScrollAreaRootProps } from './types.js';

  let { children, class: className, style, ...rest }: ScrollAreaRootProps = $props();

  const id = $props.id();
  const service = useMachine(scrollArea.machine, () => ({ id }));
  const api = $derived(scrollArea.connect(service, normalizeProps));
  const rootProps = $derived(api.getRootProps());

  setScrollAreaContext(() => api);

  // Merge Zag's root style (a string) with a caller-provided `style` — e.g. the
  // grid passes `height:100%` so the viewport can clip and scroll. Mirrors the
  // React package's `{ ...rootProps.style, ...style }`.
  function mergeStyle(base: unknown, extra: string | null | undefined): string | undefined {
    const a = typeof base === 'string' ? base : '';
    const b = extra ?? '';
    if (a && b) return `${a};${b}`;
    return a || b || undefined;
  }
</script>

<div {...rootProps} {...rest} class={className} style={mergeStyle(rootProps.style, style)}>
  {@render children?.()}
</div>
