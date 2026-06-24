export const metadata = {
  title: 'Rankings — World Cup 2026 Team Ratings',
  description: 'Elo ratings and tournament win probabilities for all 48 World Cup 2026 nations. Built on 314 StatsBomb matches, refined through 10,000 tournament simulations.',
  keywords: [
    'World Cup 2026 rankings',
    'WC 2026 team ratings',
    'World Cup 2026 Elo ratings',
    'World Cup 2026 predictions',
    'tournament win probability',
    'football Elo model',
    'WC 2026 group stage odds',
  ],
  openGraph: {
    title: 'World Cup 2026 Rankings | Edge Analysts',
    description: 'Elo ratings and win probabilities for all 48 WC 2026 nations — 10,000 simulations.',
    url: 'https://www.edgeanalysts.com/rankings',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'World Cup 2026 Team Rankings — Edge Analysts' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@EdgeAnalysts',
    title: 'World Cup 2026 Rankings | Edge Analysts',
    description: 'All 48 nations ranked by Elo rating and tournament win probability.',
    images: ['/og-image.jpg'],
  },
  alternates: { canonical: 'https://www.edgeanalysts.com/rankings' },
};

export default function LeaguesLayout({ children }) {
  return children;
}
