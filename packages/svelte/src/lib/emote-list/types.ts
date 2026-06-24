import type { Emote, EmojiGroupNumber } from '@emoteer/core';
import type { Snippet } from 'svelte';

export interface EmoteListRootProps {
  onSelect?: (emote: Emote) => void;
  class?: string;
  children: Snippet;
}

export interface EmoteListSearchProps {
  placeholder?: string;
  class?: string;
}

export interface EmoteListTabsProps {
  /**
   * Group numbers to display as tabs. Defaults to all groups. Pass a subset to
   * hide specific categories.
   * Group numbers: -2=Custom (local emotes), -1=Most Used, 0=Smileys, 1=People,
   *   3=Animals, 4=Food, 5=Travel, 6=Activities, 7=Objects, 8=Symbols, 9=Flags
   */
  groups?: EmojiGroupNumber[];
  /** Whether to show emoji icons or text labels in the tabs. Defaults to 'emoji'. */
  display?: 'emoji' | 'label';
  class?: string;
}

export interface EmoteListGridProps {
  height?: number;
  class?: string;
}

export interface EmoteListPreviewProps {
  class?: string;
}

export interface EmoteListPickerProps {
  onSelect?: (emote: Emote) => void;
  class?: string;
}
