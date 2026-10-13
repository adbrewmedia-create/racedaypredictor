import type { Runner } from "../types";

export const LADDER = [
  "1/2", "4/6", "4/5", "1/1", "6/5", "5/4", "6/4", "7/4", "15/8", "2/1", "9/4", "5/2", "11/4",
  "3/1", "10/3", "7/2", "4/1", "9/2", "5/1", "11/2", "6/1", "7/1", "8/1", "9/1", "10/1", "12/1",
  "14/1", "16/1", "20/1", "25/1", "33/1", "40/1", "50/1",
];

export function decimalOdds(fractional: string): number {
  const [n, d] = fractional.split("/").map(Number);
  return 1 + n / d;
}

/**
 * Samples a finishing order without replacement, weighting each runner
 * by its implied probability. Used for the AI suggestion and the simulator.
 */
export function weightedOrder(runners: Runner[], rand: () => number = Math.random): string[] {
  const pool = runners.map((r) => ({ id: r.id, w: 1 / decimalOdds(r.odds) }));
  const out: string[] = [];
  while (pool.length) {
    const total = pool.reduce((s, p) => s + p.w, 0);
    let x = rand() * total;
    let idx = 0;
    for (; idx < pool.length - 1; idx++) {
      x -= pool[idx].w;
      if (x <= 0) break;
    }
    out.push(pool[idx].id);
    pool.splice(idx, 1);
  }
  return out;
}
