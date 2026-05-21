type EngineSettings = {
  debug: boolean;
};

const SETTINGS_KEY = "moff-engine-settings";
const defaults: EngineSettings = { debug: false };

function loadSettings(): EngineSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw
      ? { ...defaults, ...(JSON.parse(raw) as Partial<EngineSettings>) }
      : { ...defaults };
  } catch {
    return { ...defaults };
  }
}

export const settings = loadSettings();

export function saveSettings(overrides: Partial<EngineSettings>): void {
  Object.assign(settings, overrides);
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
