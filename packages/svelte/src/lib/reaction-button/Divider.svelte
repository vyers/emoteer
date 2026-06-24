<script lang="ts">
  import type { ReactionButtonDividerProps } from './types.js';

  let { class: className }: ReactionButtonDividerProps = $props();
</script>

<div data-scope="reaction-button" data-part="divider" class={className}></div>
