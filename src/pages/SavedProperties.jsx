import { Scale, Trash2 } from 'lucide-react';
import { PageMeta } from '../components/common/PageMeta';
import { Container } from '../components/common/Container';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { PageTransition } from '../components/animations/PageTransition';
import { PropertyGrid } from '../components/property/PropertyGrid';
import { ComparisonMatrix } from '../features/comparison/ComparisonMatrix';
import { useAllPropertiesQuery } from '../features/properties/useProperties';
import { usePropertyStore } from '../store/usePropertyStore';

export default function SavedProperties() {
  const savedIds = usePropertyStore((state) => state.savedIds);
  const compareIds = usePropertyStore((state) => state.compareIds);
  const clearSaved = usePropertyStore((state) => state.clearSaved);
  const toggleCompare = usePropertyStore((state) => state.toggleCompare);

  const { data: allProperties = [] } = useAllPropertiesQuery();

  const savedProperties = savedIds
    .map((id) => allProperties.find((p) => p.id === id))
    .filter(Boolean);

  const comparedProperties = compareIds
    .map((id) => allProperties.find((p) => p.id === id))
    .filter(Boolean);

  const handleCompareSaved = () => {
    savedProperties.slice(0, 4).forEach((prop) => {
      if (!compareIds.includes(prop.id)) {
        toggleCompare(prop.id, prop.title);
      }
    });
    const el = document.getElementById('comparison-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <PageTransition>
      <PageMeta
        title="Saved Residences & Comparison"
        description="Review your shortlisted luxury properties and compare specifications side by side on VIMROLL Estate."
      />

      {/* Header */}
      <section className="border-b border-[#E8E1D5] bg-[#EFECE5] pt-28 pb-12 sm:pt-36 sm:pb-16">
        <Container className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#B69A69]">
              Personal Shortlist
            </p>
            <h1 className="mt-3 font-serif text-4xl font-normal text-[#171816] sm:text-5xl">
              Saved Residences
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#41413D] sm:text-base">
              Your shortlisted properties are stored privately in your browser so you can
              revisit and compare specifications at your leisure.
            </p>
          </div>

          {savedProperties.length > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              {savedProperties.length >= 2 && (
                <Button variant="primary" size="sm" onClick={handleCompareSaved}>
                  <Scale className="h-3.5 w-3.5 text-[#B69A69]" strokeWidth={1.6} />
                  <span>Compare Saved</span>
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={clearSaved}>
                <Trash2 className="h-3.5 w-3.5" strokeWidth={1.6} />
                <span>Clear All</span>
              </Button>
            </div>
          )}
        </Container>
      </section>

      {/* Saved Grid */}
      <section className="py-14 sm:py-20">
        <Container>
          {savedProperties.length === 0 ? (
            <EmptyState
              eyebrow="Shortlist Empty"
              title="You have not saved any residences yet."
              description="Select the heart icon on any residence across our portfolio to build your personal shortlist and compare properties side by side."
              actionLabel="Explore Properties"
              actionTo="/properties"
            />
          ) : (
            <PropertyGrid properties={savedProperties} columns={3} />
          )}

          {/* Side-by-Side Comparison Section */}
          {(comparedProperties.length > 0 || savedProperties.length >= 2) && (
            <div
              id="comparison-section"
              className="mt-20 border-t border-[#E8E1D5] pt-16"
            >
              <div className="mb-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#B69A69]">
                  Side-by-Side Evaluation
                </p>
                <h2 className="mt-2 font-serif text-3xl font-normal text-[#171816] sm:text-4xl">
                  Property Comparison
                </h2>
                <p className="mt-2 text-sm text-[#41413D]/80">
                  Compare up to four residences across pricing, interior proportions,
                  typology, and key appointments.
                </p>
              </div>

              <ComparisonMatrix properties={comparedProperties} />
            </div>
          )}
        </Container>
      </section>
    </PageTransition>
  );
}

