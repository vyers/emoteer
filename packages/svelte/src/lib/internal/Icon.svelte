<script lang="ts">
  import { Icons, type IconName } from '@emoteer/core';
  import type { SVGAttributes } from 'svelte/elements';

  interface Props extends SVGAttributes<SVGElement> {
    name: IconName;
    size?: number;
  }

  let { name, size = 16, width, height, ...rest }: Props = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  stroke-width="1.5"
  stroke="currentColor"
  width={width ?? size}
  height={height ?? size}
  aria-hidden="true"
  {...rest}
>
  <path stroke-linecap="round" stroke-linejoin="round" d={Icons[name]} />
</svg>
