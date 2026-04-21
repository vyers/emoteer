import { cn } from "../internal/cn.js";
import { normalizeProps, useMachine } from "@zag-js/react";
import * as slider from "@zag-js/slider";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useId,
  useRef,
} from "react";
import { BurstParticles, useBurst } from "../internal/burst.js";

// ─── Context ──────────────────────────────────────────────────────────────────

interface ReactionSliderContextValue {
  api: ReturnType<typeof slider.connect>;
  emoji?: string;
  burst?: boolean;
  min: number;
  max: number;
  scaleEffect: boolean;
}

const ReactionSliderContext = createContext<ReactionSliderContextValue | null>(
  null,
);

function useReactionSliderContext() {
  const ctx = useContext(ReactionSliderContext);
  if (!ctx) {
    throw new Error(
      "ReactionSlider subcomponents must be inside <ReactionSlider.Root>",
    );
  }
  return ctx;
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export interface ReactionSliderRootProps {
  value: number;
  onChange: (value: number) => void;
  /** Callback triggered when the user finishes dragging the slider */
  onChangeEnd?: (value: number) => void;
  min?: number;
  max?: number;
  /** Accessible label for screen readers. Defaults to "Reaction intensity" */
  ariaLabel?: string;
  className?: string;
  /** Emoji to display on thumb. */
  emoji?: string;
  /** Whether to show a burst animation on release. Defaults to true. */
  burst?: boolean;
  /** Whether to dynamically scale the thumb as its value increases. Defaults to true. */
  scaleEffect?: boolean;
  children?: ReactNode;
}

function Root({
  value,
  onChange,
  onChangeEnd,
  min = 0,
  max = 100,
  ariaLabel = "Reaction intensity",
  className,
  emoji = "❤️",
  burst = true,
  scaleEffect = true,
  children,
}: ReactionSliderRootProps) {
  const service = useMachine(slider.machine, {
    id: useId(),
    min,
    max,
    value: [value],
    onValueChange: (details) => {
      onChange(details.value[0] ?? 0);
    },
    onValueChangeEnd: (details) => {
      onChangeEnd?.(details.value[0] ?? 0);
    },
  });

  const api = slider.connect(service, normalizeProps);

  const apiRef = useRef(api);
  apiRef.current = api;

  useEffect(() => {
    const current = apiRef.current;
    if (current.value[0] !== value) {
      current.setValue([value]);
    }
  }, [value]);

  return (
    <ReactionSliderContext.Provider
      value={{ api, emoji, burst, min, max, scaleEffect }}
    >
      <div
        {...api.getRootProps()}
        className={cn(
          "relative flex flex-col justify-center h-14 w-full rounded-full bg-em-bg shadow-sm border border-em-border",
          className,
        )}
      >
        <label {...api.getLabelProps()} className="sr-only">
          {ariaLabel}
        </label>
        <div
          {...api.getControlProps()}
          className="relative flex items-center w-full h-full px-4"
        >
          {children}
        </div>
        <input
          {...api.getHiddenInputProps({ index: 0 })}
          aria-label={ariaLabel}
        />
      </div>
    </ReactionSliderContext.Provider>
  );
}

// ─── Track ────────────────────────────────────────────────────────────────────

export interface ReactionSliderTrackProps {
  className?: string;
  children?: ReactNode;
}

function Track({ className, children }: ReactionSliderTrackProps) {
  const { api } = useReactionSliderContext();

  return (
    <div
      {...api.getTrackProps()}
      className={cn(
        "h-3 w-full bg-em-hover rounded-full overflow-hidden",
        className,
      )}
    >
      {children}
    </div>
  );
}

// ─── Range ────────────────────────────────────────────────────────────────────

export interface ReactionSliderRangeProps {
  className?: string;
}

function Range({ className }: ReactionSliderRangeProps) {
  const { api } = useReactionSliderContext();

  return (
    <div
      {...api.getRangeProps()}
      className={cn(
        "h-full bg-gradient-to-r from-rose-400 to-fuchsia-500 rounded-full",
        className,
      )}
    />
  );
}

// ─── Thumb ────────────────────────────────────────────────────────────────────

export interface ReactionSliderThumbProps {
  className?: string;
  children?: ReactNode;
}

function Thumb({ className, children }: ReactionSliderThumbProps) {
  const { api, emoji, burst, min, max, scaleEffect } =
    useReactionSliderContext();
  const { particles, trigger } = useBurst();

  const value = api.value[0] ?? 0;
  const percentage = max > min ? ((value - min) / (max - min)) * 100 : 0;
  const scale = scaleEffect ? 1 + (percentage / 100) * 1.2 : 1;

  const wasDragging = useRef(api.dragging);
  useEffect(() => {
    if (wasDragging.current && !api.dragging && burst) {
      trigger();
    }
    wasDragging.current = api.dragging;
  }, [api.dragging, burst, trigger]);

  const thumbProps = api.getThumbProps({ index: 0 });

  return (
    <div
      {...thumbProps}
      className={cn(
        "z-10 flex items-center justify-center outline-none cursor-pointer",
        "filter-[drop-shadow(0_2px_2px_rgba(0,0,0,0.35))]",
        className,
      )}
      style={{
        ...thumbProps.style,
        width: "48px",
        height: "48px",
        top: "50%",
        transform: `translate(-50%, -50%) scale(${scale})`,
        transition: "transform 75ms ease-out",
        transformOrigin: "center",
      }}
    >
      <BurstParticles particles={particles} emoji={emoji ?? ""} className="text-xl" />
      <span
        style={{
          fontSize: "1.75rem",
        }}
        className="select-none leading-none"
      >
        {emoji}
      </span>
      {children}
    </div>
  );
}

// ─── Marker ───────────────────────────────────────────────────────────────────

export interface ReactionSliderMarkerProps {
  className?: string;
  children?: (value: number) => ReactNode;
}

function Marker({ className, children }: ReactionSliderMarkerProps) {
  const { api: sliderApi, min, max, scaleEffect } = useReactionSliderContext();

  if (!sliderApi.dragging) return null;

  const value = sliderApi.value[0] ?? 0;
  const percentage = max > min ? ((value - min) / (max - min)) * 100 : 0;
  const scale = scaleEffect ? 1 + (percentage / 100) * 1.2 : 1;
  const reverseScale = 1 / scale;

  return (
    <div
      className="absolute left-1/2 bottom-full mb-2 pointer-events-none"
      style={{
        transform: `translateX(-50%) scale(${reverseScale})`,
        transformOrigin: "bottom center",
      }}
    >
      <div
        className={cn(
          "px-2 py-1 bg-em-fg text-em-bg text-xs rounded-md shadow-xl border border-em-bg/10 whitespace-nowrap",
          className,
        )}
      >
        {children
          ? children(sliderApi.value[0] ?? 0)
          : (sliderApi.value[0] ?? 0)}
      </div>
    </div>
  );
}

// ─── Namespace export ─────────────────────────────────────────────────────────

export const ReactionSlider = {
  Root,
  Track,
  Range,
  Thumb,
  Marker,
};
