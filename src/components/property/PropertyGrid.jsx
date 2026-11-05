import { PropertyCard } from './PropertyCard';
import { Reveal } from '../animations/Reveal';

export function PropertyGrid({
  properties = [],
  layout = 'grid',
  columns = 3,
  highlightedId = null,
  onHoverProperty,
}) {
  const gridColsClass =
    layout === 'list'
      ? 'grid-cols-1'
      : columns === 2
        ? 'grid-cols-1 md:grid-cols-2'
        : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3';

  return (
    <div className={`grid gap-7 ${gridColsClass}`}>
      {properties.map((property, index) => (
        <Reveal key={property.id} delay={Math.min(index * 0.05, 0.25)}>
          <PropertyCard
            property={property}
            layout={layout}
            isHighlighted={highlightedId === property.id}
            onMouseEnter={() => onHoverProperty?.(property.id)}
            onMouseLeave={() => onHoverProperty?.(null)}
          />
        </Reveal>
      ))}
    </div>
  );
}

