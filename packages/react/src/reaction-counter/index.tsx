import { cn } from "../internal/cn.js";
import type { MouseEvent } from "react";

export interface Reaction {
  emoji: string;
  count: number;
  active: boolean;
}

export interface ReactionCounterProps {
  reactions: Reaction[];
  onToggle?: (emoji: string, active: boolean) => void;
  className?: string;
}

export function ReactionCounter({
  reactions,
  onToggle,
  className,
}: ReactionCounterProps) {
  const handleClick = (
    e: MouseEvent<HTMLButtonElement>,
    reaction: Reaction,
  ) => {
    e.preventDefault();
    onToggle?.(reaction.emoji, !reaction.active);
  };

  return (
    <div
      role="group"
      aria-label="Reactions"
      className={cn("flex flex-wrap gap-1", className)}
    >
      {reactions.map((reaction) => (
        <button
          key={reaction.emoji}
          type="button"
          aria-label={`${reaction.emoji} ${reaction.count} reaction${reaction.count !== 1 ? "s" : ""}${reaction.active ? ", you reacted" : ""}`}
          aria-pressed={reaction.active}
          onClick={(e) => handleClick(e, reaction)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-(--em-radius-reaction-chip) border-(length:--em-border-width-reaction-chip)",
            "px-2 py-0.5 text-sm cursor-pointer select-none transition-colors",
            "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-em-primary",
            reaction.active
              ? "border-em-primary bg-em-active text-em-fg font-semibold"
              : "border-(--em-border-reaction-chip) bg-(--em-bg-reaction-chip) text-em-muted hover:bg-em-hover hover:text-em-fg",
          )}
        >
          <span aria-hidden="true">{reaction.emoji}</span>
          <span>{reaction.count}</span>
        </button>
      ))}
    </div>
  );
}
