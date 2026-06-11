"use client";
import { useState, useEffect } from "react";

function useCursor() {
  useEffect(() => {
    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    if (isTouch) return;
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

const CONF_COLOR={UEFA:'#4A7FD4',CONMEBOL:'#C8FF00',CONCACAF:'#F0A500',CAF:'#E53E3E',AFC:'#9B59B6',OFC:'#8A9AAC'};

export default function RankingsPage() {
  useCursor();
  const [data,setData]=useState(null);
  const [loading,setLoading]=useState(true);
  const [conf,setConf]=useState('ALL');
  const [sortBy,setSortBy]=useState('elo');
  const [imgReady,setImgReady]=useState(false);

  useEffect(()=>{const t=setTimeout(()=>setImgReady(true),80);return()=>clearTimeout(t);},[]);
  useEffect(()=>{
    fetch('/api/wc2026').then(r=>r.json()).then(setData).catch(()=>{}).finally(()=>setLoading(false));
  },[]);

  const teams=(data?.teamStats||[])
    .filter(t=>conf==='ALL'||t.conf===conf)
    .sort((a,b)=>sortBy==='elo'?b.elo-a.elo:sortBy==='winProb'?b.win_prob_pct-a.win_prob_pct:b.avg_gf-a.avg_gf);
  const maxElo=data?.teamStats?.[0]?.elo||2200;
  // Static win probabilities — simulation coming soon
  const STATIC_PROBS = [{"team": "Spain", "win_pct": 16.0}, {"team": "France", "win_pct": 12.5}, {"team": "England", "win_pct": 12.0}, {"team": "Argentina", "win_pct": 9.0}, {"team": "Brazil", "win_pct": 8.5}, {"team": "Portugal", "win_pct": 6.5}, {"team": "Germany", "win_pct": 5.5}, {"team": "Netherlands", "win_pct": 3.5}, {"team": "Norway", "win_pct": 3.0}, {"team": "Belgium", "win_pct": 2.0}, {"team": "USA", "win_pct": 1.7}, {"team": "Colombia", "win_pct": 1.6}, {"team": "Japan", "win_pct": 1.6}, {"team": "Morocco", "win_pct": 1.5}, {"team": "Uruguay", "win_pct": 1.4}, {"team": "Croatia", "win_pct": 1.2}];
  const simTop = STATIC_PROBS.slice(0, 8);

  return (<>
    <div id="ea-cur" style={{position:'fixed',zIndex:9998,pointerEvents:'none',top:0,left:0}} aria-hidden="true">
      <div id="ea-ring" style={{width:36,height:36,border:'1.5px solid rgba(247,245,240,.55)',borderRadius:'50%',position:'absolute',transform:'translate(-50%,-50%)',transition:'width .2s,height .2s,border-color .2s'}}/>
      <div id="ea-dot"  style={{width:6,height:6,background:'#F7F5F0',borderRadius:'50%',position:'absolute',transform:'translate(-50%,-50%)',transition:'transform .08s,background .2s'}}/>
    </div>
    <style>{`body.lp-hovering #ea-ring{width:52px!important;height:52px!important;border-color:#C8FF00!important}body.lp-hovering #ea-dot{background:#C8FF00!important;transform:translate(-50%,-50%) scale(1.4)!important}`}</style>

    <div style={{background:'#080808',minHeight:'100vh',color:'#F7F5F0'}}>

      {/* Hero */}
      <section data-theme="dark" style={{position:'relative',minHeight:'52vh',display:'flex',flexDirection:'column',justifyContent:'flex-end',padding:'0 56px',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,background:`url('https://images.unsplash.com/photo-1551854716-b8b8a413ddf4?w=1920&q=85&fit=crop') center 35%/cover`,filter:'grayscale(100%) brightness(.18)',transform:imgReady?'scale(1)':'scale(1.05)',transition:'transform 12s ease'}} aria-hidden="true"/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent 25%,rgba(8,8,8,.95) 80%)'}} aria-hidden="true"/>
        <div style={{position:'absolute',left:56,top:0,bottom:0,width:2,background:'linear-gradient(to bottom,transparent 10%,#C8FF00 35%,#C8FF00 70%,transparent 100%)',opacity:.5}} aria-hidden="true"/>
        <div style={{position:'relative',zIndex:3,paddingBottom:52}}>
          <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:20}}>
            <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:7.5,letterSpacing:'.18em',textTransform:'uppercase',background:'#C8FF00',color:'#080808',padding:'5px 12px',borderRadius:2}}>Rankings</span>
            <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.12em',textTransform:'uppercase',color:'rgba(247,245,240,.5)'}}>Elo · StatsBomb 314 matches · 10k sims</span>
          </div>
          <h1 style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:'clamp(72px,12vw,160px)',lineHeight:.84,margin:0}}>
            <span style={{fontFamily:"var(--font-serif,'Cormorant Garamond',serif)",fontStyle:'italic',fontWeight:300,fontSize:'.38em',color:'rgba(247,245,240,.6)',display:'block',marginBottom:'.06em'}}>48 teams</span>
            Ranked.
          </h1>
          {/* Top 8 from sims */}
          {!loading&&simTop.length>0&&(
            <div style={{display:'flex',gap:6,marginTop:28,flexWrap:'wrap'}}>
              {simTop.map((s,i)=>(
                <div key={s.team} style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.08em',textTransform:'uppercase',padding:'4px 12px',borderRadius:2,border:`1px solid ${i===0?'#C8FF00':i<3?'rgba(200,255,0,.3)':'rgba(247,245,240,.08)'}`,background:i===0?'rgba(200,255,0,.08)':'rgba(247,245,240,.02)',color:i===0?'#C8FF00':i<3?'rgba(200,255,0,.7)':'rgba(247,245,240,.5)'}}>
                  {s.team} {s.win_pct}%
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Controls */}
      <section data-theme="dark" style={{padding:'24px 56px',borderBottom:'1px solid rgba(247,245,240,.06)',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
        <div style={{display:'flex',gap:4}}>
          {['ALL','UEFA','CONMEBOL','CONCACAF','CAF','AFC','OFC'].map(c=>(
            <button key={c} onClick={()=>setConf(c)} style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.1em',textTransform:'uppercase',padding:'6px 12px',borderRadius:2,border:`1px solid ${conf===c?'rgba(200,255,0,.4)':'rgba(247,245,240,.08)'}`,background:conf===c?'rgba(200,255,0,.08)':'transparent',color:conf===c?'#C8FF00':'rgba(247,245,240,.4)',cursor:'none',transition:'all .15s'}}>{c}</button>
          ))}
        </div>
        <div style={{display:'flex',border:'1px solid rgba(247,245,240,.1)',borderRadius:2,overflow:'hidden'}}>
          {[['elo','Elo'],['winProb','Win %'],['avgGf','Avg GF']].map(([v,l])=>(
            <button key={v} onClick={()=>setSortBy(v)} style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.1em',textTransform:'uppercase',padding:'7px 14px',border:'none',borderRight:'1px solid rgba(247,245,240,.1)',background:sortBy===v?'#C8FF00':'rgba(247,245,240,.04)',color:sortBy===v?'#080808':'rgba(247,245,240,.5)',cursor:'none',transition:'all .15s'}}>{l}</button>
          ))}
        </div>
      </section>

      {/* Table */}
      <section data-theme="dark" style={{padding:'0 56px 80px'}}>
        <div style={{display:'grid',gridTemplateColumns:'32px 1fr 64px 80px 60px 60px 60px 110px',gap:8,padding:'10px 0',marginTop:24,fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(247,245,240,.55)',borderBottom:'1px solid rgba(247,245,240,.08)'}}>
          <span>#</span><span>Team</span><span>Conf</span><span>Elo</span><span>W%</span><span>GF</span><span>GA</span><span>Win Prob</span>
        </div>
        <div style={{overflowX:'auto',WebkitOverflowScrolling:'touch'}}><div style={{minWidth:600}}>
        {loading?[...Array(12)].map((_,i)=><div key={i} style={{height:44,background:'rgba(247,245,240,.03)',borderRadius:2,margin:'2px 0'}}/>)
        :teams.map((t,i)=>{
          const pct=Math.round(((t.elo-1400)/(maxElo-1400))*100);
          return(
            <div key={t.team} style={{display:'grid',gridTemplateColumns:'32px 1fr 64px 80px 60px 60px 60px 110px',gap:8,padding:'12px 0',borderBottom:'1px solid rgba(247,245,240,.04)',transition:'background .15s',cursor:'none'}}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(200,255,0,.02)'}
              onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
              <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:10,color:'rgba(247,245,240,.25)'}}>{i+1}</span>
              <span style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:16,letterSpacing:'.04em',color:i<4?'#C8FF00':i<12?'#F7F5F0':'rgba(247,245,240,.6)'}}>{t.team}</span>
              <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,color:CONF_COLOR[t.conf]||'rgba(247,245,240,.4)'}}>{t.conf}</span>
              <div>
                <span style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:18,color:i<4?'#C8FF00':'#F7F5F0'}}>{t.elo}</span>
                <div style={{width:'100%',height:2,background:'rgba(247,245,240,.06)',borderRadius:1,marginTop:3,overflow:'hidden'}}>
                  <div style={{height:'100%',background:i<4?'#C8FF00':i<12?'rgba(200,255,0,.4)':'rgba(74,127,212,.35)',width:`${pct}%`,borderRadius:1}}/>
                </div>
              </div>
              <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:10,color:'rgba(247,245,240,.5)'}}>{Math.round(t.win_rate*100)}%</span>
              <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:10,color:'rgba(247,245,240,.5)'}}>{t.avg_gf}</span>
              <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:10,color:'rgba(247,245,240,.5)'}}>{t.avg_ga}</span>
              <div style={{display:'flex',alignItems:'center',gap:6}}>
                <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:11,fontWeight:500,color:i<4?'#C8FF00':i<12?'rgba(200,255,0,.7)':'rgba(247,245,240,.4)'}}>{t.win_prob_pct}%</span>
              </div>
            </div>
          );
        })}
        </div></div>
      </section>
    </div>
  </>);
}
