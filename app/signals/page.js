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

export default function FixturesPage() {
  useCursor();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [grp,     setGrp]     = useState('ALL');
  const [imgReady,setImgReady]= useState(false);

  useEffect(()=>{const t=setTimeout(()=>setImgReady(true),80);return()=>clearTimeout(t);},[]);
  useEffect(()=>{
    fetch('/api/wc2026').then(r=>r.json()).then(setData).catch(()=>{}).finally(()=>setLoading(false));
  },[]);

  const matches = data?.matches || [];
  const filtered = (grp==='ALL' ? matches : matches.filter(m=>m.group===grp))
    .sort((a,b)=>a.date.localeCompare(b.date));
  const liveCount  = matches.filter(m=>m.oddsSource==='live').length;
  const valueCount = matches.filter(m=>m.bestEv>3).length;

  return (<>
    <div id="ea-cur" style={{position:'fixed',zIndex:9998,pointerEvents:'none',top:0,left:0}} aria-hidden="true">
      <div id="ea-ring" style={{width:36,height:36,border:'1.5px solid rgba(247,245,240,.55)',borderRadius:'50%',position:'absolute',transform:'translate(-50%,-50%)',transition:'width .2s,height .2s,border-color .2s'}}/>
      <div id="ea-dot"  style={{width:6,height:6,background:'#F7F5F0',borderRadius:'50%',position:'absolute',transform:'translate(-50%,-50%)',transition:'transform .08s,background .2s'}}/>
    </div>
    <style>{`body.lp-hovering #ea-ring{width:52px!important;height:52px!important;border-color:#C8FF00!important}body.lp-hovering #ea-dot{background:#C8FF00!important;transform:translate(-50%,-50%) scale(1.4)!important}`}</style>

    <div style={{background:'#080808',minHeight:'100vh',color:'#F7F5F0'}}>

      {/* Hero */}
      <section data-theme="dark" className="ea-hero">
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
            </span>
          </div>
          <h1 style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:'clamp(72px,12vw,160px)',lineHeight:.84,margin:0}}>
            <span style={{fontFamily:"var(--font-serif,'Cormorant Garamond',serif)",fontStyle:'italic',fontWeight:300,fontSize:'.38em',color:'rgba(247,245,240,.6)',display:'block',marginBottom:'.06em'}}>Group stage</span>
            Fixtures.
          </h1>
        </div>
      </section>

      {/* Group filter */}
      <section data-theme="dark" style={{padding:'32px 56px 0',borderBottom:'1px solid rgba(247,245,240,.06)'}}>
        <div style={{display:'flex',gap:6,flexWrap:'wrap',paddingBottom:24}}>
          <button onClick={()=>setGrp('ALL')} style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.1em',textTransform:'uppercase',padding:'7px 16px',borderRadius:2,border:`1px solid ${grp==='ALL'?'rgba(200,255,0,.4)':'rgba(247,245,240,.08)'}`,background:grp==='ALL'?'rgba(200,255,0,.08)':'transparent',color:grp==='ALL'?'#C8FF00':'rgba(247,245,240,.45)',cursor:'none',transition:'all .15s'}}>
            All Groups
          </button>
          {GROUPS.map(g=>(
            <button key={g} onClick={()=>setGrp(grp===g?'ALL':g)} style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.1em',padding:'7px 14px',borderRadius:2,border:`1px solid ${grp===g?'rgba(200,255,0,.4)':'rgba(247,245,240,.08)'}`,background:grp===g?'rgba(200,255,0,.08)':'transparent',color:grp===g?'#C8FF00':'rgba(247,245,240,.45)',cursor:'none',transition:'all .15s'}}>
              {g}
            </button>
          ))}
        </div>
      </section>

      {/* Table */}
      <section data-theme="dark" style={{padding:'0 56px 80px'}}>
        <div style={{display:'grid',gridTemplateColumns:'80px 1fr 1fr 60px 72px 72px 72px 100px 88px',gap:8,padding:'10px 12px',borderBottom:'1px solid rgba(247,245,240,.08)',marginTop:24,fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(247,245,240,.3)'}}>
          <span>Date</span><span>Home</span><span>Away</span><span>Grp</span>
          <span style={{textAlign:'center'}}>Home</span><span style={{textAlign:'center'}}>Draw</span><span style={{textAlign:'center'}}>Away</span>
          <span style={{textAlign:'center'}}>Model</span><span style={{textAlign:'center'}}>EV Edge</span>
        </div>

        {loading ? [...Array(8)].map((_,i)=>(
          <div key={i} style={{height:50,background:'rgba(247,245,240,.03)',borderRadius:2,margin:'2px 0'}}/>
        )) : filtered.map((m,i)=>{
          const bestEv=Math.max(m.evH,m.evD,m.evA);
          const hasVal=bestEv>3;
          return (
            <div key={i} style={{
              display:'grid',gridTemplateColumns:'80px 1fr 1fr 60px 72px 72px 72px 100px 88px',gap:8,
              padding:'13px 12px',
              borderBottom:'1px solid rgba(247,245,240,.04)',
              borderLeft:`2px solid ${hasVal?ec(bestEv):'transparent'}`,
              transition:'background .15s',cursor:'none',
            }}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(200,255,0,.025)'}
              onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
              <div>
                <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:9,color:'rgba(247,245,240,.4)'}}>{fmtDate(m.date)}</span>
                {m.oddsSource==='live'&&<span style={{display:'block',fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:7,color:'#C8FF00',letterSpacing:'.1em',marginTop:2}}>LIVE</span>}
              </div>
              <span style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:15,letterSpacing:'.04em',color:m.prediction===m.home?'#F7F5F0':'rgba(247,245,240,.5)'}}>{m.home}</span>
              <span style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:15,letterSpacing:'.04em',color:m.prediction===m.away?'#F7F5F0':'rgba(247,245,240,.5)'}}>{m.away}</span>
              <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:9,color:'rgba(247,245,240,.3)',textAlign:'center'}}>{m.group}</span>
              {[{o:m.bestH,e:m.evH},{o:m.bestD,e:m.evD},{o:m.bestA,e:m.evA}].map((c,ci)=>(
                <div key={ci} style={{textAlign:'center'}}>
                  <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:13,fontWeight:500,color:c.e>3?'#C8FF00':'rgba(247,245,240,.7)'}}>{c.o?.toFixed(2)||'—'}</span>
                  <div style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,color:'rgba(247,245,240,.3)',marginTop:1}}>{ci===0?m.prob_home:ci===1?m.prob_draw:m.prob_away}%</div>
                </div>
              ))}
              <div style={{textAlign:'center'}}>
                <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:9,padding:'3px 8px',borderRadius:2,background:m.prediction==='Draw'?'rgba(74,127,212,.1)':'rgba(200,255,0,.08)',border:m.prediction==='Draw'?'1px solid rgba(74,127,212,.25)':'1px solid rgba(200,255,0,.2)',color:m.prediction==='Draw'?'#4A7FD4':'#C8FF00',display:'inline-block'}}>
                  {m.prediction===m.home?'HOME':m.prediction===m.away?'AWAY':'DRAW'}
                </span>
                <div style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,marginTop:3,color:m.confidence>65?'#C8FF00':m.confidence>50?'#4A7FD4':'rgba(247,245,240,.4)'}}>{m.confidence}%</div>
              </div>
              <div style={{textAlign:'center'}}>
                {hasVal?<span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:11,fontWeight:500,color:ec(bestEv),padding:'3px 8px',background:ebg(bestEv),border:`1px solid ${ebr(bestEv)}`,borderRadius:2,display:'inline-block'}}>+{bestEv.toFixed(1)}%</span>
                :<span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:9,color:'rgba(247,245,240,.18)'}}>—</span>}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  </>);
}