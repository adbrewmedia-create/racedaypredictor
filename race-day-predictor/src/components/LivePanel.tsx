import { config } from "../config";
import { races } from "../data/races";
import { useLiveOdds } from "../hooks/useLiveOdds";
import { eventDateLabel, formatCountdown, raceTime } from "../lib/format";
import type { Results } from "../types";

interface Props {
  now: number;
  results: Results;
}

const RUN_MS = 5 * 60_000;

function statusOf(off: number, now: number, settled: boolean) {
  if (settled) return "Settled";
  const lock = off - config.lockMinutes * 60_000;
  if (now < lock) return "Open";
  if (now < off) return "Locked";
  if (now < off + RUN_MS) return "Running";
  return "Awaiting result";
}

export function LivePanel({ now, results }: Props) {
  const current =
    races.find((r) => !results[r.id] && now < r.off + RUN_MS) ?? races[races.length - 1];
  const next = races.find((r) => r.number === current.number + 1);
  const status = statusOf(current.off, now, !!results[current.id]);
  const animate = status === "Open" || status === "Locked";
  const { odds, move } = useLiveOdds(current, animate);

  return (
    <section className="panel" id="live" aria-labelledby="live-title">
      <p className="live-kicker">
        <span className="dot" aria-hidden="true" /> Live · {config.venue} · {eventDateLabel(config.eventStart)}
      </p>
      <h2 id="live-title">Race {current.number}: live odds</h2>

      <dl className="facts">
        <div><dt>Race</dt><dd>{current.name}</dd></div>
        <div><dt>Distance</dt><dd>{current.distance}</dd></div>
        <div><dt>Going</dt><dd>{current.going}</dd></div>
        <div><dt>Status</dt><dd><span className={`status status-${status.split(" ")[0].toLowerCase()}`}>{status}</span></dd></div>
      </dl>

      <h3 className="sub">Full field: live prices</h3>
      <table className="odds-table">
        <caption className="sr-only">Runners and current prices for {current.name}</caption>
        <thead>
          <tr><th scope="col">No.</th><th scope="col">Runner</th><th scope="col" className="num">Price</th></tr>
        </thead>
        <tbody>
          {current.runners.map((r) => (
            <tr key={r.id}>
              <td>{r.number}</td>
              <td>{r.name}</td>
              <td className={`num price ${move[r.id] ?? ""}`} key={odds[r.id]}>
                {odds[r.id]}
                {move[r.id] === "shorten" && <span aria-label="shortened"> ▼</span>}
                {move[r.id] === "drift" && <span aria-label="drifted"> ▲</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {next && (
        <div className="up-next">
          <span className="race-no">{next.number}</span>
          <div className="up-next-main">
            <p className="kicker">Up next · odds go live at the lock</p>
            <p className="race-name">{next.name}</p>
            <p className="race-meta">
              {raceTime(next.off)} · {next.distance} · {next.going} · {next.runners.length} runners
            </p>
          </div>
          <div className="up-next-count">
            <strong>{formatCountdown(next.off - config.lockMinutes * 60_000 - now)}</strong>
            <span>Locks {config.lockMinutes} min before the off</span>
          </div>
        </div>
      )}
    </section>
  );
}
