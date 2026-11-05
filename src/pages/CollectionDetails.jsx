import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageMeta } from '../components/common/PageMeta';
import { Container } from '../components/common/Container';
import { Loader } from '../components/common/Loader';
import { EmptyState } from '../components/common/EmptyState';
import { PageTransition } from '../components/animations/PageTransition';
import { PropertyGrid } from '../components/property/PropertyGrid';
import { useCollectionDetailsQuery } from '../features/properties/useProperties';

export default function CollectionDetails() {
  const { slug } = useParams();
  const { data: collection, isLoading } = useCollectionDetailsQuery(slug);

  if (isLoading) {
    return (
      <div className="bg-[#171816] pt-36 pb-20 text-[#F7F5F0]">
        <Loader label="Curating collection..." />
      </div>
    );
  }

  if (!collection) {
    return (
      <PageTransition>
        <PageMeta title="Collection Not Found" />
        <div className="bg-[#171816] pt-28 pb-8" />
        <Container className="py-20">
          <EmptyState
            eyebrow="Collections"
            title="This collection could not be found."
            description="Explore our five signature architectural collections."
            actionLabel="View All Collections"
            actionTo="/collections"
          />
        </Container>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <PageMeta
        title={`${collection.title} Collection`}
        description={collection.shortDescription}
      />

      {/* Cover Hero */}
      <section className="relative overflow-hidden bg-[#171816] pt-36 pb-20 text-[#F7F5F0] sm:pt-44 sm:pb-28">
        <div className="pointer-events-none absolute inset-0">
          <img
            src={collection.coverImage}
            alt={collection.title}
            className="h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#171816] via-[#171816]/65 to-[#171816]/80" />
        </div>

        <Container className="relative z-10">
          <Link
            to="/collections"
            className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-[#B69A69] transition-colors hover:text-[#F7F5F0]"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.6} />
            <span>All Collections</span>
          </Link>

          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.26em] text-[#E8E1D5]/75">
            {collection.subtitle}
          </p>
          <h1 className="mt-2 font-serif text-4xl font-normal text-[#F7F5F0] sm:text-6xl">
            {collection.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#E8E1D5]/85">
            {collection.editorialIntro}
          </p>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#B69A69]">
            {collection.propertyCount} Curated{' '}
            {collection.propertyCount === 1 ? 'Residence' : 'Residences'}
          </p>
        </Container>
      </section>

      {/* Collection Listings */}
      <section className="py-16 sm:py-24">
        <Container>
          <PropertyGrid properties={collection.properties} columns={3} />
        </Container>
      </section>
    </PageTransition>
  );
}
