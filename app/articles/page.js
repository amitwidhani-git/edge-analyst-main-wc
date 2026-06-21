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
    tag:`Match Report`, date:`21 Jun 2026`,
    title:`Tunisia 0–4 Japan: Eliminated. Ueda Brace Sends the Samurai Blue Top of the Group.`,
    excerpt:`Four minutes. Kamada flicked in Nakamura's left-wing cross at the near post and Tunisia, already reeling from a 5-1 opening day mauling by Sweden, were behind before they'd settled. Hervé Renard, appointed less than a week earlier after Sabri Trabelsi's sacking, had no answer. Dahmen brilliantly clawed away a close-range Tomiyasu effort but could do nothing about what followed.`,
    excerpt2:`Ayase Ueda's 31st-minute strike from 18 yards nestled into the bottom corner to make it 2-0 at the break — Japan utterly dominant, slick interplay carving Tunisia open at will. Ito rolled in a third in the 69th minute, and seven minutes from time Ueda headed home a Sano cross for his second of the night and Japan's fourth. Tunisia finished with an xG of just 0.05 from two shots all match — a chastening, season-defining collapse for a side that won African qualifying without conceding a single goal.`,
    excerpt3:`The model gave Japan 51.5% — correct, though the manner of victory exceeded every projection. Japan move level with Netherlands on four points at the top of Group F, both sides with identical goal difference. Tunisia are eliminated with one game still to play, the first team confirmed out of the tournament. They face Netherlands on June 25 in a dead rubber. Japan finish their group against Sweden in what is now a genuine top-of-the-table decider.`,
    stat:`51.5%`, statLabel:`Japan win prob`, stat2:`0–4`, statLabel2:`Final score`, stat3:`✓`, statLabel3:`Model correct`,
    modelCorrect: true, highlight: true,
  },
  {
    tag:`Match Report`, date:`21 Jun 2026`,
    title:`Ecuador 0–0 Curaçao: Eloy Room Writes History Again. The Smallest Nation Make Their Point.`,
    excerpt:`Ecuador dominated. 77.1% pre-match favourites, an Elo gap of nearly 500 points, Enner Valencia and Moisés Caicedo pulling the strings against a Curaçao side appearing at their first ever World Cup with a population smaller than most Premier League stadiums hold. None of the pre-match arithmetic mattered once the whistle blew. Curaçao defended their box with total discipline and refused to be moved.`,
    excerpt2:`Goalkeeper Eloy Room was the difference. Standout saves throughout, commanding his area, organising a back line built around PSV pair Bazoer and Obispo with the calm of a side managed by 78-year-old Dick Advocaat, the oldest head coach at this World Cup. Ecuador created chance after chance and could find no way through. The result means the smallest nation ever to qualify for a World Cup became the smallest ever to earn a point at the tournament.`,
    excerpt3:`The model gave Ecuador 77.1% — wrong, joining Spain's stalemate with Cabo Verde as one of the tournament's defining defensive performances by a minnow. Group E is now Germany six points and through, Côte d'Ivoire three, Ecuador and Curaçao both on one. Côte d'Ivoire face Curaçao on June 25 knowing victory secures their own progression. Ecuador must beat Germany to have any realistic hope of advancing.`,
    stat:`77.1%`, statLabel:`Ecuador win prob`, stat2:`0–0`, statLabel2:`Final score`, stat3:`✗`, statLabel3:`Model incorrect`,
    modelCorrect: false, highlight: false,
  },  
  {
    tag:`Match Report`, date:`20 Jun 2026`,
    title:`Germany 2–1 Côte d'Ivoire: Undav Wins It Late. The Ivorians Push Germany All the Way.`,
    excerpt:`Franck Kessié gave Côte d'Ivoire a stunning half-time lead — a disciplined defensive performance from the Ivorians, who absorbed pressure for 45 minutes before striking on the counter. Germany had a goal disallowed by VAR for offside and missed chances through Havertz and Musiala. At the break it was Côte d'Ivoire 1, Germany 0 — a result that would have been a genuine shock given the 7-1 demolition of Curaçao in their opener.`,
    excerpt2:`Germany pushed hard in the second half and eventually found a way through, levelling to set up a tense finish. Both sides traded chances late on — Amiri tested Yahia Fofana, who continued his excellent tournament — before substitute Deniz Undav settled it. Felix Nmecha, increasingly influential off the bench in both German matches, picked him out with a defence-splitting pass, and Undav turned and finished from inside the area. Bedlam at the Toronto Stadium.`,
    excerpt3:`The model gave Germany 66.4% — correct, but the Ivorians made them work for every inch of it. Group E is now Germany six points, Côte d'Ivoire three, Ecuador and Curaçao still searching for their first points. Germany have now scored 9 goals in two matches. Côte d'Ivoire remain well-placed for a knockout spot but face Curaçao next knowing anything but a win complicates their path.`,
    stat:`66.4%`, statLabel:`Germany win prob`, stat2:`2–1`, statLabel2:`Final score`, stat3:`✓`, statLabel3:`Model correct`,
    modelCorrect: true, highlight: false,
  },  
  {
    tag:`Match Report`, date:`20 Jun 2026`,
    title:`Netherlands 5–1 Sweden: Brobbey and Gakpo Score Twice Each. Koeman's Gamble Pays Off.`,
    excerpt:`Ronald Koeman sprang a surprise — Brian Brobbey ahead of Crysencio Summerville, the scorer in their opening draw with Japan. The decision was vindicated inside five minutes. Brobbey laid off to Reijnders, who swept it left for Gakpo to cross low, and Brobbey poked it home. The second was almost a carbon copy — Dumfries crossing low from the right, Brobbey prodding in again. 2-0 inside 17 minutes.`,
    excerpt2:`Sweden actually finished the first half well — Lagerbielke had a goal ruled out for offside right before the break — and for a moment looked capable of a response. Instead Netherlands killed the game in ten second-half minutes. Gakpo tapped in after a Dumfries assist, then drilled home a second after good work from Summerville. Elanga pulled one back for Sweden on the counter but it was a footnote. Summerville rounded it off in the 89th. Netherlands finished with an xG of 2.47 to Sweden's 0.98 — total control from start to finish.`,
    excerpt3:`The model gave Netherlands 61.1% — correct, though 5-1 exceeded any pre-match projection. After the draw with Japan, this was the response Koeman needed. Netherlands top Group F on goal difference, level on four points with Sweden after their own opening win over Tunisia. Japan and Tunisia meet in the other Group F fixture — both knowing a win keeps their own knockout hopes alive.`,
    stat:`61.1%`, statLabel:`Netherlands win prob`, stat2:`5–1`, statLabel2:`Final score`, stat3:`✓`, statLabel3:`Model correct`,
    modelCorrect: true, highlight: true,
  },
  {
    tag:`Match Report`, date:`20 Jun 2026`,
    title:`Turkey 0–1 Paraguay: A Minute In, Game Over. Turkey's Return Ends in Group Stage Elimination.`,
    excerpt:`Sixty-something seconds. That's all Paraguay needed. A goal so early that most of the Santa Clara crowd were still finding their seats when the net rippled. Turkey, fresh off a heartbreaking defeat to Australia, needed a response from the first whistle. Instead they spent the entire match chasing the game, dominating territory and possession but finding Paraguay's low block utterly impenetrable.`,
    excerpt2:`Turkey held an extraordinary 81-19% share of possession for long stretches and pressed relentlessly through Yıldız, Güler and Çalıkanoğlu. None of it mattered. Paraguay, after their 4-1 thrashing by USA in the opener, set up to defend everything and counter nothing — a backs-to-the-wall performance that delivered maximum reward. Turkey's quality never translated into the finishing touch their dominance demanded.`,
    excerpt3:`The model gave Turkey 66.7% — wrong, and a costly one. This result eliminates Turkey from knockout contention with one game still to play against USA. Their extraordinary 24-year wait to return to the World Cup ends not with the romance many hoped for but with an early exit. Paraguay's win means USA have now clinched top spot in Group D outright. Turkey's tournament is over before the final round even kicks off.`,
    stat:`66.7%`, statLabel:`Turkey win prob`, stat2:`0–1`, statLabel2:`Final score`, stat3:`✗`, statLabel3:`Model incorrect`,
    modelCorrect: false, highlight: false,
  }, 
  {
    tag:`Match Report`, date:`20 Jun 2026`,
    title:`Brazil 3–0 Haiti: Cunha's Brace, Vinícius Again. Ancelotti Gets His Response.`,
    excerpt:`After a draw against Morocco that drew criticism of his methods, Carlo Ancelotti needed a response. He got one inside the first half. Matheus Cunha scored twice and Vinícius Júnior added a third as Brazil tore through Haiti with the kind of ruthless first-half football that justifies their pre-tournament billing as genuine contenders. By half time the game was already decided.`,
    excerpt2:`Haiti, the smallest footballing nation at this World Cup by population, competed with real heart — their press disrupted Brazil's rhythm for periods, and they held their own in possession battles in midfield. But the gulf in individual quality told. Brazil finished with an xG of 1.50 to Haiti's 0.25, and Alisson was barely required to make a save all afternoon.`,
    excerpt3:`The model gave Brazil 77.9% — correct, and the manner of victory will ease growing pressure on Ancelotti after the Morocco draw. Brazil move level with Morocco on four points at the top of Group C. Haiti, who beat Scotland to history just one week ago, are eliminated from knockout contention but can still play spoiler against Morocco on June 24. A heartbreaking but proud first World Cup campaign in 52 years draws to its conclusion.`,
    stat:`77.9%`, statLabel:`Brazil win prob`, stat2:`3–0`, statLabel2:`Final score`, stat3:`✓`, statLabel3:`Model correct`,
    modelCorrect: true, highlight: false,
  },
  {
    tag:`Match Report`, date:`19 Jun 2026`,
    title:`Scotland 0–1 Morocco: Saibari Inside 70 Seconds. The Tartan Army's Wait for a Second Win Continues.`,
    excerpt:`Seventy seconds. That's all it took. Ismael Saibari latched onto a loose ball inside the box and rifled it past Gunn before most of the Boston crowd had settled into their seats. Scotland, riding the high of their historic opening win over Haiti, were rocked before they'd had a single touch of consequence. Morocco, AFCON champions, Arab Cup winners, simply did what good teams do — punished the slow start ruthlessly.`,
    excerpt2:`Scotland responded well after the shock. McGinn and McTominay pushed Morocco back for long spells, Gannon-Doak causing problems on the flank again. But Bounou was rarely seriously tested, and Morocco's defensive shape — the same discipline that frustrated Brazil for an hour in their opener — never cracked. Scotland's best chance came from a corner that flashed just wide in the second half. So close to forcing a leveller they barely deserved on the balance of play.`,
    excerpt3:`The model gave Morocco 42.6% — correct, the highest single outcome in a genuinely tight three-way split. Group C now has Brazil and Morocco level on four points after Brazil's own win later in the day, Scotland on three, Haiti eliminated. Scotland face Brazil on June 24 — win and they're through. Morocco face Haiti in a fixture they should win comfortably. Group C goes to the wire.`,
    stat:`42.6%`, statLabel:`Morocco win prob`, stat2:`0–1`, statLabel2:`Final score`, stat3:`✓`, statLabel3:`Model correct`,
    modelCorrect: true, highlight: false,
  },
  {
    tag:`Match Report`, date:`19 Jun 2026`,
    title:`USA 2–0 Australia: No Pulisic, No Problem. The Hosts Clinch Knockout Qualification.`,
    excerpt:`Christian Pulisic didn't even make the bench. Tony Popovic had called USA's depth a "wonderful challenge" to face in their own backyard, and for a half it looked like Australia might cause real problems. Then the hosts settled, found their rhythm, and led 2–0 at half time. Seattle never doubted the outcome from there.`,
    excerpt2:`Folarin Balogun and Gio Reyna — the two standout performers from the Paraguay demolition — were involved again as USA controlled the game from front to back. Australia, missing the suspended Irankunda after his heroics against Turkey, struggled to create clear chances against an organised American back line. Mathew Ryan was kept relatively busy but USA's quality in the final third proved decisive once more.`,
    excerpt3:`The model gave USA 61.9% — correct. USA become the second team, after Mexico, to clinch knockout stage qualification, sitting on six points from two games with a Turkey clash still to come. Australia remain on three points and well-placed for second, needing results against Paraguay to secure their own passage. The USA's tournament so far: two wins, six goals scored, one conceded. Genuinely ominous form for a host nation.`,
    stat:`61.9%`, statLabel:`USA win prob`, stat2:`2–0`, statLabel2:`Final score`, stat3:`✓`, statLabel3:`Model correct`,
    modelCorrect: true, highlight: true,
  },
  {
    tag:`Match Report`, date:`18 Jun 2026`,
    title:`Mexico 1–0 South Korea: Romo's Strike and a Goalkeeping Howler Send El Tri Through First.`,
    excerpt:`A tight, cagey first half produced just five shots and 0.22 combined xG between the sides before the game opened up after the break. Luis Romo broke the deadlock in the 50th minute in front of a raucous Estadio Akron crowd in Guadalajara, with the earlier Czechia-South Africa draw having set up a winner-takes-top-spot scenario for the late kick-off.`,
    excerpt2:`South Korean goalkeeper Kim Seung-gyu came rushing off his line to claim an innocuous high ball, only to land on top of one of his own defenders and spill it — the kind of error that defines tight knockout-stakes football. South Korea pushed hard for an equaliser in the closing stages but couldn't find a way through a well-organised Mexican defence.`,
    excerpt3:`The model gave Mexico 69.6% — correct, the host nation's +150 Elo boost and a 253-point gap over South Korea fully justified. Mexico become the first team to secure progression to the knockout stage at this World Cup, sitting on six points from two games with a perfect defensive record. South Korea remain on three points and well-placed but now face a tense final round against Czechia to confirm their own passage.`,
    stat:`69.6%`, statLabel:`Mexico win prob`, stat2:`1–0`, statLabel2:`Final score`, stat3:`✓`, statLabel3:`Model correct`,
    modelCorrect: true, highlight: false,
  },
  {
    tag:`Match Report`, date:`18 Jun 2026`,
    title:`Canada 6–0 Qatar: Jonathan David's Hat-Trick. The Co-Hosts Announce Themselves in Vancouver.`,
    excerpt:`Jonathan David scored a hat-trick as Canada delivered a historic 6-0 demolition of Qatar in Vancouver — the most emphatic win of the tournament so far.  Canada, who had needed a stoppage-time Larin equaliser just to draw their opener against Bosnia, were a completely different side here — sharp, ruthless, and clinical in front of goal from the opening exchanges.`,
    excerpt2:`The only sour note was a reckless Qatari challenge that left Ismaël Koné facing a potentially serious injury  — a worrying moment for the co-hosts amid an otherwise perfect night. Qatar, who had so memorably snatched a draw against Switzerland with a stoppage-time own goal, found no such fortune here. Canada's front line tore through them at will.`,
    excerpt3:`The model gave Canada 77.3% — correct, but few would have predicted the six-goal margin. Group B is now Canada four points and a commanding goal difference, with Switzerland on three after their own big win. Canada face Switzerland on June 24 in what looks set to be the match that decides top spot in the group. David's hat-trick puts him firmly in the Golden Boot conversation.`,
    stat:`77.3%`, statLabel:`Canada win prob`, stat2:`6–0`, statLabel2:`Final score`, stat3:`✓`, statLabel3:`Model correct`,
    modelCorrect: true, highlight: true,
  },
  {
    tag:`Match Report`, date:`18 Jun 2026`,
    title:`Switzerland 4–1 Bosnia-Herzegovina: The Swiss Find Their Cutting Edge After Frustration.`,
    excerpt:`Switzerland controlled 68% possession and completed 322 accurate passes in a first half that ended goalless, Granit Xhaka pulling the strings as Bosnia defended with discipline, recording 35 clearances to keep the scoreline blank at the break.  Both sides arrived having drawn frustrating openers — Switzerland denied by a stoppage-time Qatar own goal, Bosnia having led Canada before being pegged back. Both needed a win.`,
    excerpt2:`The breakthrough came after the break and once it arrived, the floodgates opened. Embolo, fresh from his penalty against Qatar, was again involved as Switzerland's quality told in the final third. Bosnia pulled one back but it was a consolation in a game Switzerland controlled almost throughout. 4-1 reflects the gulf once the Swiss found their range.`,
    excerpt3:`The model gave Switzerland 52.4% — correct, though the margin exceeded expectations. Group B remains a genuine four-way contest: Canada lead on four points after their own emphatic win, Switzerland on three, Bosnia and Qatar on one each. Switzerland face Canada on June 24 in what is now a likely group decider.`,
    stat:`52.4%`, statLabel:`Switzerland win prob`, stat2:`4–1`, statLabel2:`Final score`, stat3:`✓`, statLabel3:`Model correct`,
    modelCorrect: true, highlight: false,
  },
  {
    tag:`Match Report`, date:`18 Jun 2026`,
    title:`Czechia 1–1 South Africa: Sadilek's Six-Minute Opener. Mokoena's Late Penalty Saves Bafana Bafana.`,
    excerpt:`Michal Sadilek scored the earliest goal of the entire tournament — inside six minutes, a slick first-time finish from Sojka's cutback after a clever long-throw routine.  Czechia, needing a response after their opening defeat, looked the part early. Schick missed two presentable headed chances either side of half time that would have killed the game. South Africa, down to limited attacking options, gradually worked their way into it.`,
    excerpt2:`Mokoena converted a penalty seven minutes from time after Maseko's shot struck Sulc's arm — the VAR check confirming what the South African bench had been screaming for.  Czechia finished with an xG of just 1.02 against South Africa's 1.37 — they will be hugely disappointed not to have taken all three points.  Both sides now sit on one point from two matches.`,
    excerpt3:`The model gave Czechia 38.7% — the lowest single-outcome confidence of any prediction this matchday, reflecting how close this group truly is. Mexico's win over South Korea later in the day means Group A is now Mexico six points, South Korea three, Czechia and South Africa one each. South Africa face Mexico on June 24 in a dead rubber for El Tri but a must-win for Bafana Bafana's survival hopes.`,
    stat:`38.7%`, statLabel:`Czechia win prob`, stat2:`1–1`, statLabel2:`Final score`, stat3:`✗`, statLabel3:`Model incorrect`,
    modelCorrect: false, highlight: false,
  },
  {
    tag:`Match Report`, date:`17 Jun 2026`,
    title:`Uzbekistan 1–3 Colombia: Díaz Stars. Uzbekistan Write History Then Lose It Again.`,
    excerpt:`Colombia controlled the first half. Daniel Muñoz finished expertly in the 41st minute after a sublime Luis Díaz pass.  Then Abbosbek Fayzullaev made history in the 60th minute — a header that became Uzbekistan's first ever World Cup goal.  The celebrations were extraordinary. The White Wolves had equalised at a World Cup in their first appearance. Five minutes later, Díaz restored Colombia's lead with a powerful strike that slipped through the goalkeeper's hands.  Uzbekistan never recovered.`,
    excerpt2:`Campaz headed in from a Juan Hernández cross late on to seal it at 3–1.  Karimov struck the post for Uzbekistan in the final minutes  — the moment that summed up their night. They competed, they scored a historic goal, they deserved more than the scoreline suggests. Colombia were too clinical in the end. Luis Díaz was the best player on the pitch — an assist, a goal, and relentless pressing for 90 minutes.`,
    excerpt3:`The model gave Colombia 62.7%. Correct. Colombia go top of Group K after matchday one — Portugal and DR Congo drew 1–1 earlier in the day, meaning Colombia lead on three points.  The June 27 Colombia vs Portugal fixture is now the group decider. Uzbekistan face DR Congo next — a game that suddenly looks like a must-win. Group K has lived up to every pre-tournament billing. This is the group to watch.`,
    stat:`62.7%`, statLabel:`Colombia win prob`, stat2:`1–3`, statLabel2:`Final score`, stat3:`✓`, statLabel3:`Model correct`,
    modelCorrect: true, highlight: false,
  },  
  {
    tag:`Match Report`, date:`17 Jun 2026`,
    title:`Ghana 1–0 Panama: Yirenkyi in Stoppage Time. Panama Lose Their Fourth World Cup Game in a Row.`,
    excerpt:`Panama dominated the first half. 64% possession. 3–0 in shots. Ghana had one shot in the entire first half.  Carlos Queiroz sat in the dugout and said nothing publicly but everything with his expression. His side were being outplayed. Then the second half happened. Antoine Semenyo ran the show — pressing, linking, creating — and it was his movement that began the move for the winner.  Thomas-Asante released down the left, cut it back, and Caleb Yirenkyi stretched and stabbed it over the line in the fifth minute of stoppage time.  Toronto erupted.`,
    excerpt2:`Ghana's goalkeeper Lawrence Ati-Zigi had been forced off injured at the start of the second half, replaced by Benjamin Asare, who produced three important saves to keep Panama from scoring.  Panama pushed everyone forward in the final minutes — goalkeeper Mosquera charged up for a last-gasp free kick — but Asare gathered and that was that.  Panama have now lost all four World Cup games they have ever played.  The xG flatters Ghana considerably.`,
    excerpt3:`The model gave Ghana 91.0% — absurdly high given what actually unfolded. Correct outcome, completely wrong margin of dominance. With England already winning Group L, Ghana move second in the table. Panama face England next — a near-impossible task.  Ghana face Croatia on June 22. Group L is England's to lose, but the battle for second place is very much alive.`,
    stat:`91.0%`, statLabel:`Ghana win prob`, stat2:`1–0`, statLabel2:`Final score`, stat3:`✓`, statLabel3:`Model correct`,
    modelCorrect: true, highlight: false,
  },  
  {
    tag:`Match Report`, date:`17 Jun 2026`,
    title:`England 4–2 Croatia: Kane Joins Lineker. Bellingham Settles It. The Three Lions Are Flying.`,
    excerpt:`Harry Kane scored twice in the first 42 minutes and joined Gary Lineker as England's all-time leading World Cup goalscorer.  The first was a penalty retake — Livaković saving the initial spot kick before the referee ordered it retaken for encroachment, and Kane made no mistake with his second attempt.  The second was a thumping header from a Declan Rice corner. England looked in control. Then Croatia happened.`,
    excerpt2:`Martin Baturina stepped onto Sučić's cutback and lashed a stunning equaliser past Pickford from the edge of the area. Then Musa headed in from a Pašalić ball over the top in first-half stoppage time.  2–2 at half time, England's defence looking exposed. But they controlled the second half — Bellingham and Rashford settling it with two goals that killed the game.  England finished with 20 shots, 12 on target. Croatia had 11 attempts.`, 
    excerpt3:`The model gave England 55.2%. Correct. England top Group L with three points and a +2 goal difference.  Croatia's hopes are hanging by a thread after matchday one. Ghana vs Panama is the other Group L fixture tonight. Kane is now joint-leading World Cup scorer for England with Lineker. On this form — fluid, direct, clinical in the second half — England look like genuine contenders.`,
    stat:`55.2%`, statLabel:`England win prob`, stat2:`4–2`, statLabel2:`Final score`, stat3:`✓`, statLabel3:`Model correct`,
    modelCorrect: true, highlight: false,
  },
  {
    tag:`Match Report`, date:`17 Jun 2026`,
    title:`Portugal 1–1 Congo DR: Wissa Ruins Ronaldo's Return. DR Congo Make History in Houston.`,
    excerpt:`João Neves headed Portugal in front in the 6th minute and it looked straightforward. Ronaldo on his sixth World Cup, Bruno Fernandes dictating, Bernardo Silva pulling strings. DR Congo — making their first World Cup appearance since 1974, when they competed as Zaire — were supposed to fold. They didn't. Yoane Wissa, a header from Masuaku's pinpoint cross in the 45th+5, sent the Congo end at NRG Stadium into scenes of complete delirium. 1–1 at half time. 1–1 at full time.`,
    excerpt2:`Portugal dominated the second half. 67% possession. Shot after shot. Cancelo's overhead kick in the 55th minute was the moment that should have won it — a spectacular effort from a Bruno Fernandes cross that flew in off the post. VAR chalked it off. Offside in the buildup, tightest of calls. Ronaldo pressed. Conceicao pressed. Diogo Costa was barely tested. Portugal created. DR Congo defended brilliantly and on the counter looked dangerous themselves through Bakambu.`,
    excerpt3:`The model gave Portugal 61.2%. Wrong. DR Congo join Cape Verde, Qatar, Iran and New Zealand in earning unexpected points on matchday one. Group K is now wide open — Portugal one point, DR Congo one point, Colombia and Uzbekistan to play tonight. If Colombia beat Uzbekistan heavily, Portugal could find themselves under pressure before matchday two. Ronaldo's last World Cup is not going to plan yet.`,
    stat:`61.2%`, statLabel:`Portugal win prob`, stat2:`1–1`, statLabel2:`Final score`, stat3:`✗`, statLabel3:`Model incorrect`,
    modelCorrect: false, highlight: false,
  },
  {
    tag:`Match Report`, date:`16 Jun 2026`,
    title:`France 3–1 Senegal: Mbappé Breaks the Record. France Do It the Hard Way.`,
    excerpt:`Senegal were better for an hour. That is the honest truth. Nicolas Jackson hit the post in the 25th minute when it was still 0-0. Ismaila Sarr fired over from six yards out in the 45th. France's front three combined for exactly one touch in the Senegal half before the break — Mbappé's. The two-time champions were being outplayed. Then Deschamps moved Olise centrally. Everything changed.`,
    excerpt2:`Mbappé's 66th-minute opener was a thing of beauty — Olise's razor-sharp pass, one touch, low finish past Mendy. Barcola came on and scored 131 seconds later. Mbaye pulled one back in the 90th+5. Then Mbappé blasted in from 25 yards in the 90th+6 to become France's all-time leading scorer with 58 goals, overtaking Giroud. The stadium erupted. Senegal were devastated having deserved more from the first half.`,
    excerpt3:`The model gave France 79.1%. Correct. But the performance was closer than 3-1 suggests. Group I is now France and Norway on three points, Senegal and Iraq on zero. Senegal vs Norway on June 23 is a must-win for both. This group is Deschamps' to control — if France's first half form improves.`,
    stat:`79.1%`, statLabel:`France win prob`, stat2:`3–1`, statLabel2:`Final score`, stat3:`✓`, statLabel3:`Model correct`,
    modelCorrect: true, highlight: false,
  },
  {
    tag:`Match Report`, date:`16 Jun 2026`,
    title:`Iraq 1–4 Norway: Haaland's World Cup Begins. 40 Years Since Iraq Last Scored. The Wait Is Over.`,
    excerpt:`Erling Haaland had to wait 29 minutes for his first World Cup goal. Then he scored twice in 14 minutes. Norway's campaign at their first World Cup since 1998 began exactly as Ståle Solbakken would have drawn it up — Haaland goal, Iraq equaliser to raise the tension, Haaland goal before half time to settle everything. Østigård headed a third from an Ødegaard corner. An own goal from the unfortunate Hussein made it four.`,
    excerpt2:`Iraq were not embarrassed. They had the better of the opening 28 minutes. Aymen Hussein's equaliser — only Iraq's second ever World Cup goal and their first in 40 years — sent the Iraqi supporters into scenes of complete joy. Then Haaland chased down a weak goalkeeper pass-back and that was that. Hassan's error cost them the lead they deserved.`,
    excerpt3:`The model gave Norway 62.4%. Correct. Haaland has 52 international goals in 56 appearances — on this form he will challenge for the Golden Boot. Norway face Senegal on June 23. Iraq face France on June 22. Group I is Norway and France level on three points — every fixture from here is decisive.`,
    stat:`62.4%`, statLabel:`Norway win prob`, stat2:`1–4`, statLabel2:`Final score`, stat3:`✓`, statLabel3:`Model correct`,
    modelCorrect: true, highlight: false,
  },
  {
    tag:`Match Report`, date:`16 Jun 2026`,
    title:`Argentina 3–0 Algeria: Messi Scores a Hat-Trick. Equals Klose's World Cup Goals Record.`,
    excerpt:`Lionel Messi appeared in his sixth World Cup — a feat no other man in history has achieved — and marked it with a hat-trick to equal Miroslav Klose's all-time record of 16 World Cup goals. The 17th-minute opener was a long-range screamer. The 60th was a tap-in. The 76th was a curled effort into the bottom corner that sent Kansas City into delirium. Algeria kept the ball but never really threatened to stop what was coming.`,
    excerpt2:`Messi also moved past Pelé for the all-time World Cup goal contributions record with his 24th assist-or-goal combination in the competition. Algeria had their moments — Mahrez came off the bench and caused problems — but this was Messi's night entirely. The defending champions were efficient, controlled and utterly ruthless when it mattered.`,
    excerpt3:`The model gave Argentina 62.2%. Correct. Group J after matchday one: Argentina and Austria both on three points, Algeria and Jordan on zero. The June 22 Argentina vs Austria fixture is the group decider. Messi is now one goal away from becoming the sole World Cup goals record holder outright. On this form it feels inevitable.`,
    stat:`62.2%`, statLabel:`Argentina win prob`, stat2:`3–0`, statLabel2:`Final score`, stat3:`✓`, statLabel3:`Model correct`,
    modelCorrect: true, highlight: false,
  },
  {
    tag:`Match Report`, date:`17 Jun 2026`,
    title:`Austria 3–1 Jordan: Schmid Stunner Opens It. Arnautovic Closes It From the Spot. 36 Years Wait Ends.`,
    excerpt:`Austria played in their first World Cup since 1998 and won a World Cup game for the first time in 36 years. Romano Schmid's 20th-minute opener was the goal of the night — a curling long-range strike that flew into the top corner after a patient passing move from Schlager. Austria led 1-0 at half time and looked in control. Then Jordan equalised five minutes into the second half and San Francisco held its breath.`,
    excerpt2:`Ali Olwan's equaliser was Jordan's first ever World Cup goal — a curled effort in off the far post that matched Schmid's for quality. Jordan, in their first-ever World Cup, had equalised against a side ranked significantly above them. But they couldn't hold it. An own goal from the unfortunate Yazan Al-Arab after a corner made it 2-1, then Arnautovic converted a late penalty — becoming Austria's oldest scorer at a World Cup.`,
    excerpt3:`The model gave Austria 57.9%. Correct. Jordan can take enormous pride — they competed, scored a memorable goal, and were only undone by set-piece misfortune late on. Group J after matchday one: Argentina and Austria both on three points, Algeria and Jordan on zero. The June 22 Argentina vs Austria fixture is now the group decider.`,
    stat:`57.9%`, statLabel:`Austria win prob`, stat2:`3–1`, statLabel2:`Final score`, stat3:`✓`, statLabel3:`Model correct`,
    modelCorrect: true, highlight: false,
  },  
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
        .ea-hero-caption{display:none!important}
        .ea-art-grid{grid-template-columns:1fr!important}
        .ea-feat-stats{grid-template-columns:1fr!important;gap:4px 0!important}
        .ea-feat-stats>div{padding-left:0!important;padding-right:0!important;border-right:none!important;padding-top:12px!important;border-top:1px solid rgba(247,245,240,.1)}
        .ea-feat-stats>div:first-child{border-top:none!important;padding-top:0!important}
      }
    `}</style>

    <div style={{background:'#080808',minHeight:'100vh',color:'#F7F5F0'}}>

      {/* Hero */}
      <section data-theme="dark" className="ea-hero">
        <div style={{position:'absolute',inset:0,background:`url('https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Mercedes_Benz_Stadium_field_view.jpg/1920px-Mercedes_Benz_Stadium_field_view.jpg') center 50%/cover no-repeat`,filter:'contrast(1.0) brightness(.95)',transform:imgReady?'scale(1)':'scale(1.06)',transition:'transform 12s ease'}} aria-hidden="true"/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(8,8,8,.06) 0%,transparent 30%,rgba(8,8,8,.85) 78%),linear-gradient(to right,rgba(8,8,8,.35),transparent 55%)'}} aria-hidden="true"/>
        <div style={{position:'absolute',left:56,top:0,bottom:0,width:2,background:'linear-gradient(to bottom,transparent 10%,#F0A500 30%,#F0A500 70%,transparent 100%)',opacity:.65}} aria-hidden="true"/>
        <div className="ea-hero-caption" style={{position:'absolute',bottom:28,right:40,textAlign:'right',pointerEvents:'none'}}>
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
              <div className="ea-feat-stats" style={{display:'grid',gridTemplateColumns:'repeat(3,auto)',gap:0,marginTop:32,borderTop:'1px solid rgba(247,245,240,.1)',paddingTop:24}}>
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
          <div className="ea-art-grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))',gap:2}}>
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
