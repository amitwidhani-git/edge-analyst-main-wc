// Cache the full route response for 1 hour to reduce Odds API quota usage.
export const revalidate = 3600;

const BOOKMAKER_LABELS = {
  bet365:           'Bet365',
  skybet:           'Sky Bet',
  williamhill:      'William Hill',
  betfair_ex_uk:    'Betfair',
  paddypower:       'Paddy Power',
  ladbrokes_uk:     'Ladbrokes',
  coral:            'Coral',
  betway:           'Betway',
  unibet_uk:        'Unibet',
  betvictor:        'BetVictor',
  boyle_sports:     'BoyleSports',
  sportnation:      'SportNation',
  matchbook:        'Matchbook',
};

function formatKickoff(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short',
    hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London',
  }).replace(',', ' ·');
}

function impliedProb(decimalOdds) {
  return decimalOdds > 0 ? 1 / decimalOdds : 0;
}

// Remove bookmaker margin and return fair probabilities for three outcomes
function removeMargin(homeOdds, drawOdds, awayOdds) {
  const overround = impliedProb(homeOdds) + impliedProb(drawOdds) + impliedProb(awayOdds);
  if (overround <= 0) return null;
  return {
    home: Math.round((impliedProb(homeOdds) / overround) * 100),
    draw: Math.round((impliedProb(drawOdds) / overround) * 100),
    away: Math.round((impliedProb(awayOdds) / overround) * 100),
  };
}

// ── DUMMY DATA (shown when ODDS_API_KEY is not configured) ────────────────────
const DUMMY = (() => {
  const bms = [
    { key:'bet365',        label:'Bet365'       },
    { key:'skybet',        label:'Sky Bet'      },
    { key:'williamhill',   label:'William Hill' },
    { key:'betfair_ex_uk', label:'Betfair'      },
    { key:'paddypower',    label:'Paddy Power'  },
    { key:'ladbrokes_uk',  label:'Ladbrokes'    },
    { key:'coral',         label:'Coral'        },
    { key:'betway',        label:'Betway'       },
  ];
  const raw = [
    { home:'Arsenal',      away:'Chelsea',          ko:'2026-06-07T11:30:00Z',
      odds:{ bet365:{home:2.10,draw:3.40,away:3.60}, skybet:{home:2.15,draw:3.50,away:3.55},
             williamhill:{home:2.08,draw:3.30,away:3.50}, betfair_ex_uk:{home:2.18,draw:3.60,away:3.65},
             paddypower:{home:2.12,draw:3.40,away:3.55}, ladbrokes_uk:{home:2.10,draw:3.35,away:3.60},
             coral:{home:2.15,draw:3.45,away:3.50}, betway:{home:2.10,draw:3.40,away:3.55} } },
    { home:'Man City',     away:'Liverpool',        ko:'2026-06-07T14:00:00Z',
      odds:{ bet365:{home:1.80,draw:3.90,away:4.50}, skybet:{home:1.83,draw:4.00,away:4.40},
             williamhill:{home:1.78,draw:3.80,away:4.30}, betfair_ex_uk:{home:1.85,draw:4.10,away:4.60},
             paddypower:{home:1.80,draw:3.90,away:4.50}, ladbrokes_uk:{home:1.78,draw:3.85,away:4.40},
             coral:{home:1.80,draw:3.90,away:4.45}, betway:{home:1.82,draw:4.00,away:4.50} } },
    { home:'Tottenham',    away:'Man Utd',          ko:'2026-06-07T16:30:00Z',
      odds:{ bet365:{home:2.30,draw:3.30,away:3.10}, skybet:{home:2.25,draw:3.20,away:3.20},
             williamhill:{home:2.28,draw:3.25,away:3.05}, betfair_ex_uk:{home:2.35,draw:3.40,away:3.15},
             paddypower:{home:2.30,draw:3.30,away:3.10}, ladbrokes_uk:{home:2.25,draw:3.25,away:3.10},
             coral:{home:2.30,draw:3.30,away:3.15}, betway:{home:2.28,draw:3.35,away:3.20} } },
    { home:'Aston Villa',  away:'Newcastle',        ko:'2026-06-08T14:00:00Z',
      odds:{ bet365:{home:1.95,draw:3.60,away:4.00}, skybet:{home:2.00,draw:3.70,away:3.90},
             williamhill:{home:1.93,draw:3.50,away:4.00}, betfair_ex_uk:{home:2.02,draw:3.75,away:4.10},
             paddypower:{home:1.95,draw:3.60,away:4.00}, ladbrokes_uk:{home:1.95,draw:3.55,away:3.95},
             coral:{home:2.00,draw:3.65,away:4.00}, betway:{home:1.95,draw:3.70,away:4.05} } },
    { home:'Brighton',     away:'West Ham',         ko:'2026-06-08T16:30:00Z',
      odds:{ bet365:{home:1.85,draw:3.60,away:4.75}, skybet:{home:1.88,draw:3.70,away:4.60},
             williamhill:{home:1.83,draw:3.50,away:4.80}, betfair_ex_uk:{home:1.90,draw:3.80,away:4.90},
             paddypower:{home:1.85,draw:3.60,away:4.75}, ladbrokes_uk:{home:1.85,draw:3.55,away:4.70},
             coral:{home:1.88,draw:3.65,away:4.80}, betway:{home:1.85,draw:3.70,away:4.75} } },
    { home:'Everton',      away:'Wolves',           ko:'2026-06-08T14:00:00Z',
      odds:{ bet365:{home:2.50,draw:3.30,away:2.80}, skybet:{home:2.55,draw:3.25,away:2.75},
             williamhill:{home:2.45,draw:3.20,away:2.85}, betfair_ex_uk:{home:2.60,draw:3.40,away:2.85},
             paddypower:{home:2.50,draw:3.30,away:2.80}, ladbrokes_uk:{home:2.50,draw:3.25,away:2.80},
             coral:{home:2.55,draw:3.30,away:2.80}, betway:{home:2.50,draw:3.35,away:2.85} } },
  ];
  const fixtures = raw.map((r, i) => {
    const bestHome = Math.max(...Object.values(r.odds).map(o => o.home));
    const bestDraw = Math.max(...Object.values(r.odds).map(o => o.draw));
    const bestAway = Math.max(...Object.values(r.odds).map(o => o.away));
    const over = 1/bestHome + 1/bestDraw + 1/bestAway;
    const fairProbs = {
      home: Math.round((1/bestHome/over)*100),
      draw: Math.round((1/bestDraw/over)*100),
      away: Math.round((1/bestAway/over)*100),
    };
    return { id:i+1, home:r.home, away:r.away, kickoff:formatKickoff(r.ko), kickoffIso:r.ko, odds:r.odds, bestOdds:{home:bestHome,draw:bestDraw,away:bestAway}, fairProbs };
  });
  fixtures.sort((a,b) => new Date(a.kickoffIso)-new Date(b.kickoffIso));
  return { bookmakers:bms, fixtures };
})();

