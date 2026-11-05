import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Columns2,
  LayoutGrid,
  List,
  Map as MapIcon,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { LuxurySelect } from '../common/LuxurySelect';
import { Button } from '../common/Button';
import { formatArea, formatPrice } from '../../utils/formatters';
import { usePropertyStore } from '../../store/usePropertyStore';

const DESTINATION_OPTIONS = [
  { value: '', label: 'All Destinations' },
  { value: 'Dubai', label: 'Dubai' },
  { value: 'London', label: 'London' },
  { value: 'New York', label: 'New York' },
  { value: 'Paris', label: 'Paris' },
  { value: 'Marbella', label: 'Marbella' },
  { value: 'Lagos', label: 'Lagos' },
];

const TYPE_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: 'Villa', label: 'Villa' },
  { value: 'Penthouse', label: 'Penthouse' },
  { value: 'Townhouse', label: 'Townhouse' },
  { value: 'Residence', label: 'Residence' },
];

const BED_OPTIONS = [
  { value: '', label: 'Any Bedrooms' },
  { value: '3', label: '3+ Bedrooms' },
  { value: '4', label: '4+ Bedrooms' },
  { value: '5', label: '5+ Bedrooms' },
  { value: '6', label: '6+ Bedrooms' },
];

const BATH_OPTIONS = [
  { value: '', label: 'Any Bathrooms' },
  { value: '4', label: '4+ Bathrooms' },
  { value: '5', label: '5+ Bathrooms' },
  { value: '6', label: '6+ Bathrooms' },
  { value: '7', label: '7+ Bathrooms' },
];

const SORT_OPTIONS = [
  { value: 'featured', label: 'Curated Featured' },
  { value: 'newest', label: 'Newest Additions' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'area-desc', label: 'Floor Area: Largest' },
];

