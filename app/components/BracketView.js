"use client";
import { useState, useRef, useLayoutEffect, useMemo } from "react";

const ACCENT = '#C8FF00';
const ROUND_LABELS = ['Round of 32', 'Round of 16', 'Quarter-Final', 'Semi-Final', 'Final'];

/* R32 match indices (1-based) that feed each R16 slot. Display order here is
   NOT R16-id order — it's bracket-branch order, arranged so that generically
   pairing adjacent slots (0,1)(2,3)(4,5)(6,7) produces the real QF groupings:
   QF-1 = R16-1+R16-2 (Houston/Philadelphia), QF-2 = R16-5+R16-6 (LA/Seattle),
   QF-3 = R16-3+R16-4 (Atlanta/Mexico City), QF-4 = R16-7+R16-8 (Miami/KC).
   That in turn makes the QF→SF adjacent pairing land on QF-1×QF-2 and
   QF-3×QF-4, matching the actual semi-final draw. */
const R32_TO_R16_PAIRS = [
  [1,  4],   // R16-1: W(R32-1) vs W(R32-4)   — Houston      4 Jul  ┐ feeds QF-1
  [3,  6],   // R16-2: W(R32-3) vs W(R32-6)   — Philadelphia 4 Jul  ┘ (Boston)
  [11, 12],  // R16-5: W(R32-11) vs W(R32-12) — Los Angeles  6 Jul  ┐ feeds QF-2
  [9,  10],  // R16-6: W(R32-9) vs W(R32-10)  — Seattle      7 Jul  ┘ (LA)
  [2,  5],   // R16-3: W(R32-2) vs W(R32-5)   — Atlanta      5 Jul  ┐ feeds QF-3
  [7,  8],   // R16-4: W(R32-7) vs W(R32-8)   — Mexico City  6 Jul  ┘ (Miami)
  [14, 15],  // R16-7: W(R32-14) vs W(R32-15) — Miami        7 Jul  ┐ feeds QF-4
  [13, 16],  // R16-8: W(R32-13) vs W(R32-16) — Kansas City  7 Jul  ┘ (KC)
];

/* Known dates & venues for rounds 1–4 (R32 dates come from data). R16 order
   matches R32_TO_R16_PAIRS above (bracket-branch order, not R16-id order). */
const ROUND_METADATA = [
  null, // R32 — from data
  [ // R16, in bracket-branch order (feeds QF-1, QF-1, QF-2, QF-2, QF-3, QF-3, QF-4, QF-4)
    { date: '2026-07-04', venue: 'Houston' },
    { date: '2026-07-04', venue: 'Philadelphia' },
    { date: '2026-07-06', venue: 'Los Angeles' },
    { date: '2026-07-07', venue: 'Seattle' },
    { date: '2026-07-05', venue: 'Atlanta' },
    { date: '2026-07-06', venue: 'Mexico City' },
    { date: '2026-07-07', venue: 'Miami' },
    { date: '2026-07-07', venue: 'Kansas City' },
  ],
  [ // QF-1 .. QF-4, in official order — (R16-1+2), (R16-5+6), (R16-3+4), (R16-7+8)
    { date: '2026-07-09', venue: 'Boston' },
    { date: '2026-07-10', venue: 'Los Angeles' },
    { date: '2026-07-11', venue: 'Miami' },
    { date: '2026-07-12', venue: 'Kansas City' },
  ],
  [ // SF-1 = W(QF-1) vs W(QF-2), SF-2 = W(QF-3) vs W(QF-4)
    { date: '2026-07-14', venue: 'Dallas' },
    { date: '2026-07-15', venue: 'Atlanta' },
  ],
  [ // Final: M104
    { date: '2026-07-19', venue: 'New York' },
  ],
];

