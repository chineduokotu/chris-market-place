import { useMemo, useRef } from 'react';
import { cn } from '../../lib/cn';

export default function Tabs({ tabs, value, onChange, className }) {
  const tabRefs = useRef([]);
  const activeIndex = useMemo(
    () => Math.max(tabs.findIndex((tab) => tab.value === value), 0),
    [tabs, value],
  );

  const focusAt = (index) => {
    const nextIndex = (index + tabs.length) % tabs.length;
    const tab = tabs[nextIndex];
    if (!tab?.disabled) {
      onChange(tab.value);
      tabRefs.current[nextIndex]?.focus();
      return;
    }
    focusAt(nextIndex + 1);
  };

  const onKeyDown = (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      focusAt(activeIndex + 1);
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      focusAt(activeIndex - 1);
    }
    if (event.key === 'Home') {
      event.preventDefault();
      focusAt(0);
    }
    if (event.key === 'End') {
      event.preventDefault();
      focusAt(tabs.length - 1);
    }
  };

  return (
    <div className={cn('rounded-[var(--radius-control)] bg-slate-100 p-1', className)}>
      <div role="tablist" aria-orientation="horizontal" className="flex gap-1" onKeyDown={onKeyDown}>
        {tabs.map((tab, index) => {
          const isActive = tab.value === value;
          return (
            <button
              key={tab.value}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.value}`}
              id={`tab-${tab.value}`}
              disabled={tab.disabled}
              onClick={() => onChange(tab.value)}
              className={cn(
                'min-h-10 flex-1 rounded-[10px] px-3 text-sm font-semibold transition-colors',
                'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color-mix(in_srgb,var(--color-primary)_22%,white)]',
                isActive
                  ? 'bg-white text-[var(--color-text)] shadow-[0_2px_12px_rgba(37,99,235,0.14)]'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-text)]',
                tab.disabled ? 'cursor-not-allowed opacity-50' : '',
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
