"use client";

// ── LEAGUE TABLE WIDGET ───────────────────────────────────────────────────────
// Paste your embed URL into WIDGET_URL below to activate.
// e.g. "https://widgets.sofascore.com/embed/unique-tournament/17/season/XXXXX/standings/total"
// Once set, the iframe renders automatically wherever <LeagueTable /> is used.

const WIDGET_URL = null;

const SKELETON_ROWS = [
  { w: '68%' }, { w: '72%' }, { w: '60%' }, { w: '75%' }, { w: '64%' },
  { w: '70%' }, { w: '58%' }, { w: '66%' }, { w: '62%' }, { w: '55%' },
];

export default function LeagueTable({ src = WIDGET_URL, height = 340 }) {
  return (
    <div style={{
      background: '#0C1018',
      border: '1px solid rgba(74,127,212,0.07)',
      borderTop: '2px solid #1853B4',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid rgba(74,127,212,0.07)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1853B4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
          </svg>
          <span style={{ fontFamily: "var(--font-mono, 'DM Mono', monospace)", fontSize: 11, color: '#4A7FD4', letterSpacing: '0.1em', textTransform: 'uppercase' }}>PL Table</span>
        </div>
        <span style={{ fontFamily: "var(--font-mono, 'DM Mono', monospace)", fontSize: 10, color: '#8A9AAC', letterSpacing: '0.06em' }}>2025/26</span>
      </div>

      {src ? (
        /* ── Live widget ──────────────────────────────────────────────────── */
        <iframe
          src={src}
          title="Premier League Table"
          style={{ width: '100%', height, border: 'none', display: 'block', flexShrink: 0 }}
          scrolling="no"
          loading="lazy"
        />
      ) : (
        /* ── Placeholder skeleton ─────────────────────────────────────────── */
        <div style={{ height, display: 'flex', flexDirection: 'column', padding: '12px 14px', gap: 0 }}>

          {/* Column headers */}
          <div style={{ display: 'grid', gridTemplateColumns: '20px 1fr 22px 22px 22px 26px', gap: 4, paddingBottom: 8, borderBottom: '1px solid rgba(74,127,212,0.06)', marginBottom: 6 }}>
            {['#', 'Club', 'P', 'W', 'D', 'Pts'].map(h => (
              <div key={h} style={{ fontFamily: "var(--font-mono, 'DM Mono', monospace)", fontSize: 9, color: '#4A5A6C', letterSpacing: '0.1em', textAlign: h === 'Club' || h === '#' ? 'left' : 'center' }}>{h}</div>
            ))}
          </div>

          {/* Skeleton rows */}
          {SKELETON_ROWS.map((row, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '20px 1fr 22px 22px 22px 26px', gap: 4, alignItems: 'center', padding: '5px 0', borderBottom: '1px solid rgba(74,127,212,0.04)', opacity: 1 - i * 0.04 }}>
              <div style={{ height: 7, width: 12, background: 'rgba(74,127,212,0.12)', borderRadius: 1 }} />
              <div style={{ height: 7, width: row.w, background: 'rgba(74,127,212,0.1)', borderRadius: 1 }} />
              <div style={{ height: 7, background: 'rgba(74,127,212,0.08)', borderRadius: 1 }} />
              <div style={{ height: 7, background: 'rgba(74,127,212,0.08)', borderRadius: 1 }} />
              <div style={{ height: 7, background: 'rgba(74,127,212,0.08)', borderRadius: 1 }} />
              <div style={{ height: 7, background: 'rgba(74,127,212,0.14)', borderRadius: 1 }} />
            </div>
          ))}

          {/* Activate prompt */}
          <div style={{ marginTop: 'auto', paddingTop: 10, textAlign: 'center' }}>
            <div style={{ fontFamily: "var(--font-mono, 'DM Mono', monospace)", fontSize: 9, color: '#3A4A5C', letterSpacing: '0.08em', lineHeight: 1.8 }}>
              Paste widget URL into<br />
              <span style={{ color: '#4A7FD4' }}>app/components/LeagueTable.js</span>
            </div>
          </div>

        </div>
      )}

      {/* Footer */}
      <div style={{ padding: '7px 16px', borderTop: '1px solid rgba(74,127,212,0.05)', flexShrink: 0 }}>
        <span style={{ fontFamily: "var(--font-mono, 'DM Mono', monospace)", fontSize: 9, color: '#3A4A5C', letterSpacing: '0.06em' }}>Premier League · 2025/26 Season</span>
      </div>

    </div>
  );
}
