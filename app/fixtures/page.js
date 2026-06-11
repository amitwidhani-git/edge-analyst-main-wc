"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

function fmtDate(d) {
  if (!d) return '';
  return new Date(d+'T12:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short'});
}
function useCursor() {
  useEffect(() => {
    if(window.matchMedia('(hover:none),(pointer:coarse)').matches) return;
    document.body.style.cursor = 'none';
    const cur=document.getElementById('ea-cur'),dot=document.getElementById('ea-dot'),ring=document.getElementById('ea-ring');
    if(!cur||!dot||!ring) return;
    cur.style.opacity='0';
    let mx=-100,my=-100,rx=mx,ry=my,rafId;
    const onMove=e=>{cur.style.opacity='1';mx=e.clientX;my=e.clientY;let d=true;for(const s of document.querySelectorAll('[data-theme]')){const{top,bottom}=s.getBoundingClientRect();if(e.clientY>=top&&e.clientY<bottom){d=s.dataset.theme==='dark';break;}}dot.style.background=d?'#F7F5F0':'#080808';ring.style.borderColor=d?'rgba(247,245,240,.55)':'rgba(8,8,8,.55)';};
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

export default function FixturesPage() {
  useCursor();
  const [data,     setData]     = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [grp,      setGrp]      = useState('ALL');
  const [sort,     setSort]     = useState('date');
  const [scrolled, setScrolled] = useState(false);
  const [imgReady, setImgReady] = useState(false);

  useEffect(()=>{const t=setTimeout(()=>setImgReady(true),80);return()=>clearTimeout(t);},[]);
  useEffect(()=>{
    fetch('/api/wc2026').then(r=>r.json()).then(setData).catch(()=>{}).finally(()=>setLoading(false));
  },[]);
  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>400);
    window.addEventListener('scroll',fn);
    return()=>window.removeEventListener('scroll',fn);
  },[]);

  const matches    = data?.matches || [];
  const filtered   = (grp==='ALL' ? matches : matches.filter(m=>m.group===grp))
    .sort((a,b)=>{
      if(sort==='ev')    return Math.max(b.evH||0,b.evD||0,b.evA||0)-Math.max(a.evH||0,a.evD||0,a.evA||0);
      if(sort==='group') return a.group.localeCompare(b.group)||a.date.localeCompare(b.date);
      return a.date.localeCompare(b.date);
    });
  const liveCount  = matches.filter(m=>m.oddsSource==='live').length;
  const valueCount = matches.filter(m=>Math.max(m.evH||0,m.evD||0,m.evA||0)>3).length;
  const gridCols   = grp==='ALL'
    ? '80px 1fr 1fr 60px 72px 72px 72px 100px 88px'
    : '80px 1fr 1fr 72px 72px 72px 100px 88px';

  return (<>
    <div id="ea-cur" style={{position:'fixed',zIndex:9998,pointerEvents:'none',top:0,left:0,opacity:0,transition:'opacity .3s'}} aria-hidden="true">
      <div id="ea-ring" style={{width:36,height:36,border:'1.5px solid rgba(247,245,240,.55)',borderRadius:'50%',position:'absolute',transform:'translate(-50%,-50%)',transition:'width .2s,height .2s,border-color .2s'}}/>
      <div id="ea-dot"  style={{width:6,height:6,background:'#F7F5F0',borderRadius:'50%',position:'absolute',transform:'translate(-50%,-50%)',transition:'transform .08s,background .2s'}}/>
    </div>
    <style>{`
      body.lp-hovering #ea-ring{width:52px!important;height:52px!important;border-color:#C8FF00!important}
      body.lp-hovering #ea-dot{background:#C8FF00!important;transform:translate(-50%,-50%) scale(1.4)!important}
      @keyframes lp-blink{0%,100%{opacity:1}50%{opacity:.3}}
      @keyframes lp-barUp{from{transform:scaleY(0);opacity:0}to{transform:scaleY(1);opacity:1}}
      .ea-th-tip{position:relative;display:inline-flex;align-items:center;gap:4px}
      .ea-tip-box{position:absolute;bottom:calc(100% + 10px);left:50%;transform:translateX(-50%);background:rgba(10,10,10,.98);border:1px solid rgba(240,165,0,.25);color:rgba(247,245,240,.75);font-size:9px;letter-spacing:.03em;text-transform:none;padding:10px 14px;border-radius:3px;white-space:nowrap;z-index:100;pointer-events:none;opacity:0;visibility:hidden;transition:opacity .15s,visibility .15s;line-height:1.65;font-weight:400}
      .ea-th-tip:hover .ea-tip-box{opacity:1;visibility:visible}
      @media(max-width:768px){
        .ea-hero__inner{padding:88px 20px 40px!important}
        .ea-section-pad{padding-left:20px!important;padding-right:20px!important}
        .ea-fixtures-row{grid-template-columns:56px 1fr 1fr 80px!important}
        .ea-odds-col{display:none!important}
        .ea-filter-bar{padding-left:20px!important;padding-right:20px!important}
      }
    `}</style>

    <div style={{background:'#080808',minHeight:'100vh',color:'#F7F5F0'}}>

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section data-theme="dark" className="ea-hero">
        <div style={{position:'absolute',inset:0,background:`url('https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Vista_a%C3%A9rea_del_Estadio_Azteca_-_2026_-_02.jpg/1920px-Vista_a%C3%A9rea_del_Estadio_Azteca_-_2026_-_02.jpg') center 50%/cover no-repeat`,filter:'contrast(1.1) brightness(.52)',transform:imgReady?'scale(1)':'scale(1.06)',transition:'transform 12s ease'}} aria-hidden="true"/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(8,8,8,.06) 0%,transparent 30%,rgba(8,8,8,.85) 78%),linear-gradient(to right,rgba(8,8,8,.35),transparent 55%)'}} aria-hidden="true"/>
        <div style={{position:'absolute',left:56,top:0,bottom:0,width:2,background:'linear-gradient(to bottom,transparent 10%,#F0A500 30%,#F0A500 70%,transparent 100%)',opacity:.65}} aria-hidden="true"/>
        <div style={{position:'absolute',bottom:28,right:40,textAlign:'right',pointerEvents:'none'}}>
          <div style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:9,letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(247,245,240,.7)',marginBottom:3}}>Estadio Azteca · World Cup 2026 Opening Venue · Mexico City</div>
          <div className="ea-photo-credit" style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.06em',color:'rgba(247,245,240,.55)'}}>Photo: ProtoplasmaKid / CC BY 4.0</div>
        </div>

        <div className="ea-hero__inner">
          <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:20}}>
            <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:7.5,letterSpacing:'.18em',textTransform:'uppercase',background:'#F0A500',color:'#080808',padding:'5px 12px',borderRadius:2,display:'flex',alignItems:'center',gap:7}}>
              <span style={{width:5,height:5,borderRadius:'50%',background:'#080808',animation:'lp-blink 1.8s ease infinite'}}/>
              WC 2026 · Live
            </span>
            <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.12em',textTransform:'uppercase',color:'rgba(247,245,240,.5)'}}>
              {loading?'—':matches.length} fixtures · {liveCount} live odds · {valueCount} value edges
            </span>
          </div>
          <h1 style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:'clamp(72px,12vw,160px)',lineHeight:.84,margin:0}}>
            <span style={{fontFamily:"var(--font-serif,'Cormorant Garamond',serif)",fontStyle:'italic',fontWeight:300,fontSize:'.38em',color:'rgba(247,245,240,.6)',display:'block',marginBottom:'.06em'}}>World Cup 2026</span>
            Fixtures.
          </h1>
          <p style={{fontFamily:"var(--font-serif,'Cormorant Garamond',serif)",fontStyle:'italic',fontWeight:300,fontSize:'clamp(18px,1.6vw,24px)',lineHeight:1.6,color:'rgba(247,245,240,.92)',maxWidth:580,margin:'20px 0 0'}}>
            All 72 World Cup 2026 fixtures, Elo-rated and priced. Live odds from 20+ bookmakers, model probabilities and value edges updated before every kick-off.
          </p>
        </div>
      </section>

      {/* ── GROUP FILTER ────────────────────────────────────────────────────── */}
      <section data-theme="dark" className="ea-filter-bar ea-section-pad" style={{padding:'32px 56px 0',borderBottom:'1px solid rgba(247,245,240,.06)'}}>
        <div style={{display:'flex',gap:6,flexWrap:'wrap',paddingBottom:16}}>
          <button onClick={()=>{setGrp('ALL');window.scrollTo({top:0,behavior:'smooth'});}} style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.1em',textTransform:'uppercase',padding:'7px 16px',borderRadius:2,border:`1px solid ${grp==='ALL'?'rgba(240,165,0,.4)':'rgba(247,245,240,.08)'}`,background:grp==='ALL'?'rgba(240,165,0,.08)':'transparent',color:grp==='ALL'?'#F0A500':'rgba(247,245,240,.45)',cursor:'none',transition:'all .15s'}}>
            All Groups
          </button>
          {GROUPS.map(g=>(
            <button key={g} onClick={()=>{setGrp(grp===g?'ALL':g);window.scrollTo({top:0,behavior:'smooth'});}} style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.1em',padding:'7px 14px',borderRadius:2,border:`1px solid ${grp===g?'rgba(240,165,0,.4)':'rgba(247,245,240,.08)'}`,background:grp===g?'rgba(240,165,0,.08)':'transparent',color:grp===g?'#F0A500':'rgba(247,245,240,.45)',cursor:'none',transition:'all .15s'}}>
              {g}
            </button>
          ))}
        </div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingBottom:20,flexWrap:'wrap',gap:12}}>
          <div style={{display:'flex',alignItems:'center',gap:4}}>
            <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:7.5,letterSpacing:'.12em',textTransform:'uppercase',color:'rgba(247,245,240,.3)',marginRight:8}}>Sort</span>
            {[['date','Date'],['ev','Value %'],['group','Group']].map(([val,label])=>(
              <button key={val} onClick={()=>setSort(val)} style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.1em',textTransform:'uppercase',padding:'5px 12px',borderRadius:2,border:`1px solid ${sort===val?'rgba(240,165,0,.35)':'rgba(247,245,240,.08)'}`,background:sort===val?'rgba(240,165,0,.07)':'transparent',color:sort===val?'#F0A500':'rgba(247,245,240,.4)',cursor:'none',transition:'all .15s'}}>
                {label}
              </button>
            ))}
          </div>
          <div style={{display:'flex',alignItems:'center',gap:16}}>
            <div style={{display:'flex',alignItems:'center',gap:6}}>
              <div style={{width:3,height:14,background:'#C8FF00',borderRadius:1}}/>
              <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:7.5,letterSpacing:'.08em',color:'rgba(247,245,240,.35)'}}>Value edge detected</span>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:6}}>
              <div style={{width:3,height:14,background:'rgba(247,245,240,.1)',borderRadius:1}}/>
              <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:7.5,letterSpacing:'.08em',color:'rgba(247,245,240,.35)'}}>No edge</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FIXTURES TABLE ──────────────────────────────────────────────────── */}
      <section data-theme="dark" className="ea-section-pad" style={{padding:'0 56px 80px'}}>
        {grp !== 'ALL' && (
          <div style={{paddingTop:40,paddingBottom:4}}>
            <h2 style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:'clamp(48px,7vw,88px)',lineHeight:.88,color:'#F7F5F0',margin:0,letterSpacing:'.04em'}}>Group {grp}</h2>
            <p style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:9,letterSpacing:'.08em',color:'rgba(247,245,240,.3)',margin:'10px 0 0'}}>{filtered.length} fixture{filtered.length!==1?'s':''}</p>
          </div>
        )}

        <div className="ea-fixtures-row" style={{display:'grid',gridTemplateColumns:gridCols,gap:8,padding:'10px 12px',borderBottom:'1px solid rgba(247,245,240,.08)',marginTop:24,fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(247,245,240,.3)'}}>
          <span>Date</span><span>Home</span><span>Away</span>
          {grp==='ALL'&&<span className="ea-odds-col">Grp</span>}
          <span className="ea-odds-col" style={{textAlign:'center'}}>Home</span>
          <span className="ea-odds-col" style={{textAlign:'center'}}>Draw</span>
          <span className="ea-odds-col" style={{textAlign:'center'}}>Away</span>
          <span style={{textAlign:'center'}}>Model</span>
          <span className="ea-odds-col ea-th-tip" style={{textAlign:'center',justifyContent:'center'}}>
            Value %
            <span className="ea-tip-box">Expected Value — positive % means the odds<br/>exceed our model's fair price. Higher = more edge.</span>
          </span>
        </div>

        {loading ? [...Array(8)].map((_,i)=>(
          <div key={i} style={{height:50,background:'rgba(247,245,240,.03)',borderRadius:2,margin:'2px 0',animation:'lp-barUp .8s ease both',animationDelay:`${i*.06}s`}}/>
        )) : filtered.length===0 ? (
          <div style={{padding:'56px 12px',textAlign:'center',fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:11,letterSpacing:'.1em',color:'rgba(247,245,240,.25)'}}>
            No fixtures available for Group {grp} yet.
          </div>
        ) : filtered.map((m,i)=>{
          const bestEv=Math.max(m.evH,m.evD,m.evA);
          const hasVal=bestEv>3;
          return (
            <div key={`${m.home}-${m.away}`} className="ea-fixtures-row" style={{display:'grid',gridTemplateColumns:gridCols,gap:8,padding:'13px 12px',borderBottom:'1px solid rgba(247,245,240,.04)',borderLeft:`2px solid ${hasVal?ec(bestEv):'transparent'}`,transition:'background .15s',cursor:'none'}}
              onClick={()=>window.location.href='/odds'}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(200,255,0,.025)'}
              onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
              <div>
                <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:11,color:'rgba(247,245,240,.4)'}}>{fmtDate(m.date)}</span>
                {m.oddsSource==='live'&&<span style={{display:'block',fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:7,color:'#C8FF00',letterSpacing:'.1em',marginTop:2}}>LIVE</span>}
              </div>
              <span style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:15,letterSpacing:'.04em',color:m.prediction===m.home?'#F7F5F0':'rgba(247,245,240,.5)'}}>{m.home}</span>
              <span style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:15,letterSpacing:'.04em',color:m.prediction===m.away?'#F7F5F0':'rgba(247,245,240,.5)'}}>{m.away}</span>
              {grp==='ALL'&&<span className="ea-odds-col" style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:11,color:'rgba(247,245,240,.3)',textAlign:'center'}}>{m.group}</span>}
              {[{o:m.bestH,e:m.evH},{o:m.bestD,e:m.evD},{o:m.bestA,e:m.evA}].map((c,ci)=>(
                <div key={ci} className="ea-odds-col" style={{textAlign:'center'}}>
                  <span style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:18,color:c.e>3?'#C8FF00':'rgba(247,245,240,.7)'}}>{c.o?.toFixed(2)||'—'}</span>
                  <div style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,color:'rgba(247,245,240,.3)',marginTop:1}}>{ci===0?m.prob_home:ci===1?m.prob_draw:m.prob_away}%</div>
                </div>
              ))}
              <div style={{textAlign:'center'}}>
                <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:9,padding:'3px 8px',borderRadius:2,background:m.prediction==='Draw'?'rgba(74,127,212,.1)':'rgba(200,255,0,.08)',border:m.prediction==='Draw'?'1px solid rgba(74,127,212,.25)':'1px solid rgba(200,255,0,.2)',color:m.prediction==='Draw'?'#4A7FD4':'#C8FF00',display:'inline-block'}}>
                  {m.prediction===m.home?'HOME':m.prediction===m.away?'AWAY':'DRAW'}
                </span>
                <div style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:15,marginTop:3,color:m.confidence>65?'#C8FF00':m.confidence>50?'#4A7FD4':'rgba(247,245,240,.4)'}}>{m.confidence}%</div>
              </div>
              <div className="ea-odds-col" style={{textAlign:'center'}}>
                {hasVal
                  ?<span style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:16,color:ec(bestEv),padding:'3px 8px',background:ebg(bestEv),border:`1px solid ${ebr(bestEv)}`,borderRadius:2,display:'inline-block'}}>+{bestEv.toFixed(1)}%</span>
                  :<span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:9,color:'rgba(247,245,240,.18)'}}>—</span>}
              </div>
            </div>
          );
        })}
      </section>
    </div>

    {scrolled && (
      <button onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}
        style={{position:'fixed',bottom:32,right:32,zIndex:999,fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.12em',textTransform:'uppercase',padding:'10px 16px',background:'rgba(8,8,8,.92)',border:'1px solid rgba(247,245,240,.15)',color:'rgba(247,245,240,.55)',cursor:'none',borderRadius:2,backdropFilter:'blur(8px)',transition:'all .2s'}}
        onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(240,165,0,.5)';e.currentTarget.style.color='#F0A500';}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(247,245,240,.15)';e.currentTarget.style.color='rgba(247,245,240,.55)';}}
        aria-label="Back to top">↑ Top</button>
    )}
  </>);
}
