import { Button } from './Button';

export function EmptyState({
  eyebrow = 'Curated Portfolio',
  title,
  description,
  actionLabel,
  onAction,
  actionTo,
}) {
  return (
    <div className="flex flex-col items-center justify-center border border-[#E8E1D5] bg-white px-6 py-16 text-center sm:px-12 sm:py-24">
      <span className="mb-3 text-[11px] font-semibold uppercase tracking-[0.26em] text-[#B69A69]">
        {eyebrow}
      </span>
      <h3 className="max-w-lg font-serif text-3xl font-normal text-[#171816]">
        {title}
      </h3>
      {description && (
        <p className="mt-3 max-w-md text-sm leading-relaxed text-[#41413D]/80">
          {description}
        </p>
      )}
      {actionLabel && (onAction || actionTo) && (
        <div className="mt-8">
          <Button variant="primary" onClick={onAction} to={actionTo}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

