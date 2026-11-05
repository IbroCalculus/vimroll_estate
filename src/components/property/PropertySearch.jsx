import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { buildSearchParamsFromFilters } from '../../utils/formatters';

const PRICE_OPTIONS = [
  { label: 'Any Price Range', min: '', max: '' },
  { label: 'Up to $10,000,000', min: '', max: '10000000' },
  { label: '$10,000,000 – $20,000,000', min: '10000000', max: '20000000' },
  { label: '$20,000,000+', min: '20000000', max: '' },
];

export function PropertySearch() {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [priceIndex, setPriceIndex] = useState(0);
  const [beds, setBeds] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const priceRange = PRICE_OPTIONS[priceIndex] || PRICE_OPTIONS[0];
    const params = buildSearchParamsFromFilters({
      location,
      type,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      beds,
    });
    const queryString = params.toString();
    navigate(queryString ? `/properties?${queryString}` : '/properties');
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Search luxury properties"
      className="w-full border border-[#F7F5F0]/20 bg-[#171816]/90 p-4 backdrop-blur-md shadow-[0_24px_60px_rgba(0,0,0,0.35)] sm:p-6"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-3">
          <label
            htmlFor="hero-location"
            className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B69A69]"
          >
            Destination
          </label>
          <select
            id="hero-location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border border-[#F7F5F0]/18 bg-[#222320] px-3.5 py-3 text-sm text-[#F7F5F0] focus:border-[#B69A69] focus:outline-none"
          >
            <option value="">All Destinations</option>
            <option value="Dubai">Dubai, UAE</option>
            <option value="London">London, United Kingdom</option>
            <option value="New York">New York, USA</option>
            <option value="Paris">Paris, France</option>
            <option value="Marbella">Marbella, Spain</option>
            <option value="Lagos">Lagos, Nigeria</option>
          </select>
        </div>

        <div className="lg:col-span-3">
          <label
            htmlFor="hero-type"
            className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B69A69]"
          >
            Property Type
          </label>
          <select
            id="hero-type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border border-[#F7F5F0]/18 bg-[#222320] px-3.5 py-3 text-sm text-[#F7F5F0] focus:border-[#B69A69] focus:outline-none"
          >
            <option value="">All Residence Types</option>
            <option value="Villa">Private Villa</option>
            <option value="Penthouse">Penthouse</option>
            <option value="Townhouse">Townhouse</option>
            <option value="Residence">Lateral Residence</option>
          </select>
        </div>

        <div className="lg:col-span-3">
          <label
            htmlFor="hero-price"
            className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B69A69]"
          >
            Price Guide
          </label>
          <select
            id="hero-price"
            value={priceIndex}
            onChange={(e) => setPriceIndex(Number(e.target.value))}
            className="w-full border border-[#F7F5F0]/18 bg-[#222320] px-3.5 py-3 text-sm text-[#F7F5F0] focus:border-[#B69A69] focus:outline-none"
          >
            {PRICE_OPTIONS.map((option, idx) => (
              <option key={option.label} value={idx}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-1">
          <label
            htmlFor="hero-beds"
            className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B69A69]"
          >
            Bedrooms
          </label>
          <select
            id="hero-beds"
            value={beds}
            onChange={(e) => setBeds(e.target.value)}
            className="w-full border border-[#F7F5F0]/18 bg-[#222320] px-3 py-3 text-sm text-[#F7F5F0] focus:border-[#B69A69] focus:outline-none"
          >
            <option value="">Any</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
            <option value="6">6+</option>
          </select>
        </div>

        <div className="sm:col-span-2 lg:col-span-2">
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 bg-[#B69A69] px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#171816] transition-colors hover:bg-[#CBB389]"
          >
            <Search className="h-3.5 w-3.5" strokeWidth={1.8} />
            <span>Search</span>
          </button>
        </div>
      </div>
    </form>
  );
}

