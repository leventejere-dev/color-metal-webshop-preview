import { Link } from 'react-router-dom';
import { Award, Factory, Globe2, Scissors } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/misc';
import { asset } from '@/lib/format';
import { SITE } from '@/config/site';

/** Textul urmează pagina oficială „Despre noi / Echipa” de pe color-metal.ro. */
export function AboutPage() {
  return (
    <div>
      <section className="relative isolate overflow-hidden bg-ink text-white">
        <img src={asset('/assets/products/sheet-context.jpg')} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/90 via-ink/70 to-ink/30" />
        <div className="container-cm flex min-h-[220px] flex-col justify-center py-10">
          <p className="eyebrow !text-brand-gold">Despre noi</p>
          <h1 className="mt-2 text-3xl font-light sm:text-4xl lg:text-[44px]">20 de ani de excelență în industria metalelor neferoase</h1>
        </div>
      </section>

      <div className="container-cm py-10">
        <Breadcrumbs items={[{ label: 'Despre noi' }]} />
        <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <article className="prose-cm max-w-3xl">
            <p>
              În 2025, Color Metal sărbătorește 20 de ani de activitate dedicată furnizării de semifabricate din aluminiu, cupru, alamă, bronz și titan-zinc. Suntem unul dintre liderii din Europa de Est în distribuția materialelor neferoase, deservind industrii diverse precum automotive, prelucrarea metalelor, aeronautica, industria alimentară, construcțiile și publicitatea.
            </p>
            <p>
              Activitatea noastră este construită pe parteneriate solide și pe încrederea câștigată prin profesionalism și flexibilitate. Cu trei centre logistice în România – București, Timișoara și Odorheiu Secuiesc – și o prezență activă în Bulgaria, Ungaria, Serbia și Republica Moldova, oferim acces rapid la materiale certificate, de înaltă calitate, provenite de la producători recunoscuți la nivel mondial.
            </p>
            <p>
              Gama noastră variată de produse este completată de servicii profesionale, precum debitarea materialelor, ambalarea personalizată și asistența tehnică. De asemenea, divizia de soluții arhitecturale susține proiectele de renovare și design contemporan cu materiale premium pentru fațade, acoperișuri și amenajări interioare.
            </p>
            <p>
              Cu o echipă de experți și o viziune orientată spre excelență, Color Metal continuă să răspundă cerințelor pieței și să susțină inovația industrială, fiind un partener de încredere pentru clienții săi. 20 de ani de experiență confirmă angajamentul nostru pentru calitate, sustenabilitate și soluții personalizate.
            </p>
            <h2>Webshopul Color Metal</h2>
            <p>
              Webshopul aduce online exact logica din depozit: alegi forma, apoi materialul, apoi dimensiunile. Prețul se calculează automat din greutatea piesei, iar debitarea la lungime se face cu toleranțele afișate în configurator. Pentru cantități mari sau dimensiuni speciale, echipa de vânzări răspunde la{' '}
              <a href={`mailto:${SITE.emails.direct}`}>{SITE.emails.direct}</a> sau la call center {SITE.phones.callCenter1}.
            </p>
          </article>

          <aside className="space-y-4">
            {[
              { icon: Factory, title: 'Trei centre logistice', text: 'Odorheiu Secuiesc (sediu central), București – Mogoșoaia și Timișoara – Ghiroda.' },
              { icon: Globe2, title: 'Prezență regională', text: 'România, Bulgaria, Ungaria, Serbia și Republica Moldova.' },
              { icon: Scissors, title: 'Servicii', text: 'Debitare la dimensiune, ambalare personalizată și asistență tehnică.' },
              { icon: Award, title: 'Materiale certificate', text: 'Semifabricate de la producători recunoscuți la nivel mondial, cu certificate de calitate.' },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="card flex gap-4 p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-gold-light text-brand-gold-dark">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted">{text}</p>
                </div>
              </div>
            ))}
            <div className="card bg-surface p-5 text-sm">
              <p className="font-semibold">Vrei să lucrezi cu noi?</p>
              <p className="mt-1 text-muted">Vezi oportunitățile de carieră sau contactează echipa.</p>
              <div className="mt-3 flex gap-2">
                <Link to="/cariere" className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-ink-soft">
                  Cariere
                </Link>
                <Link to="/contact" className="rounded-lg border border-line bg-white px-4 py-2 text-sm font-semibold hover:border-ink/40">
                  Contact
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
