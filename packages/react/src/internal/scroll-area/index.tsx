import { cn } from "../cn.js";
import { normalizeProps, useMachine } from "@zag-js/react";
import * as scrollArea from "@zag-js/scroll-area";
import React, {
  createContext,
  forwardRef,
  ReactNode,
  useContext,
  useId,
} from "react";

// ─── Context ──────────────────────────────────────────────────────────────────

interface ScrollAreaContextValue {
  api: ReturnType<typeof scrollArea.connect>;
}

const ScrollAreaContext = createContext<ScrollAreaContextValue | null>(null);

function useScrollAreaContext() {
  const ctx = useContext(ScrollAreaContext);
  if (!ctx) {
    throw new Error(
      "ScrollArea subcomponents must be inside <ScrollArea.Root>",
    );
  }
  return ctx;
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export interface ScrollAreaRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

function Root({
  children,
  className,
  style,
  ...props
}: ScrollAreaRootProps) {
  const service = useMachine(scrollArea.machine, { id: useId() });
  const api = scrollArea.connect(service, normalizeProps);
  const rootProps = api.getRootProps();

  return (
    <ScrollAreaContext.Provider value={{ api }}>
      <div
        {...rootProps}
        {...props}
        style={{ ...rootProps.style, ...style }}
        className={cn("relative overflow-hidden bg-transparent", className)}
      >
        {children}
      </div>
    </ScrollAreaContext.Provider>
  );
}

// ─── Viewport ─────────────────────────────────────────────────────────────────

export interface ScrollAreaViewportProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

const Viewport = forwardRef<HTMLDivElement, ScrollAreaViewportProps>(
  ({ children, className, style, onScroll, ...props }, ref) => {
    const { api } = useScrollAreaContext();
    const viewportProps = api.getViewportProps();

    return (
      <div
        {...viewportProps}
        {...props}
        style={{ ...viewportProps.style, ...style }}
        className={cn(
          "h-full w-full rounded-[inherit] bg-transparent emoteer-scroll-viewport",
          className,
        )}
        onScroll={(e) => {
          viewportProps.onScroll?.(e);
          onScroll?.(e);
        }}
        ref={(node) => {
          // Handle both internal zag ref and external virtualizer ref
          if (typeof viewportProps.ref === "function") {
            viewportProps.ref(node);
          }
          if (typeof ref === "function") {
            ref(node);
          } else if (ref && "current" in ref) {
            ref.current = node;
          }
        }}
      >
        <div {...api.getContentProps()}>{children}</div>
      </div>
    );
  },
);

Viewport.displayName = "ScrollArea.Viewport";

// ─── Scrollbar ────────────────────────────────────────────────────────────────

export interface ScrollAreaScrollbarProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  children?: ReactNode;
}

function Scrollbar({
  orientation = "vertical",
  className,
  style,
  children,
  ...props
}: ScrollAreaScrollbarProps) {
  const { api } = useScrollAreaContext();

  if (orientation === "vertical" && !api.hasOverflowY) return null;
  if (orientation === "horizontal" && !api.hasOverflowX) return null;

  const scrollbarProps = api.getScrollbarProps({ orientation });

  return (
    <div
      {...scrollbarProps}
      {...props}
      style={{ ...scrollbarProps.style, ...style }}
      className={cn(
        "flex touch-none select-none transition-colors z-20 bg-transparent",
        orientation === "vertical" &&
          "h-full w-2 border-l border-transparent p-[1px]",
        orientation === "horizontal" &&
          "h-2 flex-col border-t border-transparent p-[1px]",
        className,
      )}
    >
      {children || <Thumb orientation={orientation} />}
    </div>
  );
}

// ─── Thumb ────────────────────────────────────────────────────────────────────

export interface ScrollAreaThumbProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

function Thumb({
  orientation = "vertical",
  className,
  ...props
}: ScrollAreaThumbProps) {
  const { api } = useScrollAreaContext();

  return (
    <div
      {...api.getThumbProps({ orientation })}
      {...props}
      className={cn(
        "relative flex-1 rounded-full bg-em-muted/30 hover:bg-em-muted/50 transition-colors",
        className,
      )}
    />
  );
}

// ─── Namespace export ─────────────────────────────────────────────────────────

export const ScrollArea = {
  Root,
  Viewport,
  Scrollbar,
  Thumb,
};
