import { config } from "../config";
import type { Race } from "../types";

/**
 * SAMPLE DATA. Replace with your real card (or load it from an API).
 * Runner names are fictional. `tom` is [winner number, second number].
 */
function build(
  n: number,
  name: string,
  distance: string,
  going: string,
  runners: [string, string][],
  tom: [number, number],
): Race {
  const rs = runners.map(([runnerName, odds], i) => ({
    id: `r${n}-${i + 1}`,
    number: i + 1,
    name: runnerName,
    odds,
  }));
  return {
    id: `r${n}`,
    number: n,
    name,
    distance,
    going,
    off: config.eventStart + (n - 1) * config.raceGapMinutes * 60_000,
    runners: rs,
    tom: { winner: rs[tom[0] - 1].id, second: rs[tom[1] - 1].id },
  };
}

export const races: Race[] = [
  build(1, "The King George Stakes", "5f", "Good", [
    ["Cinder Sprint", "3/1"],
    ["Blazing Heath", "7/2"],
    ["Quick Tilt", "9/2"],
    ["Northern Rattle", "5/1"],
    ["Silver Dispatch", "8/1"],
    ["Paper Lantern", "12/1"],
    ["Last Orders", "16/1"],
  ], [1, 2]),
  build(2, "The Queen Anne Stakes", "1m", "Good", [
    ["Marble Hour", "2/1"],
    ["Kestrel Lane", "3/1"],
    ["Golden Ledger", "4/1"],
    ["Ember Court", "6/1"],
    ["Tidewater", "8/1"],
    ["Low Meridian", "10/1"],
    ["Quiet Riot Act", "14/1"],
    ["Vesper Light", "20/1"],
  ], [2, 1]),
  build(3, "The Hardwicke Stakes", "1m 4f", "Good", [
    ["Highgrove Dawn", "7/4"],
    ["Old Orchard", "5/2"],
    ["Stonebridge", "4/1"],
    ["Wren's Gambit", "6/1"],
    ["Salt and Pepper", "12/1"],
    ["Loose Change", "20/1"],
  ], [1, 3]),
  build(4, "The Diamond Jubilee Stakes", "6f", "Good", [
    ["Sundial", "5/2"],
    ["Raven Street", "7/2"],
    ["Copper Bell", "9/2"],
    ["Fastnet", "11/2"],
    ["Harbour Wall", "8/1"],
    ["Mister Blue", "10/1"],
    ["Night Ferry", "14/1"],
    ["Pocket Aces", "25/1"],
  ], [2, 1]),
  build(5, "The Wokingham Stakes", "6f", "Good", [
    ["Lucky Thursday", "6/1"],
    ["Brass Monkey", "7/1"],
    ["Evening Standard", "8/1"],
    ["Rooftop Garden", "9/1"],
    ["Slow Burn", "10/1"],
    ["Tin Soldier", "12/1"],
    ["Ghost Writer", "14/1"],
    ["Pennywhistle", "20/1"],
  ], [3, 5]),
  build(6, "The Ascot Stakes", "2m 4f", "Good", [
    ["Long Division", "3/1"],
    ["Distant Shore", "4/1"],
    ["Patient Hand", "9/2"],
    ["Winter Orchard", "6/1"],
    ["Hollow Crown", "10/1"],
    ["Far Cry", "16/1"],
    ["Open Road", "25/1"],
  ], [1, 2]),
];
