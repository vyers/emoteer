import { getContext, setContext } from 'svelte';

const REACTION_BUTTON_KEY = Symbol('emoteer.reaction-button');

export interface ReactionButtonContextValue {
  onSelect?: (emoji: string) => void;
}

export function setReactionButtonContext(
  value: ReactionButtonContextValue,
): ReactionButtonContextValue {
  return setContext(REACTION_BUTTON_KEY, value);
}

/** Optional — returns an empty context outside a `<ReactionButton.Root>`. */
export function useReactionButtonContext(): ReactionButtonContextValue {
  return getContext<ReactionButtonContextValue | undefined>(REACTION_BUTTON_KEY) ?? {};
}
