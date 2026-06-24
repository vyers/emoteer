import Marker from './Marker.svelte';
import Range from './Range.svelte';
import Root from './Root.svelte';
import Thumb from './Thumb.svelte';
import Track from './Track.svelte';

/**
 * Intensity slider built on the `@zag-js/slider` machine, with an emoji thumb
 * that scales with the value and a value marker that appears while dragging.
 *
 * ```svelte
 * <ReactionSlider.Root value={v} onChange={(n) => (v = n)} emoji="🔥">
 *   <ReactionSlider.Track>
 *     <ReactionSlider.Range />
 *   </ReactionSlider.Track>
 *   <ReactionSlider.Thumb>
 *     <ReactionSlider.Marker>
 *       {#snippet children(value)}{Math.round(value)}%{/snippet}
 *     </ReactionSlider.Marker>
 *   </ReactionSlider.Thumb>
 * </ReactionSlider.Root>
 * ```
 */
export const ReactionSlider = {
  Root,
  Track,
  Range,
  Thumb,
  Marker,
};

export type {
  ReactionSliderRootProps,
  ReactionSliderTrackProps,
  ReactionSliderRangeProps,
  ReactionSliderThumbProps,
  ReactionSliderMarkerProps,
} from './types.js';
