export const metadata = {
  title: 'WC 2026 Knockout Build-Up — R32 Bracket & Key Inputs | Edge Analysts',
  description: 'Round of 32 bracket for World Cup 2026 mapped from Elo-projected group standings. Key inputs: Elo ratings, tournament win probabilities, head-to-head model probabilities and xG data for all 16 matchups.',
  keywords: [
    'World Cup 2026 knockout stage',
    'WC 2026 Round of 32',
    'World Cup 2026 bracket',
    'WC 2026 knockout predictions',
    'World Cup 2026 Elo bracket',
    'WC 2026 R32 build-up',
    'World Cup 2026 group winners',
  ],
  openGraph: {
    title: 'WC 2026 Knockout Build-Up | Edge Analysts',
    description: 'R32 bracket projected from Elo group standings. Head-to-head probabilities, tournament win % and key inputs for every matchup.',
    url: 'https://edgeanalysts.com/knockout',
    images: [{ url: '/og-image.jpg', width:1200, height:630, alt: 'WC 2026 Knockout Bracket — Edge Analysts' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@EdgeAnalysts',
    title: 'WC 2026 Knockout Build-Up | Edge Analysts',
    description: 'Elo-projected R32 bracket with head-to-head model probabilities and key inputs.',
    images: ['/og-image.jpg'],
  },
  alternates: { canonical: 'https://edgeanalysts.com/knockout' },
};

export default function KnockoutLayout({ children }) {
  return children;
}
