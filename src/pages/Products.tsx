import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { CATEGORIES, SHAPES, type ShapeCategory } from '@/data/shapes';
import { MATERIALS, MATERIAL_ORDER, type MaterialId } from '@/data/materials';
import { ProductCard } from '@/components/product/ProductCard';
import { Breadcrumbs, EmptyState, PageHeader } from '@/components/ui/misc';
import { searchShapes } from '@/lib/search';
import { cls } from '@/lib/format';

export function ProductsPage() {
  const [params, setParams] = useSearchParams();
  const cat = (params.get('categorie') as ShapeCategory | null) ?? null;
  const mat = (params.get('material') as MaterialId | null) ?? null;
  const [q, setQ] = useState('');

  const list = useMemo(() => {
    let l = q.trim() ? searchShapes(q) : SHAPES;
    if (cat) l = l.filter((s) => s.category === cat);
    if (mat) l = l.filter((s) => s.materials.includes(mat));
    return l;
  }, [q, cat, mat]);

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
        intro="Toate formele disponibile în webshop. Filtrează după categorie sau material, apoi configurează dimensiunile."
      />

      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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
        <div className="relative w-full lg:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Caută produse" aria-label="Caută produse" className="input h-10 pl-9" />
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">Material:</span>
        <button className={chip(!mat)} onClick={() => setParam('material', null)}>
          Toate
        </button>
        {MATERIAL_ORDER.map((m) => (
          <button key={m} className={chip(mat === m)} onClick={() => setParam('material', mat === m ? null : m)}>
            <span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full align-middle" style={{ background: MATERIALS[m].swatch }} />
            {MATERIALS[m].label}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="Nu există produse care corespund filtrelor selectate." text="Încearcă alt termen de căutare sau elimină filtrele." />
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
