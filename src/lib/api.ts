/**
 * "API" demo: toate funcțiile sunt asincrone și au aceeași semnătură pe care ar avea-o
 * un client HTTP real. Pentru integrarea cu backend-ul, se înlocuiește doar acest fișier
 * (fetch către /api/auth, /api/orders, /api/favorites, /api/cart) – restul aplicației rămâne neschimbat.
 */
import { hashPassword, read, remove, uid, write } from './storage';
import type { Address, CartItem, Order, PaymentMethod, PublicUser, User, UserSettings } from './types';
import { totalsFromLines } from './pricing';
import { SEED_ORDERS, DEMO_USER } from '@/data/demo';

const KEYS = {
  users: 'users',
  session: 'session',
  orders: 'orders',
  cart: 'cart',
  favorites: (owner: string) => `favorites.${owner}`,
  seeded: 'seeded.v1',
};

const delay = (ms = 120) => new Promise((r) => setTimeout(r, ms));
const strip = (u: User): PublicUser => {
  const { passwordHash: _ph, ...rest } = u;
  return rest;
};

/* ------------------------------------------------------------------ seed */
export async function ensureSeed(): Promise<void> {
  if (read<boolean>(KEYS.seeded, false)) return;
  const users = read<User[]>(KEYS.users, []);
  if (!users.some((u) => u.email === DEMO_USER.email)) {
    const passwordHash = await hashPassword(DEMO_USER.password);
    users.push({ ...DEMO_USER.user, passwordHash });
    write(KEYS.users, users);
  }
  const orders = read<Order[]>(KEYS.orders, []);
  if (!orders.some((o) => o.userId === DEMO_USER.user.id)) {
    write(KEYS.orders, [...SEED_ORDERS, ...orders]);
  }
  write(KEYS.seeded, true);
}

/* ------------------------------------------------------------------ auth */
export interface RegisterInput {
  name: string;
  email: string;
  phone: string;
  company?: string;
  cui?: string;
  password: string;
}

export const authApi = {
  async current(): Promise<PublicUser | null> {
    const id = read<string | null>(KEYS.session, null);
    if (!id) return null;
    const u = read<User[]>(KEYS.users, []).find((x) => x.id === id);
    return u ? strip(u) : null;
  },

  async register(input: RegisterInput): Promise<PublicUser> {
    await delay();
    const users = read<User[]>(KEYS.users, []);
    const email = input.email.trim().toLowerCase();
    if (users.some((u) => u.email === email)) throw new Error('Există deja un cont cu această adresă de email.');
    const user: User = {
      id: uid('u_'),
      name: input.name.trim(),
      email,
      phone: input.phone.trim(),
      company: input.company?.trim() || undefined,
      cui: input.cui?.trim() || undefined,
      passwordHash: await hashPassword(input.password),
      createdAt: new Date().toISOString(),
      settings: { newsletter: false, orderEmails: true, invoiceCompany: !!input.company },
    };
    users.push(user);
    write(KEYS.users, users);
    write(KEYS.session, user.id);
    return strip(user);
  },

  async login(email: string, password: string): Promise<PublicUser> {
    await delay();
    const users = read<User[]>(KEYS.users, []);
    const u = users.find((x) => x.email === email.trim().toLowerCase());
    if (!u || u.passwordHash !== (await hashPassword(password))) throw new Error('Email sau parolă incorectă.');
    write(KEYS.session, u.id);
    return strip(u);
  },

  async logout(): Promise<void> {
    remove(KEYS.session);
  },

  async updateProfile(userId: string, patch: Partial<Pick<User, 'name' | 'email' | 'phone' | 'company' | 'cui' | 'billing' | 'delivery'>> & { settings?: Partial<UserSettings> }): Promise<PublicUser> {
    await delay();
    const users = read<User[]>(KEYS.users, []);
    const idx = users.findIndex((u) => u.id === userId);
    if (idx < 0) throw new Error('Utilizatorul nu a fost găsit.');
    if (patch.email) {
      const email = patch.email.trim().toLowerCase();
      if (users.some((u) => u.email === email && u.id !== userId)) throw new Error('Adresa de email este deja folosită.');
      patch.email = email;
    }
    const { settings, ...rest } = patch;
    users[idx] = { ...users[idx], ...rest, settings: { ...users[idx].settings, ...(settings ?? {}) } };
    write(KEYS.users, users);
    return strip(users[idx]);
  },

  async changePassword(userId: string, current: string, next: string): Promise<void> {
    await delay();
    const users = read<User[]>(KEYS.users, []);
    const idx = users.findIndex((u) => u.id === userId);
    if (idx < 0) throw new Error('Utilizatorul nu a fost găsit.');
    if (users[idx].passwordHash !== (await hashPassword(current))) throw new Error('Parola actuală este incorectă.');
    users[idx].passwordHash = await hashPassword(next);
    write(KEYS.users, users);
  },
};

