"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

function fmtDate(d) {
  if (!d) return '';
  return new Date(d+'T12:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short'});
}
function useCursor() {
  useEffect(() => {
    document.body.style.cursor = 'none';
    const cur=document.getElementById('ea-cur'),dot=document.getElementById('ea-dot'),ring=document.getElementById('ea-ring');
    if(!cur||!dot||!ring) return;
    let mx=window.innerWidth/2,my=window.innerHeight/2,rx=mx,ry=my,rafId;
    const onMove=e=>{mx=e.clientX;my=e.clientY;let d=true;for(const s of document.querySelectorAll('[data-theme]')){const{top,bottom}=s.getBoundingClientRect();if(e.clientY>=top&&e.clientY<bottom){d=s.dataset.theme==='dark';break;}}dot.style.background=d?'#F7F5F0':'#080808';ring.style.borderColor=d?'rgba(247,245,240,.55)':'rgba(8,8,8,.55)';};
    const loop=()=>{rx+=(mx-rx)*.12;ry+=(my-ry)*.12;cur.style.left=mx+'px';cur.style.top=my+'px';ring.style.left=(rx-mx)+'px';ring.style.top=(ry-my)+'px';rafId=requestAnimationFrame(loop);};
    document.addEventListener('mousemove',onMove);rafId=requestAnimationFrame(loop);
    const add=()=>document.body.classList.add('lp-hovering'),rem=()=>document.body.classList.remove('lp-hovering');
    document.querySelectorAll('a,button').forEach(el=>{el.addEventListener('mouseenter',add);el.addEventListener('mouseleave',rem);});
    return()=>{document.body.style.cursor='';cancelAnimationFrame(rafId);document.removeEventListener('mousemove',onMove);};
  },[]);
}

const ec  = e => e>=8?'#C8FF00':e>=3?'rgba(200,255,0,.8)':'rgba(247,245,240,.55)';
const ebg = e => e>=8?'rgba(200,255,0,.12)':e>=3?'rgba(200,255,0,.06)':'transparent';
const ebr = e => e>=8?'rgba(200,255,0,.28)':e>=3?'rgba(200,255,0,.14)':'rgba(247,245,240,.07)';
const GROUPS = ['A','B','C','D','E','F','G','H','I','J','K','L'];

function computeStandings(matches) {
  const groups = {};
  for (const m of matches) {
    if (!groups[m.group]) groups[m.group] = {};
    const g = groups[m.group];
    if (!g[m.home]) g[m.home] = { p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 };
    if (!g[m.away]) g[m.away] = { p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 };
  }
  for (const m of matches) {
    if (m.status !== 'completed' || m.home_score == null) continue;
    const { group, home, away, home_score: hs, away_score: as_ } = m;
    const g = groups[group];
    g[home].p++; g[away].p++;
    g[home].gf += hs; g[home].ga += as_;
    g[away].gf += as_; g[away].ga += hs;
    if (hs > as_)      { g[home].w++; g[home].pts += 3; g[away].l++; }
    else if (hs < as_) { g[away].w++; g[away].pts += 3; g[home].l++; }
    else               { g[home].d++; g[home].pts++;    g[away].d++; g[away].pts++; }
  }
  return Object.entries(groups)
    .sort(([a],[b]) => a.localeCompare(b))
    .map(([group, teams]) => ({
      group,
      teams: Object.entries(teams)
        .map(([name, s]) => ({ name, ...s, gd: s.gf - s.ga }))
        .sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf),
    }));
}

