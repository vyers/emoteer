import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/vite-plugin-svelte').Config} */
export default {
  // `vitePreprocess` lets components author `<script lang="ts">` and modern CSS.
  // `svelte-package` and `svelte-check` both read this config.
  preprocess: vitePreprocess(),
};
