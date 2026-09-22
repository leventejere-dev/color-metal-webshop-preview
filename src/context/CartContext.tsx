import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { cartApi } from '@/lib/api';
import { totalsFromLines } from '@/lib/pricing';
import type { CartItem } from '@/lib/types';
import { MAX_ONLINE_QTY } from '@/config/pricing';
import { uid } from '@/lib/storage';

interface CartCtx {
  items: CartItem[];
  ready: boolean;
  count: number;
  totals: { netRon: number; vatRon: number; grossRon: number; weightKg: number };
  add: (item: Omit<CartItem, 'id' | 'addedAt'>) => CartItem;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
}

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    cartApi.list().then((l) => {
      setItems(l);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (loaded) void cartApi.save(items);
  }, [items, loaded]);

  const add = useCallback<CartCtx['add']>((input) => {
    const item: CartItem = { ...input, id: uid('ci_'), addedAt: new Date().toISOString() };
    setItems((l) => {
      // aceeași configurație → creștem cantitatea (până la limita online)
      const same = l.find(
        (x) =>
          x.shapeId === item.shapeId &&
          x.materialId === item.materialId &&
          x.finish === item.finish &&
          x.eloxColor === item.eloxColor &&
          x.length === item.length &&
          JSON.stringify(x.dims) === JSON.stringify(item.dims),
      );
      if (same) {
        return l.map((x) => (x.id === same.id ? { ...x, quantity: Math.min(MAX_ONLINE_QTY, x.quantity + item.quantity) } : x));
      }
      return [...l, item];
    });
    return item;
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    const q = Math.max(1, Math.min(MAX_ONLINE_QTY, Math.round(quantity) || 1));
    setItems((l) => l.map((x) => (x.id === id ? { ...x, quantity: q } : x)));
  }, []);

  const removeItem = useCallback((id: string) => setItems((l) => l.filter((x) => x.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);

  const totals = useMemo(() => {
    const t = totalsFromLines(items);
    const weightKg = Math.round(items.reduce((s, i) => s + i.unitWeightKg * i.quantity, 0) * 1000) / 1000;
    return { ...t, weightKg };
  }, [items]);

  const value = useMemo(
    () => ({ items, ready: loaded, count: items.reduce((s, i) => s + i.quantity, 0), totals, add, updateQuantity, removeItem, clear }),
    [items, loaded, totals, add, updateQuantity, removeItem, clear],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart(): CartCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCart în afara CartProvider');
  return ctx;
}
