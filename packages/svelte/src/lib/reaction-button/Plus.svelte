<script lang="ts">
  import Icon from '../internal/Icon.svelte';
  import type { ReactionButtonPlusProps } from './types.js';

  let { class: className, ...rest }: ReactionButtonPlusProps = $props();
</script>

<button
  type="button"
  aria-label="Add reaction"
  data-scope="reaction-button"
  data-part="plus"
  data-emoteer-plus=""
  {...rest}
  class={className}
>
  <Icon name="plus" size={18} />
</button>
