import { ArrowRight } from 'lucide-react';
import { PageMeta } from '../components/common/PageMeta';
import { Container } from '../components/common/Container';
import { Button } from '../components/common/Button';
import { LuxuryImage } from '../components/common/LuxuryImage';
import { Loader } from '../components/common/Loader';
import { PageTransition } from '../components/animations/PageTransition';
import { Reveal } from '../components/animations/Reveal';
import { useCollectionsQuery } from '../features/properties/useProperties';

export default function Collections() {
  const { data: collections = [], isLoading } = useCollectionsQuery();

  return (
    <PageTransition>
      <PageMeta
        title="Curated Architectural Collections"
        description="Explore VIMROLL Estate's curated property anthologies: Waterfront Estates, Modern Masterpieces, Private Villas, Penthouse Living, and Architectural Icons."
      />

      {/* Dark Editorial Hero */}
      <section className="relative overflow-hidden bg-[#171816] pt-36 pb-20 text-[#F7F5F0] sm:pt-44 sm:pb-28">
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=80"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#171816]/85 via-[#171816]/70 to-[#171816]" />
        </div>

        <Container className="relative z-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#B69A69]">
            Editorial Anthologies
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl font-normal leading-[1.08] text-[#F7F5F0] sm:text-6xl">
            Curated by Sensibility, Not Merely Postcode.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#E8E1D5]/80">
            Five signature collections grouping our international residences by
            architectural lineage, relationship to water, and metropolitan elevation.
          </p>
        </Container>
      </section>

      {/* Magazine Alternating Index */}
      <section className="py-16 sm:py-24">
        <Container>
          {isLoading ? (
            <Loader label="Loading curated collections..." />
          ) : (
            <div className="space-y-20 sm:space-y-28">
              {collections.map((collection, index) => {
                const isReversed = index % 2 === 1;
                return (
                  <Reveal key={collection.id}>
                    <article className="grid grid-cols-1 items-center gap-10 border-b border-[#E8E1D5] pb-16 last:border-b-0 last:pb-0 lg:grid-cols-12 lg:gap-14">
                      <div
                        className={`lg:col-span-7 ${
                          isReversed ? 'lg:order-2' : 'lg:order-1'
                        }`}
                      >
                        <div className="group relative aspect-[16/10] overflow-hidden border border-[#E8E1D5]">
                          <LuxuryImage
                            src={collection.coverImage}
                            alt={collection.title}
                            priority={index < 2}
                            className="h-full w-full"
                            imgClassName="transition-transform duration-700 group-hover:scale-[1.04]"
                          />
                          <span className="absolute left-5 top-5 bg-[#171816]/90 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B69A69]">
                            0{index + 1} · {collection.propertyCount} Residences
                          </span>
                        </div>
                      </div>

                      <div
                        className={`lg:col-span-5 ${
                          isReversed ? 'lg:order-1' : 'lg:order-2'
                        }`}
                      >
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#B69A69]">
                          {collection.subtitle}
                        </p>
                        <h2 className="mt-3 font-serif text-3xl font-normal text-[#171816] sm:text-4xl">
                          {collection.title}
                        </h2>
                        <blockquote className="mt-4 border-l-2 border-[#B69A69] pl-4 font-serif text-lg italic text-[#171816]/85">
                          “{collection.accentQuote}”
                        </blockquote>
                        <p className="mt-5 text-sm leading-relaxed text-[#41413D] sm:text-base">
                          {collection.editorialIntro}
                        </p>

                        <div className="mt-8">
                          <Button
                            variant="primary"
                            to={`/collections/${collection.slug}`}
                          >
                            <span>Explore Collection</span>
                            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.6} />
                          </Button>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          )}
        </Container>
      </section>
    </PageTransition>
  );
}

