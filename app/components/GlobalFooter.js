import Link from 'next/link';

const COL_HEADING = {
  fontFamily: "var(--font-mono, 'DM Mono', monospace)",
  fontSize: 7.5, letterSpacing: '0.18em', textTransform: 'uppercase',
  color: 'rgba(247,245,240,0.5)', marginBottom: 16, display: 'block',
};

const COL_LINK = {
  fontFamily: "var(--font-body, 'Outfit', sans-serif)",
  fontWeight: 200, fontSize: 12.5,
  color: 'rgba(247,245,240,0.75)', textDecoration: 'none',
  display: 'block', marginBottom: 10,
  transition: 'color 0.15s ease',
};

export default function GlobalFooter() {
  return (
    <footer
      aria-label="Site footer"
      style={{ background: '#111111', borderTop: '1px solid rgba(247,245,240,0.05)' }}
    >

      {/* ── TOP GRID ─────────────────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.3fr repeat(3, 1fr)',
        gap: 60,
        padding: '64px 56px 40px',
      }} className="gfooter-grid">

        {/* Col 1 — Brand */}
        <div className="gfooter-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <svg width="20" height="18" viewBox="1 -1 62 58" fill="none" aria-hidden="true" focusable="false">
              <path d="M4 22 L32 2 L60 22" stroke="rgba(247,245,240,0.7)" strokeWidth="6" strokeLinejoin="miter" fill="none"/>
              <path d="M4 38 L32 18 L60 38" stroke="rgba(247,245,240,0.7)" strokeWidth="6" strokeLinejoin="miter" fill="none"/>
              <path d="M4 54 L32 34 L60 54" stroke="rgba(247,245,240,0.7)" strokeWidth="6" strokeLinejoin="miter" fill="none"/>
            </svg>
            <span style={{
              fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
              fontSize: 16, letterSpacing: '0.1em', color: 'rgba(247,245,240,0.85)', lineHeight: 1,
            }}>Edge Analysts</span>
          </div>
          <div style={{
            fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)",
            fontSize: 20, letterSpacing: '0.04em',
            color: '#C8FF00', lineHeight: 1, marginBottom: 14,
          }}>Beat the Game.</div>
          <p style={{
            fontFamily: "var(--font-body, 'Outfit', sans-serif)",
            fontWeight: 200, fontSize: 11.5,
            color: 'rgba(247,245,240,0.6)',
            maxWidth: 200, lineHeight: 1.65, marginBottom: 14,
          }}>
            World Cup 2026 intelligence. Transparent track record.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <a href="https://www.instagram.com/edgeanalysts" target="_blank" rel="noopener noreferrer" aria-label="Edge Analysts on Instagram" className="gfooter-social">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            <a href="https://x.com/EdgeAnalysts" target="_blank" rel="noopener noreferrer" aria-label="Edge Analysts on X" className="gfooter-social">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Col 2 — Platform */}
        <nav aria-label="Platform links">
          <span style={COL_HEADING}>Platform</span>
          {[['Fixtures', '/fixtures'], ['Intelligence', '/odds'], ['Rankings', '/leagues'], ['Insights', '/articles'], ['Syndicate', '/syndicate']].map(([label, href]) => (
            <Link key={label} href={href} style={COL_LINK} className="gfooter-link">{label}</Link>
          ))}
        </nav>

        {/* Col 3 — About */}
        <nav aria-label="About links">
          <span style={COL_HEADING}>About</span>
          {[['Track record', '/fixtures']].map(([label, href]) => (
            <Link key={label} href={href} style={COL_LINK} className="gfooter-link">{label}</Link>
          ))}
          <a href="mailto:contactus@edgeanalysts.com" style={COL_LINK} className="gfooter-link">Contact</a>
        </nav>

        {/* Col 4 — Legal */}
        <nav aria-label="Legal links">
          <span style={COL_HEADING}>Legal</span>
          <p style={{...COL_LINK, cursor:'default', pointerEvents:'none', opacity:.6}}>18+ · Gamble responsibly</p>
          <p style={{...COL_LINK, cursor:'default', pointerEvents:'none', opacity:.6}}>Predictions for information only</p>
          <a href="https://www.begambleaware.org" target="_blank" rel="noopener noreferrer" style={COL_LINK} className="gfooter-link">BeGambleAware.org</a>
          <a href="https://www.gamcare.org.uk" target="_blank" rel="noopener noreferrer" style={COL_LINK} className="gfooter-link">GamCare.org.uk</a>
        </nav>
      </div>

      {/* ── RG / DISCLAIMER BAR ──────────────────────────────────────────── */}
      <div
        role="region"
        aria-label="Responsible gambling information"
        style={{
          borderTop: '1px solid rgba(247,245,240,0.05)',
          padding: '18px 56px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 12,
        }} className="gfooter-rg"
      >
        <p style={{
          fontFamily: "var(--font-body, 'Outfit', sans-serif)",
          fontWeight: 200, fontSize: 10.5,
          color: 'rgba(247,245,240,0.5)', lineHeight: 1.7,
          maxWidth: 740, margin: 0,
        }}>
          <span style={{ color: '#D96060', fontWeight: 600 }}>18+</span>
          {' · Gamble responsibly. Edge Analysts provides analytical information only and does not constitute betting advice. Odds are accurate at time of publication and subject to change. Edge Analysts earns commission when you sign up to an operator via our links. This does not affect the integrity of our analysis. Never bet more than you can afford to lose. '}
          <a href="https://www.begambleaware.org" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(247,245,240,0.75)', textDecoration: 'underline' }}>BeGambleAware.org</a>
          {' · '}
          <a href="https://www.gamcare.org.uk" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(247,245,240,0.75)', textDecoration: 'underline' }}>GamCare.org.uk</a>
          {' · '}
          <a href="https://www.gamstop.co.uk" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(247,245,240,0.75)', textDecoration: 'underline' }}>GamStop.co.uk</a>
        </p>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          {[
            ['BeGambleAware', 'https://www.begambleaware.org'],
            ['GamCare', 'https://www.gamcare.org.uk'],
            ['GamStop', 'https://www.gamstop.co.uk'],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${label} (opens in new tab)`}
              style={{
                fontFamily: "var(--font-mono, 'DM Mono', monospace)",
                fontSize: 10.5, letterSpacing: '0.04em',
                border: '1px solid rgba(247,245,240,0.15)',
                borderRadius: 2, padding: '3px 7px',
                color: 'rgba(247,245,240,0.45)',
                textDecoration: 'none', display: 'inline-block',
              }}
            >{label}</a>
          ))}
        </div>
      </div>

      {/* ── LEGAL IDENTITY BAR ───────────────────────────────────────────── */}
      <div style={{
        borderTop: '1px solid rgba(247,245,240,0.04)',
        padding: '10px 56px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 8,
      }} className="gfooter-legal">
        <p style={{
          fontFamily: "var(--font-body, 'Outfit', sans-serif)",
          fontWeight: 200, fontSize: 9.5,
          color: 'rgba(247,245,240,0.3)', lineHeight: 1.6, margin: 0,
        }}>
          © {new Date().getFullYear()} Edge Analysts Ltd · Company No. 17294865 · Registered in England and Wales
        </p>
        <p style={{
          fontFamily: "var(--font-body, 'Outfit', sans-serif)",
          fontWeight: 200, fontSize: 9.5,
          color: 'rgba(247,245,240,0.3)', lineHeight: 1.6, margin: 0,
        }}>
          ICO Registration: Edge Analysts Ltd · Ref ZC180294
        </p>
      </div>

      <style>{`
        .gfooter-link:hover { color: rgba(247,245,240,0.95) !important; }
        .gfooter-social { display:flex; align-items:center; justify-content:center; width:32px; height:32px; border:1px solid rgba(247,245,240,0.15); border-radius:4px; color:rgba(247,245,240,0.55); text-decoration:none; transition:all .15s; }
        .gfooter-social:hover { border-color:rgba(247,245,240,0.4) !important; color:#F7F5F0 !important; }
        @media (max-width: 768px) {
          .gfooter-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            padding: 40px 20px 28px !important;
            gap: 24px 16px !important;
          }
          .gfooter-brand {
            grid-column: 1 / -1 !important;
            padding-bottom: 8px !important;
            border-bottom: 1px solid rgba(247,245,240,0.06) !important;
          }
          .gfooter-rg, .gfooter-legal {
            padding-left: 20px !important;
            padding-right: 20px !important;
          }
        }
      `}</style>
    </footer>
  );
}
