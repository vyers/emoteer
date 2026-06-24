import type { HTMLInputAttributes, HTMLTextareaAttributes } from 'svelte/elements';

export interface EmoteInputProps extends Omit<HTMLInputAttributes, 'value'> {
  /** Bindable text value. Always holds the already-converted text. */
  value?: string;
  class?: string;
  /** Exposes the underlying `<input>` element (bindable). */
  element?: HTMLInputElement | null;
}

export interface EmoteTextAreaProps extends Omit<HTMLTextareaAttributes, 'value'> {
  /** Bindable text value. Always holds the already-converted text. */
  value?: string;
  class?: string;
  /** Exposes the underlying `<textarea>` element (bindable). */
  element?: HTMLTextAreaElement | null;
}
