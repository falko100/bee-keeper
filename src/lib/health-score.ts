import type { BroodPattern, Temperament, HoneyStores } from './types';

const BROOD_SCORES: Record<BroodPattern, number> = {
  Excellent: 10,
  Good: 8,
  Fair: 5,
  Poor: 3,
  None: 1,
};

const TEMPERAMENT_SCORES: Record<Temperament, number> = {
  Calm: 10,
  Nervous: 5,
  Aggressive: 2,
};

const HONEY_SCORES: Record<HoneyStores, number> = {
  Abundant: 10,
  Adequate: 7,
  Low: 4,
  Empty: 1,
};

export function calculateHealthScore(params: {
  queenSpotted: boolean;
  broodPattern: BroodPattern;
  temperament: Temperament;
  honeyStores: HoneyStores;
  pestsAndDiseases: string[];
}): number {
  const queenScore = params.queenSpotted ? 10 : 3;
  const broodScore = BROOD_SCORES[params.broodPattern];
  const tempScore = TEMPERAMENT_SCORES[params.temperament];
  const honeyScore = HONEY_SCORES[params.honeyStores];
  const pestPenalty = Math.min(params.pestsAndDiseases.length * 2, 8);
  const pestScore = Math.max(10 - pestPenalty, 2);

  const weighted =
    broodScore * 0.3 +
    honeyScore * 0.25 +
    tempScore * 0.15 +
    queenScore * 0.2 +
    pestScore * 0.1;

  return Math.round(Math.min(10, Math.max(1, weighted)));
}
