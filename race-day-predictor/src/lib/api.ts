import type { Entry, Results } from "../types";

/**
 * Backend seam. Everything the UI needs from a server lives here.
 * Right now entries are only kept in localStorage; swap these for
 * real calls (Supabase, a Vercel function, etc.).
 */

export async function submitEntry(entry: Entry): Promise<void> {
  // TODO: POST to your API, e.g.
  // await fetch("/api/entries", { method: "POST", body: JSON.stringify(entry) });
  await new Promise((resolve) => setTimeout(resolve, 400));
  void entry;
}

/** Return official results once published, or null while races are still to run. */
export async function fetchResults(): Promise<Results | null> {
  // TODO: GET your results endpoint.
  return null;
}
