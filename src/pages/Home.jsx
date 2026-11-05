import { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Compass,
  Globe2,
  ShieldCheck,
} from 'lucide-react';
import { PageMeta } from '../components/common/PageMeta';
import { Container } from '../components/common/Container';
import { Button } from '../components/common/Button';
import { SectionHeading } from '../components/common/SectionHeading';
import { LuxuryImage } from '../components/common/LuxuryImage';
import { PageTransition } from '../components/animations/PageTransition';
import { Reveal } from '../components/animations/Reveal';
import { AnimatedCounter } from '../components/animations/AnimatedCounter';
import { PropertySearch } from '../components/property/PropertySearch';
import { PropertyCard } from '../components/property/PropertyCard';
import {
  useCollectionsQuery,
  useFeaturedPropertiesQuery,
  useLocationsQuery,
} from '../features/properties/useProperties';
import { useReducedMotionPref } from '../hooks/useReducedMotionPref';

gsap.registerPlugin(ScrollTrigger);

const WHY_VIMROLL_PILLARS = [
  {
    icon: Compass,
    title: 'Carefully Curated Listings',
    description:
      'Every residence in our portfolio is selected for architectural integrity, natural light, proportion, and enduring positional value rather than sheer listing volume.',
  },
  {
    icon: ShieldCheck,
    title: 'Transparent Property Dossiers',
    description:
      'Structured specifications, floor areas, neighbourhood context, and clear pricing guidance give discerning buyers clarity from first discovery.',
  },
  {
    icon: Building2,
    title: 'Dedicated Property Consultants',
    description:
      'Seasoned private client advisors coordinate discreet viewings, architectural briefings, and cross-border acquisition guidance tailored to your schedule.',
  },
  {
    icon: Globe2,
    title: 'International Property Network',
    description:
      'Connecting prime enclaves across Dubai, London, New York, Paris, Marbella, and Lagos within one cohesive discovery platform.',
  },
];

