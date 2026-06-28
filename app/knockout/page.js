"use client";
import { useState, useEffect } from "react";

const ACCENT = '#C8FF00';
const BG     = '#080808';
const TEXT   = '#F7F5F0';

const GROUPS = ['A','B','C','D','E','F','G','H','I','J','K','L'];

/* ─── Official R32 pairing rules ────────────────────────────────────────────
   W = group winner, R = runner-up, '3rd' = best third-place slot (TBD)
──────────────────────────────────────────────────────────────────────────── */
const FIXTURES = [
  { id:1,  home:{group:'A',pos:'R'}, away:{group:'B',pos:'R'} },
  { id:2,  home:{group:'E',pos:'W'}, away:{pos:'3rd'}          },
  { id:3,  home:{group:'F',pos:'W'}, away:{group:'C',pos:'R'} },
  { id:4,  home:{group:'C',pos:'W'}, away:{group:'F',pos:'R'} },
  { id:5,  home:{group:'I',pos:'W'}, away:{pos:'3rd'}          },
  { id:6,  home:{group:'E',pos:'R'}, away:{group:'I',pos:'R'} },
  { id:7,  home:{group:'A',pos:'W'}, away:{pos:'3rd'}          },
  { id:8,  home:{group:'L',pos:'W'}, away:{pos:'3rd'}          },
  { id:9,  home:{group:'D',pos:'W'}, away:{pos:'3rd'}          },
  { id:10, home:{group:'G',pos:'W'}, away:{pos:'3rd'}          },
  { id:11, home:{group:'K',pos:'R'}, away:{group:'L',pos:'R'} },
  { id:12, home:{group:'H',pos:'W'}, away:{group:'J',pos:'R'} },
  { id:13, home:{group:'B',pos:'W'}, away:{pos:'3rd'}          },
  { id:14, home:{group:'J',pos:'W'}, away:{group:'H',pos:'R'} },
  { id:15, home:{group:'K',pos:'W'}, away:{pos:'3rd'}          },
  { id:16, home:{group:'D',pos:'R'}, away:{group:'G',pos:'R'} },
];

/* ─── Compute actual group standings from completed matches only ─────────── */
function computeActualStandings(matches) {
  const groups = {};
  for (const m of matches) {
    if (!m.group || m.stage !== 'Group Stage') continue;
    if (!groups[m.group]) groups[m.group] = {};
    const g = groups[m.group];
    if (!g[m.home]) g[m.home] = { pts:0, w:0, d:0, l:0, gf:0, ga:0, p:0 };
    if (!g[m.away]) g[m.away] = { pts:0, w:0, d:0, l:0, gf:0, ga:0, p:0 };
  }
  for (const m of matches) {
    if (!m.group || m.stage !== 'Group Stage' || m.status !== 'completed' || m.home_score == null) continue;
    const g = groups[m.group];
    const hs = m.home_score, as_ = m.away_score;
    g[m.home].p++; g[m.away].p++;
    g[m.home].gf += hs; g[m.home].ga += as_;
    g[m.away].gf += as_; g[m.away].ga += hs;
    if (hs > as_)      { g[m.home].w++; g[m.home].pts += 3; g[m.away].l++; }
    else if (hs < as_) { g[m.away].w++; g[m.away].pts += 3; g[m.home].l++; }
    else               { g[m.home].d++; g[m.home].pts++;    g[m.away].d++; g[m.away].pts++; }
  }
  const result = {};
  for (const [grp, teams] of Object.entries(groups)) {
    result[grp] = Object.entries(teams)
      .map(([name, s]) => ({ name, ...s, gd: s.gf - s.ga }))
      .sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
  }
  return result;
}

