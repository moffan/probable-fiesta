import { useCallback, useMemo, useState } from "react";
import {
  StatsContext,
  type RegisterStatOptions,
  type RegisterStatSettings,
  type StatGroups,
  type StatsSystemContext,
  type StatValue,
} from "./stats-context";

type StatsProviderProps = {
  children: React.ReactNode;
};

const registerStatSettings: RegisterStatSettings = {
  group: "general",
  replace: false,
};

export default function StatsProvider(props: StatsProviderProps) {
  const { children } = props;
  const [statGroups, setStatGroups] = useState<StatGroups>({});

  const registerStat = useCallback(
    (key: string, value: StatValue, options?: RegisterStatOptions) => {
      const { group, replace } = {
        ...registerStatSettings,
        ...(typeof options === "string" ? { group: options } : options),
      };

      setStatGroups((groups) => ({
        ...groups,
        [group]: replace
          ? { [key]: value }
          : { ...groups[group], [key]: value },
      }));
    },
    [],
  );

  const stats = useMemo<StatsSystemContext>(
    () => ({
      statGroups,
      registerStat,
    }),
    [statGroups, registerStat],
  );

  return (
    <StatsContext.Provider value={stats}>{children}</StatsContext.Provider>
  );
}