export default function Home() {
  const heroSectionRef = useRef(null);
  const heroBgRef = useRef(null);
  const prefersReducedMotion = useReducedMotionPref();

  const { data: featuredProperties = [] } = useFeaturedPropertiesQuery(4);
  const { data: destinations = [] } = useLocationsQuery();
  const { data: collections = [] } = useCollectionsQuery();

  useGSAP(
    () => {
      if (prefersReducedMotion || !heroSectionRef.current) return;

      gsap.from('.vimroll-hero-stagger', {
        y: 32,
        opacity: 0,
        duration: 0.95,
        stagger: 0.13,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      });

      if (heroBgRef.current) {
        gsap.to(heroBgRef.current, {
          yPercent: 12,
          scale: 1.07,
          ease: 'none',
          scrollTrigger: {
            trigger: heroSectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    },
    { scope: heroSectionRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <PageTransition>
      <PageMeta
        title="Luxury Real Estate Discovery & Property Marketplace"
        description="VIMROLL Estate — Where Exceptional Living Begins. Explore extraordinary villas, penthouses, and historic townhouses across Dubai, London, New York, Paris, Marbella, and Lagos."
      />

      {/* 5.2 HERO SECTION */}
      <section
        ref={heroSectionRef}
        className="relative flex min-h-[100svh] flex-col justify-between bg-[#171816] pt-28 pb-8 text-[#F7F5F0] sm:pt-36 sm:pb-12"
      >
        {/* Background Architectural Photograph */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div ref={heroBgRef} className="h-full w-full scale-[1.02]">
            <img
              src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2000&q=85"
              alt="Contemporary waterfront luxury villa illuminated at dusk"
              fetchPriority="high"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#171816]/75 via-[#171816]/42 to-[#171816]/92" />
        </div>

        {/* Hero Copy */}
        <Container className="relative z-10 my-auto py-8 sm:py-12">
          <div className="max-w-3xl">
            <p className="vimroll-hero-stagger text-[10.5px] sm:text-[11px] font-semibold uppercase tracking-[0.28em] text-[#B69A69]">
              EXCEPTIONAL PROPERTIES. EXTRAORDINARY LIVING.
            </p>
            <h1 className="vimroll-hero-stagger mt-4 sm:mt-5 font-serif text-4xl font-normal leading-[1.06] text-[#F7F5F0] sm:text-6xl lg:text-[4.5rem]">
              Discover a World Beyond Ordinary.
            </h1>
            <p className="vimroll-hero-stagger mt-5 sm:mt-6 max-w-xl text-sm leading-relaxed text-[#E8E1D5]/90 sm:text-lg">
              Explore extraordinary residences curated for those who appreciate
              exceptional living.
            </p>

            <div className="vimroll-hero-stagger mt-8 sm:mt-9 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3.5 sm:gap-4">
              <Button variant="gold" size="lg" to="/properties" className="w-full sm:w-auto">
                <span>Explore Properties</span>
                <ArrowRight className="h-4 w-4" strokeWidth={1.6} />
              </Button>
              <Button variant="outlineLight" size="lg" to="/collections" className="w-full sm:w-auto">
                Discover Our Collections
              </Button>
            </div>
          </div>
        </Container>

        {/* Hero Search Panel */}
        <Container className="relative z-20 mt-4 sm:mt-6">
          <div className="vimroll-hero-stagger">
            <PropertySearch />
          </div>
        </Container>
      </section>

      {/* Editorial Recognition Strip */}
      <div className="border-b border-[#E8E1D5] bg-[#EFECE5] py-5">
        <Container className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-center sm:justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#41413D]/65">
            Editorial Design Inspired By
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2 font-serif text-sm tracking-[0.2em] text-[#171816]/60 sm:text-base">
            <span>ARCHITECTURAL DIGEST</span>
            <span className="hidden sm:inline text-[#B69A69]">·</span>
            <span>FT HOW TO SPEND IT</span>
            <span className="hidden sm:inline text-[#B69A69]">·</span>
            <span>WALLPAPER*</span>
            <span className="hidden md:inline text-[#B69A69]">·</span>
            <span className="hidden md:inline">SOTHEBY’S JOURNAL</span>
          </div>
        </Container>
      </div>

      {/* 5.3 FEATURED PROPERTIES */}
      <section className="py-20 sm:py-28">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Curated Portfolio"
              title="Featured Residences"
              description="Handpicked waterfront villas, lateral penthouses, and heritage townhouses representing the pinnacle of contemporary residential design."
              action={
                <Button variant="outline" to="/properties">
                  <span>View All Properties</span>
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                </Button>
              }
            />
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            {featuredProperties.map((property, idx) => (
              <Reveal key={property.id} delay={idx * 0.08}>
                <PropertyCard property={property} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* 5.4 EDITORIAL BRAND INTRODUCTION */}
      <section className="border-y border-[#E8E1D5] bg-[#E8E1D5]/40 py-20 sm:py-28">
        <Container>
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12">
            {/* Editorial Layered Imagery */}
            <Reveal className="relative lg:col-span-6">
              <div className="aspect-[4/5] w-full max-w-lg overflow-hidden border border-[#E8E1D5]">
                <LuxuryImage
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=82"
                  alt="Double-height minimalist travertine living room"
                  className="h-full w-full"
                />
              </div>
              <div className="mt-6 sm:mt-0 sm:absolute sm:-bottom-8 sm:right-0 sm:w-64 border-4 border-[#F7F5F0] bg-white shadow-xl">
                <div className="aspect-[4/3] overflow-hidden">
                  <LuxuryImage
                    src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80"
                    alt="Architectural courtyard pool detail"
                    className="h-full w-full"
                  />
                </div>
                <div className="p-4">
                  <p className="font-serif text-base italic text-[#171816]">
                    “Architecture is the frame through which life is experienced.”
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Brand Narrative */}
            <Reveal delay={0.12} className="lg:col-span-6 lg:pl-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#B69A69]">
                The VIMROLL Philosophy
              </p>
              <h2 className="mt-3 font-serif text-3xl font-normal leading-[1.12] text-[#171816] sm:text-4xl lg:text-5xl">
                Not Just Properties. A Different Perspective on Living.
              </h2>
              <p className="mt-6 text-base leading-relaxed text-[#41413D]">
                At VIMROLL Estate, we view residential acquisition through an editorial
                lens. Rather than overwhelming clients with thousands of ordinary
                listings, our specialists assemble a focused anthology of residences
                distinguished by provenance, spatial grace, and rarity.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[#41413D]/85">
                Whether a restored Regency townhouse on a quiet Belgravia square, a
                private jetty compound on Banana Island, or a cantilevered glass villa
                above Marbella’s coastline, every address tells an unmistakable story.
              </p>

              {/* Animated Metrics */}
              <div className="mt-10 grid grid-cols-3 gap-6 border-y border-[#171816]/12 py-6">
                <div>
                  <p className="font-serif text-3xl text-[#171816] sm:text-4xl">
                    <AnimatedCounter value={6} />
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-[#41413D]">
                    Global Capitals
                  </p>
                </div>
                <div>
                  <p className="font-serif text-3xl text-[#171816] sm:text-4xl">
                    <AnimatedCounter value={16} />
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-[#41413D]">
                    Curated Estates
                  </p>
                </div>
                <div>
                  <p className="font-serif text-3xl text-[#171816] sm:text-4xl">
                    <AnimatedCounter value={290} prefix="$" suffix="M+" />
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-[#41413D]">
                    Portfolio Value
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <Button variant="ghost" to="/about">
                  <span>Read the VIMROLL Story</span>
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.6} />
                </Button>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 5.5 EXPLORE BY DESTINATION */}
      <section className="py-20 sm:py-28">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Global Footprint"
              title="Explore by Destination"
              description="Six world-class residential markets united by cultural vitality, architectural distinction, and enduring global demand."
              action={
                <Button variant="outline" to="/locations">
                  <span>All Destinations</span>
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                </Button>
              }
            />
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((dest, idx) => (
              <Reveal key={dest.id} delay={idx * 0.06}>
                <Link
                  to={`/properties?location=${encodeURIComponent(dest.city)}`}
                  className="group relative block aspect-[4/5] overflow-hidden border border-[#E8E1D5] bg-[#171816]"
                >
                  <LuxuryImage
                    src={dest.heroImage}
                    alt={`${dest.city}, ${dest.country}`}
                    className="h-full w-full"
                    imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#171816]/90 via-[#171816]/25 to-transparent" />

                  <div className="absolute inset-x-0 top-0 flex items-center justify-between p-6">
                    <span className="border border-[#F7F5F0]/25 bg-[#171816]/65 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F7F5F0] backdrop-blur-xs">
                      {dest.propertyCount}{' '}
                      {dest.propertyCount === 1 ? 'Residence' : 'Residences'}
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center border border-[#F7F5F0]/25 bg-[#171816]/50 text-[#F7F5F0] transition-colors group-hover:border-[#B69A69] group-hover:bg-[#B69A69] group-hover:text-[#171816]">
                      <ArrowUpRight className="h-4 w-4" strokeWidth={1.6} />
                    </span>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#B69A69]">
                      {dest.country}
                    </p>
                    <h3 className="mt-1 font-serif text-3xl font-normal text-[#F7F5F0]">
                      {dest.city}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#E8E1D5]/80">
                      {dest.tagline}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* 5.6 EXCLUSIVE COLLECTIONS */}
      <section className="bg-[#171816] py-20 text-[#F7F5F0] sm:py-28">
        <Container>
          <Reveal>
            <SectionHeading
              light
              eyebrow="Editorial Anthologies"
              title="Exclusive Collections"
              description="Residences grouped by lifestyle sensibility and architectural character—from private peninsulas to crowning metropolitan triplexes."
              action={
                <Button variant="outlineLight" to="/collections">
                  <span>Explore All Collections</span>
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                </Button>
              }
            />
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-6">
            {collections.map((collection, idx) => {
              const spanClass = idx < 2 ? 'lg:col-span-3' : 'lg:col-span-2';
              return (
                <Reveal
                  key={collection.id}
                  delay={idx * 0.07}
                  className={spanClass}
                >
                  <Link
                    to={`/collections/${collection.slug}`}
                    className="group flex h-full flex-col border border-[#F7F5F0]/12 bg-[#222320] transition-colors hover:border-[#B69A69]/65"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <LuxuryImage
                        src={collection.coverImage}
                        alt={collection.title}
                        className="h-full w-full"
                        imgClassName="transition-transform duration-700 group-hover:scale-[1.05]"
                      />
                      <span className="absolute left-4 top-4 bg-[#171816]/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B69A69]">
                        {collection.propertyCount} Residences
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B69A69]">
                          {collection.subtitle}
                        </p>
                        <h3 className="mt-2 font-serif text-2xl font-normal text-[#F7F5F0] group-hover:text-[#B69A69] transition-colors">
                          {collection.title}
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-[#E8E1D5]/75">
                          {collection.shortDescription}
                        </p>
                      </div>

                      <span className="mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F7F5F0] group-hover:text-[#B69A69]">
                        <span>View Collection</span>
                        <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.6} />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 5.7 WHY VIMROLL */}
      <section className="py-20 sm:py-28">
        <Container>
          <Reveal>
            <SectionHeading
              align="center"
              eyebrow="Why VIMROLL"
              title="Discretion, Craft, and Global Reach"
              description="Designed for discerning buyers and international collectors seeking a calmer, more intelligent way to evaluate extraordinary homes."
            />
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_VIMROLL_PILLARS.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <Reveal key={pillar.title} delay={idx * 0.07}>
                  <div className="flex h-full flex-col border border-[#E8E1D5] bg-white p-7 transition-colors hover:border-[#B69A69]/70">
                    <div className="flex h-11 w-11 items-center justify-center border border-[#E8E1D5] bg-[#F7F5F0] text-[#B69A69]">
                      <Icon className="h-5 w-5" strokeWidth={1.4} />
                    </div>
                    <h3 className="mt-6 font-serif text-2xl font-normal text-[#171816]">
                      {pillar.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#41413D]/85">
                      {pillar.description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 5.8 DARK CALL TO ACTION */}
      <section className="relative overflow-hidden bg-[#171816] py-24 text-[#F7F5F0] sm:py-32">
        <div className="pointer-events-none absolute inset-0 opacity-25">
          <img
            src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1800&q=80"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#171816]/80" />
        </div>

        <Container className="relative z-10 text-center">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#B69A69]">
              Private Client Advisory
            </p>
            <h2 className="mx-auto mt-4 max-w-3xl font-serif text-3xl font-normal leading-[1.12] text-[#F7F5F0] sm:text-5xl">
              Your Next Chapter Begins With the Right Address.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-[#E8E1D5]/80 sm:text-base">
              Connect with our regional advisors in London, Dubai, New York, or Lagos to
              discuss bespoke acquisitions, private viewings, or portfolio representation.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Button variant="gold" size="lg" to="/contact">
                Speak With Our Consultants
              </Button>
              <Button variant="outlineLight" size="lg" to="/properties">
                Browse Portfolio
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </PageTransition>
  );
}

