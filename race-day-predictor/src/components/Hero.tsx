import { config } from "../config";
import { eventDateLabel, formatCountdown } from "../lib/format";
import { POINTS } from "../lib/scoring";

interface Props {
  now: number;
  entriesClose: number;
  entriesClosed: boolean;
}

const money = (n: number) => `£${n.toLocaleString("en-GB")}`;

export function Hero({ now, entriesClose, entriesClosed }: Props) {
  return (
    <section className="hero" id="top">
      <div className="wrap">
        <p className="hero-meta">
          Free to play · {config.venue} · {eventDateLabel(config.eventStart)}
        </p>
        <h1>
          Pick all six.<br />
          Win {money(config.prizes.perfectSix)}.
        </h1>
        <p className={`closes ${entriesClosed ? "is-closed" : ""}`} aria-live="off">
          {entriesClosed ? (
            <>Entries closed</>
          ) : (
            <>
              Entries close <strong>{formatCountdown(entriesClose - now)}</strong>
            </>
          )}
        </p>

        <ul className="tiles">
          <li className="tile tile-prize">
            <span className="tile-value">{money(config.prizes.perfectSix)}</span>
            <span className="tile-label">Perfect 6</span>
            <span className="tile-note">Pick all six winners</span>
          </li>
          <li className="tile tile-prize">
            <span className="tile-value">{money(config.prizes.topOfDay)}</span>
            <span className="tile-label">Top of the day</span>
            <span className="tile-note">Most points on the leaderboard</span>
          </li>
          <li className="tile">
            <span className="tile-value">+{POINTS.winner}</span>
            <span className="tile-label">Winner</span>
            <span className="tile-note">Pick the horse that wins</span>
          </li>
          <li className="tile">
            <span className="tile-value">+{POINTS.forecast}</span>
            <span className="tile-label">Forecast</span>
            <span className="tile-note">1st and 2nd in the correct order</span>
          </li>
          <li className="tile">
            <span className="tile-value">+{POINTS.place}</span>
            <span className="tile-label">Each-way</span>
            <span className="tile-note">Pick a horse to place in the top 3</span>
          </li>
          <li className="tile">
            <span className="tile-value">+{POINTS.beatTom}</span>
            <span className="tile-label">Beat Tom</span>
            <span className="tile-note">Outscore Tom's picks for a bonus</span>
          </li>
        </ul>
      </div>
    </section>
  );
}
