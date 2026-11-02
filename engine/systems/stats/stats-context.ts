import { createContext, useContext } from "react";

export const GENERAL_STATS_GROUP = "general";

export type StatValue = string | number;
export type Stats = Record<string, StatValue>;
export type StatGroups = Record<string, Stats>;

export type RegisterStatSettings = {
  group: string;
  replace: boolean;
};

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

  return ctx;
}
