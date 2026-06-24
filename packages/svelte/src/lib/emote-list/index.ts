import Grid from './Grid.svelte';
import Preview from './Preview.svelte';
import Root from './Root.svelte';
import Search from './Search.svelte';
import Tabs from './Tabs.svelte';

/**
 * Compound emoji picker. Compose freely:
 *
 * ```svelte
 * <EmoteList.Root onSelect={handleSelect}>
 *   <EmoteList.Search />
 *   <EmoteList.Tabs />
 *   <EmoteList.Grid />
 *   <EmoteList.Preview />
 * </EmoteList.Root>
 * ```
 */
export const EmoteList = { Root, Search, Tabs, Grid, Preview };

export { default as EmoteListPicker } from './EmoteListPicker.svelte';

export type {
  EmoteListRootProps,
  EmoteListSearchProps,
  EmoteListTabsProps,
  EmoteListGridProps,
  EmoteListPreviewProps,
  EmoteListPickerProps,
} from './types.js';
