"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

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

const ARTICLES = [
  {
    tag:'Model Report', date:'Jun 2026',
    title:'Spain vs The Field: 37% Win Probability and Why the Market Is Underestimating Them',
    excerpt:'Spain enters WC 2026 with the highest Elo rating in the tournament at 2,171 — a figure built on their Euro 2024 triumph and an 18-month unbeaten run. The Dixon-Coles model assigns Spain a 37% tournament win probability across 10,000 simulations. The next closest is Argentina at 16.8%. At current bookmaker prices, Spain represent negative expected value on the outright — the market has fully priced them. The edge, if there is one, is in their group stage matches where implied probabilities consistently lag the model.',
    stat:'37%', statLabel:'Tournament win prob', highlight:true,
  },
  {
    tag:'Value Analysis', date:'Jun 2026',
    title:'Colombia: The Highest Positive Expected Value Outright in the Tournament',
    excerpt:"Colombia's Elo of 1,998 and 71% win rate in calibration data makes them the model's third-highest rated team — yet bookmakers price them at 8–9% tournament probability. The Dixon-Coles model projects 12.4%. That is a 4-point gap at long odds, producing a meaningful positive EV on outright markets. Group K (Portugal, Colombia, Uzbekistan, Congo DR) is their path. A Colombia vs Portugal group decider on June 27 is the key fixture — both teams expected to advance.",
    stat:'+4.4pp', statLabel:'Model vs market gap', highlight:false,
  },
  {
    tag:'Group Analysis', date:'Jun 2026',
    title:'Group I: France, Norway, Senegal, Iraq — The Hardest Group in the Tournament',
    excerpt:"By average Elo, Group I is the strongest in WC 2026. Norway at 1,922 makes them a legitimate dark horse — their result against France on June 26 (matchday 3) could determine whether France advance as group winners or second seeds. Senegal at 1,869 are dangerous. Iraq are the only clear minnow. The model gives France 71% to top the group — but that leaves a 29% scenario where they face a tougher R32 draw. Group I matches are flagged as high-variance; confidence intervals are wider than typical group stage fixtures.",
    stat:'71%', statLabel:'France top-group prob', highlight:false,
  },
  {
    tag:'Dark Horse', date:'Jun 2026',
    title:'Norway at 3%: Why the Model Sees Erling Haaland\'s Side as Criminally Mispriced',
    excerpt:'Norway sit at Elo 1,922 — higher than Germany, Belgium, and Portugal in the model calibration. Their qualification campaign produced 28 goals in 10 games, a rate that translates directly into Poisson lambda advantage in the Dixon-Coles model. Bookmakers have them at 2–3% tournament win probability. The model says 4.8%. At offered prices of 40/1 to 60/1, the implied EV is materially positive. The caveat: Group I draw with France and Senegal limits their R32 path. But if Norway top the group, their knockout bracket opens significantly.',
    stat:'4.8%', statLabel:'Model win probability', highlight:false,
  },
  {
    tag:'Methodology', date:'Jun 2026',
    title:'How the EdgeIQ Model Works: Dixon-Coles, Elo Ratings, and 10,000 Simulations',
    excerpt:'The prediction engine combines three components. Elo ratings are calibrated on 314 matches from StatsBomb open data across six major tournaments (WC 2018, WC 2022, Euro 2020, Euro 2024, Copa América 2024, AFCON 2023) using a variable K-factor with recency weighting. Match probabilities are generated via Dixon-Coles bivariate Poisson — which corrects for the known low-score bias in standard Poisson models. Tournament outcomes are simulated 10,000 times across the full 48-team bracket including group stage, R32, QF, SF and Final. All probabilities are generated before kick-off and are immutable.',
    stat:'314', statLabel:'Matches calibrated', highlight:false,
  },
  {
    tag:'Group Analysis', date:'Jun 2026',
    title:'Group H Deep Dive: Spain\'s Manageable Draw and the Uruguay Wildcard',
    excerpt:"Spain face Cabo Verde, Saudi Arabia and Uruguay in Group H. The model gives Spain a 94% probability of advancing from the group — the second-highest advance probability of any team. Uruguay at Elo 1,890 are the only meaningful threat. Their head-to-head on June 21 (matchday 2) is the most significant Group H fixture. Uruguay have the defensive solidity to make it competitive — their 0.71 average goals conceded across calibration matches is the second-best in CONMEBOL. If Uruguay beat Spain, the group opens considerably.",
    stat:'94%', statLabel:'Spain advance probability', highlight:false,
  },
];

