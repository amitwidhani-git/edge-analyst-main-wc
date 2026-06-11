export const metadata = {
  title: 'Signals — Today\'s Football Betting Intelligence',
  description: 'Premier League XGBoost betting signals for 2025/26. Model probability vs market odds, edge scores ranked by conviction. Every prediction timestamped before kick-off. Free access, no account required.',
  keywords: [
    'Premier League betting tips today',
    'football betting signals',
    'value bet finder Premier League',
    'XGBoost football predictions',
    'model vs market football odds',
    'edge betting Premier League',
    'football betting intelligence',
    'best Premier League bets today',
  ],
  openGraph: {
    title: 'Today\'s Premier League Signals | Edge Analysts',
    description: 'XGBoost model signals ranked by edge size. Model probability vs market implied odds. Logged before kick-off — every miss published.',
    url: 'https://www.edgeanalysts.com/signals',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Today\'s Premier League Signals | Edge Analysts',
    description: 'Where the market is wrong today. XGBoost signals, pre-match, immutable.',
    images: ['/og-image.jpg'],
  },
  alternates: { canonical: 'https://www.edgeanalysts.com/signals' },
};

export default function SignalsLayout({ children }) {
  return children;
}
