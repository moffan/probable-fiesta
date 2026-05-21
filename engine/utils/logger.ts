import { settings } from "./settings";

export const logger = {
  log: (...args: unknown[]) => {
    if (settings.debug) console.log(...args);
  },
  warn: (...args: unknown[]) => {
    if (settings.debug) console.warn(...args);
  },
  error: (...args: unknown[]) => {
    if (settings.debug) console.error(...args);
  },
};
