import { useEffect, useState } from "react";
import { config } from "./config";
import { races } from "./data/races";
import { useNow } from "./hooks/useNow";
import { usePersisted } from "./hooks/usePersisted";
import { fetchResults, submitEntry } from "./lib/api";
import { suggestPicks, simulateResults } from "./lib/simulate";
import type { Entry, Picks, Race, Results, Slot, User } from "./types";
import { EntryModal } from "./components/EntryModal";
import { EntryPanel } from "./components/EntryPanel";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Leaderboard } from "./components/Leaderboard";
import { LivePanel } from "./components/LivePanel";
import { SubmittedPanel } from "./components/SubmittedPanel";

const lockAt = (r: Race) => r.off - config.lockMinutes * 60_000;

export default function App() {
  const now = useNow(1000);
  const [picks, setPicks] = usePersisted<Picks>("picks", {});
  const [tiebreaker, setTiebreaker] = usePersisted<number>("tiebreaker", 0);
  const [entry, setEntry] = usePersisted<Entry | null>("entry", null);
  const [user, setUser] = usePersisted<User | null>("user", null);
  const [results, setResults] = usePersisted<Results>("results", {});
  const [editing, setEditing] = useState(false);
  const [modal, setModal] = useState<null | "submit" | "login">(null);
  const [openRace, setOpenRace] = useState<string | null>(races[0].id);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pull official results when your backend publishes them.
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const r = await fetchResults();
        if (!cancelled && r && Object.keys(r).length > 0) setResults(r);
      } catch {
        /* keep last known results */
      }
    };
    load();
    const id = setInterval(load, 60_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [setResults]);

  const settled = Object.keys(results).length > 0;
  const isLocked = (r: Race) => settled || now >= lockAt(r);
  const entriesClose = lockAt(races[0]);
  const entriesClosed = settled || now >= entriesClose;
  const pickedCount = races.filter((r) => picks[r.id]?.winner).length;
  const showPicker = !entry || editing;
  const hasLockedRace = races.some(isLocked);

  const onPick = (race: Race, slot: Slot, runnerId: string) => {
    if (isLocked(race)) return;
    setPicks((prev) => {
      const cur = { ...(prev[race.id] ?? {}) };
      const wasSet = cur[slot] === runnerId;
      // A runner can only fill one slot per race.
      (Object.keys(cur) as Slot[]).forEach((k) => {
        if (cur[k] === runnerId) delete cur[k];
      });
      if (!wasSet) cur[slot] = runnerId;
      return { ...prev, [race.id]: cur };
    });
  };

  const aiPick = () => {
    const suggestion = suggestPicks(races);
    setPicks((prev) => {
      const next = { ...prev };
      for (const r of races) if (!isLocked(r)) next[r.id] = suggestion[r.id];
      return next;
    });
    if (!entriesClosed && tiebreaker === 0) setTiebreaker(Math.round(12 + Math.random() * 16));
  };

  const clearAll = () => {
    setPicks((prev) => Object.fromEntries(Object.entries(prev).filter(([id]) => isLocked(races.find((r) => r.id === id)!))));
    if (!entriesClosed) setTiebreaker(0);
  };

  const doSubmit = async (u: User) => {
    setSubmitting(true);
    setError(null);
    const e: Entry = { user: u, picks, tiebreaker, submittedAt: new Date().toISOString() };
    try {
      await submitEntry(e);
      setEntry(e);
      setEditing(false);
    } catch {
      setError("We couldn't save your entry. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmit = () => {
    if (pickedCount < races.length) return;
    if (!user) setModal("submit");
    else void doSubmit(user);
  };

  const onModalSave = (u: User) => {
    const mode = modal;
    setUser(u);
    setModal(null);
    if (mode === "submit") void doSubmit(u);
  };

  const cancelEdit = () => {
    if (entry) {
      setPicks(entry.picks);
      setTiebreaker(entry.tiebreaker);
    }
    setEditing(false);
    setError(null);
  };

  const runSim = () => {
    const simPicks = suggestPicks(races);
    const u = user ?? { name: "Test Player", email: "test@example.com" };
    const tb = Math.round(15 + Math.random() * 15);
    setPicks(simPicks);
    setTiebreaker(tb);
    setUser(u);
    setEntry({ user: u, picks: simPicks, tiebreaker: tb, submittedAt: new Date().toISOString() });
    setResults(simulateResults(races));
    setEditing(false);
  };

  const resetDemo = () => {
    setPicks({});
    setTiebreaker(0);
    setEntry(null);
    setResults({});
    setEditing(false);
    setError(null);
    setOpenRace(races[0].id);
  };

  return (
    <>
      <Header user={user} onLogin={() => setModal("login")} />
      <main>
        <Hero now={now} entriesClose={entriesClose} entriesClosed={entriesClosed} />
        <div className="wrap stack">
          {showPicker ? (
            <EntryPanel
              now={now}
              picks={picks}
              pickedCount={pickedCount}
              tiebreaker={tiebreaker}
              editing={editing}
              hasEntry={!!entry}
              entriesClosed={entriesClosed}
              submitting={submitting}
              error={error}
              openRace={openRace}
              isLocked={(id) => isLocked(races.find((r) => r.id === id)!)}
              onOpenRace={setOpenRace}
              onPick={(raceId, slot, runnerId) => onPick(races.find((r) => r.id === raceId)!, slot, runnerId)}
              onTiebreaker={setTiebreaker}
              onAi={aiPick}
              onClear={clearAll}
              onSim={runSim}
              onReset={resetDemo}
              onSubmit={onSubmit}
              onCancelEdit={cancelEdit}
            />
          ) : (
            <SubmittedPanel
              entry={entry!}
              results={results}
              hasLockedRace={hasLockedRace}
              entriesClosed={entriesClosed}
              onEdit={() => setEditing(true)}
              onReset={resetDemo}
            />
          )}
          <LivePanel now={now} results={results} />
          <Leaderboard results={results} entry={entry} />
        </div>
      </main>
      <Footer />
      {modal && (
        <EntryModal mode={modal} initial={user} onCancel={() => setModal(null)} onSave={onModalSave} />
      )}
    </>
  );
}
