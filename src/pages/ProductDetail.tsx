import { useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { CATEGORIES, SHAPE_BY_SLUG } from '@/data/shapes';
import { ELOX_COLORS, FINISHES, MATERIALS, SURFACES, SURFACE_BY_ID, type EloxColorId, type FinishId, type MaterialId, type SurfaceId } from '@/data/materials';
import { ProductPreview } from '@/components/product/ProductPreview';
import { FavoriteButton } from '@/components/product/ProductCard';
import { Breadcrumbs, Notice } from '@/components/ui/misc';
import { Button } from '@/components/ui/Button';
import { fieldValues } from '@/lib/configurator';
import { cls, n } from '@/lib/format';

/** `slug`/`only` sunt folosite de rutele fixe (ex. placa groasă din cupru sau alamă). */
export function ProductDetailPage({ slug: fixedSlug, only }: { slug?: string; only?: MaterialId[] } = {}) {
  const params = useParams();
  const slug = fixedSlug ?? params.slug ?? '';
  const base = SHAPE_BY_SLUG[slug];
  const shape = base && only ? { ...base, materials: base.materials.filter((m) => only.includes(m)) } : base;
  const navigate = useNavigate();
  // ca în webshopul actual: primul material (aluminiu) este preselectat; toate opțiunile sunt vizibile de la început
  const [material, setMaterial] = useState<MaterialId>(shape?.materials[0] ?? 'AL');
  // ruta restrânsă (cupru/alamă) pornește de la primul material permis
  const [finish, setFinish] = useState<FinishId>('natur');
  const [color, setColor] = useState<EloxColorId>('natur');
  const [surface, setSurface] = useState<SurfaceId>('lisa');

  const dimsSummary = useMemo(() => {
    if (!shape) return '';
    const parts = shape.fields.map((f) => {
      const vals = fieldValues(shape, f.key);
      return `${f.label} ${n(vals[0])}–${n(vals[vals.length - 1])} mm`;
    });
    for (const r of shape.ranges) parts.push(`${r.label} ${n(r.min)}–${n(r.max)} mm`);
    return parts.join(' · ');
  }, [shape]);

  if (!shape) return <Navigate to="/produse" replace />;

  const mat = MATERIALS[material];
  // tabla are suprafețe (lisă, stucco, striată) în locul finisajului natur/eloxat
  const hasSurfaces = Boolean(shape?.surfaces);
  const hasFinish = !hasSurfaces && shape.materials.includes('AL');
  const finishEnabled = mat.finishes.length > 0;
  const colorEnabled = finishEnabled && finish === 'eloxat';
  const category = CATEGORIES.find((c) => c.id === shape.category)?.label ?? '';

  const goNext = () => {
    const params = new URLSearchParams();
    if (hasSurfaces) params.set('suprafata', surface);
    if (finishEnabled) {
      params.set('finisaj', finish);
      if (finish === 'eloxat') params.set('culoare', color);
    }
    navigate(`/configurator/${shape.slug}/${material.toLowerCase()}${params.toString() ? `?${params}` : ''}`);
  };

  const subtitle = hasSurfaces
    ? SURFACE_BY_ID[surface].label
    : finishEnabled
      ? `${FINISHES[finish].label}${finish === 'eloxat' ? ` · ${ELOX_COLORS.find((c) => c.id === color)?.label ?? ''}` : ''}`
      : 'Fără tratament de suprafață';

  return (
    <div className="container-cm py-6 sm:py-8">
      <Breadcrumbs items={[{ label: 'Produse', to: '/produse' }, { label: shape.name }]} />
      <Link to="/produse" className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Înapoi la produse
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">{category}</p>
          <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">
            {shape.name} <span className="font-normal text-muted">· {shape.short}</span>
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-ink-soft">{shape.description}</p>
          <p className="mt-1 text-xs text-muted">{dimsSummary}</p>
        </div>
        <FavoriteButton slug={shape.slug} name={shape.name} className="shrink-0" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-8">
        {/* ---- stânga: material, finisaj, culoare (toate vizibile de la început) */}
        <section className="card p-5 sm:p-6">
          <h2 className="text-xl font-semibold">Alege materialul</h2>

          <div className={cls('mt-4 grid gap-3', shape.materials.length > 1 ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3')}>
            {shape.materials.map((id) => {
              const m = MATERIALS[id];
              const active = material === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setMaterial(id);
                    // relieful (stucco, striată) se execută doar pe aluminiu
                    if (hasSurfaces && id !== 'AL') setSurface('lisa');
                  }}
                  aria-pressed={active}
                  className={cls('flex flex-col items-center gap-2 rounded-xl border bg-white px-3 py-4 text-center transition', active ? 'border-brand-gold ring-2 ring-brand-gold/30' : 'border-line hover:border-ink/40')}
                >
                  <span className="h-9 w-9 rounded-full border border-black/10 shadow-inner" style={{ background: m.swatch }} />
                  <span className="text-sm font-semibold">{m.label}</span>
                  <span className="text-xs text-muted tabular-nums">{m.density} kg/dm³</span>
                  {active && <Check className="h-4 w-4 text-brand-gold-dark" />}
                </button>
              );
            })}
          </div>

          {hasSurfaces && (
            <div className="mt-6">
              <p className="label">Finisaj</p>
              <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Finisaj">
                {SURFACES.map((sf) => {
                  const available = !sf.alOnly || material === 'AL';
                  const active = available && surface === sf.id;
                  return (
                    <button
                      key={sf.id}
                      type="button"
                      aria-pressed={active}
                      aria-disabled={!available}
                      title={available ? sf.note : 'Disponibil doar în aluminiu.'}
                      onClick={() => available && setSurface(sf.id)}
                      className={cls(
                        'h-10 rounded-lg border px-4 text-sm font-semibold uppercase tracking-wide transition',
                        active && 'border-ink bg-ink text-white',
                        !active && available && 'border-line bg-white hover:border-ink/40',
                        !available && 'cursor-not-allowed border-dashed border-line/80 bg-surface text-muted/50',
                      )}
                    >
                      {sf.label}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-muted">{SURFACE_BY_ID[surface].note}</p>
            </div>
          )}

          {hasFinish && (
            <div className={cls('mt-6 grid gap-5 sm:grid-cols-2', !finishEnabled && 'opacity-50')}>
              <div>
                <p className="label">
                  Finisaj {!finishEnabled && <span className="text-xs font-normal text-muted">– doar pentru aluminiu</span>}
                </p>
                <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Finisaj">
                  {(['natur', 'eloxat'] as FinishId[]).map((f) => (
                    <button
                      key={f}
                      type="button"
                      disabled={!finishEnabled}
                      onClick={() => setFinish(f)}
                      aria-pressed={finishEnabled && finish === f}
                      className={cls(
                        'h-10 rounded-lg border px-4 text-sm font-semibold transition disabled:cursor-not-allowed',
                        finishEnabled && finish === f ? 'border-ink bg-ink text-white' : 'border-line bg-white hover:border-ink/40',
                      )}
                    >
                      {FINISHES[f].label}
                    </button>
                  ))}
                </div>
              </div>
              {colorEnabled && (
              <div>
                <p className="label">Culoare</p>
                <div className="mt-2 flex flex-wrap gap-3" role="group" aria-label="Culoare eloxare">
                  {ELOX_COLORS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setColor(c.id)}
                      aria-pressed={color === c.id}
                      className="flex flex-col items-center gap-1 text-xs"
                    >
                      <span className={cls('h-9 w-9 rounded-full border-2 shadow-inner', color === c.id ? 'border-ink' : 'border-line')} style={{ background: c.swatch }} />
                      <span className={cls(color === c.id ? 'font-semibold text-ink' : 'text-muted')}>{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              )}
            </div>
          )}

          <div className="mt-6 max-w-sm space-y-1 rounded-lg border border-line bg-surface/60 px-4 py-3 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-muted">Material</span>
              <span className="font-medium">{mat.label}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-muted">Densitate</span>
              <span className="font-medium">{mat.density} kg/dm³</span>
            </div>
            {hasSurfaces && (
              <div className="flex justify-between gap-3">
                <span className="text-muted">Finisaj</span>
                <span className="font-medium">{SURFACE_BY_ID[surface].label}</span>
              </div>
            )}
            {hasFinish && (
              <>
                <div className="flex justify-between gap-3">
                  <span className="text-muted">Finisaj</span>
                  <span className="font-medium">{finishEnabled ? FINISHES[finish].label : '–'}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted">Culoare</span>
                  <span className="font-medium">{colorEnabled ? ELOX_COLORS.find((c) => c.id === color)?.label : '–'}</span>
                </div>
              </>
            )}
          </div>

          <div className="mt-5">
            <Button size="lg" onClick={goNext}>
              Continuă la dimensiuni <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </section>

        {/* ---- dreapta: previzualizare mică, ca în webshopul actual */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <ProductPreview shape={shape} material={material} elox={colorEnabled ? color : undefined} surface={hasSurfaces ? surface : undefined} gallery title={`${shape.name} · ${mat.label}`} subtitle={subtitle} />
          <Notice className="mt-4 text-xs">Produsele configurate se realizează conform specificațiilor clientului și nu beneficiază de drept de retur (OUG 34/2014).</Notice>
        </aside>
      </div>
    </div>
  );
}
