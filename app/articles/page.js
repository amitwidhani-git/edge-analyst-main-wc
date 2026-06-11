"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

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

const ARTICLES = [
  {
    tag:'Match Report', date:'11 Jun 2026',
    title:'Mexico 2–0 South Africa: Model Correct. El Tri Deliver in Front of 87,000 at Estadio Azteca.',
    excerpt:'Mexico opened their World Cup 2026 campaign with a controlled 2–0 victory over South Africa at the Estadio Azteca, exactly as the model predicted. The EdgeIQ model assigned Mexico a 74.8% win probability — the correct outcome, covering the spread. Raúl Jiménez was decisive, contributing to both goals in a performance that justified Mexico\'s status as one of the tournament\'s most dangerous hosts.',
    excerpt2:'The model\'s xG projection was 2.55 for Mexico against 0.81 for South Africa. The actual xG came in at approximately 2.3 vs 0.4 — if anything, South Africa were even more limited than projected. Mexico\'s home Elo boost of +150 points was validated. The question now is whether their Elo rating should be revised upward ahead of the Czechia fixture on June 17.',
    excerpt3:'South Africa\'s pre-tournament form concern (two draws and a loss in their last four) was borne out. Their Elo of 1,591 makes them the weakest team in Group A — the model gives them less than 12% probability of advancing. Two games remain: Czechia on June 18 and South Korea on June 25. Both are rated above South Africa in the Elo table.',
    stat:'74.8%', statLabel:'Model win probability', stat2:'2–0', statLabel2:'Final score', stat3:'✓', statLabel3:'Model prediction correct',
    modelCorrect: true,
    highlight:true,
  },
  {
    tag:'Model Report', date:'Jun 2026',
    title:'Spain vs The Field: 37% Win Probability and Why the Market Is Underestimating Them',
    excerpt:'Spain enters WC 2026 with the highest Elo rating in the tournament at 2,171, a figure built on their Euro 2024 triumph and an 18-month unbeaten run. The model assigns Spain a 37% tournament win probability across 10,000 simulations. The next closest is Argentina at 16.8%.',
    excerpt2:'At current bookmaker prices, Spain represent negative expected value on the outright, the market has fully priced them in. The edge, if there is one, is in their group stage matches where implied probabilities consistently lag the model. Group H contains Cabo Verde, Saudi Arabia and Uruguay. The model gives Spain a 94% group advance probability, the question is whether they enter the knockout rounds as group winners, which materially affects their R32 draw.',
    excerpt3:'Uruguay at Elo 1,890 are the only meaningful threat in the group. Their head-to-head on June 21 is the most significant Group H fixture. If Spain slip to second seeds, their projected R32 opponent shifts from a CONCACAF qualifier to a potential CONMEBOL runner-up. That path difference accounts for roughly 4 percentage points of tournament win probability in the model.',
    stat:'37%', statLabel:'Tournament win prob', stat2:'2,171', statLabel2:'Spain Elo rating', stat3:'94%', statLabel3:'Group advance prob', highlight:true,
  },
  {
    tag:'Value Analysis', date:'Jun 2026',
    title:'Colombia: The Highest Positive Expected Value Outright in the Tournament',
    excerpt:"Colombia's Elo of 1,998 and 71% win rate in calibration data makes them the model's third-highest rated team yet bookmakers price them at 8–9% tournament probability. The model projects 12.4%. That is a 4-point gap at long odds, producing a meaningful positive EV on outright markets. Group K (Portugal, Colombia, Uzbekistan, Congo DR) is their path. A Colombia vs Portugal group decider on June 27 is the key fixture, both teams expected to advance.",
    stat:'+4.4pp', statLabel:'Model vs market gap', highlight:false,
  },
  {
    tag:'Group Analysis', date:'Jun 2026',
    title:'Group I: France, Norway, Senegal, Iraq. The Hardest Group in the Tournament',
    excerpt:"By average Elo, Group I is the strongest in WC 2026. Norway at 1,922 makes them a legitimate dark horse, their result against France on June 26 (matchday 3) could determine whether France advance as group winners or second seeds. Senegal at 1,869 are dangerous. Iraq are the only clear minnow. The model gives France 71% to top the group but that leaves a 29% scenario where they face a tougher R32 draw. Group I matches are flagged as high-variance; confidence intervals are wider than typical group stage fixtures.",
    stat:'71%', statLabel:'France top-group prob', highlight:false,
  },
  {
    tag:'Dark Horse', date:'Jun 2026',
    title:'Norway at 3%: Why the Model Sees Erling Haaland\'s Side as Criminally Mispriced',
    excerpt:'Norway sit at Elo 1,922 higher than Germany, Belgium, and Portugal in the model calibration. Their qualification campaign produced 28 goals in 10 games, a rate that translates directly into Poisson lambda advantage in the model. Bookmakers have them at 2–3% tournament win probability. The model says 4.8%. At offered prices of 40/1 to 60/1, the implied EV is materially positive. The caveat: Group I draw with France and Senegal limits their R32 path. But if Norway top the group, their knockout bracket opens significantly.',
    stat:'4.8%', statLabel:'Model win probability', highlight:false,
  },
  {
    tag:'Methodology', date:'Jun 2026',
    title:'How the EdgeIQ Model Works: Elo Ratings and 10,000 Simulations',
    excerpt:'The prediction engine combines three components. Elo ratings are calibrated on 314 matches from StatsBomb open data across six major tournaments (WC 2018, WC 2022, Euro 2020, Euro 2024, Copa América 2024, AFCON 2023) using a variable K-factor with recency weighting. Match probabilities are generated via bivariate Poisson, which corrects for the known low-score bias in standard Poisson models. Tournament outcomes are simulated 10,000 times across the full 48-team bracket including group stage, R32, QF, SF and Final. All probabilities are generated before kick-off and are immutable.',
    stat:'314', statLabel:'Matches calibrated', highlight:false,
  },
  {
    tag:'Group Analysis', date:'Jun 2026',
    title:'Group H Deep Dive: Spain\'s Manageable Draw and the Uruguay Wildcard',
    excerpt:"Spain face Cabo Verde, Saudi Arabia and Uruguay in Group H. The model gives Spain a 94% probability of advancing from the group, the second-highest advance probability of any team. Uruguay at Elo 1,890 are the only meaningful threat. Their head-to-head on June 21 (matchday 2) is the most significant Group H fixture. Uruguay have the defensive solidity to make it competitive, their 0.71 average goals conceded across calibration matches is the second-best in CONMEBOL. If Uruguay beat Spain, the group opens considerably.",
    stat:'94%', statLabel:'Spain advance probability', highlight:false,
  },
];