function dayLabel(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + 'T00:00:00');
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const diff = Math.round((d - today) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

function buildBracketRounds(matches) {
  // Keyed by lowercased stage — data casing has drifted before (e.g. "Quarter-final"
  // vs a hardcoded "Quarter-Final" lookup), which silently hid completed QF results.
  const byStage = {};
  (matches || []).forEach(m => {
    if (!m.stage || m.stage.toLowerCase() === 'group stage') return;
    const key = m.stage.toLowerCase();
    (byStage[key] ||= []).push(m);
  });

  const r32 = byStage['round of 32'] || [];
  const byNum = {};
  r32.forEach(m => {
    const n = parseInt(String(m.id).split('-')[1], 10);
    if (!Number.isNaN(n)) byNum[n] = m;
  });

  // Build R32 display list in official bracket order (pairs = wall-chart adjacency)
  const round0 = R32_TO_R16_PAIRS.flatMap(([a, b]) => [a, b]).map(n => {
    const m = byNum[n];
    if (!m) return { home: null, away: null, status: 'upcoming', date: null, venue: null, winnerName: null };
    return {
      home:       { name: m.home, score: m.home_score },
      away:       { name: m.away, score: m.away_score },
      status:     m.status,
      date:       m.date,
      venue:      m.venue || null,
      winnerName: m.status === 'completed' ? (m.actual_result || null) : null,
    };
  });

  const rounds = [round0];
  let prev = round0;
  for (let r = 1; r < ROUND_LABELS.length; r++) {
    const stageMatches = byStage[ROUND_LABELS[r].toLowerCase()] || [];
    const next = [];
    for (let i = 0; i < prev.length; i += 2) {
      const a = prev[i], b = prev[i + 1];
      const meta = ROUND_METADATA[r]?.[i / 2];
      const teamsKnown = a?.winnerName && b?.winnerName;
      // Match this bracket slot to its real fixture by the pair of team names,
      // since the stage's own id numbering doesn't follow bracket display order.
      const real = teamsKnown && stageMatches.find(m => {
        const names = [m.home, m.away];
        return names.includes(a.winnerName) && names.includes(b.winnerName);
      });
      if (real) {
        next.push({
          home:       { name: real.home, score: real.home_score },
          away:       { name: real.away, score: real.away_score },
          status:     real.status,
          date:       real.date,
          venue:      real.venue || meta?.venue || null,
          winnerName: real.status === 'completed' ? (real.actual_result || null) : null,
        });
      } else {
        next.push({
          home:       a?.winnerName ? { name: a.winnerName, score: null } : null,
          away:       b?.winnerName ? { name: b.winnerName, score: null } : null,
          status:     'upcoming',
          date:       meta?.date  || null,
          venue:      meta?.venue || null,
          winnerName: null,
        });
      }
    }
    rounds.push(next);
    prev = next;
  }
  return rounds;
}

function BracketCard({ node }) {
  const isDone  = node.status === 'completed';
  const label   = dayLabel(node.date);

  const TeamRow = ({ side }) => {
    const data     = node[side];
    const isWinner = isDone && data && node.winnerName === data.name;
    const isLoser  = isDone && data && node.winnerName && node.winnerName !== data.name;
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
        padding: '7px 10px',
        background:  isWinner ? 'rgba(200,255,0,.05)' : 'transparent',
        borderLeft:  `2px solid ${isWinner ? ACCENT : 'transparent'}`,
      }}>
        <span style={{
          fontFamily: "var(--font-bebas,'Bebas Neue',sans-serif)", fontSize: 14, letterSpacing: '.02em',
          color:      data ? (isLoser ? 'rgba(247,245,240,.36)' : '#F7F5F0') : 'rgba(247,245,240,.22)',
          overflow:   'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
        }}>{data?.name || 'TBD'}</span>
        {isDone && data?.score != null && (
          <span style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 11, fontWeight: 600, color: isWinner ? ACCENT : 'rgba(247,245,240,.38)', flexShrink: 0 }}>
            {data.score}
          </span>
        )}
      </div>
    );
  };

  return (
    <div style={{ border: '1px solid rgba(247,245,240,.08)', background: 'rgba(247,245,240,.015)', borderRadius: 2, overflow: 'hidden', width: 200 }}>
      {/* Card header: date + venue + FT badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 10px', borderBottom: '1px solid rgba(247,245,240,.06)', gap: 6 }}>
        <div style={{ minWidth: 0 }}>
          <span style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 7.5, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(247,245,240,.4)' }}>
            {label || 'TBD'}
          </span>
          {node.venue && (
            <span style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 7, color: 'rgba(247,245,240,.2)', marginLeft: 6 }}>
              · {node.venue}
            </span>
          )}
        </div>
        {isDone && (
          <span style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 6.5, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(247,245,240,.45)', background: 'rgba(247,245,240,.06)', padding: '1px 6px', borderRadius: 2, flexShrink: 0 }}>FT</span>
        )}
      </div>
      <TeamRow side="home" />
      <div style={{ height: 1, background: 'rgba(247,245,240,.04)' }} />
      <TeamRow side="away" />
    </div>
  );
}

export default function BracketView({ matches }) {
  const containerRef = useRef(null);
  const cardRefs     = useRef({});
  const [lines, setLines] = useState([]);
  const [dims,  setDims]  = useState({ w: 0, h: 0 });

  const rounds = useMemo(() => buildBracketRounds(matches), [matches]);

  useLayoutEffect(() => {
    function recompute() {
      const cEl = containerRef.current;
      if (!cEl) return;
      const cRect = cEl.getBoundingClientRect();
      const newLines = [];

      for (let r = 1; r < rounds.length; r++) {
        rounds[r].forEach((_, i) => {
          const selfEl = cardRefs.current[`${r}-${i}`];
          const aEl    = cardRefs.current[`${r - 1}-${i * 2}`];
          const bEl    = cardRefs.current[`${r - 1}-${i * 2 + 1}`];
          if (!selfEl || !aEl || !bEl) return;

          const sRect = selfEl.getBoundingClientRect();
          const aRect = aEl.getBoundingClientRect();
          const bRect = bEl.getBoundingClientRect();

          const x0   = aRect.right  - cRect.left;
          const yA   = aRect.top    + aRect.height / 2 - cRect.top;
          const yB   = bRect.top    + bRect.height / 2 - cRect.top;
          const x1   = sRect.left   - cRect.left;
          const yS   = sRect.top    + sRect.height / 2 - cRect.top;
          const midX = x0 + (x1 - x0) / 2;

          // Elbow from child A → parent
          newLines.push(`M${x0.toFixed(1)},${yA.toFixed(1)} H${midX.toFixed(1)} V${yS.toFixed(1)} H${x1.toFixed(1)}`);
          // Elbow from child B → parent
          newLines.push(`M${x0.toFixed(1)},${yB.toFixed(1)} H${midX.toFixed(1)} V${yS.toFixed(1)} H${x1.toFixed(1)}`);
        });
      }

      setLines(newLines);
      setDims({ w: cRect.width, h: cRect.height });
    }

    recompute();
    const ro = new ResizeObserver(recompute);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener('resize', recompute);
    return () => { ro.disconnect(); window.removeEventListener('resize', recompute); };
  }, [rounds]);

  return (
    <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
      <div
        ref={containerRef}
        style={{ position: 'relative', display: 'flex', gap: 56, minWidth: 1340, padding: '8px 4px 24px', alignItems: 'stretch' }}
      >
        {/* SVG connector lines layer */}
        <svg style={{ position: 'absolute', inset: 0, width: dims.w || '100%', height: dims.h || '100%', pointerEvents: 'none', overflow: 'visible' }}>
          {lines.map((d, i) => (
            <path key={i} d={d} fill="none" stroke="rgba(247,245,240,.14)" strokeWidth="1" />
          ))}
        </svg>

        {rounds.map((round, r) => (
          <div
            key={r}
            style={{ display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1, width: 200, flexShrink: 0 }}
          >
            {/* Round label */}
            <div style={{ fontFamily: "var(--font-mono,'DM Mono',monospace)", fontSize: 8, letterSpacing: '.14em', textTransform: 'uppercase', color: r === ROUND_LABELS.length - 1 ? ACCENT : 'rgba(247,245,240,.38)', marginBottom: 16, textAlign: 'center', whiteSpace: 'nowrap' }}>
              {ROUND_LABELS[r]}
            </div>

            {/* Cards evenly distributed across the full column height */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', flex: 1 }}>
              {round.map((node, i) => (
                <div key={i} ref={el => { cardRefs.current[`${r}-${i}`] = el; }} style={{ margin: '10px 0' }}>
                  <BracketCard node={node} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
