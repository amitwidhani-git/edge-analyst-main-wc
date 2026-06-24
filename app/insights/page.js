import { readFile } from 'fs/promises';
import { join } from 'path';
import ArticlesContent from './ArticlesContent';

async function readJSON(filename) {
  const raw = await readFile(join(process.cwd(), 'data', filename), 'utf-8');
  return JSON.parse(raw);
}

async function getArticlesData() {
  let simulation = null, predictions = [];

  try { simulation  = await readJSON('simulation.json'); }               catch {}
  try {
    const d = await readJSON('wc_predictions.json');
    predictions = d.matches || [];
  } catch {}

  const completed = predictions.filter(m => m.status === 'completed');
  const modelRecord = {
    played:   completed.length,
    correct:  completed.filter(m => m.model_correct === true).length,
    wrong:    completed.filter(m => m.model_correct === false).length,
    accuracy: completed.length > 0
      ? Math.round(completed.filter(m => m.model_correct).length / completed.length * 100)
      : null,
  };

  return { simulation, modelRecord, matchCount: predictions.length || 72 };
}

export default async function ArticlesPage() {
  const data = await getArticlesData();
  return <ArticlesContent initialData={data} />;
}
