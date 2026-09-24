# Color Metal Webshop – prototip frontend

Prototip complet funcțional (fără backend) al webshopului Color Metal pentru semifabricate metalice configurabile:
plăci, table, profile, țevi, bare și bandă rulou din aluminiu, cupru, alamă și bronz.

Reconstruiește funcționalitatea și structura vizuală a webshopului actual (`cmwebshop.odocs.ro`) cu modificările
cerute în brief – vezi [CHANGELOG_REVIEW.md](CHANGELOG_REVIEW.md). Sursele și licențele imaginilor sunt în
[ASSETS_LICENSES.md](ASSETS_LICENSES.md).

**Stack:** React 19 · Vite 8 · TypeScript · Tailwind CSS 4 · React Router 7 · lucide-react · Montserrat (self-hosted).
Toate datele (cont, coș, favorite, comenzi, facturi) sunt persistate în `localStorage`.

---

## Instalare și rulare

Cerințe: Node.js ≥ 20.19 (testat cu Node 24) și npm.

```bash
npm install
npm run dev          # http://localhost:5173
```

```bash
npm run build        # verificare TypeScript + build de producție în dist/
npm run preview      # servește build-ul local
npm run typecheck    # doar verificarea TypeScript
```

Build pentru GitHub Pages (site servit din `/color-metal-webshop-preview/`):

```bash
npm run build:pages
```

`BASE_PATH` este citit în `vite.config.ts`; pentru alt nume de repository modifică `build:pages` din `package.json`
sau setează variabila de mediu `BASE_PATH=/nume-repo/`.

## Deploy

### GitHub Pages (automat)

Workflow-ul [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) face build la fiecare push pe `main`
și publică `dist/` pe GitHub Pages. O singură dată, în repository: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

Build-ul copiază `index.html` în `404.html`, astfel încât rutele aplicației (ex. `/produse/teava-patrata`) funcționează
la accesare directă și la refresh.

### Alt hosting static (Netlify, Vercel, Cloudflare Pages, nginx)

`npm run build` (cu `BASE_PATH=/` implicit) → publică folderul `dist/` și configurează fallback SPA către `index.html`.

## Cont demo

| | |
|---|---|
| Email | `demo@color-metal.ro` |
| Parolă | `Demo1234` |

Contul demo are 3 comenzi istorice (livrată, în procesare, în așteptarea plății) cu facturi/proforme.
Orice cont nou creat din pagina **Înregistrare** este autentificat imediat și funcționează la fel.
Pe pagina de autentificare există butonul „Completează datele demo”.

## Rute importante

| Rută | Pagină |
|---|---|
| `/` | Acasă – banner compact + toate cele 13 forme de produs |
| `/produse` | Lista produselor, filtre după categorie |
| `/alushop` | AluShop – promoție plăci debitate (stoc fix, bucăți unice, preluat din webshopul actual) |
| `/produse/:slug` | Pagina produsului – alegerea materialului și finisajului, desenul tehnic al formei |
| `/configurator/:slug/:material` | Configurator dimensiuni (opțiuni, slider+input lungime, cantitate, calcul preț) |
| `/cautare?q=` | Rezultate căutare |
| `/cos` | Coș |
| `/finalizare-comanda` | Finalizare comandă (facturare, livrare, plată, proformă la transfer bancar) |
| `/comanda/:id` | Confirmarea comenzii |
| `/proforma/:id`, `/factura/:id` | Documente printabile (Tipărește / Salvează PDF, Descarcă HTML) |
| `/autentificare`, `/inregistrare` | Cont |
| `/favorite` | Favorite (și pentru vizitatori; se unesc cu contul la autentificare) |
| `/cont`, `/cont/comenzi`, `/cont/facturi`, `/cont/favorite`, `/cont/date-contact`, `/cont/adresa-livrare`, `/cont/setari`, `/cont/schimbare-parola` | Zona de cont |
| `/despre-noi`, `/contact` | Pagini de prezentare |
| `/termeni-si-conditii`, `/politica-de-confidentialitate`, `/politica-de-retur` | Pagini legale (conținut demonstrativ) |

Sluguri produse: `placa-groasa`, `tabla`, `profil-u`, `profil-l`, `profil-t`, `teava-rectangulara`, `teava-patrata`,
`teava-rotunda`, `bara-lata`, `bara-patrata`, `bara-hexagonala`, `bara-rotunda`, `banda-rulou`.
Parametrul material: `al`, `cu`, `brass`, `bronze`.

## Structura proiectului

