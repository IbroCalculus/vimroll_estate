import { Suspense, lazy, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Building,
  Calendar,
  Check,
  CheckCircle2,
  Heart,
  MapPin,
  Maximize2,
  Scale,
  Share2,
} from 'lucide-react';
import { PageMeta } from '../components/common/PageMeta';
import { Container } from '../components/common/Container';
import { Loader } from '../components/common/Loader';
import { EmptyState } from '../components/common/EmptyState';
import { PageTransition } from '../components/animations/PageTransition';
import { PropertyGallery } from '../components/property/PropertyGallery';
import { EnquiryPanel } from '../components/property/EnquiryPanel';
import { PropertyCard } from '../components/property/PropertyCard';
import { AcquisitionCalculator } from '../components/property/AcquisitionCalculator';
import { usePropertyDetailsQuery } from '../features/properties/useProperties';
import { usePropertyStore } from '../store/usePropertyStore';
import {
  formatArea,
  formatPrice,
  formatPricePerSqm,
} from '../utils/formatters';
import { trackInteraction } from '../utils/analytics';

const PropertyMap = lazy(() =>
  import('../components/property/PropertyMap').then((mod) => ({
    default: mod.PropertyMap,
  }))
);

export default function PropertyDetails() {
  const { slug } = useParams();
  const [copiedShare, setCopiedShare] = useState(false);

  const { data: property, isLoading } = usePropertyDetailsQuery(slug);

  const savedIds = usePropertyStore((state) => state.savedIds);
  const compareIds = usePropertyStore((state) => state.compareIds);
  const currency = usePropertyStore((state) => state.currency);
  const areaUnit = usePropertyStore((state) => state.areaUnit);
  const toggleSaved = usePropertyStore((state) => state.toggleSaved);
  const toggleCompare = usePropertyStore((state) => state.toggleCompare);
  const pushToast = usePropertyStore((state) => state.pushToast);

  if (isLoading) {
    return (
      <div className="pt-32">
        <Loader label="Preparing property dossier..." />
      </div>
    );
  }

  if (!property) {
    return (
      <PageTransition>
        <PageMeta title="Residence Not Found" />
        <Container className="pt-36 pb-24">
          <EmptyState
            eyebrow="404 — Portfolio Lookup"
            title="This residence dossier could not be found."
            description="The link may have changed or the residence may no longer be publicly listed."
            actionLabel="Return to All Properties"
            actionTo="/properties"
          />
        </Container>
      </PageTransition>
    );
  }

  const isSaved = savedIds.includes(property.id);
  const isCompared = compareIds.includes(property.id);

  const handleShare = async () => {
    const shareUrl = window.location.href;
    trackInteraction('property_shared', {
      reference: property.reference,
      title: property.title,
    });
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${property.title} | VIMROLL Estate`,
          text: property.shortSummary,
          url: shareUrl,
        });
        return;
      } catch {
        // User cancelled or fallback to clipboard
      }
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedShare(true);
      pushToast({
        title: 'Property link copied to clipboard',
        detail: property.title,
      });
      setTimeout(() => setCopiedShare(false), 2600);
    }
  };

  const scrollToEnquiry = () => {
    trackInteraction('mobile_sticky_enquiry_clicked', {
      reference: property.reference,
    });
    const el = document.getElementById('property-enquiry-panel');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <PageTransition>
      <PageMeta
        title={`${property.title} — ${property.location.city}`}
        description={property.shortSummary}
      />

      <article className="pt-24 pb-20 sm:pt-32 sm:pb-28">
        <Container>
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs text-[#41413D]/75"
          >
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/properties"
                className="inline-flex items-center gap-1.5 font-medium uppercase tracking-[0.16em] text-[#171816] hover:text-[#B69A69]"
              >
                <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.6} />
                <span>Portfolio</span>
              </Link>
              <span>/</span>
              <Link
                to={`/properties?location=${encodeURIComponent(property.location.city)}`}
                className="hover:text-[#171816]"
              >
                {property.location.city}
              </Link>
              <span>/</span>
              <span className="line-clamp-1 text-[#171816]">{property.title}</span>
            </div>

            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#41413D]">
              Ref: {property.reference}
            </span>
          </nav>

          {/* Property Header */}
          <header className="mb-8 flex flex-col justify-between gap-6 border-b border-[#E8E1D5] pb-8 lg:flex-row lg:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                {property.badge && (
                  <span className="bg-[#171816] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B69A69]">
                    {property.badge}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.18em] text-[#B69A69]">
                  <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={1.6} />
                  <span>{property.location.address}</span>
                </span>
              </div>

              <h1 className="mt-3 font-serif text-3xl font-normal leading-tight text-[#171816] sm:text-5xl">
                {property.title}
              </h1>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-5 lg:justify-end">
              <div className="lg:text-right">
                <p className="text-2xl font-semibold tabular-nums text-[#171816] sm:text-3xl">
                  {formatPrice(property.price, currency)}
                </p>
                <p className="mt-0.5 text-xs tabular-nums text-[#41413D]/75">
                  {formatPricePerSqm(property.price, property.area, currency, areaUnit)}
                </p>
              </div>

              {/* Action Buttons: Compare, Save, Share */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleCompare(property.id, property.title)}
                  className={`inline-flex min-h-[44px] items-center gap-2 border px-3.5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] transition-colors sm:px-4 ${
                    isCompared
                      ? 'border-[#B69A69] bg-[#B69A69] text-[#171816]'
                      : 'border-[#E8E1D5] bg-white text-[#171816] hover:border-[#171816]'
                  }`}
                >
                  <Scale className="h-3.5 w-3.5" strokeWidth={1.6} />
                  <span className="hidden sm:inline">
                    {isCompared ? 'Comparing' : 'Compare'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleSaved(property.id, property.title)}
                  className={`inline-flex min-h-[44px] items-center gap-2 border px-3.5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] transition-colors sm:px-4 ${
                    isSaved
                      ? 'border-[#171816] bg-[#171816] text-[#F7F5F0]'
                      : 'border-[#E8E1D5] bg-white text-[#171816] hover:border-[#171816]'
                  }`}
                >
                  <Heart
                    className={`h-3.5 w-3.5 ${
                      isSaved ? 'fill-[#B69A69] text-[#B69A69]' : ''
                    }`}
                    strokeWidth={1.6}
                  />
                  <span>{isSaved ? 'Saved' : 'Save'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Share property link"
                  className="inline-flex min-h-[44px] items-center gap-2 border border-[#E8E1D5] bg-white px-3.5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#171816] transition-colors hover:border-[#171816] sm:px-4"
                >
                  {copiedShare ? (
                    <>
                      <CheckCircle2
                        className="h-3.5 w-3.5 text-[#B69A69]"
                        strokeWidth={1.6}
                      />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="h-3.5 w-3.5" strokeWidth={1.6} />
                      <span className="hidden sm:inline">Share</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </header>

          {/* Gallery & Lightbox */}
          <PropertyGallery images={property.images} title={property.title} />

          {/* Two-Column Body: Specifications & Narrative vs Sticky Consultant Panel */}
          <div className="mt-10 grid grid-cols-1 gap-12 sm:mt-12 lg:grid-cols-12">
            <div className="space-y-12 lg:col-span-7 xl:col-span-8">
              {/* Architectural Overview Bar */}
              <section
                aria-label="Key property specifications"
                className="grid grid-cols-2 gap-4 border border-[#E8E1D5] bg-white p-5 sm:grid-cols-5 sm:p-6"
              >
                <div>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#41413D]/70">
                    <BedDouble className="h-3.5 w-3.5 text-[#B69A69]" />
                    Bedrooms
                  </span>
                  <p className="mt-1 font-serif text-2xl text-[#171816] tabular-nums">
                    {property.bedrooms}
                  </p>
                </div>

                <div>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#41413D]/70">
                    <Bath className="h-3.5 w-3.5 text-[#B69A69]" />
                    Bathrooms
                  </span>
                  <p className="mt-1 font-serif text-2xl text-[#171816] tabular-nums">
                    {property.bathrooms}
                  </p>
                </div>

                <div>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#41413D]/70">
                    <Maximize2 className="h-3.5 w-3.5 text-[#B69A69]" />
                    Floor Area
                  </span>
                  <p className="mt-1 font-serif text-xl text-[#171816] tabular-nums sm:text-2xl">
                    {formatArea(property.area, areaUnit)}
                  </p>
                </div>

                <div>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#41413D]/70">
                    <Building className="h-3.5 w-3.5 text-[#B69A69]" />
                    Typology
                  </span>
                  <p className="mt-1 font-serif text-xl text-[#171816] sm:text-2xl">
                    {property.propertyType}
                  </p>
                </div>

                <div className="col-span-2 border-t border-[#E8E1D5]/70 pt-3 sm:col-span-1 sm:border-t-0 sm:pt-0">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#41413D]/70">
                    <Calendar className="h-3.5 w-3.5 text-[#B69A69]" />
                    Completed
                  </span>
                  <p className="mt-1 font-serif text-2xl text-[#171816] tabular-nums">
                    {property.yearBuilt || '—'}
                  </p>
                </div>
              </section>

              {/* Editorial Description */}
              <section>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#B69A69]">
                  Architectural Narrative
                </p>
                <h2 className="mt-2 font-serif text-3xl font-normal text-[#171816]">
                  About the Residence
                </h2>
                <p className="mt-4 font-serif text-xl italic leading-relaxed text-[#171816]/90">
                  {property.shortSummary}
                </p>
                <div className="mt-5 space-y-4 text-sm leading-relaxed text-[#41413D] sm:text-base">
                  {property.description.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>

                {property.collections?.length > 0 && (
                  <div className="mt-7 flex flex-wrap items-center gap-2">
                    <span className="mr-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#41413D]/70">
                      Featured In:
                    </span>
                    {property.collections.map((colSlug) => (
                      <Link
                        key={colSlug}
                        to={`/collections/${colSlug}`}
                        className="border border-[#E8E1D5] bg-white px-3 py-1.5 text-xs capitalize text-[#171816] transition-colors hover:border-[#B69A69]"
                      >
                        {colSlug.replace(/-/g, ' ')}
                      </Link>
                    ))}
                  </div>
                )}
              </section>

              {/* Amenities */}
              <section className="border-t border-[#E8E1D5] pt-10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#B69A69]">
                  Residence Appointments
                </p>
                <h2 className="mt-2 font-serif text-3xl font-normal text-[#171816]">
                  Features & Amenities
                </h2>

                <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5">
                  {property.amenities.map((amenity) => (
                    <li
                      key={amenity}
                      className="flex items-center gap-3 border border-[#E8E1D5] bg-white px-4 py-3.5 text-sm text-[#171816]"
                    >
                      <Check
                        className="h-4 w-4 shrink-0 text-[#B69A69]"
                        strokeWidth={1.8}
                      />
                      <span>{amenity}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Private Wealth Financing Estimator */}
              <AcquisitionCalculator usdPrice={property.price} />

              {/* Location Map & Neighbourhood Landmarks */}
              <section className="border-t border-[#E8E1D5] pt-10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#B69A69]">
                  Setting & Enclave
                </p>
                <h2 className="mt-2 font-serif text-3xl font-normal text-[#171816]">
                  {property.location.neighbourhood}, {property.location.city}
                </h2>

                <div className="mt-6">
                  <Suspense fallback={<Loader label="Loading estate map..." />}>
                    <PropertyMap
                      properties={[property]}
                      highlightedId={property.id}
                      singleMode
                      className="h-[320px] w-full sm:h-[380px]"
                    />
                  </Suspense>
                </div>

                {property.landmarks?.length > 0 && (
                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {property.landmarks.map((landmark) => (
                      <div
                        key={landmark.name}
                        className="border border-[#E8E1D5] bg-white p-4"
                      >
                        <p className="text-xs font-semibold text-[#171816]">
                          {landmark.name}
                        </p>
                        <p className="mt-1 text-xs text-[#B69A69]">
                          {landmark.distance}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* Sticky Enquiry & Consultant Sidebar */}
            <div
              id="property-enquiry-panel"
              className="scroll-mt-24 lg:col-span-5 xl:col-span-4"
            >
              <div className="lg:sticky lg:top-28">
                <EnquiryPanel property={property} />
              </div>
            </div>
          </div>

          {/* Similar Properties */}
          {property.similarProperties?.length > 0 && (
            <section className="mt-20 border-t border-[#E8E1D5] pt-16">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#B69A69]">
                Further Discovery
              </p>
              <h2 className="mt-2 font-serif text-3xl font-normal text-[#171816] sm:text-4xl">
                Comparable Residences
              </h2>

              <div className="mt-10 grid grid-cols-1 gap-7 md:grid-cols-3">
                {property.similarProperties.map((similar) => (
                  <PropertyCard key={similar.id} property={similar} />
                ))}
              </div>
            </section>
          )}
        </Container>
      </article>

      {/* Mobile Sticky Bottom Enquiry Action Bar */}
      {compareIds.length === 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#E8E1D5] bg-[#F7F5F0]/96 px-4 py-3 backdrop-blur-md shadow-[0_-8px_30px_rgba(23,24,22,0.08)] lg:hidden">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#41413D]/75">
                Guide Price
              </p>
              <p className="truncate text-base font-semibold tabular-nums text-[#171816]">
                {formatPrice(property.price, currency)}
              </p>
            </div>
            <button
              type="button"
              onClick={scrollToEnquiry}
              className="inline-flex min-h-[44px] shrink-0 items-center justify-center bg-[#171816] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F7F5F0] transition-colors hover:bg-[#B69A69] hover:text-[#171816]"
            >
              Enquire / Viewing
            </button>
          </div>
        </div>
      )}
    </PageTransition>
  );
}
