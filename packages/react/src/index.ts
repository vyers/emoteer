// Core types re-exported for consumer convenience
export type {
  NativeEmoji,
  LocalEmote,
  Emote,
  CloudConfig,
  Locale,
  SupportedLocale,
} from "@emoteer/core";

export { isLocalEmote, isNativeEmoji } from "@emoteer/core";

// Provider
export { EmoteProvider, useEmoteContext } from "./provider.js";
export type { EmoteProviderProps } from "./provider.js";

// EmoteList (compound + convenience)
export { EmoteList, EmoteListPicker } from "./emote-list/index.js";
export type {
  EmoteListRootProps,
  EmoteListSearchProps,
  EmoteListTabsProps,
  EmoteListGridProps,
  EmoteListPreviewProps,
} from "./emote-list/index.js";

// EmoteAutocomplete (compound)
export { EmoteAutocomplete } from "./emote-autocomplete/index.js";
export type {
  EmoteAutocompleteRootProps,
  EmoteAutocompleteInputProps,
  EmoteAutocompleteListProps,
} from "./emote-autocomplete/index.js";

// ReactionCounter
export { ReactionCounter } from "./reaction-counter/index.js";
export type {
  ReactionCounterProps,
  Reaction,
} from "./reaction-counter/index.js";

// ReactionSlider
export { ReactionSlider } from "./reaction-slider/index.js";
export type { ReactionSliderRootProps } from "./reaction-slider/index.js";

// ReactionButton (compound + convenience)
export { ReactionButton } from "./reaction-button/index.js";
export type {
  ReactionButtonRootProps,
  ReactionButtonItemProps,
  ReactionButtonPlusProps,
  ReactionButtonStickerProps,
  ReactionButtonPopoverProps,
  ReactionButtonTriggerProps,
  ReactionButtonContentProps,
} from "./reaction-button/index.js";

// EmoteInput / EmoteTextArea
export { EmoteInput, EmoteTextArea } from "./emote-input/index.js";
export type {
  EmoteInputProps,
  EmoteTextAreaProps,
} from "./emote-input/index.js";
