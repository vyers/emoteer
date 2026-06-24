<script lang="ts">
  import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
  import { portal } from '../internal/portal.js';
  import { useAutocompleteContext } from './store.svelte.js';
  import type { EmoteAutocompleteContentProps } from './types.js';

  let { children, class: className }: EmoteAutocompleteContentProps = $props();

  const store = useAutocompleteContext();

  let floatingEl = $state<HTMLElement | null>(null);

  const open = $derived(store.isOpen && store.suggestions.length > 0);

  // Position the floating list under Floating UI, keeping it anchored to the
  // input while open (autoUpdate handles scroll/resize/layout shifts).
  $effect(() => {
    const reference = store.referenceEl;
    const floating = floatingEl;
    if (!open || !reference || !floating) return;

    const update = () => {
      void computePosition(reference, floating, {
        placement: 'top-start',
        middleware: [offset(4), flip(), shift({ padding: 8 })],
      }).then(({ x, y }) => {
        floating.style.left = `${x}px`;
        floating.style.top = `${y}px`;
      });
    };

    return autoUpdate(reference, floating, update);
  });
</script>

{#if open}
  <div
    bind:this={floatingEl}
    use:portal
    data-scope="emote-autocomplete"
    data-part="content"
    class={className}
    style="position:absolute;top:0;left:0;"
  >
    {@render children()}
  </div>
{/if}
