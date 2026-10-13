import type { Entry, Picks, Race, Results } from "../types";
import { suggestPicks } from "./simulate";
import { scoreEntry, totalMargin } from "./scoring";

export interface Row {
  id: string;
  rank: number;
  name: string;
  points: number;
  winners: number;
  perfectSix: boolean;
  beatTom: boolean;
  tiebreakerDiff: number;
  isYou: boolean;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const NAMES = [
  "Sam R.", "Priya K.", "Jonny B.", "Alex M.", "Dee W.", "Chris T.", "Hannah L.",
  "Tariq A.", "Molly P.", "Gav H.", "Aoife C.", "Ravi S.", "Beth O.", "Luke F.",
];

/** Placeholder rivals. Replace with real entries from your backend. */
function mockEntries(races: Race[]): { name: string; picks: Picks; tiebreaker: number }[] {
  const rand = mulberry32(14091);
  return NAMES.map((name) => ({
    name,
    picks: suggestPicks(races, rand),
    tiebreaker: Math.round(10 + rand() * 30),
  }));
}

export function buildLeaderboard(races: Race[], results: Results, entry: Entry | null): Row[] {
  const total = totalMargin(results, races);
  const raw = mockEntries(races).map((e, i) => ({ id: `mock-${i}`, isYou: false, ...e }));
  if (entry) {
    raw.push({ id: "you", isYou: true, name: entry.user.name, picks: entry.picks, tiebreaker: entry.tiebreaker });
  }
  const rows: Row[] = raw.map((e) => {
    const s = scoreEntry(e.picks, results, races);
    return {
      id: e.id,
      rank: 0,
      name: e.name,
      points: s.points,
      winners: s.winners,
      perfectSix: s.perfectSix,
      beatTom: s.beatTom,
      tiebreakerDiff: Math.abs(e.tiebreaker - total),
      isYou: e.isYou,
    };
  });
  rows.sort(
    (a, b) => b.points - a.points || a.tiebreakerDiff - b.tiebreakerDiff || a.name.localeCompare(b.name),
  );
  rows.forEach((r, i) => (r.rank = i + 1));
  return rows;
}
