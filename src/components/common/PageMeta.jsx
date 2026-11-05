import { Helmet } from 'react-helmet-async';

export function PageMeta({
  title,
  description = 'Discover, explore, compare, and enquire about extraordinary luxury residences across Dubai, London, New York, Paris, Marbella, and Lagos with VIMROLL Estate.',
}) {
  const fullTitle = title
    ? `${title} | VIMROLL Estate`
    : 'VIMROLL Estate | Where Exceptional Living Begins';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content="VIMROLL Estate" />
      <meta property="og:type" content="website" />
    </Helmet>
  );
}

