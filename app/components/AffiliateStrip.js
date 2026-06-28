"use client";
import { AFFILIATES_ENABLED, AFFILIATES } from "../lib/affiliates";

function StarRating({ score }) {
  const full  = Math.floor(score);
  const half  = score % 1 >= 0.25 && score % 1 < 0.75;
  const empty = 5 - full - (half ? 1 : 0);
  const Star = ({ type }) => (
    <svg width="11" height="11" viewBox="0 0 24 24" aria-hidden="true" style={{ flexShrink: 0 }}>
      {type === 'full'  && <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="#C8FF00" stroke="none"/>}
      {type === 'half'  && (<><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="rgba(200,255,0,.15)" stroke="rgba(200,255,0,.3)" strokeWidth="1.5"/><clipPath id="ea-half"><rect x="0" y="0" width="12" height="24"/></clipPath><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="#C8FF00" clipPath="url(#ea-half)"/></>)}
      {type === 'empty' && <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="rgba(200,255,0,.12)" stroke="rgba(200,255,0,.25)" strokeWidth="1.5"/>}
    </svg>
  );
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {Array(full).fill('full').concat(half ? ['half'] : []).concat(Array(empty).fill('empty')).map((t, i) => (
        <Star key={i} type={t} />
      ))}
      <span style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 9, color: '#C8FF00', marginLeft: 4 }}>
        {score.toFixed(1)}
      </span>
    </span>
  );
}

function LogoPlaceholder({ initials, color }) {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" aria-hidden="true">
      <rect width="72" height="72" rx="6" fill={color} opacity="0.15"/>
      <rect x="1" y="1" width="70" height="70" rx="5.5" fill="none" stroke={color} strokeOpacity="0.4" strokeWidth="1"/>
      <text x="36" y="40" textAnchor="middle" dominantBaseline="middle" fontFamily="'Bebas Neue', sans-serif" fontSize="22" letterSpacing="2" fill={color}>
        {initials}
      </text>
    </svg>
  );
}

// Card for an affiliate with a network-served banner image
function BannerImageCard({ affiliate }) {
  const { name, tagline, badge, bannerSrc, bannerWidth, bannerHeight, href, termsHref, termsLabel, brandColor } = affiliate;

  return (
    <div style={{
      flex: '1 1 260px',
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      background: 'rgba(247,245,240,.03)',
      border: '1px solid rgba(247,245,240,.08)',
      borderRadius: 3,
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Brand-colour top accent */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: brandColor, opacity: 0.7 }} aria-hidden="true"/>

      {/* Badge + Ad label */}
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

      {/* Name */}
      <div style={{ padding: '0 16px 10px' }}>
        <div style={{ fontFamily: "var(--font-bebas,'Bebas Neue',sans-serif)", fontSize: 20, letterSpacing: '.06em', color: '#F7F5F0', lineHeight: 1 }}>
          {name}
        </div>
        <div style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 8, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(247,245,240,.35)', marginTop: 3 }}>
          {tagline}
        </div>
      </div>

      {/* Dynamic banner image — offer text lives inside the image */}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer sponsored"
        aria-label={`${name} offer — opens in new tab`}
        style={{ display: 'block', lineHeight: 0, margin: '0 16px' }}
      >
        <img
          src={bannerSrc}
          width={bannerWidth}
          height={bannerHeight}
          alt={`${name} current offer`}
          style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 2 }}
          loading="lazy"
        />
      </a>

      {/* CTA */}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer sponsored"
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
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        Claim Offer →
      </a>

      {/* T&Cs */}
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

