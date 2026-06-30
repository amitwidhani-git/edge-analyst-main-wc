"use client";
import { AFFILIATES, AFFILIATES_ENABLED, getBanner } from "../lib/affiliates";

function LeaderboardBanner({ affiliate }) {
  const banner = getBanner(affiliate, '728x90');
  if (!banner) return null;
  return (
    <a
      href={affiliate.href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      aria-label={`${affiliate.name} offer — opens in new tab`}
      style={{ display: 'block', lineHeight: 0 }}
    >
      <img
        src={banner.src}
        width={728}
        height={90}
        alt={`${affiliate.name} offer`}
        style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 2 }}
        loading="lazy"
      />
    </a>
  );
}

function AffiliateRow({ affiliate, index }) {
  const banner = getBanner(affiliate, '300x250', '250x250');
  const { name, tagline, href, termsHref, termsLabel, brandColor } = affiliate;

  return (
    <div className="ea-fb-row" style={{
      display: 'flex', alignItems: 'stretch',
      background: 'rgba(247,245,240,.02)',
      border: '1px solid rgba(247,245,240,.07)',
      borderRadius: 3, overflow: 'hidden', position: 'relative',
      transition: 'border-color .2s, background .2s',
    }}>
      {/* Brand-colour left accent */}
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 3, background: brandColor, opacity: 0.75 }} aria-hidden="true"/>

      {/* Banner image */}
      {banner && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer sponsored"
          aria-label={`${name} offer`}
          className="ea-fb-banner"
          style={{ display: 'flex', alignItems: 'center', padding: '20px 20px 20px 24px', flexShrink: 0 }}
        >
          <img
            src={banner.src}
            width={banner.w}
            height={banner.h}
            alt={`${name} offer`}
            style={{ width: 160, height: 'auto', display: 'block', borderRadius: 2 }}
            loading="lazy"
          />
        </a>
      )}

      {/* Details */}
      <div style={{ flex: 1, padding: '20px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontFamily: "var(--font-mono,'DM Mono',monospace)",
            fontSize: 8.5, letterSpacing: '.1em',
            color: 'rgba(247,245,240,.22)',
          }}>
            #{String(index + 1).padStart(2, '0')}
          </span>
        </div>

        <div>
          <div style={{
            fontFamily: "var(--font-bebas,'Bebas Neue',sans-serif)",
            fontSize: 'clamp(20px,3vw,30px)', letterSpacing: '.06em',
            color: '#F7F5F0', lineHeight: 1,
          }}>
            {name}
          </div>
          <div style={{
            fontFamily: "var(--font-mono,'DM Mono',monospace)",
            fontSize: 9, letterSpacing: '.08em', textTransform: 'uppercase',
            color: 'rgba(247,245,240,.4)', marginTop: 5,
          }}>
            {tagline}
          </div>
        </div>
      </div>

      {/* CTA column */}
      <div className="ea-fb-cta-col" style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        alignItems: 'stretch', padding: '20px 24px', gap: 8,
        borderLeft: '1px solid rgba(247,245,240,.06)', flexShrink: 0, minWidth: 170,
      }}>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="ea-fb-claim"
          style={{
            display: 'block',
            fontFamily: "var(--font-mono,'DM Mono',monospace)",
            fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase',
            background: '#C8FF00', color: '#080808', fontWeight: 500,
            padding: '12px 20px', borderRadius: 2, textAlign: 'center',
            textDecoration: 'none', whiteSpace: 'nowrap',
            transition: 'opacity .15s',
          }}
        >
          Claim Offer →
        </a>
        <p style={{
          fontFamily: "var(--font-body,'Outfit',sans-serif)",
          fontSize: 8.5, fontWeight: 300,
          color: 'rgba(247,245,240,.28)', margin: 0, lineHeight: 1.6, textAlign: 'center',
        }}>
          18+ |{' '}
          <a href={termsHref} target="_blank" rel="noopener noreferrer"
            style={{ color: 'rgba(247,245,240,.4)', textDecoration: 'underline' }}>
            {termsLabel}
          </a>
          {' '}| BeGambleAware.org
        </p>
      </div>
    </div>
  );
}

