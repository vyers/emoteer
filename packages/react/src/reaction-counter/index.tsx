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
      data-scope="reaction-counter"
      data-part="root"
      className={className}
    >
      {reactions.map((reaction) => (
        <button
          key={reaction.emoji}
          type="button"
          aria-label={`${reaction.emoji} ${reaction.count} reaction${reaction.count !== 1 ? "s" : ""}${reaction.active ? ", you reacted" : ""}`}
          aria-pressed={reaction.active}
          data-scope="reaction-counter"
          data-part="chip"
          data-active={reaction.active || undefined}
          onClick={(e) => handleClick(e, reaction)}
        >
          <span aria-hidden="true">{reaction.emoji}</span>
          <span>{reaction.count}</span>
        </button>
      ))}
    </div>
  );
}
