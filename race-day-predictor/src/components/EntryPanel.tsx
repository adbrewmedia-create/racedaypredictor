import { config } from "../config";
import { races } from "../data/races";
import type { Picks, Slot } from "../types";
import { RaceCard } from "./RaceCard";

interface Props {
  now: number;
  picks: Picks;
  pickedCount: number;
  tiebreaker: number;
  editing: boolean;
  hasEntry: boolean;
  entriesClosed: boolean;
  submitting: boolean;
  error: string | null;
  openRace: string | null;
  isLocked: (raceId: string) => boolean;
  onOpenRace: (id: string | null) => void;
  onPick: (raceId: string, slot: Slot, runnerId: string) => void;
  onTiebreaker: (n: number) => void;
  onAi: () => void;
  onClear: () => void;
  onSim: () => void;
  onReset: () => void;
  onSubmit: () => void;
  onCancelEdit: () => void;
}

export function EntryPanel(p: Props) {
  const total = races.length;
  const remaining = total - p.pickedCount;
  const canSubmit = remaining === 0 && !p.submitting && (!p.entriesClosed || p.hasEntry);

  let submitLabel: string;
  if (p.submitting) submitLabel = "Saving…";
  else if (p.entriesClosed && !p.hasEntry) submitLabel = "Entries closed";
  else if (remaining > 0) submitLabel = `Pick ${remaining} more`;
  else submitLabel = p.editing ? "Save changes" : "Submit entry →";

  return (
    <section className="panel" id="play" aria-labelledby="entry-title">
      <div className="panel-head">
        <div>
          <h2 id="entry-title">{p.editing ? "Edit your entry" : "Your entry"}</h2>
          <p className="count">
            <strong>{p.pickedCount}</strong> / {total} races picked
          </p>
        </div>
        <div className="tools">
          <button className="btn btn-ghost" onClick={p.onAi} disabled={p.entriesClosed}>
            ✦ Let AI pick
          </button>
          {config.showSim && (
            <button className="btn btn-ghost" onClick={p.onSim} title="Fills picks, submits and settles all six races">
              🧪 Test sim: pick, submit and settle
            </button>
          )}
          <button className="btn btn-quiet" onClick={p.onClear} disabled={p.pickedCount === 0}>
            Clear all
          </button>
        </div>
      </div>

      <ol className="race-list">
        {races.map((race) => (
          <RaceCard
            key={race.id}
            race={race}
            pick={p.picks[race.id] ?? {}}
            locked={p.isLocked(race.id)}
            lockAt={race.off - config.lockMinutes * 60_000}
            now={p.now}
            open={p.openRace === race.id}
            onToggle={() => p.onOpenRace(p.openRace === race.id ? null : race.id)}
            onPick={(slot, runnerId) => p.onPick(race.id, slot, runnerId)}
          />
        ))}
      </ol>

      <div className="tiebreaker">
        <div>
          <h3>Tiebreaker</h3>
          <p>Total winning margins across all {total} races (in lengths)?</p>
        </div>
        <div className="stepper">
          <button
            type="button"
            aria-label="Decrease tiebreaker"
            onClick={() => p.onTiebreaker(Math.max(0, p.tiebreaker - 1))}
            disabled={p.entriesClosed || p.tiebreaker <= 0}
          >
            −
          </button>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            max={500}
            step={0.5}
            value={p.tiebreaker}
            disabled={p.entriesClosed}
            aria-label="Total winning margins in lengths"
            onChange={(e) => p.onTiebreaker(Math.min(500, Math.max(0, Number(e.target.value) || 0)))}
          />
          <button
            type="button"
            aria-label="Increase tiebreaker"
            onClick={() => p.onTiebreaker(Math.min(500, p.tiebreaker + 1))}
            disabled={p.entriesClosed}
          >
            +
          </button>
        </div>
      </div>

      {p.error && <p className="error" role="alert">{p.error}</p>}

      <div className="submit-row">
        <button className="btn btn-primary btn-lg" onClick={p.onSubmit} disabled={!canSubmit}>
          {submitLabel}
        </button>
        {p.editing && (
          <button className="btn btn-quiet" onClick={p.onCancelEdit}>
            Cancel
          </button>
        )}
        {config.showSim && (p.hasEntry || p.pickedCount > 0) && (
          <button className="btn btn-quiet" onClick={p.onReset}>
            Reset demo
          </button>
        )}
      </div>
      <p className="fine">Edit any time before each race locks · 18+ free to play</p>
    </section>
  );
}
