import type { Picks, Race, RacePick, RaceResult, Results } from "../types";

export const POINTS = { winner: 3, forecast: 5, place: 1, beatTom: 5 } as const;

export interface RaceScore {
  winner: number;
  forecast: number;
  place: number;
  total: number;
  winnerHit: boolean;
}

export function scoreRace(pick: RacePick | undefined, result: RaceResult | undefined): RaceScore {
  const none = { winner: 0, forecast: 0, place: 0, total: 0, winnerHit: false };
  if (!pick || !result) return none;
  const [first, second] = result.finish;
  const winnerHit = !!pick.winner && pick.winner === first;
  const winner = winnerHit ? POINTS.winner : 0;
  // Forecast: 1st and 2nd in the correct order.
  const forecast = winnerHit && !!pick.second && pick.second === second ? POINTS.forecast : 0;
  const place = pick.place && result.finish.slice(0, 3).includes(pick.place) ? POINTS.place : 0;
  return { winner, forecast, place, total: winner + forecast + place, winnerHit };
}

export function tomPicks(races: Race[]): Picks {
  return Object.fromEntries(races.map((r) => [r.id, { winner: r.tom.winner, second: r.tom.second }]));
}

export function scoreEntry(picks: Picks, results: Results, races: Race[]) {
  const complete = races.every((r) => results[r.id]);
  const tom = tomPicks(races);
  let base = 0;
  let tomBase = 0;
  let winners = 0;
  const perRace: Record<string, RaceScore> = {};
  for (const r of races) {
    const s = scoreRace(picks[r.id], results[r.id]);
    perRace[r.id] = s;
    base += s.total;
    if (s.winnerHit) winners++;
    tomBase += scoreRace(tom[r.id], results[r.id]).total;
  }
  const beatTom = complete && base > tomBase;
  return {
    complete,
    base,
    tomBase,
    beatTom,
    points: base + (beatTom ? POINTS.beatTom : 0),
    winners,
    perfectSix: complete && winners === races.length,
    perRace,
  };
}

export function totalMargin(results: Results, races: Race[]): number {
  return races.reduce((sum, r) => sum + (results[r.id]?.margin ?? 0), 0);
}
