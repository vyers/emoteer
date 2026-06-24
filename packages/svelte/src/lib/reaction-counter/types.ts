export interface Reaction {
  emoji: string;
  count: number;
  active: boolean;
}

export interface ReactionCounterProps {
  reactions: Reaction[];
  onToggle?: (emoji: string, active: boolean) => void;
  class?: string;
}
