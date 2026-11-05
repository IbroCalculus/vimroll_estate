import { useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Heart, Scale, X, ArrowUpRight } from 'lucide-react';
import { Button } from '../common/Button';

export function MobileDrawer({
  isOpen,
  onClose,
  navItems,
  savedCount,
  compareCount,
  onOpenCompare,
}) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
          className="fixed inset-0 z-50 lg:hidden"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#171816]/75 backdrop-blur-xs"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-10 flex w-full max-w-sm flex-col justify-between border-l border-[#B69A69]/25 bg-[#171816] px-7 py-6 text-[#F7F5F0]"
          >
            <div>
              <div className="flex items-center justify-between border-b border-[#F7F5F0]/10 pb-6">
                <Link to="/" onClick={onClose} className="flex flex-col">
                  <span className="font-serif text-2xl tracking-[0.22em] text-[#F7F5F0]">
                    VIMROLL
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.38em] text-[#B69A69]">
                    Estate
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close navigation menu"
                  className="flex h-10 w-10 items-center justify-center border border-[#F7F5F0]/20 text-[#F7F5F0] transition-colors hover:border-[#B69A69] hover:text-[#B69A69]"
                >
                  <X className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>

              <nav aria-label="Mobile primary" className="mt-8 flex flex-col space-y-4">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center justify-between border-b border-[#F7F5F0]/8 pb-3.5 font-serif text-2xl transition-colors ${
                        isActive ? 'text-[#B69A69]' : 'text-[#F7F5F0] hover:text-[#B69A69]'
                      }`
                    }
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="h-4 w-4 opacity-60" strokeWidth={1.5} />
                  </NavLink>
                ))}
              </nav>

              <div className="mt-8 grid grid-cols-2 gap-3">
                <Link
                  to="/saved"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 border border-[#F7F5F0]/15 py-3 text-xs uppercase tracking-[0.16em] text-[#F7F5F0] transition-colors hover:border-[#B69A69]"
                >
                  <Heart className="h-3.5 w-3.5 text-[#B69A69]" strokeWidth={1.5} />
                  <span>Saved ({savedCount})</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenCompare();
                  }}
                  className="flex items-center justify-center gap-2 border border-[#F7F5F0]/15 py-3 text-xs uppercase tracking-[0.16em] text-[#F7F5F0] transition-colors hover:border-[#B69A69]"
                >
                  <Scale className="h-3.5 w-3.5 text-[#B69A69]" strokeWidth={1.5} />
                  <span>Compare ({compareCount})</span>
                </button>
              </div>
            </div>

            <div className="border-t border-[#F7F5F0]/10 pt-6">
              <p className="mb-4 text-[11px] uppercase tracking-[0.22em] text-[#E8E1D5]/65">
                Private Client Desk
              </p>
              <Button
                variant="gold"
                to="/contact"
                onClick={onClose}
                className="w-full"
              >
                Enquire Privately
              </Button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

