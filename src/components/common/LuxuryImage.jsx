import { useEffect, useRef, useState } from 'react';

export function LuxuryImage({
  src,
  alt,
  className = '',
  imgClassName = '',
  priority = false,
}) {
  const imgRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true);
    } else {
      setLoaded(false);
    }
  }, [src]);

  return (
    <div className={`relative overflow-hidden bg-[#E8E1D5] ${className}`}>
      {!loaded && !failed && (
        <div
          aria-hidden="true"
          className="absolute inset-0 animate-pulse bg-gradient-to-r from-[#E8E1D5] via-[#EFEAE0] to-[#E8E1D5]"
        />
      )}

      {failed ? (
        <div className="flex h-full w-full flex-col items-center justify-center bg-[#222320] p-6 text-center text-[#F7F5F0]">
          <span className="mb-2 inline-block border border-[#B69A69]/50 px-3 py-1 font-serif text-sm tracking-[0.25em] text-[#B69A69]">
            VIMROLL
          </span>
          <span className="max-w-xs text-xs tracking-wider text-[#E8E1D5]/70">
            {alt || 'Architectural Residence'}
          </span>
        </div>
      ) : (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover transition-opacity duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0'
          } ${imgClassName}`}
        />
      )}
    </div>
  );
}