/* ─── Determine each team's qualification status ────────────────────────── */
// WC 2026 format: 12 groups × 4 teams → top 2 qualify directly (24 teams)
// + 8 best third-placed teams = 32 total.
//
// "through" → confirmed in top 2 of their group (≤1 team can end above them).
// "tbc"     → everything else: fighting for top 2, OR confirmed/possible 3rd
//             (still eligible as a best-3rd wildcard until all groups finish).
// "out"     → definitively 4th — 3 teams already beyond their best possible
//             score, so they can't even be the group's 3rd-place team.
//
// The key subtlety: when two teams are tied on points with 0 games left, the
// one currently ranked LOWER (by GD/GF) must treat the higher-ranked team as
// "effectively above them" — the tiebreaker is already settled.
function computeTeamStatuses(standings) {
  const statuses = {};
  for (const [, teams] of Object.entries(standings)) {
    teams.forEach((team, idx) => {
      const gamesLeft = 3 - team.p;
      const maxPts    = team.pts + gamesLeft * 3;

      // Count teams that could plausibly end up ABOVE this team:
      // (a) any team whose maximum possible pts STRICTLY exceeds this team's floor, OR
      // (b) a team with the SAME pts and 0 games left that is currently ranked higher
      //     (tiebreaker already locked — their GD/GF is already better and won't change)
      const couldEndAbove = teams.filter((o, oIdx) => {
        if (o.name === team.name) return false;
        const oMax = o.pts + (3 - o.p) * 3;
        if (oMax > team.pts) return true;
        // Tiebreaker case: equal pts, no games left for either, other team ranks higher now
        if (oIdx < idx && o.pts === team.pts && gamesLeft === 0 && (3 - o.p) === 0) return true;
        return false;
      }).length;

      // Count teams already definitively beyond this team's best possible score.
      // Need >= 3 to be "out" — in this 48-team format a 3rd-place team can still
      // qualify as one of the 8 best third-placed teams across all 12 groups.
      const defAbove = teams.filter(o => o.name !== team.name && o.pts > maxPts).length;

      if (defAbove >= 3) {
        statuses[team.name] = 'out';
      } else if (couldEndAbove <= 1) {
        statuses[team.name] = 'through';
      } else {
        statuses[team.name] = 'tbc';
      }
    });
  }
  return statuses;
}

/* ─── Custom cursor ─────────────────────────────────────────────────────── */
function useCursor() {
  useEffect(() => {
    document.body.style.cursor = 'none';
    const cur  = document.getElementById('ea-cur');
    const dot  = document.getElementById('ea-dot');
    const ring = document.getElementById('ea-ring');
    if (!cur || !dot || !ring) return;
    let mx = window.innerWidth/2, my = window.innerHeight/2, rx = mx, ry = my, rafId;
    const onMove = e => {
      mx = e.clientX; my = e.clientY;
      let isDark = true;
      for (const sec of document.querySelectorAll('[data-theme]')) {
        const { top, bottom } = sec.getBoundingClientRect();
        if (e.clientY >= top && e.clientY < bottom) { isDark = sec.dataset.theme === 'dark'; break; }
      }
      dot.style.background   = isDark ? TEXT : BG;
      ring.style.borderColor = isDark ? 'rgba(247,245,240,.55)' : 'rgba(8,8,8,.55)';
    };
    const loop = () => {
      rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
      cur.style.left = mx + 'px'; cur.style.top = my + 'px';
      ring.style.left = (rx - mx) + 'px'; ring.style.top = (ry - my) + 'px';
      rafId = requestAnimationFrame(loop);
    };
    document.addEventListener('mousemove', onMove);
    rafId = requestAnimationFrame(loop);
    const add = () => document.body.classList.add('lp-hovering');
    const rem = () => document.body.classList.remove('lp-hovering');
    document.querySelectorAll('a,button').forEach(el => {
      el.addEventListener('mouseenter', add); el.addEventListener('mouseleave', rem);
    });
    return () => {
      document.body.style.cursor = '';
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);
}

/* ─── Status dot ────────────────────────────────────────────────────────── */
function StatusDot({ status }) {
  const color = status === 'through' ? ACCENT
    : status === 'tbc' ? 'rgba(240,165,0,.9)'
    : 'rgba(247,245,240,.22)';
  return <span style={{ width:6, height:6, borderRadius:'50%', background:color, display:'inline-block', flexShrink:0 }} />;
}

/* ─── Status badge ──────────────────────────────────────────────────────── */
function StatusBadge({ status }) {
  const cfg = {
    through: { color:ACCENT,                bg:'rgba(200,255,0,.1)',   border:'rgba(200,255,0,.28)',  label:'Through' },
    tbc:     { color:'rgba(240,165,0,.9)',  bg:'rgba(240,165,0,.08)', border:'rgba(240,165,0,.22)', label:'TBC'     },
    out:     { color:'rgba(229,62,62,.8)',  bg:'rgba(229,62,62,.07)', border:'rgba(229,62,62,.18)', label:'Out'     },
  };
  const c = cfg[status] || cfg.tbc;
  return (
    <span style={{
      fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:7, letterSpacing:'.1em', textTransform:'uppercase',
      color:c.color, background:c.bg, border:`1px solid ${c.border}`, padding:'2px 6px', borderRadius:2, flexShrink:0,
    }}>{c.label}</span>
  );
}

/* ─── Group card (Tracker tab) ──────────────────────────────────────────── */
function GroupCard({ group, teams, statuses }) {
  return (
    <div style={{ border:'1px solid rgba(247,245,240,.07)', background:'rgba(247,245,240,.02)', padding:'16px 20px' }}>
      <div style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:7.5, letterSpacing:'.14em', textTransform:'uppercase', color:ACCENT, marginBottom:12 }}>
        Group {group}
      </div>
      {teams.map((team, i) => {
        const status = statuses[team.name] || 'tbc';
        const gdStr  = team.gd > 0 ? `+${team.gd}` : `${team.gd}`;
        return (
          <div key={team.name} style={{ display:'flex', alignItems:'center', gap:8, padding:'7px 0', borderBottom: i < teams.length-1 ? '1px solid rgba(247,245,240,.04)' : 'none' }}>
            <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:9, color:'rgba(247,245,240,.22)', width:12, textAlign:'right', flexShrink:0 }}>{i+1}</span>
            <StatusDot status={status} />
            <span style={{ fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)", fontSize:15, letterSpacing:'.04em', color: i < 2 ? TEXT : 'rgba(247,245,240,.38)', flex:1 }}>
              {team.name}
            </span>
            <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:9, color:'rgba(247,245,240,.28)', marginRight:2, minWidth:28, textAlign:'right' }}>
              {gdStr}
            </span>
            <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:7, letterSpacing:'.06em', textTransform:'uppercase', color:'rgba(247,245,240,.2)', marginRight:6 }}>GD</span>
            <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:9, color:'rgba(247,245,240,.45)', marginRight:6 }}>
              {team.pts}pt
            </span>
            <StatusBadge status={status} />
          </div>
        );
      })}
    </div>
  );
}

