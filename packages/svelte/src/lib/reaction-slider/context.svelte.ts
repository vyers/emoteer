import type * as slider from '@zag-js/slider';
import { getContext, setContext } from 'svelte';

type SliderApi = ReturnType<typeof slider.connect>;

const REACTION_SLIDER_KEY = Symbol('emoteer.reaction-slider');

export interface ReactionSliderContextValue {
  readonly api: SliderApi;
  readonly emoji?: string;
  readonly burst?: boolean;
  readonly min: number;
  readonly max: number;
  readonly scaleEffect: boolean;
}

export function setReactionSliderContext(
  value: ReactionSliderContextValue,
): ReactionSliderContextValue {
  return setContext(REACTION_SLIDER_KEY, value);
}

export function useReactionSliderContext(): ReactionSliderContextValue {
  const ctx = getContext<ReactionSliderContextValue | undefined>(
    REACTION_SLIDER_KEY,
  );
  if (!ctx) {
    throw new Error(
      'ReactionSlider subcomponents must be inside <ReactionSlider.Root>',
    );
  }
  return ctx;
}
