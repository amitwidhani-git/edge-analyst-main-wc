"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

function fmtDate(d) {
  if (!d) return '';
  return new Date(d+'T12:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short'});
}
const ec   = e => e>=8?'#C8FF00':e>=3?'rgba(200,255,0,.8)':'rgba(247,245,240,.55)';
const ecL  = e => e>=8?'#005F3F':e>=3?'rgba(0,95,63,.8)':'rgba(8,8,8,.35)';
const ebrL = e => e>=8?'rgba(0,95,63,.18)':e>=3?'rgba(0,95,63,.09)':'rgba(8,8,8,.08)';

export default function HomePage() {
  const [data,       setData]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [imgReady,   setImgReady]   = useState(false);
  const [activeGrp,  setActiveGrp]  = useState(null);
  const [timeLeft,   setTimeLeft]   = useState(null);

  useEffect(()=>{const t=setTimeout(()=>setImgReady(true),80);return()=>clearTimeout(t);},[]);

  useEffect(()=>{
    if(window.matchMedia('(hover:none),(pointer:coarse)').matches) return;
    document.body.style.cursor='none';
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

  useEffect(()=>{
    fetch('/api/wc2026').then(r=>r.json()).then(setData).catch(()=>{}).finally(()=>setLoading(false));
  },[]);

  useEffect(()=>{
    const target=new Date('2026-06-11T00:00:00');
    const tick=()=>{
      const diff=target-Date.now();
      if(diff<=0){setTimeLeft({started:true});return;}
      setTimeLeft({d:Math.floor(diff/86400000),h:Math.floor((diff%86400000)/3600000),m:Math.floor((diff%3600000)/60000),s:Math.floor((diff%60000)/1000),started:false});
    };
    tick();
    const id=setInterval(tick,1000);
    return()=>clearInterval(id);
  },[]);

  const matches      = data?.matches || [];
  const teamStats    = data?.teamStats || [];
  const simTop       = data?.simulation?.results?.slice(0,6) || [];
  const valueMatches = [...matches].sort((a,b)=>b.bestEv-a.bestEv).filter(m=>m.bestEv>0).slice(0,6);

  const lastResult = [...matches]
    .filter(m=>m.status==='completed')
    .sort((a,b)=>a.date.localeCompare(b.date))
    .slice(-2);

  const upcoming = [
    ...lastResult,
    ...[...matches]
      .sort((a,b)=>a.date.localeCompare(b.date))
      .filter(m=>m.status==='upcoming')
      .slice(0,6)
  ];  

  const groups       = ['A','B','C','D','E','F','G','H','I','J','K','L'];

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
    <div id="ea-cur" style={{position:'fixed',zIndex:9998,pointerEvents:'none',top:0,left:0,opacity:0,transition:'opacity .3s'}} aria-hidden="true">
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
        .ea-kpi-grid{grid-template-columns:repeat(2,1fr)!important}
        .ea-kpi-item{padding-left:0!important;border-left:none!important}
        .ea-kpi-item:nth-child(even){padding-left:24px!important;border-left:1px solid rgba(247,245,240,.1)!important}
        .ea-section-pad{padding-left:20px!important;padding-right:20px!important}
        .ea-fixtures-row{grid-template-columns:56px 1fr 1fr 80px!important}
        .ea-odds-col{display:none!important}
        .ea-hfx-team{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .ea-two-col{grid-template-columns:1fr!important;gap:40px!important}
        .ea-groups-grid{grid-template-columns:repeat(2,1fr)!important}
        .ea-grp-team{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      }
      @media(max-width:480px){
        .ea-groups-grid{grid-template-columns:1fr!important}
      }
    `}</style>

    {/* ── HERO (dark) ────────────────────────────────────────────────────────── */}
    <section data-theme="dark" className="ea-hero">
      <div style={{position:'absolute',inset:0,background:`url('https://upload.wikimedia.org/wikipedia/commons/0/04/Metlife_stadium_%28Aerial_view%29.jpg') center 50%/cover no-repeat`,filter:'contrast(1.1) brightness(.52)',transform:imgReady?'scale(1)':'scale(1.06)',transition:'transform 12s ease'}} aria-hidden="true"/>
      <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(8,8,8,.06) 0%,transparent 30%,rgba(8,8,8,.82) 78%),linear-gradient(to right,rgba(8,8,8,.35),transparent 55%)'}} aria-hidden="true"/>
      <div style={{position:'absolute',left:56,top:0,bottom:0,width:2,background:'linear-gradient(to bottom,transparent 10%,#F0A500 30%,#F0A500 70%,transparent 100%)',opacity:.65}} aria-hidden="true"/>
      <div className="ea-hero-caption" style={{position:'absolute',bottom:28,right:40,textAlign:'right',pointerEvents:'none'}}>
        <div style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:9,letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(247,245,240,.7)',marginBottom:3}}>MetLife Stadium · World Cup Final · 19 Jul 2026</div>
        <div className="ea-photo-credit" style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.06em',color:'rgba(247,245,240,.55)'}}>Photo: Anthony Quintano / CC BY 2.0</div>
      </div>

      <div className="ea-hero__inner">
        <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:28}}>
          <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:7.5,letterSpacing:'.18em',textTransform:'uppercase',background:'#F0A500',color:'#080808',padding:'5px 12px',borderRadius:2,display:'flex',alignItems:'center',gap:7}}>
            <span style={{width:5,height:5,borderRadius:'50%',background:'#080808',animation:'lp-blink 1.8s ease infinite'}}/>
            WC 2026 · Live
          </span>
          <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.12em',textTransform:'uppercase',color:'rgba(247,245,240,.55)'}}>
            Elo · 314 matches · 10,000 simulations
          </span>
        </div>

        <h1 style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:'clamp(88px,16vw,200px)',lineHeight:.82,letterSpacing:'.006em',margin:'0 0 36px'}}>
          <span style={{fontFamily:"var(--font-serif,'Cormorant Garamond',serif)",fontStyle:'italic',fontWeight:300,fontSize:'.34em',color:'rgba(247,245,240,.6)',display:'block',lineHeight:1.2,marginBottom:'.05em'}}>Football Intelligence</span>
          <span style={{background:'linear-gradient(to right, #F0A500, #C8FF00)',WebkitBackgroundClip:'text',backgroundClip:'text',WebkitTextFillColor:'transparent',color:'transparent',display:'block'}}>World Cup 2026</span>
        </h1>

        <p style={{fontFamily:"var(--font-serif,'Cormorant Garamond',serif)",fontStyle:'italic',fontWeight:300,fontSize:'clamp(18px,1.6vw,24px)',lineHeight:1.6,color:'rgba(247,245,240,.92)',maxWidth:580,margin:'0 0 36px'}}>
          World Football Elo-rated predictions, live odds intelligence and 10,000-simulation tournament forecasts, built to find the edge in every World Cup fixture.
        </p>

        <Link href="/odds" style={{display:'inline-flex',alignItems:'center',gap:12,marginBottom:36,textDecoration:'none'}}
          onMouseEnter={e=>{e.currentTarget.querySelector('span.btg-btn').style.background='#FFD600';e.currentTarget.querySelector('span.btg-arr').style.transform='translateX(5px)';}}
          onMouseLeave={e=>{e.currentTarget.querySelector('span.btg-btn').style.background='#F0A500';e.currentTarget.querySelector('span.btg-arr').style.transform='translateX(0)';}}>
          <span className="btg-btn" style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:'clamp(18px,2vw,26px)',letterSpacing:'.1em',textTransform:'uppercase',background:'#F0A500',color:'#080808',padding:'12px 28px',borderRadius:2,transition:'background .2s'}}>Beat the Game</span>
          <span className="btg-arr" style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:'clamp(18px,2vw,26px)',letterSpacing:'.1em',color:'#F0A500',transition:'transform .2s',display:'inline-block'}}>→</span>
        </Link>

        {/* Countdown */}
        {timeLeft&&(
          <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:40,fontFamily:"var(--font-mono,'DM Mono',monospace)"}}>
            {timeLeft.started?(
              <span style={{fontSize:9,letterSpacing:'.2em',textTransform:'uppercase',color:'#C8FF00',display:'flex',alignItems:'center',gap:8}}>
                <span style={{width:6,height:6,borderRadius:'50%',background:'#C8FF00',animation:'lp-blink 1.4s ease infinite'}}/>
                Tournament Underway
              </span>
            ):(
              <>
                <span style={{fontSize:8,letterSpacing:'.18em',textTransform:'uppercase',color:'rgba(247,245,240,.4)'}}>Kicks off in</span>
                <span style={{fontSize:9,letterSpacing:'.1em',color:'#F7F5F0',fontWeight:500}}>
                  {timeLeft.d}d · {String(timeLeft.h).padStart(2,'0')}h · {String(timeLeft.m).padStart(2,'0')}m · <span style={{color:'rgba(247,245,240,.5)'}}>{String(timeLeft.s).padStart(2,'0')}s</span>
                </span>
              </>
            )}
          </div>
        )}

        {/* KPI strip */}
        <div className="ea-kpi-grid" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',borderTop:'1px solid rgba(247,245,240,.1)',paddingTop:32,gap:0}}>
          {[
            {n:loading?'—':matches.length,     l:'Group Fixtures'},
            {n:loading?'—':data?.liveCount||0, l:'Live odds'},
            {n:loading?'—':data?.modelRecord?.played>0?`${data.modelRecord.correct}/${data.modelRecord.played}`:'—', l:'Model record', accent:true},
            {n:loading?'—':data?.modelRecord?.accuracy!=null?`${data.modelRecord.accuracy}%`:'Pending', l:'Accuracy'},
          ].map((k,i)=>(
            <div key={i} className="ea-kpi-item" style={{padding:'0 0 0 '+(i>0?'32px':'0'),borderLeft:i>0?'1px solid rgba(247,245,240,.1)':'none'}}>
              <div style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:'clamp(36px,4vw,60px)',lineHeight:.9,color:k.accent?'#C8FF00':'#F7F5F0',marginBottom:8}}>{k.n}</div>
              <div style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(247,245,240,.45)'}}>{k.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── UPCOMING FIXTURES (dark) ──────────────────────────────────────────── */}
    <section data-theme="dark" className="ea-section-pad" style={{background:'#080808',padding:'72px 56px 0'}}>
      <div style={{display:'flex',alignItems:'baseline',justifyContent:'space-between',marginBottom:32,flexWrap:'wrap',gap:12}}>
        <div>
          <p style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.2em',textTransform:'uppercase',color:'rgba(247,245,240,.4)',marginBottom:10}}>Next fixtures</p>
          <h2 style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:'clamp(40px,5vw,72px)',lineHeight:.88,color:'#F7F5F0',margin:0}}>
            <span style={{fontFamily:"var(--font-serif,'Cormorant Garamond',serif)",fontStyle:'italic',fontWeight:300,fontSize:'.46em',color:'rgba(247,245,240,.6)',display:'block',marginBottom:'.06em'}}>Upcoming</span>
            Matches.
          </h2>
        </div>
        <Link href="/fixtures" style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:9,letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(247,245,240,.5)',textDecoration:'none',border:'1px solid rgba(247,245,240,.1)',padding:'10px 20px',borderRadius:2,transition:'all .2s'}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(200,255,0,.3)';e.currentTarget.style.color='#C8FF00';}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(247,245,240,.1)';e.currentTarget.style.color='rgba(247,245,240,.5)';}}>
          All group fixtures →
        </Link>
      </div>

      <div className="ea-fixtures-row" style={{display:'grid',gridTemplateColumns:'72px 1fr 1fr 60px 68px 68px 68px 90px',gap:8,padding:'8px 0',borderBottom:'1px solid rgba(247,245,240,.08)',fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(247,245,240,.28)'}}>
        <span>Date</span><span>Home</span><span>Away</span>
        <span className="ea-odds-col">Grp</span>
        <span className="ea-odds-col" style={{textAlign:'center'}}>Home</span>
        <span className="ea-odds-col" style={{textAlign:'center'}}>Draw</span>
        <span className="ea-odds-col" style={{textAlign:'center'}}>Away</span>
        <span style={{textAlign:'center'}}>Model</span>
      </div>

      {loading?[...Array(6)].map((_,i)=>(
        <div key={i} style={{height:50,background:'rgba(247,245,240,.03)',margin:'2px 0',borderRadius:2,animation:'lp-barUp .8s ease both',animationDelay:`${i*.06}s`}}/>
      )):upcoming.map((m,i)=>{
        const bestEv=Math.max(m.evH,m.evD,m.evA);
        const hasVal=bestEv>3;
        return(
          <div key={i} className="ea-fixtures-row" style={{display:'grid',gridTemplateColumns:'72px 1fr 1fr 60px 68px 68px 68px 90px',gap:8,padding:'12px 0',borderBottom:'1px solid rgba(247,245,240,.04)',borderLeft:`2px solid ${hasVal?ec(bestEv):'transparent'}`,transition:'background .15s',cursor:'none'}}
            onMouseEnter={e=>e.currentTarget.style.background='rgba(200,255,0,.02)'}
            onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
            <div>
              <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:9,color:'rgba(247,245,240,.4)'}}>{fmtDate(m.date)}</span>
              {m.oddsSource==='live'&&m.status!=='completed'&&<span style={{display:'block',fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:7,color:'#C8FF00',letterSpacing:'.08em',marginTop:2}}>LIVE</span>}
              {m.status==='completed'&&<span style={{display:'block',fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:7,color:'rgba(247,245,240,.35)',letterSpacing:'.08em',marginTop:2}}>FT</span>}
            </div>
            <span className="ea-hfx-team" style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:15,letterSpacing:'.04em',color:m.prediction===m.home?'#F7F5F0':'rgba(247,245,240,.5)'}}>{m.home}</span>
            <span className="ea-hfx-team" style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:15,letterSpacing:'.04em',color:m.prediction===m.away?'#F7F5F0':'rgba(247,245,240,.5)'}}>{m.away}</span>
            <span className="ea-odds-col" style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:9,color:'rgba(247,245,240,.3)',textAlign:'center'}}>{m.group}</span>
            {[{o:m.bestH,e:m.evH},{o:m.bestD,e:m.evD},{o:m.bestA,e:m.evA}].map((c,ci)=>(
              <div key={ci} className="ea-odds-col" style={{textAlign:'center'}}>
                <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:13,fontWeight:500,color:c.e>3?'#C8FF00':'rgba(247,245,240,.7)'}}>{c.o?.toFixed(2)||'—'}</span>
                <div style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:7.5,color:'rgba(247,245,240,.28)',marginTop:1}}>{ci===0?m.prob_home:ci===1?m.prob_draw:m.prob_away}%</div>
              </div>
            ))}
            <div style={{textAlign:'center'}}>
              {m.status==='completed'?(
                <>
                  <span style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:15,letterSpacing:'.04em',color:m.model_correct?'#C8FF00':'#ef4444'}}>{m.actual_score}</span>
                  <div style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:7,marginTop:2,color:m.model_correct?'#C8FF00':'#ef4444',letterSpacing:'.06em'}}>{m.model_correct?'✓ CORRECT':'✗ WRONG'}</div>
                </>
              ):(
                <>
                  <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:9,padding:'3px 8px',borderRadius:2,background:'rgba(200,255,0,.07)',border:'1px solid rgba(200,255,0,.18)',color:'#C8FF00',display:'inline-block'}}>
                    {m.prediction===m.home?'HOME':m.prediction===m.away?'AWAY':'DRAW'}
                  </span>
                  <div style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,marginTop:2,color:'rgba(247,245,240,.35)'}}>{m.confidence}%</div>
                </>
              )}
            </div>
          </div>
        );
      })}
    </section>

    {/* ── VALUE PICKS + WIN PROBS (light) ──────────────────────────────────── */}
    <section data-theme="light" className="ea-section-pad" style={{background:'#F7F5F0',padding:'72px 56px'}}>
      <div className="ea-two-col" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:64}}>

        {/* Value picks */}
        <div>
          <p style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.2em',textTransform:'uppercase',color:'rgba(8,8,8,.45)',marginBottom:10}}>Odds intelligence</p>
          <h2 style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:'clamp(40px,4.5vw,64px)',lineHeight:.88,color:'#080808',marginBottom:28}}>
            <span style={{fontFamily:"var(--font-serif,'Cormorant Garamond',serif)",fontStyle:'italic',fontWeight:300,fontSize:'.46em',color:'rgba(8,8,8,.5)',display:'block',marginBottom:'.06em'}}>Best available</span>
            Odds.
          </h2>
          <div style={{display:'flex',flexDirection:'column',gap:2}}>
            {(loading?[...Array(5)]:valueMatches).map((m,i)=>{
              if(loading) return <div key={i} style={{height:56,background:'rgba(8,8,8,.05)',borderRadius:2}}/>;
              const isH=m.bestEv===m.evH,isA=m.bestEv===m.evA;
              const mkt=isH?`${m.home} Win`:isA?`${m.away} Win`:'Draw';
              const odds=isH?m.bestH:isA?m.bestA:m.bestD;
              const prob=isH?m.prob_home:isA?m.prob_away:m.prob_draw;
              const hasVal=m.bestEv>3;
              return(
                <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 16px',borderLeft:`2px solid ${hasVal?ecL(m.bestEv):'rgba(8,8,8,.12)'}`,border:`1px solid ${ebrL(m.bestEv)}`,borderLeftWidth:2,transition:'background .15s',cursor:'none'}}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(8,8,8,.03)'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <div>
                    <div style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.08em',textTransform:'uppercase',color:'rgba(8,8,8,.4)',marginBottom:3}}>
                      Grp {m.group} · {fmtDate(m.date)} · {m.home} vs {m.away}
                    </div>
                    <div style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:18,letterSpacing:'.04em',color:'#080808'}}>{mkt}</div>
                    <div style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,color:'rgba(8,8,8,.45)',marginTop:2}}>
                      Model: <span style={{color:'#005F3F',fontWeight:600}}>{prob}%</span> · Odds: <span style={{color:'#080808',fontWeight:500}}>{odds?.toFixed(2)}</span>
                    </div>
                  </div>
                  {hasVal&&<span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:14,fontWeight:500,color:ecL(m.bestEv),padding:'4px 10px',background:ebrL(m.bestEv),border:`1px solid ${ebrL(m.bestEv)}`,borderRadius:2,flexShrink:0,marginLeft:12}}>+{m.bestEv.toFixed(1)}%</span>}
                </div>
              );
            })}
            <Link href="/odds" style={{marginTop:8,padding:'12px 16px',fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:9,letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(8,8,8,.45)',border:'1px solid rgba(8,8,8,.12)',textDecoration:'none',textAlign:'center',transition:'all .2s',borderRadius:2}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(8,8,8,.4)';e.currentTarget.style.color='#080808';}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(8,8,8,.12)';e.currentTarget.style.color='rgba(8,8,8,.45)';}}>
              Full odds intelligence →
            </Link>
          </div>
        </div>

        {/* Win probabilities */}
        <div>
          <p style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.2em',textTransform:'uppercase',color:'rgba(8,8,8,.45)',marginBottom:10}}>Tournament simulation</p>
          <h2 style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:'clamp(40px,4.5vw,64px)',lineHeight:.88,color:'#080808',marginBottom:28}}>
            <span style={{fontFamily:"var(--font-serif,'Cormorant Garamond',serif)",fontStyle:'italic',fontWeight:300,fontSize:'.46em',color:'rgba(8,8,8,.5)',display:'block',marginBottom:'.06em'}}>10,000 simulations</span>
            Win Odds.
          </h2>
          <div style={{display:'flex',flexDirection:'column',gap:4}}>
            {(loading?[...Array(8)]:simTop.slice(0,8)).map((s,i)=>{
              if(loading) return <div key={i} style={{height:48,background:'rgba(8,8,8,.05)',borderRadius:2,margin:'2px 0'}}/>;
              const barColor=i===0?'linear-gradient(to right,#F0A500,#FFD600)':i===1?'linear-gradient(to right,#1D4ED8,#4F86F7)':i===2?'linear-gradient(to right,#DC2626,#F87171)':'rgba(8,8,8,.18)';
              const barPct=s.win_pct/(simTop[0]?.win_pct||1)*100;
              return(
                <div key={s.team} style={{padding:'10px 0',borderBottom:'1px solid rgba(8,8,8,.06)'}}>
                  <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:7}}>
                    <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:9,color:'rgba(8,8,8,.3)',width:18,textAlign:'right',flexShrink:0}}>{i+1}</span>
                    <span style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:16,letterSpacing:'.04em',color:i===0?'#D97706':i===1?'#1D4ED8':i===2?'#DC2626':'rgba(8,8,8,.55)',flex:1}}>{s.team}</span>
                    <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:12,fontWeight:600,color:i===0?'#D97706':i===1?'#1D4ED8':i===2?'#DC2626':'rgba(8,8,8,.4)',flexShrink:0}}>{s.win_pct}%</span>
                  </div>
                  <div style={{marginLeft:28,height:6,background:'rgba(8,8,8,.07)',borderRadius:3,overflow:'hidden'}}>
                    <div style={{height:'100%',background:barColor,width:`${barPct}%`,borderRadius:3,transition:'width .8s cubic-bezier(.4,0,.2,1)'}}/>
                  </div>
                </div>
              );
            })}
          </div>
          <Link href="/wc2026" style={{marginTop:16,display:'block',padding:'12px 16px',fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:9,letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(8,8,8,.45)',border:'1px solid rgba(8,8,8,.12)',textDecoration:'none',textAlign:'center',transition:'all .2s',borderRadius:2}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(8,8,8,.4)';e.currentTarget.style.color='#080808';}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(8,8,8,.12)';e.currentTarget.style.color='rgba(8,8,8,.45)';}}>
            Simulate the tournament →
          </Link>
        </div>
      </div>
    </section>

    {/* ── GROUPS GRID (dark) ────────────────────────────────────────────────── */}
    <section data-theme="dark" className="ea-section-pad" style={{background:'#080808',padding:'0 56px 80px',borderTop:'1px solid rgba(247,245,240,.05)'}}>
      <div style={{display:'flex',alignItems:'baseline',justifyContent:'space-between',paddingTop:56,marginBottom:32,flexWrap:'wrap',gap:16}}>
        <div>
          <p style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.2em',textTransform:'uppercase',color:'rgba(247,245,240,.4)',marginBottom:10}}>Draw</p>
          <h2 style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:'clamp(40px,5vw,72px)',lineHeight:.88,color:'#F7F5F0',margin:0}}>
            <span style={{fontFamily:"var(--font-serif,'Cormorant Garamond',serif)",fontStyle:'italic',fontWeight:300,fontSize:'.46em',color:'rgba(247,245,240,.6)',display:'block',marginBottom:'.06em'}}>12 groups</span>
            The Draw.
          </h2>
        </div>
        <div style={{display:'flex',gap:20,alignSelf:'flex-end',paddingBottom:4}}>
          {[{color:'#C8FF00',label:'Advances to Round of 32'},{color:'rgba(247,245,240,.2)',label:'Eliminated'}].map(({color,label})=>(
            <div key={label} style={{display:'flex',alignItems:'center',gap:7}}>
              <span style={{width:7,height:7,borderRadius:'50%',background:color,flexShrink:0}}/>
              <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:9,color:'rgba(247,245,240,.45)',letterSpacing:'.04em'}}>{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="ea-groups-grid" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:2}}>
        {groups.map(g=>{
          const ts=GROUPS_MAP[g]||[];
          const ranked=ts.map(t=>({team:t,elo:(tmMap[t]?.elo||1500)})).sort((a,b)=>b.elo-a.elo);
          const isActive=activeGrp===g;
          return(
            <div key={g} role="button" tabIndex={0} aria-pressed={isActive} style={{padding:'20px',border:`1px solid ${isActive?'rgba(200,255,0,.25)':'rgba(247,245,240,.07)'}`,background:isActive?'rgba(200,255,0,.03)':'rgba(247,245,240,.015)',cursor:'pointer',transition:'all .2s'}}
              onClick={()=>setActiveGrp(isActive?null:g)}
              onKeyDown={e=>{ if(e.key==='Enter' || e.key===' ') { e.preventDefault(); setActiveGrp(isActive?null:g); } }}
              onMouseEnter={e=>{if(!isActive){e.currentTarget.style.borderColor='rgba(247,245,240,.12)';e.currentTarget.style.background='rgba(247,245,240,.03)';}}}
              onMouseLeave={e=>{if(!isActive){e.currentTarget.style.borderColor='rgba(247,245,240,.07)';e.currentTarget.style.background='rgba(247,245,240,.015)';}}}
            >
              <div style={{marginBottom:12}}>
                <span style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:20,color:isActive?'#C8FF00':'rgba(247,245,240,.85)',letterSpacing:'.06em'}}>Group {g}</span>
              </div>
              {ranked.map((t,ti)=>(
                <div key={t.team}>
                  {ti===2&&<div style={{borderTop:'1px dashed rgba(247,245,240,.1)',margin:'6px 0'}}/>}
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'3px 0'}}>
                    <div style={{display:'flex',alignItems:'center',gap:7}}>
                      <span style={{width:5,height:5,borderRadius:'50%',background:ti<2?'#C8FF00':'rgba(247,245,240,.2)',flexShrink:0}}/>
                      <span className="ea-grp-team" style={{fontFamily:"var(--font-body,'Outfit',sans-serif)",fontSize:12,fontWeight:ti<2?500:300,color:ti<2?'#F7F5F0':'rgba(247,245,240,.55)'}}>{t.team}</span>
                    </div>
                    <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:9,color:'rgba(247,245,240,.3)'}}>{t.elo}</span>
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