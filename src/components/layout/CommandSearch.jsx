import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Compass, Layers, MapPin, Search, X } from 'lucide-react';
import { usePropertyStore } from '../../store/usePropertyStore';
import {
  useAllPropertiesQuery,
  useCollectionsQuery,
  useLocationsQuery,
} from '../../features/properties/useProperties';
import { formatArea, formatPrice } from '../../utils/formatters';

export function CommandSearch() {
  const isOpen = usePropertyStore((state) => state.isCommandSearchOpen);
  const openCommandSearch = usePropertyStore((state) => state.openCommandSearch);
  const closeCommandSearch = usePropertyStore((state) => state.closeCommandSearch);
  const currency = usePropertyStore((state) => state.currency);
  const areaUnit = usePropertyStore((state) => state.areaUnit);

  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const { data: properties = [] } = useAllPropertiesQuery();
  const { data: locations = [] } = useLocationsQuery();
  const { data: collections = [] } = useCollectionsQuery();

  useEffect(() => {
    const handleGlobalKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (isOpen) closeCommandSearch();
        else openCommandSearch();
      } else if (event.key === 'Escape' && isOpen) {
        closeCommandSearch();
      }
    };

    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [isOpen, openCommandSearch, closeCommandSearch]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      return undefined;
    }
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const timer = setTimeout(() => inputRef.current?.focus(), 60);
    return () => {
      document.body.style.overflow = prevOverflow;
      clearTimeout(timer);
    };
  }, [isOpen]);

  const term = query.trim().toLowerCase();

  const matchedProperties = useMemo(() => {
    if (!term) return properties.slice(0, 4);
    return properties
      .filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          p.location.city.toLowerCase().includes(term) ||
          p.location.country.toLowerCase().includes(term) ||
          p.location.neighbourhood.toLowerCase().includes(term) ||
          p.reference.toLowerCase().includes(term) ||
          p.propertyType.toLowerCase().includes(term)
      )
      .slice(0, 5);
  }, [properties, term]);

  const matchedLocations = useMemo(() => {
    if (!term) return locations.slice(0, 6);
    return locations.filter(
      (l) =>
        l.city.toLowerCase().includes(term) ||
        l.country.toLowerCase().includes(term) ||
        l.tagline.toLowerCase().includes(term)
    );
  }, [locations, term]);

  const matchedCollections = useMemo(() => {
    if (!term) return collections.slice(0, 3);
    return collections.filter(
      (c) =>
        c.title.toLowerCase().includes(term) ||
        c.subtitle.toLowerCase().includes(term)
    );
  }, [collections, term]);

  const go = (to) => {
    closeCommandSearch();
    navigate(to);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Global portfolio spotlight search"
          className="fixed inset-0 z-50 flex items-start justify-center p-3 pt-12 sm:p-6 sm:pt-[10vh]"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCommandSearch}
            className="fixed inset-0 bg-[#171816]/80 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.985 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex max-h-[82vh] w-full max-w-2xl flex-col overflow-hidden border border-[#B69A69]/40 bg-white shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-[#E8E1D5] bg-[#F7F5F0] px-4 py-3.5 sm:px-6">
              <Search className="h-4 w-4 shrink-0 text-[#B69A69]" strokeWidth={1.7} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search residences, cities, collections, or VMR-2026..."
                className="min-w-0 flex-1 bg-transparent text-sm text-[#171816] placeholder:text-[#41413D]/50 focus:outline-none sm:text-base"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search query"
                  className="p-1.5 text-[#41413D]/60 hover:text-[#171816]"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={closeCommandSearch}
                aria-label="Close spotlight search"
                className="border border-[#E8E1D5] bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#41413D] hover:border-[#171816] hover:text-[#171816]"
              >
                ESC
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {matchedProperties.length === 0 &&
              matchedLocations.length === 0 &&
              matchedCollections.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="font-serif text-2xl text-[#171816]">
                    No portfolio results for “{query}”
                  </p>
                  <p className="mt-1.5 text-xs text-[#41413D]/75">
                    Try searching Dubai, Belgravia, Penthouse, or VMR-2026-001.
                  </p>
                </div>
              ) : (
                <>
                  {matchedLocations.length > 0 && (
                    <div>
                      <p className="mb-2.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B69A69]">
                        <MapPin className="h-3 w-3" />
                        <span>Destinations</span>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {matchedLocations.map((loc) => (
                          <button
                            key={loc.id}
                            type="button"
                            onClick={() =>
                              go(`/properties?location=${encodeURIComponent(loc.city)}`)
                            }
                            className="inline-flex min-h-[38px] items-center gap-2 border border-[#E8E1D5] bg-[#F7F5F0]/70 px-3.5 py-1.5 text-xs font-medium text-[#171816] transition-colors hover:border-[#B69A69] hover:bg-white"
                          >
                            <span>{loc.city}</span>
                            <span className="text-[10px] text-[#41413D]/60">
                              ({loc.propertyCount})
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {matchedProperties.length > 0 && (
                    <div>
                      <p className="mb-2.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B69A69]">
                        <Compass className="h-3 w-3" />
                        <span>{term ? 'Matching Residences' : 'Featured Residences'}</span>
                      </p>
                      <div className="divide-y divide-[#E8E1D5] border border-[#E8E1D5]">
                        {matchedProperties.map((prop) => (
                          <button
                            key={prop.id}
                            type="button"
                            onClick={() => go(`/properties/${prop.slug}`)}
                            className="flex w-full items-center justify-between gap-3 bg-white p-3 text-left transition-colors hover:bg-[#F7F5F0]"
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <img
                                src={prop.images[0]}
                                alt=""
                                className="h-12 w-16 shrink-0 object-cover bg-[#E8E1D5]"
                              />
                              <div className="min-w-0">
                                <p className="truncate font-serif text-lg text-[#171816]">
                                  {prop.title}
                                </p>
                                <p className="truncate text-xs text-[#41413D]/75">
                                  {prop.location.city}, {prop.location.country} ·{' '}
                                  {prop.bedrooms} Beds ·{' '}
                                  {formatArea(prop.area, areaUnit)}
                                </p>
                              </div>
                            </div>
                            <div className="flex shrink-0 items-center gap-2.5">
                              <span className="text-xs font-semibold tabular-nums text-[#171816]">
                                {formatPrice(prop.price, currency, true)}
                              </span>
                              <ArrowUpRight
                                className="h-4 w-4 text-[#B69A69]"
                                strokeWidth={1.6}
                              />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {matchedCollections.length > 0 && (
                    <div>
                      <p className="mb-2.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B69A69]">
                        <Layers className="h-3 w-3" />
                        <span>Curated Collections</span>
                      </p>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                        {matchedCollections.map((col) => (
                          <button
                            key={col.id}
                            type="button"
                            onClick={() => go(`/collections/${col.slug}`)}
                            className="flex items-center justify-between border border-[#E8E1D5] bg-[#F7F5F0]/50 px-3.5 py-2.5 text-left text-xs font-medium text-[#171816] transition-colors hover:border-[#B69A69] hover:bg-white"
                          >
                            <span className="truncate">{col.title}</span>
                            <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-[#B69A69]" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

