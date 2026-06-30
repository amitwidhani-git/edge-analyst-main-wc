"use client";
import Link from 'next/link';
import { AFFILIATES_ENABLED, AFFILIATES, getBanner } from "../lib/affiliates";

function AffiliateCard({ affiliate }) {
  const { name, tagline, badge, href, termsHref, termsLabel, brandColor } = affiliate;
  const banner = getBanner(affiliate, '300x250', '250x250');

  return (
    <div style={{
      flex: '1 1 240px',
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      background: 'rgba(247,245,240,.03)',
      border: '1px solid rgba(247,245,240,.08)',
      borderRadius: 3,
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: brandColor, opacity: 0.7 }} aria-hidden="true"/>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px 10px' }}>
        <span style={{
          fontFamily: "var(--font-mono,'DM Mono',monospace)",
          fontSize: 8, letterSpacing: '.12em', textTransform: 'uppercase',
          background: 'rgba(200,255,0,.1)', color: '#C8FF00',
          border: '1px solid rgba(200,255,0,.2)',
          padding: '3px 8px', borderRadius: 2,
        }}>{badge}</span>
        <span style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 7.5, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(247,245,240,.25)' }}>Ad</span>
      </div>

      <div style={{ padding: '0 16px 10px' }}>
        <div style={{ fontFamily: "var(--font-bebas,'Bebas Neue',sans-serif)", fontSize: 20, letterSpacing: '.06em', color: '#F7F5F0', lineHeight: 1 }}>
          {name}
        </div>
        <div style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 8, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(247,245,240,.35)', marginTop: 3 }}>
          {tagline}
        </div>
      </div>

      {banner && (
        <a href={href} target="_blank" rel="noopener noreferrer sponsored"
          aria-label={`${name} offer — opens in new tab`}
          style={{ display: 'block', lineHeight: 0, margin: '0 16px' }}>
          <img src={banner.src} width={banner.w} height={banner.h}
            alt={`${name} current offer`}
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 2 }}
            loading="lazy"/>
        </a>
      )}

      <a href={href} target="_blank" rel="noopener noreferrer sponsored"
        style={{
          display: 'block',
          margin: '10px 16px 0',
          fontFamily: "var(--font-mono,'DM Mono',monospace)",
          fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase',
          background: '#C8FF00', color: '#080808', fontWeight: 500,
          padding: '10px', borderRadius: 2, textAlign: 'center',
          textDecoration: 'none', transition: 'opacity .15s',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '.85'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
        Claim Offer →
      </a>

      <p style={{
        fontFamily: "var(--font-body,'Outfit',sans-serif)",
        fontSize: 9, fontWeight: 300,
        color: 'rgba(247,245,240,.3)',
        margin: '8px 16px 14px', lineHeight: 1.5, textAlign: 'center',
      }}>
        18+ |{' '}
        <a href={termsHref} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(247,245,240,.4)', textDecoration: 'underline' }}>
          {termsLabel}
        </a>
        {' '}| BeGambleAware.org
      </p>
    </div>
  );
}

export default function AffiliateStrip() {
  if (!AFFILIATES_ENABLED) return null;
  const visible = AFFILIATES.filter(a => !a.hidden);

  return (
    <section
      aria-label="Partner offers"
      data-theme="dark"
      style={{ background: '#0A0A0A', borderTop: '1px solid rgba(247,245,240,.06)', borderBottom: '1px solid rgba(247,245,240,.06)', padding: '48px clamp(16px,3vw,56px)' }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <h2 style={{ fontFamily: "var(--font-bebas,'Bebas Neue',sans-serif)", fontSize: 'clamp(22px,3vw,32px)', letterSpacing: '.06em', color: '#F7F5F0', margin: 0 }}>
            Today's Offers
          </h2>
          <span style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 7.5, letterSpacing: '.14em', textTransform: 'uppercase', border: '1px solid rgba(247,245,240,.15)', color: 'rgba(247,245,240,.4)', padding: '3px 8px', borderRadius: 2 }}>
            Sponsored
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/free-bets"
            style={{
              fontFamily: "var(--font-mono,'DM Mono',monospace)",
              fontSize: 9, letterSpacing: '.08em', textTransform: 'uppercase',
              color: '#C8FF00', textDecoration: 'none',
              border: '1px solid rgba(200,255,0,.3)', padding: '4px 12px', borderRadius: 2,
              transition: 'background .15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(200,255,0,.07)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            See All Offers →
          </Link>
          <span style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 9, letterSpacing: '.06em', color: 'rgba(247,245,240,.28)' }}>
            18+ · Gamble Responsibly
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {visible.map(a => <AffiliateCard key={a.id} affiliate={a} />)}
      </div>

      <p style={{ fontFamily: "var(--font-body,'Outfit',sans-serif)", fontWeight: 200, fontSize: 10, color: 'rgba(247,245,240,.28)', marginTop: 20, marginBottom: 0, lineHeight: 1.6 }}>
        Edge Analysts earns commission from partner bookmakers when you sign up via our links. This does not influence our analysis or predictions. Please gamble responsibly — visit{' '}
        <a href="https://www.begambleaware.org" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(247,245,240,.45)', textDecoration: 'underline' }}>BeGambleAware.org</a>
        {' '}if you need support.
      </p>
    </section>
  );
}
