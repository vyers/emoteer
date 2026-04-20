import type { Emoji as EmojibaseEmoji } from 'emojibase';
import type { NativeEmoji } from './types.js';

type ShortcodeMap = Record<string, string | string[]>;

/**
 * Convert a raw shortcode string into snake_case form. CLDR labels come as
 * natural-language phrases ("grinning face", "flag: United States"); emojibase
 * labels are already snake_case. This step makes both providers interchangeable
 * while preserving non-Latin scripts (Cyrillic, Hangul, Devanagari, Han, …).
 */
function toSnakeCase(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '_')
    .replace(/^_+|_+$/g, '');
}

function normalizeShortcodes(codes: string | string[] | undefined): string[] {
  if (!codes) return [];
  const list = Array.isArray(codes) ? codes : [codes];
  return list.map(toSnakeCase).filter(Boolean);
}

function mapEmojis(
  raw: EmojibaseEmoji[],
  shortcodeMap: ShortcodeMap,
): NativeEmoji[] {
  return raw
    .filter((e) => e.emoji != null && e.group !== 2) // skip component group (skin tones)
    .map((e) => ({
      unicode: e.emoji!,
      label: e.label,
      shortcodes: normalizeShortcodes(shortcodeMap[e.hexcode]),
      group: e.group ?? 0,
      hexcode: e.hexcode,
      tags: e.tags,
    }));
}

/** BCP 47 tag for a locale with bundled emoji data and shortcodes. */
export type SupportedLocale =
  | 'bn'
  | 'da'
  | 'de'
  | 'en'
  | 'en-gb'
  | 'es'
  | 'es-mx'
  | 'et'
  | 'fi'
  | 'fr'
  | 'hi'
  | 'hu'
  | 'it'
  | 'ja'
  | 'ko'
  | 'lt'
  | 'ms'
  | 'nb'
  | 'nl'
  | 'pl'
  | 'pt'
  | 'ru'
  | 'sv'
  | 'th'
  | 'uk'
  | 'vi'
  | 'zh'
  | 'zh-hant';

/**
 * Locale string accepted by {@link loadEmojis} and EmoteProvider. Preserves
 * autocomplete for the first-class supported tags while still allowing any
 * string (unsupported values fall back to 'en' at runtime).
 */
export type Locale = SupportedLocale | (string & {});

interface LocaleLoader {
  data: () => Promise<{ default: unknown }>;
  shortcodes: () => Promise<{ default: unknown }>;
}

/**
 * Locales for which emojibase-data ships both labels and the `emojibase`
 * shortcode provider. Each entry maps to a pair of static dynamic imports
 * so bundlers can code-split per locale instead of inlining every JSON.
 */
