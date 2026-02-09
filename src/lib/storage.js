const STORAGE_KEY = "anniversary-config-v1";

export function loadConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.error("Failed to load config", error);
    return null;
  }
}

export function saveConfig(config) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.error("Failed to save config", error);
  }
}

export function clearConfig() {
  localStorage.removeItem(STORAGE_KEY);
}
