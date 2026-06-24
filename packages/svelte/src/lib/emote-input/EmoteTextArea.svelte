<script lang="ts">
  import { textToEmoji } from '@emoteer/core';
  import { tick } from 'svelte';
  import { useEmoteContext } from '../provider/context.svelte.js';
  import type { EmoteTextAreaProps } from './types.js';

  let {
    value = $bindable(''),
    class: className,
    element = $bindable(null),
    oninput,
    ...rest
  }: EmoteTextAreaProps = $props();

  const ctx = useEmoteContext();

  async function handleInput(
    event: Event & { currentTarget: EventTarget & HTMLTextAreaElement },
  ): Promise<void> {
    const target = event.currentTarget;
    const original = target.value;
    const converted = textToEmoji(original, ctx.shortcodeIndex);

    if (converted !== original) {
      const cursor = target.selectionStart ?? original.length;
      const newCursor = Math.max(0, cursor + (converted.length - original.length));
      value = converted;
      await tick();
      target.setSelectionRange(newCursor, newCursor);
    } else {
      value = original;
    }

    oninput?.(event);
  }
</script>

<textarea
  bind:this={element}
  data-scope="emote-textarea"
  data-part="textarea"
  cols="40"
  rows="5"
  {value}
  {...rest}
  oninput={handleInput}
  class={className}
></textarea>
