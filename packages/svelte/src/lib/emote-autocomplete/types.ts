import type { Emote } from '@emoteer/core';
import type { Snippet } from 'svelte';
import type { HTMLInputAttributes } from 'svelte/elements';

export interface EmoteAutocompleteRootProps {
  onSelect?: (emote: Emote, value: string) => void;
  children: Snippet;
}

export interface EmoteAutocompleteInputProps extends HTMLInputAttributes {
  class?: string;
}

export interface EmoteAutocompleteContentProps {
  children: Snippet;
  class?: string;
}

export interface EmoteAutocompleteListProps {
  class?: string;
}
