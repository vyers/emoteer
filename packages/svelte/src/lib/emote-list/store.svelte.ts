import type { Emote, EmojiGroupNumber } from '@emoteer/core';
import { getContext, setContext } from 'svelte';
import { EmoteContext, useEmoteContext } from '../provider/context.svelte.js';
import {
  FAVORITES_STORAGE_KEY,
  emoteKey,
  matchesQuery,
  migrateFavoriteKey,
} from './helpers.js';

const EMOTE_LIST_KEY = Symbol('emoteer.emote-list');

/**
 * Reactive state for an `<EmoteList.Root>` subtree: query, active category,
 * hovered emote, favourites, and the derived filtered list. Mirrors the React
 * `EmoteListContextValue`.
 */
export class EmoteListStore {
  query = $state('');
  activeGroup = $state<EmojiGroupNumber | 'all'>('all');
  hoveredEmote = $state<Emote | null>(null);
  favorites = $state<string[]>([]);

  /** Updated each render from the Root's `onSelect` prop. */
  onSelect?: (emote: Emote) => void;

  #hydrated = false;
  // Field initializer (not the constructor body) so it is assigned before the
  // `$derived` fields below. Runs during <EmoteList.Root> init, so getContext
  // is valid here.
  #emoteCtx: EmoteContext = useEmoteContext();

  constructor(onSelect?: (emote: Emote) => void) {
    this.onSelect = onSelect;
  }

  get isLoading(): boolean {
    return this.#emoteCtx.isLoading;
  }

  filteredEmotes: Emote[] = $derived.by(() => {
    const q = this.query.trim();
    const emotes = this.#emoteCtx.emotes;
    if (!q) return emotes;
    return emotes.filter((e) => matchesQuery(e, q));
  });

  select(emote: Emote): void {
    this.onSelect?.(emote);
  }

  toggleFavorite(emote: Emote): void {
    const key = emoteKey(emote);
    this.favorites = this.favorites.includes(key)
      ? this.favorites.filter((k) => k !== key)
      : [...this.favorites, key];
  }

  /** Load favourites once on mount, migrating the legacy hex-only format. */
  hydrate(): void {
    if (this.#hydrated) return;
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as unknown;
        if (Array.isArray(parsed)) {
          this.favorites = parsed
            .filter((k): k is string => typeof k === 'string')
            .map(migrateFavoriteKey);
        }
      }
    } catch (e) {
      console.error('Failed to read favorites from localStorage', e);
    }
    this.#hydrated = true;
  }

  /** Persist favourites after hydration. Reads `favorites` so an `$effect` that
   *  calls this re-runs whenever they change. */
  persist(): void {
    // Track the reactive dependency even when we early-return before hydration.
    const snapshot = this.favorites;
    if (!this.#hydrated) return;
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(snapshot));
    } catch (e) {
      console.error('Failed to persist favorites to localStorage', e);
    }
  }
}

export function setEmoteListContext(store: EmoteListStore): EmoteListStore {
  return setContext(EMOTE_LIST_KEY, store);
}

export function useEmoteListContext(): EmoteListStore {
  const store = getContext<EmoteListStore | undefined>(EMOTE_LIST_KEY);
  if (!store) {
    throw new Error('EmoteList subcomponents must be inside <EmoteList.Root>');
  }
  return store;
}
