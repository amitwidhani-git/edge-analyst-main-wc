import { readFile } from 'fs/promises';
import { join } from 'path';
import HomeContent from './HomeContent';

export const dynamic = 'force-dynamic';

async function readJSON(filename) {
  const raw = await readFile(join(process.cwd(), 'data', filename), 'utf-8');
  return JSON.parse(raw);
}

function ev(prob, odds) {
  return odds ? ((prob / 100) * odds - 1) * 100 : 0;
}

async function getHomeData() {
  let predictions = [], teamStats = [], simulation = null;

  try {
    const d = await readJSON('wc_predictions.json');
    predictions = d.matches || [];
  } catch {
    try {
      const d = await readJSON('predictions.json');
      predictions = d.matches || [];
    } catch {}
  }
  try { teamStats  = (await readJSON('team_stats.json')).teams || []; } catch {}
  try { simulation = await readJSON('simulation.json'); }               catch {}

  // Enrich matches with EV from model odds so value picks render server-side.
  // The client will silently replace this with live odds after hydration.
  const matches = predictions.map(m => {
    const evH = ev(m.prob_home || 0, m.odds_home || 0);
    const evD = ev(m.prob_draw || 0, m.odds_draw || 0);
    const evA = ev(m.prob_away || 0, m.odds_away || 0);
    return {
      ...m,
      oddsSource: 'model',
      bestH: m.odds_home ?? null,
      bestD: m.odds_draw ?? null,
      bestA: m.odds_away ?? null,
      evH, evD, evA,
      bestEv: Math.max(evH, evD, evA),
      bkCount: 0,
      refBookmaker: 'Model',
      allBookmakers: [],
    };
  });

  const completed = matches.filter(m => m.status === 'completed');
  const modelRecord = {
    played:   completed.length,
    correct:  completed.filter(m => m.model_correct === true).length,
    wrong:    completed.filter(m => m.model_correct === false).length,
    accuracy: completed.length > 0
      ? Math.round(completed.filter(m => m.model_correct).length / completed.length * 100)
      : null,
  };

  return { matches, teamStats, simulation, modelRecord, liveCount: 0 };
}

export default async function HomePage() {
  const data = await getHomeData();
  return <HomeContent initialData={data} />;
}
