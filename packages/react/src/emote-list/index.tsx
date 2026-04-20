import {
  EMOJI_GROUPS,
  type EmojiGroupNumber,
  type NativeEmoji,
} from "@emoteer/core";
import { cn } from "../internal/cn.js";
import { defaultRangeExtractor, useVirtualizer } from "@tanstack/react-virtual";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import { Icon } from "../internal/icon.js";
import { useEmoteContext } from "../provider.js";
import { ScrollArea } from "../internal/scroll-area/index.js";

// ─── Context ─────────────────────────────────────────────────────────────────

interface EmoteListContextValue {
  setQuery: (q: string) => void;
  setActiveGroup: (g: number | "all") => void;
  hoveredEmoji: NativeEmoji | null;
  setHoveredEmoji: (e: NativeEmoji | null) => void;
  filteredEmojis: NativeEmoji[];
  onSelect: (emoji: NativeEmoji) => void;
  query: string;
  activeGroup: number | "all";
  favorites: string[];
  toggleFavorite: (hexcode: string) => void;
}

const EmoteListContext = createContext<EmoteListContextValue | null>(null);

function useEmoteListContext() {
  const ctx = useContext(EmoteListContext);
  if (!ctx)
    throw new Error("EmoteList subcomponents must be inside <EmoteList.Root>");
  return ctx;
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export interface EmoteListRootProps {
  onSelect?: (emoji: NativeEmoji) => void;
  className?: string;
  children: ReactNode;
}

function Root({ onSelect, className, children }: EmoteListRootProps) {
  const { emojis } = useEmoteContext();
  const [query, setQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState<number | "all">("all");
  const [hoveredEmoji, setHoveredEmoji] = useState<NativeEmoji | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load favorites on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("emoteer-favorites");
      if (stored) setFavorites(JSON.parse(stored));
    } catch (e) {
      console.error("Failed to read favorites from localStorage", e);
    }
    setHydrated(true);
  }, []);

  // Persist favorites when they change (after initial hydration)
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem("emoteer-favorites", JSON.stringify(favorites));
    } catch (e) {
      console.error("Failed to persist favorites to localStorage", e);
    }
  }, [favorites, hydrated]);

  const toggleFavorite = useCallback((hexcode: string) => {
    setFavorites((prev) =>
      prev.includes(hexcode)
        ? prev.filter((h) => h !== hexcode)
        : [...prev, hexcode],
    );
  }, []);

  const filteredEmojis = useMemo(() => {
    let list = emojis;
    const q = query.trim().toLowerCase();

    if (q) {
      list = list.filter(
        (e) =>
          e.label.toLowerCase().includes(q) ||
          e.shortcodes.some((s) => s.includes(q)) ||
          e.tags?.some((t) => t.includes(q)),
      );
    }

    if (favorites.length > 0) {
      const favList = favorites
        .map((hex) => emojis.find((e) => e.hexcode === hex))
        .filter((e): e is NativeEmoji => !!e)
        .map((e) => ({ ...e, group: -1 as EmojiGroupNumber }));

      if (q) {
        const matchingFavs = favList.filter(
          (e) =>
            e.label.toLowerCase().includes(q) ||
            e.shortcodes.some((s) => s.includes(q)) ||
            e.tags?.some((t) => t.includes(q)),
        );
        list = [...matchingFavs, ...list];
      } else {
        list = [...favList, ...list];
      }
    }

    return list;
  }, [emojis, query, favorites]);

  const handleSelect = useCallback(
    (emoji: NativeEmoji) => onSelect?.(emoji),
    [onSelect],
  );

  return (
    <EmoteListContext.Provider
      value={{
        query,
        setQuery,
        activeGroup,
        setActiveGroup,
        hoveredEmoji,
        setHoveredEmoji,
        filteredEmojis,
        favorites,
        toggleFavorite,
        onSelect: handleSelect,
      }}
    >
      <div
        className={cn(
          "w-80 border rounded-lg border-em-border bg-em-bg overflow-hidden",
          className,
        )}
      >
        {children}
      </div>
    </EmoteListContext.Provider>
  );
}

// ─── Search ───────────────────────────────────────────────────────────────────

export interface EmoteListSearchProps {
  placeholder?: string;
  className?: string;
}