// Card for a placeholder affiliate (no banner image yet)
function PlaceholderCard({ affiliate }) {
  const { name, tagline, offer, offerDetail, termsHref, termsLabel, rating = 4.5, badge, href, brandColor, logoInitials } = affiliate;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      aria-label={`${name} — ${offer} ${offerDetail}. Opens in new tab.`}
      style={{
        display: 'flex', flexDirection: 'column',
        flex: '1 1 260px', minWidth: 0,
        background: 'rgba(247,245,240,.03)',
        border: '1px solid rgba(247,245,240,.08)',
        borderRadius: 3, padding: '20px 20px 16px',
        textDecoration: 'none', position: 'relative', overflow: 'hidden',
        transition: 'border-color .2s, background .2s',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(200,255,0,.22)'; e.currentTarget.style.background = 'rgba(200,255,0,.025)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(247,245,240,.08)'; e.currentTarget.style.background = 'rgba(247,245,240,.03)'; }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: brandColor, opacity: 0.7 }} aria-hidden="true"/>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <span style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 8, letterSpacing: '.12em', textTransform: 'uppercase', background: 'rgba(200,255,0,.1)', color: '#C8FF00', border: '1px solid rgba(200,255,0,.2)', padding: '3px 8px', borderRadius: 2 }}>{badge}</span>
        <span style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 7.5, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(247,245,240,.25)' }}>Ad</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
        <LogoPlaceholder initials={logoInitials} color={brandColor} />
        <div>
          <div style={{ fontFamily: "var(--font-bebas,'Bebas Neue',sans-serif)", fontSize: 22, letterSpacing: '.06em', color: '#F7F5F0', lineHeight: 1, marginBottom: 4 }}>{name}</div>
          <div style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 9, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(247,245,240,.4)' }}>{tagline}</div>
          <div style={{ marginTop: 6 }}><StarRating score={rating} /></div>
        </div>
      </div>

      <div style={{ background: 'rgba(247,245,240,.04)', border: '1px solid rgba(247,245,240,.07)', borderRadius: 2, padding: '10px 12px', marginBottom: 14, textAlign: 'center' }}>
        <div style={{ fontFamily: "var(--font-bebas,'Bebas Neue',sans-serif)", fontSize: 28, letterSpacing: '.04em', color: '#C8FF00', lineHeight: 1 }}>{offer}</div>
        <div style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 9, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(247,245,240,.5)', marginTop: 3 }}>{offerDetail}</div>
      </div>

      <div style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', background: '#C8FF00', color: '#080808', fontWeight: 500, padding: '10px', borderRadius: 2, textAlign: 'center', marginBottom: 10 }}>
        Claim Offer →
      </div>

      <p style={{ fontFamily: "var(--font-body,'Outfit',sans-serif)", fontSize: 9, fontWeight: 300, color: 'rgba(247,245,240,.3)', margin: 0, lineHeight: 1.5, textAlign: 'center' }}>
        18+ |{' '}
        <a href={termsHref} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ color: 'rgba(247,245,240,.4)', textDecoration: 'underline' }}>
          {termsLabel}
        </a>
        {' '}| BeGambleAware.org
      </p>
    </a>
  );
}

export default function AffiliateStrip() {
  if (!AFFILIATES_ENABLED) return null;

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
        <span style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 9, letterSpacing: '.06em', color: 'rgba(247,245,240,.28)' }}>
          18+ · Gamble Responsibly
        </span>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {AFFILIATES.filter(a => !a.hidden).map(a =>
          a.bannerSrc
            ? <BannerImageCard key={a.id} affiliate={a} />
            : <PlaceholderCard key={a.id} affiliate={a} />
        )}
      </div>

      <p style={{ fontFamily: "var(--font-body,'Outfit',sans-serif)", fontWeight: 200, fontSize: 10, color: 'rgba(247,245,240,.28)', marginTop: 20, marginBottom: 0, lineHeight: 1.6 }}>
        Edge Analysts earns commission from partner bookmakers when you sign up via our links. This does not influence our analysis or predictions. Please gamble responsibly — visit{' '}
        <a href="https://www.begambleaware.org" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(247,245,240,.45)', textDecoration: 'underline' }}>BeGambleAware.org</a>
        {' '}if you need support.
      </p>
    </section>
  );
}
