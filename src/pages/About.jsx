import { ArrowRight } from 'lucide-react';
import { PageMeta } from '../components/common/PageMeta';
import { Container } from '../components/common/Container';
import { Button } from '../components/common/Button';
import { SectionHeading } from '../components/common/SectionHeading';
import { LuxuryImage } from '../components/common/LuxuryImage';
import { PageTransition } from '../components/animations/PageTransition';
import { Reveal } from '../components/animations/Reveal';
import { AnimatedCounter } from '../components/animations/AnimatedCounter';
import { useConsultantsQuery } from '../features/properties/useProperties';

export default function About() {
  const { data: consultants = [] } = useConsultantsQuery();

  return (
    <PageTransition>
      <PageMeta
        title="About VIMROLL Estate"
        description="Learn about VIMROLL Estate's architectural curation philosophy, global private advisory network, and leadership team."
      />

      {/* Dark Hero */}
      <section className="relative overflow-hidden bg-[#171816] pt-36 pb-20 text-[#F7F5F0] sm:pt-44 sm:pb-28">
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1800&q=80"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#171816]/85 via-[#171816]/70 to-[#171816]" />
        </div>

        <Container className="relative z-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#B69A69]">
            Our Heritage & Ethos
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl font-normal leading-[1.08] text-[#F7F5F0] sm:text-6xl">
            Where Exceptional Living Begins.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#E8E1D5]/80">
            VIMROLL Estate was conceived for collectors of remarkable spaces—combining
            editorial architectural curation with discreet private client representation.
          </p>
        </Container>
      </section>

      {/* Editorial Story */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12">
            <Reveal className="lg:col-span-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#B69A69]">
                Architectural Stewardship
              </p>
              <h2 className="mt-3 font-serif text-3xl font-normal leading-tight text-[#171816] sm:text-5xl">
                Curating Homes Worthy of Generational Legacy.
              </h2>
              <div className="mt-6 space-y-4 text-sm leading-relaxed text-[#41413D] sm:text-base">
                <p>
                  Conventional property portals treat extraordinary architecture no
                  differently from commodity apartments. VIMROLL Estate takes the
                  opposite view: each home we present is researched, photographed, and
                  contextualised with the rigour of a monograph.
                </p>
                <p>
                  Operating across London, Dubai, New York, Paris, Marbella, and Lagos,
                  our advisory desks work closely with private individuals, family
                  offices, architects, and developers to connect rare residences with
                  stewards who value craftsmanship and privacy.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="lg:col-span-6">
              <div className="aspect-[4/3] overflow-hidden border border-[#E8E1D5]">
                <LuxuryImage
                  src="https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1400&q=82"
                  alt="Editorial salon interior"
                  className="h-full w-full"
                />
              </div>
            </Reveal>
          </div>

          {/* Metrics Band */}
          <div className="mt-20 grid grid-cols-2 gap-6 border-y border-[#E8E1D5] py-12 lg:grid-cols-4">
            <div>
              <p className="font-serif text-4xl text-[#171816] sm:text-5xl">
                <AnimatedCounter value={6} />
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#41413D]">
                International Markets
              </p>
            </div>
            <div>
              <p className="font-serif text-4xl text-[#171816] sm:text-5xl">
                <AnimatedCounter value={16} />
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#41413D]">
                Signature Residences
              </p>
            </div>
            <div>
              <p className="font-serif text-4xl text-[#171816] sm:text-5xl">
                <AnimatedCounter value={5} />
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#41413D]">
                Curated Anthologies
              </p>
            </div>
            <div>
              <p className="font-serif text-4xl text-[#171816] sm:text-5xl">
                <AnimatedCounter value={15} suffix="+" />
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#41413D]">
                Avg. Advisor Experience (Yrs)
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Advisory Leadership */}
      <section className="border-t border-[#E8E1D5] bg-[#EFECE5] py-20 sm:py-28">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Private Client Advisory"
              title="Meet Our Senior Consultants"
              description="Multilingual regional specialists offering discreet guidance across Europe, the Middle East, North America, and West Africa."
            />
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {consultants.map((advisor, idx) => (
              <Reveal key={advisor.id} delay={idx * 0.07}>
                <article className="flex h-full flex-col border border-[#E8E1D5] bg-white">
                  <div className="aspect-[4/4.5] overflow-hidden">
                    <LuxuryImage
                      src={advisor.avatar}
                      alt={advisor.name}
                      className="h-full w-full"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B69A69]">
                        {advisor.office}
                      </p>
                      <h3 className="mt-1.5 font-serif text-2xl font-normal text-[#171816]">
                        {advisor.name}
                      </h3>
                      <p className="mt-1 text-xs font-medium text-[#41413D]">
                        {advisor.role}
                      </p>
                      <p className="mt-3 text-xs leading-relaxed text-[#41413D]/80">
                        {advisor.bio}
                      </p>
                    </div>
                    <p className="mt-5 border-t border-[#E8E1D5] pt-3 text-[11px] text-[#41413D]/70">
                      Languages: {advisor.languages.join(' · ')}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <div className="mt-14 flex justify-center">
            <Button variant="primary" size="lg" to="/contact">
              <span>Arrange a Private Consultation</span>
              <ArrowRight className="h-4 w-4" strokeWidth={1.6} />
            </Button>
          </div>
        </Container>
      </section>
    </PageTransition>
  );
}

