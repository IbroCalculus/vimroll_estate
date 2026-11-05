import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useReducedMotionPref } from '../../hooks/useReducedMotionPref';

gsap.registerPlugin(ScrollTrigger);

export function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
}) {
  const spanRef = useRef(null);
  const prefersReducedMotion = useReducedMotionPref();

  useGSAP(
    () => {
      if (!spanRef.current) return;

      if (prefersReducedMotion) {
        spanRef.current.textContent = `${prefix}${Number(value).toFixed(decimals)}${suffix}`;
        return;
      }

      const counterObj = { current: 0 };
      gsap.to(counterObj, {
        current: Number(value),
        duration: 1.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: spanRef.current,
          start: 'top 88%',
          once: true,
        },
        onUpdate: () => {
          if (spanRef.current) {
            spanRef.current.textContent = `${prefix}${counterObj.current.toFixed(decimals)}${suffix}`;
          }
        },
      });
    },
    { dependencies: [value, prefix, suffix, decimals, prefersReducedMotion] }
  );

  return (
    <span ref={spanRef} className={`tabular-nums ${className}`}>
      {prefix}
      {Number(value).toFixed(decimals)}
      {suffix}
    </span>
  );
}