export default function InsightsPage() {
  useCursor();
  const [active,   setActive]   = useState(new Set());
  const [data,     setData]     = useState(null);
  const [imgReady, setImgReady] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(()=>{const t=setTimeout(()=>setImgReady(true),80);return()=>clearTimeout(t);},[]);
  useEffect(()=>{
    fetch('/api/wc2026').then(r=>r.json()).then(setData).catch(()=>{});
  },[]);
  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>400);
    window.addEventListener('scroll',fn);
    return()=>window.removeEventListener('scroll',fn);
  },[]);

  const simTop = data?.simulation?.results?.slice(0,5)||[];

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
        .ea-insights-grid{grid-template-columns:1fr!important}
        .ea-insights-sidebar{display:none!important}
        .ea-insights-articles{padding-left:20px!important;padding-right:20px!important}
        .ea-insights-featured{padding-left:20px!important;padding-right:20px!important}
      }
    `}</style>

    <div style={{background:'#080808',minHeight:'100vh',color:'#F7F5F0'}}>

      {/* Hero */}
      <section data-theme="dark" className="ea-hero">
        <div style={{position:'absolute',inset:0,background:`url('https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Mercedes_Benz_Stadium_field_view.jpg/1920px-Mercedes_Benz_Stadium_field_view.jpg') center 50%/cover no-repeat`,filter:'contrast(1.0) brightness(.95)',transform:imgReady?'scale(1)':'scale(1.06)',transition:'transform 12s ease'}} aria-hidden="true"/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(8,8,8,.06) 0%,transparent 30%,rgba(8,8,8,.85) 78%),linear-gradient(to right,rgba(8,8,8,.35),transparent 55%)'}} aria-hidden="true"/>
        <div style={{position:'absolute',left:56,top:0,bottom:0,width:2,background:'linear-gradient(to bottom,transparent 10%,#F0A500 30%,#F0A500 70%,transparent 100%)',opacity:.65}} aria-hidden="true"/>
        <div style={{position:'absolute',bottom:28,right:40,textAlign:'right',pointerEvents:'none'}}>
          <div style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:9,letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(247,245,240,.7)',marginBottom:3}}>Mercedes-Benz Stadium · World Cup 2026 Semi-Final Venue · Atlanta, Georgia</div>
          <div style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.06em',color:'rgba(247,245,240,.35)'}}>Photo: BullDawg2021 / CC BY 4.0</div>
        </div>
        <div className="ea-hero__inner">
          <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:20}}>
            <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:7.5,letterSpacing:'.18em',textTransform:'uppercase',background:'#F0A500',color:'#080808',padding:'5px 12px',borderRadius:2,display:'flex',alignItems:'center',gap:7}}>
              <span style={{width:5,height:5,borderRadius:'50%',background:'#080808',animation:'lp-blink 1.8s ease infinite'}}/>
              WC 2026 · Insights
            </span>
            <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.12em',textTransform:'uppercase',color:'rgba(247,245,240,.5)'}}>
              {ARTICLES.length} pieces · model reports · group analysis
              {data?.modelRecord?.played>0&&(
                <span style={{marginLeft:12,color:'#C8FF00',fontWeight:600}}>
                  · Model {data.modelRecord.correct}/{data.modelRecord.played} correct
                </span>
              )}
            </span>
          </div>
          <h1 style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:'clamp(72px,12vw,160px)',lineHeight:.84,margin:0}}>
            <span style={{fontFamily:"var(--font-serif,'Cormorant Garamond',serif)",fontStyle:'italic',fontWeight:300,fontSize:'.38em',color:'rgba(247,245,240,.6)',display:'block',marginBottom:'.06em'}}>Model reports &amp;</span>
            Analysis.
          </h1>
          <p style={{fontFamily:"var(--font-serif,'Cormorant Garamond',serif)",fontStyle:'italic',fontWeight:300,fontSize:'clamp(18px,1.6vw,24px)',lineHeight:1.6,color:'rgba(247,245,240,.92)',maxWidth:580,margin:'20px 0 0'}}>
            Model reports, group deep-dives and value breakdowns for World Cup 2026. Every insight is built on probability, generated before kick-off and never revised after the fact.
          </p>
        </div>
      </section>

      {/* Featured article */}
      <section data-theme="dark" className="ea-insights-featured" style={{padding:'56px 56px 40px'}}>
        <div className="ea-insights-grid" style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:64,alignItems:'start'}}>
          <div>
            <div style={{display:'flex',gap:10,marginBottom:24,flexWrap:'wrap'}}>
              {simTop.map((s,i)=>(
                <div key={s.team} style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.08em',textTransform:'uppercase',padding:'4px 10px',borderRadius:2,border:`1px solid ${i===0?'#C8FF00':'rgba(247,245,240,.1)'}`,color:i===0?'#C8FF00':'rgba(247,245,240,.45)'}}>
                  {s.team} {s.win_pct}%
                </div>
              ))}
            </div>
            <div role="button" tabIndex={0} aria-pressed={active.has(0)} style={{cursor:'pointer'}} onClick={()=>setActive(prev=>{const n=new Set(prev);n.has(0)?n.delete(0):n.add(0);return n;})}
              onKeyDown={e=>{ if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActive(prev=>{const n=new Set(prev);n.has(0)?n.delete(0):n.add(0);return n;}); } }}
              onMouseEnter={e=>e.currentTarget.style.opacity='.9'} onMouseLeave={e=>e.currentTarget.style.opacity='1'}>
              <div style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.12em',textTransform:'uppercase',color:'#C8FF00',marginBottom:12}}>
                {ARTICLES[0].tag} · {ARTICLES[0].date}
              </div>
              <h2 style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:'clamp(36px,5vw,68px)',lineHeight:.9,color:'#F7F5F0',marginBottom:20}}>
                {ARTICLES[0].title}
              </h2>
              <p style={{fontFamily:"var(--font-body,'Outfit',sans-serif)",fontWeight:200,fontSize:14,color:'rgba(247,245,240,.92)',lineHeight:1.85,maxWidth:620,marginBottom:16}}>
                {ARTICLES[0].excerpt}
              </p>
              {ARTICLES[0].excerpt2&&(
                <p style={{fontFamily:"var(--font-body,'Outfit',sans-serif)",fontWeight:200,fontSize:14,color:'rgba(247,245,240,.85)',lineHeight:1.85,maxWidth:620,marginBottom:16}}>
                  {ARTICLES[0].excerpt2}
                </p>
              )}
              {ARTICLES[0].excerpt3&&(
                <p style={{fontFamily:"var(--font-body,'Outfit',sans-serif)",fontWeight:200,fontSize:14,color:'rgba(247,245,240,.78)',lineHeight:1.85,maxWidth:620}}>
                  {ARTICLES[0].excerpt3}
                </p>
              )}
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,auto)',gap:0,marginTop:32,borderTop:'1px solid rgba(247,245,240,.1)',paddingTop:24}}>
                {[
                  {stat:ARTICLES[0].stat, label:ARTICLES[0].statLabel},
                  {stat:ARTICLES[0].stat2, label:ARTICLES[0].statLabel2},
                  {stat:ARTICLES[0].stat3, label:ARTICLES[0].statLabel3},
                ].filter(s=>s.stat).map((s,i)=>(
                  <div key={i} style={{paddingRight:32,borderRight:i<2?'1px solid rgba(247,245,240,.1)':'none',paddingLeft:i>0?32:0}}>
                    <div style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:52,color:i===0?'#C8FF00':'rgba(247,245,240,.85)',lineHeight:.9}}>{s.stat}</div>
                    <div style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(247,245,240,.4)',marginTop:6}}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar — quick stats */}
          <div className="ea-insights-sidebar" style={{display:'flex',flexDirection:'column',gap:2,paddingTop:32}}>
            <div style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.12em',textTransform:'uppercase',color:'rgba(247,245,240,.35)',marginBottom:12}}>Tournament model data</div>
            {[
              {l:'Fixtures modelled',v:data?.matchCount||72},
              {l:'Simulations run',v:'10,000'},
              {l:'Matches calibrated',v:314},
            ].map((s,i)=>(
              <div key={i} style={{padding:'16px',border:'1px solid rgba(247,245,240,.07)',background:'rgba(247,245,240,.02)'}}>
                <div style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(247,245,240,.35)',marginBottom:4}}>{s.l}</div>
                <div style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:28,color:'#F7F5F0',lineHeight:.9}}>{s.v}</div>
              </div>
            ))}
            <div style={{padding:'20px',border:'1px solid rgba(247,245,240,.07)',background:'rgba(247,245,240,.02)',marginTop:12}}>
              <div style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.12em',textTransform:'uppercase',color:'rgba(247,245,240,.35)',marginBottom:8}}>What is Elo?</div>
              <p style={{fontFamily:"var(--font-body,'Outfit',sans-serif)",fontSize:13,fontWeight:200,color:'rgba(247,245,240,.75)',lineHeight:1.85,margin:0}}>
                Elo is a dynamic rating system that measures team strength by updating ratings after each match based on expected result vs actual result. It makes underdogs gain more from surprise wins and stronger teams gain less from routine victories, which helps the model compare teams consistently and generate probabilities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Article grid */}
      <section data-theme="light" className="ea-insights-articles" style={{padding:'40px 56px 80px',background:'#F7F5F0'}}>
        <div style={{borderTop:'1px solid rgba(8,8,8,.1)',paddingTop:32}}>
          <p style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.2em',textTransform:'uppercase',color:'rgba(8,8,8,.4)',marginBottom:28}}>
            All analysis · {ARTICLES.length - 1} pieces
          </p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))',gap:2}}>
            {ARTICLES.slice(1).map((a,i)=>(
              <div key={i}
                role="button" tabIndex={0} aria-pressed={active.has(i+1)}
                style={{padding:'28px',border:'1px solid rgba(8,8,8,.08)',background:active.has(i+1)?'rgba(8,8,8,.04)':'rgba(8,8,8,.02)',cursor:'pointer',transition:'all .2s'}}
                onClick={()=>setActive(prev=>{const n=new Set(prev);n.has(i+1)?n.delete(i+1):n.add(i+1);return n;})}
                onKeyDown={e=>{ if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActive(prev=>{const n=new Set(prev);n.has(i+1)?n.delete(i+1):n.add(i+1);return n;}); } }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(240,165,0,.4)';e.currentTarget.style.background='rgba(240,165,0,.04)';}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(8,8,8,.08)';e.currentTarget.style.background=active.has(i+1)?'rgba(8,8,8,.04)':'rgba(8,8,8,.02)';}}>
                <div style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:8,letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(8,8,8,.4)',marginBottom:10}}>
                  {a.tag} · {a.date}
                </div>
                <h3 style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:22,lineHeight:.96,color:'#080808',marginBottom:14}}>{a.title}</h3>
                {active.has(i+1)&&(
                  <p style={{fontFamily:"var(--font-body,'Outfit',sans-serif)",fontWeight:300,fontSize:13,color:'rgba(8,8,8,.65)',lineHeight:1.8,marginBottom:16}}>{a.excerpt}</p>
                )}
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',borderTop:'1px solid rgba(8,8,8,.08)',paddingTop:14,marginTop:active.has(i+1)?0:14}}>
                  <div>
                    <div style={{fontFamily:"var(--font-bebas,'Bebas Neue',sans-serif)",fontSize:32,color:'#F0A500',lineHeight:.9}}>{a.stat}</div>
                    <div style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:7.5,letterSpacing:'.08em',textTransform:'uppercase',color:'rgba(8,8,8,.35)',marginTop:3}}>{a.statLabel}</div>
                  </div>
                  <span style={{fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:9,color:'rgba(8,8,8,.4)',letterSpacing:'.08em'}}>
                    {active.has(i+1)?'↑ Collapse':'↓ Read more'}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div style={{marginTop:40,fontFamily:"var(--font-mono,'DM Mono',monospace)",fontSize:9,letterSpacing:'.08em',color:'rgba(8,8,8,.38)'}}>
            Match data: <a href="https://github.com/statsbomb/open-data" target="_blank" rel="noopener noreferrer" style={{color:'rgba(8,8,8,.55)',textDecoration:'underline',textDecorationColor:'rgba(8,8,8,.25)'}}>StatsBomb Open Data</a>
          </div>
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