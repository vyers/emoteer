import type { Action } from 'svelte/action';

/**
 * Svelte action that relocates an element to another DOM node (default
 * `document.body`). Used to portal floating content (autocomplete suggestions,
 * popover positioner) out of the local stacking/overflow context, the same role
 * Zag's `<Portal>` plays in the React package.
 *
 * Actions never run during SSR, so this is safe in server-rendered apps.
 */
export const portal: Action<HTMLElement, HTMLElement | string | undefined> = (
  node,
  target = 'body',
) => {
  let current: HTMLElement | null = null;

  function mount(to: HTMLElement | string | undefined) {
    current =
      typeof to === 'string'
        ? document.querySelector<HTMLElement>(to)
        : (to ?? document.body);
    current?.appendChild(node);
  }

  mount(target);

  return {
    update(to: HTMLElement | string | undefined) {
      mount(to);
    },
    destroy() {
      node.remove();
    },
  };
};
