import { textToEmoji } from "@emoteer/core";
import { cn } from "../internal/cn.js";
import {
  useCallback,
  useRef,
  type ChangeEvent,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { useEmoteContext } from "../provider.js";

// ─── Input ────────────────────────────────────────────────────────────────────

export interface EmoteInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

/**
 * Text input that expands `:shortcode:` to its unicode emoji as the user types.
 *
 * Uncontrolled by design: the component mutates the DOM value after a
 * conversion and re-emits the change via `onChange`. Use `defaultValue`, not
 * `value`, and read updates through `onChange(e)` — `e.target.value` already
 * contains the converted text.
 */
export function EmoteInput({ onChange, className, ...props }: EmoteInputProps) {
  const { shortcodeIndex } = useEmoteContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const original = e.target.value;
      const converted = textToEmoji(original, shortcodeIndex);
      if (converted !== original && inputRef.current) {
        const pos = inputRef.current.selectionStart ?? original.length;
        const newPos = Math.max(0, pos + (converted.length - original.length));
        inputRef.current.value = converted;
        inputRef.current.setSelectionRange(newPos, newPos);
        e.target.value = converted;
      }
      onChange?.(e);
    },
    [shortcodeIndex, onChange],
  );

  return (
    <input
      ref={inputRef}
      type="text"
      onChange={handleChange}
      className={cn(
        "font-semibold p-2.5 rounded-lg border-[0.5px] border-em-border bg-em-bg",
        "focus:outline-hidden focus:ring-2 focus:ring-em-primary",
        className,
      )}
      {...props}
    />
  );
}

// ─── TextArea ─────────────────────────────────────────────────────────────────

export interface EmoteTextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

/**
 * Textarea that expands `:shortcode:` to its unicode emoji as the user types.
 *
 * Uncontrolled by design: see {@link EmoteInput} for details. Use
 * `defaultValue`, not `value`, and read the converted text from `onChange(e)`.
 */
export function EmoteTextArea({
  onChange,
  className,
  ...props
}: EmoteTextAreaProps) {
  const { shortcodeIndex } = useEmoteContext();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      const original = e.target.value;
      const converted = textToEmoji(original, shortcodeIndex);
      if (converted !== original && textareaRef.current) {
        const pos = textareaRef.current.selectionStart ?? original.length;
        const newPos = Math.max(0, pos + (converted.length - original.length));
        textareaRef.current.value = converted;
        textareaRef.current.setSelectionRange(newPos, newPos);
        e.target.value = converted;
      }
      onChange?.(e);
    },
    [shortcodeIndex, onChange],
  );

  return (
    <textarea
      ref={textareaRef}
      onChange={handleChange}
      className={cn(
        "font-semibold p-2.5 rounded-lg border-[0.5px] border-em-border bg-em-bg",
        "focus:outline-hidden focus:ring-2 focus:ring-em-primary",
        "resize-y",
        className,
      )}
      cols={40}
      rows={5}
      {...props}
    />
  );
}
