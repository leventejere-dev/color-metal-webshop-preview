/** Date oficiale de contact Color Metal (sursa: color-metal.ro/ro/contact). */
export const SITE = {
  name: 'Color Metal',
  legalName: 'Color Metal SRL',
  tagline: 'Partner in engineering',
  website: 'https://color-metal.ro',
  /** site-ul principal Color Metal (versiunea în limba română) */
  mainSite: 'https://color-metal.ro/ro',
  /** magazinul industrial – acest webshop (domeniu în pregătire) */
  industrialShop: 'https://cmindustrial.ro',
  /** magazinul Color Metal pentru soluții arhitecturale (în pregătire) */
  architecturalShop: 'https://cmarhitectural.ro',
  emails: {
    direct: 'direct@color-metal.ro',
    bucharest: 'officebuc@color-metal.ro',
  },
  phones: {
    callCenter: '+40 266 206 050',
  },
  whatsapp: {
    number: '40751125290',
    message: 'Bună ziua! Doresc mai multe informații despre produsele Color Metal.',
  },
  headquarters: {
    name: 'Sediu central – Odorheiu Secuiesc',
    address: 'Str. Nicolae Bălcescu, nr. 95, 535600 Odorheiu Secuiesc, Jud. Harghita',
  },
} as const;

export const whatsappUrl = (message: string = SITE.whatsapp.message) =>
  `https://wa.me/${SITE.whatsapp.number}?text=${encodeURIComponent(message)}`;

export const telHref = (phone: string) => `tel:${phone.replace(/[^+\d]/g, '')}`;
