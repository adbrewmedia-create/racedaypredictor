import type { Race, RacePick, Slot } from "../types";
import { formatCountdown, raceTime } from "../lib/format";

const SLOTS: { key: Slot; label: string; title: string }[] = [
  { key: "winner", label: "Win", title: "Winner" },
  { key: "second", label: "2nd", title: "Second (forecast)" },
  { key: "place", label: "Place", title: "Each-way (top 3)" },
];

interface Props {
  race: Race;
  pick: RacePick;
  locked: boolean;
  lockAt: number;
  now: number;
  open: boolean;
  onToggle: () => void;
  onPick: (slot: Slot, runnerId: string) => void;
}

export function RaceCard({ race, pick, locked, lockAt, now, open, onToggle, onPick }: Props) {
  const nameOf = (id?: string) => race.runners.find((r) => r.id === id)?.name;
  const picked = !!pick.winner;
  const panelId = `panel-${race.id}`;

  return (
    <li className={`race-card ${open ? "is-open" : ""} ${picked ? "is-picked" : ""} ${locked ? "is-locked" : ""}`}>
      <button
        className="race-head"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span className="race-no">{race.number}</span>
        <span className="race-title">
          <span className="race-name">{race.name}</span>
          <span className="race-meta">
            {raceTime(race.off)} · {race.distance} · {race.going} · {race.runners.length} runners
          </span>
        </span>
        <span className="race-state">
          {locked ? (
            <span className="chip chip-locked">Locked</span>
          ) : picked ? (
            <span className="chip chip-ok">{nameOf(pick.winner)}</span>
          ) : (
            <span className="chip">Not picked</span>
          )}
          {!locked && <span className="lock-in">Locks in {formatCountdown(lockAt - now)}</span>}
        </span>
      </button>

      {open && (
        <div className="race-body" id={panelId}>
          <p className="hint">
            Pick a winner to enter this race. Add a 2nd for the forecast bonus and a place pick for the each-way point.
          </p>
          <ul className="runners">
            {race.runners.map((runner) => (
              <li className="runner" key={runner.id}>
                <span className="runner-no">{runner.number}</span>
                <span className="runner-name">{runner.name}</span>
                <span className="runner-odds">{runner.odds}</span>
                <div className="slots" role="group" aria-label={`Picks for ${runner.name}`}>
                  {SLOTS.map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      className={`slot slot-${s.key}`}
                      aria-pressed={pick[s.key] === runner.id}
                      title={s.title}
                      disabled={locked}
                      onClick={() => onPick(s.key, runner.id)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}
