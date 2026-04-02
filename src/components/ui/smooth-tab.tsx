// components/ui/smooth-tab.tsx
'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface TabItem {
  id: string;
  title: string;
}

interface SmoothTabProps {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}

export function SmoothTab({
  items,
  value,
  onChange,
  className,
}: SmoothTabProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const buttonRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map());

  const [indicator, setIndicator] = React.useState({ width: 0, left: 0 });

  React.useLayoutEffect(() => {
    const activeBtn = buttonRefs.current.get(value);
    const container = containerRef.current;
    if (!activeBtn || !container) return;

    const btnRect = activeBtn.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    setIndicator({
      width: btnRect.width,
      left: btnRect.left - containerRect.left + container.scrollLeft,
    });

    // Auto‑scroll active tab into view
    activeBtn.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }, [value, items]);

  return (
    <div
      ref={containerRef}
      role="tablist"
      aria-label="Chat categories"
      className={cn(
        'fixed bottom-5 left-1/2 z-20 -translate-x-1/2',
        'w-[95%] max-w-[420px] overflow-x-auto scrollbar-none',
        'rounded-xl border bg-card/90 backdrop-blur shadow-lg',
        className
      )}
    >
      <div className="relative flex w-max items-center gap-1 px-1 py-1">
        <motion.div
          className="absolute top-1 bottom-1 rounded-lg bg-primary"
          animate={{ width: indicator.width, x: indicator.left }}
          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
        />

        {items.map((item) => {
          const isActive = item.id === value;
          return (
            <button
              key={item.id}
              ref={(el) => {
                if (el) buttonRefs.current.set(item.id, el);
                else buttonRefs.current.delete(item.id);
              }}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(item.id)}
              className={cn(
                'relative z-10 whitespace-nowrap rounded-lg px-4 py-1.5 text-sm font-medium transition-colors duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                isActive
                  ? 'text-background'
                  : 'text-muted-foreground hover:bg-muted/50'
              )}
            >
              {item.title}
            </button>
          );
        })}
      </div>
    </div>
  );
}