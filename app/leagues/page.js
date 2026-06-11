"use client";
import { useState, useEffect } from "react";

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

const CONF_COLOR={UEFA:'#4A7FD4',CONMEBOL:'#C8FF00',CONCACAF:'#F0A500',CAF:'#E53E3E',AFC:'#9B59B6',OFC:'#8A9AAC'};

export default function RankingsPage() {
  useCursor();
  const [data,     setData]     = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [conf,     setConf]     = useState('ALL');
  const [sortBy,   setSortBy]   = useState('elo');
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

  const allTeams = data?.teamStats || [];
  const maxElo   = allTeams.length ? Math.max(...allTeams.map(t=>t.elo||0)) : 2200;
  const teams    = allTeams
    .filter(t=>conf==='ALL'||t.conf===conf)
    .sort((a,b)=>sortBy==='elo'?b.elo-a.elo:sortBy==='winProb'?b.win_prob_pct-a.win_prob_pct:b.avg_gf-a.avg_gf);
  const simTop   = (data?.simulation?.results||[]).slice(0,8);

  return (<>
    <div id="ea-cur" style={{position:'fixed',zIndex:9998,pointerEvents:'none',top:0,left:0}} aria-hidden="true">
      <div id="ea-ring" style={{width:36,height:36,border:'1.5px solid rgba(247,245,240,.55)',borderRadius:'50%',position:'absolute',transform:'translate(-50%,-50%)',transition:'width .2s,height .2s,border-color .2s'}}/>
      <div id="ea-dot"  style={{width:6,height:6,background:'#F7F5F0',borderRadius:'50%',position:'absolute',transform:'translate(-50%,-50%)',transition:'transform .08s,background .2s'}}/>
    </div>
    <style>{`
      body.lp-hovering #ea-ring{width:52px!important;height:52px!important;border-color:#C8FF00!important}
      body.lp-hovering #ea-dot{background:#C8FF00!important;transform:translate(-50%,-50%) scale(1.4)!important}
      @keyframes lp-blink{0%,100%{opacity:1}50%{opacity:.3}}
      @keyframes lp-barUp{from{transform:scaleY(0);opacity:0}to{transform:scaleY(1);opacity:1}}
      @media(max-width:768px){
        .ea-hero__inner{padding:88px 20px 40px!important}
        .ea-rnk-section{padding-left:20px!important;padding-right:20px!important}
        .ea-rnk-controls{padding-left:20px!important;padding-right:20px!important;flex-direction:column!important;align-items:flex-start!important}
        .ea-rnk-row{grid-template-columns:36px 1fr 90px 120px!important}
        .ea-rnk-col-hide{display:none!important}
      }
    `}</style>

    <div style={{background:'#080808',minHeight:'100vh',color:'#F7F5F0'}}>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section data-theme="dark" className="ea-hero">
        <div style={{position:'absolute',inset:0,background:`url('https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Arlington_June_2020_4_(AT%26T_Stadium).jpg/1920px-Arlington_June_2020_4_(AT%26T_Stadium).jpg') center 50%/cover no-repeat`,filter:'contrast(1.1) brightness(.52)',transform:imgReady?'scale(1)':'scale(1.06)',transition:'transform 12s ease'}} aria-hidden="true"/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(8,8,8,.06) 0%,transparent 30%,rgba(8,8,8,.85) 78%),linear-gradient(to right,rgba(8,8,8,.35),transparent 55%)'}} aria-hidden="true"/>
        <div style={{position:'absolute',left:56,top:0,bottom:0,width:2,background:'linear-gradient(to bottom,transparent 10%,#F0A500 30%,#F0A500 70%,transparent 100%)',opacity:.65}} aria-hidden="true"/>
        <div style={{position:'absolute',bottom:28,right:40,textAlign:'right',pointerEvents:'none'}}>
          <div style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:9,letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(247,245,240,.7)',marginBottom:3}}>AT&T Stadium · World Cup 2026 Semi-Final Venue · Arlington, Texas</div>
          <div style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.06em',color:'rgba(247,245,240,.35)'}}>Photo: Michael Barera / CC BY-SA 4.0</div>
        </div>

        <div className="ea-hero__inner">
          <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:20}}>
            <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:7.5,letterSpacing:'.18em',textTransform:'uppercase',background:'#F0A500',color:'#080808',padding:'5px 12px',borderRadius:2,display:'flex',alignItems:'center',gap:7}}>
              <span style={{width:5,height:5,borderRadius:'50%',background:'#080808',animation:'lp-blink 1.8s ease infinite'}}/>
              WC 2026 · Rankings
            </span>
            <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.12em',textTransform:'uppercase',color:'rgba(247,245,240,.5)'}}>
              {loading?'—':allTeams.length} nations · Elo · 10,000 simulations
            </span>
          </div>
          <h1 style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:'clamp(72px,12vw,160px)',lineHeight:.84,margin:0}}>
            <span style={{fontFamily:"var(--font-serif,'Cormorant Garamond',serif)",fontStyle:'italic',fontWeight:300,fontSize:'.38em',color:'rgba(247,245,240,.6)',display:'block',marginBottom:'.06em'}}>48 nations</span>
            Ranked.
          </h1>
          <p style={{fontFamily:"var(--font-serif,'Cormorant Garamond',serif)",fontStyle:'italic',fontWeight:300,fontSize:'clamp(18px,1.6vw,24px)',lineHeight:1.6,color:'rgba(247,245,240,.92)',maxWidth:580,margin:'20px 0 0'}}>
            Elo ratings and tournament win probabilities for every World Cup 2026 nation, refined through 10,000 simulations. From the favourites to the dark horses, every team ranked by the model.
          </p>
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

      {/* ── CONTROLS ─────────────────────────────────────────────────────────── */}
      <section data-theme="dark" className="ea-rnk-controls" style={{padding:'24px 56px',borderBottom:'1px solid rgba(247,245,240,.06)',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
        <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
          {['ALL','UEFA','CONMEBOL','CONCACAF','CAF','AFC','OFC'].map(c=>(
            <button key={c} onClick={()=>setConf(c)} style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.1em',textTransform:'uppercase',padding:'6px 12px',borderRadius:2,border:`1px solid ${conf===c?'rgba(240,165,0,.4)':'rgba(247,245,240,.08)'}`,background:conf===c?'rgba(240,165,0,.08)':'transparent',color:conf===c?'#F0A500':'rgba(247,245,240,.4)',cursor:'none',transition:'all .15s'}}>{c}</button>
          ))}
        </div>
        <div style={{display:'flex',border:'1px solid rgba(247,245,240,.1)',borderRadius:2,overflow:'hidden'}}>
          {[['elo','Elo'],['winProb','Win %'],['avgGf','Avg GF']].map(([v,l],vi)=>(
            <button key={v} onClick={()=>setSortBy(v)} style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.1em',textTransform:'uppercase',padding:'7px 14px',border:'none',borderRight:vi<2?'1px solid rgba(247,245,240,.1)':'none',background:sortBy===v?'rgba(240,165,0,.1)':'rgba(247,245,240,.04)',color:sortBy===v?'#F0A500':'rgba(247,245,240,.5)',cursor:'none',transition:'all .15s'}}>{l}</button>
          ))}
        </div>
      </section>

      {/* ── TABLE ────────────────────────────────────────────────────────────── */}
      <section data-theme="dark" className="ea-rnk-section" style={{padding:'0 56px 80px'}}>
        <div className="ea-rnk-row" style={{display:'grid',gridTemplateColumns:'40px 1fr 80px 110px 88px 88px 88px 140px',gap:20,padding:'10px 20px',marginTop:24,fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(247,245,240,.3)',borderBottom:'1px solid rgba(247,245,240,.08)'}}>
          <span style={{textAlign:'right'}}>#</span><span>Team</span>
          <span className="ea-rnk-col-hide">Conf</span>
          <span>Elo</span>
          <span className="ea-rnk-col-hide" style={{textAlign:'right'}}>W%</span>
          <span className="ea-rnk-col-hide" style={{textAlign:'right'}}>GF</span>
          <span className="ea-rnk-col-hide" style={{textAlign:'right'}}>GA</span>
          <span style={{textAlign:'right'}}>Win Prob</span>
        </div>

        {loading
          ? [...Array(12)].map((_,i)=>(
              <div key={i} style={{height:48,background:'rgba(247,245,240,.03)',borderRadius:2,margin:'2px 0',animation:'lp-barUp .8s ease both',animationDelay:`${i*.05}s`}}/>
            ))
          : teams.map((t,i)=>{
              const pct=Math.min(100,Math.round(((t.elo-1400)/(maxElo-1400))*100));
              return (
                <div key={t.team} className="ea-rnk-row" style={{display:'grid',gridTemplateColumns:'40px 1fr 80px 110px 88px 88px 88px 140px',gap:20,padding:'14px 20px',borderBottom:'1px solid rgba(247,245,240,.04)',transition:'background .15s',cursor:'none'}}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(200,255,0,.02)'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <span style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:16,color:'rgba(247,245,240,.45)',textAlign:'right'}}>{i+1}</span>
                  <span style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:18,letterSpacing:'.04em',color:i<4?'#C8FF00':i<12?'#F7F5F0':'rgba(247,245,240,.8)'}}>{t.team}</span>
                  <span className="ea-rnk-col-hide" style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:10,color:CONF_COLOR[t.conf]||'rgba(247,245,240,.6)'}}>{t.conf}</span>
                  <div>
                    <span style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:22,color:i<4?'#C8FF00':'#F7F5F0'}}>{t.elo}</span>
                    <div style={{width:'100%',height:2,background:'rgba(247,245,240,.06)',borderRadius:1,marginTop:3,overflow:'hidden'}}>
                      <div style={{height:'100%',background:i<4?'#C8FF00':i<12?'rgba(200,255,0,.4)':'rgba(74,127,212,.35)',width:`${pct}%`,borderRadius:1}}/>
                    </div>
                  </div>
                  <span className="ea-rnk-col-hide" style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:18,color:'rgba(247,245,240,.75)',textAlign:'right'}}>{Math.round(t.win_rate*100)}%</span>
                  <span className="ea-rnk-col-hide" style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:18,color:'rgba(247,245,240,.75)',textAlign:'right'}}>{t.avg_gf}</span>
                  <span className="ea-rnk-col-hide" style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:18,color:'rgba(247,245,240,.75)',textAlign:'right'}}>{t.avg_ga}</span>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'flex-end'}}>
                    <span style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:22,color:i<4?'#C8FF00':i<12?'rgba(200,255,0,.85)':'rgba(247,245,240,.65)'}}>{t.win_prob_pct}%</span>
                  </div>
                </div>
              );
            })}
        <div style={{marginTop:40,fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:9,letterSpacing:'.08em',color:'rgba(247,245,240,.38)'}}>
          Match data: <a href="https://github.com/statsbomb/open-data" target="_blank" rel="noopener noreferrer" style={{color:'rgba(247,245,240,.55)',textDecoration:'underline',textDecorationColor:'rgba(247,245,240,.25)'}}>StatsBomb Open Data</a>
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
  </>);
}