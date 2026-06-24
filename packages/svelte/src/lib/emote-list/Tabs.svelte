<script lang="ts">
  import { isLocalEmote, type EmojiGroupNumber } from '@emoteer/core';
  import { ScrollArea } from '../internal/scroll-area/index.js';
  import { ALL_GROUPS, GROUP_ICONS } from './helpers.js';
  import { useEmoteListContext } from './store.svelte.js';
  import type { EmoteListTabsProps } from './types.js';

  let { groups, display = 'emoji', class: className }: EmoteListTabsProps = $props();

  const store = useEmoteListContext();

  const hasLocals = $derived(store.filteredEmotes.some(isLocalEmote));

  const entries = $derived.by(() => {
    let list = Object.entries(ALL_GROUPS) as [string, string][];

    if (groups) {
      list = list.filter(([num]) =>
        groups.includes(Number(num) as EmojiGroupNumber),
      );
    }

    // Only show "Custom" (-2) when there are local emotes present.
    if (!hasLocals) {
      list = list.filter(([num]) => num !== '-2');
    }

    // Only show "Most Used" (-1) if there are favourites.
    if (store.favorites.length === 0) {
      list = list.filter(([num]) => num !== '-1');
    }

    // Sort so "Custom" (-2) sits above "Most Used" (-1) and both above the rest.
    return [...list].sort((a, b) => Number(a[0]) - Number(b[0]));
  });

  function toggleGroup(groupNum: EmojiGroupNumber, isActive: boolean): void {
    store.activeGroup = isActive ? 'all' : groupNum;
  }
</script>

<div data-scope="emote-list" data-part="tabs" class={className}>
  <ScrollArea.Root>
    <ScrollArea.Viewport role="group" aria-label="Emoji categories">
      <div data-scope="emote-list" data-part="tab-list">
        {#each entries as [num, label] (num)}
          {@const groupNum = Number(num) as EmojiGroupNumber}
          {@const isActive = store.activeGroup === groupNum}
          <button
            type="button"
            aria-label={label}
            aria-pressed={isActive}
            title={label}
            data-scope="emote-list"
            data-part="tab"
            data-display={display}
            data-active={isActive || undefined}
            onclick={() => toggleGroup(groupNum, isActive)}
          >
            {display === 'emoji' ? (GROUP_ICONS[groupNum] ?? label) : label}
          </button>
        {/each}
      </div>
    </ScrollArea.Viewport>
    <ScrollArea.Scrollbar orientation="horizontal" />
  </ScrollArea.Root>
</div>
