import { WC2026JsonLd } from '../components/JsonLd';

export const metadata = {
  title: 'World Cup 2026 — Predictions, Odds & Group Analysis',
  description: 'Complete World Cup 2026 coverage: Elo-rated match predictions, value bets, group stage analysis and tournament win probabilities for all 48 nations. 10,000 simulations. Every pick logged before kick-off.',
  keywords: [
    'World Cup 2026 predictions',
    'WC 2026 odds',
    'World Cup 2026 group stage',
    'WC 2026 value bets',
    'World Cup 2026 Elo ratings',
    'football World Cup 2026',
    'WC 2026 match predictions',
    'World Cup 2026 tournament',
  ],
  openGraph: {
    title: 'World Cup 2026 Predictions & Odds | Edge Analysts',
    description: 'Elo-rated predictions and value bets for all 72 WC 2026 fixtures. 10,000 simulations, pre-match, immutable.',
    url: 'https://edgeanalysts.com/wc2026',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'World Cup 2026 Predictions — Edge Analysts' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@EdgeAnalysts',
    title: 'World Cup 2026 Predictions & Odds | Edge Analysts',
    description: 'EdgeIQ model vs bookmaker odds for every WC 2026 match. Value edges ranked before kick-off.',
    images: ['/og-image.jpg'],
  },
  alternates: { canonical: 'https://edgeanalysts.com/wc2026' },
};

export default function WC2026Layout({ children }) {
  return (
    <>
      <WC2026JsonLd />
      {children}
    </>
  );
}