const LOADERS: Record<SupportedLocale, LocaleLoader> = {
  bn: {
    data: () => import('emojibase-data/bn/data.json'),
    shortcodes: () => import('emojibase-data/bn/shortcodes/cldr.json'),
  },
  da: {
    data: () => import('emojibase-data/da/data.json'),
    shortcodes: () => import('emojibase-data/da/shortcodes/cldr.json'),
  },
  de: {
    data: () => import('emojibase-data/de/data.json'),
    shortcodes: () => import('emojibase-data/de/shortcodes/cldr.json'),
  },
  en: {
    data: () => import('emojibase-data/en/data.json'),
    shortcodes: () => import('emojibase-data/en/shortcodes/emojibase.json'),
  },
  'en-gb': {
    data: () => import('emojibase-data/en-gb/data.json'),
    shortcodes: () => import('emojibase-data/en-gb/shortcodes/emojibase.json'),
  },
  es: {
    data: () => import('emojibase-data/es/data.json'),
    shortcodes: () => import('emojibase-data/es/shortcodes/cldr.json'),
  },
  'es-mx': {
    data: () => import('emojibase-data/es-mx/data.json'),
    shortcodes: () => import('emojibase-data/es-mx/shortcodes/cldr.json'),
  },
  et: {
    data: () => import('emojibase-data/et/data.json'),
    shortcodes: () => import('emojibase-data/et/shortcodes/cldr.json'),
  },
  fi: {
    data: () => import('emojibase-data/fi/data.json'),
    shortcodes: () => import('emojibase-data/fi/shortcodes/cldr.json'),
  },
  fr: {
    data: () => import('emojibase-data/fr/data.json'),
    shortcodes: () => import('emojibase-data/fr/shortcodes/emojibase.json'),
  },
  hi: {
    data: () => import('emojibase-data/hi/data.json'),
    shortcodes: () => import('emojibase-data/hi/shortcodes/cldr.json'),
  },
  hu: {
    data: () => import('emojibase-data/hu/data.json'),
    shortcodes: () => import('emojibase-data/hu/shortcodes/cldr.json'),
  },
  it: {
    data: () => import('emojibase-data/it/data.json'),
    shortcodes: () => import('emojibase-data/it/shortcodes/cldr.json'),
  },
  ja: {
    data: () => import('emojibase-data/ja/data.json'),
    shortcodes: () => import('emojibase-data/ja/shortcodes/emojibase.json'),
  },
  ko: {
    data: () => import('emojibase-data/ko/data.json'),
    shortcodes: () => import('emojibase-data/ko/shortcodes/cldr.json'),
  },
  lt: {
    data: () => import('emojibase-data/lt/data.json'),
    shortcodes: () => import('emojibase-data/lt/shortcodes/cldr.json'),
  },
  ms: {
    data: () => import('emojibase-data/ms/data.json'),
    shortcodes: () => import('emojibase-data/ms/shortcodes/cldr.json'),
  },
  nb: {
    data: () => import('emojibase-data/nb/data.json'),
    shortcodes: () => import('emojibase-data/nb/shortcodes/cldr.json'),
  },
  nl: {
    data: () => import('emojibase-data/nl/data.json'),
    shortcodes: () => import('emojibase-data/nl/shortcodes/cldr.json'),
  },
  pl: {
    data: () => import('emojibase-data/pl/data.json'),
    shortcodes: () => import('emojibase-data/pl/shortcodes/cldr.json'),
  },
  pt: {
    data: () => import('emojibase-data/pt/data.json'),
    shortcodes: () => import('emojibase-data/pt/shortcodes/cldr.json'),
  },
  ru: {
    data: () => import('emojibase-data/ru/data.json'),
    shortcodes: () => import('emojibase-data/ru/shortcodes/emojibase.json'),
  },
  sv: {
    data: () => import('emojibase-data/sv/data.json'),
    shortcodes: () => import('emojibase-data/sv/shortcodes/emojibase.json'),
  },
  th: {
    data: () => import('emojibase-data/th/data.json'),
    shortcodes: () => import('emojibase-data/th/shortcodes/cldr.json'),
  },
  uk: {
    data: () => import('emojibase-data/uk/data.json'),
    shortcodes: () => import('emojibase-data/uk/shortcodes/cldr.json'),
  },
  vi: {
    data: () => import('emojibase-data/vi/data.json'),
    shortcodes: () => import('emojibase-data/vi/shortcodes/cldr.json'),
  },
  zh: {
    data: () => import('emojibase-data/zh/data.json'),
    shortcodes: () => import('emojibase-data/zh/shortcodes/emojibase.json'),
  },
  'zh-hant': {
    data: () => import('emojibase-data/zh-hant/data.json'),
    shortcodes: () => import('emojibase-data/zh-hant/shortcodes/cldr.json'),
  },
};

/** BCP 47 locales with bundled emoji data and shortcodes. */
export const SUPPORTED_LOCALES = Object.keys(LOADERS) as SupportedLocale[];

/**
 * Lazily loads the full emoji dataset for a given locale.
 * Defaults to English ('en'). Unsupported locales fall back to 'en'.
 */
export async function loadEmojis(locale: Locale = 'en'): Promise<NativeEmoji[]> {
  const entry = LOADERS[locale as SupportedLocale] ?? LOADERS.en;
  const [dataModule, shortcodesModule] = await Promise.all([
    entry.data(),
    entry.shortcodes(),
  ]);
  return mapEmojis(
    dataModule.default as EmojibaseEmoji[],
    shortcodesModule.default as ShortcodeMap,
  );
}

/** Builds a Map keyed by `:shortcode:` for O(1) lookups. */
export function buildShortcodeIndex(
  emojis: NativeEmoji[],
): Map<string, NativeEmoji> {
  const map = new Map<string, NativeEmoji>();
  for (const emoji of emojis) {
    for (const code of emoji.shortcodes) {
      map.set(`:${code}:`, emoji);
    }
  }
  return map;
}

/** Builds a Map keyed by unicode glyph for O(1) lookups. */
export function buildUnicodeIndex(
  emojis: NativeEmoji[],
): Map<string, NativeEmoji> {
  const map = new Map<string, NativeEmoji>();
  for (const emoji of emojis) {
    map.set(emoji.unicode, emoji);
  }
  return map;
}
