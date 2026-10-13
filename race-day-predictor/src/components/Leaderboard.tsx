import { config } from "../config";
import { races } from "../data/races";
import { buildLeaderboard } from "../lib/leaderboard";
import type { Entry, Results } from "../types";

interface Props {
  results: Results;
  entry: Entry | null;
}

export function Leaderboard({ results, entry }: Props) {
  const complete = races.every((r) => results[r.id]);
  const rows = complete ? buildLeaderboard(races, results, entry) : [];

  return (
    <section className="panel" id="leaderboard" aria-labelledby="lb-title">
      <h2 id="lb-title">Leaderboard</h2>
      {!complete ? (
        <p className="empty">Results publish after the last race.</p>
      ) : (
        <>
          <table className="lb-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Player</th>
                <th scope="col" className="num">Winners</th>
                <th scope="col" className="num">Points</th>
                <th scope="col">Prize</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className={r.isYou ? "is-you" : ""}>
                  <td>{r.rank}</td>
                  <td>
                    {r.name}
                    {r.isYou && <span className="chip chip-ok"> You</span>}
                  </td>
                  <td className="num">{r.winners}/{races.length}</td>
                  <td className="num">{r.points}{r.beatTom ? " ★" : ""}</td>
                  <td>
                    {r.perfectSix && <span className="chip chip-gold">£{config.prizes.perfectSix.toLocaleString("en-GB")} Perfect 6</span>}
                    {r.rank === 1 && <span className="chip chip-gold">£{config.prizes.topOfDay} Top of the day</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="fine">★ outscored Tom. Ties are split by the closest tiebreaker. Other players are sample data.</p>
        </>
      )}
    </section>
  );
}
