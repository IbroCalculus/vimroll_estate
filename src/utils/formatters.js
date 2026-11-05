/**
 * Currency, measurement, and URL filter utilities for VIMROLL Estate.
 */

export function formatPrice(amount, currency = 'USD', compact = false) {
  if (typeof amount !== 'number' || Number.isNaN(amount)) return 'Price Upon Request';

  if (compact) {
    if (amount >= 1_000_000) {
      const millions = amount / 1_000_000;
      const formatted = millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1);
      return `$${formatted}M`;
    }
    if (amount >= 1_000) {
      return `$${Math.round(amount / 1_000)}K`;
    }
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatArea(area, unit = 'sqm', includeSqft = false) {
  if (!area) return '—';
  const formattedMetric = new Intl.NumberFormat('en-US').format(area);
  if (!includeSqft || unit !== 'sqm') {
    return `${formattedMetric} ${unit}`;
  }
  const sqft = Math.round(area * 10.7639);
  const formattedSqft = new Intl.NumberFormat('en-US').format(sqft);
  return `${formattedMetric} sqm (${formattedSqft} sq ft)`;
}

export function formatPricePerSqm(price, area) {
  if (!price || !area) return '—';
  const ratio = Math.round(price / area);
  return `${formatPrice(ratio)} / sqm`;
}

export const DEFAULT_FILTERS = {
  q: '',
  location: '',
  type: '',
  collection: '',
  minPrice: '',
  maxPrice: '',
  beds: '',
  baths: '',
  minArea: '',
  sort: 'featured',
};

export function parseFiltersFromSearchParams(searchParams) {
  return {
    q: searchParams.get('q') || '',
    location: searchParams.get('location') || '',
    type: searchParams.get('type') || '',
    collection: searchParams.get('collection') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    beds: searchParams.get('beds') || '',
    baths: searchParams.get('baths') || '',
    minArea: searchParams.get('minArea') || '',
    sort: searchParams.get('sort') || 'featured',
  };
}

export function buildSearchParamsFromFilters(filters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      if (key === 'sort' && value === 'featured') return;
      params.set(key, String(value).trim());
    }
  });
  return params;
}

