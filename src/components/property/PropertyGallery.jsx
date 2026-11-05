import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { LuxuryImage } from '../common/LuxuryImage';
import { trackInteraction } from '../../utils/analytics';

export function PropertyGallery({ images = [], title = 'Residence' }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const openLightboxAt = useCallback(
    (index) => {
      setLightboxIndex(index);
      trackInteraction('gallery_lightbox_opened', { title, slideIndex: index + 1 });
    },
    [title]
  );

  const isOpen = lightboxIndex !== null;

  const showPrev = useCallback(() => {
    setLightboxIndex((prev) =>
      prev === null ? 0 : (prev - 1 + images.length) % images.length
    );
  }, [images.length]);

  const showNext = useCallback(() => {
    setLightboxIndex((prev) => (prev === null ? 0 : (prev + 1) % images.length));
  }, [images.length]);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  useEffect(() => {
    if (!isOpen) return undefined;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') showPrev();
      if (event.key === 'ArrowRight') showNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeLightbox, showPrev, showNext]);

  if (!images.length) return null;

  const secondaryImages = images.slice(1, 5);

  return (
    <>
      <div className="relative grid grid-cols-1 gap-3 lg:grid-cols-12">
        {/* Primary Large Image */}
        <button
          type="button"
          onClick={() => openLightboxAt(0)}
          aria-label={`Open primary photo of ${title} in fullscreen gallery`}
          className="group relative aspect-[16/10] w-full overflow-hidden text-left lg:col-span-7 lg:aspect-auto lg:h-[540px]"
        >
          <LuxuryImage
            src={images[0]}
            alt={`${title} — Primary architectural view`}
            priority
            className="h-full w-full"
            imgClassName="transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 bg-[#171816]/85 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F7F5F0] backdrop-blur-xs lg:hidden">
            <Expand className="h-3.5 w-3.5 text-[#B69A69]" />
            <span>View All {images.length} Photos</span>
          </span>
        </button>

        {/* Thumbnail Grid */}
        <div className="hidden grid-cols-2 gap-3 lg:col-span-5 lg:grid lg:h-[540px]">
          {secondaryImages.map((imgSrc, idx) => {
            const actualIndex = idx + 1;
            const isLastTile = idx === secondaryImages.length - 1;
            return (
              <button
                key={`${imgSrc}-${actualIndex}`}
                type="button"
                onClick={() => openLightboxAt(actualIndex)}
                aria-label={`View photo ${actualIndex + 1} of ${title}`}
                className="group relative h-full w-full overflow-hidden text-left"
              >
                <LuxuryImage
                  src={imgSrc}
                  alt={`${title} — Interior detail ${actualIndex + 1}`}
                  priority
                  className="h-full w-full"
                  imgClassName="transition-transform duration-700 group-hover:scale-[1.04]"
                />
                {isLastTile && (
                  <span className="absolute inset-0 flex items-end justify-end bg-gradient-to-t from-[#171816]/65 via-transparent to-transparent p-4">
                    <span className="inline-flex items-center gap-2 border border-[#F7F5F0]/35 bg-[#171816]/90 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F7F5F0] transition-colors group-hover:border-[#B69A69]">
                      <Expand className="h-3.5 w-3.5 text-[#B69A69]" strokeWidth={1.6} />
                      <span>View All ({images.length})</span>
                    </span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile & Tablet Thumbnail Strip */}
      {secondaryImages.length > 0 && (
        <div className="mt-2.5 grid grid-cols-4 gap-2 lg:hidden">
          {secondaryImages.map((imgSrc, idx) => (
            <button
              key={`mobile-${imgSrc}-${idx}`}
              type="button"
              onClick={() => openLightboxAt(idx + 1)}
              aria-label={`Open photo ${idx + 2} of ${title}`}
              className="aspect-[4/3] overflow-hidden border border-[#E8E1D5]"
            >
              <LuxuryImage
                src={imgSrc}
                alt={`${title} thumbnail ${idx + 2}`}
                className="h-full w-full"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${title} photo gallery`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex flex-col justify-between bg-[#171816]/96 p-4 text-[#F7F5F0] sm:p-8"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#B69A69]">
                  {title}
                </p>
                <p className="mt-1 text-xs tabular-nums text-[#E8E1D5]/75">
                  Photograph {lightboxIndex + 1} of {images.length}
                </p>
              </div>
              <button
                type="button"
                onClick={closeLightbox}
                aria-label="Close fullscreen gallery"
                className="flex h-11 w-11 items-center justify-center border border-[#F7F5F0]/25 text-[#F7F5F0] transition-colors hover:border-[#B69A69] hover:text-[#B69A69]"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Active Slide */}
            <div className="relative my-4 flex flex-1 items-center justify-center overflow-hidden">
              <button
                type="button"
                onClick={showPrev}
                aria-label="Previous photograph"
                className="absolute left-2 z-10 flex h-12 w-12 items-center justify-center border border-[#F7F5F0]/25 bg-[#171816]/80 text-[#F7F5F0] transition-colors hover:border-[#B69A69] hover:text-[#B69A69] sm:left-6"
              >
                <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
              </button>

              <motion.img
                key={lightboxIndex}
                src={images[lightboxIndex]}
                alt={`${title} — View ${lightboxIndex + 1}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="max-h-[72vh] max-w-full object-contain select-none"
              />

              <button
                type="button"
                onClick={showNext}
                aria-label="Next photograph"
                className="absolute right-2 z-10 flex h-12 w-12 items-center justify-center border border-[#F7F5F0]/25 bg-[#171816]/80 text-[#F7F5F0] transition-colors hover:border-[#B69A69] hover:text-[#B69A69] sm:right-6"
              >
                <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Bottom Thumbnail Strip */}
            <div className="mx-auto flex max-w-2xl items-center gap-2.5 overflow-x-auto py-1">
              {images.map((thumb, idx) => (
                <button
                  key={`${thumb}-${idx}`}
                  type="button"
                  onClick={() => setLightboxIndex(idx)}
                  aria-label={`Select photograph ${idx + 1}`}
                  className={`h-14 w-20 shrink-0 overflow-hidden border-2 transition-opacity ${
                    idx === lightboxIndex
                      ? 'border-[#B69A69] opacity-100'
                      : 'border-transparent opacity-45 hover:opacity-80'
                  }`}
                >
                  <img
                    src={thumb}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