export async function GET() {
  const apiKey = process.env.ODDS_API_KEY;
  if (!apiKey) return Response.json(DUMMY);

  const url =
    `https://api.the-odds-api.com/v4/sports/soccer_epl/odds/` +
    `?apiKey=${apiKey}&regions=uk&markets=h2h&oddsFormat=decimal&dateFormat=iso`;

  let raw;
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return Response.json(DUMMY);
    raw = await res.json();
  } catch (e) {
    return Response.json(DUMMY);
  }

  // Off-season or no current fixtures — fall back to dummy data
  if (!Array.isArray(raw) || raw.length === 0) return Response.json(DUMMY);

  // Collect all bookmaker keys that appear across all events
  const bmKeySet = new Set();
  for (const event of raw) {
    for (const bm of event.bookmakers ?? []) bmKeySet.add(bm.key);
  }

  const bookmakers = [...bmKeySet].map(key => ({
    key,
    label: BOOKMAKER_LABELS[key] ?? key,
  }));

  const fixtures = raw.map((event, i) => {
    const oddsMap = {};
    for (const bm of event.bookmakers ?? []) {
      const market = bm.markets?.find(m => m.key === 'h2h');
      if (!market) continue;
      const homeOc = market.outcomes.find(o => o.name === event.home_team);
      const awayOc = market.outcomes.find(o => o.name === event.away_team);
      const drawOc = market.outcomes.find(o => o.name === 'Draw');
      if (homeOc && awayOc && drawOc) {
        oddsMap[bm.key] = {
          home: homeOc.price,
          draw: drawOc.price,
          away: awayOc.price,
        };
      }
    }

    // Best (highest) odds across all bookmakers for each outcome
    const allOdds = Object.values(oddsMap);
    const bestHome = allOdds.length ? Math.max(...allOdds.map(o => o.home)) : null;
    const bestDraw = allOdds.length ? Math.max(...allOdds.map(o => o.draw)) : null;
    const bestAway = allOdds.length ? Math.max(...allOdds.map(o => o.away)) : null;

    // Market-implied fair probabilities from best available odds
    const fairProbs =
      bestHome && bestDraw && bestAway
        ? removeMargin(bestHome, bestDraw, bestAway)
        : null;

    return {
      id: i + 1,
      home: event.home_team,
      away: event.away_team,
      kickoff: formatKickoff(event.commence_time),
      kickoffIso: event.commence_time,
      odds: oddsMap,
      bestOdds: bestHome ? { home: bestHome, draw: bestDraw, away: bestAway } : null,
      fairProbs,
    };
  });

  // Sort by kickoff ascending
  fixtures.sort((a, b) => new Date(a.kickoffIso) - new Date(b.kickoffIso));

  return Response.json({ bookmakers, fixtures });
}
