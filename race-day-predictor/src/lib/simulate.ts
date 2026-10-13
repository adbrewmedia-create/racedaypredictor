import type { Picks, Race, Results } from "../types";
import { weightedOrder } from "./odds";

/** Heuristic suggestion, weighted by price. Swap for a real model or API if you like. */
export function suggestPicks(races: Race[], rand: () => number = Math.random): Picks {
  const picks: Picks = {};
  for (const race of races) {
    const [winner, second, place] = weightedOrder(race.runners, rand);
    picks[race.id] = { winner, second, place };
  }
  return picks;
}

export function simulateResults(races: Race[], rand: () => number = Math.random): Results {
  const results: Results = {};
  for (const race of races) {
    results[race.id] = {
      finish: weightedOrder(race.runners, rand),
      margin: Math.round((0.5 + rand() * 5.5) * 2) / 2,
    };
  }
  return results;
}
