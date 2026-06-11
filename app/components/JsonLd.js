export function SiteJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://www.edgeanalysts.com/#website',
        url: 'https://www.edgeanalysts.com/',
        name: 'Edge Analysts',
        description: 'Football prediction intelligence platform. XGBoost model. Immutable audit log.',
        publisher: { '@id': 'https://www.edgeanalysts.com/#organisation' },
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://www.edgeanalysts.com/signals?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': 'https://www.edgeanalysts.com/#organisation',
        name: 'Edge Analysts',
        url: 'https://www.edgeanalysts.com/',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.edgeanalysts.com/logo.png',
        },
        sameAs: [
          'https://x.com/EdgeAnalysts',
          'https://www.instagram.com/edgeanalysts',
        ],
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Edge Analysts',
        applicationCategory: 'SportsApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'GBP',
          description: "Free tier — today's top signals",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
