// ── Affiliate feature toggle ───────────────────────────────────────────────────
// Set AFFILIATES_ENABLED to true when you are ready to show partner banners.
export const AFFILIATES_ENABLED = false;

// ── Affiliate definitions ─────────────────────────────────────────────────────
// For affiliates with a network-served banner image, set bannerSrc + bannerHref.
// The banner image carries the dynamic offer — no need to hardcode offer text.
// For placeholder affiliates, set offer/offerDetail/brandColor/logoInitials instead.
export const AFFILIATES = [
  {
    id: 'affiliate-1',
    name: 'Betrino Sports',
    tagline: 'Sports Betting',
    badge: "Editor's Pick",
    // Network-served banner (offer text is dynamic, updated by the affiliate)
    bannerSrc: 'https://publisher.confidonetwork.com/getBanner.php?ad=2585&i=2030',
    bannerWidth: 300,
    bannerHeight: 250,
    href: 'https://creatives.excelaffiliates.com/redirect.aspx?mid=5824&sid=1019534&cid=&pid=&affid=1014054',
    termsHref: 'https://www.excelaffiliates.com/terms-and-conditions/',
    termsLabel: 'T&Cs apply',
    brandColor: '#E8371E',
  },
  {
    id: 'affiliate-2',
    name: 'MOGOBET',
    tagline: 'Sports Betting',
    badge: 'Top Rated',
    // Network-served banner — 1920×1080 widescreen format, scaled via CSS
    bannerSrc: 'https://publisher.confidonetwork.com/getBanner.php?ad=869&i=2030',
    bannerWidth: 1920,
    bannerHeight: 1080,
    href: 'https://m.bluefoxaffiliates.com/redirect.aspx?mid=103&sid=1800&cid=&pid=&affid=248',
    termsHref: 'https://www.bluefoxaffiliates.com/terms-and-conditions/', // ← add MOGOBET T&Cs link when available
    termsLabel: 'T&Cs apply',
    brandColor: '#F97316',
  },
  {
    id: 'affiliate-3',
    name: 'Partner Three',
    tagline: 'In-Play Specialists',
    badge: 'Great Value',
    hidden: true, // ← set to false when details are ready
    offer: 'Up to £50',
    offerDetail: 'Welcome Bonus',
    termsHref: '#',
    termsLabel: '18+ | New customers | Min deposit £10 | T&Cs apply',
    brandColor: '#007B40',
    logoInitials: 'P3',
    href: '#',
  },
];
