<script lang="ts">
  import { useScrollAreaContext } from './context.svelte.js';
  import type { ScrollAreaThumbProps } from './types.js';

  let { orientation = 'vertical', class: className }: ScrollAreaThumbProps = $props();

  const getApi = useScrollAreaContext();
  const api = $derived(getApi());
</script>

<div {...api.getThumbProps({ orientation })} class={className}></div>
