import { EUR_TO_RON, MARKUP, VAT_RATE } from '@/config/pricing';
import { MATERIALS, type MaterialId } from '@/data/materials';

export const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

/** Preț de vânzare pe kg, în lei (bază EUR × adaos × curs central). */
export function pricePerKgRon(materialId: MaterialId): number {
  const base = MATERIALS[materialId].basePriceEurPerKg;
  return round2(base * (1 + MARKUP) * EUR_TO_RON);
}

export interface PriceBreakdown {
  unitWeightKg: number;
  totalWeightKg: number;
  pricePerKgRon: number;
  unitNetRon: number;
  netRon: number;
  vatRon: number;
  grossRon: number;
}

export function computePrice(materialId: MaterialId, unitWeightKg: number, quantity: number): PriceBreakdown {
  const perKg = pricePerKgRon(materialId);
  const unitNet = round2(unitWeightKg * perKg);
  const net = round2(unitNet * quantity);
  const vat = round2(net * VAT_RATE);
  return {
    unitWeightKg,
    totalWeightKg: round2(unitWeightKg * quantity * 1000) / 1000,
    pricePerKgRon: perKg,
    unitNetRon: unitNet,
    netRon: net,
    vatRon: vat,
    grossRon: round2(net + vat),
  };
}

export function totalsFromLines(lines: { unitNetRon: number; quantity: number }[]) {
  const net = round2(lines.reduce((s, l) => s + round2(l.unitNetRon * l.quantity), 0));
  const vat = round2(net * VAT_RATE);
  return { netRon: net, vatRon: vat, grossRon: round2(net + vat) };
}
