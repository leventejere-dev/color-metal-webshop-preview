# CHANGELOG_REVIEW – módosítások a jelenlegi webshophoz (cmwebshop.odocs.ro) képest

*(Rezumat RO la final. A tételek a brief számozását követik. **A „Revizia 2” szakasz a fájl végén felülírja az itt leírt pontokat, ahol eltérés van.**)*

## 1. Technológia
- Új, önálló frontend: React 19 + Vite 8 + TypeScript + Tailwind CSS 4 + React Router 7 (a jelenlegi Laravel/Inertia-Vue oldal helyett).
- Backend nélkül teljesen működik: regisztráció, bejelentkezés, kedvencek, kosár, rendelések, számlák/proformák, kontaktadatok `localStorage`-ban (`src/lib/api.ts` – egyetlen fájl cserélendő valódi API-ra).
- A termékkatalógus (13 forma, valós méretkombinációk) a jelenlegi webshop `/api/configurator/variants/*` és `/api/catalog/shapes` végpontjaiból lett átvéve, így a „csak létező kombinációk” logika megmaradt.
- A súly-/árképlet a jelenlegi `/api/configurator/calculate` végponttal lett egyeztetve (minden forma ellenőrizve: U, L, T, cső, rúd, lemez). Kivétel: hatszögrúd – a jelenlegi rendszer élhosszként számol, a prototípus a kereskedelmi szabvány szerinti **kulcsnyílás (SW)** alapján (`√3/2·s²`), lásd 8. pont.

## 2. Arculat
- Hivatalos Color Metal logó (color-metal.ro), Montserrat betűtípus (az anyaoldal fontja), arany `#CBA349` / bronz akcentus, fehér háttér, sötét szöveg.
- Egységes kártya/gomb/form/chip komponensek (`src/components/ui`), nincs lila/neon/dashboard stílus.
- Desktop + mobil (hamburger menü, mobil kereső, reszponzív grid, sticky kalkulációs panel).

## 3. Nyelv
- Kizárólag román szöveg (helyes diakritikák). A nyelvválasztó (RO/EN/HU/BG) eltávolítva; a fejléc jobb felső sarkában statikus „RO” jelölés maradt.

## 4. Fejléc és navigáció
- Bal oldal: logó + „Acasă” – mindkettő a főoldalra visz.
- Menü: Produse (az „Industrial” helyett), Despre noi, Oportunități / Cariere, Contact.
- Eltávolítva: **B2B** menüpont, „Acces B2B” gomb és minden B2B-elem, **AluShop**, **Oferte** (nem fért el vizuálisan a bővített menü mellett; visszakapcsolható a `NAV` tömbben, `src/components/layout/Header.tsx`).
- Kereső placeholder: pontosan „Caută produse” (élő találati lista + `/cautare` oldal).
- Fejléc-elemek: Autentificare / Înregistrare (bejelentkezve: fiókmenü), kedvencek ikon számlálóval, kosár számlálóval, felső utility sáv a call center számmal (az anyaoldal „TELEFON:” mintájára).

## 5. Kezdőoldal
- Kikerült: a nagy „Materiale neferoase configurabile…” főcím, a bal oldali szövegblokk, a jobb oldali sötét carousel, az „Acces B2B” gomb.
- Új: vékony, teljes szélességű ipari fotós banner (kb. 190–250 px magas, nincs carousel), „Semifabricate metalice” címmel.
- Közvetlenül alatta mind a 13 termékforma kártyája (fotó, ikon, rövid román leírás, elérhető anyagok, „Configurează produsul” CTA, kedvenc ikon), reszponzív gridben. A jelenlegi főoldalon csak 8 forma szerepelt.
- Kiegészítés: 3 USP-blokk és konzultáns/kapcsolat sáv.

## 6. Oldalak
- Elkészült oldalak: Acasă, Produse (szűrők: kategória, anyag), termékoldal (galéria + anyagválasztás), konfigurátor, kosár, pénztár, rendelés-visszaigazolás, proforma/számla dokumentum (nyomtatható), bejelentkezés, regisztráció, fiók (Contul meu, Comenzile mele, Facturi, Produse favorite, Date de contact, Adresa de livrare, Setări cont, Schimbare parolă, Ieșire din cont), kedvencek, Despre noi, Oportunități / Cariere, Contact, Termeni și condiții, Politica de confidențialitate, Politica de retur, keresés, 404.
- „Despre noi” szövege a hivatalos „Echipa” oldalról (20 év, 3 logisztikai központ, országok, szolgáltatások). „Cariere”: a hivatalos oldal jelentkezési űrlapjának megfelelő form + GDPR; nyitott pozíciókat nem találtunk ki (link a hivatalos oldalra). Kontakt: kizárólag a hivatalos adatok (direct@color-metal.ro, officebuc@color-metal.ro, +40 266 206 050/051, +40 751 125 290, valamint a color-metal.ro/ro/contact oldalon publikált címek).
- A régi `/forme` útvonal a `/produse` oldalra irányít.

