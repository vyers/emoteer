import {
  buildShortcodeIndex,
  buildUnicodeIndex,
  loadEmojis,
  type CloudConfig,
  type LocalEmote,
  type Locale,
  type NativeEmoji,
} from '@emoteer/core';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

interface EmoteContextValue {
  emojis: NativeEmoji[];
  shortcodeIndex: Map<string, NativeEmoji>;
  unicodeIndex: Map<string, NativeEmoji>;
  locals: LocalEmote[];
  isLoading: boolean;
  error: Error | null;
}

const EmoteContext = createContext<EmoteContextValue | null>(null);

export function useEmoteContext(): EmoteContextValue {
  const ctx = useContext(EmoteContext);
  if (!ctx) {
    throw new Error('useEmoteContext must be used within <EmoteProvider>');
  }
  return ctx;
}

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
  children: ReactNode;
}

export function EmoteProvider({
  natives = true,
  locals = [],
  locale = 'en',
  children,
}: EmoteProviderProps) {
  const [emojis, setEmojis] = useState<NativeEmoji[]>([]);
  const [isLoading, setIsLoading] = useState(natives);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!natives) return;
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    loadEmojis(locale)
      .then((data) => {
        if (!cancelled) {
          setEmojis(data);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setIsLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [natives, locale]);

  const shortcodeIndex = useMemo(() => buildShortcodeIndex(emojis), [emojis]);
  const unicodeIndex = useMemo(() => buildUnicodeIndex(emojis), [emojis]);

  return (
    <EmoteContext.Provider
      value={{ emojis, shortcodeIndex, unicodeIndex, locals, isLoading, error }}
    >
      {children}
    </EmoteContext.Provider>
  );
}
