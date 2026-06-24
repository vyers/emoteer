import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface ScrollAreaRootProps extends HTMLAttributes<HTMLDivElement> {
  children?: Snippet;
}

export interface ScrollAreaViewportProps extends HTMLAttributes<HTMLDivElement> {
  children?: Snippet;
  /** Exposes the scrolling viewport element (bindable). */
  element?: HTMLDivElement | null;
}

export interface ScrollAreaScrollbarProps {
  orientation?: 'horizontal' | 'vertical';
  class?: string;
  children?: Snippet;
}

export interface ScrollAreaThumbProps {
  orientation?: 'horizontal' | 'vertical';
  class?: string;
}
