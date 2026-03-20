import { CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/cn';

const badgeVariants = {
  default: 'bg-slate-100 text-slate-700 border-slate-200',
  verified: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  featured: 'bg-amber-50 text-amber-700 border-amber-200',
  new: 'bg-blue-50 text-blue-700 border-blue-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  error: 'bg-red-50 text-red-700 border-red-200',
};

const badgeIcons = {
  verified: ShieldCheck,
  featured: Sparkles,
  new: CheckCircle2,
};

export default function Badge({ variant = 'default', className, children }) {
  const Icon = badgeIcons[variant];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold',
        badgeVariants[variant] || badgeVariants.default,
        className,
      )}
    >
      {Icon ? <Icon size={12} aria-hidden /> : null}
      {children}
    </span>
  );
}

