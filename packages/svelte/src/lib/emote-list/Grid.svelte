<script lang="ts">
  import type { Emote, EmojiGroupNumber } from '@emoteer/core';
  import { createVirtualizer, defaultRangeExtractor } from '@tanstack/svelte-virtual';
  import { untrack } from 'svelte';
  import { get } from 'svelte/store';
  import { ScrollArea } from '../internal/scroll-area/index.js';
  import EmoteGlyph from './EmoteGlyph.svelte';
  import {
    ALL_GROUPS,
    COLUMNS,
    HEADER_HEIGHT,
    ROW_HEIGHT,
    emoteGroup,
    emoteKey,
    emoteLabel,
    type GridItem,
  } from './helpers.js';
  import { useEmoteListContext } from './store.svelte.js';
  import type { EmoteListGridProps } from './types.js';

  let { height = 280, class: className }: EmoteListGridProps = $props();

  const store = useEmoteListContext();
  const OVERSCAN = 5;

  let viewportEl = $state<HTMLDivElement | null>(null);
  let activeStickyIndex = $state(-1);
  // Plain mirror of activeStickyIndex read by the (non-reactive) rangeExtractor,
  // matching the React `activeStickyIndexRef`.
  let activeStickyRef = -1;
  // Distinguishes programmatic scrolls from user scrolls.
  let programmatic = false;

  // ─── Flat item list: section headers + emote rows, favourites pinned on top ──
  const items = $derived.by<GridItem[]>(() => {
    const result: GridItem[] = [];
    const groupedMap = new Map<number, Emote[]>();
    const filtered = store.filteredEmotes;
    const favorites = store.favorites;

    if (favorites.length > 0) {
      const favSet = new Set(favorites);
      const favEmotes = filtered.filter((e) => favSet.has(emoteKey(e)));
      if (favEmotes.length > 0) groupedMap.set(-1, favEmotes);
    }

    for (const e of filtered) {
      const g = emoteGroup(e);
      if (!groupedMap.has(g)) groupedMap.set(g, []);
      groupedMap.get(g)!.push(e);
    }

    // Custom (-2), Most Used (-1), then 0..9.
    const sortedGroups = Array.from(groupedMap.keys()).sort((a, b) => a - b);

    for (const group of sortedGroups) {
      const groupEmotes = groupedMap.get(group)!;
      result.push({
        kind: 'header',
        group: group as EmojiGroupNumber,
        label: ALL_GROUPS[group as EmojiGroupNumber] ?? '',
      });
      for (let i = 0; i < groupEmotes.length; i += COLUMNS) {
        result.push({ kind: 'row', emotes: groupEmotes.slice(i, i + COLUMNS) });
      }
    }
    return result;
  });

  // Precompute each header item index + its absolute scroll offset, used to pick
  // the active sticky header on scroll (mirrors React's manual computation).
  const headerIndices = $derived.by(() => {
    const result: Array<{ index: number; start: number }> = [];
    let offset = 0;
    for (let i = 0; i < items.length; i++) {
      const it = items[i]!;
      if (it.kind === 'header') result.push({ index: i, start: offset });
      offset += it.kind === 'header' ? HEADER_HEIGHT : ROW_HEIGHT;
    }
    return result;
  });

  const virtualizer = createVirtualizer<HTMLDivElement, HTMLDivElement>({
    // Initial count only; kept in sync by the $effect below via setOptions.
    count: untrack(() => items.length),
    getScrollElement: () => viewportEl,
    estimateSize: (i) => (items[i]?.kind === 'header' ? HEADER_HEIGHT : ROW_HEIGHT),
    overscan: OVERSCAN,
    // Always keep the active sticky header in the DOM even when scrolled past it.
    rangeExtractor: (range) => {
      const base = defaultRangeExtractor(range);
      const sticky = activeStickyRef;
      if (sticky >= 0 && !base.includes(sticky)) {
        return [sticky, ...base].sort((a, b) => a - b);
      }
      return base;
    },
  });

  // Re-apply `count` and force a recompute when the item list or the sticky
  // header changes (the first run, after mount, is also what attaches the
  // virtualizer to the now-bound scroll element). `get()` reads the store
  // without subscribing, so calling setOptions here can't loop.
  $effect(() => {
    void items.length;
    void activeStickyIndex;
    get(virtualizer).setOptions({ count: items.length });
  });

  function handleScroll(): void {
    if (!viewportEl) return;
    const top = viewportEl.scrollTop + 1; // +1px buffer
    let next = -1;
    for (const { index, start } of headerIndices) {
      if (start <= top) next = index;
    }

    if (next !== activeStickyIndex) {
      activeStickyRef = next;
      activeStickyIndex = next;

      // Sync activeGroup back to context when scrolling manually.
      if (next >= 0) {
        const item = items[next];
        if (item?.kind === 'header' && item.group !== store.activeGroup) {
          programmatic = true;
          store.activeGroup = item.group;
        }
      } else if (store.activeGroup !== 'all') {
        programmatic = true;
        store.activeGroup = 'all';
      }
    }
  }

  // Scroll to the active group's header when activeGroup changes.
  $effect(() => {
    const group = store.activeGroup;
    const list = items;
    if (!viewportEl) return;
    const api = get(virtualizer);

    if (group === 'all') {
      const q = untrack(() => store.query).trim();
      if (!q && !programmatic) {
        api.scrollToIndex(0, { align: 'start' });
      }
      return;
    }

    if (programmatic) {
      programmatic = false;
      return;
    }

    const index = list.findIndex(
      (item) => item.kind === 'header' && item.group === group,
    );
    if (index !== -1) {
      api.scrollToIndex(index, { align: 'start' });
    }
  });
