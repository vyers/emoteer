<script lang="ts">
  import { setReactionButtonContext } from './context.svelte.js';
  import type { ReactionButtonRootProps } from './types.js';

  let { onSelect, class: className, children }: ReactionButtonRootProps = $props();

  setReactionButtonContext({
    get onSelect() {
      return onSelect;
    },
  });
</script>

<div data-scope="reaction-button" data-part="root" class={className}>
  {@render children()}
</div>
