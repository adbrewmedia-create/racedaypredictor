import { config } from "../config";
import { races } from "../data/races";
import { scoreEntry } from "../lib/scoring";
import type { Entry, Results } from "../types";

interface Props {
  entry: Entry;
  results: Results;
  hasLockedRace: boolean;
  entriesClosed: boolean;
  onEdit: () => void;
  onReset: () => void;
}

export function SubmittedPanel({ entry, results, hasLockedRace, entriesClosed, onEdit, onReset }: Props) {
  const score = scoreEntry(entry.picks, results, races);
  const settled = Object.keys(results).length > 0;
  const nameOf = (raceId: string, id?: string) =>
    races.find((r) => r.id === raceId)?.runners.find((r) => r.id === id)?.name;

  return (
    <section className="panel" id="play" aria-labelledby="entry-title">
      <div className="panel-head">
        <div>
          <h2 id="entry-title">Your predictions</h2>
          <p className="count">
            <strong>{races.length}</strong> / {races.length} locked in
          </p>
        </div>
        <span className="chip chip-ok chip-lg">✓ Submitted</span>
      </div>

      <ol className="summary">
        {races.map((race) => {
          const pick = entry.picks[race.id] ?? {};
          const s = score.perRace[race.id];
          return (
            <li key={race.id} className="summary-row">
              <span className="race-no">{race.number}</span>
              <span className="summary-main">
                <span className="race-name">{race.name}</span>
                <span className="summary-picks">
                  <span>Win: {nameOf(race.id, pick.winner) ?? "–"}</span>
                  {pick.second && <span>2nd: {nameOf(race.id, pick.second)}</span>}
                  {pick.place && <span>Place: {nameOf(race.id, pick.place)}</span>}
                </span>
              </span>
              {results[race.id] && (
                <span className={`chip ${s.total > 0 ? "chip-ok" : ""}`}>+{s.total} pts</span>
              )}
            </li>
          );
        })}
      </ol>

      <div className="tiebreaker tiebreaker-static">
        <div>
          <h3>Tiebreaker</h3>
          <p>{entry.tiebreaker} lengths</p>
        </div>
        {settled && (
          <div className="score-total">
            <span className="tile-value">{score.points}</span>
            <span className="tile-note">
              points{score.beatTom ? " (incl. Beat Tom bonus)" : ""}
            </span>
          </div>
        )}
      </div>

      <div className="submit-row">
        {!settled && (
          <button className="btn btn-primary" onClick={onEdit}>
            ✎ Edit predictions
          </button>
        )}
        {config.showSim && (
          <button className="btn btn-quiet" onClick={onReset}>
            Reset demo
          </button>
        )}
      </div>
      {!settled && (
        <p className="fine">
          {hasLockedRace
            ? "Live races are locked · edit others anytime before the off"
            : entriesClosed
              ? "Entries are closed"
              : "Edit any time before each race locks"}
        </p>
      )}
    </section>
  );
}
