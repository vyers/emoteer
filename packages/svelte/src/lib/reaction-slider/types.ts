import type { Snippet } from 'svelte';

export interface ReactionSliderRootProps {
  value: number;
  onChange: (value: number) => void;
  /** Callback triggered when the user finishes dragging the slider. */
  onChangeEnd?: (value: number) => void;
  min?: number;
  max?: number;
  /** Accessible label for screen readers. Defaults to "Reaction intensity". */
  ariaLabel?: string;
  class?: string;
  /** Emoji to display on the thumb. */
  emoji?: string;
  /** Whether to show a burst animation on release. Defaults to true. */
  burst?: boolean;
  /** Whether to dynamically scale the thumb as its value increases. Defaults to true. */
  scaleEffect?: boolean;
  children?: Snippet;
}

export interface ReactionSliderTrackProps {
  class?: string;
  children?: Snippet;
}

export interface ReactionSliderRangeProps {
  class?: string;
}

export interface ReactionSliderThumbProps {
  class?: string;
  children?: Snippet;
}

export interface ReactionSliderMarkerProps {
  class?: string;
  /** Render snippet receiving the current value. */
  children?: Snippet<[number]>;
}
