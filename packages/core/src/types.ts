export type EmoteTier = "native" | "local" | "cloud";

/** A native Unicode emoji mapped from emojibase data. */
export interface NativeEmoji {
  /** The actual unicode glyph, e.g. '😀' */
  unicode: string;
  /** Human-readable label, e.g. 'grinning face' */
  label: string;
  /** Shortcodes without colons, e.g. ['grinning_face'] */
  shortcodes: string[];
  /** Emojibase group number (0–9) */
  group: number;
  /** Hex code, e.g. '1F600' */
  hexcode: string;
  /** Optional search tags */
  tags?: string[];
}

/** A developer-defined custom emote (local or remote image). */
export interface LocalEmote {
  id: string;
  /** Display name, used as shortcode without colons */
  name: string;
  /** URL or local path to the image */
  src: string;
  /** Optional grouping label */
  category?: string;
}

/** Credentials for Emoteer Cloud (Tier 2). */
export interface CloudConfig {
  projectId: string;
  apiKey: string;
}

/** Emojibase group number → display name mapping. */
export const EMOJI_GROUPS = {
  [-1]: "Most Used",
  0: "Smileys & Emotion",
  1: "People & Body",
  3: "Animals & Nature",
  4: "Food & Drink",
  5: "Travel & Places",
  6: "Activities",
  7: "Objects",
  8: "Symbols",
  9: "Flags",
} as const;

export type EmojiGroupNumber = keyof typeof EMOJI_GROUPS;
export type EmojiGroupName = (typeof EMOJI_GROUPS)[EmojiGroupNumber];
