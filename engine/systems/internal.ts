// Engine internals, for engine/components only. Game code may not import
// this; eslint.config.js enforces it.
export { useLocationInternals } from "./locations/location-context";
export { useStatsInternals, defaultStatGroup } from "./stats/stats-context";
