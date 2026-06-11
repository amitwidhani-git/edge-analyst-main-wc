import { readFile } from 'fs/promises';
import { join } from 'path';

// ── Load both Premier League predictions AND WC 2026 predictions ──────────────
async function loadPL() {
  const filePath = join(process.cwd(), 'data', 'predictions.json');
  const raw = await readFile(filePath, 'utf-8');
  return JSON.parse(raw);
}

async function loadWC() {
  try {
    const filePath = join(process.cwd(), 'data', 'predictions.json'); // WC predictions
    // Try WC-specific file first, fall back to building from wc2026 data
    const wcPath = join(process.cwd(), 'data', 'wc2026_predictions.json');
    try {
      const raw = await readFile(wcPath, 'utf-8');
      return JSON.parse(raw);
    } catch {
      return null;
    }
  } catch { return null; }
}

async function loadWC2026TeamStats() {
  try {
    const raw = await readFile(join(process.cwd(), 'data', 'team_stats.json'), 'utf-8');
    return JSON.parse(raw).teams || [];
  } catch { return []; }
}

async function loadWC2026Simulation() {
  try {
    const raw = await readFile(join(process.cwd(), 'data', 'simulation.json'), 'utf-8');
    return JSON.parse(raw);
  } catch { return null; }
}

function parseTeams(fixture) {
  const [home, away] = fixture.split(' vs ');
  return { home: home?.trim() ?? '', away: away?.trim() ?? '' };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('mode'); // 'wc2026' or default (PL)

  if (mode === 'wc2026') {
    const [teams, sim] = await Promise.all([loadWC2026TeamStats(), loadWC2026Simulation()]);
    return Response.json({ teams, simulation: sim, mode: 'wc2026' });
  }

  let all;
  try {
    all = await loadPL();
  } catch (e) {
    return Response.json({ error: `Failed to load predictions: ${e.message}` }, { status: 500 });
  }

  const completed = all.filter(r => r.ActualResult !== 'PENDING');
  const upcomingMap = new Map();
  for (const r of all.filter(r => r.ActualResult === 'PENDING')) {
    const existing = upcomingMap.get(r.Fixture);
    if (!existing || new Date(r.Kickoff) > new Date(existing.Kickoff)) {
      upcomingMap.set(r.Fixture, r);
    }
  }
  const upcoming = [...upcomingMap.values()];
  const plCompleted = completed.filter(r => (r.League ?? 'Premier League') === 'Premier League');
  const correct   = plCompleted.filter(r => r.Correct).length;
  const accuracy  = plCompleted.length > 0 ? correct / plCompleted.length : 0;

  const MATCHES_PER_ROUND = { 'Premier League': 10, 'Championship': 12 };
  const leagueNames = [...new Set(completed.map(r => r.League ?? 'Premier League'))].sort();
  const leagueAccuracy = leagueNames.map(league => {
    const lc = completed.filter(r => (r.League ?? 'Premier League') === league);
    const lCorrect = lc.filter(r => r.Correct).length;
    const mpr = MATCHES_PER_ROUND[league] ?? 10;
    const round = lc.length > 0 ? Math.round(lc.length / mpr) : 0;
    const leagueEdgeSignals = upcoming.filter(r => r.HasValue && (r.League ?? 'Premier League') === league).length;
    return { league, correct: lCorrect, total: lc.length, accuracy: Math.round(lCorrect / lc.length * 100), round, edgeSignals: leagueEdgeSignals };
  });

  const stats = {
    totalFixtures: all.length,
    completed: completed.length,
    pending: upcoming.length,
    correct,
    accuracy: Math.round(accuracy * 100),
    edgeSignals: all.filter(r => r.HasValue).length,
    modelUsed: 'EdgeIQ Model',
    leagueAccuracy,
  };

  const fixtures = upcoming
    .sort((a, b) => new Date(a.Kickoff) - new Date(b.Kickoff))
    .map(r => {
      const { home, away } = parseTeams(r.Fixture);
      return {
        fixture: r.Fixture, home, away, kickoff: r.Kickoff,
        league: r.League ?? 'Premier League',
        predicted: r.PredictedResult, score: r.PredictedScore,
        homeProb: Math.round(r.HomeProb * 100),
        drawProb: Math.round(r.DrawProb * 100),
        awayProb: Math.round(r.AwayProb * 100),
        modelUsed: r.ModelUsed, hasValue: r.HasValue,
        valueOutcome: r.ValueOutcome,
        modelProbability: r.ModelProbability,
        marketProbability: r.MarketProbability,
        edge: r.Edge,
      };
    });

  const recent = completed
    .sort((a, b) => new Date(b.Kickoff) - new Date(a.Kickoff))
    .slice(0, 60)
    .map(r => {
      const { home, away } = parseTeams(r.Fixture);
      return {
        fixture: r.Fixture, home, away, kickoff: r.Kickoff,
        league: r.League ?? 'Premier League',
        actual: r.ActualResult, predicted: r.PredictedResult,
        score: r.PredictedScore, correct: r.Correct,
        homeProb: Math.round(r.HomeProb * 100),
        drawProb: Math.round(r.DrawProb * 100),
        awayProb: Math.round(r.AwayProb * 100),
        modelUsed: r.ModelUsed, hasValue: r.HasValue, edge: r.Edge,
      };
    });

  return Response.json({ stats, fixtures, recent });
}
