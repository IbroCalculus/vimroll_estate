import { useState } from 'react';
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
import { formatPrice } from '../../utils/formatters';

const DESTINATIONS = ['Dubai', 'London', 'New York', 'Paris', 'Marbella', 'Lagos'];
const PROPERTY_TYPES = ['Villa', 'Penthouse', 'Townhouse', 'Residence'];

export function PropertyFilters({
  filters,
  onFilterChange,
  onClearAll,
  resultsCount,
  viewMode,
  onViewModeChange,
}) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

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
      label: `Min: ${formatPrice(Number(filters.minPrice), 'USD', true)}`,
    });
  if (filters.maxPrice)
    activeChips.push({
      key: 'maxPrice',
      label: `Max: ${formatPrice(Number(filters.maxPrice), 'USD', true)}`,
    });
  if (filters.beds)
    activeChips.push({ key: 'beds', label: `${filters.beds}+ Bedrooms` });
  if (filters.baths)
    activeChips.push({ key: 'baths', label: `${filters.baths}+ Bathrooms` });
  if (filters.minArea)
    activeChips.push({ key: 'minArea', label: `Min ${filters.minArea} sqm` });

  return (
    <section aria-label="Property filters" className="border border-[#E8E1D5] bg-white p-5 sm:p-6">
      {/* Primary Filter Bar */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-end">
        {/* Keyword Search */}
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
              className="w-full border border-[#E8E1D5] bg-[#F7F5F0]/60 py-2.5 pl-10 pr-4 text-sm text-[#171816] placeholder:text-[#41413D]/45 focus:border-[#B69A69] focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Location */}
        <div className="md:col-span-3">
          <label
            htmlFor="filter-location"
            className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#41413D]"
          >
            Destination
          </label>
          <select
            id="filter-location"
            value={filters.location}
            onChange={(e) => onFilterChange({ location: e.target.value })}
            className="w-full border border-[#E8E1D5] bg-[#F7F5F0]/60 px-3.5 py-2.5 text-sm text-[#171816] focus:border-[#B69A69] focus:bg-white focus:outline-none"
          >
            <option value="">All Destinations</option>
            {DESTINATIONS.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Property Type */}
        <div className="md:col-span-3">
          <label
            htmlFor="filter-type"
            className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#41413D]"
          >
            Property Type
          </label>
          <select
            id="filter-type"
            value={filters.type}
            onChange={(e) => onFilterChange({ type: e.target.value })}
            className="w-full border border-[#E8E1D5] bg-[#F7F5F0]/60 px-3.5 py-2.5 text-sm text-[#171816] focus:border-[#B69A69] focus:bg-white focus:outline-none"
          >
            <option value="">All Types</option>
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* More Filters Toggle */}
        <div className="md:col-span-2">
          <button
            type="button"
            aria-expanded={isAdvancedOpen}
            onClick={() => setIsAdvancedOpen((prev) => !prev)}
            className={`flex w-full items-center justify-center gap-2 border px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] transition-colors ${
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

      {/* Expandable Advanced Filters */}
      <AnimatePresence initial={false}>
        {isAdvancedOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-5 grid grid-cols-1 gap-4 border-t border-[#E8E1D5] pt-5 sm:grid-cols-2 lg:grid-cols-5">
              <div>
                <label
                  htmlFor="filter-min-price"
                  className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#41413D]"
                >
                  Minimum Price
                </label>
                <select
                  id="filter-min-price"
                  value={filters.minPrice}
                  onChange={(e) => onFilterChange({ minPrice: e.target.value })}
                  className="w-full border border-[#E8E1D5] bg-[#F7F5F0]/60 px-3 py-2.5 text-sm text-[#171816] focus:border-[#B69A69] focus:outline-none"
                >
                  <option value="">No Minimum</option>
                  <option value="5000000">$5,000,000</option>
                  <option value="10000000">$10,000,000</option>
                  <option value="15000000">$15,000,000</option>
                  <option value="20000000">$20,000,000</option>
                  <option value="25000000">$25,000,000</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="filter-max-price"
                  className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#41413D]"
                >
                  Maximum Price
                </label>
                <select
                  id="filter-max-price"
                  value={filters.maxPrice}
                  onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
                  className="w-full border border-[#E8E1D5] bg-[#F7F5F0]/60 px-3 py-2.5 text-sm text-[#171816] focus:border-[#B69A69] focus:outline-none"
                >
                  <option value="">No Maximum</option>
                  <option value="10000000">$10,000,000</option>
                  <option value="15000000">$15,000,000</option>
                  <option value="20000000">$20,000,000</option>
                  <option value="30000000">$30,000,000</option>
                  <option value="40000000">$40,000,000</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="filter-beds"
                  className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#41413D]"
                >
                  Bedrooms
                </label>
                <select
                  id="filter-beds"
                  value={filters.beds}
                  onChange={(e) => onFilterChange({ beds: e.target.value })}
                  className="w-full border border-[#E8E1D5] bg-[#F7F5F0]/60 px-3 py-2.5 text-sm text-[#171816] focus:border-[#B69A69] focus:outline-none"
                >
                  <option value="">Any Bedrooms</option>
                  <option value="3">3+ Bedrooms</option>
                  <option value="4">4+ Bedrooms</option>
                  <option value="5">5+ Bedrooms</option>
                  <option value="6">6+ Bedrooms</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="filter-baths"
                  className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#41413D]"
                >
                  Bathrooms
                </label>
                <select
                  id="filter-baths"
                  value={filters.baths}
                  onChange={(e) => onFilterChange({ baths: e.target.value })}
                  className="w-full border border-[#E8E1D5] bg-[#F7F5F0]/60 px-3 py-2.5 text-sm text-[#171816] focus:border-[#B69A69] focus:outline-none"
                >
                  <option value="">Any Bathrooms</option>
                  <option value="4">4+ Bathrooms</option>
                  <option value="5">5+ Bathrooms</option>
                  <option value="6">6+ Bathrooms</option>
                  <option value="7">7+ Bathrooms</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="filter-area"
                  className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#41413D]"
                >
                  Minimum Floor Area
                </label>
                <select
                  id="filter-area"
                  value={filters.minArea}
                  onChange={(e) => onFilterChange({ minArea: e.target.value })}
                  className="w-full border border-[#E8E1D5] bg-[#F7F5F0]/60 px-3 py-2.5 text-sm text-[#171816] focus:border-[#B69A69] focus:outline-none"
                >
                  <option value="">Any Size</option>
                  <option value="450">450+ sqm</option>
                  <option value="650">650+ sqm</option>
                  <option value="900">900+ sqm</option>
                  <option value="1200">1,200+ sqm</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Count + Sort + View Toggle Toolbar */}
      <div className="mt-5 flex flex-col justify-between gap-4 border-t border-[#E8E1D5] pt-4 sm:flex-row sm:items-center">
        <p className="text-xs uppercase tracking-[0.18em] text-[#41413D]">
          Showing{' '}
          <span className="font-semibold tabular-nums text-[#171816]">
            {resultsCount}
          </span>{' '}
          {resultsCount === 1 ? 'Residence' : 'Residences'}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          {/* Sort */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="filter-sort"
              className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#41413D]"
            >
              Sort
            </label>
            <select
              id="filter-sort"
              value={filters.sort}
              onChange={(e) => onFilterChange({ sort: e.target.value })}
              className="border border-[#E8E1D5] bg-[#F7F5F0]/60 px-3 py-2 text-xs font-medium text-[#171816] focus:border-[#B69A69] focus:outline-none"
            >
              <option value="featured">Curated Featured</option>
              <option value="newest">Newest Additions</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="area-desc">Floor Area: Largest</option>
            </select>
          </div>

          {/* View Mode Switcher */}
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
                  className={`flex h-8 w-9 items-center justify-center transition-colors ${
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

      {/* Active Filter Chips */}
      {activeChips.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#E8E1D5]/70 pt-4">
          {activeChips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() => onFilterChange({ [chip.key]: '' })}
              className="inline-flex items-center gap-1.5 border border-[#E8E1D5] bg-[#F7F5F0] px-3 py-1 text-xs capitalize text-[#171816] transition-colors hover:border-[#B69A69]"
            >
              <span>{chip.label}</span>
              <X className="h-3 w-3 text-[#B69A69]" strokeWidth={1.8} />
            </button>
          ))}

          <button
            type="button"
            onClick={onClearAll}
            className="ml-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#977D50] underline underline-offset-4 hover:text-[#171816]"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </section>
  );
}

