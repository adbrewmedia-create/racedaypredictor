import { useEffect, useState } from "react";
import type { Race } from "../types";
import { LADDER } from "../lib/odds";

export type Move = "shorten" | "drift" | undefined;
interface State {
  odds: Record<string, string>;
  move: Record<string, Move>;
}

function initial(race: Race | undefined): State {
  return {
    odds: Object.fromEntries((race?.runners ?? []).map((r) => [r.id, r.odds])),
    move: {},
  };
}

/**
 * Simulated price movement. Replace with your odds feed:
 * return { odds, move } keyed by runner id.
 */
export function useLiveOdds(race: Race | undefined, active: boolean): State {
  const [state, setState] = useState<State>(() => initial(race));

  useEffect(() => {
    setState(initial(race));
  }, [race]);

  useEffect(() => {
    if (!race || !active) return;
    const id = setInterval(() => {
      setState((prev) => {
        const runner = race.runners[Math.floor(Math.random() * race.runners.length)];
        const idx = LADDER.indexOf(prev.odds[runner.id]);
        const next = Math.min(LADDER.length - 1, Math.max(0, idx + (Math.random() < 0.5 ? -1 : 1)));
        if (idx < 0 || next === idx) return prev;
        return {
          odds: { ...prev.odds, [runner.id]: LADDER[next] },
          move: { [runner.id]: next < idx ? "shorten" : "drift" },
        };
      });
    }, 3500);
    return () => clearInterval(id);
  }, [race, active]);

  return state;
}