export function PropertyFilters({
  filters,
  onFilterChange,
  onClearAll,
  resultsCount,
  viewMode,
  onViewModeChange,
}) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

  const currency = usePropertyStore((state) => state.currency);
  const areaUnit = usePropertyStore((state) => state.areaUnit);

  useEffect(() => {
    if (!isMobileSheetOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMobileSheetOpen]);

  const minPriceOptions = useMemo(
    () => [
      { value: '', label: 'No Minimum' },
      ...[5_000_000, 10_000_000, 15_000_000, 20_000_000, 25_000_000].map((v) => ({
        value: String(v),
        label: formatPrice(v, currency, true),
      })),
    ],
    [currency]
  );

  const maxPriceOptions = useMemo(
    () => [
      { value: '', label: 'No Maximum' },
      ...[10_000_000, 15_000_000, 20_000_000, 30_000_000, 40_000_000].map((v) => ({
        value: String(v),
        label: formatPrice(v, currency, true),
      })),
    ],
    [currency]
  );

  const areaOptions = useMemo(
    () => [
      { value: '', label: 'Any Size' },
      ...[450, 650, 900, 1200].map((sqm) => ({
        value: String(sqm),
        label: `${formatArea(sqm, areaUnit)}+`,
      })),
    ],
    [areaUnit]
  );

  const activeChips = [];
  if (filters.q) activeChips.push({ key: 'q', label: `Search: "${filters.q}"` });
  if (filters.location)
    activeChips.push({ key: 'location', label: `Destination: ${filters.location}` });
  if (filters.type) activeChips.push({ key: 'type', label: `Type: ${filters.type}` });
  if (filters.collection)
    activeChips.push({
      key: 'collection',
      label: `Collection: ${filters.collection.replace(/-/g, ' ')}`,
    });
  if (filters.minPrice)
    activeChips.push({
      key: 'minPrice',
      label: `Min: ${formatPrice(Number(filters.minPrice), currency, true)}`,
    });
  if (filters.maxPrice)
    activeChips.push({
      key: 'maxPrice',
      label: `Max: ${formatPrice(Number(filters.maxPrice), currency, true)}`,
    });
  if (filters.beds)
    activeChips.push({ key: 'beds', label: `${filters.beds}+ Bedrooms` });
  if (filters.baths)
    activeChips.push({ key: 'baths', label: `${filters.baths}+ Bathrooms` });
  if (filters.minArea)
    activeChips.push({
      key: 'minArea',
      label: `Min ${formatArea(Number(filters.minArea), areaUnit)}`,
    });

  return (
    <>
      <section
        aria-label="Property filters"
        className="border border-[#E8E1D5] bg-white p-4 sm:p-6"
      >
        {/* Mobile Compact Search + Filter Drawer Trigger (< md) */}
        <div className="flex flex-col gap-3 md:hidden">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#41413D]/50"
              strokeWidth={1.5}
            />
            <input
              type="text"
              aria-label="Search by keyword or reference"
              value={filters.q}
              onChange={(e) => onFilterChange({ q: e.target.value })}
              placeholder="Search city, title, or VMR-2026..."
              className="min-h-[44px] w-full border border-[#E8E1D5] bg-[#F7F5F0]/60 py-2.5 pl-10 pr-4 text-sm text-[#171816] placeholder:text-[#41413D]/45 focus:border-[#B69A69] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between gap-2.5">
            <button
              type="button"
              onClick={() => setIsMobileSheetOpen(true)}
              className="inline-flex min-h-[42px] flex-1 items-center justify-center gap-2 border border-[#171816] bg-[#171816] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#F7F5F0]"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-[#B69A69]" />
              <span>
                Filters & Sort
                {activeChips.length > 0 ? ` (${activeChips.length})` : ''}
              </span>
            </button>

            <div
              role="group"
              aria-label="Mobile view mode"
              className="inline-flex border border-[#E8E1D5] bg-[#F7F5F0]/60 p-0.5"
            >
              {[
                { id: 'grid', label: 'Grid view', icon: LayoutGrid },
                { id: 'list', label: 'List view', icon: List },
                { id: 'map', label: 'Map view', icon: MapIcon },
              ].map((mode) => {
                const Icon = mode.icon;
                const active = viewMode === mode.id || (viewMode === 'split' && mode.id === 'map');
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => onViewModeChange(mode.id)}
                    aria-label={mode.label}
                    className={`flex h-9 w-10 items-center justify-center transition-colors ${
                      active
                        ? 'bg-[#171816] text-[#F7F5F0]'
                        : 'text-[#41413D] hover:text-[#171816]'
                    }`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.6} />
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-[11px] uppercase tracking-[0.18em] text-[#41413D]">
            Showing{' '}
            <span className="font-semibold tabular-nums text-[#171816]">
              {resultsCount}
            </span>{' '}
            {resultsCount === 1 ? 'Residence' : 'Residences'}
          </p>
        </div>

        {/* Desktop & Tablet Primary Filter Bar (md+) */}
        <div className="hidden md:grid md:grid-cols-12 md:gap-4 md:items-end">
          <div className="md:col-span-4">
            <label
              htmlFor="filter-q"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#41413D]"
            >
              Keyword or Reference
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#41413D]/50"
                strokeWidth={1.5}
              />
              <input
                id="filter-q"
                type="text"
                value={filters.q}
                onChange={(e) => onFilterChange({ q: e.target.value })}
                placeholder="City, neighbourhood, title, VMR-2026..."
                className="min-h-[44px] w-full border border-[#E8E1D5] bg-[#F7F5F0]/60 py-2.5 pl-10 pr-4 text-sm text-[#171816] placeholder:text-[#41413D]/45 focus:border-[#B69A69] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="md:col-span-3">
            <LuxurySelect
              label="Destination"
              value={filters.location}
              onChange={(val) => onFilterChange({ location: val })}
              options={DESTINATION_OPTIONS}
            />
          </div>

          <div className="md:col-span-3">
            <LuxurySelect
              label="Property Type"
              value={filters.type}
              onChange={(val) => onFilterChange({ type: val })}
              options={TYPE_OPTIONS}
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="button"
              aria-expanded={isAdvancedOpen}
              onClick={() => setIsAdvancedOpen((prev) => !prev)}
              className={`flex min-h-[44px] w-full items-center justify-center gap-2 border px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] transition-colors ${
                isAdvancedOpen
                  ? 'border-[#171816] bg-[#171816] text-[#F7F5F0]'
                  : 'border-[#E8E1D5] bg-[#F7F5F0]/60 text-[#171816] hover:border-[#171816]'
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.6} />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Desktop Expandable Advanced Filters */}
        <AnimatePresence initial={false}>
          {isAdvancedOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              className="hidden md:block overflow-visible"
            >
              <div className="mt-5 grid grid-cols-2 gap-4 border-t border-[#E8E1D5] pt-5 lg:grid-cols-5">
                <LuxurySelect
                  label="Minimum Price"
                  value={filters.minPrice}
                  onChange={(val) => onFilterChange({ minPrice: val })}
                  options={minPriceOptions}
                />
                <LuxurySelect
                  label="Maximum Price"
                  value={filters.maxPrice}
                  onChange={(val) => onFilterChange({ maxPrice: val })}
                  options={maxPriceOptions}
                />
                <LuxurySelect
                  label="Bedrooms"
                  value={filters.beds}
                  onChange={(val) => onFilterChange({ beds: val })}
                  options={BED_OPTIONS}
                />
                <LuxurySelect
                  label="Bathrooms"
                  value={filters.baths}
                  onChange={(val) => onFilterChange({ baths: val })}
                  options={BATH_OPTIONS}
                />
                <LuxurySelect
                  label="Minimum Floor Area"
                  value={filters.minArea}
                  onChange={(val) => onFilterChange({ minArea: val })}
                  options={areaOptions}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Toolbar */}
        <div className="mt-5 hidden border-t border-[#E8E1D5] pt-4 md:flex md:items-center md:justify-between md:gap-4">
          <p className="text-xs uppercase tracking-[0.18em] text-[#41413D]">
            Showing{' '}
            <span className="font-semibold tabular-nums text-[#171816]">
              {resultsCount}
            </span>{' '}
            {resultsCount === 1 ? 'Residence' : 'Residences'}
          </p>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#41413D]">
                Sort
              </span>
              <LuxurySelect
                ariaLabel="Sort properties"
                size="sm"
                value={filters.sort}
                onChange={(val) => onFilterChange({ sort: val })}
                options={SORT_OPTIONS}
                className="w-48"
              />
            </div>

            <div
              role="group"
              aria-label="Listing display view"
              className="inline-flex border border-[#E8E1D5] bg-[#F7F5F0]/60 p-0.5"
            >
              {[
                { id: 'grid', label: 'Grid view', icon: LayoutGrid },
                { id: 'list', label: 'List view', icon: List },
                { id: 'split', label: 'Split map and list view', icon: Columns2 },
                { id: 'map', label: 'Full map view', icon: MapIcon },
              ].map((mode) => {
                const Icon = mode.icon;
                const active = viewMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => onViewModeChange(mode.id)}
                    aria-label={mode.label}
                    title={mode.label}
                    className={`flex h-9 w-9 items-center justify-center transition-colors ${
                      active
                        ? 'bg-[#171816] text-[#F7F5F0]'
                        : 'text-[#41413D] hover:text-[#171816]'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" strokeWidth={1.6} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Active Filter Chips (Both Mobile & Desktop) */}
        {activeChips.length > 0 && (
          <div className="mt-3.5 flex flex-wrap items-center gap-2 border-t border-[#E8E1D5]/70 pt-3.5">
            {activeChips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={() => onFilterChange({ [chip.key]: '' })}
                className="inline-flex min-h-[32px] items-center gap-1.5 border border-[#E8E1D5] bg-[#F7F5F0] px-3 py-1 text-xs capitalize text-[#171816] transition-colors hover:border-[#B69A69]"
              >
                <span>{chip.label}</span>
                <X className="h-3 w-3 text-[#B69A69]" strokeWidth={1.8} />
              </button>
            ))}

            <button
              type="button"
              onClick={onClearAll}
              className="ml-1 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#977D50] underline underline-offset-4 hover:text-[#171816]"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </section>

      {/* Mobile Slide-Up Filter Bottom Sheet */}
      <AnimatePresence>
        {isMobileSheetOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Filter and sort residences"
            className="fixed inset-0 z-50 md:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSheetOpen(false)}
              className="fixed inset-0 bg-[#171816]/75 backdrop-blur-xs"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-0 bottom-0 z-10 flex max-h-[88vh] flex-col border-t border-[#B69A69]/40 bg-white"
            >
              <div className="flex items-center justify-between border-b border-[#E8E1D5] px-5 py-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B69A69]">
                    Refine Portfolio
                  </p>
                  <h3 className="font-serif text-2xl text-[#171816]">
                    Filters & Sorting
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileSheetOpen(false)}
                  aria-label="Close filter drawer"
                  className="flex h-10 w-10 items-center justify-center border border-[#E8E1D5] text-[#171816]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto p-5 pb-24">
                <LuxurySelect
                  label="Sort Order"
                  value={filters.sort}
                  onChange={(val) => onFilterChange({ sort: val })}
                  options={SORT_OPTIONS}
                />
                <LuxurySelect
                  label="Destination"
                  value={filters.location}
                  onChange={(val) => onFilterChange({ location: val })}
                  options={DESTINATION_OPTIONS}
                />
                <LuxurySelect
                  label="Property Type"
                  value={filters.type}
                  onChange={(val) => onFilterChange({ type: val })}
                  options={TYPE_OPTIONS}
                />
                <div className="grid grid-cols-2 gap-3">
                  <LuxurySelect
                    label="Min Price"
                    value={filters.minPrice}
                    onChange={(val) => onFilterChange({ minPrice: val })}
                    options={minPriceOptions}
                  />
                  <LuxurySelect
                    label="Max Price"
                    value={filters.maxPrice}
                    onChange={(val) => onFilterChange({ maxPrice: val })}
                    options={maxPriceOptions}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <LuxurySelect
                    label="Bedrooms"
                    value={filters.beds}
                    onChange={(val) => onFilterChange({ beds: val })}
                    options={BED_OPTIONS}
                  />
                  <LuxurySelect
                    label="Bathrooms"
                    value={filters.baths}
                    onChange={(val) => onFilterChange({ baths: val })}
                    options={BATH_OPTIONS}
                  />
                </div>
                <LuxurySelect
                  label="Minimum Floor Area"
                  value={filters.minArea}
                  onChange={(val) => onFilterChange({ minArea: val })}
                  options={areaOptions}
                />
              </div>

              <div className="flex items-center gap-3 border-t border-[#E8E1D5] bg-[#F7F5F0] px-5 py-4">
                <button
                  type="button"
                  onClick={onClearAll}
                  className="min-h-[44px] border border-[#171816]/30 bg-white px-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#171816]"
                >
                  Reset
                </button>
                <Button
                  variant="primary"
                  onClick={() => setIsMobileSheetOpen(false)}
                  className="min-h-[44px] flex-1"
                >
                  Show {resultsCount} {resultsCount === 1 ? 'Residence' : 'Residences'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
