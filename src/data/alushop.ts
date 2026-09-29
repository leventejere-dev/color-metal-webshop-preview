/**
 * AluShop – promoția de plăci debitate: bucăți unice rămase din procesele de debitare.
 * Structura urmează lista din sistemul actual (new-alushop.placi-aluminiu.ro/placi-aluminiu-debitate):
 * aliaj, grosime, lungime, lățime, greutate, preț promoțional și cheltuieli de transport.
 *
 * Greutatea, prețul și transportul se calculează din dimensiuni, cu aceleași formule ca în sistemul
 * actual (densitate 2,7 kg/dm³; transport = 35,15 lei + 0,85 lei / kg început). Prețurile sunt
 * promoționale, în lei, fără TVA.
 */
export interface AluShopItem {
  sku: string;
  alloy: string;
  /** mm */
  thickness: number;
  length: number;
  width: number;
}

/** Densitatea aluminiului (kg/dm³). */
export const AL_DENSITY = 2.7;

/** Preț promoțional pe kilogram (lei, fără TVA), pe aliaj – ca în lista actuală AluShop. */
export const ALUSHOP_PRICE_PER_KG: Record<string, number> = {
  '1050 laminat': 38.9,
  '2017 laminat': 43.46,
  '5083 laminat': 43.56,
  '5083 turnat, precizie': 52.1,
  '5083 turnat, elox': 55.3,
  '5754 laminat': 42.2,
  '5754 turnat, elox': 54.1,
  '6082 laminat': 41.3,
  '6082 laminat frezat': 46.8,
  '7021 turnat, precizie': 58.4,
  '7075 laminat': 62.5,
  '7075 laminat frezat': 68.2,
};

