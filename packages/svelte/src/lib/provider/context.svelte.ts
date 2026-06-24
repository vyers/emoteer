import {
  buildShortcodeIndex,
  buildUnicodeIndex,
  type Emote,
  type LocalEmote,
  type NativeEmoji,
} from '@emoteer/core';
import { getContext, setContext } from 'svelte';

const EMOTE_CONTEXT_KEY = Symbol('emoteer.emote-context');

/**
 * Reactive emote store shared through Svelte context by {@link EmoteProvider}.
 *
 * Mirrors the React `EmoteContextValue`:
 *  - `emojis`   — native Unicode emojis loaded for the active locale.
 *  - `locals`   — developer-defined custom emotes passed to the provider.
 *  - `emotes`   — natives + locals combined (locals last, so they override
 *                 natives on shortcode collisions).
 *  - `shortcodeIndex` — `:shortcode:` → emote (natives and locals).
 *  - `unicodeIndex`   — unicode glyph → native emoji (locals excluded).
 *
 * The fields are runes, so reading them inside a component template, `$derived`
 * or `$effect` subscribes to changes automatically.
 */
export class EmoteContext {
  /** Native Unicode emojis loaded for the active locale. */
  emojis = $state<NativeEmoji[]>([]);
  /** Developer-defined custom emotes passed to the provider. */
  locals = $state<LocalEmote[]>([]);
  isLoading = $state(false);
  error = $state<Error | null>(null);

  /** Natives + locals combined. Locals are listed last so they override natives. */
  emotes: Emote[] = $derived([...this.emojis, ...this.locals]);
  /** `:shortcode:` → emote. Includes both natives and locals. */
  shortcodeIndex = $derived(buildShortcodeIndex(this.emotes));
  /** unicode glyph → native emoji. Locals are excluded (no unicode form). */
  unicodeIndex = $derived(buildUnicodeIndex(this.emojis));
}

export function setEmoteContext(ctx: EmoteContext): EmoteContext {
  return setContext(EMOTE_CONTEXT_KEY, ctx);
}

/**
 * Reads the {@link EmoteContext} provided by an ancestor `<EmoteProvider>`.
 * Throws when called outside a provider. Call it during component
 * initialisation (top of `<script>`), like the React `useEmoteContext()` hook.
 */
export function useEmoteContext(): EmoteContext {
  const ctx = getContext<EmoteContext | undefined>(EMOTE_CONTEXT_KEY);
  if (!ctx) {
    throw new Error('useEmoteContext must be used within <EmoteProvider>');
  }
  return ctx;
}
