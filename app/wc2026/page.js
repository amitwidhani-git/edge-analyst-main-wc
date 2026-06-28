"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ─── helpers ──────────────────────────────────────────────────────────────── */
const ec  = e => e >= 8 ? '#C8FF00' : e >= 3 ? 'rgba(200,255,0,.8)' : 'rgba(247,245,240,.55)';
const ebg = e => e >= 8 ? 'rgba(200,255,0,.12)' : e >= 3 ? 'rgba(200,255,0,.06)' : 'transparent';
const ebr = e => e >= 8 ? 'rgba(200,255,0,.28)' : e >= 3 ? 'rgba(200,255,0,.14)' : 'rgba(247,245,240,.07)';

const CONF_COLOR = { UEFA:'#4A7FD4', CONMEBOL:'#C8FF00', CONCACAF:'#F0A500', CAF:'#E53E3E', AFC:'#9B59B6', OFC:'#8A9AAC' };

function fmtDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

/* ─── Cursor (identical pattern to existing pages) ─────────────────────────── */
function useCursor() {
  useEffect(() => {
    document.body.style.cursor = 'none';
    const cur  = document.getElementById('ea-cur');
    const dot  = document.getElementById('ea-dot');
    const ring = document.getElementById('ea-ring');
    if (!cur || !dot || !ring) return;
    let mx = window.innerWidth / 2, my = window.innerHeight / 2, rx = mx, ry = my, rafId;
    const onMove = e => {
      mx = e.clientX; my = e.clientY;
      let isDark = true;
      for (const sec of document.querySelectorAll('[data-theme]')) {
        const { top, bottom } = sec.getBoundingClientRect();
        if (e.clientY >= top && e.clientY < bottom) { isDark = sec.dataset.theme === 'dark'; break; }
      }
      dot.style.background   = isDark ? '#F7F5F0' : '#080808';
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

/* ─── Tabs ──────────────────────────────────────────────────────────────────── */
const TABS = ['Fixtures', 'Odds Intel', 'Rankings', 'Simulator'];

/* ─── Main page ─────────────────────────────────────────────────────────────── */
export default function WC2026Page() {
  useCursor();

  const [data,       setData]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [tab,        setTab]        = useState('Fixtures');
  const [grpFilter,  setGrpFilter]  = useState('ALL');
  const [oddsSort,   setOddsSort]   = useState('date');   // 'date' | 'ev' | 'group'
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [showAll,    setShowAll]    = useState(false);    // false = top 10 by EV, true = all
  const [simResult,  setSimResult]  = useState(null);
  const [simRunning, setSimRunning] = useState(false);
  const [imgReady,   setImgReady]   = useState(false);

  useEffect(() => { const t = setTimeout(() => setImgReady(true), 80); return () => clearTimeout(t); }, []);

  /* scroll reveal — re-run after data loads and tab switches */
  useEffect(() => {
    // Small delay so React has painted the new elements
    const timer = setTimeout(() => {
      const els = document.querySelectorAll('[data-r]:not(.lp-on)');
      if (!els.length) return;
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('lp-on'); io.unobserve(e.target); } });
      }, { threshold: 0.04, rootMargin: '0px 0px -20px 0px' });
      els.forEach(el => io.observe(el));
      return () => io.disconnect();
    }, 80);
    return () => clearTimeout(timer);
  }, [data, tab, loading]);

  useEffect(() => {
    fetch('/api/wc2026', { cache: 'no-store' }).then(r => r.json()).then(d => setData(d)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  /* ── odds intel helpers ──────────────────────────────────────────── */
  function toggleExpand(id) {
    setExpandedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }
  function collapseAll() { setExpandedIds(new Set()); }
  function expandAll(ids) { setExpandedIds(new Set(ids)); }

  /* ── derived data ─────────────────────────────────────────────────── */
  const matches    = data?.matches || [];
  const teamStats  = data?.teamStats || [];
  const simulation = data?.simulation?.results || [];
  const valueMatches = matches.filter(m => m.bestEv > 3);
  const topEv      = [...matches].sort((a,b) => b.bestEv - a.bestEv)[0];
  const groups     = [...new Set(matches.map(m => m.group))].sort();
  const filtered   = grpFilter === 'ALL' ? matches : matches.filter(m => m.group === grpFilter);

  /* ── tournament simulator ─────────────────────────────────────────── */
  function runSim() {
    if (!teamStats.length) return;
    setSimRunning(true);
    setTimeout(() => {
      const GROUPS = {
        A:["Mexico","South Korea","South Africa","Czechia"],
        B:["Canada","Switzerland","Bosnia-Herzegovina","Qatar"],
        C:["Brazil","Morocco","Scotland","Haiti"],
        D:["USA","Australia","Turkey","Paraguay"],
        E:["Germany","Ecuador","Côte d'Ivoire","Curaçao"],
        F:["Netherlands","Japan","Sweden","Tunisia"],
        G:["Belgium","Iran","Egypt","New Zealand"],
        H:["Spain","Uruguay","Saudi Arabia","Cabo Verde"],
        I:["France","Senegal","Norway","Iraq"],
        J:["Argentina","Austria","Algeria","Jordan"],
        K:["Portugal","Colombia","Uzbekistan","Congo DR"],
        L:["England","Croatia","Ghana","Panama"],
      };
      const tm = Object.fromEntries(teamStats.map(t => [t.team, t]));
      const poisson = lam => { const L=Math.exp(-lam);let p=1,k=0;do{k++;p*=Math.random();}while(p>L);return Math.max(0,k-1); };
      const eloP = (ra,rb) => 1/(1+Math.pow(10,(rb-ra)/400));
      const ko = (a,b) => {
        const ta=tm[a]||{elo:1500,avg_gf:1.2},tb=tm[b]||{elo:1500,avg_gf:1.2};
        const p=eloP(ta.elo||1500,tb.elo||1500);
        const gA=poisson((ta.avg_gf||1.2)*(0.45+p)),gB=poisson((tb.avg_gf||1.2)*(0.45+(1-p)));
        if(gA!==gB) return gA>gB?a:b;
        return Math.random()<p?a:b;
      };
      const simGroup = ts => {
        const pts={},gd={};ts.forEach(t=>{pts[t]=0;gd[t]=0;});
        for(let i=0;i<ts.length;i++) for(let j=i+1;j<ts.length;j++){
          const ta=tm[ts[i]]||{elo:1500,avg_gf:1.2},tb=tm[ts[j]]||{elo:1500,avg_gf:1.2};
          const p=eloP(ta.elo||1500,tb.elo||1500);
          const gA=poisson((ta.avg_gf||1.2)*(0.45+p)),gB=poisson((tb.avg_gf||1.2)*(0.45+(1-p)));
          if(gA>gB)pts[ts[i]]+=3;else if(gB>gA)pts[ts[j]]+=3;else{pts[ts[i]]+=1;pts[ts[j]]+=1;}
          gd[ts[i]]+=gA-gB;gd[ts[j]]+=gB-gA;
        }
        return ts.slice().sort((a,b)=>(pts[b]-pts[a])||(gd[b]-gd[a]));
      };
      const counts={};teamStats.forEach(t=>counts[t.team]=0);
      for(let r=0;r<1000;r++){
        const adv=[],thirds=[];
        for(const ts of Object.values(GROUPS)){
          const rk=simGroup(ts);adv.push(rk[0],rk[1]);thirds.push({t:rk[2],elo:(tm[rk[2]]?.elo||1500)});
        }
        thirds.sort((a,b)=>b.elo-a.elo);thirds.slice(0,8).forEach(x=>adv.push(x.t));
        for(let i=adv.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[adv[i],adv[j]]=[adv[j],adv[i]];}
        let round=[...adv.slice(0,32)];
        while(round.length>1){const nxt=[];for(let i=0;i<round.length;i+=2)nxt.push(ko(round[i],round[i+1]||round[i]));round=nxt;}
        if(counts[round[0]]!==undefined) counts[round[0]]++;
      }
      const sorted=Object.entries(counts).sort((a,b)=>b[1]-a[1]).filter(([,c])=>c>0);
      setSimResult(sorted.slice(0,8).map(([t,c])=>({team:t,pct:Math.round(c/10)})));
      setSimRunning(false);
    }, 80);
  }

  /* ── render ───────────────────────────────────────────────────────── */
  return (
    <>
      {/* Cursor elements */}
      <div id="ea-cur" style={{ position:'fixed', zIndex:9998, pointerEvents:'none', top:0, left:0 }} aria-hidden="true">
        <div id="ea-ring" style={{ width:36, height:36, border:'1.5px solid rgba(247,245,240,.55)', borderRadius:'50%', position:'absolute', transform:'translate(-50%,-50%)', transition:'width .2s,height .2s,border-color .2s' }} />
        <div id="ea-dot"  style={{ width:6, height:6, background:'#F7F5F0', borderRadius:'50%', position:'absolute', transform:'translate(-50%,-50%)', transition:'transform .08s,background .2s' }} />
      </div>

      <style>{`
        body.lp-hovering #ea-ring { width:52px!important;height:52px!important;border-color:#C8FF00!important; }
        body.lp-hovering #ea-dot  { background:#C8FF00!important;transform:translate(-50%,-50%) scale(1.4)!important; }
        [data-r] { opacity:0; transform:translateY(32px); transition:opacity .9s cubic-bezier(.22,1,.36,1), transform .9s cubic-bezier(.22,1,.36,1); }
        [data-r].lp-on { opacity:1; transform:none; }
        [data-r][data-d="1"] { transition-delay:.1s; }
        [data-r][data-d="2"] { transition-delay:.2s; }
        [data-r][data-d="3"] { transition-delay:.3s; }
        .wc-tab { font-family:var(--font-mono,'DM Mono',monospace); font-size:9px; letter-spacing:.12em; text-transform:uppercase; background:none; border:none; cursor:none; padding:12px 20px; color:rgba(247,245,240,.45); transition:color .2s; position:relative; }
        .wc-tab::after { content:''; position:absolute; bottom:0; left:20px; right:20px; height:1px; background:#C8FF00; transform:scaleX(0); transform-origin:left; transition:transform .25s ease; }
        .wc-tab.active { color:#C8FF00; }
        .wc-tab.active::after, .wc-tab:hover::after { transform:scaleX(1); }
        .wc-tab:hover { color:rgba(247,245,240,.85); }
        .wc-grp-pill { font-family:var(--font-mono,'DM Mono',monospace); font-size:8px; letter-spacing:.1em; padding:5px 12px; border-radius:2px; cursor:none; border:1px solid rgba(247,245,240,.08); color:rgba(247,245,240,.45); background:none; transition:all .18s; }
        .wc-grp-pill.active { border-color:#C8FF00; color:#C8FF00; background:rgba(200,255,0,.06); }
        .wc-grp-pill:hover:not(.active) { border-color:rgba(247,245,240,.18); color:rgba(247,245,240,.75); }
        .wc-match-row { border-bottom:1px solid rgba(247,245,240,.05); transition:background .18s; cursor:none; }
        .wc-match-row:hover { background:rgba(200,255,0,.025); }
        .wc-match-row.has-value { border-left:2px solid #C8FF00; }
        .wc-odds-cell { font-family:var(--font-mono,'DM Mono',monospace); font-size:12px; font-weight:500; padding:4px 8px; border-radius:2px; border:1px solid rgba(247,245,240,.07); background:rgba(247,245,240,.03); cursor:none; transition:all .15s; min-width:52px; text-align:center; }
        .wc-odds-cell.best { border-color:rgba(200,255,0,.35); background:rgba(200,255,0,.08); color:#C8FF00; }
        .wc-odds-cell.value { border-color:#C8FF00; background:rgba(200,255,0,.15); color:#C8FF00; box-shadow:0 0 10px rgba(200,255,0,.12); }
        .wc-bk-row { display:grid; grid-template-columns:140px 1fr 1fr 1fr; gap:8px; align-items:center; padding:7px 0; border-bottom:1px solid rgba(247,245,240,.04); }
        .wc-bk-row:last-child { border-bottom:none; }
        .ea-page { background:#080808; }
      `}</style>

      <div className="ea-page" style={{ minHeight:'100vh', color:'#F7F5F0' }}>

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <section data-theme="dark" className="ea-hero">
          {/* Background image */}
          <div style={{
            position:'absolute', inset:0,
            background:`url('https://images.unsplash.com/photo-1593766788306-28561086694e?w=1920&q=85&fit=crop') center 35%/cover no-repeat`,
            filter:'grayscale(100%) contrast(1.2) brightness(.22)',
            transform: imgReady ? 'scale(1)' : 'scale(1.06)',
            transition:'transform 12s ease',
          }} aria-hidden="true" />
          <div style={{
            position:'absolute', inset:0,
            background:'linear-gradient(to bottom, rgba(8,8,8,.1) 0%, transparent 30%, rgba(8,8,8,.95) 80%), linear-gradient(to right, rgba(8,8,8,.5), transparent 55%)',
          }} aria-hidden="true" />
          <div style={{ position:'absolute', left:56, top:0, bottom:0, width:2, background:'linear-gradient(to bottom, transparent 10%, #C8FF00 35%, #C8FF00 70%, transparent 100%)', opacity:.6 }} aria-hidden="true" />

          <div className="ea-hero__inner">
            <div data-r style={{ display:'flex', alignItems:'center', gap:16, marginBottom:28 }}>
              <span style={{
                fontFamily:"var(--font-mono,'DM Mono',monospace)",
                fontSize:7.5, letterSpacing:'.18em', textTransform:'uppercase',
                background:'#C8FF00', color:'#080808', padding:'5px 12px', borderRadius:2,
                display:'flex', alignItems:'center', gap:7,
              }}>
                <span style={{ width:5, height:5, borderRadius:'50%', background:'#080808', animation:'lp-blink 1.8s ease infinite' }} />
                WC 2026
              </span>
              <span style={{
                fontFamily:"var(--font-mono,'DM Mono',monospace)",
                fontSize:8, letterSpacing:'.12em', textTransform:'uppercase',
                color:'rgba(247,245,240,.6)',
              }}>Elo · StatsBomb data · 10k simulations</span>
            </div>

            <h1 data-r data-d="1" style={{
              fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",
              fontSize:'clamp(80px,14vw,180px)',
              lineHeight:.84, letterSpacing:'.008em',
            }}>
              <span style={{
                fontFamily:"var(--font-serif,'Cormorant Garamond',serif)",
                fontStyle:'italic', fontWeight:300, fontSize:'.36em',
                color:'rgba(247,245,240,.6)', display:'block', lineHeight:1.2, marginBottom:'.06em',
              }}>The World Cup</span>
              <span style={{ color:'#C8FF00', display:'block' }}>Predicted.</span>
            </h1>

            {/* KPI strip */}
            <div data-r data-d="2" style={{
              display:'grid', gridTemplateColumns:'repeat(4,1fr)',
              borderTop:'1px solid rgba(247,245,240,.1)', marginTop:40,
            }}>
              {[
                { n: matches.length || '72', l:'Fixtures modelled' },
                { n: valueMatches.length || '—', l:'Value opportunities' },
                { n: simulation[0]?.team || 'Spain', l:'Tournament favourite' },
                { n: simulation[0] ? `${simulation[0].win_pct}%` : '—', l:'Win probability' },
              ].map((k, i) => (
                <div key={i} style={{
                  padding: i === 0 ? '24px 40px 40px 0' : '24px 0 40px 40px',
                  borderRight: i < 3 ? '1px solid rgba(247,245,240,.1)' : 'none',
                }}>
                  <div style={{
                    fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",
                    fontSize:'clamp(40px,5vw,72px)', lineHeight:.9, color:'#F7F5F0', marginBottom:10,
                  }}>{loading ? '—' : k.n}</div>
                  <div style={{
                    fontFamily:"var(--font-mono,'DM Mono',monospace)",
                    fontSize:8, letterSpacing:'.1em', textTransform:'uppercase', color:'rgba(247,245,240,.5)',
                  }}>{k.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TABS ──────────────────────────────────────────────────────── */}
        <div data-theme="dark" style={{
          position:'sticky', top:78, zIndex:100,
          background:'rgba(8,8,8,.9)', backdropFilter:'blur(20px)',
          borderBottom:'1px solid rgba(247,245,240,.06)',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'0 clamp(20px,3vw,56px)',
        }}>
          <div style={{ display:'flex' }}>
            {TABS.map(t => (
              <button key={t} className={`wc-tab${tab===t?' active':''}`} onClick={() => setTab(t)}>{t}</button>
            ))}
          </div>
          {data?.oddsOk && data?.liveCount > 0 && (
            <div style={{ display:'flex', alignItems:'center', gap:6, fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, letterSpacing:'.1em', color:'#C8FF00' }}>
              <span style={{ width:5, height:5, borderRadius:'50%', background:'#C8FF00', animation:'lp-blink 2s ease infinite' }} />
              LIVE ODDS · {data.liveCount} matched
            </div>
          )}
        </div>

        {/* ── FIXTURES TAB ──────────────────────────────────────────────── */}
        {tab === 'Fixtures' && (
          <section data-theme="dark" style={{ padding:'48px 56px' }}>

            {/* Group filter */}
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:32, flexWrap:'wrap' }}>
              <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, letterSpacing:'.12em', textTransform:'uppercase', color:'rgba(247,245,240,.4)', marginRight:4 }}>Group</span>
              <button className={`wc-grp-pill${grpFilter==='ALL'?' active':''}`} onClick={() => setGrpFilter('ALL')}>All</button>
              {groups.map(g => (
                <button key={g} className={`wc-grp-pill${grpFilter===g?' active':''}`} onClick={() => setGrpFilter(g)}>{g}</button>
              ))}
            </div>

            {/* Table header */}
            <div style={{
              display:'grid', gridTemplateColumns:'90px 1fr 1fr 1fr 80px 80px 80px 90px 80px',
              gap:8, padding:'8px 16px',
              fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, letterSpacing:'.1em', textTransform:'uppercase', color:'rgba(247,245,240,.3)',
              borderBottom:'1px solid rgba(247,245,240,.08)',
            }}>
              <span>Date</span><span>Home</span><span>Away</span><span>Venue</span>
              <span style={{textAlign:'center'}}>Home</span><span style={{textAlign:'center'}}>Draw</span><span style={{textAlign:'center'}}>Away</span>
              <span style={{textAlign:'center'}}>Model</span><span style={{textAlign:'center'}}>EV Edge</span>
            </div>

            {loading ? (
              [...Array(8)].map((_,i) => (
                <div key={i} style={{ height:52, margin:'2px 0', background:'rgba(247,245,240,.03)', borderRadius:2, animation:'lp-barUp .9s ease both', animationDelay:`${i*.05}s` }} />
              ))
            ) : filtered.map((m, i) => {
              const bestEv = Math.max(m.evH, m.evD, m.evA);
              const isH=bestEv===m.evH,isA=bestEv===m.evA;
              const hasValue = bestEv > 3;

              return (
                <div key={m.id || i} className={`wc-match-row${hasValue?' has-value':''}`}
                  style={{ display:'grid', gridTemplateColumns:'90px 1fr 1fr 1fr 80px 80px 80px 90px 80px', gap:8, padding:'14px 16px', alignItems:'center' }}>

                  <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:9, color:'rgba(247,245,240,.4)' }}>{fmtDate(m.date)}</span>

                  <span style={{ fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)", fontSize:15, letterSpacing:'.04em', color: m.prediction===m.home?'#F7F5F0':'rgba(247,245,240,.55)' }}>
                    {m.home}
                  </span>
                  <span style={{ fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)", fontSize:15, letterSpacing:'.04em', color: m.prediction===m.away?'#F7F5F0':'rgba(247,245,240,.55)' }}>
                    {m.away}
                  </span>
                  <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, color:'rgba(247,245,240,.3)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {m.venue?.split(',')[0] || '—'}
                  </span>

                  {/* Odds cells */}
                  {[
                    { odds: m.bestH, ev_: m.evH, isMatch: isH },
                    { odds: m.bestD, ev_: m.evD, isMatch: !isH&&!isA },
                    { odds: m.bestA, ev_: m.evA, isMatch: isA },
                  ].map((cell, ci) => (
                    <div key={ci} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
                      <span className={`wc-odds-cell${cell.ev_>=8&&m.oddsSource==='live'?' value':cell.ev_>=3&&m.oddsSource==='live'?' best':''}`}>
                        {cell.odds?.toFixed(2) || '—'}
                      </span>
                      <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, color:'rgba(247,245,240,.3)' }}>
                        {ci===0?m.prob_home:ci===1?m.prob_draw:m.prob_away}%
                      </span>
                    </div>
                  ))}

                  {/* Model pick */}
                  <div style={{ textAlign:'center' }}>
                    <span style={{
                      fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:9, letterSpacing:'.08em',
                      padding:'3px 8px', borderRadius:2,
                      background: m.prediction==='Draw'?'rgba(74,127,212,.1)':'rgba(200,255,0,.08)',
                      border: m.prediction==='Draw'?'1px solid rgba(74,127,212,.25)':'1px solid rgba(200,255,0,.2)',
                      color: m.prediction==='Draw'?'#4A7FD4':'#C8FF00',
                      display:'inline-block',
                    }}>
                      {m.prediction === m.home ? 'HOME' : m.prediction === m.away ? 'AWAY' : 'DRAW'}
                    </span>
                    <div style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, marginTop:2, color: m.confidence>65?'#C8FF00':m.confidence>50?'#4A7FD4':'rgba(247,245,240,.4)' }}>
                      {m.confidence}%
                    </div>
                  </div>

                  {/* EV */}
                  <div style={{ textAlign:'center' }}>
                    {hasValue ? (
                      <span style={{
                        fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:10, fontWeight:500,
                        color: ec(bestEv), background: ebg(bestEv),
                        border:`1px solid ${ebr(bestEv)}`, padding:'3px 8px', borderRadius:2, display:'inline-block',
                      }}>+{bestEv.toFixed(1)}%</span>
                    ) : (
                      <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:9, color:'rgba(247,245,240,.2)' }}>—</span>
                    )}
                    {m.oddsSource === 'live' && (
                      <div style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:7, color:'#C8FF00', marginTop:2, letterSpacing:'.08em' }}>LIVE</div>
                    )}
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {/* ── ODDS INTEL TAB ────────────────────────────────────────────── */}
        {tab === 'Odds Intel' && (() => {
          // Sort
          const sortedMatches = [...matches].sort((a, b) => {
            if (oddsSort === 'ev')    return b.bestEv - a.bestEv;
            if (oddsSort === 'group') return a.group.localeCompare(b.group) || a.date.localeCompare(b.date);
            return a.date.localeCompare(b.date); // default: date
          });

          // Collapse/expand:
          // - showAll=true: full sorted list
          // - showAll=false + sort=ev: top 10 by EV (most actionable)
          // - showAll=false + sort=date/group: first 10 of the sorted order
          const visibleMatches = showAll
            ? sortedMatches
            : oddsSort === 'ev'
              ? sortedMatches.slice(0, 10)
              : sortedMatches.slice(0, 10);

          const allIds = sortedMatches.map(m => m.id || m.home + m.away);
          const allExpanded = expandedIds.size === allIds.length;

          return (
          <section data-theme="dark" style={{ padding:'48px 56px' }}>

            {/* ── Header row ── */}
            <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:32, flexWrap:'wrap', gap:16 }}>
              <div>
                <p style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, letterSpacing:'.2em', textTransform:'uppercase', color:'#C8FF00', marginBottom:12 }}>
                  {data?.liveCount || 0} live · {matches.length} total · {showAll ? `all ${matches.length} matches` : `top 10 by ${oddsSort==='ev'?'EV':oddsSort==='group'?'group':'date'}`}
                </p>
                <h2 style={{ fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)", fontSize:'clamp(48px,6vw,84px)', lineHeight:.88, color:'#F7F5F0', margin:0 }}>
                  <span style={{ fontFamily:"var(--font-serif,'Cormorant Garamond',serif)", fontStyle:'italic', fontWeight:300, fontSize:'.44em', color:'rgba(247,245,240,.6)', display:'block', marginBottom:'.06em' }}>Where the market</span>
                  Is Wrong.
                </h2>
              </div>

              {/* Controls */}
              <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                {/* Sort buttons */}
                <div style={{ display:'flex', border:'1px solid rgba(247,245,240,.1)', borderRadius:3, overflow:'hidden' }}>
                  {[['date','Date'],['ev','Best EV'],['group','Group']].map(([val, label]) => (
                    <button key={val} onClick={() => setOddsSort(val)}
                      style={{
                        fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, letterSpacing:'.1em',
                        textTransform:'uppercase', padding:'8px 14px', border:'none', cursor:'none',
                        background: oddsSort===val ? '#C8FF00' : 'rgba(247,245,240,.04)',
                        color:      oddsSort===val ? '#080808' : 'rgba(247,245,240,.5)',
                        borderRight: val!=='group' ? '1px solid rgba(247,245,240,.1)' : 'none',
                        transition:'all .15s',
                      }}>{label}</button>
                  ))}
                </div>

                {/* Expand/collapse bookmakers */}
                <button onClick={() => allExpanded ? collapseAll() : expandAll(allIds)}
                  style={{
                    fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, letterSpacing:'.1em',
                    textTransform:'uppercase', padding:'8px 14px', border:'1px solid rgba(247,245,240,.1)',
                    borderRadius:3, background:'rgba(247,245,240,.04)', color:'rgba(247,245,240,.6)',
                    cursor:'none', transition:'all .15s',
                  }}>
                  {allExpanded ? '− Collapse all' : '+ Expand all'}
                </button>

                {/* Show all / top 10 toggle */}
                <button onClick={() => setShowAll(v => !v)}
                  style={{
                    fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, letterSpacing:'.1em',
                    textTransform:'uppercase', padding:'8px 14px', borderRadius:3, cursor:'none',
                    border: showAll ? '1px solid rgba(200,255,0,.4)' : '1px solid rgba(247,245,240,.1)',
                    background: showAll ? 'rgba(200,255,0,.08)' : 'rgba(247,245,240,.04)',
                    color: showAll ? '#C8FF00' : 'rgba(247,245,240,.6)',
                    transition:'all .15s',
                  }}>
                  {showAll ? `Showing all ${matches.length}` : `Show all ${matches.length}`}
                </button>
              </div>
            </div>

            {/* Odds API offline warning */}
            {!data?.oddsOk && (
              <div style={{
                padding:'12px 20px', background:'rgba(240,165,0,.06)',
                border:'1px solid rgba(240,165,0,.18)', borderRadius:3, marginBottom:24,
                fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:9, letterSpacing:'.08em',
                color:'rgba(240,165,0,.8)',
              }}>
                ⚠ Live odds unavailable — add ODDS_API_KEY to .env.local to load bookmaker prices
              </div>
            )}

            <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:40, alignItems:'start' }}>

              {/* ── Match list ── */}
              <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
                {loading ? (
                  [...Array(5)].map((_,i) => (
                    <div key={i} style={{ height:72, background:'rgba(247,245,240,.03)', borderRadius:2, marginBottom:2 }} />
                  ))
                ) : visibleMatches.map((m, i) => {
                  const matchId  = m.id || (m.home + m.away);
                  const isExpanded = expandedIds.has(matchId);
                  const isH = m.bestEv === m.evH, isA = m.bestEv === m.evA;
                  const bestMkt  = isH ? `${m.home} Win` : isA ? `${m.away} Win` : 'Draw';
                  const bestOdds = isH ? m.bestH : isA ? m.bestA : m.bestD;
                  const bestProb = isH ? m.prob_home : isA ? m.prob_away : m.prob_draw;
                  const hasValue = m.bestEv > 3;
                  const hasLive  = m.oddsSource === 'live';

                  return (
                    <div key={matchId} style={{
                      border:`1px solid ${hasValue ? ebr(m.bestEv) : 'rgba(247,245,240,.06)'}`,
                      borderLeft:`2px solid ${hasValue ? ec(m.bestEv) : 'rgba(247,245,240,.12)'}`,
                      background: hasValue && m.bestEv>=8 ? 'rgba(200,255,0,.04)' : 'rgba(247,245,240,.015)',
                      transition:'background .2s',
                    }}>
                      {/* ── Always-visible summary row ── */}
                      <div
                        onClick={() => m.allBookmakers?.length > 0 && toggleExpand(matchId)}
                        style={{
                          display:'grid',
                          gridTemplateColumns:'80px 1fr auto 64px 64px 64px 90px 32px',
                          gap:12, padding:'14px 20px', alignItems:'center',
                          cursor: m.allBookmakers?.length > 0 ? 'none' : 'default',
                        }}
                      >
                        {/* Date */}
                        <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:9, color:'rgba(247,245,240,.35)' }}>
                          {fmtDate(m.date)}
                          {hasLive && <span style={{ display:'block', color:'#C8FF00', fontSize:7, letterSpacing:'.1em', marginTop:2 }}>LIVE</span>}
                        </span>

                        {/* Match */}
                        <div>
                          <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:7.5, letterSpacing:'.1em', textTransform:'uppercase', color:'rgba(247,245,240,.3)' }}>
                            Grp {m.group}
                          </span>
                          <div style={{ fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)", fontSize:16, letterSpacing:'.04em', color:'#F7F5F0', lineHeight:1.1 }}>
                            {m.home} <span style={{color:'rgba(247,245,240,.3)', fontSize:12}}>vs</span> {m.away}
                          </div>
                        </div>

                        {/* Best market pick */}
                        <div style={{ textAlign:'right' }}>
                          <span style={{
                            fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:9,
                            padding:'3px 9px', borderRadius:2, letterSpacing:'.06em',
                            background: hasValue ? ebg(m.bestEv) : 'rgba(247,245,240,.04)',
                            border:`1px solid ${hasValue ? ebr(m.bestEv) : 'rgba(247,245,240,.08)'}`,
                            color: hasValue ? ec(m.bestEv) : 'rgba(247,245,240,.5)',
                          }}>{bestMkt}</span>
                          <div style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, color:'rgba(247,245,240,.3)', marginTop:3 }}>
                            {bestProb}% model
                          </div>
                        </div>

                        {/* Home odds */}
                        <div style={{ textAlign:'center' }}>
                          <div style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:7.5, color:'rgba(247,245,240,.3)', marginBottom:2 }}>{m.home.split(' ')[0]}</div>
                          <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:13, fontWeight:500,
                            color: m.evH > 3 ? '#C8FF00' : 'rgba(247,245,240,.75)' }}>
                            {m.bestH?.toFixed(2)}
                          </span>
                        </div>

                        {/* Draw odds */}
                        <div style={{ textAlign:'center' }}>
                          <div style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:7.5, color:'rgba(247,245,240,.3)', marginBottom:2 }}>Draw</div>
                          <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:13, fontWeight:500,
                            color: m.evD > 3 ? '#C8FF00' : 'rgba(247,245,240,.75)' }}>
                            {m.bestD?.toFixed(2)}
                          </span>
                        </div>

                        {/* Away odds */}
                        <div style={{ textAlign:'center' }}>
                          <div style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:7.5, color:'rgba(247,245,240,.3)', marginBottom:2 }}>{m.away.split(' ')[0]}</div>
                          <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:13, fontWeight:500,
                            color: m.evA > 3 ? '#C8FF00' : 'rgba(247,245,240,.75)' }}>
                            {m.bestA?.toFixed(2)}
                          </span>
                        </div>

                        {/* EV badge */}
                        <div style={{ textAlign:'center' }}>
                          <span style={{
                            fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:11, fontWeight:500,
                            color: ec(m.bestEv),
                            background: hasValue ? ebg(m.bestEv) : 'transparent',
                            border: hasValue ? `1px solid ${ebr(m.bestEv)}` : 'none',
                            padding: hasValue ? '2px 7px' : '0',
                            borderRadius:2,
                          }}>
                            {m.bestEv > 0 ? '+' : ''}{m.bestEv.toFixed(1)}%
                          </span>
                        </div>

                        {/* Expand toggle — only if bookmakers available */}
                        <div style={{ textAlign:'center' }}>
                          {m.allBookmakers?.length > 0 && (
                            <span style={{
                              fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:14,
                              color: isExpanded ? '#C8FF00' : 'rgba(247,245,240,.3)',
                              userSelect:'none', lineHeight:1,
                            }}>
                              {isExpanded ? '−' : '+'}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* ── Expanded bookmaker breakdown ── */}
                      {isExpanded && m.allBookmakers?.length > 0 && (
                        <div style={{ borderTop:'1px solid rgba(247,245,240,.05)', padding:'12px 20px 16px' }}>
                          {/* Column headers */}
                          <div style={{
                            display:'grid', gridTemplateColumns:'140px 1fr 1fr 1fr',
                            gap:8, marginBottom:8,
                            fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:7.5,
                            letterSpacing:'.12em', textTransform:'uppercase', color:'rgba(247,245,240,.25)',
                          }}>
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
                              <div key={bi} style={{
                                display:'grid', gridTemplateColumns:'140px 1fr 1fr 1fr',
                                gap:8, padding:'6px 0',
                                borderBottom: bi < m.allBookmakers.length-1 ? '1px solid rgba(247,245,240,.04)' : 'none',
                                alignItems:'center',
                              }}>
                                <span style={{
                                  fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:9,
                                  color: bk.key==='pinnacle' ? '#C8FF00' : 'rgba(247,245,240,.5)',
                                  overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
                                }}>
                                  {bk.key==='pinnacle' ? '★ ' : ''}{bk.name}
                                </span>
                                {[
                                  {v:bk.homeOdds, max:maxH, ev_:((m.prob_home/100)*(bk.homeOdds||0)-1)*100},
                                  {v:bk.drawOdds, max:maxD, ev_:((m.prob_draw/100)*(bk.drawOdds||0)-1)*100},
                                  {v:bk.awayOdds, max:maxA, ev_:((m.prob_away/100)*(bk.awayOdds||0)-1)*100},
                                ].map((cell, ci) => (
                                  <div key={ci} style={{ textAlign:'center' }}>
                                    <span style={{
                                      fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:12, fontWeight:500,
                                      color: cell.v===cell.max && cell.max ? '#C8FF00' : 'rgba(247,245,240,.7)',
                                    }}>
                                      {cell.v?.toFixed(2) || '—'}
                                    </span>
                                    {cell.ev_ > 2 && (
                                      <div style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:7, color:'rgba(200,255,0,.7)', marginTop:1 }}>
                                        +{cell.ev_.toFixed(1)}%
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            );
                          })}
                          <div style={{ marginTop:10, fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, color:'rgba(247,245,240,.25)', letterSpacing:'.06em' }}>
                            ★ Pinnacle = sharp reference · green = best available price · +% = EV edge vs model
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Show all / show less footer */}
                {!loading && matches.length > 10 && (
                  <button onClick={() => setShowAll(v => !v)}
                    style={{
                      marginTop:12, width:'100%', padding:'14px',
                      fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:9, letterSpacing:'.12em',
                      textTransform:'uppercase', background:'rgba(247,245,240,.03)',
                      border:'1px solid rgba(247,245,240,.08)', color:'rgba(247,245,240,.5)',
                      cursor:'none', transition:'all .2s', borderRadius:2,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(200,255,0,.3)'; e.currentTarget.style.color='#C8FF00'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(247,245,240,.08)'; e.currentTarget.style.color='rgba(247,245,240,.5)'; }}>
                    {showAll
                      ? `↑ Show top 10 by EV only`
                      : `↓ Show all ${matches.length} fixtures — ${matches.length - 10} more`}
                  </button>
                )}

                {!loading && matches.length === 0 && (
                  <p style={{ fontFamily:"var(--font-body,'Outfit',sans-serif)", fontSize:14, fontWeight:200, color:'rgba(247,245,240,.5)', padding:'32px 0' }}>
                    No fixtures loaded — run python predictor/predict.py to generate data.
                  </p>
                )}
              </div>

              {/* ── Sidebar ── */}
              <div style={{ display:'flex', flexDirection:'column', gap:2, position:'sticky', top:120 }}>
                {[
                  { l:'Live matches', v: data?.liveCount || 0, accent:true },
                  { l:'Value edges >3%', v: valueMatches.length },
                  { l:'Total fixtures', v: matches.length },
                  { l:'Requests left', v: data?.requestsLeft || '—' },
                ].map((s,i)=>(
                  <div key={i} style={{ padding:'20px', border:'1px solid rgba(247,245,240,.07)', background:'rgba(247,245,240,.02)' }}>
                    <div style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, letterSpacing:'.12em', textTransform:'uppercase', color:'rgba(247,245,240,.4)', marginBottom:6 }}>{s.l}</div>
                    <div style={{ fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)", fontSize:40, lineHeight:.9, color: s.accent?'#C8FF00':'#F7F5F0' }}>{loading?'—':s.v}</div>
                  </div>
                ))}

                {/* Sort legend */}
                <div style={{ padding:'16px 20px', border:'1px solid rgba(247,245,240,.07)', background:'rgba(247,245,240,.02)', marginTop:4 }}>
                  <div style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:7.5, letterSpacing:'.12em', textTransform:'uppercase', color:'rgba(247,245,240,.3)', marginBottom:10 }}>How to read</div>
                  {[
                    ['Green odds', 'Best price available'],
                    ['+EV%', 'Model prob × odds − 1'],
                    ['★ Pinnacle', 'Sharpest reference market'],
                    ['+ expand', 'All bookmaker prices'],
                  ].map(([k,v])=>(
                    <div key={k} style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                      <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, color:'#C8FF00' }}>{k}</span>
                      <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, color:'rgba(247,245,240,.35)', textAlign:'right', maxWidth:'55%' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
          );
        })()}

        {/* ── RANKINGS TAB ──────────────────────────────────────────────── */}
        {tab === 'Rankings' && (
          <section data-theme="dark" style={{ padding:'48px 56px' }}>
            <p style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, letterSpacing:'.2em', textTransform:'uppercase', color:'#C8FF00', marginBottom:20 }}>
              Elo power rankings
            </p>
            <h2 style={{ fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)", fontSize:'clamp(56px,8vw,110px)', lineHeight:.86, color:'#F7F5F0', marginBottom:48 }}>
              <span style={{ fontFamily:"var(--font-serif,'Cormorant Garamond',serif)", fontStyle:'italic', fontWeight:300, fontSize:'.44em', color:'rgba(247,245,240,.6)', display:'block', marginBottom:'.08em' }}>48 teams</span>
              Ranked.
            </h2>

            {/* Column header */}
            <div style={{ display:'grid', gridTemplateColumns:'32px 1fr 60px 80px 60px 60px 60px 100px', gap:8, padding:'8px 0', borderBottom:'1px solid rgba(247,245,240,.08)', fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, letterSpacing:'.1em', textTransform:'uppercase', color:'rgba(247,245,240,.3)' }}>
              <span>#</span><span>Team</span><span>Conf</span><span>Elo</span><span>W%</span><span>Avg GF</span><span>Avg GA</span><span>Win Prob</span>
            </div>

            {loading ? (
              [...Array(10)].map((_,i) => <div key={i} style={{ height:44, margin:'2px 0', background:'rgba(247,245,240,.03)', borderRadius:2 }} />)
            ) : teamStats.map((t, i) => (
              <div key={t.team} style={{
                display:'grid', gridTemplateColumns:'32px 1fr 60px 80px 60px 60px 60px 100px', gap:8,
                padding:'13px 0', borderBottom:'1px solid rgba(247,245,240,.04)',
                transition:'background .15s', cursor:'none',
              }}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(200,255,0,.025)'}
                onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:10, color:'rgba(247,245,240,.25)' }}>{i+1}</span>
                <span style={{ fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)", fontSize:16, letterSpacing:'.04em', color: i<4?'#C8FF00':i<12?'#F7F5F0':'rgba(247,245,240,.65)' }}>{t.team}</span>
                <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, color: CONF_COLOR[t.conf]||'rgba(247,245,240,.4)' }}>{t.conf}</span>
                <span style={{ fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)", fontSize:18, color: i<4?'#C8FF00':'#F7F5F0' }}>{t.elo}</span>
                <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:10, color:'rgba(247,245,240,.5)' }}>{Math.round(t.win_rate*100)}%</span>
                <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:10, color:'rgba(247,245,240,.5)' }}>{t.avg_gf}</span>
                <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:10, color:'rgba(247,245,240,.5)' }}>{t.avg_ga}</span>
                <div>
                  <span style={{
                    fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:10, fontWeight:500,
                    color: i<4?'#C8FF00':i<12?'rgba(200,255,0,.7)':'rgba(247,245,240,.45)',
                  }}>{t.win_prob_pct}%</span>
                  <div style={{ width:'80%', height:2, background:'rgba(247,245,240,.06)', borderRadius:1, marginTop:4, overflow:'hidden' }}>
                    <div style={{ height:'100%', background: i<4?'#C8FF00':i<12?'rgba(200,255,0,.5)':'rgba(74,127,212,.4)', width:`${t.win_prob_pct/16*100}%`, borderRadius:1 }} />
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* ── SIMULATOR TAB ─────────────────────────────────────────────── */}
        {tab === 'Simulator' && (
          <section data-theme="dark" style={{ padding:'48px 56px' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 400px', gap:80, alignItems:'start' }}>
              <div>
                <p style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, letterSpacing:'.2em', textTransform:'uppercase', color:'#C8FF00', marginBottom:20 }}>Monte Carlo</p>
                <h2 style={{ fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)", fontSize:'clamp(56px,8vw,108px)', lineHeight:.86, color:'#F7F5F0', marginBottom:24 }}>
                  <span style={{ fontFamily:"var(--font-serif,'Cormorant Garamond',serif)", fontStyle:'italic', fontWeight:300, fontSize:'.46em', color:'rgba(247,245,240,.6)', display:'block', marginBottom:'.1em' }}>Simulate</span>
                  The Trophy.
                </h2>
                <p style={{ fontFamily:"var(--font-body,'Outfit',sans-serif)", fontSize:14, fontWeight:200, color:'rgba(247,245,240,.65)', lineHeight:1.85, maxWidth:420, marginBottom:32 }}>
                  1,000 full tournament simulations from the current Elo ratings. Click to run — the bracket plays out in real time.
                </p>
                <button onClick={runSim} disabled={simRunning || loading} style={{
                  fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:10, letterSpacing:'.1em', textTransform:'uppercase',
                  background: simRunning?'rgba(200,255,0,.3)':'#C8FF00', color:'#080808',
                  border:'none', borderRadius:3, padding:'16px 32px', cursor:'none',
                  transition:'all .22s cubic-bezier(.34,1.56,.64,1)',
                  display:'flex', alignItems:'center', gap:12,
                  opacity: loading?0.5:1,
                }}>
                  {simRunning ? '⏳ Running 1,000 simulations...' : '▶ Run simulator'}
                </button>

                {simResult && (
                  <div style={{ marginTop:48, display:'flex', flexDirection:'column', gap:4 }}>
                    {simResult.map((r, i) => (
                      <div key={r.team} style={{ display:'flex', alignItems:'center', gap:16, padding:'12px 0', borderBottom:'1px solid rgba(247,245,240,.05)' }}>
                        <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:10, color:'rgba(247,245,240,.25)', width:20, textAlign:'right' }}>{i+1}</span>
                        <span style={{ fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)", fontSize:20, letterSpacing:'.04em', color: i===0?'#C8FF00':i<3?'#F7F5F0':'rgba(247,245,240,.65)', flex:1 }}>{r.team}</span>
                        <div style={{ width:160, height:3, background:'rgba(247,245,240,.06)', borderRadius:2, overflow:'hidden' }}>
                          <div style={{ height:'100%', background: i===0?'#C8FF00':i<3?'#4A7FD4':'rgba(247,245,240,.3)', width:`${r.pct/simResult[0].pct*100}%`, borderRadius:2, transition:'width .6s cubic-bezier(.22,1,.36,1)' }} />
                        </div>
                        <span style={{ fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)", fontSize:24, color: i===0?'#C8FF00':i<3?'#F7F5F0':'rgba(247,245,240,.5)', width:52, textAlign:'right' }}>{r.pct}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Win probability from 10k sims */}
              <div>
                <div style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:8, letterSpacing:'.12em', textTransform:'uppercase', color:'rgba(247,245,240,.4)', marginBottom:20 }}>
                  10k sim win probability
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
                  {simulation.filter(s=>s.win_pct>0.1).slice(0,16).map((s,i)=>(
                    <div key={s.team} style={{ display:'flex', alignItems:'center', gap:12, padding:'8px 0', borderBottom:'1px solid rgba(247,245,240,.04)' }}>
                      <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:9, color:'rgba(247,245,240,.2)', width:16, textAlign:'right' }}>{i+1}</span>
                      <span style={{ fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)", fontSize:14, letterSpacing:'.04em', color: i===0?'#C8FF00':i<3?'#F7F5F0':'rgba(247,245,240,.6)', flex:1 }}>{s.team}</span>
                      <div style={{ width:80, height:2, background:'rgba(247,245,240,.06)', borderRadius:1, overflow:'hidden' }}>
                        <div style={{ height:'100%', background: i===0?'#C8FF00':i<3?'#4A7FD4':'rgba(247,245,240,.25)', width:`${s.win_pct/simulation[0].win_pct*100}%`, borderRadius:1 }} />
                      </div>
                      <span style={{ fontFamily:"var(--font-mono,'DM Mono',monospace)", fontSize:10, color: i===0?'#C8FF00':i<3?'#4A7FD4':'rgba(247,245,240,.45)', width:36, textAlign:'right' }}>{s.win_pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

      </div>
    </>
  );
}