import { isLocalEmote, type Emote, type NativeEmoji } from './types.js';

const SHORTCODE_PATTERN = /:[\p{L}\p{N}_]+:/gimu;

/**
 * Replaces `:shortcode:` occurrences in a string with their unicode emoji
 * equivalents using a pre-built shortcode index.
 *
 * Local emote shortcodes (which have no unicode form) are preserved as text
 * so consumers can render them as images in their own markup.
 *
 * @example
 * const index = buildShortcodeIndex(await loadEmojis());
 * textToEmoji('Hello :grinning_face:', index); // 'Hello 😀'
 */
export function textToEmoji<T extends Emote>(
  value: string,
  index: Map<string, T>,
): string {
  return value.replace(SHORTCODE_PATTERN, (match) => {
    const emote = index.get(match);
    if (!emote || isLocalEmote(emote)) return match;
    return emote.unicode;
  });
}

/**
 * Looks up an emote by its `:shortcode:` (colons included).
 * Returns `null` if not found.
 */
export function findEmojiByShortcode<T extends Emote>(
  shortcode: string,
  index: Map<string, T>,
): T | null {
  return index.get(shortcode) ?? null;
}

/**
 * Looks up an emoji by its unicode glyph character.
 * Returns `null` if not found.
 */
export function findEmojiByUnicode(
  unicode: string,
  index: Map<string, NativeEmoji>,
): NativeEmoji | null {
  return index.get(unicode) ?? null;
}
