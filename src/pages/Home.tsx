import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, Ruler, Truck } from 'lucide-react';
import { SHAPES } from '@/data/shapes';
import { ProductCard } from '@/components/product/ProductCard';
import { asset } from '@/lib/format';
import { SITE, telHref } from '@/config/site';

export function HomePage() {
  return (
    <>
      {/* Banner compact, în stilul benzii de sus de pe color-metal.ro */}
      <section className="relative isolate overflow-hidden bg-ink text-white">
        <picture>
          <source media="(max-width: 640px)" srcSet={asset('/assets/banner/hero-mobile.jpg')} />
          <img src={asset('/assets/banner/hero.jpg')} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" fetchPriority="high" width={1920} height={640} />
        </picture>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/85 via-ink/60 to-ink/30" />
        <div className="container-cm flex min-h-[190px] flex-col justify-center py-9 sm:min-h-[230px] lg:min-h-[250px]">
          <p className="eyebrow !text-brand-gold">Color Metal · Webshop</p>
          <h1 className="mt-2 text-3xl font-light tracking-tight sm:text-4xl lg:text-[44px]">Semifabricate metalice</h1>
          <p className="mt-2 max-w-xl text-sm text-white/80 sm:text-base">
            Plăci, table, profile, țevi și bare din aluminiu, cupru, alamă și bronz – configurate și debitate la dimensiunea ta.
          </p>
        </div>
      </section>

      {/* Toate formele de produs */}
      <section className="container-cm pt-10 sm:pt-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Produse</p>
            <h2 className="mt-1 text-2xl font-semibold sm:text-3xl">Alege forma produsului</h2>
            <p className="mt-2 max-w-2xl text-[15px] text-muted">Întâi forma, apoi materialul, apoi dimensiunile. Prețul se calculează automat din greutate, în lei.</p>
          </div>
          <Link to="/produse" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-bronze hover:underline">
            Vezi lista completă <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {SHAPES.map((s) => (
            <ProductCard key={s.id} shape={s} />
          ))}
        </div>
        <p className="mt-4 text-xs text-muted">Produsele configurate se realizează conform specificațiilor clientului și nu beneficiază de drept de retur (OUG 34/2014).</p>
      </section>

      {/* USP */}
      <section className="container-cm mt-14">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: Ruler, title: 'Debitare la dimensiune', text: 'Lungimi la milimetru, cu toleranță de debitare clar afișată: -0/+3 mm la profile, -0/+5 mm la bare.' },
            { icon: BadgeCheck, title: 'Materiale certificate', text: 'Semifabricate de la producători recunoscuți, cu certificate de calitate disponibile la cerere.' },
            { icon: Truck, title: 'Trei centre logistice', text: 'Odorheiu Secuiesc, București și Timișoara – livrare rapidă în toată țara.' },
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
        </div>
      </section>

      {/* Consultant */}
      <section className="container-cm mt-14">
        <div className="card flex flex-col gap-5 bg-surface p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="eyebrow">Cantități mari sau dimensiuni speciale?</p>
            <h2 className="mt-1 text-xl font-semibold">Vorbește cu un consultant Color Metal</h2>
            <p className="mt-1 text-sm text-muted">
              Call center {SITE.phones.callCenter1} · {SITE.phones.callCenter2} · {SITE.emails.direct}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={telHref(SITE.phones.callCenter1)} className="inline-flex h-11 items-center rounded-lg bg-ink px-5 text-sm font-semibold text-white hover:bg-ink-soft">
              Sună acum
            </a>
            <Link to="/contact" className="inline-flex h-11 items-center rounded-lg border border-line bg-white px-5 text-sm font-semibold hover:border-ink/40">
              Pagina de contact
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
