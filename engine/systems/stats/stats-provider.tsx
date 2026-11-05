import { useCallback, useMemo, useState } from "react";
import {
  StatsContext,
  type RegisterStatOptions,
  defaultStatGroup,
  type RegisterStatSettings,
  type StatGroups,
  type StatsSystemContext,
  type StatValue,
} from "./stats-context";

type StatsProviderProps = {
  children: React.ReactNode;
};

const registerStatSettings: RegisterStatSettings = {
  group: defaultStatGroup,
  replace: false,
  visible: false,
};

export default function StatsProvider(props: StatsProviderProps) {
  const { children } = props;
  const [statGroups, setStatGroups] = useState<StatGroups>({});

  const registerStat = useCallback(
    (key: string, value: StatValue, options?: RegisterStatOptions) => {
      const given = typeof options === "string" ? { group: options } : options;
      const { group, replace } = { ...registerStatSettings, ...given };

      setStatGroups((groups) => {
        // Updating a stat keeps its visibility and order unless new ones
        // are given
        const existing = groups[group]?.[key];
        const visible =
          given?.visible ?? existing?.visible ?? registerStatSettings.visible;
        const order =
          given?.order ?? existing?.order ?? registerStatSettings.order;
        const stat = { value, visible, order };

        return {
          ...groups,
          [group]: replace ? { [key]: stat } : { ...groups[group], [key]: stat },
        };
      });
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
