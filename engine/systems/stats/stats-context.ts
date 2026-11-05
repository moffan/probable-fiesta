import { createContext, useContext } from "react";

export type StatValue = string | number;
export type Stat = {
  value: StatValue;
  visible: boolean;
  // Lowest first; stats without one come last
  order?: number;
};
export type Stats = Record<string, Stat>;
export type StatGroups = Record<string, Stats>;

export type RegisterStatSettings = {
  group: string;
  replace: boolean;
  visible: boolean;
  order?: number;
};

// The group a stat goes in when none is given. Internal to the engine.
export const defaultStatGroup = "general";

// A string is the name of the group
export type RegisterStatOptions = string | Partial<RegisterStatSettings>;

export type StatsSystemContext = {
  statGroups: StatGroups;
  registerStat: (
    key: string,
    value: StatValue,
    options?: RegisterStatOptions,
  ) => void;
};

export const StatsContext = createContext<StatsSystemContext | null>(null);

export function useStats() {
  const ctx = useContext(StatsContext);
  if (ctx == null) {
    throw new Error("stats failed to initialize");
  }

  const { registerStat } = ctx;

  return { registerStat };
}

// For the engine's own components only, see @systems/internal
export function useStatsInternals() {
  const ctx = useContext(StatsContext);
  if (ctx == null) {
    throw new Error("stats failed to initialize");
  }

  const { statGroups } = ctx;

  return { statGroups };
}
