# Surse și licențe pentru imagini / Képforrások és licencek

Toate fișierele din `public/assets/` sunt stocate local (fără hotlink).
Produsele sunt ilustrate cu desenele tehnice vectoriale (SVG) și cu fotografiile proprii Color Metal –
nu se folosesc fotografii stock.

## 1. Desenele tehnice (ghid pentru alegerea dimensiunilor)

| Fișier(e) | Sursă | Observații |
|---|---|---|
| `tech/<forma>[--material][--dim].svg` (88 fișiere) | redesenate în proiect: `tools/generate-tech-drawings.mjs` | Desene 3D vectoriale, generate programatic (proiecție paralelă, umbrire metalică, cote). Reproduc ilustrațiile calculatorului oficial de greutate Color Metal (https://color-metal.ro/ro/calculator-greutate), cu **aceleași notații**: `b` = grosime/înălțime, `d` = lățime/diametru/latură/deschidere de cheie, `g` = grosimea peretelui, `l` (`L` la profile) = lungime. Originalele erau imagini de 325×150 px; versiunea vectorială este clară la orice rezoluție. Variante: fără sufix = aluminiu, `--cu` / `--brass` / `--bronze` = culoarea materialului; `--dim` = varianta cu notații (doar la pasul de alegere a dimensiunilor). |

Regenerare: `node tools/generate-tech-drawings.mjs`.

## 2. Materiale oficiale Color Metal

| Fișier(e) | Sursă | Observații |
|---|---|---|
| `banner/hero.jpg`, `banner/hero-mobile.jpg` | Fotografie Color Metal furnizată de client (textură metalică aurie, 2000×667) | Drept de utilizare: Color Metal SRL. |
| `about/sediu.jpg`, `about/sediu-mobile.jpg` | Fotografie Color Metal furnizată de client (sediul, 2000×1125) | Drept de utilizare: Color Metal SRL. Folosită ca antet pe pagina „Despre noi”. |
| `brand/color-metal-logo.png`, `brand/color-metal-logo-sm.png` | https://color-metal.ro/sites/default/files/CM_Singular_Logo_color_print_1.png (logo oficial) | Marcă înregistrată Color Metal SRL. |
| `brand/favicon.png` | generat în proiect (inițialele „CM” pe fundal auriu #CBA349) | – |

## 3. Fotografii de produs

| Fișier(e) | Sursă | Observații |
|---|---|---|
| `products/*.jpg` (21 fotografii, două dimensiuni fiecare) | catalogul oficial Color Metal: https://color-metal.ro/ro/produse/industriale | **Fotografii proprii Color Metal**, folosite cu acordul clientului. Preluate și pregătite cu `tools/fetch-product-photos.mjs`: fundal alb (fotografiile decupate sunt PNG cu transparență), marginea albă tăiată, piesa încadrată întreagă într-un cadru 4:3 cu o margine mică – așa rămân vizibile capetele barelor și ale profilelor. Două dimensiuni: 1200×900 și 360×270, JPEG optimizat. Se folosesc **doar fotografiile pe fundal alb**; cele din catalogul furnizorului (fundal întunecat, filigran) nu au fost preluate. Fotografia afișată urmează materialul ales, iar la tablă suprafața aleasă (lisă, stucco, striată Diamond / Quintet); unde nu există fotografie pentru materialul ales, rămâne desenul tehnic, colorat în culoarea materialului. |

## 4. Alte resurse

- Fonturi: **Montserrat** (SIL Open Font License 1.1), pachet npm `@fontsource-variable/montserrat`, servit local.
- Pictograme UI: **lucide-react** (licență ISC).
- Siglele de plată (NETOPIA Payments, Visa, Mastercard) din footer și din checkout sunt desenate în CSS/SVG
  în `src/components/ui/PaymentBadges.tsx` (nu sunt fișiere de marcă originale; se pot înlocui cu siglele oficiale).

## 5. Istoric

Versiunea 1 a prototipului folosea fotografii stock (Pexels / Unsplash) pentru fiecare formă; au fost eliminate la
cererea clientului (nu corespundeau produselor reale). Versiunea 2 folosea desene 2D simple (portarea componentei
`ShapeIcon` din webshopul actual) plus imaginile PNG ale calculatorului; ambele au fost înlocuite cu desenele
vectoriale de la punctul 1.
