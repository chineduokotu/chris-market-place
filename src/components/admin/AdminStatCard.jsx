import { Card, CardBody } from '../ui';
import { cn } from '../../lib/cn';

const toneClasses = {
  primary: 'bg-slate-900 text-white shadow-[0_20px_40px_rgba(15,23,42,0.26)]',
  warm: 'bg-amber-50 text-amber-900',
  cool: 'bg-sky-50 text-sky-900',
  success: 'bg-emerald-50 text-emerald-900',
};

export default function AdminStatCard({ label, value, icon: Icon, tone = 'primary', meta }) {
  return (
    <Card className={cn('overflow-hidden border-transparent', toneClasses[tone] || toneClasses.primary)}>
      <CardBody className="p-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className={cn('text-xs font-black uppercase tracking-[0.24em]', tone === 'primary' ? 'text-white/70' : 'text-current/70')}>
              {label}
            </p>
            <p className="mt-3 text-3xl font-black tracking-tight">{value}</p>
          </div>
          {Icon ? (
            <div className={cn('flex h-11 w-11 items-center justify-center rounded-2xl', tone === 'primary' ? 'bg-white/12' : 'bg-white/75')}>
              <Icon size={20} />
            </div>
          ) : null}
        </div>
        {meta ? <p className={cn('text-sm', tone === 'primary' ? 'text-white/74' : 'text-current/75')}>{meta}</p> : null}
      </CardBody>
    </Card>
  );
}
