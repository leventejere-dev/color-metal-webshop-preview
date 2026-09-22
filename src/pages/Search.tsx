import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import { searchShapes } from '@/lib/search';
import { ProductCard } from '@/components/product/ProductCard';
import { Breadcrumbs, EmptyState, PageHeader } from '@/components/ui/misc';
import { ButtonLink } from '@/components/ui/Button';
import { SHAPES } from '@/data/shapes';

export function SearchPage() {
  const [params] = useSearchParams();
  const q = (params.get('q') ?? '').trim();
  const results = useMemo(() => (q ? searchShapes(q) : []), [q]);

  return (
    <div className="container-cm py-8">
      <Breadcrumbs items={[{ label: 'Căutare' }]} />
      <PageHeader eyebrow="Căutare" title={q ? `Rezultate pentru „${q}”` : 'Căutare produse'} intro={q ? `${results.length} ${results.length === 1 ? 'produs găsit' : 'produse găsite'} · căutare după nume, formă, material și descriere.` : 'Introdu un termen în câmpul „Caută produse” din antet.'} />

      {q && results.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={<SearchX className="h-6 w-6" />}
            title="Nu am găsit produse pentru acest termen."
            text="Încearcă un termen mai general (ex. „țeavă”, „bară”, „aluminiu”, „cupru”) sau vezi lista completă."
            action={<ButtonLink to="/produse">Toate produsele</ButtonLink>}
          />
          <div className="mt-8">
            <h2 className="eyebrow">Sugestii</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {SHAPES.map((s) => (
                <Link key={s.id} to={`/produse/${s.slug}`} className="rounded-full border border-line px-3 py-1.5 text-sm hover:border-ink/40">
                  {s.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((s) => (
            <ProductCard key={s.id} shape={s} />
          ))}
        </div>
      )}
    </div>
  );
}

export function NotFoundPage() {
  return (
    <div className="container-cm py-16">
      <EmptyState title="Pagina nu a fost găsită." text="Linkul poate fi greșit sau pagina a fost mutată." action={<ButtonLink to="/">Înapoi la prima pagină</ButtonLink>} />
    </div>
  );
}
