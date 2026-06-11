"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

function fmtDate(d) {
  if (!d) return '';
  return new Date(d+'T12:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short'});
}
const ec  = e => e>=8?'#C8FF00':e>=3?'rgba(200,255,0,.8)':'rgba(247,245,240,.55)';
const ebr = e => e>=8?'rgba(200,255,0,.28)':e>=3?'rgba(200,255,0,.14)':'rgba(247,245,240,.07)';

export default function HomePage() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgReady,setImgReady]= useState(false);
  const [activeGrp,setActiveGrp]= useState(null);

  useEffect(()=>{const t=setTimeout(()=>setImgReady(true),80);return()=>clearTimeout(t);},[]);

  useEffect(()=>{
    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    if (isTouch) return;
    document.body.style.cursor='none';
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

  useEffect(()=>{
    fetch('/api/wc2026').then(r=>r.json()).then(setData).catch(()=>{}).finally(()=>setLoading(false));
  },[]);

  const matches   = data?.matches || [];
  const teamStats = data?.teamStats || [];
  // Static win probabilities — simulation coming soon
  const STATIC_PROBS = [{"team": "Spain", "win_pct": 16.0}, {"team": "France", "win_pct": 12.5}, {"team": "England", "win_pct": 12.0}, {"team": "Argentina", "win_pct": 9.0}, {"team": "Brazil", "win_pct": 8.5}, {"team": "Portugal", "win_pct": 6.5}, {"team": "Germany", "win_pct": 5.5}, {"team": "Netherlands", "win_pct": 3.5}, {"team": "Norway", "win_pct": 3.0}, {"team": "Belgium", "win_pct": 2.0}, {"team": "USA", "win_pct": 1.7}, {"team": "Colombia", "win_pct": 1.6}, {"team": "Japan", "win_pct": 1.6}, {"team": "Morocco", "win_pct": 1.5}, {"team": "Uruguay", "win_pct": 1.4}, {"team": "Croatia", "win_pct": 1.2}];
  const simTop = STATIC_PROBS.slice(0, 6);
  const valueMatches = [...matches].sort((a,b)=>b.bestEv-a.bestEv).filter(m=>m.bestEv>0).slice(0,6);
  const upcoming  = [...matches].sort((a,b)=>a.date.localeCompare(b.date)).slice(0,8);
  const groups    = ['A','B','C','D','E','F','G','H','I','J','K','L'];

  const GROUPS_MAP = {
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
  const tmMap = Object.fromEntries(teamStats.map(t=>[t.team,t]));

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
    `}</style>

    {/* ── HERO ──────────────────────────────────────────────────────────────── */}
    <section data-theme="dark" style={{position:'relative',minHeight:'100vh',display:'flex',flexDirection:'column',justifyContent:'flex-end',padding:'0 56px',overflow:'hidden'}}>
      <div style={{position:'absolute',inset:0,background:`url('https://images.unsplash.com/photo-1593766788306-28561086694e?w=1920&q=85&fit=crop') center 35%/cover no-repeat`,filter:'grayscale(100%) contrast(1.15) brightness(.2)',transform:imgReady?'scale(1)':'scale(1.06)',transition:'transform 12s ease'}} aria-hidden="true"/>
      <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(8,8,8,.05) 0%,transparent 30%,rgba(8,8,8,.92) 78%),linear-gradient(to right,rgba(8,8,8,.45),transparent 55%)'}} aria-hidden="true"/>
      <div style={{position:'absolute',left:56,top:0,bottom:0,width:2,background:'linear-gradient(to bottom,transparent 10%,#C8FF00 30%,#C8FF00 70%,transparent 100%)',opacity:.65}} aria-hidden="true"/>

      <div style={{position:'relative',zIndex:3,paddingBottom:72}}>
        <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:28}}>
          <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:7.5,letterSpacing:'.18em',textTransform:'uppercase',background:'#C8FF00',color:'#080808',padding:'5px 12px',borderRadius:2,display:'flex',alignItems:'center',gap:7}}>
            <span style={{width:5,height:5,borderRadius:'50%',background:'#080808',animation:'lp-blink 1.8s ease infinite'}}/>
            WC 2026 · Live
          </span>
          <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.12em',textTransform:'uppercase',color:'rgba(247,245,240,.55)'}}>
            Dixon-Coles + Elo · 314 matches · 10,000 simulations
          </span>
        </div>

        <h1 style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:'clamp(88px,16vw,200px)',lineHeight:.82,letterSpacing:'.006em',margin:'0 0 36px'}}>
          <span style={{fontFamily:"var(--font-serif,'Cormorant Garamond',serif)",fontStyle:'italic',fontWeight:300,fontSize:'.34em',color:'rgba(247,245,240,.6)',display:'block',lineHeight:1.2,marginBottom:'.05em'}}>World Cup</span>
          <span style={{color:'#C8FF00',display:'block'}}>Intelligence.</span>
        </h1>

        {/* KPI strip */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',borderTop:'1px solid rgba(247,245,240,.1)',paddingTop:32,gap:0}}>
          {[
            {n:'Group Fixtures', l:'WC 2026'},
            {n:loading?'—':data?.liveCount||0, l:'Live odds'},
            {n:'Spain', l:'Tournament favourite'},
            {n:'16.0%', l:'Model win prob'},
          ].map((k,i)=>(
            <div key={i} style={{padding:'0 0 0 '+(i>0?'32px':'0'),borderLeft:i>0?'1px solid rgba(247,245,240,.1)':'none'}}>
              <div style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:'clamp(36px,4vw,60px)',lineHeight:.9,color:'#F7F5F0',marginBottom:8}}>{k.n}</div>
              <div style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(247,245,240,.7)'}}>{k.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── UPCOMING FIXTURES ─────────────────────────────────────────────────── */}
    <section data-theme="dark" style={{background:'#080808',padding:'72px 56px 0'}}>
      <div style={{display:'flex',alignItems:'baseline',justifyContent:'space-between',marginBottom:32}}>
        <div>
          <p style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.2em',textTransform:'uppercase',color:'rgba(247,245,240,.65)',marginBottom:10}}>Next fixtures</p>
          <h2 style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:'clamp(40px,5vw,72px)',lineHeight:.88,color:'#F7F5F0',margin:0}}>
            <span style={{fontFamily:"var(--font-serif,'Cormorant Garamond',serif)",fontStyle:'italic',fontWeight:300,fontSize:'.46em',color:'rgba(247,245,240,.6)',display:'block',marginBottom:'.06em'}}>Upcoming</span>
            Matches.
          </h2>
        </div>
        <Link href="/signals" style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:9,letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(247,245,240,.5)',textDecoration:'none',border:'1px solid rgba(247,245,240,.1)',padding:'10px 20px',borderRadius:2,transition:'all .2s'}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(200,255,0,.3)';e.currentTarget.style.color='#C8FF00';}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(247,245,240,.1)';e.currentTarget.style.color='rgba(247,245,240,.5)';}}>
          All 72 fixtures →
        </Link>
      </div>

      <div style={{overflowX:'auto',WebkitOverflowScrolling:'touch',marginLeft:'clamp(-16px,-4vw,-56px)',marginRight:'clamp(-16px,-4vw,-56px)',paddingLeft:'clamp(16px,4vw,56px)',paddingRight:'clamp(16px,4vw,56px)'}}>
      {/* Column headers */}
      <div style={{minWidth:600,display:'grid',gridTemplateColumns:'72px 1fr 1fr 60px 68px 68px 68px 90px',gap:8,padding:'8px 0',borderBottom:'1px solid rgba(247,245,240,.08)',fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(247,245,240,.28)'}}>
        <span>Date</span><span>Home</span><span>Away</span><span>Grp</span>
        <span style={{textAlign:'center'}}>Home</span><span style={{textAlign:'center'}}>Draw</span><span style={{textAlign:'center'}}>Away</span>
        <span style={{textAlign:'center'}}>Model</span>
      </div>

      {loading?[...Array(6)].map((_,i)=>(
        <div key={i} style={{height:50,background:'rgba(247,245,240,.03)',margin:'2px 0',borderRadius:2,animation:'lp-barUp .8s ease both',animationDelay:`${i*.06}s`}}/>
      )):upcoming.map((m,i)=>{
        const bestEv=Math.max(m.evH,m.evD,m.evA);
        const hasVal=bestEv>3;
        return(
          <div key={i} style={{display:'grid',gridTemplateColumns:'72px 1fr 1fr 60px 68px 68px 68px 90px',gap:8,padding:'12px 0',borderBottom:'1px solid rgba(247,245,240,.04)',borderLeft:`2px solid ${hasVal?ec(bestEv):'transparent'}`,transition:'background .15s',cursor:'none'}}
            onMouseEnter={e=>e.currentTarget.style.background='rgba(200,255,0,.02)'}
            onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
            <div>
              <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:9,color:'rgba(247,245,240,.65)'}}>{fmtDate(m.date)}</span>
              {m.oddsSource==='live'&&<span style={{display:'block',fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:7,color:'#C8FF00',letterSpacing:'.08em',marginTop:2}}>LIVE</span>}
            </div>
            <span style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:15,letterSpacing:'.04em',color:m.prediction===m.home?'#F7F5F0':'rgba(247,245,240,.5)'}}>{m.home}</span>
            <span style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:15,letterSpacing:'.04em',color:m.prediction===m.away?'#F7F5F0':'rgba(247,245,240,.5)'}}>{m.away}</span>
            <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:9,color:'rgba(247,245,240,.55)',textAlign:'center'}}>{m.group}</span>
            {[{o:m.bestH,e:m.evH},{o:m.bestD,e:m.evD},{o:m.bestA,e:m.evA}].map((c,ci)=>(
              <div key={ci} style={{textAlign:'center'}}>
                <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:13,fontWeight:500,color:c.e>3?'#C8FF00':'rgba(247,245,240,.7)'}}>{c.o?.toFixed(2)||'—'}</span>
                <div style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:7.5,color:'rgba(247,245,240,.28)',marginTop:1}}>{ci===0?m.prob_home:ci===1?m.prob_draw:m.prob_away}%</div>
              </div>
            ))}
            <div style={{textAlign:'center'}}>
              <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:9,padding:'3px 8px',borderRadius:2,background:'rgba(200,255,0,.07)',border:'1px solid rgba(200,255,0,.18)',color:'#C8FF00',display:'inline-block'}}>
                {m.prediction===m.home?'HOME':m.prediction===m.away?'AWAY':'DRAW'}
              </span>
              <div style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,marginTop:2,color:'rgba(247,245,240,.6)'}}>{m.confidence}%</div>
            </div>
          </div>
        );
      })}
      </div>
    </section>

    {/* ── VALUE PICKS + WIN PROBS ───────────────────────────────────────────── */}
    <section data-theme="dark" style={{background:'#080808',padding:'72px 56px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:64}}>

      {/* Value picks */}
      <div>
        <p style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.2em',textTransform:'uppercase',color:'rgba(247,245,240,.65)',marginBottom:10}}>Odds intelligence</p>
        <h2 style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:'clamp(40px,4.5vw,64px)',lineHeight:.88,color:'#F7F5F0',marginBottom:28}}>
          <span style={{fontFamily:"var(--font-serif,'Cormorant Garamond',serif)",fontStyle:'italic',fontWeight:300,fontSize:'.46em',color:'rgba(247,245,240,.6)',display:'block',marginBottom:'.06em'}}>Best available</span>
          Odds.
        </h2>
        <div style={{display:'flex',flexDirection:'column',gap:2}}>
          {(loading?[...Array(5)]:valueMatches).map((m,i)=>{
            if(loading) return <div key={i} style={{height:56,background:'rgba(247,245,240,.03)',borderRadius:2}}/>;
            const isH=m.bestEv===m.evH,isA=m.bestEv===m.evA;
            const mkt=isH?`${m.home} Win`:isA?`${m.away} Win`:'Draw';
            const odds=isH?m.bestH:isA?m.bestA:m.bestD;
            const prob=isH?m.prob_home:isA?m.prob_away:m.prob_draw;
            const hasVal=m.bestEv>3;
            return(
              <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 16px',borderLeft:`2px solid ${hasVal?ec(m.bestEv):'rgba(247,245,240,.1)'}`,border:`1px solid ${ebr(m.bestEv)}`,borderLeftWidth:2,transition:'background .15s',cursor:'none'}}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(200,255,0,.02)'}
                onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                <div>
                  <div style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.08em',textTransform:'uppercase',color:'rgba(247,245,240,.6)',marginBottom:3}}>
                    Grp {m.group} · {fmtDate(m.date)} · {m.home} vs {m.away}
                  </div>
                  <div style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:18,letterSpacing:'.04em',color:'#F7F5F0'}}>{mkt}</div>
                  <div style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,color:'rgba(247,245,240,.65)',marginTop:2}}>
                    Model: <span style={{color:'#C8FF00'}}>{prob}%</span> · Odds: <span style={{color:'#F7F5F0',fontWeight:500}}>{odds?.toFixed(2)}</span>
                  </div>
                </div>
                {hasVal&&<span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:14,fontWeight:500,color:ec(m.bestEv),padding:'4px 10px',background:'rgba(200,255,0,.08)',border:`1px solid ${ebr(m.bestEv)}`,borderRadius:2,flexShrink:0,marginLeft:12}}>+{m.bestEv.toFixed(1)}%</span>}
              </div>
            );
          })}
          <Link href="/odds" style={{marginTop:8,padding:'12px 16px',fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:9,letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(247,245,240,.7)',border:'1px solid rgba(247,245,240,.08)',textDecoration:'none',textAlign:'center',transition:'all .2s',borderRadius:2}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(200,255,0,.25)';e.currentTarget.style.color='#C8FF00';}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(247,245,240,.08)';e.currentTarget.style.color='rgba(247,245,240,.45)';}}>
            Full odds intelligence →
          </Link>
        </div>
      </div>

      {/* Win probabilities */}
      <div>
        <p style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.2em',textTransform:'uppercase',color:'rgba(247,245,240,.65)',marginBottom:10}}>Tournament simulation</p>
        <h2 style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:'clamp(40px,4.5vw,64px)',lineHeight:.88,color:'#F7F5F0',marginBottom:28}}>
          <span style={{fontFamily:"var(--font-serif,'Cormorant Garamond',serif)",fontStyle:'italic',fontWeight:300,fontSize:'.46em',color:'rgba(247,245,240,.6)',display:'block',marginBottom:'.06em'}}>10,000 simulations</span>
          Win Odds.
        </h2>
        <div style={{display:'flex',flexDirection:'column',gap:1}}>
          {(loading?[...Array(8)]:simTop.slice(0,8)).map((s,i)=>{
            if(loading) return <div key={i} style={{height:44,background:'rgba(247,245,240,.03)',borderRadius:2,margin:'1px 0'}}/>;
            return(
              <div key={s.team} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 0',borderBottom:'1px solid rgba(247,245,240,.04)'}}>
                <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:9,color:'rgba(247,245,240,.2)',width:16,textAlign:'right'}}>{i+1}</span>
                <span style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:16,letterSpacing:'.04em',color:i===0?'#C8FF00':i<3?'#F7F5F0':'rgba(247,245,240,.65)',flex:1}}>{s.team}</span>
                <div style={{width:120,height:2,background:'rgba(247,245,240,.07)',borderRadius:1,overflow:'hidden'}}>
                  <div style={{height:'100%',background:i===0?'#C8FF00':i<3?'#4A7FD4':'rgba(247,245,240,.25)',width:`${s.win_pct/(simTop[0]?.win_pct||1)*100}%`,borderRadius:1}}/>
                </div>
                <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:11,fontWeight:500,width:36,textAlign:'right',color:i===0?'#C8FF00':i<3?'#F7F5F0':'rgba(247,245,240,.45)'}}>{s.win_pct}%</span>
              </div>
            );
          })}
        </div>
        <Link href="/leagues" style={{marginTop:16,display:'block',padding:'12px 16px',fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:9,letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(247,245,240,.7)',border:'1px solid rgba(247,245,240,.08)',textDecoration:'none',textAlign:'center',transition:'all .2s',borderRadius:2}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(200,255,0,.25)';e.currentTarget.style.color='#C8FF00';}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(247,245,240,.08)';e.currentTarget.style.color='rgba(247,245,240,.45)';}}>
          Full rankings →
        </Link>
      </div>
    </section>

    {/* ── GROUPS GRID ───────────────────────────────────────────────────────── */}
    <section data-theme="dark" style={{background:'#080808',padding:'0 56px 80px',borderTop:'1px solid rgba(247,245,240,.05)'}}>
      <div style={{display:'flex',alignItems:'baseline',justifyContent:'space-between',paddingTop:56,marginBottom:32}}>
        <div>
          <p style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.2em',textTransform:'uppercase',color:'rgba(247,245,240,.65)',marginBottom:10}}>Draw</p>
          <h2 style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:'clamp(40px,5vw,72px)',lineHeight:.88,color:'#F7F5F0',margin:0}}>
            <span style={{fontFamily:"var(--font-serif,'Cormorant Garamond',serif)",fontStyle:'italic',fontWeight:300,fontSize:'.46em',color:'rgba(247,245,240,.6)',display:'block',marginBottom:'.06em'}}>12 groups</span>
            The Draw.
          </h2>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:2}}>
        {groups.map(g=>{
          const ts=GROUPS_MAP[g]||[];
          const ranked=ts.map(t=>({team:t,elo:(tmMap[t]?.elo||1500)})).sort((a,b)=>b.elo-a.elo);
          const isActive=activeGrp===g;
          return(
            <div key={g} style={{padding:'20px',border:`1px solid ${isActive?'rgba(200,255,0,.25)':'rgba(247,245,240,.07)'}`,background:isActive?'rgba(200,255,0,.03)':'rgba(247,245,240,.015)',cursor:'none',transition:'all .2s'}}
              onClick={()=>setActiveGrp(isActive?null:g)}
              onMouseEnter={e=>{if(!isActive){e.currentTarget.style.borderColor='rgba(247,245,240,.12)';e.currentTarget.style.background='rgba(247,245,240,.03)';}}}
              onMouseLeave={e=>{if(!isActive){e.currentTarget.style.borderColor='rgba(247,245,240,.07)';e.currentTarget.style.background='rgba(247,245,240,.015)';}}}
            >
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
                <span style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:20,color:isActive?'#C8FF00':'rgba(247,245,240,.85)',letterSpacing:'.06em'}}>Group {g}</span>
              </div>
              {ranked.map((t,ti)=>(
                <div key={t.team}>
                  {ti===2&&<div style={{borderTop:'1px dashed rgba(247,245,240,.1)',margin:'6px 0'}}/>}
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'3px 0'}}>
                    <div style={{display:'flex',alignItems:'center',gap:6}}>
                      <span style={{width:5,height:5,borderRadius:'50%',background:ti<2?'#C8FF00':'rgba(247,245,240,.2)',flexShrink:0}}/>
                      <span style={{fontFamily:"var(--font-body,'Outfit',sans-serif)",fontSize:12,fontWeight:ti<2?500:300,color:ti<2?'#F7F5F0':'rgba(247,245,240,.55)'}}>{t.team}</span>
                    </div>
                    <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:9,color:'rgba(247,245,240,.55)'}}>{t.elo}</span>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </section>
  </>);
}