## 7. WhatsApp
- Fix pozíciójú WhatsApp gomb jobb alul (mobil + desktop): `https://wa.me/40751125290` előre kitöltött üzenettel („Bună ziua! Doresc mai multe informații despre produsele Color Metal.”). Nyomtatáskor rejtve.

## 8. Termékek és anyagok
- Anyaglogika a brief szerint: Cupru + Alamă csak a Bară hexagonală / rotundă / pătrată / lată, Placă groasă és Tablă esetén; Bronz csak a Bară rotundă esetén; minden más forma kizárólag Aluminiu.
- Eltávolítva: Inox, Titan zinc, PVC, valamint a teljes „Alege aliajul / Selectează aliajul” szekció (nincs ötvözetválasztó; az URL-ből is kikerült az ötvözet).
- Hatszögrúd: a méret címkéje „Deschidere cheie (SW)”, a súly a kulcsnyílásból számolva (a jelenlegi rendszer ~3×-os súlyt adott az élhossz-képlettel).

## 9. Felületkezelés
- Csak **Natur** és **Eloxat** maradt (Vopsit, Cromat, Polisat, Patinat stb. törölve). Felületkezelés csak alumíniumnál jelenik meg; réz/sárgaréz/bronz esetén nincs értelmetlen opció. Eloxat esetén választható eloxálási szín (Natur/argintiu, Negru, Bronz) – a jelenlegi „Culoare / aspect” blokk ide szűkült.

## 10. Konfigurátor alapállapot
- A méretképernyőn semmi nincs előre kiválasztva (nincs fekete/aktív chip, a hossz-input üres, a slider „üres” állapotban).
- Az aktív opcióra újbóli kattintás deselectel; külön „Deselectează” link is van.
- Az „Adaugă în coș” csak akkor aktív, ha minden méret + hossz ki van választva (a hiányzó mezőket a panel felsorolja).

## 11. Méretfüggőségek
- Inkompatibilis értékek nem tűnnek el: szürke, szaggatott szegélyű, nem kattintható chipek; kattintásra rövid román magyarázat: „Opțiunea nu este disponibilă pentru dimensiunea selectată.” (tooltip + inline üzenet + képernyőolvasó felirat).
- A kompatibilitás szimmetrikus és a valós kombinációkból számolódik (pl. Țeavă pătrată 100 → csak 6 és 8 mm falvastagság).
- Lemezeknél: a szélesség/hossz slider maximuma a stock formátumból adódik; ha a kiválasztott vastagság szűkíti, az érték automatikusan a maximumra korrigálódik és megjelenik a magyarázat; a formátumhoz nem illő vastagságok elhalványulnak.

## 12. Tolerancia
- Profilok és csövek: **-0 / +3 mm**; lapos, négyzet, hatszög és kerek rudak: **-0 / +5 mm**. Feltételezés (a briefben nem szerepelt): lemez/tábla/tekercs darabolás **-0 / +3 mm** minden méretre – kérjük visszaigazolni.
- A konfigurátorban külön, érthető magyarázó blokk; a termékoldalon és a T&C-ben is szerepel.

## 13. Hosszválasztás
- Új prémium `RangeField` komponens: slider + numerikus input egy kártyában, egymással szinkronban, milliméteres lépés, min/max felirat, gyorsválasztó chipek (500…6000).
- Minimumok: profilok/csövek 50 mm, rudak 25 mm; lemezek 50 mm (szélesség és hossz), tekercs 1000 mm. Maximumok formánként konfigurálhatók (`ranges` a `shapes.ts`-ben; lemeznél a stock formátumból).
- Az érték közvetlenül beírható (Enter vagy elhagyás után kerekít és korlátoz).

