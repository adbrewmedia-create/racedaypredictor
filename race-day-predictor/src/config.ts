const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");

/**
 * When does Race 1 go off?
 *  1. ?start=<minutes from now>   (handy for testing locks and live odds, e.g. ?start=8)
 *  2. VITE_EVENT_START            (ISO timestamp)
 *  3. Rolling demo date, roughly nine days away
 */
function resolveEventStart(): number {
  const startParam = params.get("start");
  if (startParam !== null && startParam.trim() !== "" && !Number.isNaN(Number(startParam))) {
    return Date.now() + Number(startParam) * 60_000;
  }
  const fromEnv = import.meta.env.VITE_EVENT_START;
  if (fromEnv) {
    const t = Date.parse(fromEnv);
    if (!Number.isNaN(t)) return t;
  }
  return Date.now() + (9 * 24 * 60 + 6 * 60 + 2) * 60_000;
}

export const config = {
  brand: "Tom's Games.",
  venue: "Ascot",
  eventStart: resolveEventStart(),
  /** Minutes before the off that a race locks. */
  lockMinutes: 5,
  /** Gap between races, in minutes. */
  raceGapMinutes: 35,
  prizes: { perfectSix: 1000, topOfDay: 100 },
  freeBetsUrl: "https://tomgarrattbets.com/free-bets/",
  showSim: import.meta.env.DEV || import.meta.env.VITE_SHOW_SIM === "true",
};
