// Semi-final model outputs are still being fine-tuned — flag them as provisional
// everywhere a prediction is rendered until confidence in the SF model is confirmed.
export function isProvisionalPrediction(m) {
  if (!m) return false;
  return m.stage === 'Semi-final' && m.status !== 'completed';
}
