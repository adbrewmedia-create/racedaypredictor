import { config } from "../config";
import type { User } from "../types";

interface Props {
  user: User | null;
  onLogin: () => void;
}

export function Header({ user, onLogin }: Props) {
  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <a className="brand" href="#top">{config.brand}</a>
        <nav className="nav" aria-label="Sections">
          <a href="#play">Play</a>
          <a href="#live">Live</a>
          <a href="#leaderboard">Leaderboard</a>
        </nav>
        <div className="header-actions">
          <a className="link-free-bets" href={config.freeBetsUrl} target="_blank" rel="noopener noreferrer sponsored">
            Free bets →
          </a>
          <button className="btn btn-ghost" onClick={onLogin}>
            {user ? user.name.split(" ")[0] : "Log in"}
          </button>
        </div>
      </div>
    </header>
  );
}
