<script lang="ts">
  import Grid from './Grid.svelte';
  import Preview from './Preview.svelte';
  import Root from './Root.svelte';
  import Search from './Search.svelte';
  import Tabs from './Tabs.svelte';
  import type { EmoteListPickerProps } from './types.js';

  let { onSelect, class: className }: EmoteListPickerProps = $props();
</script>

<Root {onSelect} class={className}>
  <Search />
  <Tabs />
  <Grid />
  <Preview />
</Root>
