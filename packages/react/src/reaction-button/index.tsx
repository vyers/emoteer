import * as popover from "@zag-js/popover";
import { mergeProps, normalizeProps, Portal, useMachine } from "@zag-js/react";
import {
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useId,
  type ReactElement,
  type ReactNode,
} from "react";
import { BurstParticles, useBurst } from "../internal/burst.js";
import { Icon } from "../internal/icon.js";

interface ReactionButtonContextValue {
  onSelect?: (emoji: string) => void;
}

const ReactionButtonContext = createContext<ReactionButtonContextValue>({});

function useReactionButtonContext() {
  return useContext(ReactionButtonContext);
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export interface ReactionButtonRootProps {
  onSelect?: (emoji: string) => void;
  className?: string;
  children: ReactNode;
}

function Root({ onSelect, className, children }: ReactionButtonRootProps) {
  return (
    <ReactionButtonContext.Provider value={{ onSelect }}>
      <div data-scope="reaction-button" data-part="root" className={className}>
        {children}
      </div>
    </ReactionButtonContext.Provider>
  );
}

// ─── Item ─────────────────────────────────────────────────────────────────────

export interface ReactionButtonItemProps {
  /** The emoji character to display. */
  emoji: string;
  /** Accessible label. Defaults to the emoji character. */
  label?: string;
  className?: string;
  /** Whether to show a burst animation on click. Defaults to false. */
  burst?: boolean;
}

function Item({
  emoji,
  label,
  className,
  burst = false,
  ...props
}: ReactionButtonItemProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className">) {
  const { onSelect } = useReactionButtonContext();
  const { particles, trigger } = useBurst({ spread: 80 });

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    props.onClick?.(e);
    onSelect?.(emoji);
    if (burst) trigger();
  };

  return (
    <button
      type="button"
      aria-label={label ?? emoji}
      data-scope="reaction-button"
      data-part="item"
      {...props}
      onClick={handleClick}
      className={className}
    >
      <BurstParticles particles={particles} emoji={emoji} />
      <span data-scope="reaction-button" data-part="item-glyph">
        {emoji}
      </span>
    </button>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────

function Divider({ className }: { className?: string }) {
  return (
    <div
      data-scope="reaction-button"
      data-part="divider"
      className={className}
    />
  );
}

// ─── Plus ─────────────────────────────────────────────────────────────────────

export interface ReactionButtonPlusProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Click handler to open a picker or perform an action. */
  onClick?: () => void;
  className?: string;
}

const Plus = forwardRef<HTMLButtonElement, ReactionButtonPlusProps>(
  function Plus({ onClick, className, ...props }, ref) {
    return (
      <button
        type="button"
        aria-label="Add reaction"
        // data-scope/data-part go BEFORE the spread so that when this is cloned
        // as a Zag popover trigger, Zag's own data-scope="popover"/
        // data-part="trigger" win — it resolves the trigger via a DOM query on
        // those attributes, so overriding them would break opening the popover.
        data-scope="reaction-button"
        data-part="plus"
        ref={ref}
        {...props}
        onClick={onClick}
        // Stable styling hook that survives the spread (and Zag's merge), so the
        // default look applies whether used standalone or as a popover trigger.
        data-emoteer-plus=""
        className={className}
      >
        <Icon name="plus" size={18} />
      </button>
    );
  },
);

// ─── Sticker ───────────────────────────────────────────────────────────────────

export interface ReactionButtonStickerProps {
  /** The emoji to trigger when clicking this sticker. Defaults to "❤️". */
  emoji?: string;
  /** Click handler to open a picker or perform an action. */
  onClick?: () => void;
  className?: string;
  /** Custom content, defaults to the emoji prop. */
  children?: ReactNode;
  /** Whether to show a burst animation on click. Defaults to true. */
  burst?: boolean;
}

/**
 * A circular floating-style button inspired by Instagram stickers.
 * Features a thicker white border, pronounced shadow, and a particle burst on click.
 */
function Sticker({
  emoji = "❤️",
  onClick,
  className,
  children,
  burst = true,
}: ReactionButtonStickerProps) {
  const { onSelect } = useReactionButtonContext();
  const { particles, trigger } = useBurst();

  const handleClick = () => {
    onClick?.();
    onSelect?.(emoji);
    if (burst) trigger();
  };

  return (
    <div
      data-scope="reaction-button"
      data-part="sticker-root"
      className={className}
    >
      <BurstParticles particles={particles} emoji={emoji} />

      <button
        type="button"
        aria-label={`React with ${emoji}`}
        data-scope="reaction-button"
        data-part="sticker"
        onClick={handleClick}
      >
        {children || emoji}
      </button>
    </div>
  );
}

// ─── Popover ───────────────────────────────────────────────────────────────────

export interface ReactionButtonPopoverProps {
  /** Whether the popover is open. */
  open?: boolean;
  /** Callback when the open state changes. */
  onOpenChange?: (details: popover.OpenChangeDetails) => void;
  children: ReactNode;
}

const ReactionButtonPopoverContext = createContext<ReturnType<
  typeof popover.connect
> | null>(null);

function useReactionButtonPopoverContext() {
  const ctx = useContext(ReactionButtonPopoverContext);
  if (!ctx) {
    throw new Error(
      "ReactionButton subcomponents must be inside <ReactionButton.Popover>",
    );
  }
  return ctx;
}

function Popover({ open, onOpenChange, children }: ReactionButtonPopoverProps) {
  const service = useMachine(popover.machine, {
    id: useId(),
    portalled: true,
    closeOnInteractOutside: true,
    open,
    onOpenChange,
  });
  const api = popover.connect(service, normalizeProps);

  return (
    <ReactionButtonPopoverContext.Provider value={api}>
      {children}
    </ReactionButtonPopoverContext.Provider>
  );
}

// ─── Trigger ───────────────────────────────────────────────────────────────────

export interface ReactionButtonTriggerProps {
  /** Custom trigger element. Defaults to ReactionButton.Plus. */
  children?: ReactElement;
}

/**
 * The trigger button for the ReactionButton popover.
 */
function Trigger({ children }: ReactionButtonTriggerProps) {
  const api = useReactionButtonPopoverContext();

  const plusButton = (
    // `data-emoteer-trigger` (not data-part) because Zag's getTriggerProps
    // overwrites data-scope/data-part when this element is cloned as the
    // popover trigger; this custom attribute survives the merge.
    <button type="button" aria-label="Add reaction" data-emoteer-trigger="">
      <Icon name="plus" size={18} />
    </button>
  );

  const triggerElement = children || plusButton;
  const { ref, ...triggerProps } = api.getTriggerProps();

  if (
    isValidElement<
      React.HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement>
    >(triggerElement)
  ) {
    return cloneElement(triggerElement, {
      ...mergeProps(triggerElement.props, triggerProps),
      ref, // Explicitly provide ref for React 19 compatibility
    });
  }

  return triggerElement;
}

// ─── Content ───────────────────────────────────────────────────────────────────

export interface ReactionButtonContentProps {
  /** The content of the popover, typically an EmoteList. */
  children: ReactNode;
  /** Custom class for the popover content wrapper. */
  className?: string;
}

/**
 * The content of the ReactionButton popover.
 */
function Content({ children, className }: ReactionButtonContentProps) {
  const api = useReactionButtonPopoverContext();

  if (!api.open) return null;

  return (
    <Portal>
      <div {...api.getPositionerProps()} data-emoteer-positioner="">
        <div {...api.getContentProps()} className={className}>
          {children}
        </div>
      </div>
    </Portal>
  );
}

// ─── Namespace export ─────────────────────────────────────────────────────────

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
