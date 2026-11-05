import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Check, X } from 'lucide-react';
import { usePropertyStore } from '../../store/usePropertyStore';

export function ToastViewport() {
  const toasts = usePropertyStore((state) => state.toasts);
  const dismissToast = usePropertyStore((state) => state.dismissToast);
  const hasCompareTray = usePropertyStore((state) => state.compareIds.length > 0);

  return (
    <div
      aria-live="polite"
      className={`pointer-events-none fixed inset-x-4 z-50 flex flex-col items-end gap-2.5 sm:inset-x-auto sm:right-6 sm:w-96 ${
        hasCompareTray ? 'bottom-22' : 'bottom-5'
      }`}
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto flex w-full items-start justify-between gap-3 border border-[#B69A69]/50 bg-[#171816]/95 px-4 py-3.5 text-[#F7F5F0] shadow-2xl backdrop-blur-md"
          >
            <div className="flex items-start gap-3 min-w-0">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border border-[#B69A69]/50 text-[#B69A69]">
                <Check className="h-3 w-3" strokeWidth={2} />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold tracking-wide text-[#F7F5F0]">
                  {toast.title}
                </p>
                {toast.detail && (
                  <p className="mt-0.5 truncate text-xs text-[#E8E1D5]/75">
                    {toast.detail}
                  </p>
                )}
                {toast.actionLabel && toast.actionTo && (
                  <Link
                    to={toast.actionTo}
                    onClick={() => dismissToast(toast.id)}
                    className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B69A69] hover:text-[#F7F5F0]"
                  >
                    <span>{toast.actionLabel}</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="p-1 text-[#E8E1D5]/60 transition-colors hover:text-[#F7F5F0]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

