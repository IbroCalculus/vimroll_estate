import { Suspense, lazy, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageMeta } from '../components/common/PageMeta';
import { Container } from '../components/common/Container';
import { Button } from '../components/common/Button';
import { Loader } from '../components/common/Loader';
import { EmptyState } from '../components/common/EmptyState';
import { PageTransition } from '../components/animations/PageTransition';
import { PropertyFilters } from '../components/property/PropertyFilters';
import { PropertyGrid } from '../components/property/PropertyGrid';
import { usePropertiesQuery } from '../features/properties/useProperties';

const PropertyMap = lazy(() =>
  import('../components/property/PropertyMap').then((mod) => ({
    default: mod.PropertyMap,
  }))
);
import {
  DEFAULT_FILTERS,
  buildSearchParamsFromFilters,
  parseFiltersFromSearchParams,
} from '../utils/formatters';

const PAGE_STEP = 6;

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = parseFiltersFromSearchParams(searchParams);

  const [viewMode, setViewMode] = useState(() => searchParams.get('view') || 'grid');
  const [visibleCount, setVisibleCount] = useState(PAGE_STEP);
  const [highlightedId, setHighlightedId] = useState(null);

  const { data: properties = [], isLoading } = usePropertiesQuery(filters);

  // Reset pagination whenever filter criteria change
  useEffect(() => {
    setVisibleCount(PAGE_STEP);
  }, [
    filters.q,
    filters.location,
    filters.type,
    filters.collection,
    filters.minPrice,
    filters.maxPrice,
    filters.beds,
    filters.baths,
    filters.minArea,
    filters.sort,
  ]);

  const handleFilterChange = (partial) => {
    const next = { ...filters, ...partial };
    const nextParams = buildSearchParamsFromFilters(next);
    if (viewMode !== 'grid') {
      nextParams.set('view', viewMode);
    }
    setSearchParams(nextParams, { replace: true });
  };

  const handleClearAll = () => {
    const nextParams = new URLSearchParams();
    if (viewMode !== 'grid') {
      nextParams.set('view', viewMode);
    }
    setSearchParams(nextParams, { replace: true });
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    const nextParams = buildSearchParamsFromFilters(filters);
    if (mode !== 'grid') {
      nextParams.set('view', mode);
    }
    setSearchParams(nextParams, { replace: true });
  };

  const visibleProperties =
    viewMode === 'map' || viewMode === 'split'
      ? properties
      : properties.slice(0, visibleCount);

  const hasMore =
    viewMode !== 'map' &&
    viewMode !== 'split' &&
    visibleCount < properties.length;

  return (
    <PageTransition>
      <PageMeta
        title={
          filters.location
            ? `Luxury Properties in ${filters.location}`
            : 'Luxury Property Portfolio'
        }
        description="Search, filter, sort, and explore exclusive villas, penthouses, and townhouses across Dubai, London, New York, Paris, Marbella, and Lagos."
      />

      {/* Editorial Page Header */}
      <section className="border-b border-[#E8E1D5] bg-[#EFECE5] pt-28 pb-12 sm:pt-36 sm:pb-16">
        <Container>
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#B69A69]">
            International Portfolio
          </p>
          <h1 className="mt-3 font-serif text-4xl font-normal text-[#171816] sm:text-5xl">
            {filters.location
              ? `Residences in ${filters.location}`
              : 'Extraordinary Residences'}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#41413D]/85 sm:text-base">
            Filter by destination, architectural typology, guide price, and interior
            proportions—or explore our global atlas in split map view.
          </p>
        </Container>
      </section>

      {/* Filters + Results */}
      <section className="py-10 sm:py-14">
        <Container>
          <PropertyFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearAll={handleClearAll}
            resultsCount={properties.length}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
          />

          <div className="mt-10">
            {isLoading ? (
              <Loader label="Filtering residences..." />
            ) : properties.length === 0 ? (
              <EmptyState
                eyebrow="No Exact Matches"
                title="No residences match your selected criteria."
                description="Consider broadening your price guide, bedroom minimum, or destination filter to discover comparable estates in our portfolio."
                actionLabel="Clear All Filters"
                onAction={handleClearAll}
              />
            ) : viewMode === 'map' ? (
              <Suspense fallback={<Loader label="Loading interactive atlas..." />}>
                <PropertyMap
                  properties={properties}
                  highlightedId={highlightedId}
                  className="h-[640px] w-full"
                />
              </Suspense>
            ) : viewMode === 'split' ? (
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <PropertyGrid
                    properties={visibleProperties}
                    layout="grid"
                    columns={2}
                    highlightedId={highlightedId}
                    onHoverProperty={setHighlightedId}
                  />
                </div>
                <div className="lg:col-span-5">
                  <div className="lg:sticky lg:top-24">
                    <Suspense fallback={<Loader label="Loading interactive atlas..." />}>
                      <PropertyMap
                        properties={properties}
                        highlightedId={highlightedId}
                        className="h-[460px] lg:h-[calc(100vh-130px)] w-full"
                      />
                    </Suspense>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <PropertyGrid
                  properties={visibleProperties}
                  layout={viewMode === 'list' ? 'list' : 'grid'}
                  columns={3}
                  highlightedId={highlightedId}
                  onHoverProperty={setHighlightedId}
                />

                {hasMore && (
                  <div className="mt-14 flex flex-col items-center gap-3">
                    <p className="text-xs text-[#41413D]/75 tabular-nums">
                      Viewing {visibleProperties.length} of {properties.length} residences
                    </p>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setVisibleCount((prev) => prev + PAGE_STEP)}
                    >
                      Load More Residences
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </Container>
      </section>
    </PageTransition>
  );
}
