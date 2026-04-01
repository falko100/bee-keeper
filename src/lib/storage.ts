import { STORAGE_KEYS, CURRENT_SCHEMA_VERSION } from './constants';

export function getItem<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function initStorage(): void {
  const version = getItem<number>(STORAGE_KEYS.SCHEMA_VERSION);
  if (version === null) {
    setItem(STORAGE_KEYS.SCHEMA_VERSION, CURRENT_SCHEMA_VERSION);
    if (!getItem(STORAGE_KEYS.HIVES)) setItem(STORAGE_KEYS.HIVES, []);
    if (!getItem(STORAGE_KEYS.INSPECTIONS)) setItem(STORAGE_KEYS.INSPECTIONS, []);
    if (!getItem(STORAGE_KEYS.TASKS)) setItem(STORAGE_KEYS.TASKS, []);
  }
}
