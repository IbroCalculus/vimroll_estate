import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { LuxurySelect } from '../common/LuxurySelect';
import { buildSearchParamsFromFilters, formatPrice } from '../../utils/formatters';
import { usePropertyStore } from '../../store/usePropertyStore';

const DESTINATION_OPTIONS = [
  { value: '', label: 'All Destinations' },
  { value: 'Dubai', label: 'Dubai, UAE' },
  { value: 'London', label: 'London, United Kingdom' },
  { value: 'New York', label: 'New York, USA' },
  { value: 'Paris', label: 'Paris, France' },
  { value: 'Marbella', label: 'Marbella, Spain' },
  { value: 'Lagos', label: 'Lagos, Nigeria' },
];

const TYPE_OPTIONS = [
  { value: '', label: 'All Residence Types' },
  { value: 'Villa', label: 'Private Villa' },
  { value: 'Penthouse', label: 'Penthouse' },
  { value: 'Townhouse', label: 'Townhouse' },
  { value: 'Residence', label: 'Lateral Residence' },
];

const BED_OPTIONS = [
  { value: '', label: 'Any' },
  { value: '3', label: '3+ Beds' },
  { value: '4', label: '4+ Beds' },
  { value: '5', label: '5+ Beds' },
  { value: '6', label: '6+ Beds' },
];

export function PropertySearch() {
  const navigate = useNavigate();
  const currency = usePropertyStore((state) => state.currency);

  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [priceIndex, setPriceIndex] = useState('0');
  const [beds, setBeds] = useState('');

  const priceBrackets = useMemo(
    () => [
      { value: '0', label: 'Any Price Guide', min: '', max: '' },
      {
        value: '1',
        label: `Up to ${formatPrice(10_000_000, currency, true)}`,
        min: '',
        max: '10000000',
      },
      {
        value: '2',
        label: `${formatPrice(10_000_000, currency, true)} – ${formatPrice(20_000_000, currency, true)}`,
        min: '10000000',
        max: '20000000',
      },
      {
        value: '3',
        label: `${formatPrice(20_000_000, currency, true)}+`,
        min: '20000000',
        max: '',
      },
    ],
    [currency]
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    const bracket =
      priceBrackets.find((b) => b.value === String(priceIndex)) || priceBrackets[0];
    const params = buildSearchParamsFromFilters({
      location,
      type,
      minPrice: bracket.min,
      maxPrice: bracket.max,
      beds,
    });
    const queryString = params.toString();
    navigate(queryString ? `/properties?${queryString}` : '/properties');
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Search luxury properties"
      className="w-full border border-[#F7F5F0]/20 bg-[#171816]/92 p-4 backdrop-blur-md shadow-[0_24px_60px_rgba(0,0,0,0.38)] sm:p-6"
    >
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-3">
          <LuxurySelect
            theme="dark"
            label="Destination"
            value={location}
            onChange={setLocation}
            options={DESTINATION_OPTIONS}
          />
        </div>

        <div className="lg:col-span-3">
          <LuxurySelect
            theme="dark"
            label="Property Type"
            value={type}
            onChange={setType}
            options={TYPE_OPTIONS}
          />
        </div>

        <div className="lg:col-span-3">
          <LuxurySelect
            theme="dark"
            label="Price Guide"
            value={priceIndex}
            onChange={setPriceIndex}
            options={priceBrackets}
          />
        </div>

        <div className="lg:col-span-1">
          <LuxurySelect
            theme="dark"
            label="Beds"
            value={beds}
            onChange={setBeds}
            options={BED_OPTIONS}
          />
        </div>

        <div className="sm:col-span-2 lg:col-span-2">
          <button
            type="submit"
            className="flex min-h-[44px] w-full items-center justify-center gap-2 bg-[#B69A69] px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#171816] transition-colors hover:bg-[#CBB389]"
          >
            <Search className="h-3.5 w-3.5" strokeWidth={1.8} />
            <span>Search</span>
          </button>
        </div>
      </div>
    </form>
  );
}
