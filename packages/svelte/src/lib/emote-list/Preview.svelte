<script lang="ts">
  import Icon from '../internal/Icon.svelte';
  import EmoteGlyph from './EmoteGlyph.svelte';
  import {
    emoteCopyText,
    emoteKey,
    emoteLabel,
    emoteShortcode,
  } from './helpers.js';
  import { useEmoteListContext } from './store.svelte.js';
  import type { EmoteListPreviewProps } from './types.js';

  let { class: className }: EmoteListPreviewProps = $props();

  const store = useEmoteListContext();

  let copied = $state(false);

  const isFavorited = $derived(
    store.hoveredEmote ? store.favorites.includes(emoteKey(store.hoveredEmote)) : false,
  );

  const shortcode = $derived.by(() => {
    const text = store.hoveredEmote ? emoteShortcode(store.hoveredEmote) : '';
    return text ? `:${text}:` : '';
  });

  async function handleCopy(): Promise<void> {
    if (!store.hoveredEmote) return;
    await navigator.clipboard.writeText(emoteCopyText(store.hoveredEmote));
    copied = true;
    setTimeout(() => (copied = false), 1200);
  }
</script>

<div data-scope="emote-list" data-part="preview" class={className}>
  <span data-scope="emote-list" data-part="preview-glyph" aria-hidden="true">
    {#if store.hoveredEmote}
      <EmoteGlyph emote={store.hoveredEmote} />
    {/if}
  </span>
  <div data-scope="emote-list" data-part="preview-info">
    <span data-scope="emote-list" data-part="preview-label">
      {store.hoveredEmote ? emoteLabel(store.hoveredEmote) : 'Hover an emoji'}
    </span>
    {#if shortcode}
      <small data-scope="emote-list" data-part="preview-shortcode">
        {shortcode}
      </small>
    {/if}
  </div>
  <div data-scope="emote-list" data-part="preview-actions">
    <button
      type="button"
      aria-label="Copy emoji"
      title="Copy"
      data-scope="emote-list"
      data-part="action-copy"
      data-disabled={!store.hoveredEmote || undefined}
      onclick={handleCopy}
    >
      <Icon name={copied ? 'check' : 'copy'} size={18} />
    </button>
    <button
      type="button"
      aria-label={isFavorited ? 'Remove from favourites' : 'Add to favourites'}
      title="Favourite"
      data-scope="emote-list"
      data-part="action-favorite"
      data-disabled={!store.hoveredEmote || undefined}
      data-favorited={isFavorited || undefined}
      onclick={() => store.hoveredEmote && store.toggleFavorite(store.hoveredEmote)}
    >
      <Icon name="star" size={20} fill={isFavorited ? 'currentColor' : 'none'} />
    </button>
  </div>
</div>
