import { Link } from 'react-router-dom';
import { Check, Minus, Trash2, ArrowUpRight } from 'lucide-react';
import { LuxuryImage } from '../../components/common/LuxuryImage';
import { formatArea, formatPrice, formatPricePerSqm } from '../../utils/formatters';
import { usePropertyStore } from '../../store/usePropertyStore';

export function ComparisonMatrix({ properties = [], onNavigate }) {
  const removeCompare = usePropertyStore((state) => state.removeCompare);

  if (properties.length < 2) {
    return (
      <div className="border border-[#E8E1D5] bg-[#F7F5F0] p-8 text-center">
        <p className="font-serif text-2xl text-[#171816]">
          Select at least two residences to compare side by side.
        </p>
        <p className="mt-2 text-sm text-[#41413D]/80">
          Use the compare icon on any residence card across Properties or Saved Properties.
        </p>
      </div>
    );
  }

  // Collect union of key amenities across compared properties (up to 10)
  const allAmenities = Array.from(
    new Set(properties.flatMap((p) => p.amenities || []))
  ).slice(0, 10);

  return (
    <div className="overflow-x-auto border border-[#E8E1D5] bg-white">
      <table className="w-full min-w-[680px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-[#E8E1D5] bg-[#F7F5F0]/65">
            <th className="sticky left-0 z-10 w-48 border-r border-[#E8E1D5] bg-[#F7F5F0] p-5 align-bottom text-[11px] font-semibold uppercase tracking-[0.2em] text-[#41413D]">
              Specification
            </th>
            {properties.map((property) => (
              <th
                key={property.id}
                className="min-w-[230px] border-r border-[#E8E1D5] p-5 align-top last:border-r-0"
              >
                <div className="relative mb-4 aspect-[16/10] overflow-hidden">
                  <LuxuryImage
                    src={property.images[0]}
                    alt={property.title}
                    className="h-full w-full"
                  />
                  <button
                    type="button"
                    onClick={() => removeCompare(property.id)}
                    aria-label={`Remove ${property.title} from comparison`}
                    className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center bg-[#171816]/80 text-[#F7F5F0] transition-colors hover:bg-[#B69A69] hover:text-[#171816]"
                  >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </button>
                </div>

                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B69A69]">
                  {property.location.city}, {property.location.country}
                </p>
                <Link
                  to={`/properties/${property.slug}`}
                  onClick={onNavigate}
                  className="mt-1 inline-flex items-center gap-1.5 font-serif text-xl font-normal text-[#171816] transition-colors hover:text-[#B69A69]"
                >
                  <span>{property.title}</span>
                  <ArrowUpRight className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                </Link>
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-[#E8E1D5]">
          <tr>
            <td className="sticky left-0 z-10 border-r border-[#E8E1D5] bg-[#F7F5F0] px-5 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#41413D]">
              Guide Price
            </td>
            {properties.map((p) => (
              <td
                key={p.id}
                className="border-r border-[#E8E1D5] px-5 py-4 font-semibold tabular-nums text-[#171816] last:border-r-0"
              >
                {formatPrice(p.price, p.currency)}
              </td>
            ))}
          </tr>

          <tr>
            <td className="sticky left-0 z-10 border-r border-[#E8E1D5] bg-[#F7F5F0] px-5 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#41413D]">
              Price / Area
            </td>
            {properties.map((p) => (
              <td
                key={p.id}
                className="border-r border-[#E8E1D5] px-5 py-4 tabular-nums text-[#41413D] last:border-r-0"
              >
                {formatPricePerSqm(p.price, p.area)}
              </td>
            ))}
          </tr>

          <tr>
            <td className="sticky left-0 z-10 border-r border-[#E8E1D5] bg-[#F7F5F0] px-5 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#41413D]">
              Location
            </td>
            {properties.map((p) => (
              <td
                key={p.id}
                className="border-r border-[#E8E1D5] px-5 py-4 text-[#41413D] last:border-r-0"
              >
                {p.location.neighbourhood}, {p.location.city}
              </td>
            ))}
          </tr>

          <tr>
            <td className="sticky left-0 z-10 border-r border-[#E8E1D5] bg-[#F7F5F0] px-5 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#41413D]">
              Property Type
            </td>
            {properties.map((p) => (
              <td
                key={p.id}
                className="border-r border-[#E8E1D5] px-5 py-4 text-[#171816] last:border-r-0"
              >
                {p.propertyType}
              </td>
            ))}
          </tr>

          <tr>
            <td className="sticky left-0 z-10 border-r border-[#E8E1D5] bg-[#F7F5F0] px-5 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#41413D]">
              Bedrooms
            </td>
            {properties.map((p) => (
              <td
                key={p.id}
                className="border-r border-[#E8E1D5] px-5 py-4 tabular-nums text-[#171816] last:border-r-0"
              >
                {p.bedrooms} Bedrooms
              </td>
            ))}
          </tr>

          <tr>
            <td className="sticky left-0 z-10 border-r border-[#E8E1D5] bg-[#F7F5F0] px-5 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#41413D]">
              Bathrooms
            </td>
            {properties.map((p) => (
              <td
                key={p.id}
                className="border-r border-[#E8E1D5] px-5 py-4 tabular-nums text-[#171816] last:border-r-0"
              >
                {p.bathrooms} Bathrooms
              </td>
            ))}
          </tr>

          <tr>
            <td className="sticky left-0 z-10 border-r border-[#E8E1D5] bg-[#F7F5F0] px-5 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#41413D]">
              Interior Area
            </td>
            {properties.map((p) => (
              <td
                key={p.id}
                className="border-r border-[#E8E1D5] px-5 py-4 tabular-nums text-[#171816] last:border-r-0"
              >
                {formatArea(p.area, p.areaUnit, true)}
              </td>
            ))}
          </tr>

          <tr>
            <td className="sticky left-0 z-10 border-r border-[#E8E1D5] bg-[#F7F5F0] px-5 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#41413D]">
              Year Built
            </td>
            {properties.map((p) => (
              <td
                key={p.id}
                className="border-r border-[#E8E1D5] px-5 py-4 tabular-nums text-[#41413D] last:border-r-0"
              >
                {p.yearBuilt || '—'}
              </td>
            ))}
          </tr>

          {allAmenities.map((amenity) => (
            <tr key={amenity}>
              <td className="sticky left-0 z-10 border-r border-[#E8E1D5] bg-[#F7F5F0] px-5 py-3.5 text-xs text-[#41413D]">
                {amenity}
              </td>
              {properties.map((p) => {
                const hasAmenity = p.amenities?.includes(amenity);
                return (
                  <td
                    key={p.id}
                    className="border-r border-[#E8E1D5] px-5 py-3.5 last:border-r-0"
                  >
                    {hasAmenity ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#171816]">
                        <Check className="h-4 w-4 text-[#B69A69]" strokeWidth={1.8} />
                        Included
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-[#41413D]/40">
                        <Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