## 14. Mennyiségkorlát
- Alapérték 1. 100 db felett a kosárba tétel tiltott, megjelenik: „Pentru cantități mai mari de 100 bucăți, vă rugăm să contactați un consultant.” + működő telefon / e-mail (mailto, előre kitöltött tárggyal) / WhatsApp linkek a konfigurációval.
- A kosárban a mennyiség 1–100 között módosítható.

## 15. Termékképek és technikai ábrák
- Minden formához: közeli fotó, kontextusfotó (mindkettő a formához kötött, a méretektől független) és a hivatalos súlykalkulátor technikai ábrája (egységes 650×300 px, fehér háttér, dimenzióbetűkkel) + a kalkulátor pictogramja a kártyákon.
- Ezen felül élő SVG keresztmetszet-előnézet, amely a kiválasztott méreteket követi (a jelenlegi „Previzualizare tehnică live” megtartva, pontosabb geometriával).
- Forrás: Pexels és Unsplash (jogtiszta, kereskedelmi felhasználásra), lokálisan az `public/assets`-ben, licencek az `ASSETS_LICENSES.md`-ben. Megjegyzés: a T-profilhoz nincs dedikált ingyenes stockfotó (vegyes profilos rakat szerepel), és több fotó acélt ábrázol – gyártási verzióhoz saját termékfotók javasoltak.

## 16. Ármegjelenítés
- Sehol nincs €/EUR. Minden ár lejben, román formátumban (`9,60 lei`, ezres elválasztó `.`), konfigurátorban, kosárban, pénztárban, dokumentumokban egységesen.
- Az EUR alapú demoárak egyetlen központi konstanson (`EUR_TO_RON`, `src/config/pricing.ts`) keresztül konvertálódnak; TVA 21%, adaos 15%, 100 db limit ugyanitt.

## 17. Mintaanyag
- A „Mostră disponibilă” szekció teljesen eltávolítva (termékoldal + konfigurátor).

## 18. Kosár és pénztár
- A kosárból kikerült a „Generează proformă” gomb.
- Pénztár: számlázási adatok (PF/PJ), szállítási cím, fizetési mód (Transfer bancar / Card online (demo) / Ramburs), megjegyzés, 3 kötelező jóváhagyás (személyre szabott termék, T&C, GDPR).
- „Transfer bancar” választásakor jelenik meg a proforma-blokk: vevői adatok, termékek, mennyiségek, árak, TVA, végösszeg + „Generează proformă” gomb → a rendelés „Așteaptă plata” státusszal mentődik és megnyílik a nyomtatható proforma (Tipărește / Salvează PDF, Descarcă HTML).
- Kosár: mennyiség módosítás, törlés, kiürítés, végösszeg és TVA számítás, össztömeg, üres állapot, rendelés véglegesítés.

## 19. Regisztráció és bejelentkezés
- Valódi (localStorage) auth: regisztráció után azonnal bejelentkezett állapot, fiókmenü, kedvencek, rendelések, számlák, kontakt- és szállítási adatok, beállítások, jelszócsere, kijelentkezés. Jelszó SHA-256 hash-elve (demo).
- Demo fiók: `demo@color-metal.ro` / `Demo1234`, 3 előre feltöltött rendeléssel.
- A regisztrációs modal helyett dedikált oldalak (`/inregistrare`, `/autentificare`), `?next=` visszairányítással (pl. pénztárból).

## 20. Kedvencek
- Szív ikon minden kártyán, termékoldalon és a konfigurátorban; hozzáadás/eltávolítás toast-tal.
- Külön `/favorite` oldal (vendégként is) és `/cont/favorite`; bejelentkezéskor a vendég-kedvencek beolvadnak a fiókba és megmaradnak.

## 21. Keresés
- Fejléc-kereső élő javaslatokkal, `/cautare` találati oldal; keresés név, forma, anyag, kategória és leírás alapján, ékezet-független (pl. „teava” → Țeavă…).

## 22. GitHub / preview
- Git repository, README (telepítés, futtatás, build, deploy, demo user, útvonalak, korlátok, backend-integráció), GitHub Actions workflow GitHub Pages-hez (`BASE_PATH` + SPA 404 fallback).

## Egyéb
- Lábléc: hivatalos elérhetőségek, termék- és infólinkek, ANPC/SOL/SAL, jogi oldalak; „RO” jelölés.
- Minden jogi szöveg demonstratív („Textul legal final este furnizat și validat de Color Metal SRL”).
- A jelenlegi rendszerből megtartott UX-szövegek: pl. „Produsele personalizate nu beneficiază de drept de retur conform OUG 34/2014.”, „Prețurile afișate pot fi actualizate până la finalizarea comenzii.”, „Comanda va fi procesată după confirmarea plății.”

