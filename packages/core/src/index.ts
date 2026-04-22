export type {
  EmoteTier,
  NativeEmoji,
  LocalEmote,
  Emote,
  CloudConfig,
  EmojiGroupNumber,
  EmojiGroupName,
} from './types.js';

export { EMOJI_GROUPS, isLocalEmote, isNativeEmoji } from './types.js';

export {
  loadEmojis,
  buildShortcodeIndex,
  buildUnicodeIndex,
  SUPPORTED_LOCALES,
} from './data.js';
export type { SupportedLocale, Locale } from './data.js';

export {
  textToEmoji,
  findEmojiByShortcode,
  findEmojiByUnicode,
} from './utils.js';

export { Icons, type IconName } from './icons.js';
