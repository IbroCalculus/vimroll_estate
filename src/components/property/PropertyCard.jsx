import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowUpRight,
  Bath,
  BedDouble,
  ChevronLeft,
  ChevronRight,
  Film,
  Heart,
  Maximize2,
  Scale,
} from 'lucide-react';
import { LuxuryImage } from '../common/LuxuryImage';
import { ArchitecturalVideoPlayer } from './ArchitecturalVideoPlayer';
import { formatArea, formatPrice } from '../../utils/formatters';
import { trackInteraction } from '../../utils/analytics';
import { usePropertyStore } from '../../store/usePropertyStore';
import { useReducedMotionPref } from '../../hooks/useReducedMotionPref';

export function PropertyCard({
  property,
  layout = 'grid',
  isHighlighted = false,
  onMouseEnter,
  onMouseLeave,
}) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [showInlineFilm, setShowInlineFilm] = useState(false);
  const [tiltStyle, setTiltStyle] = useState({});
  const cardRef = useRef(null);
  const prefersReducedMotion = useReducedMotionPref();

  const savedIds = usePropertyStore((state) => state.savedIds);
  const compareIds = usePropertyStore((state) => state.compareIds);
  const currency = usePropertyStore((state) => state.currency);
  const areaUnit = usePropertyStore((state) => state.areaUnit);
  const toggleSaved = usePropertyStore((state) => state.toggleSaved);
  const toggleCompare = usePropertyStore((state) => state.toggleCompare);

  const isSaved = savedIds.includes(property.id);
  const isCompared = compareIds.includes(property.id);
  const isList = layout === 'list';

  const previewImages = (property.images || []).slice(0, 4);
  const totalSlides = previewImages.length;

  const handlePrevSlide = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSlideIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    trackInteraction('card_photo_scrubbed', {
      direction: 'prev',
      reference: property.reference,
    });
  };

  const handleNextSlide = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSlideIndex((prev) => (prev + 1) % totalSlides);
    trackInteraction('card_photo_scrubbed', {
      direction: 'next',
      reference: property.reference,
    });
  };

  const handleToggleInlineFilm = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !showInlineFilm;
    setShowInlineFilm(next);
    if (next) {
      trackInteraction('card_inline_film_opened', {
        reference: property.reference,
        title: property.title,
      });
    }
  };

  const handlePointerMove = (e) => {
    if (prefersReducedMotion || isList || !cardRef.current) return;
    if (
      typeof window !== 'undefined' &&
      !window.matchMedia('(hover: hover)').matches
    ) {
      return;
    }
    const rect = cardRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    const rotateY = (relX * 3.8).toFixed(2);
    const rotateX = (-relY * 3.2).toFixed(2);
    setTiltStyle({
      transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
    });
  };

  const handlePointerLeave = () => {
    setTiltStyle({});
    if (onMouseLeave) onMouseLeave();
  };

  return (
    <article
      ref={cardRef}
      id={`property-card-${property.id}`}
      onMouseEnter={onMouseEnter}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      style={tiltStyle}
      className={`group relative flex flex-col border bg-white transition-all duration-300 will-change-transform ${
        isList ? 'md:flex-row' : ''
      } ${
        isHighlighted
          ? 'border-[#B69A69] shadow-[0_18px_42px_rgba(23,24,22,0.12)]'
          : 'border-[#E8E1D5] hover:border-[#B69A69]/70 hover:shadow-[0_16px_38px_rgba(23,24,22,0.07)]'
      }`}
    >
      {/* Image / Inline Film Frame */}
      <div
        className={`relative overflow-hidden ${
          isList
            ? 'aspect-[16/10] md:aspect-auto md:w-[42%] shrink-0'
            : 'aspect-[4/3]'
        }`}
      >
        {showInlineFilm ? (
          <ArchitecturalVideoPlayer
            property={property}
            compact
            onCloseCompact={() => setShowInlineFilm(false)}
          />
        ) : (
          <>
            <Link
              to={`/properties/${property.slug}`}
              aria-label={`View ${property.title}`}
              className="block h-full w-full"
            >
              <LuxuryImage
                src={previewImages[slideIndex] || property.images[0]}
                alt={`${property.title} in ${property.location.city} — Photo ${slideIndex + 1}`}
                className="h-full w-full"
                imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
            </Link>

            {/* Inline Slide Controls */}
            {totalSlides > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  aria-label={`Previous photo of ${property.title}`}
                  className="absolute left-2.5 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center border border-[#F7F5F0]/25 bg-[#171816]/70 text-[#F7F5F0] opacity-85 backdrop-blur-xs transition-all hover:border-[#B69A69] hover:bg-[#171816] hover:text-[#B69A69] lg:opacity-0 lg:group-hover:opacity-100"
                >
                  <ChevronLeft className="h-4 w-4" strokeWidth={1.6} />
                </button>

                <button
                  type="button"
                  onClick={handleNextSlide}
                  aria-label={`Next photo of ${property.title}`}
                  className="absolute right-2.5 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center border border-[#F7F5F0]/25 bg-[#171816]/70 text-[#F7F5F0] opacity-85 backdrop-blur-xs transition-all hover:border-[#B69A69] hover:bg-[#171816] hover:text-[#B69A69] lg:opacity-0 lg:group-hover:opacity-100"
                >
                  <ChevronRight className="h-4 w-4" strokeWidth={1.6} />
                </button>

                {/* Minimalist Segmented Indicator */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-3.5 right-3.5 flex items-center gap-1"
                >
                  {previewImages.map((_, idx) => (
                    <span
                      key={idx}
                      className={`h-1 transition-all duration-300 ${
                        idx === slideIndex
                          ? 'w-4 bg-[#B69A69]'
                          : 'w-1.5 bg-[#F7F5F0]/60'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Top Left Badge */}
            {property.badge && (
              <span className="pointer-events-none absolute left-3.5 top-3.5 bg-[#171816]/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F7F5F0] backdrop-blur-xs">
                {property.badge}
              </span>
            )}

            {/* Top Right Quick Actions (Film Preview + Compare + Save) */}
            <div className="absolute right-3 top-3 flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleToggleInlineFilm}
                aria-label={`Preview architectural film for ${property.title}`}
                title="Preview 4K Architectural Film"
                className="inline-flex h-9 items-center gap-1.5 border border-[#F7F5F0]/30 bg-[#171816]/75 px-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#F7F5F0] backdrop-blur-xs transition-colors hover:border-[#B69A69] hover:text-[#B69A69]"
              >
                <Film className="h-3.5 w-3.5 text-[#B69A69]" strokeWidth={1.6} />
                <span className="hidden sm:inline">Film</span>
              </button>

              <button
                type="button"
                onClick={() => toggleCompare(property.id, property.title)}
                aria-label={
                  isCompared
                    ? `Remove ${property.title} from comparison`
                    : `Add ${property.title} to comparison`
                }
                title={isCompared ? 'Remove from comparison' : 'Add to comparison'}
                className={`flex h-9 w-9 sm:h-9 sm:w-9 items-center justify-center border backdrop-blur-xs transition-colors ${
                  isCompared
                    ? 'border-[#B69A69] bg-[#B69A69] text-[#171816]'
                    : 'border-[#F7F5F0]/30 bg-[#171816]/65 text-[#F7F5F0] hover:border-[#B69A69] hover:text-[#B69A69]'
                }`}
              >
                <Scale className="h-3.5 w-3.5" strokeWidth={1.6} />
              </button>

              <motion.button
                type="button"
                whileTap={{ scale: 0.82 }}
                onClick={() => toggleSaved(property.id, property.title)}
                aria-label={
                  isSaved
                    ? `Remove ${property.title} from saved properties`
                    : `Save ${property.title}`
                }
                title={isSaved ? 'Saved' : 'Save residence'}
                className={`flex h-9 w-9 items-center justify-center border backdrop-blur-xs transition-colors ${
                  isSaved
                    ? 'border-[#B69A69] bg-[#171816] text-[#B69A69]'
                    : 'border-[#F7F5F0]/30 bg-[#171816]/65 text-[#F7F5F0] hover:border-[#B69A69] hover:text-[#B69A69]'
                }`}
              >
                <motion.span
                  key={isSaved ? 'saved' : 'unsaved'}
                  initial={{ scale: 0.75 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 18 }}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      isSaved ? 'fill-[#B69A69] text-[#B69A69]' : ''
                    }`}
                    strokeWidth={1.6}
                  />
                </motion.span>
              </motion.button>
            </div>

            {/* Bottom Left Type Tag */}
            <span className="pointer-events-none absolute bottom-3 left-3.5 bg-white/94 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#171816]">
              {property.propertyType}
            </span>
          </>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-7">
        <div>
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-[11px] font-semibold uppercase tracking-[0.22em] text-[#B69A69]">
              {property.location.city}, {property.location.country}
            </p>
            <span className="shrink-0 text-[10px] tracking-[0.14em] text-[#41413D]/55">
              {property.reference}
            </span>
          </div>

          <h3 className="mt-2 font-serif text-2xl font-normal leading-snug text-[#171816]">
            <Link
              to={`/properties/${property.slug}`}
              className="transition-colors group-hover:text-[#977D50]"
            >
              {property.title}
            </Link>
          </h3>

          <p className="mt-1 truncate text-xs text-[#41413D]/75">
            {property.location.neighbourhood}
          </p>

          {isList && property.shortSummary && (
            <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-[#41413D]/85">
              {property.shortSummary}
            </p>
          )}
        </div>

        <div className="mt-5 sm:mt-6">
          <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-5 gap-y-2 border-y border-[#E8E1D5] py-3 text-xs text-[#41413D]">
            <span className="inline-flex items-center gap-1.5 tabular-nums">
              <BedDouble className="h-3.5 w-3.5 text-[#B69A69]" strokeWidth={1.5} />
              {property.bedrooms} Beds
            </span>
            <span className="inline-flex items-center gap-1.5 tabular-nums">
              <Bath className="h-3.5 w-3.5 text-[#B69A69]" strokeWidth={1.5} />
              {property.bathrooms} Baths
            </span>
            <span className="inline-flex items-center gap-1.5 tabular-nums">
              <Maximize2 className="h-3.5 w-3.5 text-[#B69A69]" strokeWidth={1.5} />
              {formatArea(property.area, areaUnit)}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-lg font-semibold tabular-nums text-[#171816]">
              {formatPrice(property.price, currency)}
            </p>

            <Link
              to={`/properties/${property.slug}`}
              className="inline-flex min-h-[36px] items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#171816] transition-colors hover:text-[#B69A69]"
            >
              <span>View Residence</span>
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={1.6}
              />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
