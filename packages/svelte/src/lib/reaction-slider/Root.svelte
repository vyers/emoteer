<script lang="ts">
  import * as slider from '@zag-js/slider';
  import { normalizeProps, useMachine } from '@zag-js/svelte';
  import { setReactionSliderContext } from './context.svelte.js';
  import type { ReactionSliderRootProps } from './types.js';

  let {
    value,
    onChange,
    onChangeEnd,
    min = 0,
    max = 100,
    ariaLabel = 'Reaction intensity',
    class: className,
    emoji = '❤️',
    burst = true,
    scaleEffect = true,
    children,
  }: ReactionSliderRootProps = $props();

  const id = $props.id();
  const service = useMachine(slider.machine, () => ({
    id,
    min,
    max,
    value: [value],
    onValueChange(details: { value: number[] }) {
      onChange(details.value[0] ?? 0);
    },
    onValueChangeEnd(details: { value: number[] }) {
      onChangeEnd?.(details.value[0] ?? 0);
    },
  }));

  const api = $derived(slider.connect(service, normalizeProps));

  // Keep the machine in sync with the controlled `value` prop.
  $effect(() => {
    if (api.value[0] !== value) {
      api.setValue([value]);
    }
  });

  setReactionSliderContext({
    get api() {
      return api;
    },
    get emoji() {
      return emoji;
    },
    get burst() {
      return burst;
    },
    get min() {
      return min;
    },
    get max() {
      return max;
    },
    get scaleEffect() {
      return scaleEffect;
    },
  });
</script>

<div {...api.getRootProps()} class={className}>
  <label {...api.getLabelProps()} data-emoteer-visually-hidden="">{ariaLabel}</label>
  <div {...api.getControlProps()}>
    {@render children?.()}
  </div>
  <input {...api.getHiddenInputProps({ index: 0 })} aria-label={ariaLabel} />
</div>
