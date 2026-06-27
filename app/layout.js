import { Suspense } from "react";
import "./globals.css";
import ThemeOverrides from "./components/ThemeOverrides";
import GlobalNav from "./components/GlobalNav";
import GlobalFooter from "./components/GlobalFooter";
import CookieBanner from "./components/CookieBanner";
import AffiliateStrip from "./components/AffiliateStrip";
import { SiteJsonLd } from "./components/JsonLd";

// Fonts loaded via CSS @import in globals.css for build compatibility
// CSS variables remain the same: --font-bebas, --font-mono, --font-body, --font-serif

export const metadata = {
  metadataBase: new URL('https://edgeanalysts.com'),
  title: {
    default: 'Edge Analysts — Football Intelligence Platform',
    template: '%s | Edge Analysts',
  },
  description: 'Edge Analysts surfaces the gap between what the football betting market prices and what our XGBoost model calculates. Every prediction logged before kick-off.',
  keywords: ['football betting tips', 'Premier League predictions', 'value betting', 'World Cup 2026 predictions', 'XGBoost football model'],
  authors: [{ name: 'Edge Analysts' }],
  robots: { index: true, follow: true },
  verification: { google: 'zRBIhubSAGddJcRhmRYHjGMH5d2c1yuQ9FLPU9bxybs' },
  alternates: { canonical: 'https://edgeanalysts.com' },
  openGraph: {
    type: 'website', locale: 'en_GB', url: 'https://edgeanalysts.com',
    siteName: 'Edge Analysts',
    title: 'Edge Analysts — Football Intelligence Platform',
    description: 'XGBoost-powered football predictions. Every probability logged before kick-off.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Edge Analysts — Football Intelligence Platform' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@EdgeAnalysts',
    title: 'Edge Analysts — Football Intelligence Platform',
    description: 'XGBoost-powered football predictions. Every probability logged before kick-off.',
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=Outfit:wght@200;300;400;500&family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            var t = localStorage.getItem('ea-theme');
            if (t === 'light') document.documentElement.classList.add('light');
          } catch(e) {}
        `}} />
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --font-bebas: 'Bebas Neue', sans-serif;
            --font-mono:  'DM Mono', monospace;
            --font-body:  'Outfit', sans-serif;
            --font-serif: 'Cormorant Garamond', serif;
          }
        `}} />
        <script src="https://analytics.ahrefs.com/analytics.js" data-key="+XhEircXXIKu+GF+XH4pGA" async />
      </head>
      <body className="has-global-nav">
        <SiteJsonLd />
        <a href="#main-content" className="ea-skip-link">Skip to main content</a>
        <ThemeOverrides />
        <GlobalNav />
        <main id="main-content" style={{ paddingTop: 78 }}>
          <Suspense fallback={null}>{children}</Suspense>
        </main>
        <AffiliateStrip />
        <GlobalFooter />
        <CookieBanner />
      </body>
    </html>
  );
}

