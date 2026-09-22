import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { authApi, ensureSeed, favoritesApi, type RegisterInput } from '@/lib/api';
import type { PublicUser } from '@/lib/types';

interface AuthCtx {
  user: PublicUser | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<PublicUser>;
  register: (input: RegisterInput) => Promise<PublicUser>;
  logout: () => Promise<void>;
  updateProfile: (patch: Parameters<typeof authApi.updateProfile>[1]) => Promise<PublicUser>;
  changePassword: (current: string, next: string) => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);
export const GUEST_KEY = 'guest';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      await ensureSeed();
      const u = await authApi.current();
      if (alive) {
        setUser(u);
        setReady(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const u = await authApi.login(email, password);
    await favoritesApi.merge(GUEST_KEY, u.id);
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const u = await authApi.register(input);
    await favoritesApi.merge(GUEST_KEY, u.id);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  const updateProfile = useCallback<AuthCtx['updateProfile']>(
    async (patch) => {
      if (!user) throw new Error('Nu ești autentificat.');
      const u = await authApi.updateProfile(user.id, patch);
      setUser(u);
      return u;
    },
    [user],
  );

  const changePassword = useCallback(
    async (current: string, next: string) => {
      if (!user) throw new Error('Nu ești autentificat.');
      await authApi.changePassword(user.id, current, next);
    },
    [user],
  );

  const value = useMemo(
    () => ({ user, ready, login, register, logout, updateProfile, changePassword }),
    [user, ready, login, register, logout, updateProfile, changePassword],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth în afara AuthProvider');
  return ctx;
}
