import { AlertTriangle } from 'lucide-react';
import Button from '../ui/Button';

function getMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    'Something went wrong while loading this admin module.'
  );
}

export default function AdminErrorState({ error, onRetry }) {
  return (
    <div className="rounded-[28px] border border-red-200 bg-red-50/80 p-6 shadow-[0_18px_40px_rgba(185,28,28,0.08)]">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-red-600">
          <AlertTriangle size={20} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-black text-red-700">This section could not load</h3>
          <p className="mt-2 text-sm text-red-600">{getMessage(error)}</p>
          {onRetry ? (
            <div className="mt-4">
              <Button variant="secondary" onClick={onRetry}>
                Try again
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
