import type { Emote } from '@emoteer/core';
import { getContext, setContext } from 'svelte';
import { EmoteContext, useEmoteContext } from '../provider/context.svelte.js';
import {
  MAX_SUGGESTIONS,
  TRIGGER_PATTERN,
  emoteReplacement,
  matchesQuery,
} from './helpers.js';

const EMOTE_AUTOCOMPLETE_KEY = Symbol('emoteer.emote-autocomplete');

/**
 * Reactive state for an `<EmoteAutocomplete.Root>` subtree.
 *
 * Uncontrolled by design (matching the React package): the store tracks the
 * live input value internally to detect the `:shortcode` trigger and to replace
 * the match on selection. Read the final text via the Root's
 * `onSelect(emote, value)` callback.
 */
export class EmoteAutocompleteStore {
  query = $state('');
  isOpen = $state(false);
  activeIndex = $state(0);
  /** The reference element (the input) the suggestion list anchors to. */
  referenceEl = $state<HTMLElement | null>(null);

  /** Live input value, tracked imperatively (not reactive). */
  inputValue = '';
  onSelect?: (emote: Emote, value: string) => void;

  readonly baseId: string;
  // Field initializer so it is assigned before the `$derived` field below.
  // Runs during <EmoteAutocomplete.Root> init, so getContext is valid here.
  #emoteCtx: EmoteContext = useEmoteContext();

  constructor(baseId: string, onSelect?: (emote: Emote, value: string) => void) {
    this.baseId = baseId;
    this.onSelect = onSelect;
  }

  get listboxId(): string {
    return `${this.baseId}-listbox`;
  }

  getOptionId(key: string): string {
    return `${this.baseId}-option-${key}`;
  }

  suggestions: Emote[] = $derived.by(() => {
    if (!this.query) return [];
    return this.#emoteCtx.emotes
      .filter((e) => matchesQuery(e, this.query))
      .slice(0, MAX_SUGGESTIONS);
  });

  handleInput(value: string): void {
    this.inputValue = value;
    const match = value.match(TRIGGER_PATTERN);
    if (match) {
      this.query = match[0].slice(1);
      this.isOpen = true;
    } else {
      this.query = '';
      this.isOpen = false;
    }
    this.activeIndex = 0;
  }

  selectSuggestion(emote: Emote): void {
    const newValue = this.inputValue.replace(
      TRIGGER_PATTERN,
      emoteReplacement(emote),
    );
    this.inputValue = newValue;
    this.isOpen = false;
    this.query = '';
    this.onSelect?.(emote, newValue);
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (!this.isOpen || this.suggestions.length === 0) return;
    if (event.key === 'ArrowDown' || (event.key === 'Tab' && !event.shiftKey)) {
      event.preventDefault();
      this.activeIndex = (this.activeIndex + 1) % this.suggestions.length;
    } else if (event.key === 'ArrowUp' || (event.key === 'Tab' && event.shiftKey)) {
      event.preventDefault();
      this.activeIndex =
        (this.activeIndex - 1 + this.suggestions.length) % this.suggestions.length;
    } else if (event.key === 'Enter') {
      const selected = this.suggestions[this.activeIndex];
      if (selected) {
        event.preventDefault();
        this.selectSuggestion(selected);
      }
    } else if (event.key === 'Escape') {
      this.isOpen = false;
      this.query = '';
    }
  }
}

export function setAutocompleteContext(
  store: EmoteAutocompleteStore,
): EmoteAutocompleteStore {
  return setContext(EMOTE_AUTOCOMPLETE_KEY, store);
}

export function useAutocompleteContext(): EmoteAutocompleteStore {
  const store = getContext<EmoteAutocompleteStore | undefined>(
    EMOTE_AUTOCOMPLETE_KEY,
  );
  if (!store) {
    throw new Error(
      'EmoteAutocomplete subcomponents must be inside <EmoteAutocomplete.Root>',
    );
  }
  return store;
}