/* ─── R32 fixture card (Fixtures tab) ──────────────────────────────────── */
function FixtureCard({ fixture, standings, statuses, tm }) {
  const resolve = side => {
    if (side.pos === '3rd') return null;
    const grpTeams = standings[side.group];
    if (!grpTeams) return null;
    return (side.pos === 'W' ? grpTeams[0] : grpTeams[1]) || null;
  };

  const homeData = resolve(fixture.home);
  const awayData = fixture.away.pos === '3rd' ? null : resolve(fixture.away);

  const homeName      = homeData?.name;
  const awayName      = awayData?.name;
  const homeConfirmed = homeName && statuses[homeName] === 'through';
  const awayConfirmed = fixture.away.pos !== '3rd' && awayName && statuses[awayName] === 'through';

  const sideLabel = side =>
    side.pos === '3rd'            ? 'Best 3rd Place (TBD · 29 Jun)'
    : side.pos === 'W'            ? `Winner Group ${side.group}`
    :                               `Runner-up Group ${side.group}`;

  const bothConfirmed = homeConfirmed && awayConfirmed;
  const oneConfirmed  = !bothConfirmed && (homeConfirmed || awayConfirmed);
  const borderColor   = bothConfirmed ? ACCENT : oneConfirmed ? 'rgba(240,165,0,.7)' : 'rgba(247,245,240,.14)';

  /* Render one team row — only names/ELO when confirmed */
  const TeamRow = ({ side, name, confirmed }) => {
    if (side.pos === '3rd') {
      return (
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ width:6, height:6, borderRadius:'50%', background:'rgba(247,245,240,.16)', display:'inline-block', flexShrink:0 }} />
          <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8.5, letterSpacing:'.08em', textTransform:'uppercase', color:'rgba(247,245,240,.28)', flex:1 }}>
            Best 3rd Place
          </span>
          <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:7.5, color:'rgba(247,245,240,.2)', flexShrink:0 }}>TBD · 29 Jun</span>
        </div>
      );
    }
    if (confirmed && name) {
      const elo  = tm[name]?.elo;
      const conf = tm[name]?.conf;
      return (
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <StatusDot status="through" />
          <span style={{ fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)", fontSize:19, letterSpacing:'.04em', color:TEXT, flex:1, lineHeight:1 }}>
            {name}
          </span>
          {elo  && <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:9, color:'rgba(247,245,240,.45)', flexShrink:0 }}>{elo} <span style={{ color:'rgba(247,245,240,.25)' }}>ELO</span></span>}
          {conf && <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:7.5, color:'rgba(247,245,240,.25)', flexShrink:0 }}>{conf}</span>}
        </div>
      );
    }
    /* Not confirmed — show slot label only, no team name */
    return (
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <span style={{ width:6, height:6, borderRadius:'50%', background:'rgba(240,165,0,.5)', display:'inline-block', flexShrink:0 }} />
        <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8.5, letterSpacing:'.08em', textTransform:'uppercase', color:'rgba(247,245,240,.3)', flex:1 }}>
          {sideLabel(side)}
        </span>
      </div>
    );
  };

  return (
    <div style={{
      border: `1px solid ${bothConfirmed ? 'rgba(200,255,0,.13)' : 'rgba(247,245,240,.06)'}`,
      borderLeft: `2px solid ${borderColor}`,
      background: bothConfirmed ? 'rgba(200,255,0,.015)' : 'rgba(247,245,240,.01)',
      padding: '14px 20px',
    }}>
      {/* Match number */}
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
        <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:7.5, color:ACCENT, letterSpacing:'.08em', flexShrink:0 }}>R32-{fixture.id}</span>
        <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:7.5, color:'rgba(247,245,240,.25)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
          {sideLabel(fixture.home)} vs {sideLabel(fixture.away)}
        </span>
      </div>

      <TeamRow side={fixture.home} name={homeName} confirmed={homeConfirmed} />
      <div style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, color:'rgba(247,245,240,.18)', paddingLeft:14, margin:'7px 0' }}>vs</div>
      <TeamRow side={fixture.away} name={awayName} confirmed={awayConfirmed} />
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────── */
export default function KnockoutPage() {
  useCursor();

  const [data,     setData]     = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [tab,      setTab]      = useState('tracker');
  const [imgReady, setImgReady] = useState(false);

  useEffect(() => { const t = setTimeout(() => setImgReady(true), 80); return () => clearTimeout(t); }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll('[data-r]:not(.lp-on)');
      if (!els.length) return;
      const io = new IntersectionObserver(
        entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('lp-on'); io.unobserve(e.target); } }),
        { threshold: 0.04, rootMargin: '0px 0px -20px 0px' }
      );
      els.forEach(el => io.observe(el));
      return () => io.disconnect();
    }, 80);
    return () => clearTimeout(timer);
  }, [data, loading, tab]);

  useEffect(() => {
    fetch('/api/wc2026', { cache: 'no-store' }).then(r => r.json()).then(setData).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const matches   = data?.matches || [];
  const teamStats = data?.teamStats || [];
  const tm        = Object.fromEntries(teamStats.map(t => [t.team, t]));
  const standings = computeActualStandings(matches);
  const statuses  = computeTeamStatuses(standings);

  /* KPI counts — expressed as R32 slots (total = 32) */
  const allStatuses    = Object.values(statuses);
  const confirmedCount = allStatuses.filter(s => s === 'through').length;
  const tbcCount       = 32 - confirmedCount; // remaining R32 slots not yet confirmed
  const groupsDone     = GROUPS.filter(g => {
    const gm = matches.filter(m => m.group === g && m.stage === 'Group Stage');
    return gm.length >= 6 && gm.every(m => m.status === 'completed');
  }).length;
  const r32Set = FIXTURES.filter(f => {
    const hData = f.home.pos !== '3rd' ? standings[f.home.group]?.[f.home.pos === 'W' ? 0 : 1] : null;
    const aData = f.away.pos !== '3rd' ? standings[f.away.group]?.[f.away.pos === 'W' ? 0 : 1] : null;
    const hOk = hData && statuses[hData.name] === 'through';
    if (f.away.pos === '3rd') return hOk;
    return hOk && aData && statuses[aData.name] === 'through';
  }).length;

  return (
    <>
      <div id="ea-cur" style={{ position:'fixed', zIndex:9998, pointerEvents:'none', top:0, left:0 }} aria-hidden="true">
        <div id="ea-ring" style={{ width:36, height:36, border:'1.5px solid rgba(247,245,240,.55)', borderRadius:'50%', position:'absolute', transform:'translate(-50%,-50%)', transition:'width .2s,height .2s,border-color .2s' }} />
        <div id="ea-dot"  style={{ width:6, height:6, background:TEXT, borderRadius:'50%', position:'absolute', transform:'translate(-50%,-50%)', transition:'transform .08s,background .2s' }} />
      </div>

      <style>{`
        body.lp-hovering #ea-ring { width:52px!important; height:52px!important; border-color:${ACCENT}!important; }
        body.lp-hovering #ea-dot  { background:${ACCENT}!important; transform:translate(-50%,-50%) scale(1.4)!important; }
        [data-r] { opacity:0; transform:translateY(28px); transition:opacity .9s cubic-bezier(.22,1,.36,1), transform .9s cubic-bezier(.22,1,.36,1); }
        [data-r].lp-on { opacity:1; transform:none; }
        [data-r][data-d="1"] { transition-delay:.08s; }
        [data-r][data-d="2"] { transition-delay:.16s; }
        [data-r][data-d="3"] { transition-delay:.24s; }
        .ko-tab { font-family:var(--font-mono,'DM Mono',monospace); font-size:9px; letter-spacing:.12em; text-transform:uppercase; background:none; border:none; cursor:none; padding:14px 22px; color:rgba(247,245,240,.4); transition:color .2s; position:relative; }
        .ko-tab::after { content:''; position:absolute; bottom:0; left:22px; right:22px; height:1px; background:${ACCENT}; transform:scaleX(0); transform-origin:left; transition:transform .25s ease; }
        .ko-tab.active { color:${ACCENT}; }
        .ko-tab.active::after, .ko-tab:hover::after { transform:scaleX(1); }
        .ko-tab:hover { color:rgba(247,245,240,.8); }
      `}</style>

      <div style={{ background:BG, minHeight:'100vh', color:TEXT }}>

        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section data-theme="dark" className="ea-hero">
          <div style={{
            position:'absolute', inset:0,
            background:`url('https://images.unsplash.com/photo-1593766788306-28561086694e?w=1920&q=85&fit=crop') center 35%/cover no-repeat`,
            filter:'grayscale(100%) contrast(1.2) brightness(.2)',
            transform: imgReady ? 'scale(1)' : 'scale(1.06)',
            transition:'transform 12s ease',
          }} aria-hidden="true" />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom,rgba(8,8,8,.1) 0%,transparent 30%,rgba(8,8,8,.95) 80%),linear-gradient(to right,rgba(8,8,8,.55),transparent 60%)' }} aria-hidden="true" />
          <div style={{ position:'absolute', left:56, top:0, bottom:0, width:2, background:`linear-gradient(to bottom,transparent 10%,${ACCENT} 35%,${ACCENT} 70%,transparent 100%)`, opacity:.6 }} aria-hidden="true" />

          <div className="ea-hero__inner">
            <div data-r style={{ display:'flex', alignItems:'center', gap:16, marginBottom:28 }}>
              <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:7.5, letterSpacing:'.18em', textTransform:'uppercase', background:ACCENT, color:BG, padding:'5px 12px', borderRadius:2, display:'flex', alignItems:'center', gap:7 }}>
                <span style={{ width:5, height:5, borderRadius:'50%', background:BG, animation:'lp-blink 1.8s ease infinite' }} />
                WC 2026 · Knockout
              </span>
              <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, letterSpacing:'.12em', textTransform:'uppercase', color:'rgba(247,245,240,.5)' }}>
                Round of 32 · Qualification tracker
              </span>
            </div>

            <h1 data-r data-d="1" style={{ fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)", fontSize:'clamp(72px,12vw,160px)', lineHeight:.84, letterSpacing:'.008em' }}>
              <span style={{ fontFamily:"var(--font-serif,'Cormorant Garamond',serif)", fontStyle:'italic', fontWeight:300, fontSize:'.38em', color:'rgba(247,245,240,.6)', display:'block', lineHeight:1.2, marginBottom:'.06em' }}>The road to</span>
              <span style={{ color:ACCENT, display:'block' }}>The Final.</span>
            </h1>

            {/* KPI strip */}
            <div data-r data-d="2" className="ko-kpi-grid" style={{ borderTop:'1px solid rgba(247,245,240,.1)', marginTop:40 }}>
              {[
                { n: loading ? '—' : confirmedCount,    l:'R32 slots confirmed' },
                { n: loading ? '—' : tbcCount,          l:'R32 slots TBC' },
                { n: `${groupsDone}/12`,                 l:'Groups done' },
                { n: `${r32Set}/16`,                     l:'R32 matches set' },
              ].map((k, i) => (
                <div key={i} className="ko-kpi-cell" style={{ padding: i===0 ? '24px 40px 40px 0' : '24px 0 40px 40px', borderRight: i < 3 ? '1px solid rgba(247,245,240,.1)' : 'none' }}>
                  <div style={{ fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)", fontSize:'clamp(36px,4.5vw,64px)', lineHeight:.9, color:TEXT, marginBottom:10 }}>{k.n}</div>
                  <div style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, letterSpacing:'.1em', textTransform:'uppercase', color:'rgba(247,245,240,.5)' }}>{k.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TABS ─────────────────────────────────────────────────── */}
        <div data-theme="dark" style={{
          position:'sticky', top:78, zIndex:100,
          background:'rgba(8,8,8,.9)', backdropFilter:'blur(20px)',
          borderBottom:'1px solid rgba(247,245,240,.06)',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'0 clamp(20px,3vw,56px)',
        }}>
          <div style={{ display:'flex' }}>
            {[['tracker','Tracker'],['fixtures','R32 Fixtures']].map(([val, lbl]) => (
              <button key={val} onClick={() => setTab(val)} className={`ko-tab${tab===val?' active':''}`}>{lbl}</button>
            ))}
          </div>
          <div className="ko-tab-subtitle" style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:7.5, letterSpacing:'.1em', textTransform:'uppercase', color:'rgba(247,245,240,.3)', padding:'16px 0' }}>
            Updated after each matchday
          </div>
        </div>

        {/* ── TRACKER TAB ──────────────────────────────────────────── */}
        {tab === 'tracker' && (
          <section data-theme="dark" style={{ padding:'40px clamp(20px,3vw,56px)' }}>
            {/* Legend */}
            <div data-r style={{ marginBottom:28, display:'flex', alignItems:'center', gap:20, flexWrap:'wrap' }}>
              <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:7.5, letterSpacing:'.08em', textTransform:'uppercase', color:'rgba(247,245,240,.35)' }}>Legend</span>
              {[
                { color:ACCENT,                 label:'Through (top 2)' },
                { color:'rgba(240,165,0,.9)',    label:'TBC (incl. best 3rd)' },
                { color:'rgba(229,62,62,.8)',    label:'Out (4th)' },
              ].map(({ color, label }) => (
                <div key={label} style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ width:6, height:6, borderRadius:'50%', background:color, display:'inline-block' }} />
                  <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:7.5, letterSpacing:'.08em', textTransform:'uppercase', color:'rgba(247,245,240,.45)' }}>{label}</span>
                </div>
              ))}
            </div>

            {loading ? (
              <div className="ko-group-grid">
                {[...Array(12)].map((_,i) => <div key={i} style={{ height:168, background:'rgba(247,245,240,.03)', borderRadius:2 }} />)}
              </div>
            ) : (
              <div className="ko-group-grid">
                {GROUPS.map((grp, gi) => (
                  <div key={grp} data-r data-d={String((gi % 3) + 1)}>
                    <GroupCard group={grp} teams={standings[grp] || []} statuses={statuses} />
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── R32 FIXTURES TAB ─────────────────────────────────────── */}
        {tab === 'fixtures' && (
          <section data-theme="dark" style={{ padding:'40px clamp(20px,3vw,56px)' }}>
            {/* Legend */}
            <div data-r style={{ marginBottom:28, display:'flex', alignItems:'center', gap:20, flexWrap:'wrap' }}>
              <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:7.5, letterSpacing:'.08em', textTransform:'uppercase', color:'rgba(247,245,240,.35)' }}>Legend</span>
              {[
                { color:ACCENT,                 label:'Both teams confirmed' },
                { color:'rgba(240,165,0,.9)',    label:'One team confirmed' },
                { color:'rgba(247,245,240,.22)', label:'TBC' },
              ].map(({ color, label }) => (
                <div key={label} style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ width:6, height:6, borderRadius:'50%', background:color, display:'inline-block' }} />
                  <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:7.5, letterSpacing:'.08em', textTransform:'uppercase', color:'rgba(247,245,240,.45)' }}>{label}</span>
                </div>
              ))}
            </div>

            {loading ? (
              <div className="ko-fixtures-grid">
                {[...Array(16)].map((_,i) => <div key={i} style={{ height:108, background:'rgba(247,245,240,.03)', borderRadius:2 }} />)}
              </div>
            ) : (
              <div className="ko-fixtures-grid">
                {FIXTURES.map((fx, i) => (
                  <div key={fx.id} data-r data-d={String((i % 3) + 1)}>
                    <FixtureCard fixture={fx} standings={standings} statuses={statuses} tm={tm} />
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

      </div>
    </>
  );
}
