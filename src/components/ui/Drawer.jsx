import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn';

export default function Drawer({ isOpen, onClose, title, children, className }) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/35 md:hidden" role="dialog" aria-modal="true">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default"
        aria-label="Close drawer backdrop"
      />
      <div
        className={cn(
          'absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-[24px] border border-[var(--color-border)] bg-white p-5 shadow-2xl',
          className,
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-[var(--color-text)]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[var(--color-muted)] hover:bg-slate-100"
            aria-label="Close drawer"
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

