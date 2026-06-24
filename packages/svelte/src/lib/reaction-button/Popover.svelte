<script lang="ts">
  import * as popover from '@zag-js/popover';
  import { normalizeProps, useMachine } from '@zag-js/svelte';
  import { setReactionButtonPopoverContext } from './popover-context.svelte.js';
  import type { ReactionButtonPopoverProps } from './types.js';

  let { open, onOpenChange, children }: ReactionButtonPopoverProps = $props();

  const id = $props.id();
  const service = useMachine(popover.machine, () => ({
    id,
    portalled: true,
    closeOnInteractOutside: true,
    open,
    onOpenChange,
  }));
  const api = $derived(popover.connect(service, normalizeProps));

  setReactionButtonPopoverContext({
    get api() {
      return api;
    },
  });
</script>

{@render children()}
