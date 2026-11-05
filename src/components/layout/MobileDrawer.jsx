import { useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Heart, Scale, Search, X, ArrowUpRight } from 'lucide-react';
import { Button } from '../common/Button';
import { CURRENCY_LIST } from '../../utils/formatters';
import { usePropertyStore } from '../../store/usePropertyStore';

export function MobileDrawer({
  isOpen,
  onClose,
  navItems,
  savedCount,
  compareCount,
  onOpenCompare,
  onOpenSearch,
}) {
  const currency = usePropertyStore((state) => state.currency);
  const areaUnit = usePropertyStore((state) => state.areaUnit);
  const setCurrency = usePropertyStore((state) => state.setCurrency);
  const setAreaUnit = usePropertyStore((state) => state.setAreaUnit);

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
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-10 flex w-full max-w-sm flex-col justify-between overflow-y-auto border-l border-[#B69A69]/25 bg-[#171816] px-6 py-6 text-[#F7F5F0]"
          >
            <div>
              <div className="flex items-center justify-between border-b border-[#F7F5F0]/10 pb-5">
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
                  className="flex h-11 w-11 items-center justify-center border border-[#F7F5F0]/20 text-[#F7F5F0] transition-colors hover:border-[#B69A69] hover:text-[#B69A69]"
                >
                  <X className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSearch();
                }}
                className="mt-5 flex min-h-[44px] w-full items-center justify-between border border-[#F7F5F0]/15 bg-[#222320] px-4 py-2.5 text-xs text-[#E8E1D5]/80 transition-colors hover:border-[#B69A69]"
              >
                <span className="inline-flex items-center gap-2.5">
                  <Search className="h-3.5 w-3.5 text-[#B69A69]" />
                  <span>Search residences, cities, refs...</span>
                </span>
              </button>

              <nav aria-label="Mobile primary" className="mt-6 flex flex-col space-y-3">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex min-h-[44px] items-center justify-between border-b border-[#F7F5F0]/8 pb-2.5 font-serif text-2xl transition-colors ${
                        isActive ? 'text-[#B69A69]' : 'text-[#F7F5F0] hover:text-[#B69A69]'
                      }`
                    }
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="h-4 w-4 opacity-60" strokeWidth={1.5} />
                  </NavLink>
                ))}
              </nav>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Link
                  to="/saved"
                  onClick={onClose}
                  className="flex min-h-[44px] items-center justify-center gap-2 border border-[#F7F5F0]/15 py-2.5 text-xs uppercase tracking-[0.16em] text-[#F7F5F0] transition-colors hover:border-[#B69A69]"
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
                  className="flex min-h-[44px] items-center justify-center gap-2 border border-[#F7F5F0]/15 py-2.5 text-xs uppercase tracking-[0.16em] text-[#F7F5F0] transition-colors hover:border-[#B69A69]"
                >
                  <Scale className="h-3.5 w-3.5 text-[#B69A69]" strokeWidth={1.5} />
                  <span>Compare ({compareCount})</span>
                </button>
              </div>

              <div className="mt-6 border-t border-[#F7F5F0]/10 pt-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B69A69]">
                  Display Currency & Units
                </p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {CURRENCY_LIST.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => setCurrency(item.code)}
                      className={`min-h-[38px] border px-3 py-1 text-[11px] font-medium tracking-wider transition-colors ${
                        currency === item.code
                          ? 'border-[#B69A69] bg-[#B69A69] text-[#171816]'
                          : 'border-[#F7F5F0]/15 text-[#E8E1D5]/80 hover:border-[#B69A69]'
                      }`}
                    >
                      {item.code}
                    </button>
                  ))}
                </div>

                <div className="mt-2.5 grid grid-cols-2 gap-2">
                  {[
                    { id: 'sqm', label: 'Metric (sqm)' },
                    { id: 'sqft', label: 'Imperial (sq ft)' },
                  ].map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => setAreaUnit(u.id)}
                      className={`min-h-[38px] border py-1 text-[11px] font-medium uppercase tracking-wider transition-colors ${
                        areaUnit === u.id
                          ? 'border-[#B69A69] bg-[#222320] text-[#B69A69]'
                          : 'border-[#F7F5F0]/15 text-[#E8E1D5]/70'
                      }`}
                    >
                      {u.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-[#F7F5F0]/10 pt-5">
              <Button
                variant="gold"
                to="/contact"
                onClick={onClose}
                className="w-full min-h-[46px]"
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
