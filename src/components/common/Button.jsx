import { Link } from 'react-router-dom';

const VARIANT_CLASSES = {
  primary:
    'bg-[#171816] text-[#F7F5F0] border border-[#171816] hover:bg-[#272824] hover:border-[#B69A69]',
  gold:
    'bg-[#B69A69] text-[#171816] border border-[#B69A69] hover:bg-[#CBB389] hover:border-[#CBB389]',
  ivory:
    'bg-[#F7F5F0] text-[#171816] border border-[#F7F5F0] hover:bg-white hover:border-[#B69A69]',
  outline:
    'bg-transparent text-[#171816] border border-[#171816]/30 hover:border-[#171816] hover:bg-[#171816] hover:text-[#F7F5F0]',
  outlineLight:
    'bg-transparent text-[#F7F5F0] border border-[#F7F5F0]/45 hover:border-[#F7F5F0] hover:bg-[#F7F5F0] hover:text-[#171816]',
  ghost:
    'bg-transparent text-[#171816] border-b border-[#171816]/35 hover:border-[#B69A69] hover:text-[#B69A69] px-0 py-1.5',
};

const SIZE_CLASSES = {
  sm: 'px-4 py-2.5 text-[11px]',
  md: 'px-6 py-3.5 text-xs',
  lg: 'px-8 py-4 text-xs',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  type = 'button',
  className = '',
  disabled = false,
  ...props
}) {
  const baseClasses =
    variant === 'ghost'
      ? `inline-flex items-center gap-2 font-medium uppercase tracking-[0.18em] text-xs transition-all duration-300 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none ${VARIANT_CLASSES.ghost} ${className}`
      : `inline-flex items-center justify-center gap-2.5 font-medium uppercase tracking-[0.18em] transition-all duration-300 active:scale-[0.985] disabled:opacity-50 disabled:pointer-events-none ${VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary} ${SIZE_CLASSES[size] || SIZE_CLASSES.md} ${className}`;

  if (to) {
    return (
      <Link to={to} className={baseClasses} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={baseClasses} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} disabled={disabled} className={baseClasses} {...props}>
      {children}
    </button>
  );
}