---

## Rezumat (RO)
Prototip nou (React/Vite/TS/Tailwind) al webshopului, doar în română, cu identitatea Color Metal (logo oficial, Montserrat, auriu/bronz).
Eliminate: B2B, AluShop, Oferte, selectorul de limbă, hero-ul mare cu carousel, mostrele, aliajele, Inox/Titan-zinc/PVC, finisajele Vopsit/Cromat,
prețurile în EUR și butonul „Generează proformă” din coș. Adăugate: banner compact, toate cele 13 forme pe prima pagină, configurator fără
preselecții cu opțiuni incompatibile estompate, slider+input pentru lungime (pas 1 mm), toleranțe afișate, limită 100 buc cu contact consultant,
prețuri exclusiv în lei, proformă doar la transfer bancar (în checkout), cont complet funcțional (localStorage), favorite, căutare, WhatsApp fix,
fotografii reale + ilustrațiile tehnice oficiale pentru fiecare formă.

---

# Revizia 2 (2026-09-22) – a második egyeztetés utáni módosítások

1. **Fejléc:** a telefonszámos felső sáv megszűnt; egyetlen sor: kisebb logó (bal sarok) · Acasă · Produse · Despre noi · Contact · kereső · Autentificare · Înregistrare · RO · kedvencek · kosár. Az „Oportunități / Cariere” menüpont és oldal törölve (a `/cariere` útvonal a Contact oldalra irányít).
2. **Főoldal:** vékonyabb banner (≈130–176 px) a Color Metal saját fotójával (a kép éles része: réz platbandák + alumínium profilok; mobilon a jobb oldali kivágás). A három USP-kártyás szekció törölve. Az „Alege forma produsului” kártyákon a jelenlegi webshop egyszerű 2D rajzai (a `ShapeIcon` komponens portolása: azonos geometria, színek, anyag szerinti kitöltés).
3. **Stockfotók teljesen eltávolítva** (félrevezetőek voltak). A termékoldalon a jobb oldali kis előnézeti kártyán: a 2D rajz nagyban, alatta kis miniatűrök – rajz, „Ghid pentru alegerea dimensiunilor” (a súlykalkulátor hivatalos ábrája) és két szürke helyettesítő kocka a későbbi saját termékfotóknak. `ASSETS_LICENSES.md` frissítve.
4. **Termékoldal (anyagválasztás):** elrendezés az eredeti szerint – bal oldalon az anyagok (csak név + sűrűség, leírások nélkül), jobb oldalon a kis kép; a Finisaj és a Culoare sor mindig látható (nem lépésenként jelenik meg; a nem alkalmazható opciók halványak), az alumínium alapból kiválasztva; „Pasul 1 din 2” és a tolerancia-sor eltávolítva.
5. **Konfigurátor:** „Pasul 2 din 2” eltávolítva; egyetlen, közös „Deselectează” gomb az összes méretre; a magyarázó szövegek a mezők alatt törölve („Introdu lungimea…”, „Lățimea se debitează…”); csúszka + input csak a **Lungime** mezőnél; a **Lățime** (lemez/tábla) diszkrét gombokkal (1.000 / 1.250 / 1.500) – a hossz maximuma a választott formátumból adódik; „Desen tehnic” helyett „Ghid pentru alegerea dimensiunilor”; az élő előnézet a 2D rajz, amely követi a méreteket.
6. **Tolerancia:** a lemez/tábla/bandă toleranciája („-0/+3 mm pe fiecare dimensiune… minimul garantat…”) belső információ, sehol nem jelenik meg (konfigurátor, termékoldal, T&C). A profilok (-0/+3) és rudak (-0/+5) toleranciadoboza a konfigurátorban maradt.
7. **Lábléc:** a „Produse” oszlop törölve; Contact blokk: csak call center **+40 266 206 050**, direct@color-metal.ro és a székhely címe (a 051-es szám és a „București: +40 751 125 290” sor törölve).
8. **Contact oldal:** egyszerűsítve – call center (+40 266 206 050), e-mail, WhatsApp, székhely, üzenetküldő űrlap. A többi telephely felsorolása és a 051-es szám kikerült. A WhatsApp gomb változatlanul a +40 751 125 290-es számra mutat.
9. Egyéb: `Despre noi` a bannerfotót használja fejlécként; kosár, kedvencek és keresési javaslatok a 2D rajzokkal; a demo-rendelések a lemez új adatmodelljével (lățime diszkrét).

