import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, Headphones, Ruler, ShoppingCart, Tag } from 'lucide-react';
import { SHAPES } from '@/data/shapes';
import { ProductCard } from '@/components/product/ProductCard';
import { asset, cls } from '@/lib/format';
import { SITE } from '@/config/site';

/** Bandă scurtă sub banner: un titlu și o propoziție despre fiecare secțiune a webshopului. */
const GUIDE = [
  { to: '/produse', icon: Ruler, title: 'Produse', anim: 'cm-anim-tilt', text: 'Configurezi, vezi prețul și adaugi în coș – tăiat pe măsura ta, livrat direct la tine acasă.' },
  { to: '/produse/placa-groasa', icon: Tag, title: 'Plăci groase', anim: 'cm-anim-swing', text: 'Bucăți unice din stoc la preț promoțional sau plăci debitate exact pe măsura ta.' },
  { to: '/contact', icon: Headphones, title: 'Comenzi speciale', anim: 'cm-anim-beat', text: `Alte dimensiuni, alte materiale sau cantități mari – scrie-ne sau sună la ${SITE.phones.callCenter}.` },
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
        <div className="container-cm flex min-h-[120px] items-center gap-3 py-6 sm:min-h-[150px] sm:gap-4 lg:min-h-[168px] lg:gap-5">
          {/* semn de magazin: se vede din prima că e webshop */}
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/45 bg-white/10 shadow-[0_6px_20px_-8px_rgba(0,0,0,.6)] backdrop-blur-[2px] sm:h-[52px] sm:w-[52px] lg:h-14 lg:w-14">
            <ShoppingCart className="h-5 w-5 text-white sm:h-6 sm:w-6 lg:h-7 lg:w-7" strokeWidth={1.25} />
          </span>
          <h1 className="text-2xl font-light uppercase tracking-[0.2em] text-white sm:text-3xl lg:text-4xl">Webshop Color Metal</h1>
        </div>
      </section>

      {/* Bandă discretă: ce conține fiecare secțiune */}
      <section className="relative bg-ink text-white">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />
        <div className="container-cm grid gap-x-6 gap-y-2.5 py-3 lg:grid-cols-3 lg:divide-x lg:divide-white/10">
          {GUIDE.map(({ to, icon: Icon, title, text, anim }) => (
            <Link key={to} to={to} className="group lg:px-6 lg:first:pl-0 lg:last:pr-0">
              <span className="flex items-center gap-2 text-sm font-semibold">
                <Icon className={cls('h-4 w-4 shrink-0 text-brand-gold', anim)} />
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

      {/* Trimitere către magazinul de soluții arhitecturale */}
      <section className="container-cm mt-14">
        <div className="relative isolate overflow-hidden rounded-2xl bg-ink text-white shadow-[var(--shadow-card)]">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_38%]">
            <div className="relative order-2 p-5 sm:p-6 lg:order-1 lg:py-7 lg:pl-8 lg:pr-6">
              <span className="pointer-events-none absolute -left-16 -top-16 -z-10 h-56 w-56 rounded-full bg-brand-gold/20 blur-3xl cm-aura" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-gold">Soluții arhitecturale</p>
              <h2 className="mt-2 text-xl font-semibold sm:text-2xl">Te gândești la un acoperiș sau la o fațadă?</h2>
              <p className="mt-2 text-[13px] leading-6 text-white/75">
                Color Metal Arhitectural este magazinul nostru pentru proiecte de arhitectură: îți alegi materialele
                pentru proiect și vezi la ce costuri să te aștepți, iar detaliile tehnice le punem la punct împreună înainte
                de comanda finală. Pentru proprietari de case, dar și pentru arhitecți, montatori și firme de construcții.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                <a
                  href={SITE.architecturalShop}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-lg bg-brand-gold px-5 text-sm font-bold uppercase tracking-wide text-white shadow-[0_10px_26px_-10px_rgba(0,0,0,.8)] transition hover:bg-brand-gold-dark"
                >
                  Vezi magazinul arhitectural <ExternalLink className="h-4 w-4" />
                </a>
                <p className="text-[11px] text-white/55">cmarhitectural.ro · se lansează în curând</p>
              </div>
            </div>

            {/* fotografie de referință: acoperiș din titan-zinc */}
            <div className="relative order-1 lg:order-2">
              <picture>
                <source media="(max-width: 1023px)" srcSet={asset('/assets/arhitectural/acoperis-mobile.jpg')} />
                <img
                  src={asset('/assets/arhitectural/acoperis.jpg')}
                  alt="Acoperiș din titan-zinc realizat cu materiale Color Metal"
                  className="h-44 w-full object-cover object-center sm:h-52 lg:absolute lg:inset-0 lg:h-full"
                  width={1200}
                  height={600}
                  loading="lazy"
                />
              </picture>
              {/* trecere lină spre partea întunecată, ca să nu taie brusc */}
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent lg:bg-gradient-to-r lg:from-ink lg:via-ink/0 lg:to-transparent" />
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
