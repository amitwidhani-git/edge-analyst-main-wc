"use client";
import { AFFILIATES_ENABLED, AFFILIATES } from "../lib/affiliates";

function LogoMini({ initials, color }) {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true" style={{ flexShrink: 0 }}>
      <rect width="36" height="36" rx="4" fill={color} fillOpacity="0.12"/>
      <rect x="0.5" y="0.5" width="35" height="35" rx="3.5" fill="none" stroke={color} strokeOpacity="0.35"/>
      <text
        x="18" y="20"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="'Bebas Neue', sans-serif"
        fontSize="13"
        letterSpacing="1.5"
        fill={color}
      >
        {initials}
      </text>
    </svg>
  );
}

export default function AffiliateBar() {
  if (!AFFILIATES_ENABLED) return null;

  return (
    <>
      <style>{`
        .ea-aff-bar-item { transition: background .15s, border-color .15s; }
        .ea-aff-bar-item:hover { background: rgba(200,255,0,.04) !important; border-color: rgba(200,255,0,.18) !important; }
        .ea-aff-bar-item:hover .ea-aff-cta { background: #C8FF00 !important; color: #080808 !important; }
        @media (max-width: 768px) {
          .ea-aff-bar { overflow-x: auto !important; flex-wrap: nowrap !important; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
          .ea-aff-bar::-webkit-scrollbar { display: none; }
          .ea-aff-bar-item { min-width: 220px !important; }
        }
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
            Recommended Partners · 18+ · Gamble Responsibly
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

        {/* Cards row */}
        <div className="ea-aff-bar" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {AFFILIATES.filter(a => !a.hidden).map((a, i) => (
            <a
              key={a.id}
              href={a.href}
              target="_blank"
              rel="noopener noreferrer sponsored"
              aria-label={`${a.name} — ${a.offer} ${a.offerDetail}. Opens in new tab.`}
              className="ea-aff-bar-item"
              style={{
                flex: '1 1 0',
                minWidth: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 14px',
                border: '1px solid rgba(247,245,240,.07)',
                borderRadius: 3,
                textDecoration: 'none',
                background: 'transparent',
                position: 'relative',
                overflow: 'hidden',
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

              {/* Offer — text for placeholders, or "See offer" for banner affiliates */}
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                {a.bannerSrc ? (
                  <div style={{
                    fontFamily: "var(--font-bebas,'Bebas Neue',sans-serif)",
                    fontSize: 15, letterSpacing: '.04em', color: '#C8FF00', lineHeight: 1,
                  }}>
                    See Today's Offer
                  </div>
                ) : (
                  <>
                    <div style={{
                      fontFamily: "var(--font-bebas,'Bebas Neue',sans-serif)",
                      fontSize: 18, letterSpacing: '.04em', color: '#C8FF00', lineHeight: 1,
                    }}>
                      {a.offer}
                    </div>
                    <div style={{
                      fontFamily: "var(--font-mono,'DM Mono',monospace)",
                      fontSize: 7.5, letterSpacing: '.08em', textTransform: 'uppercase',
                      color: 'rgba(247,245,240,.4)', marginTop: 2,
                    }}>
                      {a.offerDetail}
                    </div>
                  </>
                )}
              </div>

              {/* CTA */}
              <div
                className="ea-aff-cta"
                style={{
                  flexShrink: 0,
                  fontFamily: "var(--font-mono,'DM Mono',monospace)",
                  fontSize: 8.5, letterSpacing: '.1em', textTransform: 'uppercase',
                  border: '1px solid rgba(200,255,0,.4)',
                  color: '#C8FF00',
                  padding: '7px 14px', borderRadius: 2,
                  transition: 'background .15s, color .15s',
                  whiteSpace: 'nowrap',
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
