import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { CATEGORIES, SHAPES, type ShapeCategory } from '@/data/shapes';
import { ProductCard } from '@/components/product/ProductCard';
import { Breadcrumbs, EmptyState, PageHeader } from '@/components/ui/misc';
import { cls } from '@/lib/format';

export function ProductsPage() {
  const [params, setParams] = useSearchParams();
  const cat = (params.get('categorie') as ShapeCategory | null) ?? null;

  const list = useMemo(() => {
    return cat ? SHAPES.filter((s) => s.category === cat) : SHAPES;
  }, [cat]);

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const chip = (active: boolean) =>
    cls('h-9 rounded-full border px-3.5 text-sm font-medium transition', active ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink-soft hover:border-ink/40');

  return (
    <div className="container-cm py-8">
      <Breadcrumbs items={[{ label: 'Produse' }]} />
      <PageHeader
        eyebrow="Produse"
        title="Semifabricate metalice configurabile"
        intro="Toate formele disponibile în webshop. Filtrează după categorie, apoi configurează dimensiunile."
      />

      <div className="mt-6">
        <div className="flex flex-wrap items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted" />
          <button className={chip(!cat)} onClick={() => setParam('categorie', null)}>
            Toate
          </button>
          {CATEGORIES.map((c) => (
            <button key={c.id} className={chip(cat === c.id)} onClick={() => setParam('categorie', cat === c.id ? null : c.id)}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="Nu există produse în această categorie." />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((s) => (
            <ProductCard key={s.id} shape={s} />
          ))}
        </div>
      )}
      <p className="mt-6 text-xs text-muted">{list.length} produse afișate · Prețurile se calculează din greutate, în lei, cu TVA 21%.</p>
    </div>
  );
}
