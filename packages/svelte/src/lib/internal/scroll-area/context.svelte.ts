import type * as scrollArea from '@zag-js/scroll-area';
import { getContext, setContext } from 'svelte';

type ScrollAreaApi = ReturnType<typeof scrollArea.connect>;

const SCROLL_AREA_KEY = Symbol('emoteer.scroll-area');

/**
 * The api is shared as a getter so subcomponents always read the latest
 * `$derived` connect() result from the Root.
 */
export function setScrollAreaContext(getApi: () => ScrollAreaApi): () => ScrollAreaApi {
  return setContext(SCROLL_AREA_KEY, getApi);
}

export function useScrollAreaContext(): () => ScrollAreaApi {
  const getApi = getContext<(() => ScrollAreaApi) | undefined>(SCROLL_AREA_KEY);
  if (!getApi) {
    throw new Error('ScrollArea subcomponents must be inside <ScrollArea.Root>');
  }
  return getApi;
}
