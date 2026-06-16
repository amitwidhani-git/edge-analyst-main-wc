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
    tag:`Match Report`, date:`15 Jun 2026`,
    title:`Spain 0–0 Cabo Verde: The Favourites Are Held. Vozinha. Unbelievable Vozinha.`,
    excerpt:`Lamine Yamal didn't start. Oyarzabal didn't touch the ball for the first 30 minutes — the longest any outfield player has gone without a touch since records began in 1966. Cabo Verde sat in a 5-4-1 so compact it was almost abstract, and Spain — reigning European champions, World Cup favourites, Elo-rated number one in the world — could not find a way through. Not even close.`,
    excerpt2:`Vozinha. Forty years old. The oldest goalkeeper at this World Cup. Made four saves of genuine quality, commanded his box, organised his back five with the authority of someone who has done this a thousand times. When Yamal came on in the second half Spain looked more dangerous — quicker, more direct — but Cabo Verde's defensive discipline never cracked. The xG finished approximately 1.8–0.1. Spain created. Cabo Verde defended. The scoreboard said 0–0.`,
    excerpt3:`The model gave Spain 66.3%. Wrong — and the biggest shock of the tournament so far. Spain's path to the final suddenly looks less straightforward. If they drop points against Uruguay on June 27 the group gets very complicated. Cabo Verde top Group H on goal difference. In their first ever World Cup game. Let that land.`,
    stat:`66.3%`, statLabel:`Spain win prob`, stat2:`0–0`, statLabel2:`Final score`, stat3:`✗`, statLabel3:`Model incorrect`,
    modelCorrect: false, highlight: false,
  },  
  {
    tag:`Match Report`, date:`15 Jun 2026`,
    title:`Belgium 1–1 Egypt: Salah Does What Salah Does. 91.9% Belgium. Wrong.`,
    excerpt:`Egypt started better. That wasn't supposed to happen. Emam Ashour opened the scoring in the first half and for a spell Belgium — ranked 9th in the world, De Bruyne pulling strings, Lukaku up front — looked rattled. The equaliser came but the winner didn't. Mostafa Shobeir in the Egyptian goal was outstanding in the second half as Belgium pressed. Egypt held on. A point that feels like two.`,
    excerpt2:`The model gave Belgium 91.9% — the second-highest confidence call of the tournament, behind only Switzerland vs Qatar. It was wrong. Mohamed Salah didn't score but his presence restructured Belgium's defensive shape entirely. Egypt were well-organised, physical, and dangerous on the counter. The xG finished 2.1–0.7 to Belgium. Belgium created. Egypt defended. Group G is now wide open.`,
    excerpt3:`All four Group G teams on one point after matchday one. Belgium face Iran on June 21. Egypt face New Zealand. Both fixtures look very different now. The model's record drops further — two big-confidence calls wrong in the same day. Group G was supposed to be Belgium's group. Tonight suggested otherwise.`,
    stat:`91.9%`, statLabel:`Belgium win prob`, stat2:`1–1`, statLabel2:`Final score`, stat3:`✗`, statLabel3:`Model incorrect`,
    modelCorrect: false, highlight: false,
  },  
  {
    tag:`Match Report`, date:`15 Jun 2026`,
    title:`Saudi Arabia 1–1 Uruguay: Al Amri Stuns La Celeste. Araújo Rescues the Point.`,
    excerpt:`Uruguay had 67% possession, 28 shots, and an xG of 1.58. Saudi Arabia had 33% possession, parked defensively, and went in 1–0 up at half time. Abdulelah Al Amri capitalised when Muslera spilled a long-range effort — the kind of moment that happens once in fifty games. Bielsa pulled Darwin Núñez off at half time and his team came out transformed, pressing from the front, creating chances in waves.`,
    excerpt2:`Maximiliano Araújo's 80th-minute equaliser was deserved. Uruguay dominated the second half entirely. But a draw is a draw. Saudi Arabia survived with extraordinary defensive organisation and a goalkeeper in the form of his life. The model gave Uruguay 81.5%. Wrong. Group H is now all four teams on one point — the same chaotic picture as Group B and Group G.`,
    excerpt3:`The 5–1 loss to USA in November looks like a one-off now rather than a form guide. Saudi Arabia's pre-tournament results — four losses in the last five — said nothing about what they'd produce on matchday one. Uruguay need to beat Cabo Verde on June 21. If they don't, the Uruguay vs Spain finale on June 27 becomes a must-win.`,
    stat:`81.5%`, statLabel:`Uruguay win prob`, stat2:`1–1`, statLabel2:`Final score`, stat3:`✗`, statLabel3:`Model incorrect`,
    modelCorrect: false, highlight: false,
  },  
  {
    tag:`Match Report`, date:`15 Jun 2026`,
    title:`Iran 2–2 New Zealand: Just Scores Twice. The All Whites Write History at SoFi.`,
    excerpt:`Elijah Just opened it. Then he scored again — running onto a perfectly weighted Chris Wood ball and slamming it in from close range. New Zealand 2–0 ahead at Los Angeles Stadium, ranked 86th in the world against a side ranked 20th. The noise from the New Zealand end was something nobody in that stadium will forget. Then Iran hit back.`,
    excerpt2:`Ghoddos found Rezaeian on the right, who curled a ball in for Mohammad Mohebi to thump into the net off the post. 2–1. Iran pushed, levelled — the exact scorer and minute weren't confirmed at the time of writing — and the final 15 minutes were as tense as anything this tournament has produced. New Zealand held on for a point. A point that, given the context, feels like a victory.`,
    excerpt3:`The model gave Iran 57.9%. Wrong. New Zealand have their first World Cup point since 2010 — when they also drew all three group games and went home unbeaten. Chris Wood, the all-time leading scorer, was outstanding. The Iran vs New Zealand group narrative now hinges on Belgium and Egypt — if Group G stays chaotic, the All Whites could yet advance as a third-placed team. An extraordinary day for New Zealand football.`,
    stat:`57.9%`, statLabel:`Iran win prob`, stat2:`2–2`, statLabel2:`Final score`, stat3:`✗`, statLabel3:`Model incorrect`,
    modelCorrect: false, highlight: false,
  },  
  {
   tag:`Match Report`, date:`15 Jun 2026`,
   title:`Sweden 5–1 Tunisia: Potter's Side Erupt. Ayari Announces Himself With a Brace.`,
   excerpt:`Nobody told Sweden they were supposed to struggle. The side that barely qualified through the play-offs, that lost five of their last ten before Graham Potter changed everything, turned up at Estadio BBVA and absolutely demolished Tunisia. Yasin Ayari opened in the 7th minute, a composed finish that set the tone. By the 59th minute it was 4–1 and the game was done.`,
   excerpt2:`The goals were extraordinary. Ayari's first, Isak's header on 30 minutes, Gyökeres pouncing on Skhiri's error after the break, Svanberg scoring with his first touch 16 seconds after coming on — and then Ayari again in the 90th+6, hammering in from the edge of the box. Tunisia pulled one back through Rekik just before half time. It was brief. Sweden were in a completely different class.`,
   excerpt3:`The model said Sweden 60.3% — correct. But 5–1 was beyond any projection. Sweden are now the second team to score three goals from outside the box in a single World Cup match since 1966. Group F after matchday one: Sweden three points, Netherlands and Japan one point each, Tunisia zero. Graham Potter's side face Japan next. That fixture looks very different after today.`,
   stat:`60.3%`, statLabel:`Sweden win prob`, stat2:`5–1`, statLabel2:`Final score`, stat3:`✓`, statLabel3:`Model correct`,
   modelCorrect: true, highlight: false,
  },
  {
   tag:`Match Report`, date:`15 Jun 2026`,
   title:`Côte d'Ivoire 1–0 Ecuador: Amad Off the Bench. 90th Minute. Model Wrong.`,
   excerpt:`Ecuador hit the woodwork three times. Three. John Yeboah, Alan Minda, Enner Valencia — all of them struck the frame of the goal at Lincoln Financial Field and walked away with nothing. Ivory Coast had one shot on target all game. It went in. 90th minute. Amad Diallo, two minutes off the bench, calm finish into the bottom corner. Football.`,
   excerpt2:`The model gave Ecuador 53.9% — the correct side on paper, and the performance backed it. Ecuador dominated possession, pressed high, created the better chances across 90 minutes. The xG finished approximately 1.8–0.3 to Ecuador. Ivory Coast won 1–0. The model was wrong. The woodwork was wrong. Ivory Coast were right where it mattered.`,
   excerpt3:`This is Ivory Coast's first World Cup win in 12 years. Amad Diallo becomes only the fourth substitute to score for Ivory Coast at a World Cup. Group E is now Ivory Coast three points, Germany three points, Ecuador and Curaçao on zero. Ecuador need to beat Germany on June 21 just to stay relevant. That's a tall order against a side who just put seven past Curaçao.`,
   stat:`53.9%`, statLabel:`Ecuador win prob`, stat2:`1–0`, statLabel2:`Final score`, stat3:`✗`, statLabel3:`Model incorrect`,
   modelCorrect: false, highlight: false,
  },  
  {
    tag:`Match Report`, date:`14 Jun 2026`,
    title:`Netherlands 2–2 Japan: Kamada Breaks Dutch Hearts in the 88th. Japan Do It Again.`,
    excerpt:`Japan were supposed to lose this. Ranked 19th, missing Xavi Simons, against a Netherlands side with Virgil van Dijk, Frenkie de Jong and Cody Gakpo. The model said 46.3% Netherlands. Japan spent 45 minutes making that look about right. Then the second half happened. Three goals in 14 minutes, a 2–1 lead for the Dutch, and then — of course — Japan equalised in the 88th minute. Daichi Kamada. Header from a Junya Ito corner. 2–2. Dallas lost its mind.`,
    excerpt2:`Van Dijk headed in from Gravenberch's cross on 50 minutes — the big Liverpool defender doing what he does. Keito Nakamura equalised seven minutes later with a shot that deflected off Van Hecke past his Brighton teammate Verbruggen. Summerville restored the Dutch lead on 64 minutes with a curling effort that kissed the inside of the post — his first ever international goal, at the World Cup. Japan kept coming. Kamada found space at the back post. 2–2.`,
    excerpt3:`The model predicted Netherlands. Draw. The model was wrong on the outcome but the 46.3%/26.5%/27.2% split was honest — this was always going to be tight. Japan are now unbeaten in nine matches against European opponents. The Netherlands had 60% possession, six shots on target. Japan had Zion Suzuki. Group F is now Netherlands and Japan both on one point, Sweden and Tunisia to play later tonight. The group is completely open after matchday one.`,
    stat:`46.3%`, statLabel:`Netherlands win prob`, stat2:`2–2`, statLabel2:`Final score`, stat3:`✗`, statLabel3:`Model incorrect`,
    modelCorrect: false, highlight: false,
  },
  {
    tag:`Match Report`, date:`14 Jun 2026`,
    title:`Germany 7–1 Curaçao: The Four-Time Champions Are Back. Havertz Bags a Brace in Houston.`,
    excerpt:`Six minutes. That's how long it took Germany to remind the world they mean business. Felix Nmecha, played in beautifully by Florian Wirtz, slotted into the top corner and NRG Stadium erupted. Germany came to this World Cup carrying the baggage of two consecutive group-stage exits. Against Curaçao, they unloaded it all.`,
    excerpt2:`Curaçao had their moment — Livano Comenencia's equaliser in the 21st minute was historic, the first-ever World Cup goal for the smallest nation in the tournament's history, and the noise from their supporters was something. Then Schlotterbeck headed in from a corner, Havertz converted a penalty in stoppage time, Musiala made it four seconds into the second half and that was that. Brown, Undav and Havertz again completed the rout. 26 shots, 12 on target, 57% possession. A statement.`,
    excerpt3:`The model gave Germany 64.1%. Correct — though 7–1 was beyond even the most optimistic German projection. The xG finished approximately 4.2–0.3. Curaçao were brave, organised, and completely outclassed. Dick Advocaat, 78 years old, watched from the dugout with quiet dignity. Germany face Ivory Coast next on June 20 — a proper test of whether this is a genuine contender or just a big number against a tiny island.`,
    stat:`64.1%`, statLabel:`Germany win prob`, stat2:`7–1`, statLabel2:`Final score`, stat3:`✓`, statLabel3:`Model correct`,
    modelCorrect: true, highlight: false,
  },
  {
    tag:`Match Report`, date:`14 Jun 2026`,
    title:`Australia 2–0 Turkey: Irankunda Torches the Return. Turkey's 24 Years Ends in Embarrassment.`,
    excerpt:`They waited 24 years for this. They got Nestory Irankunda running in behind on the counter. Twice. Australia were sharper, hungrier and more organised than a Turkey side who arrived in Vancouver with genuine belief and left with nothing. Irankunda's opener — a burst of pace that the Turkish backline simply couldn't live with — was the moment the night turned. Connor Metcalfe's late second was the final nail.`,
    excerpt2:`Turkey had moments. Yıldız forced three saves. Güler looked dangerous in pockets. But they never really hurt Australia, and Tony Popovic's side knew exactly what they were doing. Compact. Physical. Clinical on the break. Everything Popovic has built over the last 18 months in one 90-minute performance.`,
    excerpt3:`The model gave Australia 38.7%. Correct. But the scoreline flatters Turkey — 2–0 felt comfortable by the end. Group D is now Australia and USA on three points, Turkey and Paraguay on zero. Turkey need to beat Paraguay on June 20. If they don't, their World Cup return becomes the story of a romantic trip that lasted exactly one game.`,
    stat:`38.7%`, statLabel:`Australia win prob`, stat2:`2–0`, statLabel2:`Final score`, stat3:`✓`, statLabel3:`Model correct`,
    modelCorrect: true, highlight: true,
  },
  {
    tag:`Match Report`, date:`13 Jun 2026`,
    title:`Haiti 0–1 Scotland: McGinn Deflects Scotland Into History. 36 Years of Hurt, Gone.`,
    excerpt:`Ten thousand two hundred and forty-four days. That's how long Scotland went without scoring at a World Cup. John McGinn ended it in the 28th minute at Gillette Stadium, a deflected shot that looped over Placide and into the corner. The Tartan Army lost their minds. Steve Clarke just smiled and turned back to his notes.`,
    excerpt2:`Haiti were better than people expected. They pressed. They moved. Frantzdy Pierrot's header in the 85th minute struck the post and genuinely terrified the Scotland end. Ben Gannon-Doak was the best player on the pitch — 20 years old, Bournemouth, completely fearless. Remember that name.`,
    excerpt3:`Scotland top Group C. Properly top it. Brazil and Morocco drew, Scotland won. The model said 52% — correct. Next up: Morocco in Boston. The model gives Scotland 35% for that one. We'll take it. Six weeks ago nobody outside Glasgow thought Scotland would go to the World Cup. Three points in, they're the ones with the head start.`,
    stat:`52.0%`, statLabel:`Scotland win prob`, stat2:`0–1`, statLabel2:`Final score`, stat3:`✓`, statLabel3:`Model correct`,
    modelCorrect: true, highlight: false,
  },
  {
   tag:`Match Report`, date:`13 Jun 2026`,
   title:`Brazil 1–1 Morocco: The Atlas Lions Hold the Five-Times Champions. Model Wrong.`,
   excerpt:`Morocco went to MetLife Stadium and played Brazil off the park for the first half hour. Not hung on. Not parked the bus. Actually played. Saibari's opener was everything — composed, intelligent, the goal of a team who know exactly what they're doing. That 2022 run wasn't a fluke. This Morocco side is genuinely frightening.`,
   excerpt2:`Vinícius equalised on 32 minutes and for a spell Brazil looked like Brazil. But Morocco never looked rattled. They reorganised, sat slightly deeper, and spent the second half asking questions of their own. The xG finished 1.8–1.4 to Brazil. Not the comfortable Seleção win the pre-match noise suggested — and not the Brazil win the model predicted.`,
   excerpt3:`The model gave Brazil a 59.3% win probability. Wrong. A draw was the fairest result on the night and Morocco fully deserved their point. Group C is Scotland first on three points, Brazil and Morocco level on one, Haiti bottom. The model now has 3 correct from 6 on matchday one — a humbling start for what looked like a set of straightforward early predictions.`,
   stat:`59.3%`, statLabel:`Brazil win prob`, stat2:`1–1`, statLabel2:`Final score`, stat3:`✗`, statLabel3:`Model incorrect`,
   modelCorrect: false, highlight: false,
  },
  {
    tag:`Match Report`, date:`13 Jun 2026`,
    title:`Qatar 1–1 Switzerland: Muheim Ruins Everything in the 90th. The Model's Costliest Miss.`,
    excerpt:`Switzerland led for 90 minutes. Embolo's penalty, composed as you like, 17th minute. Then Muheim turned a corner into his own net in stoppage time and the Swiss bench looked like someone had cancelled Christmas. A 93.5% win probability. The biggest call the model has made. Wrong.`,
    excerpt2:`The xG finished 0.3–2.1 to Switzerland. Switzerland created. Switzerland dominated. Switzerland drew. Football does that. Khoukhi darted to the near post, Muheim shaped to clear, the ball went the wrong way. Three months from now Muheim will not be able to walk into a Swiss restaurant without someone bringing it up.`,
    excerpt3:`Qatar earn their first ever World Cup point. Not from the 2022 tournament they hosted, where they lost all three games. This one, away from home, as the genuine underdogs. All four Group B teams on one point. It's a mess. A brilliant, chaotic mess. The model says Switzerland still advance. But matchday one was a warning.`,
    stat:`93.5%`, statLabel:`Switzerland win prob`, stat2:`1–1`, statLabel2:`Final score`, stat3:`✗`, statLabel3:`Model incorrect`,
    modelCorrect: false, highlight: false,
  },
  {
    tag:`Match Report`, date:`13 Jun 2026`,
    title:`USA 4–1 Paraguay: America's Party Has Started. Balogun Announces Himself.`,
    excerpt:`Folarin Balogun scored twice in the first half and the 80,000 inside Los Angeles Stadium lost all sense of restraint. The US haven't scored four in a World Cup game. Ever. Until now. Bobadilla's own goal in the 7th minute set the tone — pressed into error inside the opening ten minutes — and from that point the game was over as a contest.`,
    excerpt2:`Paraguay did pull one back through Mauricio on 73 minutes, gave themselves a moment to dream of something remarkable. Then Gio Reyna put his foot through it in injury time, outside of the boot, top corner. Chris Richards completed 83 of 83 passes. A US performance that will feature in highlight reels for years.`,
    excerpt3:`The model said 45.2% USA win. Correct — though even we didn't see a four-goal margin coming. The Elo boost of +100 for co-host status looks conservative now. Group D is wide open and the USA have made their statement. Their next test: Australia. A proper game. A proper occasion.`,
    stat:`45.2%`, statLabel:`USA win prob`, stat2:`4–1`, statLabel2:`Final score`, stat3:`✓`, statLabel3:`Model correct`,
    modelCorrect: true, highlight: false,
  },
  {
    tag:`Match Report`, date:`12 Jun 2026`,
    title:`Canada 1–1 Bosnia: The Underdog Reads the Script. Model Takes Its First L.`,
    excerpt:`Bosnia came to BMO Field, went a goal down inside 21 minutes through a Kolašinac set-piece routine that looked rehearsed to the second, and then defended like their lives depended on it. Canada had 70% possession. Canada had the chances. Canada couldn't score. The model said 66%. Football said no.`,
    excerpt2:`Larin changed it. Two minutes off the bench, 78th minute, a sharp turn in a tight space and a deflected finish that Vasilj couldn't keep out. Canada deserved that. The xG finished 1.25–0.98 to the hosts. The scoreboard, though, said 1–1.`,
    excerpt3:`Bosnia did exactly what a 14.5% underdog has to do — take their one moment, defend everything else, leave with a point. Both teams on one point in Group B, all four sides level after matchday one. Canada host Switzerland next. Bosnia face Qatar. Two must-win games in very different contexts.`,
    stat:`66.0%`, statLabel:`Canada win prob`, stat2:`1–1`, statLabel2:`Final score`, stat3:`✗`, statLabel3:`Model incorrect`,
    modelCorrect: false, highlight: false,
  },
  {
    tag:`Match Report`, date:`12 Jun 2026`,
    title:`South Korea 2–1 Czechia: The Comeback. Hwang Levels, Oh Wins It Late.`,
    excerpt:`Czechia led. Then Hwang In-beom equalised and the Korean end at Estadio Guadalajara found another gear entirely. Oh Hyeon-gyu came off the bench, found a yard on the edge of the box, and drove it past Staněk in the 83rd minute. South Korea came from behind and won. Exactly as they've been doing for the entire qualifying campaign — late, dramatic, never quite comfortable.`,
    excerpt2:`Krejci's opener was a quality goal, a movement that the Korean backline simply lost track of. But Czechia's problem is that their best is a 1–0 lead at half time, and that was never going to be enough. South Korea's Elo of 1,755 versus Czechia's 1,605 — the 150-point gap was always going to show eventually.`,
    excerpt3:`Model said South Korea. 62.7%. Correct. Group A is Mexico and South Korea level on three points, South Africa and Czechia on zero. Czechia need to beat South Africa on June 18 just to stay relevant. A hard ask for a side that looked organised but lacked the attacking quality to hurt a team of South Korea's calibre.`,
    stat:`62.7%`, statLabel:`South Korea win prob`, stat2:`2–1`, statLabel2:`Final score`, stat3:`✓`, statLabel3:`Model correct`,
    modelCorrect: true, highlight: false,
  },
  {
    tag:`Match Report`, date:`11 Jun 2026`,
    title:`Mexico 2–0 South Africa: Azteca Rocks. El Tri Deliver Exactly What the Model Asked For.`,
    excerpt:`87,000. Altitude. The most intimidating opening fixture any team could draw in this tournament. South Africa had no answer for it. Mexico were composed, physical and clinical — everything a host nation needs to be on opening night. Raúl Jiménez was the difference. Two goals, complete authority.`,
    excerpt2:`South Africa's pre-tournament form told the story before a ball was kicked. Two draws, a defeat in their last four. Their Elo of 1,591 makes them the weakest team in Group A and the performance confirmed it. The xG finished 2.3–0.4. They barely existed as an attacking force.`,
    excerpt3:`Model said Mexico 74.8%. Correct. The +150 Elo host boost was validated from the first whistle. Mexico face Czechia next — another game the model heavily fancies them to win. South Africa face South Korea. A near-impossible task. The Group A picture is already becoming clear.`,
    stat:`74.8%`, statLabel:`Mexico win prob`, stat2:`2–0`, statLabel2:`Final score`, stat3:`✓`, statLabel3:`Model correct`,
    modelCorrect: true, highlight: false,
  },
  {
    tag:`Model Report`, date:`Jun 2026`,
    title:`Spain at 37%: The Model's Favourite and Why the Market Has Already Caught Up`,
    excerpt:`Elo 2,171. Euro 2024 winners. Eighteen months unbeaten before the tournament. The model ran 10,000 simulations and Spain came out on top 37% of them. France were next at 12.5%. That gap tells you everything about where the model rates this Spain side. The problem is the bookmakers agree — Spain are fully priced at around 4/1 and there's no value left on the outright.`,
    excerpt2:`The edge, if it exists, is in the group stage. Group H contains Cabo Verde, Saudi Arabia and Uruguay. The model gives Spain 94% to advance. The question is seeding — if Spain drop points and finish second, their R32 draw shifts from a CONCACAF qualifier to a potential CONMEBOL runner-up. That path difference is worth roughly 4 percentage points of tournament probability. Don't get complacent about the Uruguay game on June 21.`,
    stat:`37%`, statLabel:`Tournament win prob`, stat2:`2,171`, statLabel2:`Spain Elo rating`, stat3:`94%`, statLabel3:`Group advance prob`, highlight: false,
  },
  {
    tag:`Dark Horse`, date:`Jun 2026`,
    title:`Norway at 60/1: Haaland's Side Are Criminally Mispriced and Here Is the Data`,
    excerpt:`Norway's Elo is 1,922. Higher than Germany. Higher than Belgium. Higher than Portugal. The bookmakers have them at 2–3% tournament probability, roughly 40/1 to 60/1. The model says 4.8%. That gap, at those odds, is meaningful. Norway scored 28 goals in 10 qualifying games. They play through Haaland and they play fast. Group I with France and Senegal is tough but not impossible.`,
    excerpt2:`The scenario: Norway beat Iraq in the opener, draw with Senegal, face France needing a result. The model says that path plays out roughly 30% of the time. If Norway top the group, the knockout bracket opens considerably. Toppling France on matchday three, at the prices, is one of the most interesting outright plays in the market right now.`,
    stat:`4.8%`, statLabel:`Model win prob`, stat2:`60/1`, statLabel2:`Available price`, stat3:`+EV`, statLabel3:`At current odds`, highlight: false,
  },
  {
    tag:`Value Analysis`, date:`Jun 2026`,
    title:`Colombia at 9%: The Model's Biggest Outright Edge Before a Ball Is Kicked`,
    excerpt:`The model rates Colombia third in the tournament. Elo 1,998. 71% win rate across calibration matches. Bookmakers have them at 8–9% tournament probability. The model says 12.4%. A 4-point gap at prices around 10/1 to 12/1 is the most positive EV outright position in the entire tournament. Group K draws Portugal, Colombia, Uzbekistan and Congo DR. The June 27 group decider between Colombia and Portugal is circled.`,
    excerpt2:`Colombia qualified comfortably from CONMEBOL. James Rodríguez is no longer the story — this is a properly deep, athletic squad built around Luis Díaz and Jhon Córdoba. If they finish second to Portugal in the group, their R32 draw is very manageable. The model gives them 68% to reach the last 16.`,
    stat:`+4.4pp`, statLabel:`Model vs market gap`, stat2:`12.4%`, statLabel2:`Model win prob`, stat3:`68%`, statLabel3:`R16 probability`, highlight: false,
  },
  {
    tag:`Methodology`, date:`Jun 2026`,
    title:`How EdgeIQ Works: Elo, Poisson and Why We Never Change a Prediction After Kick-Off`,
    excerpt:`The model has two components. First, Elo ratings built from 314 matches of StatsBomb open data — WC 2018, WC 2022, Euro 2020, Euro 2024, Copa América 2024, AFCON 2023 — weighted by competition and recency. Recent results count more. World Cup matches count more than friendlies. Host nations get a boost: USA and Canada +100, Mexico +150, reflecting altitude and crowd advantage.`,
    excerpt2:`Second, match probabilities via bivariate Poisson — the same framework professional bookmakers use — which fixes the low-scoring bias in standard Poisson models. You'll notice our draw probabilities are slightly higher than most models. That's intentional. Draws are systematically underpriced in football betting markets. Every prediction is locked before kick-off. If we're wrong we say we're wrong. No revisions, no asterisks.`,
    stat:`314`, statLabel:`Matches calibrated`, stat2:`10,000`, statLabel2:`Tournament simulations`, stat3:`6/8`, statLabel3:`Correct so far`, highlight: false,
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
