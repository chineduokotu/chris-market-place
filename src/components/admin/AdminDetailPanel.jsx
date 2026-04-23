import { X } from 'lucide-react';
import { cn } from '../../lib/cn';

export default function AdminDetailPanel({ open, title, subtitle, onClose, children }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[110] bg-slate-950/35 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Close detail panel backdrop"
        className="absolute inset-0 h-full w-full cursor-default"
        onClick={onClose}
      />
      <aside
        className={cn(
          'absolute right-0 top-0 h-full w-full max-w-2xl overflow-y-auto border-l border-slate-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.24)]',
          'flex flex-col',
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/95 px-6 py-5 backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">Inspect record</p>
              <h3 className="mt-2 text-2xl font-black text-slate-950">{title}</h3>
              {subtitle ? <p className="mt-2 text-sm text-slate-500">{subtitle}</p> : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl p-3 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              aria-label="Close detail panel"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="flex-1 space-y-6 px-6 py-6">{children}</div>
      </aside>
    </div>
  );
}
