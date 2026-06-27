// ── Affiliate feature toggle ───────────────────────────────────────────────────
// Set AFFILIATES_ENABLED to true when you are ready to show partner banners.
// Then update each entry below with your real affiliate links and copy.
export const AFFILIATES_ENABLED = false;

// ── Affiliate definitions ─────────────────────────────────────────────────────
// Replace placeholder values (href, name, offer, terms) before going live.
export const AFFILIATES = [
  {
    id: 'affiliate-1',
    name: 'Partner One',
    tagline: 'Best Odds Guaranteed',
    offer: 'Bet £10 Get £30',
    offerDetail: 'In Free Bets',
    terms: '18+ | New customers only | Min deposit £10 | T&Cs apply | Begambleaware.org',
    rating: 4.8,
    badge: "Editor's Pick",
    href: '#',            // ← replace with your affiliate link
    brandColor: '#E8371E',  // ← brand colour for logo placeholder
    logoInitials: 'P1',
  },
  {
    id: 'affiliate-2',
    name: 'Partner Two',
    tagline: 'Fastest Payouts',
    offer: 'Bet £5 Get £20',
    offerDetail: 'Money Back as Cash',
    terms: '18+ | New customers | Min stake £5 | T&Cs apply | Begambleaware.org',
    rating: 4.5,
    badge: 'Top Rated',
    href: '#',
    brandColor: '#0057B7',
    logoInitials: 'P2',
  },
  {
    id: 'affiliate-3',
    name: 'Partner Three',
    tagline: 'In-Play Specialists',
    offer: 'Up to £50',
    offerDetail: 'Welcome Bonus',
    terms: '18+ | New customers | Min deposit £10 | T&Cs apply | Begambleaware.org',
    rating: 4.3,
    badge: 'Great Value',
    href: '#',
    brandColor: '#007B40',
    logoInitials: 'P3',
  },
];
