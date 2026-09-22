# Surse și licențe pentru imagini / Képforrások és licencek

Toate fișierele din `public/assets/` sunt stocate local (fără hotlink) și sunt generate cu `tools/prepare-images.mjs`.
Webshopul nu mai folosește fotografii stock: formele de produs sunt redate cu desenele 2D simple din webshopul actual
(componenta `ShapeIcon`, SVG inline), iar „ghidul pentru alegerea dimensiunilor” folosește ilustrațiile oficiale ale
calculatorului de greutate Color Metal.

## 1. Materiale oficiale Color Metal

| Fișier(e) | Sursă | Observații |
|---|---|---|
| `banner/hero.jpg`, `banner/hero-mobile.jpg` | Fotografie Color Metal furnizată de client (textură metalică aurie, 2000×667) | Drept de utilizare: Color Metal SRL. |
| `brand/color-metal-logo.png`, `brand/color-metal-logo-sm.png` | https://color-metal.ro/sites/default/files/CM_Singular_Logo_color_print_1.png (logo oficial) | Marcă înregistrată Color Metal SRL. |
| `tech/<forma>.png` (13 ilustrații „ghid dimensiuni”) | https://color-metal.ro/ro/calculator-greutate → `/modules/custom/calculator_de_greutate/calculator/images/calculator-de-greutate/*` | Ilustrațiile calculatorului oficial de greutate. `flat_bar` folosește ilustrația plăcii dreptunghiulare (aceeași geometrie). |
| `tech/<forma>-icon.png` (13 pictograme) | https://color-metal.ro/ro/calculator-greutate → `/modules/custom/calculator_de_greutate/img/*.png` | Pictogramele selectorului de produs din calculator (păstrate pentru utilizare ulterioară). |
| `brand/favicon.png` | generat în proiect (inițialele „CM” pe fundal auriu #CBA349) | – |
| `src/components/product/ShapeIcon.tsx` | portare a componentei `ShapeIcon` din webshopul actual (cmwebshop.odocs.ro) | aceeași geometrie și aceleași culori. |

## 2. Alte resurse

- Fonturi: **Montserrat** (SIL Open Font License 1.1), pachet npm `@fontsource-variable/montserrat`, servit local.
- Pictograme UI: **lucide-react** (licență ISC).

## 3. Istoric

Versiunea 1 a prototipului folosea fotografii stock (Pexels / Unsplash) pentru fiecare formă; au fost eliminate la cererea
clientului (nu corespundeau produselor reale). Casetele gri de sub desenul produsului sunt rezervate fotografiilor proprii
Color Metal.
