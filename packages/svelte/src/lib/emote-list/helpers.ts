import {
  EMOJI_GROUPS,
  isLocalEmote,
  type Emote,
  type EmojiGroupNumber,
} from '@emoteer/core';

// ─── Emote helpers ────────────────────────────────────────────────────────────

/** Stable keyed-each / favourite storage key for any emote. */
export function emoteKey(e: Emote): string {
  return isLocalEmote(e) ? `local:${e.id}` : `native:${e.hexcode}`;
}

/** Natural group an emote belongs to: locals → Custom (-2), natives → their own. */
export function emoteGroup(e: Emote): EmojiGroupNumber {
  return isLocalEmote(e) ? -2 : (e.group as EmojiGroupNumber);
}

export function emoteLabel(e: Emote): string {
  return isLocalEmote(e) ? e.name : e.label;
}

export function emoteShortcode(e: Emote): string {
  return isLocalEmote(e) ? e.name : (e.shortcodes[0] ?? '');
}

/** Text written to the clipboard by the Preview copy button. */
export function emoteCopyText(e: Emote): string {
  return isLocalEmote(e) ? `:${e.name}:` : e.unicode;
}

export function matchesQuery(e: Emote, q: string): boolean {
  if (!q) return true;
  const lower = q.toLowerCase();
  if (isLocalEmote(e)) {
    return (
      e.name.toLowerCase().includes(lower) ||
      (e.category?.toLowerCase().includes(lower) ?? false)
    );
  }
  return (
    e.label.toLowerCase().includes(lower) ||
    e.shortcodes.some((s) => s.includes(lower)) ||
    (e.tags?.some((t) => t.includes(lower)) ?? false)
  );
}

// ─── Favourites persistence ───────────────────────────────────────────────────

export const FAVORITES_STORAGE_KEY = 'emoteer-favorites';

/**
 * Legacy entries were bare hexcodes. Normalise to the prefixed form so native
 * and local emotes can coexist in the same list.
 */
export function migrateFavoriteKey(raw: string): string {
  return raw.includes(':') ? raw : `native:${raw}`;
}

// ─── Group metadata ────────────────────────────────────────────────────────────

/** Representative emoji for each emojibase group number. */
export const GROUP_ICONS: Record<number, string> = {
  [-2]: '✨',
  [-1]: '🕒',
  0: '😊',
  1: '👋',
  3: '🐻',
  4: '🍎',
  5: '✈️',
  6: '⚽',
  7: '💡',
  8: '💯',
  9: '🏳️',
};

export const ALL_GROUPS: Record<number, string> = {
  ...EMOJI_GROUPS,
};

// ─── Grid layout constants ──────────────────────────────────────────────────────

export const COLUMNS = 8;
export const ROW_HEIGHT = 40;
export const HEADER_HEIGHT = 22;

export type GridItem =
  | { kind: 'header'; group: EmojiGroupNumber; label: string }
  | { kind: 'row'; emotes: Emote[] };
