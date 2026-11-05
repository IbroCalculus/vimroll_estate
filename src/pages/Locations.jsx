import { ArrowRight } from 'lucide-react';
import { PageMeta } from '../components/common/PageMeta';
import { Container } from '../components/common/Container';
import { Button } from '../components/common/Button';
import { LuxuryImage } from '../components/common/LuxuryImage';
import { Loader } from '../components/common/Loader';
import { PageTransition } from '../components/animations/PageTransition';
import { Reveal } from '../components/animations/Reveal';
import { useLocationsQuery } from '../features/properties/useProperties';
import { formatPrice } from '../utils/formatters';

export default function Locations() {
  const { data: locations = [], isLoading } = useLocationsQuery();

  return (
    <PageTransition>
      <PageMeta
        title="Global Destinations"
        description="Explore VIMROLL Estate luxury residential markets across Dubai, London, New York, Paris, Marbella, and Lagos."
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#171816] pt-36 pb-20 text-[#F7F5F0] sm:pt-44 sm:pb-28">
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1800&q=80"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#171816]/85 via-[#171816]/70 to-[#171816]" />
        </div>

        <Container className="relative z-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#B69A69]">
            Destination Discovery
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl font-normal leading-[1.08] text-[#F7F5F0] sm:text-6xl">
            Six Global Capitals of Exceptional Living.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#E8E1D5]/80">
            From heritage European squares and Manhattan park-front towers to private
            peninsulas in Dubai, Marbella, and Lagos.
          </p>
        </Container>
      </section>

      {/* Destinations Showcase */}
      <section className="py-16 sm:py-24">
        <Container>
          {isLoading ? (
            <Loader label="Loading destinations..." />
          ) : (
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              {locations.map((loc, idx) => (
                <Reveal key={loc.id} delay={Math.min(idx * 0.06, 0.24)}>
                  <article className="group flex h-full flex-col border border-[#E8E1D5] bg-white">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <LuxuryImage
                        src={loc.heroImage}
                        alt={`${loc.city}, ${loc.country}`}
                        className="h-full w-full"
                        imgClassName="transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                      <div className="absolute left-4 top-4 bg-[#171816]/90 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B69A69]">
                        {loc.propertyCount}{' '}
                        {loc.propertyCount === 1 ? 'Residence' : 'Residences'}
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-7 sm:p-9">
                      <div>
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#B69A69]">
                            {loc.country}
                          </p>
                          {loc.startingPrice && (
                            <span className="text-xs tabular-nums text-[#41413D]/75">
                              From {formatPrice(loc.startingPrice, 'USD', true)}
                            </span>
                          )}
                        </div>

                        <h2 className="mt-2 font-serif text-3xl font-normal text-[#171816] sm:text-4xl">
                          {loc.city}
                        </h2>
                        <p className="mt-1 font-serif text-lg italic text-[#41413D]">
                          {loc.tagline}
                        </p>

                        <p className="mt-4 text-sm leading-relaxed text-[#41413D]">
                          {loc.description}
                        </p>
                        <p className="mt-3 text-xs leading-relaxed text-[#41413D]/75">
                          {loc.editorialNote}
                        </p>

                        {loc.highlights?.length > 0 && (
                          <div className="mt-5 flex flex-wrap gap-2">
                            {loc.highlights.map((item) => (
                              <span
                                key={item}
                                className="border border-[#E8E1D5] bg-[#F7F5F0] px-3 py-1 text-[11px] text-[#171816]"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="mt-8 border-t border-[#E8E1D5] pt-6">
                        <Button
                          variant="primary"
                          to={`/properties?location=${encodeURIComponent(loc.city)}`}
                        >
                          <span>Explore {loc.city} Properties</span>
                          <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.6} />
                        </Button>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </section>
    </PageTransition>
  );
}

