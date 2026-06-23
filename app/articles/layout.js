export const metadata = {
  title: 'Insights — World Cup 2026 Model Reports & Analysis',
  description: 'Model reports, group deep-dives and value breakdowns for World Cup 2026. Every insight is probability-driven, generated before kick-off and never revised after the fact.',
  keywords: [
    'World Cup 2026 analysis',
    'WC 2026 model reports',
    'World Cup 2026 predictions',
    'tournament win probability',
    'World Cup 2026 group analysis',
    'football Elo model insights',
    'WC 2026 value betting analysis',
  ],
  openGraph: {
    title: 'World Cup 2026 Insights | Edge Analysts',
    description: 'Model reports, group deep-dives and value breakdowns for WC 2026 — probability-driven, pre-match, immutable.',
    url: 'https://www.edgeanalysts.com/articles',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'World Cup 2026 Insights & Analysis — Edge Analysts' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@EdgeAnalysts',
    title: 'World Cup 2026 Insights | Edge Analysts',
    description: 'Model reports and group analysis for all 48 nations. Built on Elo ratings and 10,000 simulations.',
    images: ['/og-image.jpg'],
  },
  alternates: { canonical: 'https://www.edgeanalysts.com/articles' },
};

const articlesJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  '@id': 'https://www.edgeanalysts.com/articles',
  name: 'Edge Analysts Insights',
  description: 'Model reports, group deep-dives and value breakdowns for World Cup 2026.',
  url: 'https://www.edgeanalysts.com/articles',
  publisher: { '@id': 'https://www.edgeanalysts.com/#organisation' },
  blogPost: [
    {
      '@type': 'BlogPosting',
      '@id': 'https://www.edgeanalysts.com/articles#spain-win-probability',
      headline: 'Spain vs The Field: 37% Win Probability and Why the Market Is Underestimating Them',
      description: 'Spain enters WC 2026 with the highest Elo rating in the tournament at 2,171. The model assigns Spain a 37% tournament win probability across 10,000 simulations.',
      datePublished: '2026-06-01',
      dateModified: '2026-06-23',
      author: { '@type': 'Organization', name: 'Edge Analysts' },
      url: 'https://www.edgeanalysts.com/articles#spain-win-probability',
      keywords: 'Spain World Cup 2026, WC 2026 predictions, tournament win probability',
    },
    {
      '@type': 'BlogPosting',
      '@id': 'https://www.edgeanalysts.com/articles#colombia-value',
      headline: 'Colombia: The Highest Positive Expected Value Outright in the Tournament',
      description: "Colombia's Elo of 1,998 and 71% win rate in calibration data makes them the model's third-highest rated team yet bookmakers price them at 8–9% tournament probability. The model projects 12.4%.",
      datePublished: '2026-06-01',
      dateModified: '2026-06-23',
      author: { '@type': 'Organization', name: 'Edge Analysts' },
      url: 'https://www.edgeanalysts.com/articles#colombia-value',
      keywords: 'Colombia World Cup 2026, WC 2026 value bet, expected value betting',
    },
    {
      '@type': 'BlogPosting',
      '@id': 'https://www.edgeanalysts.com/articles#group-i-analysis',
      headline: 'Group I: France, Norway, Senegal, Iraq — The Hardest Group in the Tournament',
      description: 'By average Elo, Group I is the strongest in WC 2026. Norway at 1,922 makes them a legitimate dark horse. The model gives France 71% to top the group.',
      datePublished: '2026-06-01',
      dateModified: '2026-06-23',
      author: { '@type': 'Organization', name: 'Edge Analysts' },
      url: 'https://www.edgeanalysts.com/articles#group-i-analysis',
      keywords: 'World Cup 2026 Group I, France WC 2026, Norway World Cup 2026',
    },
    {
      '@type': 'BlogPosting',
      '@id': 'https://www.edgeanalysts.com/articles#norway-mispriced',
      headline: "Norway at 3%: Why the Model Sees Erling Haaland's Side as Criminally Mispriced",
      description: 'Norway sit at Elo 1,922 — higher than Germany, Belgium, and Portugal. Bookmakers have them at 2–3% tournament win probability. The model says 4.8%.',
      datePublished: '2026-06-01',
      dateModified: '2026-06-23',
      author: { '@type': 'Organization', name: 'Edge Analysts' },
      url: 'https://www.edgeanalysts.com/articles#norway-mispriced',
      keywords: 'Norway World Cup 2026, Haaland World Cup, WC 2026 dark horse',
    },
    {
      '@type': 'BlogPosting',
      '@id': 'https://www.edgeanalysts.com/articles#edgeiq-model-methodology',
      headline: 'How the EdgeIQ Model Works: Elo Ratings and 10,000 Simulations',
      description: 'The prediction engine combines Elo ratings calibrated on 314 matches, bivariate Poisson match probabilities, and 10,000 tournament simulations across the full 48-team bracket.',
      datePublished: '2026-06-01',
      dateModified: '2026-06-23',
      author: { '@type': 'Organization', name: 'Edge Analysts' },
      url: 'https://www.edgeanalysts.com/articles#edgeiq-model-methodology',
      keywords: 'football prediction model, Elo rating football, World Cup 2026 model methodology',
    },
    {
      '@type': 'BlogPosting',
      '@id': 'https://www.edgeanalysts.com/articles#group-h-deep-dive',
      headline: "Group H Deep Dive: Spain's Manageable Draw and the Uruguay Wildcard",
      description: 'Spain face Cabo Verde, Saudi Arabia and Uruguay in Group H. The model gives Spain a 94% probability of advancing. Uruguay at Elo 1,890 are the only meaningful threat.',
      datePublished: '2026-06-01',
      dateModified: '2026-06-23',
      author: { '@type': 'Organization', name: 'Edge Analysts' },
      url: 'https://www.edgeanalysts.com/articles#group-h-deep-dive',
      keywords: 'World Cup 2026 Group H, Spain WC 2026, Uruguay World Cup 2026',
    },
  ],
};

export default function ArticlesLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articlesJsonLd) }}
      />
      {children}
    </>
  );
}
