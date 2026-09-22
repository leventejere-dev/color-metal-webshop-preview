/** Date oficiale de contact Color Metal (sursa: color-metal.ro/ro/contact). */
export const SITE = {
  name: 'Color Metal',
  legalName: 'Color Metal SRL',
  tagline: 'Partner in engineering',
  website: 'https://color-metal.ro',
  emails: {
    direct: 'direct@color-metal.ro',
    bucharest: 'officebuc@color-metal.ro',
  },
  phones: {
    callCenter1: '+40 266 206 050',
    callCenter2: '+40 266 206 051',
    bucharest: '+40 751 125 290',
  },
  whatsapp: {
    number: '40751125290',
    message: 'Bună ziua! Doresc mai multe informații despre produsele Color Metal.',
  },
  locations: [
    {
      id: 'odorhei',
      name: 'Sediu central – Odorheiu Secuiesc',
      address: 'Str. Nicolae Bălcescu, nr. 95, 535600 Odorheiu Secuiesc, Jud. Harghita',
      email: 'direct@color-metal.ro',
      phone: '+40 266 206 050',
    },
    {
      id: 'bucuresti',
      name: 'Punct de lucru – București (Mogoșoaia)',
      address: 'Șos. București–Târgoviște, nr. 12/A, 077135 Mogoșoaia, Jud. Ilfov',
      email: 'officebuc@color-metal.ro',
      phone: '+40 751 125 290',
    },
    {
      id: 'timisoara',
      name: 'Punct de lucru – Timișoara (Ghiroda)',
      address: 'Str. Căprioarei, nr. 1/B, 307200 Comuna Ghiroda, Jud. Timiș',
      email: 'officetm@color-metal.ro',
      phone: '+40 747 282 796',
    },
  ],
} as const;

export const whatsappUrl = (message: string = SITE.whatsapp.message) =>
  `https://wa.me/${SITE.whatsapp.number}?text=${encodeURIComponent(message)}`;

export const telHref = (phone: string) => `tel:${phone.replace(/[^+\d]/g, '')}`;
