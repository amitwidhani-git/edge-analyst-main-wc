"use client";
import { AFFILIATES_ENABLED, AFFILIATES } from "../lib/affiliates";

function LogoMini({ initials, color }) {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true" style={{ flexShrink: 0 }}>
      <rect width="40" height="40" rx="4" fill={color} fillOpacity="0.12"/>
      <rect x="0.5" y="0.5" width="39" height="39" rx="3.5" fill="none" stroke={color} strokeOpacity="0.35"/>
      <text x="20" y="22" textAnchor="middle" dominantBaseline="middle"
        fontFamily="'Bebas Neue', sans-serif" fontSize="14" letterSpacing="1.5" fill={color}>
        {initials}
      </text>
    </svg>
  );
}

export default function AffiliateBar() {
  if (!AFFILIATES_ENABLED) return null;
  const visible = AFFILIATES.filter(a => !a.hidden);

  return (
    <>
      <style>{`
        .ea-aff-bar-item { transition: background .15s, border-color .15s; }
        .ea-aff-bar-item:hover { background: rgba(200,255,0,.04) !important; border-color: rgba(200,255,0,.18) !important; }
        .ea-aff-bar-item:hover .ea-aff-cta { background: #C8FF00 !important; color: #080808 !important; }
        .ea-aff-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
        @media (max-width: 900px) { .ea-aff-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 520px)  { .ea-aff-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div
        role="region"
        aria-label="Sponsored partner offers"
        data-theme="dark"
        style={{
          background: 'rgba(247,245,240,.02)',
          borderTop: '1px solid rgba(247,245,240,.06)',
          borderBottom: '1px solid rgba(247,245,240,.06)',
          padding: '12px clamp(16px,3.5vw,56px)',
        }}
      >
        {/* Label row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{
            fontFamily: "var(--font-mono,'DM Mono',monospace)",
            fontSize: 7.5, letterSpacing: '.16em', textTransform: 'uppercase',
            color: 'rgba(247,245,240,.28)',
          }}>
            Offers · 18+ · Gamble Responsibly
          </span>
          <span style={{
            fontFamily: "var(--font-mono,'DM Mono',monospace)",
            fontSize: 7.5, letterSpacing: '.1em', textTransform: 'uppercase',
            color: 'rgba(247,245,240,.22)',
            border: '1px solid rgba(247,245,240,.1)',
            padding: '2px 7px', borderRadius: 2,
          }}>
            Sponsored
          </span>
        </div>

        {/* 3-column grid → 2 rows of 3 */}
        <div className="ea-aff-grid">
          {visible.map((a) => (
            <a
              key={a.id}
              href={a.href}
              target="_blank"
              rel="noopener noreferrer sponsored"
              aria-label={`${a.name} — Claim offer. Opens in new tab.`}
              className="ea-aff-bar-item"
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px',
                border: '1px solid rgba(247,245,240,.07)',
                borderRadius: 3, textDecoration: 'none', background: 'transparent',
                position: 'relative', overflow: 'hidden',
              }}
            >
              {/* Brand-colour left accent */}
              <div style={{
                position: 'absolute', top: 0, left: 0, bottom: 0, width: 2,
                background: a.brandColor, opacity: 0.6,
              }} aria-hidden="true"/>

              <LogoMini initials={a.logoInitials} color={a.brandColor} />

              {/* Name + tagline */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: "var(--font-bebas,'Bebas Neue',sans-serif)",
                  fontSize: 16, letterSpacing: '.05em',
                  color: '#F7F5F0', lineHeight: 1, marginBottom: 2,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {a.name}
                </div>
                <div style={{
                  fontFamily: "var(--font-mono,'DM Mono',monospace)",
                  fontSize: 8, letterSpacing: '.06em', textTransform: 'uppercase',
                  color: 'rgba(247,245,240,.35)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {a.tagline}
                </div>
              </div>

              {/* CTA */}
              <div
                className="ea-aff-cta"
                style={{
                  flexShrink: 0,
                  fontFamily: "var(--font-mono,'DM Mono',monospace)",
                  fontSize: 8.5, letterSpacing: '.1em', textTransform: 'uppercase',
                  border: '1px solid rgba(200,255,0,.4)', color: '#C8FF00',
                  padding: '7px 14px', borderRadius: 2,
                  transition: 'background .15s, color .15s', whiteSpace: 'nowrap',
                }}
              >
                Claim →
              </div>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
