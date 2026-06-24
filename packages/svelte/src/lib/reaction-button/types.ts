import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';

/** Structural shape of the Zag popover open-change details. */
export interface OpenChangeDetails {
  open: boolean;
}

export interface ReactionButtonRootProps {
  onSelect?: (emoji: string) => void;
  class?: string;
  children: Snippet;
}

export interface ReactionButtonItemProps
  extends Omit<HTMLButtonAttributes, 'class'> {
  /** The emoji character to display. */
  emoji: string;
  /** Accessible label. Defaults to the emoji character. */
  label?: string;
  class?: string;
  /** Whether to show a burst animation on click. Defaults to false. */
  burst?: boolean;
}

export interface ReactionButtonDividerProps {
  class?: string;
}

export interface ReactionButtonPlusProps extends HTMLButtonAttributes {
  class?: string;
}

export interface ReactionButtonStickerProps {
  /** The emoji to trigger when clicking this sticker. Defaults to "❤️". */
  emoji?: string;
  /** Click handler to open a picker or perform an action. */
  onClick?: () => void;
  class?: string;
  /** Custom content, defaults to the emoji prop. */
  children?: Snippet;
  /** Whether to show a burst animation on click. Defaults to true. */
  burst?: boolean;
}

export interface ReactionButtonPopoverProps {
  /** Whether the popover is open. */
  open?: boolean;
  /** Callback when the open state changes. */
  onOpenChange?: (details: OpenChangeDetails) => void;
  children: Snippet;
}

export interface ReactionButtonTriggerProps {
  /** Custom trigger content. Defaults to a "+" icon. */
  children?: Snippet;
}

export interface ReactionButtonContentProps {
  /** The content of the popover, typically an EmoteListPicker. */
  children: Snippet;
  /** Custom class for the popover content wrapper. */
  class?: string;
}
