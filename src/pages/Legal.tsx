import { Breadcrumbs, Notice, PageHeader } from '@/components/ui/misc';
import { SITE } from '@/config/site';

function LegalShell({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <div className="container-cm max-w-3xl py-8">
      <Breadcrumbs items={[{ label: title }]} />
      <PageHeader title={title} intro={`Ultima actualizare: ${updated}`} />
      <Notice className="mt-6">Conținut demonstrativ. Textul legal final este furnizat și validat de {SITE.legalName}.</Notice>
      <article className="prose-cm mt-6">{children}</article>
    </div>
  );
}

export function TermsPage() {
  return (
    <LegalShell title="Termeni și condiții" updated="septembrie 2026">
      <h2>1. Informații generale</h2>
      <p>
        Webshopul este operat de {SITE.legalName}, cu sediul în {SITE.locations[0].address}. Utilizarea site-ului și plasarea unei comenzi implică acceptarea prezentelor termeni și condiții.
      </p>
      <h2>2. Produse configurate</h2>
      <p>
        Produsele din webshop sunt semifabricate metalice debitate la dimensiunile indicate de client în configurator. Fiind realizate conform specificațiilor clientului, acestea nu beneficiază de dreptul de retragere prevăzut de OUG 34/2014 (art. 16 lit. c).
      </p>
      <h2>3. Dimensiuni și toleranțe</h2>
      <ul>
        <li>Profile și țevi: toleranță la lungime -0 / +3 mm.</li>
        <li>Bare late, pătrate, hexagonale și rotunde: toleranță la lungime -0 / +5 mm.</li>
        <li>Plăci, table și bandă: toleranță la debitare -0 / +3 mm pe fiecare dimensiune.</li>
      </ul>
      <p>Lungimea livrată nu este niciodată mai mică decât cea comandată.</p>
      <h2>4. Prețuri și plată</h2>
      <p>
        Prețurile sunt afișate în lei și includ TVA (21%), cu excepția cazurilor în care se menționează explicit „fără TVA”. Prețul se calculează din greutatea teoretică a piesei (densitate × volum) și prețul pe kilogram al materialului. Prețurile pot fi actualizate până la finalizarea comenzii. Metode de plată: transfer bancar (pe baza facturii proforme), card online și ramburs la livrare.
      </p>
      <h2>5. Comenzi și cantități</h2>
      <p>
        Comenzile online sunt limitate la 100 de bucăți per configurație. Pentru cantități mai mari, dimensiuni speciale sau materiale care nu apar în configurator, vă rugăm să contactați un consultant Color Metal.
      </p>
      <h2>6. Livrare</h2>
      <p>Costul transportului este calculat în funcție de greutate și destinație și este comunicat la confirmarea comenzii. Termenul de livrare se comunică la confirmarea comenzii.</p>
      <h2>7. Garanție și reclamații</h2>
      <p>
        Produsele sunt însoțite, la cerere, de certificate de calitate ale producătorului. Reclamațiile privind conformitatea se transmit la {SITE.emails.direct} în termen de 48 de ore de la recepție, cu fotografii și numărul comenzii.
      </p>
      <h2>8. Soluționarea litigiilor</h2>
      <p>Consumatorii pot apela la ANPC, la platforma SOL (soluționarea online a litigiilor) sau la procedura SAL, conform legislației în vigoare.</p>
    </LegalShell>
  );
}

export function PrivacyPage() {
  return (
    <LegalShell title="Politica de confidențialitate" updated="septembrie 2026">
      <h2>1. Operatorul de date</h2>
      <p>
        {SITE.legalName}, {SITE.locations[0].address}, email {SITE.emails.direct}.
      </p>
      <h2>2. Ce date prelucrăm</h2>
      <ul>
        <li>Date de identificare și contact: nume, email, telefon, companie, CUI, adrese de facturare și livrare.</li>
        <li>Date despre comenzi: produse configurate, cantități, valori, istoricul comenzilor și documentele emise.</li>
        <li>Date tehnice: preferințe salvate în browser (coș, favorite), necesare funcționării webshopului.</li>
      </ul>
      <h2>3. Scopuri și temeiuri</h2>
      <p>
        Executarea contractului (procesarea comenzilor, facturare, livrare), obligații legale (fiscale, contabile), interes legitim (suport clienți, prevenirea fraudelor) și consimțământ (newsletter, aplicații de carieră).
      </p>
      <h2>4. Durata stocării</h2>
      <p>Datele de facturare se păstrează conform legislației fiscale; datele contului – cât timp contul este activ; datele de recrutare – maximum 12 luni.</p>
      <h2>5. Drepturile dumneavoastră</h2>
      <p>
        Acces, rectificare, ștergere, restricționare, portabilitate, opoziție și retragerea consimțământului. Solicitările se transmit la {SITE.emails.direct}. Aveți dreptul de a depune o plângere la ANSPDCP.
      </p>
      <h2>6. Prototipul webshop</h2>
      <p>În această versiune demonstrativă, datele introduse sunt stocate exclusiv în browserul dumneavoastră (localStorage) și nu sunt transmise către niciun server.</p>
    </LegalShell>
  );
}

export function ReturnsPage() {
  return (
    <LegalShell title="Politica de retur" updated="septembrie 2026">
      <h2>Produse personalizate</h2>
      <p>
        Produsele configurate și debitate la dimensiunile clientului sunt realizate conform specificațiilor acestuia și nu pot fi returnate din motive de răzgândire (OUG 34/2014, art. 16 lit. c).
      </p>
      <h2>Produse neconforme</h2>
      <p>
        Dacă produsul livrat nu corespunde configurației comandate (material, dimensiuni în afara toleranțelor, defecte de material), vă rugăm să ne anunțați în 48 de ore de la recepție la {SITE.emails.direct}, cu numărul comenzii și fotografii. Produsul neconform se înlocuiește sau se rambursează integral, inclusiv costul transportului.
      </p>
      <h2>Livrare deteriorată</h2>
      <p>Verificați coletul la primire; deteriorările vizibile se consemnează în procesul-verbal al curierului.</p>
    </LegalShell>
  );
}
