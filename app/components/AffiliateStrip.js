"use client";
import { AFFILIATES_ENABLED, AFFILIATES } from "../lib/affiliates";

function StarRating({ score }) {
  const full  = Math.floor(score);
  const half  = score % 1 >= 0.25 && score % 1 < 0.75;
  const empty = 5 - full - (half ? 1 : 0);
  const Star = ({ type }) => (
    <svg width="11" height="11" viewBox="0 0 24 24" aria-hidden="true" style={{ flexShrink: 0 }}>
      {type === 'full' && (
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="#C8FF00" stroke="none"/>
      )}
      {type === 'half' && (
        <>
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="rgba(200,255,0,.15)" stroke="rgba(200,255,0,.3)" strokeWidth="1.5"/>
          <clipPath id="ea-half"><rect x="0" y="0" width="12" height="24"/></clipPath>
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="#C8FF00" clipPath="url(#ea-half)"/>
        </>
      )}
      {type === 'empty' && (
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="rgba(200,255,0,.12)" stroke="rgba(200,255,0,.25)" strokeWidth="1.5"/>
      )}
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
      <text
        x="36" y="40"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="'Bebas Neue', sans-serif"
        fontSize="22"
        letterSpacing="2"
        fill={color}
      >
        {initials}
      </text>
    </svg>
  );
}

function AffiliateCard({ affiliate }) {
  const { name, tagline, offer, offerDetail, terms, rating, badge, href, brandColor, logoInitials } = affiliate;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      aria-label={`${name} — ${offer} ${offerDetail}. Opens in new tab.`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: '1 1 260px',
        minWidth: 0,
        background: 'rgba(247,245,240,.03)',
        border: '1px solid rgba(247,245,240,.08)',
        borderRadius: 3,
        padding: '20px 20px 16px',
        textDecoration: 'none',
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color .2s, background .2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(200,255,0,.22)';
        e.currentTarget.style.background  = 'rgba(200,255,0,.025)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(247,245,240,.08)';
        e.currentTarget.style.background  = 'rgba(247,245,240,.03)';
      }}
    >
      {/* Accent top bar using brand colour */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: brandColor, opacity: 0.7,
      }} aria-hidden="true"/>

      {/* Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <span style={{
          fontFamily: "var(--font-mono,'DM Mono',monospace)",
          fontSize: 8, letterSpacing: '.12em', textTransform: 'uppercase',
          background: 'rgba(200,255,0,.1)', color: '#C8FF00',
          border: '1px solid rgba(200,255,0,.2)',
          padding: '3px 8px', borderRadius: 2,
        }}>
          {badge}
        </span>
        <span style={{
          fontFamily: "var(--font-mono,'DM Mono',monospace)",
          fontSize: 7.5, letterSpacing: '.08em', textTransform: 'uppercase',
          color: 'rgba(247,245,240,.25)',
        }}>
          Ad
        </span>
      </div>

      {/* Logo + name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
        <LogoPlaceholder initials={logoInitials} color={brandColor} />
        <div>
          <div style={{
            fontFamily: "var(--font-bebas,'Bebas Neue',sans-serif)",
            fontSize: 22, letterSpacing: '.06em', color: '#F7F5F0', lineHeight: 1,
            marginBottom: 4,
          }}>
            {name}
          </div>
          <div style={{
            fontFamily: "var(--font-mono,'DM Mono',monospace)",
            fontSize: 9, letterSpacing: '.08em', textTransform: 'uppercase',
            color: 'rgba(247,245,240,.4)',
          }}>
            {tagline}
          </div>
          <div style={{ marginTop: 6 }}>
            <StarRating score={rating} />
          </div>
        </div>
      </div>

      {/* Offer */}
      <div style={{
        background: 'rgba(247,245,240,.04)',
        border: '1px solid rgba(247,245,240,.07)',
        borderRadius: 2, padding: '10px 12px', marginBottom: 14,
        textAlign: 'center',
      }}>
        <div style={{
          fontFamily: "var(--font-bebas,'Bebas Neue',sans-serif)",
          fontSize: 28, letterSpacing: '.04em', color: '#C8FF00', lineHeight: 1,
        }}>
          {offer}
        </div>
        <div style={{
          fontFamily: "var(--font-mono,'DM Mono',monospace)",
          fontSize: 9, letterSpacing: '.1em', textTransform: 'uppercase',
          color: 'rgba(247,245,240,.5)', marginTop: 3,
        }}>
          {offerDetail}
        </div>
      </div>

      {/* CTA */}
      <div style={{
        fontFamily: "var(--font-mono,'DM Mono',monospace)",
        fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase',
        background: '#C8FF00', color: '#080808', fontWeight: 500,
        padding: '10px', borderRadius: 2, textAlign: 'center',
        marginBottom: 10,
      }}>
        Claim Offer →
      </div>

      {/* T&Cs */}
      <p style={{
        fontFamily: "var(--font-body,'Outfit',sans-serif)",
        fontSize: 9, fontWeight: 300,
        color: 'rgba(247,245,240,.3)',
        margin: 0, lineHeight: 1.5, textAlign: 'center',
      }}>
        {terms}
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
      style={{
        background: '#0A0A0A',
        borderTop: '1px solid rgba(247,245,240,.06)',
        borderBottom: '1px solid rgba(247,245,240,.06)',
        padding: '48px clamp(16px,3vw,56px)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <h2 style={{
            fontFamily: "var(--font-bebas,'Bebas Neue',sans-serif)",
            fontSize: 'clamp(22px,3vw,32px)', letterSpacing: '.06em',
            color: '#F7F5F0', margin: 0,
          }}>
            Recommended Partners
          </h2>
          <span style={{
            fontFamily: "var(--font-mono,'DM Mono',monospace)",
            fontSize: 7.5, letterSpacing: '.14em', textTransform: 'uppercase',
            border: '1px solid rgba(247,245,240,.15)',
            color: 'rgba(247,245,240,.4)',
            padding: '3px 8px', borderRadius: 2,
          }}>
            Sponsored
          </span>
        </div>
        <span style={{
          fontFamily: "var(--font-mono,'DM Mono',monospace)",
          fontSize: 9, letterSpacing: '.06em',
          color: 'rgba(247,245,240,.28)',
        }}>
          18+ · Gamble Responsibly
        </span>
      </div>

      {/* Cards */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {AFFILIATES.map(a => <AffiliateCard key={a.id} affiliate={a} />)}
      </div>

      {/* Disclaimer */}
      <p style={{
        fontFamily: "var(--font-body,'Outfit',sans-serif)",
        fontWeight: 200, fontSize: 10,
        color: 'rgba(247,245,240,.28)',
        marginTop: 20, marginBottom: 0, lineHeight: 1.6,
      }}>
        Edge Analysts earns commission from partner bookmakers when you sign up via our links.
        This does not influence our analysis or predictions.
        Please gamble responsibly — visit{' '}
        <a href="https://www.begambleaware.org" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(247,245,240,.45)', textDecoration: 'underline' }}>
          BeGambleAware.org
        </a>
        {' '}if you need support.
      </p>
    </section>
  );
}