export default function FixturesPage() {
  useCursor();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [grp,     setGrp]     = useState('ALL');
  const [tab,     setTab]     = useState('upcoming');
  const [imgReady,setImgReady]= useState(false);

  useEffect(()=>{const t=setTimeout(()=>setImgReady(true),80);return()=>clearTimeout(t);},[]);
  useEffect(()=>{
    fetch('/api/wc2026', { cache:'no-store' }).then(r=>r.json()).then(setData).catch(()=>{}).finally(()=>setLoading(false));
  },[]);

  const matches    = data?.matches || [];
  const upcoming   = matches.filter(m => m.status !== 'completed');
  const results    = matches.filter(m => m.status === 'completed');
  const tabMatches = tab === 'upcoming' ? upcoming : results;
  const filtered   = (grp === 'ALL' ? tabMatches : tabMatches.filter(m => m.group === grp))
    .sort((a, b) => tab === 'results' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date));
  const liveCount  = matches.filter(m=>m.oddsSource==='live').length;
  const valueCount = matches.filter(m=>m.bestEv>3).length;
  const standings  = computeStandings(matches);

  return (<>
    <div id="ea-cur" style={{position:'fixed',zIndex:9998,pointerEvents:'none',top:0,left:0}} aria-hidden="true">
      <div id="ea-ring" style={{width:36,height:36,border:'1.5px solid rgba(247,245,240,.55)',borderRadius:'50%',position:'absolute',transform:'translate(-50%,-50%)',transition:'width .2s,height .2s,border-color .2s'}}/>
      <div id="ea-dot"  style={{width:6,height:6,background:'#F7F5F0',borderRadius:'50%',position:'absolute',transform:'translate(-50%,-50%)',transition:'transform .08s,background .2s'}}/>
    </div>
    <style>{`body.lp-hovering #ea-ring{width:52px!important;height:52px!important;border-color:#C8FF00!important}body.lp-hovering #ea-dot{background:#C8FF00!important;transform:translate(-50%,-50%) scale(1.4)!important}`}</style>

    <div style={{background:'#080808',minHeight:'100vh',color:'#F7F5F0'}}>

      {/* Hero */}
      <section data-theme="dark" className="ea-hero ea-fx-hero">
        <div style={{position:'absolute',inset:0,background:`url('https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1920&q=85&fit=crop') center 40%/cover`,filter:'grayscale(100%) brightness(.18)',transform:imgReady?'scale(1)':'scale(1.05)',transition:'transform 12s ease'}} aria-hidden="true"/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent 30%,rgba(8,8,8,.95) 80%)'}} aria-hidden="true"/>
        <div style={{position:'absolute',left:56,top:0,bottom:0,width:2,background:'linear-gradient(to bottom,transparent 10%,#C8FF00 35%,#C8FF00 70%,transparent 100%)',opacity:.5}} aria-hidden="true"/>
        <div className="ea-hero__inner">
          <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:20}}>
            <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:7.5,letterSpacing:'.18em',textTransform:'uppercase',background:'#C8FF00',color:'#080808',padding:'5px 12px',borderRadius:2,display:'flex',alignItems:'center',gap:7}}>
              <span style={{width:5,height:5,borderRadius:'50%',background:'#080808',animation:'lp-blink 1.8s ease infinite'}}/>WC 2026
            </span>
            <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.12em',textTransform:'uppercase',color:'rgba(247,245,240,.5)'}}>
              {loading?'—':matches.length} fixtures · {liveCount} live odds · {valueCount} value edges
              {!loading&&data?.modelRecord?.played>0&&(
                <span style={{marginLeft:12,color:'#C8FF00'}}>
                  · Model {data.modelRecord.correct}/{data.modelRecord.played} correct
                </span>
              )}
            </span>
          </div>
          <h1 style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:'clamp(72px,12vw,160px)',lineHeight:.84,margin:0}}>
            <span style={{fontFamily:"var(--font-serif,'Cormorant Garamond',serif)",fontStyle:'italic',fontWeight:300,fontSize:'.38em',color:'rgba(247,245,240,.6)',display:'block',marginBottom:'.06em'}}>Group stage</span>
            Fixtures.
          </h1>
        </div>
      </section>

      {/* Tabs + Group filter */}
      <section data-theme="dark" className="ea-fx-filter" style={{padding:'32px 56px 0',borderBottom:'1px solid rgba(247,245,240,.06)'}}>
        {/* Tabs */}
        <div className="ea-fx-tabs" style={{display:'flex',gap:0,border:'1px solid rgba(247,245,240,.1)',borderRadius:2,overflow:'hidden',width:'fit-content',marginBottom:20}}>
          {[
            ['upcoming', `Upcoming · ${loading?'—':upcoming.length}`],
            ['results',  `Results · ${loading?'—':results.length}`],
            ['groups',   'Group Tables'],
          ].map(([val,label],i,arr)=>(
            <button key={val} onClick={()=>setTab(val)} style={{
              fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:9,letterSpacing:'.1em',textTransform:'uppercase',
              padding:'10px 28px',border:'none',cursor:'none',
              background:tab===val?'#C8FF00':'rgba(247,245,240,.04)',
              color:tab===val?'#080808':'rgba(247,245,240,.5)',
              borderRight:i<arr.length-1?'1px solid rgba(247,245,240,.1)':'none',
              transition:'all .15s',
            }}>{label}</button>
          ))}
        </div>
        {tab !== 'groups' && <div style={{display:'flex',gap:6,flexWrap:'wrap',paddingBottom:24}}>
          <button onClick={()=>setGrp('ALL')} style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.1em',textTransform:'uppercase',padding:'7px 16px',borderRadius:2,border:`1px solid ${grp==='ALL'?'rgba(200,255,0,.4)':'rgba(247,245,240,.08)'}`,background:grp==='ALL'?'rgba(200,255,0,.08)':'transparent',color:grp==='ALL'?'#C8FF00':'rgba(247,245,240,.45)',cursor:'none',transition:'all .15s'}}>
            All Groups
          </button>
          {GROUPS.map(g=>(
            <button key={g} onClick={()=>setGrp(grp===g?'ALL':g)} style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.1em',padding:'7px 14px',borderRadius:2,border:`1px solid ${grp===g?'rgba(200,255,0,.4)':'rgba(247,245,240,.08)'}`,background:grp===g?'rgba(200,255,0,.08)':'transparent',color:grp===g?'#C8FF00':'rgba(247,245,240,.45)',cursor:'none',transition:'all .15s'}}>
              {g}
            </button>
          ))}
        </div>}
      </section>

      {/* Table / Standings */}
      <section data-theme="dark" className="ea-fx-section" style={{padding:'0 56px 80px'}}>

        {tab === 'groups' ? (
          /* ── Group Standings ── */
          loading ? (
            <div className="ea-standings-grid">
              {[...Array(12)].map((_,i)=>(
                <div key={i} style={{height:200,background:'rgba(247,245,240,.03)',borderRadius:2}}/>
              ))}
            </div>
          ) : (
            <div className="ea-standings-grid">
              {standings.map(({group,teams})=>(
                <div key={group} style={{border:'1px solid rgba(247,245,240,.08)',borderRadius:2,overflow:'hidden'}}>
                  {/* Group header */}
                  <div style={{padding:'10px 16px',background:'rgba(247,245,240,.04)',borderBottom:'1px solid rgba(247,245,240,.08)',display:'flex',alignItems:'baseline',gap:10}}>
                    <span style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:22,letterSpacing:'.06em',color:'#C8FF00'}}>Group {group}</span>
                    <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:7.5,letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(247,245,240,.3)'}}>
                      {teams.reduce((s,t)=>s+t.p,0)/2|0} played
                    </span>
                  </div>
                  {/* Column headers */}
                  <div className="ea-standings-hdr" style={{padding:'6px 16px',fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:7,letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(247,245,240,.25)',borderBottom:'1px solid rgba(247,245,240,.05)'}}>
                    <span>Team</span>
                    <span style={{textAlign:'center'}}>P</span>
                    <span style={{textAlign:'center'}}>W</span>
                    <span style={{textAlign:'center'}}>D</span>
                    <span style={{textAlign:'center'}}>L</span>
                    <span style={{textAlign:'center'}}>GF</span>
                    <span style={{textAlign:'center'}}>GA</span>
                    <span style={{textAlign:'center'}}>GD</span>
                    <span style={{textAlign:'center'}}>Pts</span>
                  </div>
                  {/* Team rows */}
                  {teams.map((t,ti)=>{
                    const advances = ti < 2;
                    return (
                      <div key={t.name} className="ea-standings-row" style={{
                        padding:'8px 16px',
                        borderBottom:ti<teams.length-1?'1px solid rgba(247,245,240,.04)':'none',
                        borderLeft:`2px solid ${advances?'rgba(200,255,0,.4)':'transparent'}`,
                        background:advances?'rgba(200,255,0,.02)':'transparent',
                      }}>
                        <span style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:14,letterSpacing:'.04em',color:advances?'#F7F5F0':'rgba(247,245,240,.55)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{t.name}</span>
                        {[t.p,t.w,t.d,t.l,t.gf,t.ga,t.gd>0?`+${t.gd}`:t.gd].map((v,vi)=>(
                          <span key={vi} style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:9,textAlign:'center',color:vi===6?(t.gd>0?'#C8FF00':t.gd<0?'#ef4444':'rgba(247,245,240,.4)'):'rgba(247,245,240,.5)'}}>{v}</span>
                        ))}
                        <span style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:16,textAlign:'center',color:advances?'#C8FF00':'rgba(247,245,240,.7)'}}>{t.pts}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )
        ) : (
          /* ── Fixture / Results table ── */
          <>
            <div className="ea-fx-hdr" style={{display:'grid',gridTemplateColumns:'80px 1fr 1fr 60px 72px 72px 72px 100px 96px 64px',gap:8,padding:'10px 12px',borderBottom:'1px solid rgba(247,245,240,.08)',marginTop:24,fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(247,245,240,.3)'}}>
              <span>Date</span><span>Home</span><span>Away</span><span>Grp</span>
              <span style={{textAlign:'center'}}>Home</span><span style={{textAlign:'center'}}>Draw</span><span style={{textAlign:'center'}}>Away</span>
              <span style={{textAlign:'center'}}>Model</span><span style={{textAlign:'center'}}>EV Edge</span>
              <span style={{textAlign:'center'}}>Result</span>
            </div>

            {loading ? [...Array(8)].map((_,i)=>(
              <div key={i} style={{height:50,background:'rgba(247,245,240,.03)',borderRadius:2,margin:'2px 0'}}/>
            )) : filtered.map((m,i)=>{
              const bestEv=Math.max(m.evH||0,m.evD||0,m.evA||0);
              const hasVal=bestEv>3;
              const isCompleted=m.status==='completed';
              const borderCol=isCompleted?(m.model_correct?'rgba(200,255,0,.5)':'rgba(239,68,68,.4)'):hasVal?ec(bestEv):'transparent';
              return (
                <div key={i} className="ea-fx-row" style={{
                  display:'grid',gridTemplateColumns:'80px 1fr 1fr 60px 72px 72px 72px 100px 96px 64px',gap:8,
                  padding:'13px 12px',
                  borderBottom:'1px solid rgba(247,245,240,.04)',
                  borderLeft:`2px solid ${borderCol}`,
                  background:isCompleted?'rgba(247,245,240,.018)':'transparent',
                  transition:'background .15s',cursor:'none',
                }}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(200,255,0,.025)'}
                  onMouseLeave={e=>e.currentTarget.style.background=isCompleted?'rgba(247,245,240,.018)':'transparent'}>
                  <div className="ea-fx-date">
                    <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:9,color:'rgba(247,245,240,.4)'}}>{fmtDate(m.date)}</span>
                    {m.oddsSource==='live'&&<span style={{display:'block',fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:7,color:'#C8FF00',letterSpacing:'.1em',marginTop:2}}>LIVE</span>}
                  </div>
                  <span className="ea-fx-home" style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:15,letterSpacing:'.04em',color:m.prediction===m.home?'#F7F5F0':'rgba(247,245,240,.5)'}}>{m.home}</span>
                  <span className="ea-fx-away" style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:15,letterSpacing:'.04em',color:m.prediction===m.away?'#F7F5F0':'rgba(247,245,240,.5)'}}>{m.away}</span>
                  <span className="ea-fx-grp" style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:9,color:'rgba(247,245,240,.3)',textAlign:'center'}}>{m.group}</span>
                  {[{o:m.bestH??m.odds_home,e:m.evH??0},{o:m.bestD??m.odds_draw,e:m.evD??0},{o:m.bestA??m.odds_away,e:m.evA??0}].map((c,ci)=>(
                    <div key={ci} className="ea-fx-odds" style={{textAlign:'center'}}>
                      <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:13,fontWeight:500,color:c.e>3?'#C8FF00':'rgba(247,245,240,.7)'}}>{c.o?.toFixed(2)||'—'}</span>
                      <div style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,color:'rgba(247,245,240,.3)',marginTop:1}}>{ci===0?m.prob_home:ci===1?m.prob_draw:m.prob_away}%</div>
                    </div>
                  ))}
                  <div className="ea-fx-model" style={{textAlign:'left'}}>
                    <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                      {[
                        {label:'H',prob:m.prob_home,win:m.prediction===m.home,isDraw:false},
                        {label:'D',prob:m.prob_draw,win:m.prediction==='Draw',isDraw:true},
                        {label:'A',prob:m.prob_away,win:m.prediction===m.away,isDraw:false},
                      ].map((o,oi)=>(
                        <span key={oi} style={{
                          fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,
                          padding:'2px 6px',borderRadius:2,
                          background:o.win?(o.isDraw?'rgba(74,127,212,.1)':'rgba(200,255,0,.08)'):'rgba(247,245,240,.03)',
                          border:`1px solid ${o.win?(o.isDraw?'rgba(74,127,212,.25)':'rgba(200,255,0,.2)'):'rgba(247,245,240,.07)'}`,
                          color:o.win?(o.isDraw?'#4A7FD4':'#C8FF00'):'rgba(247,245,240,.35)',
                        }}>{o.label} {o.prob}%</span>
                      ))}
                    </div>
                  </div>
                  <div className="ea-fx-ev" style={{textAlign:'center'}}>
                    {hasVal?<span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:11,fontWeight:500,color:ec(bestEv),padding:'3px 8px',background:ebg(bestEv),border:`1px solid ${ebr(bestEv)}`,borderRadius:2,display:'inline-block'}}>+{bestEv.toFixed(1)}%</span>
                    :<span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:9,color:'rgba(247,245,240,.18)'}}>—</span>}
                  </div>
                  <div className="ea-fx-result" style={{textAlign:'center'}}>
                    {isCompleted ? (
                      <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
                        <span style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:15,letterSpacing:'.04em',color:m.model_correct?'#C8FF00':'#ef4444'}}>{m.actual_score}</span>
                        <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,fontWeight:700,color:m.model_correct?'#C8FF00':'#ef4444',letterSpacing:'.06em'}}>{m.model_correct?'✓ CORRECT':'✗ WRONG'}</span>
                      </div>
                    ) : (
                      <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:9,color:'rgba(247,245,240,.15)'}}>—</span>
                    )}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </section>
    </div>
  </>);
}