function Search({
  placeholder = "Search emojis…",
  className,
}: EmoteListSearchProps) {
  const { query, setQuery } = useEmoteListContext();

  return (
    <div className="px-2 pt-2 pb-1">
      <input
        type="search"
        value={query}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setQuery(e.target.value)
        }
        placeholder={placeholder}
        aria-label="Search emojis"
        className={cn(
          "w-full font-semibold p-2.5 rounded-lg border-[0.5px] border-em-border",
          "text-sm focus:outline-hidden focus:ring-2 focus:ring-em-primary",
          className,
        )}
      />
    </div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

/** Representative emoji for each emojibase group number. */
const GROUP_ICONS: Record<number, string> = {
  [-1]: "🕒",
  0: "😊",
  1: "👋",
  3: "🐻",
  4: "🍎",
  5: "✈️",
  6: "⚽",
  7: "💡",
  8: "💯",
  9: "🏳️",
};

export interface EmoteListTabsProps {
  /**
   * Group numbers to display as tabs.
   * Defaults to all groups. Pass a subset to hide specific categories.
   * Group numbers: -1=Most Used, 0=Smileys, 1=People, 3=Animals, 4=Food,
   *   5=Travel, 6=Activities, 7=Objects, 8=Symbols, 9=Flags
   */
  groups?: EmojiGroupNumber[];
  /** Whether to show emoji icons or text labels in the tabs. Defaults to 'emoji'. */
  display?: "emoji" | "label";
  className?: string;
}

const ALL_GROUPS: Record<number, string> = {
  ...EMOJI_GROUPS,
};

function Tabs({ groups, display = "emoji", className }: EmoteListTabsProps) {
  const { activeGroup, setActiveGroup, favorites } = useEmoteListContext();

  const entries = useMemo(() => {
    let list = Object.entries(ALL_GROUPS) as [string, string][];

    if (groups) {
      list = list.filter(([num]) =>
        groups.includes(Number(num) as EmojiGroupNumber),
      );
    }

    // Only show "Most Used" (-1) if there are favorites
    if (favorites.length === 0) {
      list = list.filter(([num]) => num !== "-1");
    }

    // Sort to ensure "Most Used" (-1) is at the top
    return [...list].sort((a, b) => Number(a[0]) - Number(b[0]));
  }, [groups, favorites]);

  return (
    <ScrollArea.Root className={cn("border-b border-em-border", className)}>
      <ScrollArea.Viewport
        role="group"
        aria-label="Emoji categories"
        className="px-2 py-1"
      >
        <div className="flex gap-0.5">
          {entries.map(([num, label]) => {
            const groupNum = Number(num) as EmojiGroupNumber;
            const isActive = activeGroup === groupNum;
            return (
              <button
                key={num}
                type="button"
                aria-label={label}
                aria-pressed={isActive}
                title={label}
                onClick={() => setActiveGroup(isActive ? "all" : groupNum)}
                className={cn(
                  "shrink-0 rounded-sm transition-colors",
                  display === "emoji"
                    ? "px-1.5 py-1 text-base leading-none"
                    : "px-2 py-0.5 text-xs font-medium",
                  isActive
                    ? "bg-em-hover text-em-fg"
                    : "text-em-muted opacity-70 hover:bg-em-hover hover:opacity-100 hover:text-em-fg",
                )}
              >
                {display === "emoji" ? (GROUP_ICONS[groupNum] ?? label) : label}
              </button>
            );
          })}
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="horizontal" />
    </ScrollArea.Root>
  );
}

// ─── Grid (virtualized) ───────────────────────────────────────────────────────

const COLUMNS = 8;
const ROW_HEIGHT = 40;
const HEADER_HEIGHT = 22;

type GridItem =
  | { kind: "header"; group: EmojiGroupNumber; label: string }
  | { kind: "row"; emojis: NativeEmoji[] };

export interface EmoteListGridProps {
  height?: number;
  className?: string;
}

function Grid({ height = 280, className }: EmoteListGridProps) {
  const {
    filteredEmojis,
    setHoveredEmoji,
    onSelect,
    activeGroup,
    setActiveGroup,
    query,
  } = useEmoteListContext();
  const { isLoading } = useEmoteContext();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeStickyIndex, setActiveStickyIndex] = useState(-1);
  const activeStickyIndexRef = useRef(-1);
  const isScrollingRef = useRef(false);

  // Always show headers to maintain context
  const withHeaders = true;

  // Build flat list: headers + emoji rows
  const items = useMemo<GridItem[]>(() => {
    const result: GridItem[] = [];
    const groupedMap = new Map<number, NativeEmoji[]>();

    for (const e of filteredEmojis) {
      if (!groupedMap.has(e.group)) {
        groupedMap.set(e.group, []);
      }
      groupedMap.get(e.group)!.push(e);
    }

    // Sort to keep "Most Used" (-1) first
    const sortedGroups = Array.from(groupedMap.keys()).sort((a, b) => a - b);

    for (const group of sortedGroups) {
      const groupEmojis = groupedMap.get(group)!;
      if (withHeaders) {
        result.push({
          kind: "header",
          group: group as EmojiGroupNumber,
          label: ALL_GROUPS[group as EmojiGroupNumber] ?? "",
        });
      }
      for (let i = 0; i < groupEmojis.length; i += COLUMNS) {
        result.push({ kind: "row", emojis: groupEmojis.slice(i, i + COLUMNS) });
      }
    }
    return result;
  }, [filteredEmojis, withHeaders]);

  // Precompute every header item index + its absolute scroll offset.
  const headerIndices = useMemo(() => {
    const result: Array<{ index: number; start: number }> = [];
    let offset = 0;
    for (let i = 0; i < items.length; i++) {
      const item = items[i]!;
      if (item.kind === "header") result.push({ index: i, start: offset });
      offset += item.kind === "header" ? HEADER_HEIGHT : ROW_HEIGHT;
    }
    return result;
  }, [items]);

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: (i) =>
      items[i]?.kind === "header" ? HEADER_HEIGHT : ROW_HEIGHT,
    overscan: 5,
    // Always keep the active sticky header in the DOM even when scrolled past
    rangeExtractor: useCallback(
      (range: Parameters<typeof defaultRangeExtractor>[0]) => {
        const base = defaultRangeExtractor(range);
        const sticky = activeStickyIndexRef.current;
        if (sticky >= 0 && !base.includes(sticky)) {
          return [sticky, ...base].sort((a, b) => a - b);
        }
        return base;
      },
      [],
    ),
  });

  // Scroll to group on activeGroup change
  useEffect(() => {
    if (activeGroup === "all") {
      if (!query.trim() && !isScrollingRef.current) {
        rowVirtualizer.scrollToIndex(0, { align: "start" });
      }
      return;
    }

    if (isScrollingRef.current) {
      isScrollingRef.current = false;
      return;
    }

    const index = items.findIndex(
      (item) => item.kind === "header" && item.group === activeGroup,
    );
    if (index !== -1) {
      rowVirtualizer.scrollToIndex(index, { align: "start" });
    }
  }, [activeGroup, items, rowVirtualizer]);

  // Update activeStickyIndex on scroll — the header that has fully left the top.
  const handleScroll = useCallback(() => {
    if (!withHeaders) {
      activeStickyIndexRef.current = -1;
      setActiveStickyIndex(-1);
      return;
    }
    const scrollTop = (scrollRef.current?.scrollTop ?? 0) + 1; // +1px buffer
    let next = -1;
    for (const { index, start } of headerIndices) {
      if (start <= scrollTop) next = index;
    }

    if (next !== activeStickyIndexRef.current) {
      activeStickyIndexRef.current = next;
      setActiveStickyIndex(next);

      // Sync activeGroup back to context when scrolling manually
      if (next >= 0) {
        const item = items[next];
        if (item?.kind === "header" && item.group !== activeGroup) {
          isScrollingRef.current = true;
          setActiveGroup(item.group);
        }
      } else if (activeGroup !== "all") {
        isScrollingRef.current = true;
        setActiveGroup("all");
      }
    }
  }, [withHeaders, headerIndices, items, activeGroup, setActiveGroup]);

  if (isLoading) {
    return (
      <div
        className={cn(
          "flex items-center justify-center text-em-muted text-sm",
          className,
        )}
        style={{ height }}
      >
        Loading emojis…
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center text-em-muted text-sm",
          className,
        )}
        style={{ height }}
      >
        No emojis found
      </div>
    );
  }

  return (
    <ScrollArea.Root className={cn("px-1", className)} style={{ height }}>
      <ScrollArea.Viewport
        ref={scrollRef}
        role="grid"
        aria-label="Emoji grid"
        onScroll={handleScroll}
      >
        <div
          style={{
            height: rowVirtualizer.getTotalSize(),
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((vItem) => {
            const item = items[vItem.index];
            if (!item) return null;

            // Section header row — sticky when it's the active one, absolute otherwise
            if (item.kind === "header") {
              const isSticky = withHeaders && vItem.index === activeStickyIndex;
              return (
                <div
                  key={`h-${item.group}`}
                  role="row"
                  style={
                    isSticky
                      ? {
                          position: "sticky",
                          top: 0,
                          zIndex: 10,
                          width: "100%",
                          height: HEADER_HEIGHT,
                          display: "flex",
                          alignItems: "center",
                          paddingLeft: "4px",
                          background: "var(--em-bg)",
                        }
                      : {
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: HEADER_HEIGHT,
                          transform: `translateY(${vItem.start}px)`,
                          display: "flex",
                          alignItems: "center",
                          paddingLeft: "4px",
                        }
                  }
                >
                  <span
                    role="rowheader"
                    className="text-[10px] font-semibold uppercase tracking-wide text-em-muted"
                  >
                    {item.label}
                  </span>
                </div>
              );
            }

            // Emoji row
            return (
              <div
                key={`r-${vItem.index}`}
                role="row"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: ROW_HEIGHT,
                  transform: `translateY(${vItem.start}px)`,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {item.emojis.map((emoji) => (
                  <button
                    key={emoji.hexcode}
                    role="gridcell"
                    type="button"
                    title={emoji.label}
                    aria-label={emoji.label}
                    onMouseEnter={() => setHoveredEmoji(emoji)}
                    onFocus={() => setHoveredEmoji(emoji)}
                    onClick={() => onSelect(emoji)}
                    style={{ flex: `0 0 ${100 / COLUMNS}%`, height: ROW_HEIGHT }}
                    className={cn(
                      "inline-flex items-center justify-center text-2xl",
                      "rounded-md hover:bg-em-hover cursor-pointer select-none p-0.5",
                      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-em-primary",
                    )}
                  >
                    {emoji.unicode}
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="vertical" />
    </ScrollArea.Root>
  );
}

// ─── Preview (EmoteInfo style) ────────────────────────────────────────────────

export interface EmoteListPreviewProps {
  className?: string;
}

function Preview({ className }: EmoteListPreviewProps) {
  const { hoveredEmoji, toggleFavorite, favorites } = useEmoteListContext();
  const [copied, setCopied] = useState(false);

  const isFavorited = hoveredEmoji
    ? favorites.includes(hoveredEmoji.hexcode)
    : false;

  const handleCopy = async () => {
    if (!hoveredEmoji) return;
    await navigator.clipboard.writeText(hoveredEmoji.unicode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const shortcode = hoveredEmoji?.shortcodes[0]
    ? `:${hoveredEmoji.shortcodes[0]}:`
    : "";

  return (
    <div
      className={cn(
        "flex justify-between border-t-[0.5px] border-em-border h-10 gap-2.5 px-2.5 items-center",
        className,
      )}
    >
      <span className="text-2xl leading-none" aria-hidden="true">
        {hoveredEmoji?.unicode ?? ""}
      </span>
      <div className="flex flex-col w-full items-start justify-center leading-3 font-medium text-sm">
        <span className="capitalize">
          {hoveredEmoji?.label ?? "Hover an emoji"}
        </span>
        {shortcode && <small className="text-em-muted">{shortcode}</small>}
      </div>
      <div className="flex gap-1.5 h-full items-center">
        <button
          type="button"
          aria-label="Copy emoji"
          title="Copy"
          onClick={handleCopy}
          className={cn(
            "text-em-muted hover:text-em-fg transition-colors",
            !hoveredEmoji && "pointer-events-none opacity-40",
          )}
        >
          <Icon name={copied ? "check" : "copy"} size={18} />
        </button>
        <button
          type="button"
          aria-label={
            isFavorited ? "Remove from favourites" : "Add to favourites"
          }
          title="Favourite"
          onClick={() => hoveredEmoji && toggleFavorite(hoveredEmoji.hexcode)}
          className={cn(
            "transition-colors",
            !hoveredEmoji && "pointer-events-none opacity-40",
            isFavorited
              ? "text-yellow-500 hover:text-yellow-600"
              : "text-em-muted hover:text-em-fg",
          )}
        >
          <Icon
            name="star"
            size={20}
            fill={isFavorited ? "currentColor" : "none"}
          />
        </button>
      </div>
    </div>
  );
}

// ─── Namespace export ─────────────────────────────────────────────────────────

export const EmoteList = { Root, Search, Tabs, Grid, Preview };

export function EmoteListPicker({
  onSelect,
  className,
}: {
  onSelect?: (emoji: NativeEmoji) => void;
  className?: string;
}) {
  return (
    <EmoteList.Root onSelect={onSelect} className={className}>
      <EmoteList.Search />
      <EmoteList.Tabs />
      <EmoteList.Grid />
      <EmoteList.Preview />
    </EmoteList.Root>
  );
}

export type { NativeEmoji };
