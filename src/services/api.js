import { properties } from '../data/properties';
import { collections } from '../data/collections';
import { locations } from '../data/locations';
import { consultants } from '../data/consultants';
import {
  buildSpatialMediaForProperty,
  getCityIntelligence,
} from '../data/spatialMedia';
import { trackInteraction } from '../utils/analytics';

/**
 * FastAPI-ready client service layer.
 * When `import.meta.env.VITE_API_BASE_URL` is configured, these functions can
 * swap to `fetch(`${API_BASE_URL}/api/v1/...`)` without modifying any React components.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

function enrichProperty(property) {
  const consultant =
    consultants.find((c) => c.id === property.consultantId) || consultants[0];
  const spatial = buildSpatialMediaForProperty(property);
  return {
    ...property,
    consultant,
    ...spatial,
  };
}

export async function fetchProperties(filters = {}) {
  if (API_BASE_URL) {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${API_BASE_URL}/api/v1/properties?${params.toString()}`);
    if (!res.ok) throw new Error('Unable to fetch properties');
    return res.json();
  }

  let results = properties.map(enrichProperty);

  const {
    q = '',
    location = '',
    type = '',
    collection = '',
    minPrice = '',
    maxPrice = '',
    beds = '',
    baths = '',
    minArea = '',
    sort = 'featured',
  } = filters;

  if (q && q.trim()) {
    const term = q.trim().toLowerCase();
    results = results.filter(
      (item) =>
        item.title.toLowerCase().includes(term) ||
        item.location.city.toLowerCase().includes(term) ||
        item.location.country.toLowerCase().includes(term) ||
        item.location.neighbourhood.toLowerCase().includes(term) ||
        item.reference.toLowerCase().includes(term) ||
        item.propertyType.toLowerCase().includes(term) ||
        item.amenities.some((a) => a.toLowerCase().includes(term))
    );
  }

  if (location && location.trim()) {
    const locTerm = location.trim().toLowerCase();
    results = results.filter(
      (item) =>
        item.location.city.toLowerCase() === locTerm ||
        item.location.country.toLowerCase() === locTerm ||
        `${item.location.city}, ${item.location.country}`.toLowerCase().includes(locTerm)
    );
  }

  if (type && type.trim()) {
    results = results.filter(
      (item) => item.propertyType.toLowerCase() === type.trim().toLowerCase()
    );
  }

  if (collection && collection.trim()) {
    results = results.filter((item) =>
      item.collections.includes(collection.trim().toLowerCase())
    );
  }

  if (minPrice !== '' && !Number.isNaN(Number(minPrice))) {
    results = results.filter((item) => item.price >= Number(minPrice));
  }

  if (maxPrice !== '' && !Number.isNaN(Number(maxPrice))) {
    results = results.filter((item) => item.price <= Number(maxPrice));
  }

  if (beds !== '' && !Number.isNaN(Number(beds))) {
    results = results.filter((item) => item.bedrooms >= Number(beds));
  }

  if (baths !== '' && !Number.isNaN(Number(baths))) {
    results = results.filter((item) => item.bathrooms >= Number(baths));
  }

  if (minArea !== '' && !Number.isNaN(Number(minArea))) {
    results = results.filter((item) => item.area >= Number(minArea));
  }

  // Sorting
  results = [...results].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    if (sort === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sort === 'area-desc') return b.area - a.area;
    // Default 'featured': featured first, then newest
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return results;
}

export async function fetchAllProperties() {
  return properties.map(enrichProperty);
}

export async function fetchFeaturedProperties(limit = 4) {
  const enriched = properties.filter((p) => p.featured).map(enrichProperty);
  return enriched.slice(0, limit);
}

export async function fetchPropertyBySlug(slug) {
  if (API_BASE_URL) {
    const res = await fetch(`${API_BASE_URL}/api/v1/properties/${slug}`);
    if (!res.ok) return null;
    return res.json();
  }

  const found = properties.find((p) => p.slug === slug);
  if (!found) return null;

  const enriched = enrichProperty(found);
  const similar = properties
    .filter(
      (p) =>
        p.id !== found.id &&
        (p.location.city === found.location.city ||
          p.propertyType === found.propertyType ||
          p.collections.some((col) => found.collections.includes(col)))
    )
    .slice(0, 3)
    .map(enrichProperty);

  return {
    ...enriched,
    similarProperties: similar,
  };
}

export async function fetchCollections() {
  return collections.map((collection) => {
    const matching = properties.filter((p) => p.collections.includes(collection.slug));
    return {
      ...collection,
      propertyCount: matching.length,
    };
  });
}

export async function fetchCollectionBySlug(slug) {
  const collection = collections.find((c) => c.slug === slug);
  if (!collection) return null;

  const matchingProperties = properties
    .filter((p) => p.collections.includes(slug))
    .map(enrichProperty);

  return {
    ...collection,
    propertyCount: matchingProperties.length,
    properties: matchingProperties,
  };
}

export async function fetchLocations() {
  return locations.map((loc) => {
    const matching = properties.filter(
      (p) => p.location.city.toLowerCase() === loc.city.toLowerCase()
    );
    const startingPrice = matching.length
      ? Math.min(...matching.map((p) => p.price))
      : null;
    return {
      ...loc,
      propertyCount: matching.length,
      startingPrice,
      intelligence: getCityIntelligence(loc.city),
    };
  });
}

export async function fetchConsultants() {
  return consultants;
}

export async function submitDemoEnquiry(payload) {
  trackInteraction('enquiry_submitted', {
    enquiryType: payload?.requestViewing ? 'Private Viewing' : 'Private Dossier',
    reference:
      payload?.propertyReference || payload?.propertyOfInterest || 'General Advisory',
    preferredContact: payload?.preferredContact || 'Email',
  });

  if (API_BASE_URL) {
    const res = await fetch(`${API_BASE_URL}/api/v1/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Submission failed');
    return res.json();
  }

  // Honest demo acknowledgement with realistic brief response delay
  await new Promise((resolve) => setTimeout(resolve, 450));
  return {
    ok: true,
    demo: true,
    confirmationId: `VMR-ENQ-${Math.floor(100000 + Math.random() * 900000)}`,
    submittedAt: new Date().toISOString(),
    payload,
  };
}

