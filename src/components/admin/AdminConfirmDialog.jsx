import Button from '../ui/Button';

export default function AdminConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'primary',
  loading = false,
  onConfirm,
  onCancel,
  children,
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.24)]">
        <div className="mb-6">
          <h3 className="text-xl font-black text-slate-900">{title}</h3>
          {description ? <p className="mt-2 text-sm text-slate-500">{description}</p> : null}
        </div>
        {children ? <div className="mb-6">{children}</div> : null}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant={confirmVariant} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
