import { useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { CATEGORIES, SHAPE_BY_SLUG, TOLERANCES } from '@/data/shapes';
import { ELOX_COLORS, FINISHES, MATERIALS, type EloxColorId, type FinishId, type MaterialId } from '@/data/materials';
import { ProductGallery } from '@/components/product/ProductGallery';
import { FavoriteButton } from '@/components/product/ProductCard';
import { Breadcrumbs, Notice } from '@/components/ui/misc';
import { Button } from '@/components/ui/Button';
import { fieldValues } from '@/lib/configurator';
import { cls, n } from '@/lib/format';
import { pricePerKgRon } from '@/lib/pricing';
import { money } from '@/lib/format';

export function ProductDetailPage() {
  const { slug = '' } = useParams();
  const shape = SHAPE_BY_SLUG[slug];
  const navigate = useNavigate();
  const [material, setMaterial] = useState<MaterialId | null>(shape && shape.materials.length === 1 ? shape.materials[0] : null);
  const [finish, setFinish] = useState<FinishId>('natur');
  const [color, setColor] = useState<EloxColorId>('natur');

  const summary = useMemo(() => {
    if (!shape) return [];
    return shape.fields.map((f) => {
      const vals = fieldValues(shape, f.key);
      return `${f.label}: ${n(vals[0])}–${n(vals[vals.length - 1])} mm`;
    });
  }, [shape]);

  if (!shape) return <Navigate to="/produse" replace />;

  const mat = material ? MATERIALS[material] : null;
  const showFinish = mat?.finishes.length ? mat.finishes : null;
  const tol = TOLERANCES[shape.tolerance];
  const category = CATEGORIES.find((c) => c.id === shape.category)?.label ?? '';

  const goNext = () => {
    if (!material) return;
    const params = new URLSearchParams();
    if (showFinish) {
      params.set('finisaj', finish);
      if (finish === 'eloxat') params.set('culoare', color);
    }
    navigate(`/configurator/${shape.slug}/${material.toLowerCase()}${params.toString() ? `?${params}` : ''}`);
  };

  return (
    <div className="container-cm py-8">
      <Breadcrumbs items={[{ label: 'Produse', to: '/produse' }, { label: shape.name }]} />
      <Link to="/produse" className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Înapoi la produse
      </Link>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-12">
        <div>
          <ProductGallery shape={shape} />
        </div>

        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">{category}</p>
              <h1 className="mt-1 text-3xl font-semibold">{shape.name}</h1>
              <p className="mt-1 text-muted">{shape.short}</p>
            </div>
            <FavoriteButton slug={shape.slug} name={shape.name} />
          </div>
          <p className="mt-4 text-[15px] leading-7 text-ink-soft">{shape.description}</p>

          <dl className="mt-5 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
            {summary.map((s) => (
              <div key={s} className="flex gap-2">
                <dt className="sr-only">Dimensiune</dt>
                <dd className="text-ink-soft">{s}</dd>
              </div>
            ))}
            {shape.ranges.map((r) => (
              <div key={r.key} className="flex gap-2">
                <dd className="text-ink-soft">
                  {r.label}: {n(r.min)}–{n(r.max)} mm (la milimetru)
                </dd>
              </div>
            ))}
            <div className="sm:col-span-2">
              <dd className="text-ink-soft">
                Toleranță: <strong className="font-semibold text-ink">{tol.value}</strong> – {tol.text}
              </dd>
            </div>
          </dl>

          {/* Pasul 2 – material */}
          <section className="mt-8 rounded-2xl border border-line bg-surface/60 p-5 sm:p-6">
            <p className="eyebrow">Pasul 1 din 2</p>
            <h2 className="mt-1 text-xl font-semibold">Alege materialul</h2>
            <p className="mt-1 text-sm text-muted">
              {shape.materials.length === 1 ? 'Această formă este disponibilă exclusiv din aluminiu.' : 'Alege materialul, apoi finisajul (unde este cazul).'}
            </p>

            <div className={cls('mt-4 grid gap-3', shape.materials.length > 1 ? 'sm:grid-cols-2' : '')}>
              {shape.materials.map((id) => {
                const m = MATERIALS[id];
                const active = material === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setMaterial(active && shape.materials.length > 1 ? null : id)}
                    aria-pressed={active}
                    className={cls('flex items-start gap-3 rounded-xl border bg-white p-4 text-left transition', active ? 'border-brand-gold ring-2 ring-brand-gold/30' : 'border-line hover:border-ink/40')}
                  >
                    <span className="mt-0.5 h-8 w-8 shrink-0 rounded-full border border-black/10 shadow-inner" style={{ background: m.swatch }} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="font-semibold">{m.label}</span>
                        <span className="text-xs text-muted tabular-nums">{m.density} kg/dm³</span>
                      </span>
                      <span className="mt-0.5 block text-xs leading-5 text-muted">{m.description}</span>
                      <span className="mt-1.5 block text-xs font-medium text-ink-soft">≈ {money(pricePerKgRon(id))} / kg</span>
                    </span>
                    {active && <Check className="h-5 w-5 shrink-0 text-brand-gold-dark" />}
                  </button>
                );
              })}
            </div>

            {showFinish && (
              <div className="mt-5">
                <p className="label">Finisaj</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {showFinish.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFinish(f)}
                      aria-pressed={finish === f}
                      className={cls('rounded-lg border px-4 py-2 text-sm font-semibold transition', finish === f ? 'border-ink bg-ink text-white' : 'border-line bg-white hover:border-ink/40')}
                    >
                      {FINISHES[f].label}
                      <span className={cls('ml-2 text-xs font-normal', finish === f ? 'text-white/70' : 'text-muted')}>{FINISHES[f].description}</span>
                    </button>
                  ))}
                </div>
                {finish === 'eloxat' && (
                  <div className="mt-4">
                    <p className="label">Culoare eloxare</p>
                    <div className="mt-2 flex flex-wrap gap-3">
                      {ELOX_COLORS.map((c) => (
                        <button key={c.id} type="button" onClick={() => setColor(c.id)} aria-pressed={color === c.id} className="flex flex-col items-center gap-1 text-xs">
                          <span className={cls('h-10 w-10 rounded-full border-2 shadow-inner', color === c.id ? 'border-ink' : 'border-line')} style={{ background: c.swatch }} />
                          <span className={cls(color === c.id ? 'font-semibold text-ink' : 'text-muted')}>{c.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {mat && (
              <div className="mt-5 grid gap-1 rounded-lg border border-line bg-white px-4 py-3 text-sm sm:grid-cols-2">
                <div className="flex justify-between gap-3">
                  <span className="text-muted">Material</span>
                  <span className="font-medium">{mat.label}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted">Densitate</span>
                  <span className="font-medium">{mat.density} kg/dm³</span>
                </div>
                {showFinish && (
                  <div className="flex justify-between gap-3">
                    <span className="text-muted">Finisaj</span>
                    <span className="font-medium">
                      {FINISHES[finish].label}
                      {finish === 'eloxat' ? ` · ${ELOX_COLORS.find((c) => c.id === color)?.label}` : ''}
                    </span>
                  </div>
                )}
                <div className="flex justify-between gap-3">
                  <span className="text-muted">Preț / kg</span>
                  <span className="font-medium">{money(pricePerKgRon(mat.id))}</span>
                </div>
              </div>
            )}

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button size="lg" onClick={goNext} disabled={!material}>
                Continuă la dimensiuni <ArrowRight className="h-4 w-4" />
              </Button>
              {!material && <span className="text-sm text-muted">Selectează un material pentru a continua.</span>}
            </div>
          </section>

          <Notice className="mt-4">Produsele configurate se realizează conform specificațiilor clientului și nu beneficiază de drept de retur conform OUG 34/2014.</Notice>
        </div>
      </div>
    </div>
  );
}
