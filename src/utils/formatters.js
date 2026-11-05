/**
 * Multi-currency, measurement unit, and URL filter utilities for VIMROLL Estate.
 */

export const CURRENCIES = {
  USD: { code: 'USD', symbol: '$', rate: 1, label: 'USD ($)' },
  GBP: { code: 'GBP', symbol: '£', rate: 0.79, label: 'GBP (£)' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92, label: 'EUR (€)' },
  AED: { code: 'AED', symbol: 'AED ', rate: 3.6725, label: 'AED' },
  NGN: { code: 'NGN', symbol: '₦', rate: 1580, label: 'NGN (₦)' },
};

export const CURRENCY_LIST = Object.values(CURRENCIES);

export function convertFromUsd(usdAmount, currencyCode = 'USD') {
  const meta = CURRENCIES[currencyCode] || CURRENCIES.USD;
  return usdAmount * meta.rate;
}

export function formatPrice(usdAmount, currencyCode = 'USD', compact = false) {
  if (typeof usdAmount !== 'number' || Number.isNaN(usdAmount)) {
    return 'Price Upon Request';
  }

  const meta = CURRENCIES[currencyCode] || CURRENCIES.USD;
  const converted = usdAmount * meta.rate;

  if (compact) {
    if (converted >= 1_000_000_000) {
      const billions = converted / 1_000_000_000;
      const num = billions >= 10 ? billions.toFixed(0) : billions.toFixed(1);
      return `${meta.symbol}${num.replace(/\.0$/, '')}B`;
    }
    if (converted >= 1_000_000) {
      const millions = converted / 1_000_000;
      const num = millions >= 100 ? millions.toFixed(0) : millions.toFixed(1);
      return `${meta.symbol}${num.replace(/\.0$/, '')}M`;
    }
    if (converted >= 1_000) {
      return `${meta.symbol}${Math.round(converted / 1_000)}K`;
    }
  }

  if (currencyCode === 'NGN') {
    return `₦${new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0,
    }).format(Math.round(converted))}`;
  }

  if (currencyCode === 'AED') {
    return `AED ${new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0,
    }).format(Math.round(converted))}`;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: meta.code,
    maximumFractionDigits: 0,
  }).format(Math.round(converted));
}

export function formatArea(sqmArea, displayUnit = 'sqm', includeSecondary = false) {
  if (!sqmArea) return '—';
  const sqft = Math.round(sqmArea * 10.7639);
  const formattedSqm = new Intl.NumberFormat('en-US').format(sqmArea);
  const formattedSqft = new Intl.NumberFormat('en-US').format(sqft);

  if (displayUnit === 'sqft') {
    return includeSecondary
      ? `${formattedSqft} sq ft (${formattedSqm} sqm)`
      : `${formattedSqft} sq ft`;
  }

  return includeSecondary
    ? `${formattedSqm} sqm (${formattedSqft} sq ft)`
    : `${formattedSqm} sqm`;
}

export function formatPricePerSqm(
  usdPrice,
  sqmArea,
  currencyCode = 'USD',
  displayUnit = 'sqm'
) {
  if (!usdPrice || !sqmArea) return '—';
  const effectiveArea =
    displayUnit === 'sqft' ? sqmArea * 10.7639 : sqmArea;
  const usdPerUnit = usdPrice / effectiveArea;
  const unitLabel = displayUnit === 'sqft' ? 'sq ft' : 'sqm';
  return `${formatPrice(usdPerUnit, currencyCode)} / ${unitLabel}`;
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
