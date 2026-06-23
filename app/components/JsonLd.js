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
          width: 512,
          height: 512,
        },
        sameAs: [
          'https://x.com/EdgeAnalysts',
          'https://www.instagram.com/edgeanalysts',
        ],
      },
      {
        '@type': 'WebPage',
        '@id': 'https://www.edgeanalysts.com/#webpage',
        url: 'https://www.edgeanalysts.com/',
        name: 'Edge Analysts — Football Intelligence Platform',
        description: 'Edge Analysts surfaces the gap between what the football betting market prices and what our XGBoost model calculates. Every prediction logged before kick-off.',
        isPartOf: { '@id': 'https://www.edgeanalysts.com/#website' },
        about: { '@id': 'https://www.edgeanalysts.com/#organisation' },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.edgeanalysts.com/' }],
        },
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Edge Analysts',
        applicationCategory: 'SportsApplication',
        operatingSystem: 'Web',
        url: 'https://www.edgeanalysts.com/',
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

export function WC2026JsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: 'FIFA World Cup 2026',
    description: 'The 23rd FIFA World Cup, hosted across the United States, Canada, and Mexico. 48 nations compete across 72 matches.',
    startDate: '2026-06-11',
    endDate: '2026-07-19',
    location: {
      '@type': 'Place',
      name: 'United States, Canada & Mexico',
      address: { '@type': 'PostalAddress', addressCountry: 'US' },
    },
    organizer: { '@type': 'Organization', name: 'FIFA', url: 'https://www.fifa.com' },
    url: 'https://www.edgeanalysts.com/wc2026',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
