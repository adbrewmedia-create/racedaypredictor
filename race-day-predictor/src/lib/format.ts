export function formatCountdown(msLeft: number): string {
  if (msLeft <= 0) return "00:00:00";
  const s = Math.floor(msLeft / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d > 0 ? `${d}D ` : ""}${pad(h)}:${pad(m)}:${pad(sec)}`;
}

export function raceTime(ms: number): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/London",
  }).format(ms);
}

export function eventDateLabel(ms: number): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Europe/London",
  })
    .format(ms)
    .replace(",", "");
}
