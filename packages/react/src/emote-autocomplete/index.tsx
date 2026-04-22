import { Portal } from "@zag-js/react";
import { isLocalEmote, type Emote } from "@emoteer/core";
import { cn } from "../internal/cn.js";
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from "@floating-ui/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ChangeEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { useEmoteContext } from "../provider.js";

// ─── Emote helpers (local to this module) ─────────────────────────────────────

function emoteKey(e: Emote): string {
  return isLocalEmote(e) ? `local:${e.id}` : `native:${e.hexcode}`;
}

function emoteLabel(e: Emote): string {
  return isLocalEmote(e) ? e.name : e.label;
}

/**
 * Text that replaces the `:query` trigger when an emote is selected.
 * Natives collapse to their unicode glyph; locals stay as `:name:` so the
 * consumer can render them as images in their own markup.
 */
function emoteReplacement(e: Emote): string {
  return isLocalEmote(e) ? `:${e.name}:` : e.unicode;
}

function matchesQuery(e: Emote, q: string): boolean {
  const lower = q.toLowerCase();
  if (isLocalEmote(e)) {
    return (
      e.name.toLowerCase().includes(lower) ||
      (e.category?.toLowerCase().includes(lower) ?? false)
    );
  }
  return (
    e.shortcodes.some((s) => s.includes(lower)) ||
    e.label.toLowerCase().includes(lower)
  );
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface EmoteAutocompleteContextValue {
  isOpen: boolean;
  suggestions: Emote[];
  activeIndex: number;
  query: string;
  listboxId: string;
  getOptionId: (key: string) => string;
  setReferenceEl: (el: HTMLElement | null) => void;
  floatingRef: (el: HTMLElement | null) => void;
  floatingStyles: CSSProperties;
  selectSuggestion: (emote: Emote) => void;
  handleInputChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleKeyDown: (
    e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

const EmoteAutocompleteContext =
  createContext<EmoteAutocompleteContextValue | null>(null);

function useAutocompleteContext() {
  const ctx = useContext(EmoteAutocompleteContext);
  if (!ctx)
    throw new Error(
      "EmoteAutocomplete subcomponents must be inside <EmoteAutocomplete.Root>",
    );
  return ctx;
}

// ─── Root ─────────────────────────────────────────────────────────────────────

const TRIGGER_PATTERN = /:[\p{L}\p{N}_]*$/u;
const MAX_SUGGESTIONS = 8;

export interface EmoteAutocompleteRootProps {
  onSelect?: (emote: Emote, value: string) => void;
  children: ReactNode;
}

function Root({ onSelect, children }: EmoteAutocompleteRootProps) {
  const { emotes } = useEmoteContext();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputValueRef = useRef("");
  const baseId = useId();
  const listboxId = `${baseId}-listbox`;
  const getOptionId = useCallback(
    (key: string) => `${baseId}-option-${key}`,
    [baseId],
  );

  const { refs, floatingStyles } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "top-start",
    middleware: [offset(4), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  const suggestions = useMemo<Emote[]>(() => {
    if (!query) return [];
    return emotes.filter((e) => matchesQuery(e, query)).slice(0, MAX_SUGGESTIONS);
  }, [emotes, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const val = e.target.value;
      inputValueRef.current = val;
      const match = val.match(TRIGGER_PATTERN);
      if (match) {
        const q = match[0].slice(1);
        setQuery(q);
        setIsOpen(true);
      } else {
        setQuery("");
        setIsOpen(false);
      }
    },
    [],
  );

  const selectSuggestion = useCallback(
    (emote: Emote) => {
      const newValue = inputValueRef.current.replace(
        TRIGGER_PATTERN,
        emoteReplacement(emote),
      );
      inputValueRef.current = newValue;
      setIsOpen(false);
      setQuery("");
      onSelect?.(emote, newValue);
    },
    [onSelect],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (!isOpen || suggestions.length === 0) return;
      if (e.key === "ArrowDown" || (e.key === "Tab" && !e.shiftKey)) {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % suggestions.length);
      } else if (e.key === "ArrowUp" || (e.key === "Tab" && e.shiftKey)) {
        e.preventDefault();
        setActiveIndex(
          (i) => (i - 1 + suggestions.length) % suggestions.length,
        );
      } else if (e.key === "Enter") {
        const selected = suggestions[activeIndex];
        if (selected) {
          e.preventDefault();
          selectSuggestion(selected);
        }
      } else if (e.key === "Escape") {
        setIsOpen(false);
        setQuery("");
      }
    },
    [isOpen, suggestions, activeIndex, selectSuggestion],
  );

  return (
    <EmoteAutocompleteContext.Provider
      value={{
        isOpen,
        suggestions,
        activeIndex,
        query,
        listboxId,
        getOptionId,
        setReferenceEl: refs.setReference,
        floatingRef: refs.setFloating,
        floatingStyles: floatingStyles as CSSProperties,
        selectSuggestion,
        handleInputChange,
        handleKeyDown,
      }}
    >
      {children}
    </EmoteAutocompleteContext.Provider>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────

export interface EmoteAutocompleteInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

/**
 * Input that drives the autocomplete.
 *
 * Uncontrolled by design: the Root tracks the live value internally to detect
 * the `:shortcode` trigger and to replace the match on selection. Use
 * `defaultValue`, not `value`, and read the final text via the Root's
 * `onSelect(emote, value)` callback.
 */
function Input({
  className,
  onChange,
  onKeyDown,
  ...props
}: EmoteAutocompleteInputProps) {
  const {
    setReferenceEl,
    handleInputChange,
    handleKeyDown,
    isOpen,
    suggestions,
    activeIndex,
    listboxId,
    getOptionId,
  } = useAutocompleteContext();

  const expanded = isOpen && suggestions.length > 0;
  const activeSuggestion = expanded ? suggestions[activeIndex] : undefined;
  const activeDescendant = activeSuggestion
    ? getOptionId(emoteKey(activeSuggestion))
    : undefined;

  return (
    <input
      ref={setReferenceEl}
      type="text"
      role="combobox"
      aria-autocomplete="list"
      aria-expanded={expanded}
      aria-controls={listboxId}
      aria-activedescendant={activeDescendant}
      onChange={(e) => {
        handleInputChange(e);
        onChange?.(e);
      }}
      onKeyDown={(e) => {
        handleKeyDown(e);
        onKeyDown?.(e);
      }}
      className={cn(
        "font-semibold p-2.5 rounded-(--em-radius-autocomplete-input) border-(length:--em-border-width-autocomplete-input) border-(--em-border-autocomplete-input) bg-(--em-bg-autocomplete-input)",
        "focus:outline-hidden focus:ring-2 focus:ring-em-primary",
        className,
      )}
      {...props}
    />
  );
}

// ─── Content ───────────────────────────────────────────────────────────────────

export interface EmoteAutocompleteContentProps {
  children: ReactNode;
  className?: string;
}

function Content({ children, className }: EmoteAutocompleteContentProps) {
  const { isOpen, suggestions, floatingRef, floatingStyles } =
    useAutocompleteContext();

  if (!isOpen || suggestions.length === 0) return null;

  return (
    <Portal>
      <div
        ref={floatingRef}
        style={floatingStyles}
        className={cn("z-50", className)}
      >
        {children}
      </div>
    </Portal>
  );
}

// ─── List ─────────────────────────────────────────────────────────────────────

export interface EmoteAutocompleteListProps {
  className?: string;
}

function List({ className }: EmoteAutocompleteListProps) {
  const { suggestions, activeIndex, selectSuggestion, listboxId, getOptionId } =
    useAutocompleteContext();

  return (
    <div
      id={listboxId}
      role="listbox"
      aria-label="Emoji suggestions"
      className={cn(
        "flex items-center gap-1.25 whitespace-nowrap",
        "border-(length:--em-border-width-autocomplete-list) rounded-(--em-radius-autocomplete-list) border-(--em-border-autocomplete-list) bg-(--em-bg-autocomplete-list) p-2",
        className,
      )}
    >
      {suggestions.map((emote, index) => {
        const key = emoteKey(emote);
        const label = emoteLabel(emote);
        return (
          <button
            key={key}
            id={getOptionId(key)}
            role="option"
            type="button"
            aria-selected={index === activeIndex}
            title={label}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => selectSuggestion(emote)}
            className={cn(
              "inline-flex items-center justify-center text-2xl rounded-md",
              "cursor-pointer select-none h-fit p-0.5 transition-colors",
              index === activeIndex ? "bg-em-hover" : "hover:bg-em-hover",
            )}
          >
            {isLocalEmote(emote) ? (
              <img
                src={emote.src}
                alt={emote.name}
                className="inline-block w-6 h-6 object-contain"
                draggable={false}
              />
            ) : (
              emote.unicode
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Namespace export ─────────────────────────────────────────────────────────

export const EmoteAutocomplete = { Root, Input, Content, List };
