export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  light = false,
  action,
  className = '',
}) {
  const isCentered = align === 'center';

  return (
    <div
      className={`flex flex-col gap-5 ${
        isCentered
          ? 'items-center text-center max-w-3xl mx-auto'
          : 'md:flex-row md:items-end md:justify-between'
      } ${className}`}
    >
      <div className={isCentered ? 'max-w-2xl' : 'max-w-2xl'}>
        {eyebrow && (
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.26em] text-[#B69A69]">
            {eyebrow}
          </p>
        )}
        <h2
          className={`font-serif text-3xl sm:text-4xl lg:text-[2.85rem] font-normal leading-[1.1] ${
            light ? 'text-[#F7F5F0]' : 'text-[#171816]'
          }`}
        >
          {title}
        </h2>
        {description && (
          <p
            className={`mt-4 text-sm sm:text-base leading-relaxed ${
              light ? 'text-[#E8E1D5]/80' : 'text-[#41413D]/85'
            }`}
          >
            {description}
          </p>
        )}
      </div>

      {action && !isCentered && <div className="shrink-0">{action}</div>}
    </div>
  );
}

