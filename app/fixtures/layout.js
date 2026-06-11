export const metadata = {
  title: 'Fixtures — World Cup 2026 Schedule & Predictions',
  description: 'All 72 World Cup 2026 fixtures with Elo-rated match predictions, live odds and value scores. Group stage schedule, model probabilities and best available odds.',
  keywords: [
    'World Cup 2026 fixtures',
    'WC 2026 schedule',
    'World Cup 2026 predictions',
    'World Cup 2026 odds',
    'football World Cup betting',
    'WC 2026 group stage',
    'World Cup 2026 match predictions',
  ],
  openGraph: {
    title: 'World Cup 2026 Fixtures & Predictions | Edge Analysts',
    description: 'All 72 WC 2026 fixtures with model predictions, live odds and value scores.',
    url: 'https://www.edgeanalysts.com/fixtures',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'World Cup 2026 Fixtures | Edge Analysts',
    description: 'Every WC 2026 fixture — Elo predictions, live odds, value edges.',
    images: ['/og-image.jpg'],
  },
  alternates: { canonical: 'https://www.edgeanalysts.com/fixtures' },
};

export default function FixturesLayout({ children }) {
  return children;
}
