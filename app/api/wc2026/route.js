import { readFile } from 'fs/promises';
import { join } from 'path';

// Cache the full route response for 1 hour — limits Odds API calls to at most 1/hour.
// Raise to 7200 (2h) on quieter days; lower to 900 (15min) on match days.
// export const revalidate = 3600;
export const dynamic = 'force-dynamic';

// ─── File helpers ─────────────────────────────────────────────────────────────
async function readJSON(filename) {
  const raw = await readFile(join(process.cwd(), 'data', filename), 'utf-8');
  return JSON.parse(raw);
}

// ─── Team name normalisation (mirrors server.py aliases) ─────────────────────
const ALIASES = {
  'united states':'USA','usa':'USA','turkey':'Turkey','turkiye':'Turkey','türkiye':'Turkey',
  'korea republic':'South Korea','republic of korea':'South Korea',
  "côte d'ivoire":"Côte d'Ivoire","ivory coast":"Côte d'Ivoire","cote d'ivoire":"Côte d'Ivoire",
  'dr congo':'Congo DR','congo dr':'Congo DR','democratic republic of congo':'Congo DR',
  'congo, democratic republic of':'Congo DR',
  'bosnia & herzegovina':'Bosnia-Herzegovina','bosnia and herzegovina':'Bosnia-Herzegovina',
  'bosnia':'Bosnia-Herzegovina','cabo verde':'Cabo Verde','cape verde':'Cabo Verde',
  'curacao':'Curaçao','ir iran':'Iran','islamic republic of iran':'Iran',
  'czech republic':'Czechia','saudi arabia':'Saudi Arabia','ksa':'Saudi Arabia',
  'great britain':'Scotland',
};

function norm(n) {
  if (!n) return n;
  const k = (n).toLowerCase().trim();
  if (ALIASES[k]) return ALIASES[k];
  const c = k.replace(/ & /g,' and ').replace(/&/g,' and ').replace(/[.,]/g,'').trim();
  return ALIASES[c] ?? n;
}

function fuzzy(a, b) {
  if (!a || !b) return false;
  if (norm(a).toLowerCase() === norm(b).toLowerCase()) return true;
  const cl = s => norm(s).toLowerCase().replace(/ & /g,' and ').replace(/-/g,' ').replace(/[.,]/g,'').trim();
  if (cl(a) === cl(b)) return true;
  const ta = new Set(cl(a).split(' ').filter(t => t.length > 2));
  const tb = new Set(cl(b).split(' ').filter(t => t.length > 2));
  if (ta.size && tb.size && ([...ta].every(t => tb.has(t)) || [...tb].every(t => ta.has(t)))) return true;
  return false;
}

function ev(prob, odds) { return ((prob / 100) * odds - 1) * 100; }

// ─── Fetch live odds directly from The Odds API ───────────────────────────────
// Matches the pattern used in app/api/odds/route.js — no proxy, key stays server-side
async function fetchLiveOdds() {
  const apiKey = process.env.ODDS_API_KEY;
  if (!apiKey) return { odds: [], ok: false, source: null, requestsRemaining: null };

  const SPORT_KEYS = [
    'soccer_fifa_world_cup',
    'soccer_international_friendlies',
    'soccer_conmebol_copa_america',
    'soccer_uefa_nations_league',
    'soccer_concacaf_nations_league',
  ];

  for (const sport of SPORT_KEYS) {
    try {
      const url =
        `https://api.the-odds-api.com/v4/sports/${sport}/odds/` +
        `?apiKey=${apiKey}&regions=eu,uk&markets=h2h&oddsFormat=decimal&dateFormat=iso`;

      const res = await fetch(url, { next: { revalidate: 3600 } });

      const remaining = res.headers.get('x-requests-remaining');
      const used      = res.headers.get('x-requests-used');

      if (res.status === 401) return { odds: [], ok: false, source: 'invalid_key', requestsRemaining: null };
      if (!res.ok) continue;

      const games = await res.json();
      if (!Array.isArray(games) || games.length === 0) continue;

      // Process all bookmakers per fixture
      const odds = [];
      for (const g of games) {
        const rawHome = g.home_team || '';
        const rawAway = g.away_team || '';
        const canHome = norm(rawHome);
        const canAway = norm(rawAway);

        // Collect all bookmakers with valid h2h markets
        const allBookmakers = [];
        for (const bk of (g.bookmakers || [])) {
          const h2h = bk.markets?.find(m => m.key === 'h2h');
          if (!h2h) continue;
          const outcomes = {};
          for (const o of (h2h.outcomes || [])) outcomes[o.name] = o.price;
          const homeOdds = outcomes[rawHome] ?? null;
          const awayOdds = outcomes[rawAway] ?? null;
          const drawOdds = outcomes['Draw'] ?? null;
          if (!homeOdds || !awayOdds) continue;
          allBookmakers.push({
            key:      bk.key,
            name:     bk.title || bk.key,
            homeOdds: Math.round(homeOdds * 100) / 100,
            drawOdds: drawOdds ? Math.round(drawOdds * 100) / 100 : null,
            awayOdds: Math.round(awayOdds * 100) / 100,
          });
        }

        if (!allBookmakers.length) continue;

        const bestHomeOdds = Math.max(...allBookmakers.map(b => b.homeOdds));
        const bestDrawOdds = Math.max(...allBookmakers.map(b => b.drawOdds || 0)) || null;
        const bestAwayOdds = Math.max(...allBookmakers.map(b => b.awayOdds));

        // Pinnacle as reference (sharpest market)
        const PREFERRED = ['pinnacle', 'betfair_ex_eu', 'bet365', 'williamhill', 'unibet'];
        const refBk = PREFERRED.map(p => allBookmakers.find(b => b.key === p)).find(Boolean) || allBookmakers[0];

        odds.push({
          id:            g.id,
          sport,
          homeTeam:      canHome,
          awayTeam:      canAway,
          rawHome,
          rawAway,
          commenceTime:  g.commence_time,
          refBookmaker:  refBk.name,
          refHomeOdds:   refBk.homeOdds,
          refDrawOdds:   refBk.drawOdds,
          refAwayOdds:   refBk.awayOdds,
          bestHomeOdds,
          bestDrawOdds,
          bestAwayOdds,
          bestHomeBk:    allBookmakers.find(b => b.homeOdds === bestHomeOdds)?.name,
          bestAwayBk:    allBookmakers.find(b => b.awayOdds === bestAwayOdds)?.name,
          bookmakers:    allBookmakers,
        });
      }

      if (odds.length > 0) {
        console.log(`[wc2026] ${sport}: ${odds.length} fixtures · used=${used} · remaining=${remaining}`);
        return { odds, ok: true, source: sport, requestsRemaining: remaining };
      }

      console.log(`[wc2026] ${sport}: 0 results — trying next`);
    } catch (e) {
      console.error(`[wc2026] Error fetching ${sport}:`, e.message);
    }
  }

  return { odds: [], ok: true, source: 'no_data', requestsRemaining: null };
}

