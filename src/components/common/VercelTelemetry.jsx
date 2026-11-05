import { useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { resolveAnalyticsRoute } from '../../utils/analytics';

export function VercelTelemetry() {
  const location = useLocation();
  const route = resolveAnalyticsRoute(location.pathname);

  return (
    <>
      <Analytics route={route} path={location.pathname} />
      <SpeedInsights route={route} />
    </>
  );
}