</script>

{#if store.isLoading}
  <div
    data-scope="emote-list"
    data-part="grid-status"
    data-loading=""
    class={className}
    style="height:{height}px"
  >
    Loading emojis…
  </div>
{:else if items.length === 0}
  <div
    data-scope="emote-list"
    data-part="grid-status"
    data-empty=""
    class={className}
    style="height:{height}px"
  >
    No emojis found
  </div>
{:else}
  <div
    data-scope="emote-list"
    data-part="grid"
    class={className}
    style="height:{height}px"
  >
    <ScrollArea.Root style="height:100%">
      <ScrollArea.Viewport
        role="grid"
        aria-label="Emoji grid"
        bind:element={viewportEl}
        onscroll={handleScroll}
      >
        <div style="height:{$virtualizer.getTotalSize()}px;position:relative;">
          {#each $virtualizer.getVirtualItems() as vItem (vItem.key)}
            {@const item = items[vItem.index]}
            {#if item}
              {#if item.kind === 'header'}
                {#if vItem.index === activeStickyIndex}
                  <div
                    role="row"
                    style="position:sticky;top:0;z-index:10;width:100%;height:{HEADER_HEIGHT}px;display:flex;align-items:center;padding-left:4px;background:var(--em-bg);"
                  >
                    <span role="rowheader" data-scope="emote-list" data-part="header">
                      {item.label}
                    </span>
                  </div>
                {:else}
                  <div
                    role="row"
                    style="position:absolute;top:0;left:0;width:100%;height:{HEADER_HEIGHT}px;transform:translateY({vItem.start}px);display:flex;align-items:center;padding-left:4px;"
                  >
                    <span role="rowheader" data-scope="emote-list" data-part="header">
                      {item.label}
                    </span>
                  </div>
                {/if}
              {:else}
                <div
                  role="row"
                  style="position:absolute;top:0;left:0;width:100%;height:{ROW_HEIGHT}px;transform:translateY({vItem.start}px);display:flex;align-items:center;"
                >
                  {#each item.emotes as emote (emoteKey(emote))}
                    {@const label = emoteLabel(emote)}
                    <button
                      role="gridcell"
                      type="button"
                      title={label}
                      aria-label={label}
                      data-scope="emote-list"
                      data-part="cell"
                      onmouseenter={() => (store.hoveredEmote = emote)}
                      onfocus={() => (store.hoveredEmote = emote)}
                      onclick={() => store.select(emote)}
                      style="flex:0 0 {100 / COLUMNS}%;height:{ROW_HEIGHT}px;"
                    >
                      <EmoteGlyph {emote} />
                    </button>
                  {/each}
                </div>
              {/if}
            {/if}
          {/each}
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="vertical" />
    </ScrollArea.Root>
  </div>
{/if}
