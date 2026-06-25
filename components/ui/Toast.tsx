'use client';
import { useEffect, useState } from 'react';
import { CheckCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export function Toast({ message, type = 'success', onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={cn(
      'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border text-sm font-medium animate-fade-up',
      type === 'success' && 'bg-white border-green-200 text-green-800',
      type === 'error'   && 'bg-white border-red-200 text-red-800',
      type === 'info'    && 'bg-white border-brand-orange/30 text-brand-brown',
    )}>
      {type === 'success' && <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />}
      <span>{message}</span>
      <button onClick={onClose} className="ml-1 hover:opacity-60 transition-opacity">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// Simple hook
export function useToast() {
  const [toast, setToast] = useState<{ message: string; type?: 'success'|'error'|'info' } | null>(null);
  const show = (message: string, type: 'success'|'error'|'info' = 'success') => setToast({ message, type });
  const hide = () => setToast(null);
  return { toast, show, hide };
}
