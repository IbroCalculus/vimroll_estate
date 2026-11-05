import { Link } from 'react-router-dom';
import { Check, Minus, Trash2, ArrowUpRight, MoveHorizontal } from 'lucide-react';
import { LuxuryImage } from '../../components/common/LuxuryImage';
import { formatArea, formatPrice, formatPricePerSqm } from '../../utils/formatters';
import { usePropertyStore } from '../../store/usePropertyStore';

export function ComparisonMatrix({ properties = [], onNavigate }) {
  const removeCompare = usePropertyStore((state) => state.removeCompare);
  const currency = usePropertyStore((state) => state.currency);
  const areaUnit = usePropertyStore((state) => state.areaUnit);

  if (properties.length < 2) {
    return (
      <div className="border border-[#E8E1D5] bg-[#F7F5F0] p-6 text-center sm:p-8">
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
    <div>
      <div className="mb-2.5 flex items-center justify-end gap-1.5 text-[11px] font-medium text-[#41413D]/75 sm:hidden">
        <MoveHorizontal className="h-3.5 w-3.5 text-[#B69A69]" strokeWidth={1.6} />
        <span>Swipe horizontally to compare</span>
      </div>

      <div className="overflow-x-auto border border-[#E8E1D5] bg-white">
        <table className="w-full min-w-[540px] border-collapse text-left text-xs sm:min-w-[680px] sm:text-sm">
          <thead>
            <tr className="border-b border-[#E8E1D5] bg-[#F7F5F0]/65">
              <th className="sticky left-0 z-10 w-32 border-r border-[#E8E1D5] bg-[#F7F5F0] p-3.5 align-bottom text-[10px] font-semibold uppercase tracking-[0.18em] text-[#41413D] sm:w-48 sm:p-5 sm:text-[11px]">
                Specification
              </th>
              {properties.map((property) => (
                <th
                  key={property.id}
                  className="min-w-[195px] border-r border-[#E8E1D5] p-3.5 align-top last:border-r-0 sm:min-w-[230px] sm:p-5"
                >
                  <div className="relative mb-3 aspect-[16/10] overflow-hidden sm:mb-4">
                    <LuxuryImage
                      src={property.images[0]}
                      alt={property.title}
                      className="h-full w-full"
                    />
                    <button
                      type="button"
                      onClick={() => removeCompare(property.id)}
                      aria-label={`Remove ${property.title} from comparison`}
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center bg-[#171816]/85 text-[#F7F5F0] transition-colors hover:bg-[#B69A69] hover:text-[#171816]"
                    >
                      <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </button>
                  </div>

                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B69A69]">
                    {property.location.city}, {property.location.country}
                  </p>
                  <Link
                    to={`/properties/${property.slug}`}
                    onClick={onNavigate}
                    className="mt-1 inline-flex items-center gap-1.5 font-serif text-lg font-normal text-[#171816] transition-colors hover:text-[#B69A69] sm:text-xl"
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
              <td className="sticky left-0 z-10 border-r border-[#E8E1D5] bg-[#F7F5F0] px-3.5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#41413D] sm:px-5 sm:py-4 sm:text-xs">
                Guide Price
              </td>
              {properties.map((p) => (
                <td
                  key={p.id}
                  className="border-r border-[#E8E1D5] px-3.5 py-3.5 font-semibold tabular-nums text-[#171816] last:border-r-0 sm:px-5 sm:py-4"
                >
                  {formatPrice(p.price, currency)}
                </td>
              ))}
            </tr>

            <tr>
              <td className="sticky left-0 z-10 border-r border-[#E8E1D5] bg-[#F7F5F0] px-3.5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#41413D] sm:px-5 sm:py-4 sm:text-xs">
                Price / Area
              </td>
              {properties.map((p) => (
                <td
                  key={p.id}
                  className="border-r border-[#E8E1D5] px-3.5 py-3.5 tabular-nums text-[#41413D] last:border-r-0 sm:px-5 sm:py-4"
                >
                  {formatPricePerSqm(p.price, p.area, currency, areaUnit)}
                </td>
              ))}
            </tr>

            <tr>
              <td className="sticky left-0 z-10 border-r border-[#E8E1D5] bg-[#F7F5F0] px-3.5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#41413D] sm:px-5 sm:py-4 sm:text-xs">
                Location
              </td>
              {properties.map((p) => (
                <td
                  key={p.id}
                  className="border-r border-[#E8E1D5] px-3.5 py-3.5 text-[#41413D] last:border-r-0 sm:px-5 sm:py-4"
                >
                  {p.location.neighbourhood}, {p.location.city}
                </td>
              ))}
            </tr>

            <tr>
              <td className="sticky left-0 z-10 border-r border-[#E8E1D5] bg-[#F7F5F0] px-3.5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#41413D] sm:px-5 sm:py-4 sm:text-xs">
                Property Type
              </td>
              {properties.map((p) => (
                <td
                  key={p.id}
                  className="border-r border-[#E8E1D5] px-3.5 py-3.5 text-[#171816] last:border-r-0 sm:px-5 sm:py-4"
                >
                  {p.propertyType}
                </td>
              ))}
            </tr>

            <tr>
              <td className="sticky left-0 z-10 border-r border-[#E8E1D5] bg-[#F7F5F0] px-3.5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#41413D] sm:px-5 sm:py-4 sm:text-xs">
                Bedrooms
              </td>
              {properties.map((p) => (
                <td
                  key={p.id}
                  className="border-r border-[#E8E1D5] px-3.5 py-3.5 tabular-nums text-[#171816] last:border-r-0 sm:px-5 sm:py-4"
                >
                  {p.bedrooms} Bedrooms
                </td>
              ))}
            </tr>

            <tr>
              <td className="sticky left-0 z-10 border-r border-[#E8E1D5] bg-[#F7F5F0] px-3.5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#41413D] sm:px-5 sm:py-4 sm:text-xs">
                Bathrooms
              </td>
              {properties.map((p) => (
                <td
                  key={p.id}
                  className="border-r border-[#E8E1D5] px-3.5 py-3.5 tabular-nums text-[#171816] last:border-r-0 sm:px-5 sm:py-4"
                >
                  {p.bathrooms} Bathrooms
                </td>
              ))}
            </tr>

            <tr>
              <td className="sticky left-0 z-10 border-r border-[#E8E1D5] bg-[#F7F5F0] px-3.5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#41413D] sm:px-5 sm:py-4 sm:text-xs">
                Interior Area
              </td>
              {properties.map((p) => (
                <td
                  key={p.id}
                  className="border-r border-[#E8E1D5] px-3.5 py-3.5 tabular-nums text-[#171816] last:border-r-0 sm:px-5 sm:py-4"
                >
                  {formatArea(p.area, areaUnit, true)}
                </td>
              ))}
            </tr>

            <tr>
              <td className="sticky left-0 z-10 border-r border-[#E8E1D5] bg-[#F7F5F0] px-3.5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#41413D] sm:px-5 sm:py-4 sm:text-xs">
                Year Built
              </td>
              {properties.map((p) => (
                <td
                  key={p.id}
                  className="border-r border-[#E8E1D5] px-3.5 py-3.5 tabular-nums text-[#41413D] last:border-r-0 sm:px-5 sm:py-4"
                >
                  {p.yearBuilt || '—'}
                </td>
              ))}
            </tr>

            {allAmenities.map((amenity) => (
              <tr key={amenity}>
                <td className="sticky left-0 z-10 border-r border-[#E8E1D5] bg-[#F7F5F0] px-3.5 py-3 text-xs text-[#41413D] sm:px-5 sm:py-3.5">
                  {amenity}
                </td>
                {properties.map((p) => {
                  const hasAmenity = p.amenities?.includes(amenity);
                  return (
                    <td
                      key={p.id}
                      className="border-r border-[#E8E1D5] px-3.5 py-3 last:border-r-0 sm:px-5 sm:py-3.5"
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
    </div>
  );
}
