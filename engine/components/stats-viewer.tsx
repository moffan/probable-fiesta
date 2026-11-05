import type { Stat, StatGroups } from "@systems";
import { defaultStatGroup, useStatsInternals } from "@systems/internal";
import { settings } from "@utils/settings";
import "./stats-viewer.css";

// Lowest order first, stats without one last. The sort is stable, so ties
// keep the order the stats were registered in.
function byOrder(a: Stat, b: Stat) {
  if (a.order === b.order) return 0;
  if (a.order === undefined) return 1;
  if (b.order === undefined) return -1;
  return a.order - b.order;
}

// Keeps only the stats whose visibility matches, drops empty groups, and puts
// the default group first. Other groups keep the order they were registered in.
function pickStats(statGroups: StatGroups, visible: boolean): StatGroups {
  const picked: StatGroups = {};
  const groups = Object.entries(statGroups).sort(
    ([a], [b]) => Number(b === defaultStatGroup) - Number(a === defaultStatGroup),
  );

  for (const [group, stats] of groups) {
    const entries = Object.entries(stats)
      .filter(([, stat]) => stat.visible === visible)
      .sort(([, a], [, b]) => byOrder(a, b));
    if (entries.length > 0) picked[group] = Object.fromEntries(entries);
  }

  return picked;
}

function StatGroupList(props: { statGroups: StatGroups }) {
  const { statGroups } = props;

  return Object.entries(statGroups).map(([group, stats]) => (
    <section key={group} className="stats-viewer__group">
      {group !== defaultStatGroup && (
        <h3 className="stats-viewer__group-name">{group}</h3>
      )}
      <dl className="stats-viewer__stats">
        {Object.entries(stats).map(([key, stat]) => (
          <div key={key} className="stats-viewer__stat">
            <dt>{key}</dt>
            <dd>{stat.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  ));
}

export default function StatsViewer() {
  const { statGroups } = useStatsInternals();
  const hiddenGroups = pickStats(statGroups, false);

  return (
    <div className="stats-viewer">
      <StatGroupList statGroups={pickStats(statGroups, true)} />
      {settings.debug && Object.keys(hiddenGroups).length > 0 && (
        <>
          <h2 className="stats-viewer__debug-header">Debug Values</h2>
          <StatGroupList statGroups={hiddenGroups} />
        </>
      )}
    </div>
  );
}
