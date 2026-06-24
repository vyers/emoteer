import type * as popover from '@zag-js/popover';
import { getContext, setContext } from 'svelte';

type PopoverApi = ReturnType<typeof popover.connect>;

const REACTION_BUTTON_POPOVER_KEY = Symbol('emoteer.reaction-button.popover');

export interface ReactionButtonPopoverContextValue {
  readonly api: PopoverApi;
}

export function setReactionButtonPopoverContext(
  value: ReactionButtonPopoverContextValue,
): ReactionButtonPopoverContextValue {
  return setContext(REACTION_BUTTON_POPOVER_KEY, value);
}

export function useReactionButtonPopoverContext(): ReactionButtonPopoverContextValue {
  const ctx = getContext<ReactionButtonPopoverContextValue | undefined>(
    REACTION_BUTTON_POPOVER_KEY,
  );
  if (!ctx) {
    throw new Error(
      'ReactionButton subcomponents must be inside <ReactionButton.Popover>',
    );
  }
  return ctx;
}
