import { generateId } from './utils';

export function generateShareToken(hiveId: string): string {
  const payload = { hiveId, token: generateId(), createdAt: new Date().toISOString() };
  return btoa(JSON.stringify(payload));
}

export function decodeShareToken(token: string): { hiveId: string } | null {
  try {
    const decoded = JSON.parse(atob(token));
    if (decoded && typeof decoded.hiveId === 'string') {
      return { hiveId: decoded.hiveId };
    }
    return null;
  } catch {
    return null;
  }
}
