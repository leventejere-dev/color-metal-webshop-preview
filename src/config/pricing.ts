/**
 * Configurație centrală de preț. Prețurile de bază din catalogul demo sunt în EUR
 * (ca în sistemul actual); conversia în lei se face EXCLUSIV prin EUR_TO_RON.
 * Într-o integrare reală, aceste valori vin din backend / ERP.
 */
export const EUR_TO_RON = 4.9755;
export const VAT_RATE = 0.21; // TVA 21%
export const MARKUP = 0.15; // adaos comercial aplicat prețului de bază / kg
export const MAX_ONLINE_QTY = 100; // peste această cantitate → consultant
export const CURRENCY_LABEL = 'lei';