// ─── Main handler ─────────────────────────────────────────────────────────────
export async function GET() {
  // Load predictions / team stats / simulation from data files
  let predictions = [], teamStats = [], simulation = null, dataGenerated = null;

  try {
    const d = await readJSON('wc_predictions.json');
    predictions = d.matches || []; dataGenerated = d.generated;
  } catch {
    try {
      const d = await readJSON('predictions.json');
      if (d.matches) { predictions = d.matches; dataGenerated = d.generated; }
    } catch {}
  }
  try { teamStats  = (await readJSON('team_stats.json')).teams || []; }  catch {}
  try { simulation = await readJSON('simulation.json'); }                 catch {}

  // Fetch live odds directly from The Odds API (no proxy)
  const { odds: liveOdds, ok: oddsOk, source: oddsSource, requestsRemaining } = await fetchLiveOdds();

  // Merge live odds onto model predictions
  const merged = predictions.map(m => {
    const live = liveOdds.find(o => {
      return (fuzzy(o.homeTeam, m.home) && fuzzy(o.awayTeam, m.away))
          || (fuzzy(o.homeTeam, m.away) && fuzzy(o.awayTeam, m.home));
    }) || null;

    let bestH = m.odds_home, bestD = m.odds_draw, bestA = m.odds_away;
    let allBookmakers = [];

    if (live) {
      const rev = fuzzy(live.homeTeam, m.away);
      bestH = rev ? live.bestAwayOdds : live.bestHomeOdds;
      bestD = live.bestDrawOdds ?? m.odds_draw;
      bestA = rev ? live.bestHomeOdds : live.bestAwayOdds;
      allBookmakers = (live.bookmakers || []).map(bk => ({
        ...bk,
        homeOdds: rev ? bk.awayOdds : bk.homeOdds,
        awayOdds: rev ? bk.homeOdds : bk.awayOdds,
      }));
    }

    const evH = ev(m.prob_home, bestH || 0);
    const evD = ev(m.prob_draw, bestD || 0);
    const evA = ev(m.prob_away, bestA || 0);

    return {
      ...m,
      oddsSource:   live ? 'live' : 'model',
      bestH, bestD, bestA,
      evH, evD, evA,
      bestEv:       Math.max(evH, evD, evA),
      bkCount:      live?.bookmakers?.length || 0,
      refBookmaker: live?.refBookmaker || 'Model',
      allBookmakers,
    };
  });

  // Model accuracy record from enriched predictions
  const completed = merged.filter(m => m.status === 'completed');
  const modelRecord = {
    played:  completed.length,
    correct: completed.filter(m => m.model_correct === true).length,
    wrong:   completed.filter(m => m.model_correct === false).length,
    accuracy: completed.length > 0
      ? Math.round(completed.filter(m => m.model_correct).length / completed.length * 100)
      : null,
  };

  return Response.json({
    ok:           true,
    generated:    dataGenerated,
    matchCount:   merged.length,
    liveCount:    merged.filter(m => m.oddsSource === 'live').length,
    valueCount:   merged.filter(m => m.bestEv > 3).length,
    oddsOk,
    oddsSource,
    requestsLeft: requestsRemaining,
    proxyOk:      oddsOk && liveOdds.length > 0,
    proxySource:  oddsSource,
    matches:      merged,
    teamStats,
    simulation,
    modelRecord,
  });
}
