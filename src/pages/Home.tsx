import { Link } from 'react-router-dom';
import { ArrowRight, Headphones, Ruler, Tag } from 'lucide-react';
import { SHAPES } from '@/data/shapes';
import { ProductCard } from '@/components/product/ProductCard';
import { asset } from '@/lib/format';
import { SITE } from '@/config/site';

/** Cele trei repere explicate sub banner: ce este „Produse”, ce este „AluShop” și unde se caută. */
const GUIDE = [
  {
    to: '/produse',
    icon: Ruler,
    title: 'Produse – tu alegi dimensiunea',
    text: (
      <>
        Alegi <strong className="font-semibold text-white">forma</strong>, apoi{' '}
        <strong className="font-semibold text-white">materialul</strong> și{' '}
        <strong className="font-semibold text-white">dimensiunile</strong>. Prețul se calculează automat din greutate, iar noi debităm exact la
        măsura comandată – lungimi până la 3.000 mm.
      </>
    ),
    cta: 'Vezi produsele',
  },
  {
    to: '/alushop',
    icon: Tag,
    title: 'AluShop – plăci din stoc, preț redus',
    text: (
      <>
        Plăci groase din aluminiu rămase din debitare: dimensiuni fixe, fiecare bucată este{' '}
        <strong className="font-semibold text-white">unică</strong> și se poate comanda o singură dată, la preț promoțional.
      </>
    ),
    cta: 'Vezi AluShop',
  },
  {
    to: '/contact',
    icon: Headphones,
    title: 'Nu găsești ce cauți?',
    text: (
      <>
        Caută direct în câmpul din antet (ex. „țeavă”, „cupru”, „bară”). Pentru cantități mari, dimensiuni speciale sau alte materiale, scrie-ne
        sau sună la {SITE.phones.callCenter}.
      </>
    ),
    cta: 'Contact',
  },
];

export function HomePage() {
  return (
    <>
      {/* Banner subțire – fotografie Color Metal (textură metalică aurie) */}
      <section className="relative isolate overflow-hidden bg-ink text-white">
        <picture>
          <source media="(max-width: 640px)" srcSet={asset('/assets/banner/hero-mobile.jpg')} />
          <img src={asset('/assets/banner/hero.jpg')} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover object-center" fetchPriority="high" width={1920} height={480} />
        </picture>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/60 via-ink/30 to-transparent" />
        <div className="container-cm flex min-h-[120px] items-center py-6 sm:min-h-[150px] lg:min-h-[168px]">
          <h1 className="text-2xl font-light uppercase tracking-[0.2em] text-white sm:text-3xl lg:text-4xl">Webshop Color Metal</h1>
        </div>
      </section>

      {/* Ghid scurt – bandă închisă, continuă sub banner: ce conține fiecare secțiune */}
      <section className="relative isolate overflow-hidden bg-ink text-white">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(75%_150%_at_12%_0%,rgba(203,163,73,0.20),transparent_65%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent" />
        <div className="container-cm py-7 sm:py-9">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-gold">Cum cumperi de aici</p>

          <div className="mt-5 grid gap-px overflow-hidden rounded-xl bg-white/10 ring-1 ring-white/10 lg:grid-cols-3">
            {GUIDE.map(({ to, icon: Icon, title, text, cta }) => (
              <Link key={to} to={to} className="group relative flex flex-col bg-ink p-5 transition-colors hover:bg-white/[0.045]">
                <span className="pointer-events-none absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-brand-gold to-brand-gold/0 transition-transform duration-300 group-hover:scale-x-100" />
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-gold/15 text-brand-gold ring-1 ring-inset ring-brand-gold/30 transition group-hover:bg-brand-gold group-hover:text-ink">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-[15px] font-semibold tracking-tight">{title}</span>
                </span>
                <span className="mt-3 block text-[13px] leading-6 text-white/65">{text}</span>
                <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-gold">
                  {cta} <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Toate formele de produs */}
      <section className="container-cm pt-10 sm:pt-12">
        <p className="eyebrow">Produse</p>
        <h2 className="mt-1 text-2xl font-semibold sm:text-3xl">Alege forma produsului</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {SHAPES.map((s) => (
            <ProductCard key={s.id} shape={s} />
          ))}
        </div>
        <p className="mt-4 text-xs text-muted">Produsele configurate se realizează conform specificațiilor clientului și nu beneficiază de drept de retur (OUG 34/2014).</p>
      </section>

      {/* AluShop */}
      <section className="container-cm mt-12">
        <div className="card flex flex-col gap-4 bg-surface p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="eyebrow">AluShop</p>
            <h2 className="mt-1 text-lg font-semibold">Promoție plăci debitate</h2>
            <p className="mt-0.5 text-sm text-muted">Plăci groase din aluminiu, dimensiuni unice, disponibile în limita stocului – preț redus.</p>
          </div>
          <Link to="/alushop" className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg bg-ink px-4 text-sm font-semibold text-white hover:bg-ink-soft">
            Vezi AluShop <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
