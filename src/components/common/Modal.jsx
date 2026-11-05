import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';

export function Modal({
  isOpen,
  onClose,
  title,
  eyebrow,
  children,
  maxWidth = 'max-w-2xl',
}) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title || 'Modal dialog'}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#171816]/75 backdrop-blur-[2px]"
          />

          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.985 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={`relative z-10 max-h-[90vh] w-full ${maxWidth} overflow-y-auto border border-[#E8E1D5] bg-[#FFFFFF] shadow-2xl`}
          >
            <div className="sticky top-0 z-20 flex items-start justify-between border-b border-[#E8E1D5] bg-[#FFFFFF] px-5 py-4 sm:px-8 sm:py-5">
              <div>
                {eyebrow && (
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#B69A69]">
                    {eyebrow}
                  </p>
                )}
                {title && (
                  <h3 className="font-serif text-xl font-normal text-[#171816] sm:text-2xl">
                    {title}
                  </h3>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#E8E1D5] text-[#41413D] transition-colors hover:border-[#171816] hover:text-[#171816]"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>

            <div className="p-4 sm:p-8">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

