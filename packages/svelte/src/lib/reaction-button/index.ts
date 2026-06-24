import Content from './Content.svelte';
import Divider from './Divider.svelte';
import Item from './Item.svelte';
import Plus from './Plus.svelte';
import Popover from './Popover.svelte';
import Root from './Root.svelte';
import Sticker from './Sticker.svelte';
import Trigger from './Trigger.svelte';

/**
 * Composable reaction bar with item buttons, a divider, and an optional popover
 * trigger for an emoji picker.
 *
 * ```svelte
 * <ReactionButton.Root onSelect={addReaction}>
 *   <ReactionButton.Item emoji="👍" />
 *   <ReactionButton.Item emoji="🎉" burst />
 *   <ReactionButton.Divider />
 *   <ReactionButton.Popover>
 *     <ReactionButton.Trigger />
 *     <ReactionButton.Content>
 *       <EmoteListPicker />
 *     </ReactionButton.Content>
 *   </ReactionButton.Popover>
 * </ReactionButton.Root>
 * ```
 */
export const ReactionButton = {
  Root,
  Item,
  Plus,
  Sticker,
  Popover,
  Trigger,
  Content,
  Divider,
};

export type {
  ReactionButtonRootProps,
  ReactionButtonItemProps,
  ReactionButtonPlusProps,
  ReactionButtonStickerProps,
  ReactionButtonPopoverProps,
  ReactionButtonTriggerProps,
  ReactionButtonContentProps,
  ReactionButtonDividerProps,
} from './types.js';