export default function InsightsPage() {
  useCursor();
  const [active, setActive] = useState(null);
  const [data,   setData]   = useState(null);
  const [imgReady, setImgReady] = useState(false);

  useEffect(()=>{const t=setTimeout(()=>setImgReady(true),80);return()=>clearTimeout(t);},[]);
  useEffect(()=>{
    fetch('/api/wc2026').then(r=>r.json()).then(setData).catch(()=>{});
  },[]);

  const STATIC_PROBS = [{"team": "Spain", "win_pct": 16.0}, {"team": "France", "win_pct": 12.5}, {"team": "England", "win_pct": 12.0}, {"team": "Argentina", "win_pct": 9.0}, {"team": "Brazil", "win_pct": 8.5}, {"team": "Portugal", "win_pct": 6.5}, {"team": "Germany", "win_pct": 5.5}, {"team": "Netherlands", "win_pct": 3.5}, {"team": "Norway", "win_pct": 3.0}, {"team": "Belgium", "win_pct": 2.0}, {"team": "USA", "win_pct": 1.7}, {"team": "Colombia", "win_pct": 1.6}, {"team": "Japan", "win_pct": 1.6}, {"team": "Morocco", "win_pct": 1.5}, {"team": "Uruguay", "win_pct": 1.4}, {"team": "Croatia", "win_pct": 1.2}];
  const simTop = STATIC_PROBS.slice(0, 5);

  return (<>
    <div id="ea-cur" style={{position:'fixed',zIndex:9998,pointerEvents:'none',top:0,left:0}} aria-hidden="true">
      <div id="ea-ring" style={{width:36,height:36,border:'1.5px solid rgba(247,245,240,.55)',borderRadius:'50%',position:'absolute',transform:'translate(-50%,-50%)',transition:'width .2s,height .2s,border-color .2s'}}/>
      <div id="ea-dot"  style={{width:6,height:6,background:'#F7F5F0',borderRadius:'50%',position:'absolute',transform:'translate(-50%,-50%)',transition:'transform .08s,background .2s'}}/>
    </div>
    <style>{`body.lp-hovering #ea-ring{width:52px!important;height:52px!important;border-color:#C8FF00!important}body.lp-hovering #ea-dot{background:#C8FF00!important;transform:translate(-50%,-50%) scale(1.4)!important}`}</style>

    <div style={{background:'#080808',minHeight:'100vh',color:'#F7F5F0'}}>

      {/* Hero */}
      <section data-theme="dark" style={{position:'relative',minHeight:'50vh',display:'flex',flexDirection:'column',justifyContent:'flex-end',padding:'0 56px',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,background:`url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1920&q=85&fit=crop') center 40%/cover`,filter:'grayscale(100%) brightness(.16)',transform:imgReady?'scale(1)':'scale(1.05)',transition:'transform 12s ease'}} aria-hidden="true"/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent 25%,rgba(8,8,8,.95) 80%)'}} aria-hidden="true"/>
        <div style={{position:'absolute',left:56,top:0,bottom:0,width:2,background:'linear-gradient(to bottom,transparent 10%,#C8FF00 35%,#C8FF00 70%,transparent 100%)',opacity:.5}} aria-hidden="true"/>
        <div style={{position:'relative',zIndex:3,paddingBottom:52}}>
          <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:7.5,letterSpacing:'.18em',textTransform:'uppercase',background:'#C8FF00',color:'#080808',padding:'5px 12px',borderRadius:2,display:'inline-block',marginBottom:20}}>Insights</span>
          <h1 style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:'clamp(72px,12vw,160px)',lineHeight:.84,margin:0}}>
            <span style={{fontFamily:"var(--font-serif,'Cormorant Garamond',serif)",fontStyle:'italic',fontWeight:300,fontSize:'.38em',color:'rgba(247,245,240,.6)',display:'block',marginBottom:'.06em'}}>Model reports &</span>
            Analysis.
          </h1>
        </div>
      </section>

      {/* Featured article */}
      <section data-theme="dark" style={{padding:'56px 56px 0'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:64,alignItems:'start'}}>
          <div>
            <div style={{display:'flex',gap:10,marginBottom:24,flexWrap:'wrap'}}>
              {simTop.map((s,i)=>(
                <div key={s.team} style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.08em',textTransform:'uppercase',padding:'4px 10px',borderRadius:2,border:`1px solid ${i===0?'#C8FF00':'rgba(247,245,240,.1)'}`,color:i===0?'#C8FF00':'rgba(247,245,240,.45)'}}>
                  {s.team} {s.win_pct}%
                </div>
              ))}
            </div>
            <div style={{cursor:'none'}} onClick={()=>setActive(active===0?null:0)}
              onMouseEnter={e=>e.currentTarget.style.opacity='.9'} onMouseLeave={e=>e.currentTarget.style.opacity='1'}>
              <div style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.12em',textTransform:'uppercase',color:'#C8FF00',marginBottom:12}}>
                {ARTICLES[0].tag} · {ARTICLES[0].date}
              </div>
              <h2 style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:'clamp(36px,5vw,68px)',lineHeight:.9,color:'#F7F5F0',marginBottom:20}}>
                {ARTICLES[0].title}
              </h2>
              <p style={{fontFamily:"var(--font-body,'Outfit',sans-serif)",fontWeight:200,fontSize:14,color:'rgba(247,245,240,.7)',lineHeight:1.85,maxWidth:620}}>
                {ARTICLES[0].excerpt}
              </p>
              <div style={{display:'flex',gap:24,marginTop:24}}>
                <div>
                  <div style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:52,color:'#C8FF00',lineHeight:.9}}>{ARTICLES[0].stat}</div>
                  <div style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(247,245,240,.65)',marginTop:4}}>{ARTICLES[0].statLabel}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar — quick stats */}
          <div style={{display:'flex',flexDirection:'column',gap:2,paddingTop:32}}>
            <div style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.12em',textTransform:'uppercase',color:'rgba(247,245,240,.6)',marginBottom:12}}>Tournament model data</div>
            {[
              {l:'Fixtures modelled',v:data?.matchCount||72},
              {l:'Simulations run',v:'10,000'},
              {l:'Matches calibrated',v:314},
              {l:'Data source',v:'StatsBomb'},
            ].map((s,i)=>(
              <div key={i} style={{padding:'16px',border:'1px solid rgba(247,245,240,.07)',background:'rgba(247,245,240,.02)'}}>
                <div style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(247,245,240,.6)',marginBottom:4}}>{s.l}</div>
                <div style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:28,color:'#F7F5F0',lineHeight:.9}}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Article grid */}
      <section data-theme="dark" style={{padding:'56px 56px 80px'}}>
        <div style={{borderTop:'1px solid rgba(247,245,240,.08)',paddingTop:48}}>
          <p style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.2em',textTransform:'uppercase',color:'rgba(247,245,240,.65)',marginBottom:32}}>
            All analysis · {ARTICLES.length - 1} pieces
          </p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))',gap:2}}>
            {ARTICLES.slice(1).map((a,i)=>(
              <div key={i}
                style={{padding:'28px',border:'1px solid rgba(247,245,240,.07)',background:active===i+1?'rgba(247,245,240,.04)':'rgba(247,245,240,.015)',cursor:'none',transition:'all .2s'}}
                onClick={()=>setActive(active===i+1?null:i+1)}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(200,255,0,.2)';e.currentTarget.style.background='rgba(200,255,0,.02)';}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(247,245,240,.07)';e.currentTarget.style.background=active===i+1?'rgba(247,245,240,.04)':'rgba(247,245,240,.015)';}}>
                <div style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(247,245,240,.65)',marginBottom:10}}>
                  {a.tag} · {a.date}
                </div>
                <h3 style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:22,lineHeight:.96,color:'#F7F5F0',marginBottom:14}}>{a.title}</h3>
                {active===i+1&&(
                  <p style={{fontFamily:"var(--font-body,'Outfit',sans-serif)",fontWeight:200,fontSize:13,color:'rgba(247,245,240,.65)',lineHeight:1.8,marginBottom:16}}>{a.excerpt}</p>
                )}
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',borderTop:'1px solid rgba(247,245,240,.06)',paddingTop:14,marginTop:active===i+1?0:14}}>
                  <div>
                    <div style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:32,color:'#C8FF00',lineHeight:.9}}>{a.stat}</div>
                    <div style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:7.5,letterSpacing:'.08em',textTransform:'uppercase',color:'rgba(247,245,240,.6)',marginTop:3}}>{a.statLabel}</div>
                  </div>
                  <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:9,color:'rgba(247,245,240,.65)',letterSpacing:'.08em'}}>
                    {active===i+1?'↑ Collapse':'↓ Read more'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  </>);
}
