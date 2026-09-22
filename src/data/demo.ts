/**
 * Cont demo + comenzi istorice, ca fiecare pagină a contului să aibă conținut la prima deschidere.
 * Autentificare: demo@color-metal.ro / Demo1234
 */
import type { Address, CartItem, Order, User } from '@/lib/types';
import { MATERIALS, type MaterialId } from './materials';
import { SHAPE_BY_ID, type ShapeId } from './shapes';
import { pieceWeightKg, dimsLabel, type Dims } from '@/lib/geometry';
import { computePrice, totalsFromLines } from '@/lib/pricing';

const address: Address = {
  name: 'Client Demo',
  company: 'Exemplu Construct SRL',
  cui: 'RO00000000',
  street: 'Str. Exemplului nr. 10',
  city: 'Cluj-Napoca',
  county: 'Cluj',
  postalCode: '400000',
  country: 'România',
  phone: '+40 700 000 000',
};

export const DEMO_USER = {
  email: 'demo@color-metal.ro',
  password: 'Demo1234',
  user: {
    id: 'u_demo',
    name: 'Client Demo',
    email: 'demo@color-metal.ro',
    phone: '+40 700 000 000',
    company: 'Exemplu Construct SRL',
    cui: 'RO00000000',
    createdAt: '2026-03-02T09:15:00.000Z',
    billing: address,
    delivery: { ...address, company: undefined, cui: undefined },
    settings: { newsletter: true, orderEmails: true, invoiceCompany: true },
  } satisfies Omit<User, 'passwordHash'>,
};

function item(shapeId: ShapeId, materialId: MaterialId, dims: Dims, length: number, quantity: number, addedAt = '2026-05-10T10:00:00.000Z'): CartItem {
  const shape = SHAPE_BY_ID[shapeId];
  const unitWeightKg = Math.round(pieceWeightKg(shapeId, dims, length, MATERIALS[materialId].density) * 1000) / 1000;
  const p = computePrice(materialId, unitWeightKg, quantity);
  return {
    id: `ci_${shapeId}_${materialId}_${length}_${quantity}`,
    shapeId,
    materialId,
    finish: materialId === 'AL' ? 'natur' : undefined,
    dims,
    length,
    quantity,
    unitWeightKg,
    pricePerKgRon: p.pricePerKgRon,
    unitNetRon: p.unitNetRon,
    label: `${shape.name} ${MATERIALS[materialId].label} – ${dimsLabel(shape, dims, { length })}`,
    addedAt,
  };
}

function order(partial: Omit<Order, 'netRon' | 'vatRon' | 'grossRon' | 'totalWeightKg'>): Order {
  const totals = totalsFromLines(partial.items);
  return {
    ...partial,
    ...totals,
    totalWeightKg: Math.round(partial.items.reduce((s, i) => s + i.unitWeightKg * i.quantity, 0) * 1000) / 1000,
  };
}

export const SEED_ORDERS: Order[] = [
  order({
    id: 'o_demo_1',
    number: 'CM-2026-001038',
    userId: 'u_demo',
    createdAt: '2026-05-12T08:40:00.000Z',
    items: [
      item('square_tube', 'AL', { side: 40, thickness: 2 }, 2000, 12, '2026-05-12T08:30:00.000Z'),
      item('profile_l', 'AL', { width: 40, height: 40, thickness: 3 }, 3000, 6, '2026-05-12T08:32:00.000Z'),
    ],
    payment: 'card',
    status: 'livrata',
    billing: address,
    delivery: { ...address, company: undefined, cui: undefined },
    customerEmail: 'demo@color-metal.ro',
    invoiceNumber: 'FCM-2026-001038',
    invoiceDate: '2026-05-12T09:05:00.000Z',
  }),
  order({
    id: 'o_demo_2',
    number: 'CM-2026-001039',
    userId: 'u_demo',
    createdAt: '2026-08-21T13:10:00.000Z',
    items: [
      item('round_bar', 'BRASS', { outer_diameter: 20 }, 1000, 4, '2026-08-21T13:00:00.000Z'),
      item('thick_plate', 'AL', { width: 1000, thickness: 10 }, 500, 2, '2026-08-21T13:02:00.000Z'),
    ],
    payment: 'transfer',
    status: 'asteapta_plata',
    billing: address,
    delivery: { ...address, company: undefined, cui: undefined },
    customerEmail: 'demo@color-metal.ro',
    proformaNumber: 'PF-2026-001039',
  }),
  order({
    id: 'o_demo_3',
    number: 'CM-2026-001040',
    userId: 'u_demo',
    createdAt: '2026-09-15T15:25:00.000Z',
    items: [item('flat_bar', 'CU', { width: 30, thickness: 5 }, 1500, 10, '2026-09-15T15:20:00.000Z')],
    payment: 'card',
    cardLast4: '4242',
    status: 'in_procesare',
    billing: address,
    delivery: { ...address, company: undefined, cui: undefined },
    customerEmail: 'demo@color-metal.ro',
    invoiceNumber: 'FCM-2026-001040',
    invoiceDate: '2026-09-15T15:40:00.000Z',
  }),
];
