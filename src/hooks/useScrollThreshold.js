import { useEffect, useState } from 'react';

export function useScrollThreshold(threshold = 48) {
  const [isScrolled, setIsScrolled] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.scrollY > threshold;
  });

  useEffect(() => {
    const handleScroll = () => {
      const crossed = window.scrollY > threshold;
      setIsScrolled((prev) => (prev !== crossed ? crossed : prev));
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return isScrolled;
}