export const ALUSHOP_ITEMS: AluShopItem[] = [
  { sku: 'ALU-001', alloy: '1050 laminat', thickness: 12, length: 807, width: 391 },
  { sku: 'ALU-002', alloy: '1050 laminat', thickness: 6, length: 132, width: 1075 },
  { sku: 'ALU-003', alloy: '1050 laminat', thickness: 5, length: 657, width: 1008 },
  { sku: 'ALU-004', alloy: '1050 laminat', thickness: 6, length: 890, width: 543 },
  { sku: 'ALU-005', alloy: '1050 laminat', thickness: 15, length: 570, width: 1081 },
  { sku: 'ALU-006', alloy: '2017 laminat', thickness: 70, length: 59, width: 547 },
  { sku: 'ALU-007', alloy: '2017 laminat', thickness: 50, length: 596, width: 239 },
  { sku: 'ALU-008', alloy: '2017 laminat', thickness: 35, length: 1049, width: 133 },
  { sku: 'ALU-009', alloy: '2017 laminat', thickness: 20, length: 1907, width: 245 },
  { sku: 'ALU-010', alloy: '2017 laminat', thickness: 15, length: 153, width: 1001 },
  { sku: 'ALU-011', alloy: '5083 laminat', thickness: 15, length: 1439, width: 357 },
  { sku: 'ALU-012', alloy: '5083 laminat', thickness: 20, length: 169, width: 403 },
  { sku: 'ALU-013', alloy: '5083 laminat', thickness: 12, length: 443, width: 1247 },
  { sku: 'ALU-014', alloy: '5083 laminat', thickness: 30, length: 924, width: 318 },
  { sku: 'ALU-015', alloy: '5083 laminat', thickness: 20, length: 869, width: 468 },
  { sku: 'ALU-016', alloy: '5083 laminat', thickness: 70, length: 92, width: 1154 },
  { sku: 'ALU-017', alloy: '5083 turnat, precizie', thickness: 15, length: 151, width: 876 },
  { sku: 'ALU-018', alloy: '5083 turnat, precizie', thickness: 15, length: 519, width: 1082 },
  { sku: 'ALU-019', alloy: '5083 turnat, precizie', thickness: 15, length: 380, width: 440 },
  { sku: 'ALU-020', alloy: '5083 turnat, precizie', thickness: 20, length: 464, width: 1125 },
  { sku: 'ALU-021', alloy: '5083 turnat, precizie', thickness: 40, length: 1225, width: 222 },
  { sku: 'ALU-022', alloy: '5083 turnat, precizie', thickness: 30, length: 436, width: 425 },
  { sku: 'ALU-023', alloy: '5083 turnat, elox', thickness: 50, length: 504, width: 302 },
  { sku: 'ALU-024', alloy: '5083 turnat, elox', thickness: 50, length: 117, width: 361 },
  { sku: 'ALU-025', alloy: '5083 turnat, elox', thickness: 30, length: 266, width: 815 },
  { sku: 'ALU-026', alloy: '5083 turnat, elox', thickness: 40, length: 307, width: 515 },
  { sku: 'ALU-027', alloy: '5083 turnat, elox', thickness: 50, length: 474, width: 258 },
  { sku: 'ALU-028', alloy: '5083 turnat, elox', thickness: 20, length: 468, width: 823 },
  { sku: 'ALU-029', alloy: '5754 laminat', thickness: 8, length: 1847, width: 411 },
  { sku: 'ALU-030', alloy: '5754 laminat', thickness: 5, length: 492, width: 1018 },
  { sku: 'ALU-031', alloy: '5754 laminat', thickness: 8, length: 401, width: 540 },
  { sku: 'ALU-032', alloy: '5754 laminat', thickness: 10, length: 107, width: 346 },
  { sku: 'ALU-033', alloy: '5754 laminat', thickness: 25, length: 592, width: 400 },
  { sku: 'ALU-034', alloy: '5754 turnat, elox', thickness: 20, length: 287, width: 1295 },
  { sku: 'ALU-035', alloy: '5754 turnat, elox', thickness: 30, length: 169, width: 910 },
  { sku: 'ALU-036', alloy: '5754 turnat, elox', thickness: 30, length: 117, width: 668 },
  { sku: 'ALU-037', alloy: '5754 turnat, elox', thickness: 40, length: 173, width: 564 },
  { sku: 'ALU-038', alloy: '5754 turnat, elox', thickness: 20, length: 84, width: 1399 },
  { sku: 'ALU-039', alloy: '6082 laminat', thickness: 40, length: 99, width: 1129 },
  { sku: 'ALU-040', alloy: '6082 laminat', thickness: 10, length: 1183, width: 145 },
  { sku: 'ALU-041', alloy: '6082 laminat', thickness: 10, length: 1058, width: 144 },
  { sku: 'ALU-042', alloy: '6082 laminat', thickness: 20, length: 1089, width: 117 },
  { sku: 'ALU-043', alloy: '6082 laminat', thickness: 30, length: 347, width: 1055 },
  { sku: 'ALU-044', alloy: '6082 laminat', thickness: 15, length: 169, width: 1047 },
  { sku: 'ALU-045', alloy: '6082 laminat frezat', thickness: 15, length: 312, width: 1039 },
  { sku: 'ALU-046', alloy: '6082 laminat frezat', thickness: 20, length: 556, width: 363 },
  { sku: 'ALU-047', alloy: '6082 laminat frezat', thickness: 30, length: 1136, width: 219 },
  { sku: 'ALU-048', alloy: '6082 laminat frezat', thickness: 30, length: 1198, width: 290 },
  { sku: 'ALU-049', alloy: '6082 laminat frezat', thickness: 20, length: 455, width: 469 },
  { sku: 'ALU-050', alloy: '6082 laminat frezat', thickness: 20, length: 529, width: 492 },
  { sku: 'ALU-051', alloy: '6082 laminat frezat', thickness: 50, length: 264, width: 604 },
  { sku: 'ALU-052', alloy: '7021 turnat, precizie', thickness: 30, length: 176, width: 402 },
  { sku: 'ALU-053', alloy: '7021 turnat, precizie', thickness: 80, length: 1448, width: 56 },
  { sku: 'ALU-054', alloy: '7021 turnat, precizie', thickness: 20, length: 600, width: 784 },
  { sku: 'ALU-055', alloy: '7021 turnat, precizie', thickness: 20, length: 597, width: 491 },
  { sku: 'ALU-056', alloy: '7021 turnat, precizie', thickness: 40, length: 1272, width: 140 },
  { sku: 'ALU-057', alloy: '7021 turnat, precizie', thickness: 60, length: 142, width: 479 },
  { sku: 'ALU-058', alloy: '7021 turnat, precizie', thickness: 30, length: 331, width: 682 },
  { sku: 'ALU-059', alloy: '7075 laminat', thickness: 40, length: 323, width: 511 },
  { sku: 'ALU-060', alloy: '7075 laminat', thickness: 60, length: 850, width: 166 },
  { sku: 'ALU-061', alloy: '7075 laminat', thickness: 25, length: 1175, width: 271 },
  { sku: 'ALU-062', alloy: '7075 laminat', thickness: 15, length: 61, width: 749 },
  { sku: 'ALU-063', alloy: '7075 laminat', thickness: 25, length: 1271, width: 254 },
  { sku: 'ALU-064', alloy: '7075 laminat', thickness: 10, length: 254, width: 720 },
  { sku: 'ALU-065', alloy: '7075 laminat frezat', thickness: 20, length: 77, width: 1391 },
  { sku: 'ALU-066', alloy: '7075 laminat frezat', thickness: 50, length: 122, width: 1385 },
  { sku: 'ALU-067', alloy: '7075 laminat frezat', thickness: 20, length: 682, width: 533 },
  { sku: 'ALU-068', alloy: '7075 laminat frezat', thickness: 20, length: 1364, width: 189 },
  { sku: 'ALU-069', alloy: '7075 laminat frezat', thickness: 25, length: 79, width: 655 },
  { sku: 'ALU-070', alloy: '7075 laminat frezat', thickness: 40, length: 74, width: 731 },
];

const round2 = (v: number) => Math.round(v * 100) / 100;

/** Greutatea bucății (kg). */
export const alushopWeight = (it: AluShopItem) => round2((it.length * it.width * it.thickness * AL_DENSITY) / 1_000_000);

/** Prețul promoțional al bucății (lei, fără TVA). */
export const alushopPrice = (it: AluShopItem) => round2(alushopWeight(it) * (ALUSHOP_PRICE_PER_KG[it.alloy] ?? 43.46));

/** Cheltuieli de transport / ambalare / manipulare (lei), ca în sistemul actual. */
export const alushopTransport = (it: AluShopItem) => round2(35.15 + 0.85 * Math.round(alushopWeight(it)));

export const ALUSHOP_ALLOYS = Array.from(new Set(ALUSHOP_ITEMS.map((i) => i.alloy)));
export const ALUSHOP_THICKNESSES = Array.from(new Set(ALUSHOP_ITEMS.map((i) => i.thickness))).sort((a, b) => a - b);
