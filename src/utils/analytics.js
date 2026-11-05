import { matchPath } from 'react-router-dom';
import { track } from '@vercel/analytics';

const KNOWN_STATIC_ROUTES = new Set([
  '/',
  '/properties',
  '/collections',
  '/locations',
  '/about',
  '/contact',
  '/saved',
]);

/**
 * Normalizes React Router pathnames into Vercel route patterns so dynamic
 * slugs group cleanly in Vercel Web Analytics & Speed Insights dashboards.
 */
export function resolveAnalyticsRoute(pathname = '/') {
  if (KNOWN_STATIC_ROUTES.has(pathname)) {
    return pathname;
  }
  if (matchPath('/properties/:slug', pathname)) {
    return '/properties/[slug]';
  }
  if (matchPath('/collections/:slug', pathname)) {
    return '/collections/[slug]';
  }
  return '/404';
}

/**
 * Safely dispatches custom interactivity events to Vercel Web Analytics.
 * Only primitive values (string, number, boolean, null) are forwarded.
 */
export function trackInteraction(eventName, properties = {}) {
  if (typeof window === 'undefined' || !eventName) return;

  try {
    const cleanProps = {};
    Object.entries(properties).forEach(([key, value]) => {
      if (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean' ||
        value === null
      ) {
        cleanProps[key] = value;
      }
    });

    track(eventName, cleanProps);
  } catch {
    // Never disrupt UI interactions if an ad-blocker or offline state blocks telemetry
  }
}
