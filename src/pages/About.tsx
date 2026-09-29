import { Link } from 'react-router-dom';
import { Award, Factory, Globe2, Scissors } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/misc';
import { asset } from '@/lib/format';
import { SITE } from '@/config/site';

/** Textul și fotografia sediului sunt furnizate de Color Metal. */
export function AboutPage() {
  return (
    <div className="container-cm py-6 sm:py-8">
      <Breadcrumbs items={[{ label: 'Despre noi' }]} />

      <p className="eyebrow">Despre noi</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">Color Metal</h1>
      <p className="mt-2 max-w-2xl text-lg font-light text-muted sm:text-xl">Soluții complete în domeniul metalelor neferoase</p>

      {/* fotografia sediului, în propriul cadru */}
      <figure className="group mt-6 overflow-hidden rounded-2xl shadow-[var(--shadow-card)] ring-1 ring-black/5">
        <span className="relative block overflow-hidden">
          <picture>
            <source media="(max-width: 640px)" srcSet={asset('/assets/about/sediu-mobile.jpg')} />
            <img
              src={asset('/assets/about/sediu.jpg')}
              alt="Sediul Color Metal – clădirea cu fațadă verde din tablă expandată"
              className="h-[240px] w-full object-cover object-center transition-transform duration-[6000ms] ease-out group-hover:scale-[1.04] sm:h-[360px] lg:h-[440px]"
              width={1920}
              height={1080}
              fetchPriority="high"
            />
          </picture>
          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink/80 to-transparent" />
          <figcaption className="absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-x-2 px-5 py-4 text-sm text-white/90 sm:px-6">
            <span className="font-semibold">Sediul Color Metal</span>
            <span className="text-white/60">· depozit, debitare și Metal Shop sub același acoperiș</span>
          </figcaption>
        </span>
      </figure>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <article className="prose-cm max-w-3xl">
          <p>
            În prezent, Color Metal are peste 20 de ani de experiență în furnizarea de semifabricate din aluminiu, cupru,
            alamă, bronz și titan-zinc. Suntem unul dintre distribuitorii importanți de metale neferoase din Europa de Est și
            colaborăm cu industrii diverse, precum automotive, prelucrarea metalelor, aeronautica, industria alimentară,
            construcțiile și publicitatea.
          </p>
          <p>
            De-a lungul anilor, am construit parteneriate solide și am câștigat încrederea clienților prin profesionalism,
            flexibilitate și soluții adaptate nevoilor fiecărui proiect. Activitatea noastră este susținută de trei centre
            logistice în România — București, Timișoara și Odorheiu Secuiesc — și de propriul nostru punct de lucru din
            Bulgaria. Suntem prezenți și pe piețele din Ungaria, Serbia și Republica Moldova, oferind acces la materiale
            certificate, de înaltă calitate, provenite de la producători recunoscuți la nivel internațional.
          </p>
          <p>
            Pe lângă gama variată de produse, oferim servicii precum debitarea materialelor, ambalarea personalizată și
            asistența tehnică. Divizia noastră de soluții arhitecturale sprijină proiecte de renovare și construcții
            contemporane cu materiale premium pentru fațade, acoperișuri și amenajări interioare.
          </p>
          <p>
            Cu o echipă de specialiști și o experiență de peste două decenii, Color Metal continuă să răspundă cerințelor
            pieței și să susțină dezvoltarea proiectelor industriale și arhitecturale. Calitatea, seriozitatea și
            flexibilitatea stau la baza fiecărei colaborări.
          </p>
          <h2>Webshopul Color Metal</h2>
          <p>
            Webshopul aduce online exact logica din depozit: alegi forma, apoi materialul, apoi dimensiunile. Prețul se
            calculează automat din greutatea piesei. Pentru cantități mari sau dimensiuni speciale, echipa de vânzări
            răspunde la <a href={`mailto:${SITE.emails.direct}`}>{SITE.emails.direct}</a> sau la call center{' '}
            {SITE.phones.callCenter}.
          </p>
        </article>

        <aside className="space-y-4">
          {[
            { icon: Factory, title: 'Trei centre logistice', text: 'Odorheiu Secuiesc (sediu central), București – Mogoșoaia și Timișoara – Ghiroda.' },
            { icon: Globe2, title: 'Prezență regională', text: 'România și punct de lucru propriu în Bulgaria; prezenți în Ungaria, Serbia și Republica Moldova.' },
            { icon: Scissors, title: 'Servicii', text: 'Debitare la dimensiune, ambalare personalizată și asistență tehnică.' },
            { icon: Award, title: 'Materiale certificate', text: 'Semifabricate de la producători recunoscuți la nivel internațional, cu certificate de calitate.' },
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
            <p className="font-semibold">Ai întrebări despre produse?</p>
            <p className="mt-1 text-muted">Echipa Color Metal răspunde la call center {SITE.phones.callCenter}.</p>
            <div className="mt-3">
              <Link to="/contact" className="inline-block rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-ink-soft">
                Contact
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
