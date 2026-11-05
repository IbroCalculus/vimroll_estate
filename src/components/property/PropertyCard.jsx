import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowUpRight, Bath, BedDouble, Heart, Maximize2, Scale } from 'lucide-react';
import { LuxuryImage } from '../common/LuxuryImage';
import { formatArea, formatPrice } from '../../utils/formatters';
import { usePropertyStore } from '../../store/usePropertyStore';

export function PropertyCard({
  property,
  layout = 'grid',
  isHighlighted = false,
  onMouseEnter,
  onMouseLeave,
}) {
  const savedIds = usePropertyStore((state) => state.savedIds);
  const compareIds = usePropertyStore((state) => state.compareIds);
  const toggleSaved = usePropertyStore((state) => state.toggleSaved);
  const toggleCompare = usePropertyStore((state) => state.toggleCompare);

  const isSaved = savedIds.includes(property.id);
  const isCompared = compareIds.includes(property.id);

  const isList = layout === 'list';

  return (
    <article
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`group relative flex flex-col border bg-white transition-all duration-400 ${
        isList ? 'md:flex-row' : ''
      } ${
        isHighlighted
          ? 'border-[#B69A69] shadow-[0_18px_42px_rgba(23,24,22,0.12)]'
          : 'border-[#E8E1D5] hover:border-[#B69A69]/70 hover:shadow-[0_16px_38px_rgba(23,24,22,0.07)]'
      }`}
    >
      {/* Image Frame */}
      <div
        className={`relative overflow-hidden ${
          isList ? 'aspect-[16/10] md:aspect-auto md:w-[42%] shrink-0' : 'aspect-[4/3]'
        }`}
      >
        <Link
          to={`/properties/${property.slug}`}
          aria-label={`View ${property.title}`}
          className="block h-full w-full"
        >
          <LuxuryImage
            src={property.images[0]}
            alt={`${property.title} in ${property.location.city}, ${property.location.country}`}
            className="h-full w-full"
            imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />
        </Link>

        {/* Top Left Badge */}
        {property.badge && (
          <span className="pointer-events-none absolute left-4 top-4 bg-[#171816]/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F7F5F0] backdrop-blur-xs">
            {property.badge}
          </span>
        )}

        {/* Top Right Quick Actions */}
        <div className="absolute right-3.5 top-3.5 flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleCompare(property.id)}
            aria-label={
              isCompared
                ? `Remove ${property.title} from comparison`
                : `Add ${property.title} to comparison`
            }
            title={isCompared ? 'Remove from comparison' : 'Add to comparison'}
            className={`flex h-9 w-9 items-center justify-center border backdrop-blur-xs transition-colors ${
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
            onClick={() => toggleSaved(property.id)}
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
                className={`h-4 w-4 ${isSaved ? 'fill-[#B69A69] text-[#B69A69]' : ''}`}
                strokeWidth={1.6}
              />
            </motion.span>
          </motion.button>
        </div>

        {/* Bottom Left Type Tag */}
        <span className="pointer-events-none absolute bottom-3.5 left-4 bg-white/92 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#171816]">
          {property.propertyType}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
        <div>
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#B69A69]">
              {property.location.city}, {property.location.country}
            </p>
            <span className="text-[10px] tracking-[0.14em] text-[#41413D]/55">
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

          <p className="mt-1 text-xs text-[#41413D]/75">
            {property.location.neighbourhood}
          </p>

          {isList && property.shortSummary && (
            <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-[#41413D]/85">
              {property.shortSummary}
            </p>
          )}
        </div>

        <div className="mt-6">
          {/* Metrics */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-[#E8E1D5] py-3.5 text-xs text-[#41413D]">
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
              {formatArea(property.area, property.areaUnit)}
            </span>
          </div>

          {/* Price & CTA */}
          <div className="mt-4 flex items-center justify-between gap-4">
            <p className="text-lg font-semibold tabular-nums text-[#171816]">
              {formatPrice(property.price, property.currency)}
            </p>

            <Link
              to={`/properties/${property.slug}`}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#171816] transition-colors hover:text-[#B69A69]"
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