```
src/
  config/      site.ts (date de contact oficiale), pricing.ts (EUR_TO_RON, TVA, adaos, limită 100 buc)
  data/        shapes.ts (13 forme + combinațiile reale de dimensiuni), materials.ts, demo.ts (cont + comenzi demo)
  lib/         geometry.ts (arii/greutăți), pricing.ts, configurator.ts (compatibilitate opțiuni), search.ts,
               api.ts (strat de persistență – singurul fișier de înlocuit la integrarea cu backend), storage.ts, types.ts
  context/     Auth, Cart, Favorites, Toast
  components/  layout (Header, Footer, WhatsApp), ui (Button, Field, RangeField, QuantityField, Modal…),
               product (TechDrawing – desenele tehnice, ProductCard, ProductPreview), configurator (OptionGroup, ContactConsultant)
  pages/       toate paginile + pages/account/*
public/assets/ brand/, banner/ (fotografie Color Metal), tech/ (desenele tehnice SVG, generate cu tools/generate-tech-drawings.mjs)
tools/         prepare-images.mjs – pipeline-ul de imagini folosit pentru asset-uri
```

## Logica de business (rezumat)

- **Preț** = greutate teoretică (aria secțiunii × lungime × densitate) × preț/kg. Prețurile de bază demo sunt în EUR
  (ca în sistemul actual) și se convertesc **o singură dată** prin `EUR_TO_RON` din `src/config/pricing.ts`; interfața
  afișează exclusiv lei (`9,60 lei`). TVA 21%.
- **Materiale**: cupru și alamă doar la bară hexagonală / rotundă / pătrată / lată, placă groasă și tablă; bronz doar la
  bară rotundă; toate celelalte forme exclusiv aluminiu. Finisaje: doar Natur și Eloxat (numai la aluminiu; culoare
  de eloxare la Eloxat). Fără selector de aliaj.
- **Configurator**: nimic preselectat; clic pe opțiunea activă o deselectează; opțiunile incompatibile rămân vizibile,
  estompate și neclicabile (`Opțiunea nu este disponibilă pentru dimensiunea selectată.`); combinațiile provin din
  `variants` (catalogul real al webshopului actual). Lungimea: slider + input sincronizate, pas 1 mm, minim 50 mm
  (profile/țevi/plăci) și 25 mm (bare), maximum 3.000 mm la toate formele (limita de transport prin curier); la plăci/table lățimea se alege din formatele de stoc, iar lungimea maximă depinde și de format.
- **Toleranțe**: nu se afișează în webshop (informație internă Color Metal).
- **Cantitate**: peste 100 buc butonul „Adaugă în coș” este dezactivat și apar telefon / email / WhatsApp.
- **Plată** (exclusiv în avans): card online prin formular NETOPIA Payments (simulat, cu validare Luhn; datele cardului nu se salvează) sau transfer bancar. Fără ramburs. Proforma se generează exclusiv la „Transfer bancar”, în checkout (sumar, cumpărător, produse, cantități,
  prețuri, TVA, total) și se poate tipări / salva PDF / descărca HTML.

## Limitări cunoscute

- Nu există backend: datele trăiesc în `localStorage` (per browser); plata cu cardul este simulată; emailurile nu se trimit.
- Formularele de contact/carieră deschid clientul de email (`mailto:`) sau doar confirmă vizual.
- Costul transportului nu este calculat (mesaj: se comunică la confirmare).
- Fără fotografii de produs: formele sunt redate cu desenele tehnice vectoriale (vezi ASSETS_LICENSES.md).
- Textele legale sunt demonstrative.

## Integrare ulterioară cu backend

Aplicația a fost gândită pentru înlocuirea stratului de date fără a atinge componentele:

| Zonă | Acum (`src/lib/api.ts`) | Cu backend |
|---|---|---|
| Autentificare / profil | `authApi.*` peste localStorage | `POST /api/auth/login`, `/register`, `GET /api/auth/user`, `PATCH /api/profile` |
| Comenzi / documente | `ordersApi.*` | `POST /api/orders`, `GET /api/orders`, generare PDF proformă/factură pe server |
| Coș | `cartApi.*` | `GET/PUT /api/cart` (webshopul actual expune deja `/api/cart`) |
| Favorite | `favoritesApi.*` | `GET/PUT /api/favorites` |
| Catalog | `src/data/shapes.ts`, `materials.ts` | `GET /api/catalog/shapes`, `/api/configurator/variants/:shape` (formatul existent este compatibil: `fields`, `variants`, `lengths`) |
| Calcul preț | `src/lib/pricing.ts` + `geometry.ts` | `POST /api/configurator/calculate` (aceleași câmpuri: `weight`, `price_per_kg`, `net_total`, `vat_value`, `gross_total`) |

Funcțiile din `api.ts` sunt deja asincrone și au semnăturile unui client HTTP, deci înlocuirea se face fișier cu fișier.
