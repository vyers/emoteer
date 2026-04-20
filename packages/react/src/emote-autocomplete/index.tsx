import { Portal } from "@zag-js/react";
import type { NativeEmoji } from "@emoteer/core";
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

// ─── Context ──────────────────────────────────────────────────────────────────

interface EmoteAutocompleteContextValue {
  isOpen: boolean;
  suggestions: NativeEmoji[];
  activeIndex: number;
  query: string;
  listboxId: string;
  getOptionId: (hexcode: string) => string;
  setReferenceEl: (el: HTMLElement | null) => void;
  floatingRef: (el: HTMLElement | null) => void;
  floatingStyles: CSSProperties;
  selectSuggestion: (emoji: NativeEmoji) => void;
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
  onSelect?: (emoji: NativeEmoji, value: string) => void;
  children: ReactNode;
}

function Root({ onSelect, children }: EmoteAutocompleteRootProps) {
  const { emojis } = useEmoteContext();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputValueRef = useRef("");
  const baseId = useId();
  const listboxId = `${baseId}-listbox`;
  const getOptionId = useCallback(
    (hexcode: string) => `${baseId}-option-${hexcode}`,
    [baseId],
  );

  const { refs, floatingStyles } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "top-start",
    middleware: [offset(4), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  const suggestions = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return emojis
      .filter(
        (e) =>
          e.shortcodes.some((s) => s.includes(q)) ||
          e.label.toLowerCase().includes(q),
      )
      .slice(0, MAX_SUGGESTIONS);
  }, [emojis, query]);

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
    (emoji: NativeEmoji) => {
      const newValue = inputValueRef.current.replace(
        TRIGGER_PATTERN,
        emoji.unicode,
      );
      inputValueRef.current = newValue;
      setIsOpen(false);
      setQuery("");
      onSelect?.(emoji, newValue);
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
 * `onSelect(emoji, value)` callback.
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
  const activeDescendant =
    expanded && suggestions[activeIndex]
      ? getOptionId(suggestions[activeIndex].hexcode)
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
        "font-semibold p-2.5 rounded-lg border-[0.5px] border-em-border bg-em-bg",
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
        "border rounded-lg border-em-border bg-em-bg p-2",
        className,
      )}
    >
      {suggestions.map((emoji, index) => (
        <button
          key={emoji.hexcode}
          id={getOptionId(emoji.hexcode)}
          role="option"
          type="button"
          aria-selected={index === activeIndex}
          title={emoji.label}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => selectSuggestion(emoji)}
          className={cn(
            "inline-flex items-center justify-center text-2xl rounded-md",
            "cursor-pointer select-none h-fit p-0.5 transition-colors",
            index === activeIndex ? "bg-em-hover" : "hover:bg-em-hover",
          )}
        >
          {emoji.unicode}
        </button>
      ))}
    </div>
  );
}

// ─── Namespace export ─────────────────────────────────────────────────────────

export const EmoteAutocomplete = { Root, Input, Content, List };
