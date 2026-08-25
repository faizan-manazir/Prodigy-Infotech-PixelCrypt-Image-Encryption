'use client';

import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export type ToastState = { type: 'success' | 'error'; message: string } | null;

export default function Toast({ toast, onClose }: { toast: ToastState; onClose: () => void }) {
  if (!toast) return null;
  const success = toast.type === 'success';

  return (
    <div className="fixed bottom-5 right-5 z-[100] max-w-sm animate-in slide-in-from-bottom-3 fade-in duration-300">
      <div className={`glass-panel flex items-start gap-3 rounded-xl border p-4 shadow-2xl ${success ? 'border-success/40' : 'border-danger/40'}`}>
        {success ? <CheckCircle2 className="mt-0.5 h-5 w-5 text-success" /> : <AlertCircle className="mt-0.5 h-5 w-5 text-danger" />}
        <p className="flex-1 text-sm text-white">{toast.message}</p>
        <button onClick={onClose} className="text-muted hover:text-white" aria-label="Close notification">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
