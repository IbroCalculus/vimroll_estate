import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { ArrowUpRight } from 'lucide-react';
import { formatArea, formatPrice } from '../../utils/formatters';

function MapBoundsUpdater({ properties, singleMode }) {
  const map = useMap();

  useEffect(() => {
    if (!properties || properties.length === 0) return;

    if (singleMode || properties.length === 1) {
      const { lat, lng } = properties[0].location.coordinates;
      map.setView([lat, lng], singleMode ? 14 : 12, { animate: true });
      return;
    }

    const bounds = L.latLngBounds(
      properties.map((p) => [p.location.coordinates.lat, p.location.coordinates.lng])
    );
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 12 });
  }, [map, properties, singleMode]);

  return null;
}

function createLuxuryPin(priceLabel, isActive) {
  return L.divIcon({
    className: 'vimroll-map-pin',
    html: `<div class="vimroll-pin-pill ${isActive ? 'is-active' : ''}">${priceLabel}</div>`,
    iconSize: [76, 30],
    iconAnchor: [38, 15],
    popupAnchor: [0, -16],
  });
}

export function PropertyMap({
  properties = [],
  highlightedId = null,
  singleMode = false,
  className = 'h-[520px] w-full',
}) {
  const defaultCenter = useMemo(() => {
    if (properties.length > 0) {
      return [
        properties[0].location.coordinates.lat,
        properties[0].location.coordinates.lng,
      ];
    }
    return [25.1972, 55.2744];
  }, [properties]);

  return (
    <div className={`relative overflow-hidden border border-[#E8E1D5] bg-[#EAE5DC] ${className}`}>
      <MapContainer
        center={defaultCenter}
        zoom={singleMode ? 14 : 3}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapBoundsUpdater properties={properties} singleMode={singleMode} />

        {properties.map((property) => {
          const isActive = highlightedId === property.id;
          const compactPrice = formatPrice(property.price, property.currency, true);

          return (
            <Marker
              key={property.id}
              position={[
                property.location.coordinates.lat,
                property.location.coordinates.lng,
              ]}
              icon={createLuxuryPin(compactPrice, isActive)}
            >
              <Popup>
                <div className="overflow-hidden bg-white">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="h-36 w-full object-cover"
                  />
                  <div className="p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B69A69]">
                      {property.location.city}, {property.location.country}
                    </p>
                    <h4 className="mt-1 font-serif text-lg font-normal leading-tight text-[#171816]">
                      {property.title}
                    </h4>
                    <p className="mt-1.5 text-sm font-semibold tabular-nums text-[#171816]">
                      {formatPrice(property.price, property.currency)}
                    </p>
                    <p className="mt-1 text-xs text-[#41413D]">
                      {property.bedrooms} Beds · {property.bathrooms} Baths ·{' '}
                      {formatArea(property.area, property.areaUnit)}
                    </p>
                    {!singleMode && (
                      <Link
                        to={`/properties/${property.slug}`}
                        className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#171816] hover:text-[#B69A69]"
                      >
                        <span>Explore Residence</span>
                        <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.6} />
                      </Link>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

