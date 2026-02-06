'use client';
import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export type InfiniteSliderProps = {
  children: React.ReactNode;
  gap?: number;
  /**
   * Duration in seconds for a full loop (i.e. how long it takes to move one copy width).
   * NOTE: This version no longer measures pixels/sec — provide a duration (seconds) instead.
   */
  speed?: number;
  /**
   * Duration in seconds while hovered. If omitted, hover will pause the animation.
   */
  speedOnHover?: number;
  direction?: 'horizontal' | 'vertical';
  reverse?: boolean;
  className?: string;
};

export function InfiniteSlider({
  children,
  gap = 16,
  speed = 20,
  speedOnHover,
  direction = 'horizontal',
  reverse = false,
  className,
}: InfiniteSliderProps) {
  // unique id to scope keyframes & classes per instance
  const uidRef = useRef(`is-${Math.random().toString(36).slice(2, 9)}`);
  const uid = uidRef.current;

  // duration state (seconds). Start with `speed`.
  const [duration, setDuration] = useState<number>(speed);
  // play/pause state (used when no speedOnHover is provided)
  const [paused, setPaused] = useState(false);

  const handleMouseEnter = () => {
    if (typeof speedOnHover === 'number') {
      setDuration(speedOnHover);
      setPaused(false);
    } else {
      setPaused(true);
    }
  };

  const handleMouseLeave = () => {
    setDuration(speed);
    setPaused(false);
  };

  // CSS variables to control gap, duration and direction
  const styleVars: React.CSSProperties = {
    // CSS custom props for easier injection into the stylesheet below
    ['--is-gap' as any]: `${gap}px`,
    ['--is-duration' as any]: `${duration}s`,
    ['--is-playstate' as any]: paused ? 'paused' : 'running',
  };

  return (
    <div className={cn('overflow-hidden', className)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ position: 'relative' }}>
      <div className={`is-track-${uid} is-track ${direction} ${reverse ? 'reverse' : ''}`} style={styleVars as React.CSSProperties}>
        <div className="is-group">{children}</div>
        <div className="is-group">{children}</div>
      </div>

      <style>{`
        /* Scoped to this instance using the uid in the class names */
        .is-track-${uid}.is-track {
          display: flex;
          gap: var(--is-gap);
          align-items: center;
          /* ensure content takes its natural size and can scroll horizontally/vertically */
          width: max-content;
          /* control the animation */
          animation-name: slide-${uid};
          animation-duration: var(--is-duration);
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          animation-play-state: var(--is-playstate);
        }

        /* group holds one full set of children */
        .is-track-${uid} .is-group {
          display: flex;
          gap: var(--is-gap);
        }

        /* horizontal layout (default) */
        .is-track-${uid}.horizontal {
          flex-direction: row;
        }

        /* vertical layout */
        .is-track-${uid}.vertical {
          flex-direction: column;
        }

        /* when reversed we animate in the opposite direction */
        .is-track-${uid}.reverse.horizontal {
          /* keep layout same, inverse keyframes are provided below */
          animation-name: slide-rev-${uid};
        }
        .is-track-${uid}.reverse.vertical {
          animation-name: slide-rev-${uid};
        }

        /* Keyframes animate the track by 50% (we duplicate content) */
        @keyframes slide-${uid} {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(-50%, 0, 0);
          }
        }
        @keyframes slide-rev-${uid} {
          from {
            transform: translate3d(-50%, 0, 0);
          }
          to {
            transform: translate3d(0, 0, 0);
          }
        }

        /* For vertical mode we reuse the same animation names but override transform axis */
        .is-track-${uid}.vertical { 
          /* override the animation by providing new keyframes using same names but Y axis */
          animation-name: v-slide-${uid};
        }
        .is-track-${uid}.vertical.reverse {
          animation-name: v-slide-rev-${uid};
        }
        @keyframes v-slide-${uid} {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(0, -50%, 0); }
        }
        @keyframes v-slide-rev-${uid} {
          from { transform: translate3d(0, -50%, 0); }
          to   { transform: translate3d(0, 0, 0); }
        }

        /* Make sure duplicated content lines up nicely */
        .is-track-${uid} .is-group > * {
          /* let inner items size naturally; user may override via className */
        }

        /* Accessibility: allow pointer events inside children as normal */
        .is-track-${uid} .is-group { pointer-events: auto; }
      `}</style>
    </div>
  );
}