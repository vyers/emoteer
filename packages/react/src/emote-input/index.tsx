import { textToEmoji } from "@emoteer/core";
import { cn } from "../internal/cn.js";
import {
  useCallback,
  useLayoutEffect,
  useRef,
  type ChangeEvent,
  type InputHTMLAttributes,
  type Ref,
  type TextareaHTMLAttributes,
} from "react";
import { useEmoteContext } from "../provider.js";

function assignRef<T>(ref: Ref<T> | undefined, node: T | null) {
  if (!ref) return;
  if (typeof ref === "function") ref(node);
  else (ref as React.RefObject<T | null>).current = node;
}

// ─── Input ────────────────────────────────────────────────────────────────────

export interface EmoteInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  ref?: Ref<HTMLInputElement>;
}

/**
 * Text input that expands `:shortcode:` to its unicode emoji as the user types.
 *
 * Works in both controlled and uncontrolled modes:
 *   - Controlled: pass `value` + `onChange`. Cursor position is preserved across
 *     conversions using a layout effect.
 *   - Uncontrolled: pass `defaultValue` (or nothing). The component mutates the
 *     DOM value in place.
 *
 * In both modes, `onChange(e)` receives the already-converted text via
 * `e.target.value`.
 */
export function EmoteInput({
  value,
  defaultValue,
  onChange,
  className,
  ref,
  ...props
}: EmoteInputProps) {
  const { shortcodeIndex } = useEmoteContext();
  const internalRef = useRef<HTMLInputElement>(null);
  const pendingCursor = useRef<number | null>(null);
  const isControlled = value !== undefined;

  const setRef = useCallback(
    (node: HTMLInputElement | null) => {
      internalRef.current = node;
      assignRef(ref, node);
    },
    [ref],
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const original = e.target.value;
      const converted = textToEmoji(original, shortcodeIndex);

      if (converted !== original) {
        const cursor = e.target.selectionStart ?? original.length;
        const newCursor = Math.max(
          0,
          cursor + (converted.length - original.length),
        );
        e.target.value = converted;

        if (isControlled) {
          // In controlled mode React will reconcile value on the next render
          // and the browser will reset the cursor. Queue a restoration for the
          // useLayoutEffect pass below.
          pendingCursor.current = newCursor;
        } else {
          // In uncontrolled mode no re-render is driven by React, so restore
          // the cursor immediately against the live DOM value.
          e.target.setSelectionRange(newCursor, newCursor);
        }
      }

      onChange?.(e);
    },
    [shortcodeIndex, onChange, isControlled],
  );

  useLayoutEffect(() => {
    const el = internalRef.current;
    const cursor = pendingCursor.current;
    if (el && cursor !== null) {
      el.setSelectionRange(cursor, cursor);
      pendingCursor.current = null;
    }
  });

  return (
    <input
      ref={setRef}
      type="text"
      value={value}
      defaultValue={defaultValue}
      onChange={handleChange}
      className={cn(
        "font-semibold p-2.5 rounded-(--em-radius-input) border-(length:--em-border-width-input) border-(--em-border-input) bg-(--em-bg-input)",
        "focus:outline-hidden focus:ring-2 focus:ring-em-primary",
        className,
      )}
      {...props}
    />
  );
}

// ─── TextArea ─────────────────────────────────────────────────────────────────

export interface EmoteTextAreaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  ref?: Ref<HTMLTextAreaElement>;
}

/**
 * Textarea that expands `:shortcode:` to its unicode emoji as the user types.
 *
 * Supports both controlled (`value` + `onChange`) and uncontrolled
 * (`defaultValue` or nothing) usage. See {@link EmoteInput} for details.
 */
export function EmoteTextArea({
  value,
  defaultValue,
  onChange,
  className,
  ref,
  ...props
}: EmoteTextAreaProps) {
  const { shortcodeIndex } = useEmoteContext();
  const internalRef = useRef<HTMLTextAreaElement>(null);
  const pendingCursor = useRef<number | null>(null);
  const isControlled = value !== undefined;

  const setRef = useCallback(
    (node: HTMLTextAreaElement | null) => {
      internalRef.current = node;
      assignRef(ref, node);
    },
    [ref],
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      const original = e.target.value;
      const converted = textToEmoji(original, shortcodeIndex);

      if (converted !== original) {
        const cursor = e.target.selectionStart ?? original.length;
        const newCursor = Math.max(
          0,
          cursor + (converted.length - original.length),
        );
        e.target.value = converted;

        if (isControlled) {
          pendingCursor.current = newCursor;
        } else {
          e.target.setSelectionRange(newCursor, newCursor);
        }
      }

      onChange?.(e);
    },
    [shortcodeIndex, onChange, isControlled],
  );

  useLayoutEffect(() => {
    const el = internalRef.current;
    const cursor = pendingCursor.current;
    if (el && cursor !== null) {
      el.setSelectionRange(cursor, cursor);
      pendingCursor.current = null;
    }
  });

  return (
    <textarea
      ref={setRef}
      value={value}
      defaultValue={defaultValue}
      onChange={handleChange}
      className={cn(
        "font-semibold p-2.5 rounded-(--em-radius-textarea) border-(length:--em-border-width-textarea) border-(--em-border-textarea) bg-(--em-bg-textarea)",
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
