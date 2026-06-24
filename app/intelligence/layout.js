export const metadata = {
  title: 'Intelligence — World Cup 2026 Odds & Value Finder',
  description: 'World Cup 2026 match odds compared against EdgeIQ model probabilities. Value edges ranked by conviction. Every prediction logged before kick-off — every miss published.',
  keywords: [
    'World Cup 2026 odds',
    'WC 2026 betting value',
    'World Cup 2026 value bets',
    'WC 2026 match predictions',
    'World Cup 2026 betting tips',
    'football value betting World Cup',
    'WC 2026 Elo model odds',
    'World Cup 2026 expected value',
  ],
  openGraph: {
    title: 'World Cup 2026 Intelligence | Edge Analysts',
    description: 'Model probabilities vs market odds for every WC 2026 match. Value edges logged before kick-off.',
    url: 'https://www.edgeanalysts.com/intelligence',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'World Cup 2026 Intelligence — Edge Analysts' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@EdgeAnalysts',
    title: 'World Cup 2026 Odds & Value | Edge Analysts',
    description: 'Where the WC 2026 market is wrong. EdgeIQ model vs bookmaker odds — pre-match, immutable.',
    images: ['/og-image.jpg'],
  },
  alternates: { canonical: 'https://www.edgeanalysts.com/intelligence' },
};

export default function OddsLayout({ children }) {
  return children;
}
