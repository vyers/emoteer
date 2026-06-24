import { isLocalEmote, type Emote } from '@emoteer/core';

export const TRIGGER_PATTERN = /:[\p{L}\p{N}_]*$/u;
export const MAX_SUGGESTIONS = 8;

export function emoteKey(e: Emote): string {
  return isLocalEmote(e) ? `local:${e.id}` : `native:${e.hexcode}`;
}

export function emoteLabel(e: Emote): string {
  return isLocalEmote(e) ? e.name : e.label;
}

/**
 * Text that replaces the `:query` trigger when an emote is selected. Natives
 * collapse to their unicode glyph; locals stay as `:name:` so the consumer can
 * render them as images in their own markup.
 */
export function emoteReplacement(e: Emote): string {
  return isLocalEmote(e) ? `:${e.name}:` : e.unicode;
}

export function matchesQuery(e: Emote, q: string): boolean {
  const lower = q.toLowerCase();
  if (isLocalEmote(e)) {
    return (
      e.name.toLowerCase().includes(lower) ||
      (e.category?.toLowerCase().includes(lower) ?? false)
    );
  }
  return (
    e.shortcodes.some((s) => s.includes(lower)) ||
    e.label.toLowerCase().includes(lower)
  );
}
