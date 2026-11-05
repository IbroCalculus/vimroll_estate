import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, Globe, Heart, Menu, Scale, Search } from 'lucide-react';
import { Container } from '../common/Container';
import { Button } from '../common/Button';
import { MobileDrawer } from './MobileDrawer';
import { useScrollThreshold } from '../../hooks/useScrollThreshold';
import { usePropertyStore } from '../../store/usePropertyStore';
import { CURRENCY_LIST } from '../../utils/formatters';

const NAV_ITEMS = [
  { label: 'Home', to: '/' },
  { label: 'Properties', to: '/properties' },
  { label: 'Collections', to: '/collections' },
  { label: 'Locations', to: '/locations' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const prefsRef = useRef(null);

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isScrolled = useScrollThreshold(44);

  const savedCount = usePropertyStore((state) => state.savedIds.length);
  const compareCount = usePropertyStore((state) => state.compareIds.length);
  const currency = usePropertyStore((state) => state.currency);
  const areaUnit = usePropertyStore((state) => state.areaUnit);
  const setCurrency = usePropertyStore((state) => state.setCurrency);
  const setAreaUnit = usePropertyStore((state) => state.setAreaUnit);
  const openCompareModal = usePropertyStore((state) => state.openCompareModal);
  const openCommandSearch = usePropertyStore((state) => state.openCommandSearch);

  useEffect(() => {
    if (!prefsOpen) return undefined;
    const handleOutside = (e) => {
      if (prefsRef.current && !prefsRef.current.contains(e.target)) {
        setPrefsOpen(false);
      }
    };
    document.addEventListener('pointerdown', handleOutside);
    return () => document.removeEventListener('pointerdown', handleOutside);
  }, [prefsOpen]);

  const hasDarkHero =
    pathname === '/' ||
    pathname === '/about' ||
    pathname === '/locations' ||
    pathname === '/collections' ||
    pathname.startsWith('/collections/');

  const useTransparentStyle = hasDarkHero && !isScrolled;

  const handleOpenCompare = () => {
    if (compareCount >= 2) {
      openCompareModal();
    } else {
      navigate('/saved');
    }
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-400 ${
          useTransparentStyle
            ? 'bg-gradient-to-b from-[#171816]/80 via-[#171816]/35 to-transparent py-4 sm:py-5 text-[#F7F5F0]'
            : 'border-b border-[#E8E1D5] bg-[#F7F5F0]/95 py-3.5 sm:py-4 text-[#171816] backdrop-blur-md shadow-[0_6px_28px_rgba(23,24,22,0.04)]'
        }`}
      >
        <Container className="flex items-center justify-between gap-3 sm:gap-6">
          <Link
            to="/"
            aria-label="VIMROLL Estate Home"
            className="group flex shrink-0 flex-col leading-none"
          >
            <span
              className={`font-serif text-xl sm:text-[1.65rem] font-medium tracking-[0.22em] transition-colors ${
                useTransparentStyle ? 'text-[#F7F5F0]' : 'text-[#171816]'
              }`}
            >
              VIMROLL
            </span>
            <span className="mt-1 text-[8.5px] sm:text-[9px] font-semibold uppercase tracking-[0.42em] text-[#B69A69]">
              Estate
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden lg:flex lg:items-center lg:gap-7 xl:gap-8">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `relative py-1 text-xs font-medium uppercase tracking-[0.18em] transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-[1.5px] after:bg-[#B69A69] after:transition-transform after:duration-300 ${
                    isActive
                      ? useTransparentStyle
                        ? 'text-[#F7F5F0] after:scale-x-100'
                        : 'text-[#171816] after:scale-x-100'
                      : useTransparentStyle
                        ? 'text-[#F7F5F0]/85 hover:text-[#F7F5F0] after:scale-x-0 hover:after:scale-x-100'
                        : 'text-[#41413D] hover:text-[#171816] after:scale-x-0 hover:after:scale-x-100'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <div ref={prefsRef} className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setPrefsOpen((p) => !p)}
                aria-expanded={prefsOpen}
                aria-label="Currency and measurement unit preferences"
                className={`inline-flex h-10 items-center gap-1.5 border px-2.5 text-[11px] font-medium uppercase tracking-[0.14em] transition-colors ${
                  useTransparentStyle
                    ? 'border-[#F7F5F0]/25 text-[#F7F5F0] hover:border-[#B69A69]'
                    : 'border-[#E8E1D5] bg-white text-[#171816] hover:border-[#171816]'
                }`}
              >
                <Globe className="h-3.5 w-3.5 text-[#B69A69]" strokeWidth={1.5} />
                <span>
                  {currency} · {areaUnit}
                </span>
                <ChevronDown
                  className={`h-3 w-3 opacity-70 transition-transform ${
                    prefsOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {prefsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-2 w-60 border border-[#E8E1D5] bg-white p-4 text-[#171816] shadow-2xl"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B69A69]">
                      Display Currency
                    </p>
                    <div className="mt-2 grid grid-cols-3 gap-1.5">
                      {CURRENCY_LIST.map((item) => (
                        <button
                          key={item.code}
                          type="button"
                          onClick={() => setCurrency(item.code)}
                          className={`border py-1.5 text-xs font-medium transition-colors ${
                            currency === item.code
                              ? 'border-[#171816] bg-[#171816] text-[#F7F5F0]'
                              : 'border-[#E8E1D5] bg-[#F7F5F0]/60 text-[#41413D] hover:border-[#B69A69]'
                          }`}
                        >
                          {item.code}
                        </button>
                      ))}
                    </div>

                    <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B69A69]">
                      Floor Area Unit
                    </p>
                    <div className="mt-2 grid grid-cols-2 gap-1.5">
                      {[
                        { id: 'sqm', label: 'SQM' },
                        { id: 'sqft', label: 'SQ FT' },
                      ].map((u) => (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => setAreaUnit(u.id)}
                          className={`border py-1.5 text-xs font-medium transition-colors ${
                            areaUnit === u.id
                              ? 'border-[#171816] bg-[#171816] text-[#F7F5F0]'
                              : 'border-[#E8E1D5] bg-[#F7F5F0]/60 text-[#41413D] hover:border-[#B69A69]'
                          }`}
                        >
                          {u.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              type="button"
              onClick={openCommandSearch}
              aria-label="Open portfolio search (Ctrl+K)"
              title="Quick Search (Ctrl+K)"
              className={`flex h-10 w-10 xl:w-auto xl:px-3 items-center justify-center gap-2 border transition-colors ${
                useTransparentStyle
                  ? 'border-[#F7F5F0]/25 text-[#F7F5F0] hover:border-[#B69A69] hover:text-[#B69A69]'
                  : 'border-[#E8E1D5] bg-white text-[#171816] hover:border-[#171816]'
              }`}
            >
              <Search className="h-4 w-4" strokeWidth={1.5} />
              <span className="hidden xl:inline text-[10px] tracking-[0.14em] opacity-70">
                ⌘K
              </span>
            </button>

            {compareCount > 0 && (
              <button
                type="button"
                onClick={handleOpenCompare}
                aria-label={`Compare properties (${compareCount} selected)`}
                title="Compare selected properties"
                className={`relative hidden sm:inline-flex h-10 items-center gap-1.5 border px-3 text-[11px] font-medium uppercase tracking-[0.15em] transition-colors ${
                  useTransparentStyle
                    ? 'border-[#F7F5F0]/25 text-[#F7F5F0] hover:border-[#B69A69]'
                    : 'border-[#E8E1D5] bg-white text-[#171816] hover:border-[#171816]'
                }`}
              >
                <Scale className="h-3.5 w-3.5 text-[#B69A69]" strokeWidth={1.5} />
                <span className="tabular-nums">{compareCount}</span>
              </button>
            )}

            <Link
              to="/saved"
              aria-label={`Saved properties (${savedCount})`}
              className={`relative flex h-10 w-10 items-center justify-center border transition-colors ${
                useTransparentStyle
                  ? 'border-[#F7F5F0]/25 text-[#F7F5F0] hover:border-[#B69A69] hover:text-[#B69A69]'
                  : 'border-[#E8E1D5] bg-white text-[#171816] hover:border-[#171816]'
              }`}
            >
              <Heart
                className={`h-4 w-4 transition-colors ${
                  savedCount > 0 ? 'fill-[#B69A69] text-[#B69A69]' : ''
                }`}
                strokeWidth={1.5}
              />
              {savedCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center bg-[#B69A69] px-1 text-[10px] font-semibold tabular-nums text-[#171816]">
                  {savedCount}
                </span>
              )}
            </Link>

            <Button
              to="/contact"
              variant={useTransparentStyle ? 'gold' : 'primary'}
              size="sm"
              className="hidden sm:inline-flex"
            >
              Enquire
            </Button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className={`flex h-10 w-10 items-center justify-center border lg:hidden ${
                useTransparentStyle
                  ? 'border-[#F7F5F0]/25 text-[#F7F5F0]'
                  : 'border-[#E8E1D5] bg-white text-[#171816]'
              }`}
            >
              <Menu className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </Container>
      </header>

      <MobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navItems={NAV_ITEMS}
        savedCount={savedCount}
        compareCount={compareCount}
        onOpenCompare={handleOpenCompare}
        onOpenSearch={openCommandSearch}
      />
    </>
  );
}