/* ------------------------------------------------------------------ cart */
export const cartApi = {
  async list(): Promise<CartItem[]> {
    return read<CartItem[]>(KEYS.cart, []);
  },
  async save(items: CartItem[]): Promise<void> {
    write(KEYS.cart, items);
  },
};

/* ------------------------------------------------------------- favorites */
export const favoritesApi = {
  async list(owner: string): Promise<string[]> {
    return read<string[]>(KEYS.favorites(owner), []);
  },
  async save(owner: string, slugs: string[]): Promise<void> {
    write(KEYS.favorites(owner), slugs);
  },
  /** la autentificare, favoritele salvate ca vizitator se unesc cu cele din cont */
  async merge(from: string, into: string): Promise<string[]> {
    const a = read<string[]>(KEYS.favorites(from), []);
    const b = read<string[]>(KEYS.favorites(into), []);
    const merged = Array.from(new Set([...b, ...a]));
    write(KEYS.favorites(into), merged);
    remove(KEYS.favorites(from));
    return merged;
  },
};

/* ---------------------------------------------------------------- orders */
export interface CreateOrderInput {
  userId: string | null;
  items: CartItem[];
  payment: PaymentMethod;
  cardLast4?: string;
  billing: Address;
  delivery: Address;
  customerEmail: string;
  notes?: string;
}

function nextOrderNumber(orders: Order[]): string {
  const year = new Date().getFullYear();
  const seq = orders.filter((o) => o.number.startsWith(`CM-${year}`)).length + 1041;
  return `CM-${year}-${String(seq).padStart(6, '0')}`;
}

export const ordersApi = {
  async list(userId: string): Promise<Order[]> {
    return read<Order[]>(KEYS.orders, [])
      .filter((o) => o.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  async get(id: string): Promise<Order | null> {
    return read<Order[]>(KEYS.orders, []).find((o) => o.id === id || o.number === id) ?? null;
  },
  async create(input: CreateOrderInput): Promise<Order> {
    await delay(200);
    const orders = read<Order[]>(KEYS.orders, []);
    const totals = totalsFromLines(input.items);
    const number = nextOrderNumber(orders);
    const order: Order = {
      id: uid('o_'),
      number,
      userId: input.userId,
      createdAt: new Date().toISOString(),
      items: input.items,
      ...totals,
      totalWeightKg: Math.round(input.items.reduce((s, i) => s + i.unitWeightKg * i.quantity, 0) * 1000) / 1000,
      payment: input.payment,
      cardLast4: input.payment === 'card' ? input.cardLast4 : undefined,
      status: input.payment === 'transfer' ? 'asteapta_plata' : 'confirmata',
      billing: input.billing,
      delivery: input.delivery,
      customerEmail: input.customerEmail,
      notes: input.notes,
      proformaNumber: input.payment === 'transfer' ? number.replace('CM-', 'PF-') : undefined,
      invoiceNumber: input.payment !== 'transfer' ? number.replace('CM-', 'FCM-') : undefined,
      invoiceDate: input.payment !== 'transfer' ? new Date().toISOString() : undefined,
    };
    write(KEYS.orders, [order, ...orders]);
    return order;
  },
};
