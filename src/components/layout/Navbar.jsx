import { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Heart, Menu, Scale } from 'lucide-react';
import { Container } from '../common/Container';
import { Button } from '../common/Button';
import { MobileDrawer } from './MobileDrawer';
import { useScrollThreshold } from '../../hooks/useScrollThreshold';
import { usePropertyStore } from '../../store/usePropertyStore';

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
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isScrolled = useScrollThreshold(44);

  const savedCount = usePropertyStore((state) => state.savedIds.length);
  const compareCount = usePropertyStore((state) => state.compareIds.length);
  const openCompareModal = usePropertyStore((state) => state.openCompareModal);

  // Pages whose top banner has a dark full-bleed hero image
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
            ? 'border-b border-[#F7F5F0]/12 bg-gradient-to-b from-[#171816]/65 to-transparent py-5 text-[#F7F5F0]'
            : 'border-b border-[#E8E1D5] bg-[#F7F5F0]/95 py-4 text-[#171816] backdrop-blur-md shadow-[0_6px_28px_rgba(23,24,22,0.04)]'
        }`}
      >
        <Container className="flex items-center justify-between gap-6">
          {/* Brand Wordmark */}
          <Link
            to="/"
            aria-label="VIMROLL Estate Home"
            className="group flex flex-col leading-none"
          >
            <span
              className={`font-serif text-2xl sm:text-[1.65rem] font-medium tracking-[0.22em] transition-colors ${
                useTransparentStyle ? 'text-[#F7F5F0]' : 'text-[#171816]'
              }`}
            >
              VIMROLL
            </span>
            <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.42em] text-[#B69A69]">
              Estate
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav aria-label="Primary" className="hidden lg:flex lg:items-center lg:gap-8">
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

          {/* Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
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
      />
    </>
  );
}

