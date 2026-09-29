/**
 * BetaShop – configuratorul de plăci groase din aluminiu, debitate la dimensiunea dorită.
 * Structura urmează configuratorul actual (new-betashop.placi-aluminiu.ro): se alege aliajul și
 * grosimea din listă, apoi se tastează lungimea și lățimea, în limita formatului standard.
 */
export interface Alloy {
  id: string;
  label: string;
  /** preț de bază demo (EUR/kg), fără adaos – afișat în lei prin EUR_TO_RON */
  basePriceEurPerKg: number;
  /** la ce se folosește, într-o singură propoziție */
  note: string;
}

export const BETA_ALLOYS: Alloy[] = [
  { id: '2017-laminat', label: '2017 laminat', basePriceEurPerKg: 8.2, note: 'Aliaj de strunjire, cu prelucrabilitate foarte bună – piese mecanice, matrițe.' },
  { id: '5083-laminat', label: '5083 laminat', basePriceEurPerKg: 8.9, note: 'Rezistent la coroziune, inclusiv în mediu marin – construcții sudate, rezervoare.' },
  { id: '5083-turnat-precizie', label: '5083 turnat, precizie', basePriceEurPerKg: 10.4, note: 'Placă turnată, fără tensiuni interne – plăci de bază și scule de precizie.' },
  { id: '5083-turnat-elox', label: '5083 turnat, elox', basePriceEurPerKg: 11.2, note: 'Turnată, cu suprafață eloxată uniformă – piese vizibile, mese de lucru.' },
  { id: '5754-laminat', label: '5754 laminat', basePriceEurPerKg: 8.4, note: 'Bună la îndoire și sudare – table de protecție, caroserii, ambarcațiuni.' },
  { id: '5754-turnat-elox', label: '5754 turnat, elox', basePriceEurPerKg: 10.8, note: 'Turnată și eloxată – aplicații decorative și piese cu suprafață dură.' },
  { id: '6082-laminat', label: '6082 laminat', basePriceEurPerKg: 8.0, note: 'Cel mai folosit aliaj structural – construcții metalice, elemente portante.' },
  { id: '7021-turnat-precizie', label: '7021 turnat, precizie', basePriceEurPerKg: 11.8, note: 'Turnată, planeitate ridicată – matrițe pentru mase plastice.' },
  { id: '7075-laminat', label: '7075 laminat', basePriceEurPerKg: 13.5, note: 'Rezistență mecanică foarte ridicată – piese solicitate, industrie aeronautică.' },
];

export const ALLOY_BY_ID = Object.fromEntries(BETA_ALLOYS.map((a) => [a.id, a])) as Record<string, Alloy>;

/** Grosimile din stoc (mm), ca în configuratorul actual. */
export const BETA_THICKNESSES = [8, 10, 12, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150];

/**
 * Formatul standard al plăcii este 3.020 × 1.520 mm. Lungimea maximă comandabilă online rămâne
 * 3.000 mm (limita de transport prin curier); dimensiunea minimă de debitare este 40 mm.
 */
export const BETA_FORMAT = { min: 40, maxLength: 3000, maxWidth: 1520, sheet: '3.020 × 1.520 mm' };

/** Densitatea aluminiului (kg/dm³). */
export const AL_DENSITY = 2.7;

/** Masa unitară [kg/buc] – lungime × lățime × grosime × densitate. */
export function plateWeightKg(length: number, width: number, thickness: number) {
  return (length * width * thickness * AL_DENSITY) / 1_000_000;
}

/** Codul articolului, generat automat din configurație (ca „Nume” în sistemul actual). */
export function plateSku(alloy: Alloy, thickness: number, length: number, width: number) {
  return `PL-${alloy.id.toUpperCase()}-${thickness}-${length}x${width}`;
}