**RO:** antet pe un singur rând cu logo mai mic (fără telefon, fără Cariere), banner mai subțire cu fotografia Color Metal, carduri cu desenele 2D din webshopul actual, fotografiile stock eliminate (casete gri rezervate), pagina de material ca în original (previzualizare mică în dreapta, opțiuni vizibile de la început, fără descrieri), configurator cu un singur „Deselectează”, slider doar la lungime, lățimea plăcilor cu butoane, toleranța plăcilor neafișată, footer fără coloana Produse, un singur număr de call center.

# Revizia 3 (2026-09-22)
- Banner: doar „WEBSHOP COLOR METAL” (bold, un singur stil); secțiunea „Cantități mari…” eliminată de pe prima pagină.
- **AluShop** preluat din webshopul actual (`/alushop`, meniu „AluShop”, promo pe prima pagină): promoția de plăci debitate cu filtre (aliaj, grosime, lungime, lățime), tabel (aliaj, grosime, lungime, lățime, greutate, preț în lei fără TVA, cheltuieli de transport orientative) și „Pune în coș”; fiecare placă este bucată unică (cantitate 1, nu se duplică în coș). Datele: `/api/catalog/fixed-stock/alushop` din webshopul actual, prețurile EUR convertite prin `EUR_TO_RON`.
- Pagina de material: secțiunea „Culoare” apare doar la finisajul Eloxat. Configurator: aceeași previzualizare cu miniaturi ca pe pagina de material; fără butonul „Cere ofertă”. Produse: fără filtrul de material și fără căutarea din pagină. Logo mai mic.

# Revizia 4 (2026-09-22)
- Banner: fotografia nouă (textură aurie), titlul „WEBSHOP COLOR METAL” subțire, alb.
- Toleranțele nu se mai afișează nicăieri (configurator, T&C, Despre noi) – informație internă.
- Marcajul „RO” eliminat din antet/footer (nu există selector de limbă).
- Checkout: plata exclusiv în avans – doar card online sau transfer bancar (opțiunea „Ramburs la livrare” a fost eliminată); la „Card online” apare secțiunea NETOPIA Payments cu formular de card (număr cu formatare și validare Luhn, expirare LL/AA, CVV, nume) – simulare, datele cardului nu se salvează, în comandă rămân doar ultimele 4 cifre. Butonul devine „Plătește <sumă>”.
- Footer: siglele NETOPIA Payments / Visa / Mastercard cu „Plăți online securizate prin NETOPIA Payments” (ca în webshopul actual).
- Corecție: la deschiderea directă a paginii de checkout, datele contului se preiau automat.

# Revizia 5 (2026-09-24)
- **Desene tehnice noi, vectoriale (SVG).** Ilustrațiile de 325×150 px ale calculatorului oficial au fost redesenate
  programatic (`tools/generate-tech-drawings.mjs`): aceleași forme 3D și **aceleași notații** (b, d, g, l/L), dar clare
  la orice rezoluție (proiecție paralelă, umbrire metalică, cote cu săgeți).
- Desenul tehnic apare **peste tot unde era o imagine de produs**: carduri (prima pagină, Produse, căutare),
  pagina de material, configurator, coș, favorite, sugestiile din antet.
- Miniaturile de sub imagine au fost eliminate: la deschiderea produsului se vede direct desenul secțiunii. Pe pagina
  produsului rămân **două locuri rezervate** („Fotografie produs”) pentru fotografiile Color Metal de mai târziu.
  Desenele 2D simple (`ShapeIcon`) au fost scoase din proiect.
- Proporțiile desenelor au fost ajustate (piese mai scurte) și fiecare desen are acum un viewBox strâns pe conținut:
  se afișează la înălțime fixă, cu lățimea naturală, deci nu mai apar cadre late și goale în jurul desenului.
  Cele două locuri rezervate pentru fotografii apar atât pe pagina produsului, cât și în configurator.
- Lângă fiecare câmp de dimensiune apare litera din desen (ex. „Lățime `d`”, „Grosime `b`”, „Lungime `L`”), ca să fie
  clar ce se setează.
- **Lungime maximă 3.000 mm** la toate formele (limita de transport prin curier); valorile uzuale merg până la 3.000 mm
  (înainte: 6.000 mm la profile/bare, 50.000 mm la bandă).
