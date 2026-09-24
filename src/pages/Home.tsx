import { Link } from 'react-router-dom';
import { ArrowRight, Headphones, Ruler, Tag } from 'lucide-react';
import { SHAPES } from '@/data/shapes';
import { ProductCard } from '@/components/product/ProductCard';
import { asset } from '@/lib/format';
import { SITE } from '@/config/site';

/** Bandă scurtă sub banner: un titlu și o propoziție despre fiecare secțiune a webshopului. */
const GUIDE = [
  { to: '/produse', icon: Ruler, title: 'Produse', text: 'Configurezi, vezi prețul și adaugi în coș – tăiat pe măsura ta, livrat direct la tine acasă.' },
  { to: '/alushop', icon: Tag, title: 'AluShop', text: 'Plăci groase de aluminiu din stoc, la preț redus – fiecare bucată, unicat.' },
  { to: '/contact', icon: Headphones, title: 'Nu găsești în Produse?', text: `Dimensiuni speciale, alte materiale sau cantități mari – scrie-ne sau sună la ${SITE.phones.callCenter}.` },
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

      {/* Bandă discretă: ce conține fiecare secțiune */}
      <section className="relative bg-ink text-white">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />
        <div className="container-cm grid gap-x-6 gap-y-2.5 py-3 lg:grid-cols-3 lg:divide-x lg:divide-white/10">
          {GUIDE.map(({ to, icon: Icon, title, text }) => (
            <Link key={to} to={to} className="group lg:px-6 lg:first:pl-0 lg:last:pr-0">
              <span className="flex items-center gap-2 text-sm font-semibold">
                <Icon className="h-4 w-4 shrink-0 text-brand-gold" />
                <span className="group-hover:underline">{title}</span>
                <ArrowRight className="h-3.5 w-3.5 text-brand-gold transition-transform duration-200 group-hover:translate-x-1" />
              </span>
              <span className="mt-0.5 block text-[12px] leading-[19px] text-white/60">{text}</span>
            </Link>
          ))}
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
