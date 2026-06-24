<script lang="ts">
  import type { Particle } from './burst.svelte.js';

  interface Props {
    particles: Particle[];
    emoji: string;
    class?: string;
  }

  let { particles, emoji, class: className }: Props = $props();
</script>

{#each particles as p (p.id)}
  <span
    data-scope="emoteer"
    data-part="burst-particle"
    class={className}
    style="--tx:{p.tx};--ty:{p.ty};"
  >
    {emoji}
  </span>
{/each}