export default function FreeBetsContent() {
  if (!AFFILIATES_ENABLED) return null;
  const visible = AFFILIATES.filter(a => !a.hidden);

  return (
    <>
      <style>{`
        .ea-fb-row:hover { border-color: rgba(247,245,240,.14) !important; background: rgba(247,245,240,.035) !important; }
        .ea-fb-claim:hover { opacity: .85 !important; }
        @media (max-width: 640px) {
          .ea-fb-row { flex-direction: column !important; }
          .ea-fb-banner { padding: 16px 16px 0 16px !important; }
          .ea-fb-banner img { width: 100% !important; max-width: 300px; margin: 0 auto; }
          .ea-fb-cta-col { border-left: none !important; border-top: 1px solid rgba(247,245,240,.06); min-width: unset !important; flex-direction: row !important; flex-wrap: wrap; gap: 10px; }
        }
      `}</style>

      <main data-theme="dark" style={{ background: '#080808', minHeight: '100vh', paddingTop: 78 }}>
        <div style={{ maxWidth: 920, margin: '0 auto', padding: '48px clamp(16px,3vw,48px) 80px' }}>

          {/* Page header */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{
                fontFamily: "var(--font-mono,'DM Mono',monospace)",
                fontSize: 8, letterSpacing: '.16em', textTransform: 'uppercase',
                color: '#C8FF00', border: '1px solid rgba(200,255,0,.3)',
                padding: '3px 10px', borderRadius: 2,
              }}>
                Offers
              </span>
              <span style={{
                fontFamily: "var(--font-mono,'DM Mono',monospace)",
                fontSize: 8, letterSpacing: '.1em', textTransform: 'uppercase',
                color: 'rgba(247,245,240,.25)', border: '1px solid rgba(247,245,240,.1)',
                padding: '3px 10px', borderRadius: 2,
              }}>
                Sponsored
              </span>
            </div>
            <h1 style={{
              fontFamily: "var(--font-bebas,'Bebas Neue',sans-serif)",
              fontSize: 'clamp(38px,6vw,64px)', letterSpacing: '.06em',
              color: '#F7F5F0', margin: '0 0 14px', lineHeight: 1,
            }}>
              Free Bets &amp; Betting Offers
            </h1>
            <p style={{
              fontFamily: "var(--font-body,'Outfit',sans-serif)",
              fontSize: 14, fontWeight: 300,
              color: 'rgba(247,245,240,.5)', margin: 0, lineHeight: 1.7, maxWidth: 600,
            }}>
              Exclusive welcome offers from our trusted partner bookmakers. Sign up via our links to claim your bonus — offers update dynamically.
            </p>
          </div>

          {/* Featured leaderboard — first affiliate */}
          {visible[0] && (
            <div style={{
              marginBottom: 36, padding: '14px 16px',
              background: 'rgba(247,245,240,.02)',
              border: '1px solid rgba(247,245,240,.07)', borderRadius: 3,
            }}>
              <div style={{
                fontFamily: "var(--font-mono,'DM Mono',monospace)",
                fontSize: 7.5, letterSpacing: '.12em', textTransform: 'uppercase',
                color: 'rgba(247,245,240,.22)', marginBottom: 10,
              }}>
                Featured Offer · Ad
              </div>
              <LeaderboardBanner affiliate={visible[0]} />
            </div>
          )}

          {/* Stacked affiliate list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {visible.map((a, i) => (
              <AffiliateRow key={a.id} affiliate={a} index={i} />
            ))}
          </div>

          {/* Second leaderboard mid-page — third affiliate */}
          {visible[2] && (
            <div style={{
              margin: '28px 0', padding: '14px 16px',
              background: 'rgba(247,245,240,.02)',
              border: '1px solid rgba(247,245,240,.07)', borderRadius: 3,
            }}>
              <div style={{
                fontFamily: "var(--font-mono,'DM Mono',monospace)",
                fontSize: 7.5, letterSpacing: '.12em', textTransform: 'uppercase',
                color: 'rgba(247,245,240,.22)', marginBottom: 10,
              }}>
                Ad
              </div>
              <LeaderboardBanner affiliate={visible[2]} />
            </div>
          )}

          {/* Disclaimer */}
          <div style={{
            marginTop: 52, padding: '20px 24px',
            background: 'rgba(247,245,240,.02)',
            border: '1px solid rgba(247,245,240,.06)', borderRadius: 3,
          }}>
            <p style={{
              fontFamily: "var(--font-body,'Outfit',sans-serif)",
              fontWeight: 200, fontSize: 11,
              color: 'rgba(247,245,240,.3)', margin: 0, lineHeight: 1.8,
            }}>
              <strong style={{ color: 'rgba(247,245,240,.5)', fontWeight: 400 }}>Important:</strong>{' '}
              All offers are subject to individual terms and conditions set by the respective bookmakers. Edge Analysts earns commission from partner bookmakers when you sign up via our links. This does not affect our analysis, predictions, or editorial independence. 18+ only. New customers only. Minimum deposit and wagering requirements apply. Please gamble responsibly. If gambling is affecting you or someone you know, please visit{' '}
              <a href="https://www.begambleaware.org" target="_blank" rel="noopener noreferrer"
                style={{ color: 'rgba(247,245,240,.45)', textDecoration: 'underline' }}>
                BeGambleAware.org
              </a>
              {' '}or call{' '}
              <a href="tel:08088020133"
                style={{ color: 'rgba(247,245,240,.45)', textDecoration: 'underline' }}>
                0808 802 0133
              </a>.
            </p>
          </div>

        </div>
      </main>
    </>
  );
}
