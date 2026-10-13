# Race Day Predictor

A free-to-play prediction game: pick a winner in each of six races, add optional forecast and each-way picks, set a tiebreaker, and climb the leaderboard. Built with Vite, React and TypeScript. No backend required to run it.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build locally
```

## Configuration

Copy `.env.example` to `.env.local`.

| Variable | What it does |
| --- | --- |
| `VITE_EVENT_START` | ISO timestamp for the off of Race 1, e.g. `2026-09-14T14:00:00+01:00`. If unset, the event is always about nine days away (demo mode). |
| `VITE_SHOW_SIM` | Set to `true` to show the "Test sim" and "Reset demo" buttons in production. They always show in `npm run dev`. |

Branding, prize amounts, lock window and race spacing live in `src/config.ts`.

### Testing time-dependent behaviour

Add `?start=<minutes>` to the URL to move Race 1's off relative to now:

- `/?start=8` locks Race 1 in about three minutes, then animates live odds.
- `/?start=-60` makes Race 1 already locked, so entries are closed.

## Rules as implemented

| Bonus | Points | Condition |
| --- | --- | --- |
| Winner | +3 | Your Win pick wins the race |
| Forecast | +5 | Your Win pick wins and your 2nd pick finishes second |
| Each-way | +1 | Your Place pick finishes in the top 3 |
| Beat Tom | +5 | Your total before this bonus beats Tom's picks (applied once all races are settled) |

A **Perfect 6** is a correct Win pick in all six races. **Top of the day** goes to the highest score, with ties split by the closest tiebreaker (total winning margins in lengths). A race counts as picked once you choose a winner. Each race locks five minutes before the off, and entries close when Race 1 locks.

Scoring lives in `src/lib/scoring.ts`.

## What is placeholder

This is a rebuild from the public page, so a few things are stand-ins you will want to replace:

- **Race card and runners**: `src/data/races.ts` is sample data with fictional horses. Tom's picks for the Beat Tom bonus are set there too.
- **Live odds**: `src/hooks/useLiveOdds.ts` simulates price moves. Swap in your odds feed.
- **Submitting entries and fetching results**: `src/lib/api.ts` is the only file that talks to a server. Right now entries sit in `localStorage` and `fetchResults` returns `null`. Wire both to your backend (Supabase, a Vercel function, etc.). The app polls `fetchResults` every 60 seconds and settles automatically once results arrive.
- **Leaderboard rivals**: `src/lib/leaderboard.ts` generates sample players. Replace with real entries.
- **Let AI pick**: `suggestPicks` in `src/lib/simulate.ts` is a price-weighted heuristic, not a model.
- **Log in**: stores name and email locally. There is no authentication.
- **Legal copy**: the footer text, T&Cs link and affiliate link are copied from the original page. Check them against your own compliance requirements.

## Project layout

```
src/
  App.tsx               state, locking rules, submit/edit flow
  config.ts             branding, prizes, timing
  types.ts
  data/races.ts         the card (sample data)
  lib/                  scoring, odds, leaderboard, simulator, api seam, formatting
  hooks/                clock, localStorage persistence, live odds
  components/           Header, Hero, EntryPanel, RaceCard, SubmittedPanel, LivePanel, Leaderboard, EntryModal, Footer
  styles.css
```

## Deploying on Vercel

Import the repo. Vercel detects Vite automatically (build command `npm run build`, output `dist`). Add the environment variables above in the project settings.
