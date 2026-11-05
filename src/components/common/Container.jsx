export function Container({ children, className = '', as: Component = 'div' }) {
  return (
    <Component className={`mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12 ${className}`}>
      {children}
    </Component>
  );
}

