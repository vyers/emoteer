<script lang="ts">
  import { textToEmoji } from '@emoteer/core';
  import { tick } from 'svelte';
  import { useEmoteContext } from '../provider/context.svelte.js';
  import type { EmoteInputProps } from './types.js';

  let {
    value = $bindable(''),
    class: className,
    element = $bindable(null),
    oninput,
    ...rest
  }: EmoteInputProps = $props();

  const ctx = useEmoteContext();

  async function handleInput(
    event: Event & { currentTarget: EventTarget & HTMLInputElement },
  ): Promise<void> {
    const target = event.currentTarget;
    const original = target.value;
    const converted = textToEmoji(original, ctx.shortcodeIndex);

    if (converted !== original) {
      const cursor = target.selectionStart ?? original.length;
      const newCursor = Math.max(0, cursor + (converted.length - original.length));
      value = converted;
      // Let Svelte reconcile the new value, then restore the caret position.
      await tick();
      target.setSelectionRange(newCursor, newCursor);
    } else {
      value = original;
    }

    oninput?.(event);
  }
</script>

<input
  bind:this={element}
  type="text"
  data-scope="emote-input"
  data-part="input"
  {value}
  {...rest}
  oninput={handleInput}
  class={className}
/>
