import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { favoritesApi } from '@/lib/api';
import { GUEST_KEY, useAuth } from './AuthContext';

interface FavCtx {
  slugs: string[];
  has: (slug: string) => boolean;
  toggle: (slug: string) => boolean; // returnează noua stare
  remove: (slug: string) => void;
}

const Ctx = createContext<FavCtx | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user, ready } = useAuth();
  const owner = user?.id ?? GUEST_KEY;
  const [slugs, setSlugs] = useState<string[]>([]);
  const [loadedFor, setLoadedFor] = useState<string | null>(null);

  useEffect(() => {
    if (!ready) return;
    favoritesApi.list(owner).then((l) => {
      setSlugs(l);
      setLoadedFor(owner);
    });
  }, [owner, ready]);

  useEffect(() => {
    if (loadedFor === owner) void favoritesApi.save(owner, slugs);
  }, [slugs, owner, loadedFor]);

  const has = useCallback((slug: string) => slugs.includes(slug), [slugs]);
  const toggle = useCallback(
    (slug: string) => {
      const next = !slugs.includes(slug);
      setSlugs((l) => (next ? [...l, slug] : l.filter((s) => s !== slug)));
      return next;
    },
    [slugs],
  );
  const remove = useCallback((slug: string) => setSlugs((l) => l.filter((s) => s !== slug)), []);

  const value = useMemo(() => ({ slugs, has, toggle, remove }), [slugs, has, toggle, remove]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useFavorites(): FavCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useFavorites în afara FavoritesProvider');
  return ctx;
}
