/**
 * AluShop – promoție plăci debitate (stoc fix, dimensiuni unice).
 * Datele sunt preluate din webshopul actual (`/api/catalog/fixed-stock/alushop`); prețurile de bază
 * sunt în EUR ca în sistemul actual și se afișează în lei prin EUR_TO_RON (fără TVA).
 */
export interface AluShopItem {
  sku: string;
  alloy: string;
  /** mm */
  thickness: number;
  length: number;
  width: number;
  weightKg: number;
  priceEur: number;
  transportEur: number;
  discountPercent: number;
  available: number;
}

export const ALUSHOP_ITEMS: AluShopItem[] = [
  { sku: 'ALU-001', alloy: '2017 laminat', thickness: 15, length: 1014, width: 407, weightKg: 17.29, priceEur: 751.44, transportEur: 49.6, discountPercent: 15, available: 1 },
  { sku: 'ALU-002', alloy: '2017 laminat', thickness: 20, length: 95, width: 1239, weightKg: 6.59, priceEur: 286.41, transportEur: 41.1, discountPercent: 15, available: 1 },
  { sku: 'ALU-003', alloy: '2017 laminat', thickness: 25, length: 401, width: 865, weightKg: 24.19, priceEur: 1051.32, transportEur: 55.55, discountPercent: 15, available: 1 },
  { sku: 'ALU-004', alloy: '2017 laminat', thickness: 12, length: 177, width: 285, weightKg: 1.69, priceEur: 73.45, transportEur: 36.85, discountPercent: 15, available: 1 },
  { sku: 'ALU-005', alloy: '2017 laminat', thickness: 30, length: 309, width: 135, weightKg: 3.37, priceEur: 146.46, transportEur: 37.7, discountPercent: 15, available: 1 },
  { sku: 'ALU-006', alloy: '5083 turnat', thickness: 20, length: 640, width: 490, weightKg: 16.87, priceEur: 682.9, transportEur: 48.5, discountPercent: 15, available: 1 },
  { sku: 'ALU-007', alloy: '5754 H111', thickness: 40, length: 112, width: 1223, weightKg: 14.79, priceEur: 642.79, transportEur: 47.9, discountPercent: 15, available: 1 },
  { sku: 'ALU-008', alloy: '6082 T6', thickness: 50, length: 1148, width: 146, weightKg: 22.63, priceEur: 983.52, transportEur: 54.7, discountPercent: 15, available: 1 },
  { sku: 'ALU-009', alloy: '7075 T6', thickness: 35, length: 125, width: 216, weightKg: 2.54, priceEur: 110.39, transportEur: 37.7, discountPercent: 15, available: 1 },
  { sku: 'ALU-010', alloy: '2017 laminat', thickness: 30, length: 1213, width: 110, weightKg: 10.81, priceEur: 469.81, transportEur: 44.5, discountPercent: 15, available: 1 },
];

export const ALUSHOP_ALLOYS = Array.from(new Set(ALUSHOP_ITEMS.map((i) => i.alloy)));
export const ALUSHOP_THICKNESSES = Array.from(new Set(ALUSHOP_ITEMS.map((i) => i.thickness))).sort((a, b) => a - b);
