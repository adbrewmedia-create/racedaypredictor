export interface Runner {
  id: string;
  number: number;
  name: string;
  /** Opening price, fractional, e.g. "5/2". Must exist in LADDER (lib/odds.ts). */
  odds: string;
}

export interface Race {
  id: string;
  number: number;
  name: string;
  distance: string;
  going: string;
  /** Off time, epoch ms. */
  off: number;
  runners: Runner[];
  /** The house tipster's picks, used for the "Beat Tom" bonus. */
  tom: { winner: string; second: string };
}

export type Slot = "winner" | "second" | "place";

export interface RacePick {
  winner?: string;
  second?: string;
  place?: string;
}

export type Picks = Record<string, RacePick>;

export interface User {
  name: string;
  email: string;
}

export interface Entry {
  user: User;
  picks: Picks;
  tiebreaker: number;
  submittedAt: string;
}

export interface RaceResult {
  /** Runner ids in finishing order (at least the first three). */
  finish: string[];
  /** Winning margin in lengths. */
  margin: number;
}

export type Results = Record<string, RaceResult>;
