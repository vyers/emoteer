import Content from './Content.svelte';
import Input from './Input.svelte';
import List from './List.svelte';
import Root from './Root.svelte';

/**
 * Inline `:shortcode` autocomplete anchored to an input via Floating UI.
 *
 * ```svelte
 * <EmoteAutocomplete.Root onSelect={(emote, value) => (text = value)}>
 *   <EmoteAutocomplete.Input />
 *   <EmoteAutocomplete.Content>
 *     <EmoteAutocomplete.List />
 *   </EmoteAutocomplete.Content>
 * </EmoteAutocomplete.Root>
 * ```
 */
export const EmoteAutocomplete = { Root, Input, Content, List };

export type {
  EmoteAutocompleteRootProps,
  EmoteAutocompleteInputProps,
  EmoteAutocompleteListProps,
} from './types.js';
