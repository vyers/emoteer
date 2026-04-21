import { cn } from "../internal/cn.js";
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
      <div className={cn("flex items-center gap-1", className)}>{children}</div>
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
      {...props}
      onClick={handleClick}
      className={cn(
        "relative inline-flex h-8 w-8 items-center justify-center rounded-(--em-radius-reaction-item) border-(length:--em-border-width-reaction-item) border-(--em-border-reaction-item)",
        "bg-(--em-bg-reaction-item) text-lg transition-all hover:bg-em-hover hover:border-em-fg/20 active:scale-95",
        "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-em-primary select-none cursor-pointer",
        className,
      )}
    >
      <BurstParticles particles={particles} emoji={emoji} className="text-lg" />
      <span className="relative z-20">{emoji}</span>
    </button>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────

function Divider({ className }: { className?: string }) {
  return <div className={cn("w-px h-6 bg-em-border mx-1", className)} />;
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
        ref={ref}
        {...props}
        onClick={onClick}
        className={cn(
          "inline-flex h-8 w-8 items-center justify-center rounded-(--em-radius-reaction-item) border-(length:--em-border-width-reaction-item) border-(--em-border-reaction-item)",
          "bg-(--em-bg-reaction-item) text-em-muted transition-all hover:bg-em-hover hover:border-em-fg/20 active:scale-95",
          "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-em-primary",
          className,
        )}
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
    <div className={cn("relative inline-block", className)}>
      <BurstParticles particles={particles} emoji={emoji} className="text-xl" />

      <button
        type="button"
        aria-label={`React with ${emoji}`}
        onClick={handleClick}
        className={cn(
          "group relative flex h-12 w-12 items-center justify-center rounded-full",
          "border-(length:--em-border-width-reaction-sticker) border-(--em-border-reaction-sticker) bg-(--em-bg-reaction-sticker) text-2xl shadow-lg transition-all",
          "hover:scale-110 hover:-rotate-3 active:scale-95",
          "focus-visible:outline-hidden focus-visible:ring-2 select-none cursor-pointer focus-visible:ring-em-primary",
        )}
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
    <Plus className="border-transparent bg-transparent text-em-fg hover:bg-em-hover hover:border-transparent rounded-full w-10 h-10 transition-all" />
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
      <div {...api.getPositionerProps()} className="z-50">
        <div
          {...api.getContentProps()}
          className={cn(
            "overflow-hidden animate-in fade-in zoom-in-95 duration-200",
            className,
          )}
        >
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
