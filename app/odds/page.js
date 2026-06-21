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
    if (window.matchMedia('(hover:none),(pointer:coarse)').matches) return;
    document.body.style.cursor = 'none';
    const cur  = document.getElementById('ea-cur');
    const dot  = document.getElementById('ea-dot');
    const ring = document.getElementById('ea-ring');
    if (!cur || !dot || !ring) return;
    cur.style.opacity = '0';
    let mx = -100, my = -100, rx = mx, ry = my, rafId;
    const onMove = e => {
      cur.style.opacity = '1';
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

/* ─── Page ────────────────────────────────────────────────────────────────── */
export default function IntelligencePage() {
  useCursor();

  const [data,       setData]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [oddsSort,   setOddsSort]   = useState('date');
  const [showAll,    setShowAll]    = useState(false);
  const [expandedIds,setExpandedIds]= useState(new Set());
  const [scrolled,   setScrolled]   = useState(false);
  const [imgReady,   setImgReady]   = useState(false);

  useEffect(() => { const t = setTimeout(() => setImgReady(true), 80); return () => clearTimeout(t); }, []);

  useEffect(() => {
    fetch('/api/wc2026')
      .then(r => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 400);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
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
  const bkMax       = matches.length ? Math.max(0, ...matches.map(m => m.bkCount||0)) : 0;

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
      <div id="ea-cur" style={{ position:'fixed', zIndex:9998, pointerEvents:'none', top:0, left:0, opacity:0, transition:'opacity .3s' }} aria-hidden="true">
        <div id="ea-ring" style={{ width:36, height:36, border:'1.5px solid rgba(247,245,240,.55)', borderRadius:'50%', position:'absolute', transform:'translate(-50%,-50%)', transition:'width .2s,height .2s,border-color .2s' }} />
        <div id="ea-dot"  style={{ width:6, height:6, background:'#F7F5F0', borderRadius:'50%', position:'absolute', transform:'translate(-50%,-50%)', transition:'transform .08s,background .2s' }} />
      </div>
      <style>{`
        body.lp-hovering #ea-ring{width:52px!important;height:52px!important;border-color:#C8FF00!important}
        body.lp-hovering #ea-dot{background:#C8FF00!important;transform:translate(-50%,-50%) scale(1.4)!important}
        @keyframes lp-blink{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes lp-barUp{from{transform:scaleY(0);opacity:0}to{transform:scaleY(1);opacity:1}}
        @media(max-width:768px){
          .ea-hero__inner{padding:88px 20px 40px!important}
          .ea-odds-section{padding-left:20px!important;padding-right:20px!important}
          .ea-odds-main{grid-template-columns:1fr!important}
          .ea-odds-sidebar{display:none!important}
          .ea-odds-controls{padding-left:20px!important;padding-right:20px!important;flex-direction:column!important;align-items:flex-start!important}
          .ea-match-row{grid-template-columns:60px 1fr 56px 44px!important;gap:8px!important}
          .ea-match-col-hide{display:none!important}
          .ea-match-best{display:none!important}
          .ea-bk-expand{padding-left:10px!important;padding-right:10px!important}
          .ea-bk-table{grid-template-columns:minmax(0,90px) 1fr 1fr 1fr!important;gap:4px!important}
          .ea-bk-hd{overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;min-width:0;text-align:center}
          .ea-bk-val{overflow:hidden!important;min-width:0!important}
          .ea-no-bk-grid{grid-template-columns:1fr!important;gap:8px!important}
        }
      `}</style>

      <div style={{ background:'#080808', minHeight:'100vh', color:'#F7F5F0', overflowX:'hidden' }}>

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <section data-theme="dark" className="ea-hero">
          <div style={{ position:'absolute', inset:0, background:`url('https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/2021-08-08_Vancouver_%2851622723053%29.jpg/1920px-2021-08-08_Vancouver_%2851622723053%29.jpg') center 50%/cover no-repeat`, filter:'contrast(1.1) brightness(.52)', transform:imgReady?'scale(1)':'scale(1.06)', transition:'transform 12s ease' }} aria-hidden="true"/>
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom,rgba(8,8,8,.06) 0%,transparent 30%,rgba(8,8,8,.85) 78%),linear-gradient(to right,rgba(8,8,8,.35),transparent 55%)' }} aria-hidden="true"/>
          <div style={{ position:'absolute', left:56, top:0, bottom:0, width:2, background:'linear-gradient(to bottom,transparent 10%,#F0A500 30%,#F0A500 70%,transparent 100%)', opacity:.65 }} aria-hidden="true"/>
          <div style={{ position:'absolute', bottom:28, right:40, textAlign:'right', pointerEvents:'none' }}>
            <div style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:9, letterSpacing:'.1em', textTransform:'uppercase', color:'rgba(247,245,240,.7)', marginBottom:3 }}>BC Place · World Cup 2026 · Vancouver, Canada</div>
            <div className="ea-photo-credit" style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, letterSpacing:'.06em', color:'rgba(247,245,240,.55)' }}>Photo: Darren Kirby / CC BY-SA 2.0</div>
          </div>

          <div className="ea-hero__inner">
            <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:20 }}>
              <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:7.5, letterSpacing:'.18em', textTransform:'uppercase', background:'#F0A500', color:'#080808', padding:'5px 12px', borderRadius:2, display:'flex', alignItems:'center', gap:7 }}>
                <span style={{ width:5, height:5, borderRadius:'50%', background:'#080808', animation:'lp-blink 1.8s ease infinite' }}/>
                WC 2026 · Live
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
              <span style={{ fontFamily:"var(--font-serif,'Cormorant Garamond',serif)", fontStyle:'italic', fontWeight:300, fontSize:'.38em', color:'rgba(247,245,240,.6)', display:'block', marginBottom:'.06em' }}>Odds &amp; Price Intelligence.</span>
              Beat the Game.
            </h1>

            <p style={{ fontFamily:"var(--font-serif,'Cormorant Garamond',serif)", fontStyle:'italic', fontWeight:300, fontSize:'clamp(18px,1.6vw,24px)', lineHeight:1.6, color:'rgba(247,245,240,.92)', maxWidth:580, margin:'20px 0 0' }}>
              Live odds tracked across 20+ bookmakers, cross-referenced against our Elo-rated model. When the market misprices a World Cup fixture, you'll see it here first.
            </p>

            {/* KPI strip */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', borderTop:'1px solid rgba(247,245,240,.1)', marginTop:32, paddingTop:24, gap:0 }}>
              {[
                { n: loading ? '—' : liveCount,    l: 'Live odds' },
                { n: loading ? '—' : valueCount,   l: 'Value edges >3%' },
                { n: loading ? '—' : (topEv ? (topEv.bestEv>0?'+':'')+topEv.bestEv.toFixed(1)+'%' : '—'), l: 'Best edge' },
                { n: loading ? '—' : (bkMax || '—'), l: 'Bookmakers tracked' },
              ].map((k, i) => (
                <div key={i} style={{ padding:'0 0 0 '+(i>0?'28px':'0'), borderLeft:i>0?'1px solid rgba(247,245,240,.1)':'none' }}>
                  <div style={{ fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)", fontSize:'clamp(32px,3.5vw,52px)', lineHeight:.9, color: i===2&&!loading&&topEv?.bestEv>3?'#C8FF00':'#F7F5F0', marginBottom:6 }}>{k.n}</div>
                  <div style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, letterSpacing:'.1em', textTransform:'uppercase', color:'rgba(247,245,240,.4)' }}>{k.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTROLS ──────────────────────────────────────────────────── */}
        <section data-theme="dark" className="ea-odds-controls" style={{ padding:'24px 56px', borderBottom:'1px solid rgba(247,245,240,.06)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>

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

          <div style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, color:'rgba(247,245,240,.35)', letterSpacing:'.06em' }}>
            {showAll ? `All ${matches.length} fixtures` : `Top 10 by ${oddsSort==='ev'?'EV':oddsSort==='group'?'group':'date'}`}
          </div>
        </section>

        {/* ── MAIN CONTENT ──────────────────────────────────────────────── */}
        <section data-theme="dark" className="ea-odds-section ea-odds-main" style={{ padding:'40px 56px 80px', display:'grid', gridTemplateColumns:'1fr 280px', gap:48, alignItems:'start' }}>

          {/* Match list */}
          <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
            {loading ? (
              [...Array(8)].map((_, i) => (
                <div key={i} style={{ height:60, background:'rgba(247,245,240,.03)', borderRadius:2, margin:'1px 0', animation:'lp-barUp .8s ease both', animationDelay:`${i*.06}s` }}/>
              ))
            ) : visibleMatches.map((m) => {
              const matchId   = m.id || (m.home + m.away);
              const isExp     = expandedIds.has(matchId);
              const isH       = m.bestEv === m.evH, isA = m.bestEv === m.evA;
              const bestMkt   = isH ? `${m.home} Win` : isA ? `${m.away} Win` : 'Draw';
              const bestOdds  = isH ? m.bestH : isA ? m.bestA : m.bestD;
              const bestProb  = isH ? m.prob_home : isA ? m.prob_away : m.prob_draw;
              const isCompleted = m.status === 'completed';
              const hasValue  = m.bestEv > 3 && !isCompleted;
              const isLive    = m.oddsSource === 'live';
              const hasBookmakers = m.allBookmakers?.length > 0;

              return (
                <div key={matchId} style={{
                  border:`1px solid ${hasValue ? ebr(m.bestEv) : 'rgba(247,245,240,.06)'}`,
                  borderLeft:`2px solid ${hasValue ? ec(m.bestEv) : 'rgba(247,245,240,.12)'}`,
                  background: hasValue && m.bestEv>=8 ? 'rgba(200,255,0,.04)' : 'rgba(247,245,240,.015)',
                  transition:'background .2s',
                }}>

                  {/* Summary row */}
                  <div
                    className="ea-match-row"
                    onClick={() => toggleExpand(matchId)}
                    style={{
                      display:'grid',
                      gridTemplateColumns:'88px 1fr auto 80px 80px 80px 96px 28px',
                      gap:20, padding:'16px 24px', alignItems:'center',
                      cursor:'none',
                    }}
                  >
                    {/* Date */}
                    <div>
                      <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:13, color:'rgba(247,245,240,.38)' }}>{fmtDate(m.date)}</span>
                      {isLive && !isCompleted && <span style={{ display:'block', fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:7, color:'#C8FF00', letterSpacing:'.1em', marginTop:2 }}>LIVE</span>}
                    </div>

                    {/* Match */}
                    <div>
                      <div style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:7.5, letterSpacing:'.1em', textTransform:'uppercase', color:'rgba(247,245,240,.3)', marginBottom:2 }}>
                        Grp {m.group}
                      </div>
                      <div style={{ fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)", fontSize:16, letterSpacing:'.04em', color:'#F7F5F0', lineHeight:1.1 }}>
                        {m.home} <span style={{ color:'rgba(247,245,240,.3)', fontSize:12 }}>vs</span> {m.away}
                      </div>
                    </div>

                    {/* Best market */}
                    <div className="ea-match-best" style={{ textAlign:'right' }}>
                      {isCompleted ? (
                        <>
                          <span style={{
                            fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:9, padding:'3px 10px', borderRadius:2,
                            background: m.model_correct ? 'rgba(200,255,0,.1)' : 'rgba(239,68,68,.1)',
                            border: `1px solid ${m.model_correct ? 'rgba(200,255,0,.3)' : 'rgba(239,68,68,.3)'}`,
                            color: m.model_correct ? '#C8FF00' : '#ef4444',
                            whiteSpace:'nowrap',
                          }}>{m.actual_score} · {m.model_correct ? '✓ Model correct' : '✗ Model wrong'}</span>
                          <div style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, color:'rgba(247,245,240,.3)', marginTop:3 }}>
                            Predicted: {m.prediction}
                          </div>
                        </>
                      ) : (
                        <>
                          <span style={{
                            fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:9, padding:'3px 10px', borderRadius:2, letterSpacing:'.06em',
                            background: hasValue ? ebg(m.bestEv) : 'rgba(247,245,240,.04)',
                            border:`1px solid ${hasValue ? ebr(m.bestEv) : 'rgba(247,245,240,.08)'}`,
                            color: hasValue ? ec(m.bestEv) : 'rgba(247,245,240,.5)',
                            whiteSpace:'nowrap',
                          }}>{bestMkt}</span>
                          <div style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, color:'rgba(247,245,240,.3)', marginTop:3 }}>
                            {bestProb}% model
                          </div>
                        </>
                      )}
                    </div>

                    {/* H / D / A odds */}
                    {[
                      { odds:m.bestH, ev_:m.evH, label:m.home.split(' ')[0] },
                      { odds:m.bestD, ev_:m.evD, label:'Draw' },
                      { odds:m.bestA, ev_:m.evA, label:m.away.split(' ')[0] },
                    ].map((c, ci) => (
                      <div key={ci} className="ea-match-col-hide" style={{ textAlign:'center' }}>
                        <div style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:7.5, color:'rgba(247,245,240,.28)', marginBottom:2 }}>{c.label}</div>
                        <span style={{ fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)", fontSize:22, color: c.ev_>3?'#C8FF00':'rgba(247,245,240,.75)' }}>
                          {c.odds?.toFixed(2) || '—'}
                        </span>
                        {c.ev_>3 && (
                          <div style={{ fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)", fontSize:14, color:'rgba(200,255,0,.65)', marginTop:1 }}>
                            +{c.ev_.toFixed(1)}%
                          </div>
                        )}
                      </div>
                    ))}

                    {/* EV badge */}
                    <div style={{ textAlign:'center' }}>
                      {!isCompleted && (
                        <span style={{
                          fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:hasValue?11:10, fontWeight:500,
                          color: ec(m.bestEv),
                          background: hasValue ? ebg(m.bestEv) : 'transparent',
                          border: hasValue ? `1px solid ${ebr(m.bestEv)}` : 'none',
                          padding: hasValue ? '2px 7px' : '0', borderRadius:2,
                        }}>
                          {m.bestEv > 0 ? '+' : ''}{m.bestEv.toFixed(1)}%
                        </span>
                      )}
                    </div>

                    {/* Expand toggle */}
                    <div style={{ textAlign:'center' }}>
                      <span style={{
                        display:'inline-flex', alignItems:'center', justifyContent:'center',
                        width:24, height:24,
                        border:`1px solid ${isExp?'rgba(200,255,0,.35)':'rgba(247,245,240,.2)'}`,
                        background: isExp?'rgba(200,255,0,.06)':'transparent',
                        borderRadius:2,
                        fontFamily:"var(--font-mono,'DM Mono',monospace)",
                        fontSize:16, color:isExp?'#C8FF00':'rgba(247,245,240,.6)',
                        userSelect:'none', lineHeight:1,
                      }}>
                        {isExp ? '−' : '+'}
                      </span>
                    </div>
                  </div>

                  {/* Expanded breakdown */}
                  {isExp && (
                    <div className="ea-bk-expand" style={{ borderTop:'1px solid rgba(247,245,240,.05)', padding:'12px 20px 16px' }}>
                      {hasBookmakers ? (<>
                        <div className="ea-bk-table" style={{ display:'grid', gridTemplateColumns:'140px 1fr 1fr 1fr', gap:8, marginBottom:8, fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:7.5, letterSpacing:'.12em', textTransform:'uppercase', color:'rgba(247,245,240,.25)' }}>
                          <span>Bookmaker</span>
                          <span className="ea-bk-hd" style={{textAlign:'center'}}>{m.home.split(' ')[0]}</span>
                          <span className="ea-bk-hd" style={{textAlign:'center'}}>Draw</span>
                          <span className="ea-bk-hd" style={{textAlign:'center'}}>{m.away.split(' ')[0]}</span>
                        </div>
                        {m.allBookmakers.map((bk, bi) => {
                          const maxH = Math.max(...m.allBookmakers.map(b => b.homeOdds || 0));
                          const maxD = Math.max(...m.allBookmakers.map(b => b.drawOdds || 0));
                          const maxA = Math.max(...m.allBookmakers.map(b => b.awayOdds || 0));
                          return (
                            <div key={bi} className="ea-bk-table" style={{ display:'grid', gridTemplateColumns:'140px 1fr 1fr 1fr', gap:8, padding:'6px 0', borderBottom:bi<m.allBookmakers.length-1?'1px solid rgba(247,245,240,.04)':'none', alignItems:'center' }}>
                              <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:9, color:bk.key==='pinnacle'?'#C8FF00':'rgba(247,245,240,.5)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                                {bk.key==='pinnacle'?'★ ':''}{bk.name}
                              </span>
                              {[
                                { v:bk.homeOdds, max:maxH, ev_:((m.prob_home/100)*(bk.homeOdds||0)-1)*100 },
                                { v:bk.drawOdds, max:maxD, ev_:((m.prob_draw/100)*(bk.drawOdds||0)-1)*100 },
                                { v:bk.awayOdds, max:maxA, ev_:((m.prob_away/100)*(bk.awayOdds||0)-1)*100 },
                              ].map((cell, ci) => (
                                <div key={ci} className="ea-bk-val" style={{ textAlign:'center' }}>
                                  <span style={{ fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)", fontSize:16, color:cell.v===cell.max&&cell.max?'#C8FF00':'rgba(247,245,240,.7)' }}>
                                    {cell.v?.toFixed(2) || '—'}
                                  </span>
                                  {cell.ev_ > 2 && (
                                    <div style={{ fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)", fontSize:13, color:'rgba(200,255,0,.65)', marginTop:1 }}>
                                      +{cell.ev_.toFixed(1)}%
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          );
                        })}
                        <div style={{ marginTop:10, fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, color:'rgba(247,245,240,.22)', letterSpacing:'.05em' }}>
                          ★ Pinnacle = sharp reference market · green = best available price · +% = value vs model
                        </div>
                      </>) : (
                        <div className="ea-no-bk-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16, marginBottom:8 }}>
                          {[
                            { label:m.home, prob:m.prob_home, odds:m.bestH, ev_:m.evH },
                            { label:'Draw',  prob:m.prob_draw, odds:m.bestD, ev_:m.evD },
                            { label:m.away, prob:m.prob_away, odds:m.bestA, ev_:m.evA },
                          ].map((c,ci) => (
                            <div key={ci} style={{ padding:'10px 14px', background:'rgba(247,245,240,.03)', borderRadius:2, border:'1px solid rgba(247,245,240,.06)', minWidth:0 }}>
                              <div style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, letterSpacing:'.1em', textTransform:'uppercase', color:'rgba(247,245,240,.3)', marginBottom:6, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.label}</div>
                              <div style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:18, fontWeight:500, color:'rgba(247,245,240,.8)', marginBottom:4 }}>{c.odds?.toFixed(2)||'—'}</div>
                              <div style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:9, color:'rgba(247,245,240,.35)' }}>Model: {c.prob}%</div>
                              {c.ev_>2 && <div style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:9, color:'#C8FF00', marginTop:3 }}>+{c.ev_.toFixed(1)}% value</div>}
                            </div>
                          ))}
                          <div style={{ gridColumn:'1/-1', fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, color:'rgba(247,245,240,.2)', letterSpacing:'.05em', marginTop:4 }}>
                            Live bookmaker breakdown available when odds feed is connected
                          </div>
                        </div>
                      )}
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
          <div className="ea-odds-sidebar" style={{ display:'flex', flexDirection:'column', gap:2, position:'sticky', top:120 }}>
            {[
              { l:'Live matches',   v: liveCount,   accent:true  },
              { l:'Value edges >3%',v: valueCount               },
              { l:'Total fixtures', v: matches.length            },
              { l:'Bookmakers',      v: bkMax || '—' },
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
              <div style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:7.5, letterSpacing:'.12em', textTransform:'uppercase', color:'rgba(247,245,240,.3)', marginBottom:10 }}>How to read</div>
              {[
                ['Decimal odds', 'e.g. 2.50 means £1 returns £2.50. Under 2.00 = favourite.'],
                ['Model %',      'Elo-rated win probability from 10,000 simulations'],
                ['Value % (EV)', 'Positive = model says odds are too generous. +5% = 5% edge.'],
                ['Green odds',   'Best available price across all tracked bookmakers'],
                ['★ Pinnacle',   'Sharp reference — tightest margins, most accurate lines'],
                ['+ expand',     'See all bookmaker prices for that fixture'],
              ].map(([k, v]) => (
                <div key={k} style={{ marginBottom:9 }}>
                  <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, color:'#C8FF00', display:'block', marginBottom:2 }}>{k}</span>
                  <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:7.5, color:'rgba(247,245,240,.45)', lineHeight:1.5 }}>{v}</span>
                </div>
              ))}
              <div style={{ marginTop:10, paddingTop:10, borderTop:'1px solid rgba(247,245,240,.06)', fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:7.5, color:'rgba(247,245,240,.3)', lineHeight:1.6 }}>
                Probabilities are Elo-based and reflect long-run averages — single match outcomes are always uncertain. Bet responsibly.
              </div>
            </div>

            <Link href="/fixtures" style={{ marginTop:4, padding:'14px 16px', fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:9, letterSpacing:'.1em', textTransform:'uppercase', color:'rgba(247,245,240,.5)', border:'1px solid rgba(247,245,240,.08)', textDecoration:'none', textAlign:'center', transition:'all .2s', borderRadius:2, display:'block' }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor='rgba(200,255,0,.3)'; e.currentTarget.style.color='#C8FF00'; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(247,245,240,.08)'; e.currentTarget.style.color='rgba(247,245,240,.5)'; }}>
              View all fixtures →
            </Link>
          </div>
        </section>
      </div>

      {scrolled && (
        <button onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}
          style={{position:'fixed',bottom:32,right:32,zIndex:999,fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.12em',textTransform:'uppercase',padding:'10px 16px',background:'rgba(8,8,8,.92)',border:'1px solid rgba(247,245,240,.15)',color:'rgba(247,245,240,.55)',cursor:'none',borderRadius:2,backdropFilter:'blur(8px)',transition:'all .2s'}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(240,165,0,.5)';e.currentTarget.style.color='#F0A500';}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(247,245,240,.15)';e.currentTarget.style.color='rgba(247,245,240,.55)';}}
          aria-label="Back to top">↑ Top</button>
      )}
    </>
  );
}