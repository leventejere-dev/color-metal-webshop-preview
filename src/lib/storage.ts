/**
 * Strat subțire peste localStorage. Toate cheile sunt prefixate cu `cm.` ca să poată fi
 * curățate ușor și ca să nu intre în conflict cu alte aplicații de pe același domeniu.
 */
const PREFIX = 'cm.';

export function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function write<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* quota / private mode – ignorăm în prototip */
  }
}

export function remove(key: string): void {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    /* ignore */
  }
}

export function uid(prefix = ''): string {
  const rnd = Math.random().toString(36).slice(2, 8);
  return `${prefix}${Date.now().toString(36)}${rnd}`;
}

export async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(`color-metal-demo::${password}`);
  if (globalThis.crypto?.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  // fallback (context nesecurizat): hash simplu, doar pentru demo
  let h = 0;
  for (const c of data) h = (h * 31 + c) >>> 0;
  return `weak-${h.toString(16)}`;
}
