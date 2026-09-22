import type { EloxColorId, FinishId, MaterialId } from '@/data/materials';
import type { ShapeId } from '@/data/shapes';
import type { Dims } from './geometry';

export interface Address {
  name: string;
  company?: string;
  cui?: string;
  street: string;
  city: string;
  county: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface UserSettings {
  newsletter: boolean;
  orderEmails: boolean;
  invoiceCompany: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  cui?: string;
  passwordHash: string;
  createdAt: string;
  billing?: Address;
  delivery?: Address;
  settings: UserSettings;
}

export type PublicUser = Omit<User, 'passwordHash'>;

export interface CartItem {
  id: string;
  shapeId: ShapeId;
  materialId: MaterialId;
  finish?: FinishId;
  eloxColor?: EloxColorId;
  dims: Dims;
  /** lungimea debitată (mm) */
  length: number;
  quantity: number;
  unitWeightKg: number;
  pricePerKgRon: number;
  unitNetRon: number;
  label: string;
  addedAt: string;
  /** AluShop (stoc fix): bucată unică, cu cod, aliaj și cost de transport orientativ */
  sku?: string;
  alloy?: string;
  source?: 'configurator' | 'alushop';
  transportRon?: number;
}

export type PaymentMethod = 'transfer' | 'card' | 'ramburs';
export type CourierId = 'fan' | 'cargus' | 'sameday';

export const COURIERS: { id: CourierId; label: string; text: string }[] = [
  { id: 'fan', label: 'FAN Courier', text: 'Livrare 24–48 h, plata la curier' },
  { id: 'cargus', label: 'Cargus', text: 'Livrare 24–48 h, plata la curier' },
  { id: 'sameday', label: 'Sameday', text: 'Livrare rapidă, plata la curier' },
];
export type OrderStatus = 'asteapta_plata' | 'confirmata' | 'in_procesare' | 'livrata' | 'anulata';

export interface Order {
  id: string;
  number: string;
  userId: string | null;
  createdAt: string;
  items: CartItem[];
  netRon: number;
  vatRon: number;
  grossRon: number;
  totalWeightKg: number;
  payment: PaymentMethod;
  /** firma de curierat (doar la ramburs) */
  courier?: CourierId;
  /** ultimele 4 cifre ale cardului (doar la plata cu cardul; restul datelor nu se salvează) */
  cardLast4?: string;
  status: OrderStatus;
  billing: Address;
  delivery: Address;
  customerEmail: string;
  notes?: string;
  proformaNumber?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
}

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  asteapta_plata: 'Așteaptă plata',
  confirmata: 'Confirmată',
  in_procesare: 'În procesare',
  livrata: 'Livrată',
  anulata: 'Anulată',
};

export const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  transfer: 'Transfer bancar',
  card: 'Card online',
  ramburs: 'Ramburs la livrare',
};
