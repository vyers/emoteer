import type { CloudConfig, LocalEmote, Locale } from '@emoteer/core';
import type { Snippet } from 'svelte';

export interface EmoteProviderProps {
  /** Load native Unicode emojis (Tier 0). Defaults to true. */
  natives?: boolean;
  /** Developer-defined custom emotes (Tier 1). */
  locals?: LocalEmote[];
  /** Emoteer Cloud credentials (Tier 2). Reserved for future use. */
  cloud?: CloudConfig;
  /**
   * BCP 47 locale for emoji labels and shortcodes. Defaults to 'en'.
   * Autocomplete suggests the first-class supported tags; any string is
   * accepted at the type level, and unsupported values fall back to 'en'
   * at runtime.
   */
  locale?: Locale;
  children: Snippet;
}
