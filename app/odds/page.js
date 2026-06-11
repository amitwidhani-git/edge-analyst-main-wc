"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

/* ─── helpers ─────────────────────────────────────────────────────────────── */
function fmtDate(d) {
  if (!d) return '';
  return new Date(d + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

const ec  = e => e >= 8 ? '#C8FF00' : e >= 3 ? 'rgba(200,255,0,.85)' : 'rgba(247,245,240,.5)';
const ebg = e => e >= 8 ? 'rgba(200,255,0,.12)' : e >= 3 ? 'rgba(200,255,0,.06)' : 'transparent';
const ebr = e => e >= 8 ? 'rgba(200,255,0,.3)' : e >= 3 ? 'rgba(200,255,0,.15)' : 'rgba(247,245,240,.07)';

function useCursor() {
  useEffect(() => {
    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    if (isTouch) return;
    document.body.style.cursor = 'none';
    const cur  = document.getElementById('ea-cur');
    const dot  = document.getElementById('ea-dot');
    const ring = document.getElementById('ea-ring');
    if (!cur || !dot || !ring) return;
    let mx = window.innerWidth / 2, my = window.innerHeight / 2, rx = mx, ry = my, rafId;
    const onMove = e => {
      mx = e.clientX; my = e.clientY;
      let dark = true;
      for (const s of document.querySelectorAll('[data-theme]')) {
        const { top, bottom } = s.getBoundingClientRect();
        if (e.clientY >= top && e.clientY < bottom) { dark = s.dataset.theme === 'dark'; break; }
      }
      dot.style.background   = dark ? '#F7F5F0' : '#080808';
      ring.style.borderColor = dark ? 'rgba(247,245,240,.55)' : 'rgba(8,8,8,.55)';
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
      cancelAnimationFrame(rafId);
      document.removeEventListener('mousemove', onMove);
    };
  }, []);
}


/* ─── Odds Glossary ─────────────────────────────────────────────────────────── */
function OddsGlossary() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom:16, border:'1px solid rgba(247,245,240,.08)', borderRadius:3 }}>
      <button onClick={() => setOpen(v=>!v)}
        style={{ width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center',
          padding:'12px 16px', background:'rgba(247,245,240,.03)', border:'none', cursor:'none',
          fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:9, letterSpacing:'.1em',
          textTransform:'uppercase', color:'rgba(247,245,240,.6)' }}>
        <span>📖 How to read this page — odds, EV% and model explained</span>
        <span style={{ color:'#C8FF00', fontSize:14 }}>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div style={{ padding:'16px 20px', borderTop:'1px solid rgba(247,245,240,.06)',
          display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:12 }}>
          {[
            ['Decimal odds e.g. 2.50', 'For every £1 staked you get £2.50 back (£1.50 profit) if it wins. Lower odds = more likely to win per the bookmaker.'],
            ['Model probability e.g. 45%', 'What our Dixon-Coles statistical model thinks the true probability of this outcome is, based on Elo ratings and historical data.'],
            ['Implied probability', 'What probability the bookmaker odds imply: 1 ÷ odds. Odds of 2.50 imply 40% probability.'],
            ['EV% (Expected Value)', 'The edge: (Model prob × Odds) − 1. Positive = the bookmaker is paying more than the true probability warrants. +5% means for every £100 staked you expect £5 profit long-term.'],
            ['Green odds', 'Best available price across all bookmakers we track. Always take the highest odds.'],
            ['★ Pinnacle', 'The sharpest bookmaker in the world — lowest margin, most accurate prices. Used as our reference market.'],
            ['+ expand', 'Click any row to see every bookmaker price side by side. Green = best available for that market.'],
            ['Host nation boost', 'USA, Canada and Mexico receive a +100–150 Elo point boost for their home fixtures, reflecting crowd advantage and familiarity.'],
          ].map(([term, def]) => (
            <div key={term} style={{ padding:'10px 12px', background:'rgba(247,245,240,.02)', border:'1px solid rgba(247,245,240,.06)', borderRadius:2 }}>
              <div style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:9, color:'#C8FF00', marginBottom:5, fontWeight:500 }}>{term}</div>
              <div style={{ fontFamily:"var(--font-body,'Outfit',sans-serif)", fontSize:12, fontWeight:300, color:'rgba(247,245,240,.75)', lineHeight:1.6 }}>{def}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Odds Calculator ───────────────────────────────────────────────────────── */
function OddsCalculator() {
  const [odds,    setOdds]    = useState('');
  const [prob,    setProb]    = useState('');
  const [stake,   setStake]   = useState('10');
  const [mode,    setMode]    = useState('ev'); // 'ev' | 'payout' | 'implied'

  const oddsN  = parseFloat(odds)  || 0;
  const probN  = parseFloat(prob)  || 0;
  const stakeN = parseFloat(stake) || 0;

  const implied  = oddsN  ? ((1 / oddsN) * 100).toFixed(1) : '—';
  const payout   = oddsN && stakeN ? (oddsN * stakeN).toFixed(2) : '—';
  const profit   = oddsN && stakeN ? ((oddsN - 1) * stakeN).toFixed(2) : '—';
  const ev       = oddsN && probN  ? (((probN/100) * oddsN - 1) * 100).toFixed(1) : '—';
  const evClass  = parseFloat(ev) > 0 ? '#C8FF00' : parseFloat(ev) < 0 ? '#ef4444' : 'rgba(247,245,240,.6)';

  const inputStyle = {
    width:'100%', background:'rgba(247,245,240,.05)', border:'1px solid rgba(247,245,240,.12)',
    color:'#F7F5F0', borderRadius:2, padding:'8px 10px', fontSize:13,
    fontFamily:"var(--font-mono,'DM Mono',monospace)", outline:'none',
    transition:'border-color .15s',
  };

  return (
    <div style={{ border:'1px solid rgba(247,245,240,.1)', borderRadius:3, overflow:'hidden', marginTop:4 }}>
      <div style={{ padding:'12px 16px', background:'rgba(200,255,0,.05)', borderBottom:'1px solid rgba(247,245,240,.08)',
        fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:9, letterSpacing:'.1em', textTransform:'uppercase', color:'#C8FF00' }}>
        🧮 Odds Calculator
      </div>
      <div style={{ padding:'16px' }}>
        {/* Mode toggle */}
        <div style={{ display:'flex', gap:2, marginBottom:14, border:'1px solid rgba(247,245,240,.08)', borderRadius:2, overflow:'hidden' }}>
          {[['ev','EV Check'],['payout','Payout'],['implied','Implied %']].map(([m,l])=>(
            <button key={m} onClick={()=>setMode(m)}
              style={{ flex:1, padding:'7px', border:'none', cursor:'none',
                fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, letterSpacing:'.08em', textTransform:'uppercase',
                background:mode===m?'#C8FF00':'transparent', color:mode===m?'#080808':'rgba(247,245,240,.5)',
                transition:'all .15s' }}>{l}</button>
          ))}
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {/* Odds input */}
          <div>
            <label style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, letterSpacing:'.1em', textTransform:'uppercase', color:'rgba(247,245,240,.55)', display:'block', marginBottom:4 }}>
              Decimal odds
            </label>
            <input type="number" step="0.01" min="1" placeholder="e.g. 2.50"
              value={odds} onChange={e=>setOdds(e.target.value)}
              style={inputStyle}
              onFocus={e=>e.target.style.borderColor='rgba(200,255,0,.4)'}
              onBlur={e=>e.target.style.borderColor='rgba(247,245,240,.12)'}/>
          </div>

          {/* Prob input — only for EV mode */}
          {mode === 'ev' && (
            <div>
              <label style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, letterSpacing:'.1em', textTransform:'uppercase', color:'rgba(247,245,240,.55)', display:'block', marginBottom:4 }}>
                Your probability estimate (%)
              </label>
              <input type="number" step="1" min="0" max="100" placeholder="e.g. 45"
                value={prob} onChange={e=>setProb(e.target.value)}
                style={inputStyle}
                onFocus={e=>e.target.style.borderColor='rgba(200,255,0,.4)'}
                onBlur={e=>e.target.style.borderColor='rgba(247,245,240,.12)'}/>
            </div>
          )}

          {/* Stake input — for payout mode */}
          {mode === 'payout' && (
            <div>
              <label style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, letterSpacing:'.1em', textTransform:'uppercase', color:'rgba(247,245,240,.55)', display:'block', marginBottom:4 }}>
                Stake (£)
              </label>
              <input type="number" step="1" min="0" placeholder="e.g. 10"
                value={stake} onChange={e=>setStake(e.target.value)}
                style={inputStyle}
                onFocus={e=>e.target.style.borderColor='rgba(200,255,0,.4)'}
                onBlur={e=>e.target.style.borderColor='rgba(247,245,240,.12)'}/>
            </div>
          )}
        </div>

        {/* Results */}
        {oddsN > 1 && (
          <div style={{ marginTop:14, display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
            <div style={{ padding:'10px', background:'rgba(247,245,240,.03)', border:'1px solid rgba(247,245,240,.07)', borderRadius:2 }}>
              <div style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, color:'rgba(247,245,240,.5)', marginBottom:3 }}>Implied prob</div>
              <div style={{ fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)", fontSize:24, color:'#F7F5F0' }}>{implied}%</div>
            </div>
            {mode === 'ev' && probN > 0 && (
              <div style={{ padding:'10px', background: parseFloat(ev)>0?'rgba(200,255,0,.06)':'rgba(239,68,68,.06)', border:`1px solid ${parseFloat(ev)>0?'rgba(200,255,0,.2)':'rgba(239,68,68,.2)'}`, borderRadius:2 }}>
                <div style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, color:'rgba(247,245,240,.5)', marginBottom:3 }}>Expected value</div>
                <div style={{ fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)", fontSize:24, color:evClass }}>{parseFloat(ev)>0?'+':''}{ev}%</div>
              </div>
            )}
            {mode === 'payout' && stakeN > 0 && (
              <>
                <div style={{ padding:'10px', background:'rgba(247,245,240,.03)', border:'1px solid rgba(247,245,240,.07)', borderRadius:2 }}>
                  <div style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, color:'rgba(247,245,240,.5)', marginBottom:3 }}>Total return</div>
                  <div style={{ fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)", fontSize:24, color:'#F7F5F0' }}>£{payout}</div>
                </div>
                <div style={{ padding:'10px', background:'rgba(200,255,0,.04)', border:'1px solid rgba(200,255,0,.15)', borderRadius:2, gridColumn:'1/-1' }}>
                  <div style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, color:'rgba(247,245,240,.5)', marginBottom:3 }}>Profit</div>
                  <div style={{ fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)", fontSize:28, color:'#C8FF00' }}>£{profit}</div>
                </div>
              </>
            )}
            {mode === 'implied' && (
              <div style={{ padding:'10px', background:'rgba(74,127,212,.06)', border:'1px solid rgba(74,127,212,.2)', borderRadius:2 }}>
                <div style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, color:'rgba(247,245,240,.5)', marginBottom:3 }}>Book margin</div>
                <div style={{ fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)", fontSize:24, color:'#4A7FD4' }}>
                  {oddsN ? `${(100 - parseFloat(implied)).toFixed(1)}pp` : '—'}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mini explanation */}
        <div style={{ marginTop:10, fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, color:'rgba(247,245,240,.35)', lineHeight:1.6 }}>
          {mode==='ev' && 'Enter the odds and your probability estimate. Positive EV = value bet.'}
          {mode==='payout' && 'Enter the odds and your stake to see total return and profit.'}
          {mode==='implied' && 'Enter odds to see the bookmaker implied probability.'}
        </div>
      </div>
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────────── */
export default function IntelligencePage() {
  useCursor();

  const [data,       setData]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [oddsSort,   setOddsSort]   = useState('date');
  const [showAll,    setShowAll]    = useState(false);
  const [expandedIds,setExpandedIds]= useState(new Set());
  const [imgReady,   setImgReady]   = useState(false);

  useEffect(() => { const t = setTimeout(() => setImgReady(true), 80); return () => clearTimeout(t); }, []);

  useEffect(() => {
    fetch('/api/wc2026')
      .then(r => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function toggleExpand(id) {
    setExpandedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  /* ── derived ──────────────────────────────────────────────────────── */
  const matches     = data?.matches || [];
  const liveCount   = data?.liveCount || 0;
  const valueCount  = data?.valueCount || matches.filter(m => m.bestEv > 3).length;
  const topEv       = [...matches].sort((a, b) => b.bestEv - a.bestEv)[0];

  const sortedMatches = [...matches].sort((a, b) => {
    if (oddsSort === 'ev')    return b.bestEv - a.bestEv;
    if (oddsSort === 'group') return a.group.localeCompare(b.group) || a.date.localeCompare(b.date);
    return a.date.localeCompare(b.date);
  });

  const visibleMatches = showAll ? sortedMatches : sortedMatches.slice(0, 10);
  const allIds         = sortedMatches.map(m => m.id || (m.home + m.away));
  const allExpanded    = expandedIds.size >= allIds.length;

  return (
    <>
      {/* cursor */}
      <div id="ea-cur" style={{ position:'fixed', zIndex:9998, pointerEvents:'none', top:0, left:0 }} aria-hidden="true">
        <div id="ea-ring" style={{ width:36, height:36, border:'1.5px solid rgba(247,245,240,.55)', borderRadius:'50%', position:'absolute', transform:'translate(-50%,-50%)', transition:'width .2s,height .2s,border-color .2s' }} />
        <div id="ea-dot"  style={{ width:6, height:6, background:'#F7F5F0', borderRadius:'50%', position:'absolute', transform:'translate(-50%,-50%)', transition:'transform .08s,background .2s' }} />
      </div>
      <style>{`
        body.lp-hovering #ea-ring{width:52px!important;height:52px!important;border-color:#C8FF00!important}
        body.lp-hovering #ea-dot{background:#C8FF00!important;transform:translate(-50%,-50%) scale(1.4)!important}
        @keyframes lp-blink{0%,100%{opacity:1}50%{opacity:.3}}
        @media(min-width:900px){ .ea-odds-grid{grid-template-columns:minmax(0,1fr) 280px!important} }
        .ea-match-row-inner{display:grid;grid-template-columns:76px 1fr auto 64px 64px 64px 88px 24px;gap:10px;padding:14px 20px;align-items:center}
        @media(max-width:640px){
          .ea-match-row-inner{grid-template-columns:60px 1fr auto 52px 52px 52px 24px;gap:6px;padding:12px 14px;font-size:12px}
          .ea-hide-mobile{display:none!important}
        }
        .ea-tooltip{position:relative;cursor:none}
        .ea-tooltip:hover .ea-tip{display:block}
        .ea-tip{display:none;position:absolute;bottom:calc(100% + 6px);left:50%;transform:translateX(-50%);background:#1a2540;border:1px solid rgba(200,255,0,.2);color:#F7F5F0;font-size:10px;padding:6px 10px;border-radius:4px;white-space:nowrap;z-index:100;font-family:var(--font-mono,'DM Mono',monospace)}
      `}</style>

      <div style={{ background:'#080808', minHeight:'100vh', color:'#F7F5F0' }}>

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <section data-theme="dark" style={{ position:'relative', minHeight:'52vh', display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'0 56px', overflow:'hidden' }}>
          <div style={{ position:'absolute', inset:0, background:`url('https://images.unsplash.com/photo-1508098682722-e99c643e7f0b?w=1920&q=85&fit=crop') center 40%/cover`, filter:'grayscale(100%) brightness(.18)', transform:imgReady?'scale(1)':'scale(1.05)', transition:'transform 12s ease' }} aria-hidden="true"/>
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom,transparent 25%,rgba(8,8,8,.95) 80%)' }} aria-hidden="true"/>
          <div style={{ position:'absolute', left:56, top:0, bottom:0, width:2, background:'linear-gradient(to bottom,transparent 10%,#C8FF00 35%,#C8FF00 70%,transparent 100%)', opacity:.55 }} aria-hidden="true"/>

          <div style={{ position:'relative', zIndex:3, paddingBottom:52 }}>
            <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:20 }}>
              <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:7.5, letterSpacing:'.18em', textTransform:'uppercase', background:'#C8FF00', color:'#080808', padding:'5px 12px', borderRadius:2 }}>
                Price Intelligence
              </span>
              <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, letterSpacing:'.12em', textTransform:'uppercase', color:'rgba(247,245,240,.5)' }}>
                {loading ? '—' : liveCount} live · {loading ? '—' : matches.length} fixtures · {loading ? '—' : valueCount} value edges
              </span>
              {!loading && data?.oddsOk && (
                <span style={{ display:'flex', alignItems:'center', gap:6, fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, letterSpacing:'.1em', color:'#C8FF00', border:'1px solid rgba(200,255,0,.2)', padding:'3px 10px', borderRadius:2 }}>
                  <span style={{ width:5, height:5, borderRadius:'50%', background:'#C8FF00', animation:'lp-blink 2s ease infinite' }}/>
                  LIVE ODDS · {liveCount} matched
                </span>
              )}
            </div>

            <h1 style={{ fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)", fontSize:'clamp(72px,12vw,160px)', lineHeight:.84, margin:0 }}>
              <span style={{ fontFamily:"var(--font-serif,'Cormorant Garamond',serif)", fontStyle:'italic', fontWeight:300, fontSize:'.38em', color:'rgba(247,245,240,.6)', display:'block', marginBottom:'.06em' }}>Where the market</span>
              Is Wrong.
            </h1>

            {/* KPI strip */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', borderTop:'1px solid rgba(247,245,240,.1)', marginTop:32, paddingTop:24, gap:0 }}>
              {[
                { n: loading ? '—' : liveCount,    l: 'Live odds' },
                { n: loading ? '—' : valueCount,   l: 'Value edges >3%' },
                { n: loading ? '—' : (topEv ? (topEv.bestEv>0?'+':'')+topEv.bestEv.toFixed(1)+'%' : '—'), l: 'Best edge' },
                { n: loading ? '—' : (data?.requestsLeft || '—'), l: 'API requests left' },
              ].map((k, i) => (
                <div key={i} style={{ padding:'0 0 0 '+(i>0?'28px':'0'), borderLeft:i>0?'1px solid rgba(247,245,240,.1)':'none' }}>
                  <div style={{ fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)", fontSize:'clamp(32px,3.5vw,52px)', lineHeight:.9, color: i===2&&!loading&&topEv?.bestEv>3?'#C8FF00':'#F7F5F0', marginBottom:6 }}>{k.n}</div>
                  <div style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, letterSpacing:'.1em', textTransform:'uppercase', color:'rgba(247,245,240,.65)' }}>{k.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTROLS ──────────────────────────────────────────────────── */}
        <section data-theme="dark" style={{ padding:'24px 56px', borderBottom:'1px solid rgba(247,245,240,.06)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>

          {/* Offline warning */}
          {!loading && !data?.oddsOk && (
            <div style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8.5, letterSpacing:'.08em', color:'rgba(240,165,0,.8)', padding:'8px 16px', background:'rgba(240,165,0,.06)', border:'1px solid rgba(240,165,0,.18)', borderRadius:2 }}>
              ⚠ Live odds unavailable — add ODDS_API_KEY to .env.local
            </div>
          )}

          <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
            {/* Sort */}
            <div style={{ display:'flex', border:'1px solid rgba(247,245,240,.1)', borderRadius:2, overflow:'hidden' }}>
              {[['date','Date'],['ev','Best EV'],['group','Group']].map(([val, label]) => (
                <button key={val} onClick={() => setOddsSort(val)} style={{
                  fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, letterSpacing:'.1em', textTransform:'uppercase',
                  padding:'8px 16px', border:'none', cursor:'none',
                  background: oddsSort===val ? '#C8FF00' : 'rgba(247,245,240,.04)',
                  color:      oddsSort===val ? '#080808' : 'rgba(247,245,240,.5)',
                  borderRight: val!=='group' ? '1px solid rgba(247,245,240,.1)' : 'none',
                  transition:'all .15s',
                }}>{label}</button>
              ))}
            </div>

            {/* Expand / collapse all */}
            <button onClick={() => allExpanded ? setExpandedIds(new Set()) : setExpandedIds(new Set(allIds))}
              style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, letterSpacing:'.1em', textTransform:'uppercase', padding:'8px 16px', border:'1px solid rgba(247,245,240,.1)', borderRadius:2, background:'rgba(247,245,240,.04)', color:'rgba(247,245,240,.6)', cursor:'none', transition:'all .15s' }}>
              {allExpanded ? '− Collapse all' : '+ Expand all'}
            </button>

            {/* Show all toggle */}
            <button onClick={() => setShowAll(v => !v)} style={{
              fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, letterSpacing:'.1em', textTransform:'uppercase',
              padding:'8px 16px', borderRadius:2, cursor:'none',
              border: showAll ? '1px solid rgba(200,255,0,.4)' : '1px solid rgba(247,245,240,.1)',
              background: showAll ? 'rgba(200,255,0,.08)' : 'rgba(247,245,240,.04)',
              color: showAll ? '#C8FF00' : 'rgba(247,245,240,.6)',
              transition:'all .15s',
            }}>
              {showAll ? `Showing all ${matches.length}` : `Show all ${matches.length}`}
            </button>
          </div>

          <div style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, color:'rgba(247,245,240,.6)', letterSpacing:'.06em' }}>
            {showAll ? `All ${matches.length} fixtures` : `Top 10 by ${oddsSort==='ev'?'EV':oddsSort==='group'?'group':'date'}`}
          </div>
        </section>

        {/* ── MAIN CONTENT ──────────────────────────────────────────────── */}
        <section data-theme="dark" style={{ padding:'40px clamp(16px,4vw,56px) 80px', display:'grid', gridTemplateColumns:'minmax(0,1fr)', gap:32, alignItems:'start' }} className='ea-odds-grid'>

          {/* Odds glossary — collapsible */}
          <OddsGlossary />

          {/* Match list */}
          <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
            {loading ? (
              [...Array(8)].map((_, i) => (
                <div key={i} style={{ height:60, background:'rgba(247,245,240,.03)', borderRadius:2, margin:'1px 0' }}/>
              ))
            ) : visibleMatches.map((m) => {
              const matchId   = m.id || (m.home + m.away);
              const isExp     = expandedIds.has(matchId);
              const isH       = m.bestEv === m.evH, isA = m.bestEv === m.evA;
              const bestMkt   = isH ? `${m.home} Win` : isA ? `${m.away} Win` : 'Draw';
              const bestOdds  = isH ? m.bestH : isA ? m.bestA : m.bestD;
              const bestProb  = isH ? m.prob_home : isA ? m.prob_away : m.prob_draw;
              const hasValue  = m.bestEv > 3;
              const isLive    = m.oddsSource === 'live';
              const canExpand = m.allBookmakers?.length > 0;

              return (
                <div key={matchId} style={{
                  border:`1px solid ${hasValue ? ebr(m.bestEv) : 'rgba(247,245,240,.06)'}`,
                  borderLeft:`2px solid ${hasValue ? ec(m.bestEv) : 'rgba(247,245,240,.12)'}`,
                  background: hasValue && m.bestEv>=8 ? 'rgba(200,255,0,.04)' : 'rgba(247,245,240,.015)',
                  transition:'background .2s',
                }}>

                  {/* Summary row */}
                  <div
                    onClick={() => canExpand && toggleExpand(matchId)}
                    style={{
                      display:'grid',
                      gridTemplateColumns:'76px 1fr auto 64px 64px 64px 88px 24px',
                      gap:10, padding:'14px 20px', alignItems:'center',
                      cursor: canExpand ? 'none' : 'default',
                    }}
                  >
                    {/* Date */}
                    <div>
                      <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:9, color:'rgba(247,245,240,.38)' }}>{fmtDate(m.date)}</span>
                      {isLive && <span style={{ display:'block', fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:7, color:'#C8FF00', letterSpacing:'.1em', marginTop:2 }}>LIVE</span>}
                    </div>

                    {/* Match */}
                    <div>
                      <div style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:7.5, letterSpacing:'.1em', textTransform:'uppercase', color:'rgba(247,245,240,.55)', marginBottom:2 }}>
                        Grp {m.group}
                      </div>
                      <div style={{ fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)", fontSize:16, letterSpacing:'.04em', color:'#F7F5F0', lineHeight:1.1 }}>
                        {m.home} <span style={{ color:'rgba(247,245,240,.55)', fontSize:12 }}>vs</span> {m.away}
                      </div>
                    </div>

                    {/* Best market */}
                    <div style={{ textAlign:'right' }}>
                      <span style={{
                        fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:9, padding:'3px 10px', borderRadius:2, letterSpacing:'.06em',
                        background: hasValue ? ebg(m.bestEv) : 'rgba(247,245,240,.04)',
                        border:`1px solid ${hasValue ? ebr(m.bestEv) : 'rgba(247,245,240,.08)'}`,
                        color: hasValue ? ec(m.bestEv) : 'rgba(247,245,240,.5)',
                        whiteSpace:'nowrap',
                      }}>{bestMkt}</span>
                      <div style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, color:'rgba(247,245,240,.55)', marginTop:3 }}>
                        {bestProb}% model
                      </div>
                    </div>

                    {/* H / D / A odds */}
                    {[
                      { odds:m.bestH, ev_:m.evH, label:m.home.split(' ')[0] },
                      { odds:m.bestD, ev_:m.evD, label:'Draw' },
                      { odds:m.bestA, ev_:m.evA, label:m.away.split(' ')[0] },
                    ].map((c, ci) => (
                      <div key={ci} style={{ textAlign:'center' }}>
                        <div style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:7.5, color:'rgba(247,245,240,.28)', marginBottom:2 }}>{c.label}</div>
                        <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:13, fontWeight:500, color: c.ev_>3?'#C8FF00':'rgba(247,245,240,.75)' }}>
                          {c.odds?.toFixed(2) || '—'}
                        </span>
                        {c.ev_>3 && (
                          <div style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:7.5, color:'rgba(200,255,0,.65)', marginTop:1 }}>
                            +{c.ev_.toFixed(1)}%
                          </div>
                        )}
                      </div>
                    ))}

                    {/* EV badge */}
                    <div style={{ textAlign:'center' }}>
                      <span style={{
                        fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:hasValue?11:10, fontWeight:500,
                        color: ec(m.bestEv),
                        background: hasValue ? ebg(m.bestEv) : 'transparent',
                        border: hasValue ? `1px solid ${ebr(m.bestEv)}` : 'none',
                        padding: hasValue ? '2px 7px' : '0', borderRadius:2,
                      }}>
                        {m.bestEv > 0 ? '+' : ''}{m.bestEv.toFixed(1)}%
                      </span>
                    </div>

                    {/* Expand toggle */}
                    <div style={{ textAlign:'center' }}>
                      {canExpand && (
                        <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:16, color:isExp?'#C8FF00':'rgba(247,245,240,.3)', userSelect:'none', lineHeight:1 }}>
                          {isExp ? '−' : '+'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expanded bookmaker breakdown */}
                  {isExp && canExpand && (
                    <div style={{ borderTop:'1px solid rgba(247,245,240,.05)', padding:'12px 20px 16px' }}>
                      <div style={{ display:'grid', gridTemplateColumns:'140px 1fr 1fr 1fr', gap:8, marginBottom:8, fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:7.5, letterSpacing:'.12em', textTransform:'uppercase', color:'rgba(247,245,240,.25)' }}>
                        <span>Bookmaker</span>
                        <span style={{textAlign:'center'}}>{m.home.split(' ')[0]}</span>
                        <span style={{textAlign:'center'}}>Draw</span>
                        <span style={{textAlign:'center'}}>{m.away.split(' ')[0]}</span>
                      </div>
                      {m.allBookmakers.map((bk, bi) => {
                        const maxH = Math.max(...m.allBookmakers.map(b => b.homeOdds || 0));
                        const maxD = Math.max(...m.allBookmakers.map(b => b.drawOdds || 0));
                        const maxA = Math.max(...m.allBookmakers.map(b => b.awayOdds || 0));
                        return (
                          <div key={bi} style={{ display:'grid', gridTemplateColumns:'140px 1fr 1fr 1fr', gap:8, padding:'6px 0', borderBottom:bi<m.allBookmakers.length-1?'1px solid rgba(247,245,240,.04)':'none', alignItems:'center' }}>
                            <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:9, color:bk.key==='pinnacle'?'#C8FF00':'rgba(247,245,240,.5)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                              {bk.key==='pinnacle'?'★ ':''}{bk.name}
                            </span>
                            {[
                              { v:bk.homeOdds, max:maxH, ev_:((m.prob_home/100)*(bk.homeOdds||0)-1)*100 },
                              { v:bk.drawOdds, max:maxD, ev_:((m.prob_draw/100)*(bk.drawOdds||0)-1)*100 },
                              { v:bk.awayOdds, max:maxA, ev_:((m.prob_away/100)*(bk.awayOdds||0)-1)*100 },
                            ].map((cell, ci) => (
                              <div key={ci} style={{ textAlign:'center' }}>
                                <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:12, fontWeight:500, color:cell.v===cell.max&&cell.max?'#C8FF00':'rgba(247,245,240,.7)' }}>
                                  {cell.v?.toFixed(2) || '—'}
                                </span>
                                {cell.ev_ > 2 && (
                                  <div style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:7, color:'rgba(200,255,0,.65)', marginTop:1 }}>
                                    +{cell.ev_.toFixed(1)}%
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        );
                      })}
                      <div style={{ marginTop:10, fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, color:'rgba(247,245,240,.22)', letterSpacing:'.05em' }}>
                        ★ Pinnacle = sharp reference market · green = best available price · +% = EV edge vs model
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Show all / show less */}
            {!loading && matches.length > 10 && (
              <button onClick={() => setShowAll(v => !v)}
                style={{ marginTop:10, width:'100%', padding:'14px', fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:9, letterSpacing:'.12em', textTransform:'uppercase', background:'rgba(247,245,240,.03)', border:'1px solid rgba(247,245,240,.08)', color:'rgba(247,245,240,.5)', cursor:'none', transition:'all .2s', borderRadius:2 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(200,255,0,.3)'; e.currentTarget.style.color='#C8FF00'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(247,245,240,.08)'; e.currentTarget.style.color='rgba(247,245,240,.5)'; }}>
                {showAll ? `↑ Show top 10` : `↓ Show all ${matches.length} fixtures — ${matches.length-10} more`}
              </button>
            )}

            {!loading && matches.length === 0 && (
              <p style={{ fontFamily:"var(--font-body,'Outfit',sans-serif)", fontWeight:200, fontSize:14, color:'rgba(247,245,240,.5)', padding:'32px 0' }}>
                No fixtures loaded — run <code style={{color:'#C8FF00'}}>python predictor/predict.py</code> to generate data.
              </p>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div style={{ display:'flex', flexDirection:'column', gap:2, position:'sticky', top:120 }}>
            {[
              { l:'Live matches',   v: liveCount,   accent:true  },
              { l:'Value edges >3%',v: valueCount               },
              { l:'Total fixtures', v: matches.length            },
              { l:'Requests left',  v: data?.requestsLeft || '—' },
            ].map((s, i) => (
              <div key={i} style={{ padding:'20px', border:'1px solid rgba(247,245,240,.07)', background:'rgba(247,245,240,.02)' }}>
                <div style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, letterSpacing:'.12em', textTransform:'uppercase', color:'rgba(247,245,240,.38)', marginBottom:6 }}>{s.l}</div>
                <div style={{ fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)", fontSize:40, lineHeight:.9, color:s.accent?'#C8FF00':'#F7F5F0' }}>
                  {loading ? '—' : s.v}
                </div>
              </div>
            ))}

            {/* Legend */}
            <div style={{ padding:'16px 20px', border:'1px solid rgba(247,245,240,.07)', background:'rgba(247,245,240,.02)', marginTop:4 }}>
              <div style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:7.5, letterSpacing:'.12em', textTransform:'uppercase', color:'rgba(247,245,240,.55)', marginBottom:10 }}>How to read</div>
              {[
                ['Green odds', 'Best available price'],
                ['+EV%',       'Model prob × odds − 1'],
                ['★ Pinnacle', 'Sharp reference market'],
                ['+ expand',   'All bookmaker prices'],
              ].map(([k, v]) => (
                <div key={k} style={{ display:'flex', justifyContent:'space-between', marginBottom:7 }}>
                  <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, color:'#C8FF00' }}>{k}</span>
                  <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, color:'rgba(247,245,240,.6)', textAlign:'right', maxWidth:'56%' }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Odds calculator */}
            <OddsCalculator />

            <Link href="/wc2026" style={{ marginTop:4, padding:'14px 16px', fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:9, letterSpacing:'.1em', textTransform:'uppercase', color:'rgba(247,245,240,.5)', border:'1px solid rgba(247,245,240,.08)', textDecoration:'none', textAlign:'center', transition:'all .2s', borderRadius:2, display:'block' }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor='rgba(200,255,0,.3)'; e.currentTarget.style.color='#C8FF00'; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(247,245,240,.08)'; e.currentTarget.style.color='rgba(247,245,240,.5)'; }}>
              Tournament simulator →
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
