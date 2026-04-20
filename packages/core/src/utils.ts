import type { NativeEmoji } from './types.js';

const SHORTCODE_PATTERN = /:[\p{L}\p{N}_]+:/gimu;

/**
 * Replaces `:shortcode:` occurrences in a string with their unicode emoji
 * equivalents using a pre-built shortcode index.
 *
 * @example
 * const index = buildShortcodeIndex(await loadEmojis());
 * textToEmoji('Hello :grinning_face:', index); // 'Hello 😀'
 */
export function textToEmoji(
  value: string,
  index: Map<string, NativeEmoji>,
): string {
  return value.replace(SHORTCODE_PATTERN, (match) => {
    return index.get(match)?.unicode ?? match;
  });
}

/**
 * Looks up an emoji by its `:shortcode:` (colons included).
 * Returns `null` if not found.
 */
export function findEmojiByShortcode(
  shortcode: string,
  index: Map<string, NativeEmoji>,
): NativeEmoji | null {
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
