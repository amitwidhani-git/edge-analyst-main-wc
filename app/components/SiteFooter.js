const COMPLIANCE_LINKS = [
  'Responsible Gambling',
  'Affiliate Disclosure',
  'Methodology',
  'Privacy',
  'Terms',
];

export default function SiteFooter() {
  return (
    <footer style={{
      borderTop: '2px solid #1853B4',
      padding: '20px clamp(20px,3vw,60px)',
      background: 'var(--ea-surface)',
      display: 'flex', flexDirection: 'column', gap: 0,
    }}>
      {/* Top row: compliance badges + links */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: "var(--font-mono, 'DM Mono', monospace)", fontSize: 11, fontWeight: 800,
            padding: '3px 8px', border: '1.5px solid #E53E3E', color: '#E53E3E',
            letterSpacing: '0.06em', background: 'rgba(229,62,62,0.08)',
          }}>18+</span>
          <span style={{ fontFamily: "var(--font-mono, 'DM Mono', monospace)", fontSize: 11, color: 'var(--ea-green)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
            Gamble responsibly
          </span>
          <a href="https://www.begambleaware.org" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-mono, 'DM Mono', monospace)", fontSize: 11, color: 'var(--ea-green)', textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
            BeGambleAware.org
          </a>
          <a href="https://www.gamstop.co.uk" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-mono, 'DM Mono', monospace)", fontSize: 11, color: 'var(--ea-green)', textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
            GamStop
          </a>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {COMPLIANCE_LINKS.map(label => (
            <a key={label} href="#" style={{ fontFamily: "var(--font-mono, 'DM Mono', monospace)", fontSize: 11, color: 'var(--ea-green)', textDecoration: 'none', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>
              {label}
            </a>
          ))}
        </div>
      </div>

      {/* Strapline */}
      <div style={{
        fontFamily: "var(--font-bebas, 'Bebas Neue', sans-serif)", fontStyle: 'italic', fontSize: 15, fontWeight: 600,
        color: 'var(--ea-blue-mid)', letterSpacing: '0.03em',
        textAlign: 'center', padding: '10px 0 6px',
        borderTop: '1px solid var(--ea-border)', marginTop: 14,
      }}>
        We have the data, so you can have the edge.
      </div>

      {/* Legal */}
      <div style={{
        fontFamily: "var(--font-mono, 'DM Mono', monospace)", fontSize: 11, color: 'var(--ea-text-dim)',
        marginTop: 3, letterSpacing: '0.04em', textAlign: 'center',
      }}>
        Edge Analysts Ltd &nbsp;·&nbsp; England &amp; Wales &nbsp;·&nbsp; Not betting recommendations &nbsp;·&nbsp; © 2026
      </div>

      {/* Image credit */}
      <div style={{
        fontFamily: "var(--font-mono, 'DM Mono', monospace)", fontSize: 10, color: 'var(--ea-text-dim)',
        marginTop: 6, letterSpacing: '0.03em', textAlign: 'center', opacity: 0.55,
      }}>
        Hero image: <a href="https://commons.wikimedia.org/wiki/File:Metlife_stadium_(Aerial_view).jpg" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>MetLife Stadium</a> © Anthony Quintano / <a href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>CC BY 2.0</a>
      </div>
    </footer>
  );
}
