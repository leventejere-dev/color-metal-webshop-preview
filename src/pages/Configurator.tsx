import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Info, RotateCcw, ShoppingCart } from 'lucide-react';
import { SHAPE_BY_SLUG, type Shape } from '@/data/shapes';
import { ELOX_COLORS, FINISHES, MATERIALS, type EloxColorId, type FinishId, type MaterialId } from '@/data/materials';
import { OptionGroup } from '@/components/configurator/OptionGroup';
import { ContactConsultant } from '@/components/configurator/ContactConsultant';
import { RangeField } from '@/components/ui/RangeField';
import { QuantityField } from '@/components/ui/QuantityField';
import { ProductPreview } from '@/components/product/ProductPreview';
import { FavoriteButton } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/Button';
import { Breadcrumbs, Notice, SummaryRow } from '@/components/ui/misc';
import { effectiveDims, fieldValues, isAvailable, isComplete, isPlate, rangeBounds, type RangeValues, type Selection } from '@/lib/configurator';
import { dimsLabel, pieceWeightKg } from '@/lib/geometry';
import { computePrice } from '@/lib/pricing';
import { MAX_ONLINE_QTY } from '@/config/pricing';
import { kg, money, n } from '@/lib/format';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

const MATERIAL_FROM_PARAM: Record<string, MaterialId> = { al: 'AL', cu: 'CU', brass: 'BRASS', bronze: 'BRONZE' };

export function ConfiguratorPage() {
  const { slug = '', material: matParam = '' } = useParams();
  const shape = SHAPE_BY_SLUG[slug];
  const materialId = MATERIAL_FROM_PARAM[matParam.toLowerCase()];
  if (!shape) return <Navigate to="/produse" replace />;
  if (!materialId || !shape.materials.includes(materialId)) return <Navigate to={`/produse/${shape.slug}`} replace />;
  return <Configurator shape={shape} materialId={materialId} />;
}

function Configurator({ shape, materialId }: { shape: Shape; materialId: MaterialId }) {
  const [params] = useSearchParams();
  const material = MATERIALS[materialId];
  const finish = (material.finishes.length ? ((params.get('finisaj') as FinishId) || 'natur') : undefined) as FinishId | undefined;
  const eloxColor = finish === 'eloxat' ? ((params.get('culoare') as EloxColorId) || 'natur') : undefined;
  const { add } = useCart();
  const { toast } = useToast();

  // ---- stare configurator: nimic preselectat
  const [sel, setSel] = useState<Selection>({});
  const [ranges, setRanges] = useState<RangeValues>({});
  const [qty, setQty] = useState(1);
  const [notices, setNotices] = useState<Record<string, string>>({});

  const resetAll = useCallback(() => {
    setSel({});
    setRanges({});
    setNotices({});
  }, []);

  // reset când se schimbă produsul
  useEffect(() => {
    resetAll();
    setQty(1);
  }, [shape.id, materialId, resetAll]);

  const bounds = useMemo(() => Object.fromEntries(shape.ranges.map((r) => [r.key, rangeBounds(shape, r, sel)])) as Record<'length', { min: number; max: number }>, [shape, sel]);

  // La plăci: dacă formatul ales (lățime/grosime) restrânge lungimea maximă, lungimea se ajustează automat + mesaj.
  useEffect(() => {
    setRanges((prev) => {
      const v = prev.length;
      const b = bounds.length;
      if (!b || v == null || v <= b.max) return prev;
      setNotices((m) => ({ ...m, length: `Lungimea a fost ajustată la maximul disponibil (${n(b.max)} mm) pentru formatul selectat.` }));
      return { ...prev, length: b.max };
    });
  }, [bounds]);

  // La plăci: dacă lungimea aleasă face incompatibilă o selecție discretă → se deselectează + mesaj.
  useEffect(() => {
    if (!isPlate(shape)) return;
    setSel((prev) => {
      let changed = false;
      const next = { ...prev };
      for (const f of shape.fields) {
        const v = prev[f.key];
        if (v != null && !isAvailable(shape, f.key, v, { ...prev, [f.key]: undefined }, ranges)) {
          next[f.key] = undefined;
          changed = true;
          setNotices((m) => ({ ...m, [f.key]: 'Opțiunea nu este disponibilă pentru dimensiunea selectată și a fost deselectată.' }));
        }
      }
      return changed ? next : prev;
    });
  }, [ranges, shape]);

  const select = useCallback((key: string, value: number | undefined) => {
    setSel((s) => ({ ...s, [key]: value }));
    setNotices((m) => ({ ...m, [key]: '' }));
  }, []);

  const setLength = useCallback((value: number | null) => {
    setRanges((r) => ({ ...r, length: value }));
    setNotices((m) => ({ ...m, length: '' }));
  }, []);

  const complete = isComplete(shape, sel, ranges);
  const dims = effectiveDims(shape, sel);
  const lengthMm = ranges.length ?? 0;
  const unitWeight = complete ? Math.round(pieceWeightKg(shape.id, dims, lengthMm, material.density) * 1000) / 1000 : 0;
  const price = computePrice(materialId, unitWeight, qty);
  const overLimit = qty > MAX_ONLINE_QTY;
  const canAdd = complete && !overLimit && unitWeight > 0;
  const anySelection = Object.values(sel).some((v) => v != null) || ranges.length != null;

  const configLabel = complete
    ? `${shape.name} ${material.label}${finish ? ` (${FINISHES[finish].label}${eloxColor ? ` ${ELOX_COLORS.find((c) => c.id === eloxColor)?.label}` : ''})` : ''} – ${dimsLabel(shape, dims, { length: lengthMm })}`
    : `${shape.name} ${material.label}`;

  const addToCart = () => {
    if (!canAdd) return;
    add({
      shapeId: shape.id,
      materialId,
      finish,
      eloxColor,
      dims,
      length: lengthMm,
      quantity: qty,
      unitWeightKg: unitWeight,
      pricePerKgRon: price.pricePerKgRon,
      unitNetRon: price.unitNetRon,
      label: configLabel,
    });
    toast('Produsul a fost adăugat în coș.', { cta: { label: 'Vezi coșul', to: '/cos' } });
  };

  const offerMessage = `Solicit ofertă pentru: ${configLabel}, cantitate: ${qty} buc.`;

  return (
    <div className="container-cm py-6 sm:py-8">
      <Breadcrumbs items={[{ label: 'Produse', to: '/produse' }, { label: shape.name, to: `/produse/${shape.slug}` }, { label: 'Dimensiuni' }]} />
      <Link to={`/produse/${shape.slug}`} className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Înapoi la material
      </Link>

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold sm:text-3xl">
            {shape.name} <span className="text-muted">· {material.label}</span>
          </h1>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-line bg-white px-3 py-1">
              Formă: <strong>{shape.name}</strong>
            </span>
            <span className="rounded-full border border-line bg-white px-3 py-1">
              Material: <strong>{material.label}</strong>
            </span>
            {finish && (
              <span className="rounded-full border border-line bg-white px-3 py-1">
                Finisaj: <strong>{FINISHES[finish].label}{eloxColor ? ` · ${ELOX_COLORS.find((c) => c.id === eloxColor)?.label}` : ''}</strong>
              </span>
            )}
            <Link to={`/produse/${shape.slug}`} className="rounded-full border border-dashed border-line px-3 py-1 text-brand-bronze hover:border-brand-bronze">
              Schimbă materialul
            </Link>
          </div>
        </div>
        <FavoriteButton slug={shape.slug} name={shape.name} className="shrink-0" />
      </div>
      <p className="mt-3 text-sm text-muted">Sistemul permite doar combinații reale din baza de produse.</p>

      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-8">
        {/* ---------------- stânga */}
        <div className="space-y-4">
          <div className="max-w-sm">
            <ProductPreview shape={shape} photoSlots />
          </div>

          <div className="flex items-center justify-between">
            <p className="label">Dimensiuni</p>
            <button type="button" onClick={resetAll} disabled={!anySelection} className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold text-muted hover:bg-surface hover:text-ink disabled:opacity-40">
              <RotateCcw className="h-3.5 w-3.5" /> Deselectează
            </button>
          </div>

          {shape.fields.map((f) => (
            <div key={f.key}>
              <OptionGroup label={f.label} symbol={f.symbol} hint={f.hint} values={fieldValues(shape, f.key)} selected={sel[f.key]} isAvailable={(v) => isAvailable(shape, f.key, v, sel, ranges)} onSelect={(v) => select(f.key, v)} />
              {notices[f.key] && (
                <p className="mt-2 flex items-start gap-1.5 text-xs font-medium text-warning-ink">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {notices[f.key]}
                </p>
              )}
            </div>
          ))}

          {shape.ranges.map((r) => (
            <RangeField key={r.key} label={r.label} symbol={shape.category === 'profil' ? 'L' : 'l'} value={ranges.length ?? null} min={bounds.length.min} max={bounds.length.max} step={r.step} presets={r.presets} notice={notices.length || null} onChange={setLength} />
          ))}

          {/* Cantitate */}
          <div className="rounded-xl border border-line bg-white p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="label">
                Cantitate <span className="font-normal text-muted">({shape.unitLabel})</span>
              </p>
              <QuantityField value={qty} onChange={setQty} min={1} max={9999} />
            </div>
            {overLimit && (
              <div className="mt-4 rounded-lg border border-brand-gold/50 bg-warning-bg p-4">
                <p className="text-sm font-semibold text-warning-ink">Pentru cantități mai mari de {MAX_ONLINE_QTY} bucăți, vă rugăm să contactați un consultant.</p>
                <div className="mt-3">
                  <ContactConsultant subject={`Ofertă cantitate mare – ${shape.name} ${material.label}`} message={offerMessage} />
                </div>
              </div>
            )}
          </div>

          <Notice className="text-xs">Produsele personalizate nu beneficiază de drept de retur conform OUG 34/2014.</Notice>
        </div>

        {/* ---------------- dreapta: Calcul */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-5 sm:p-6">
            <h2 className="text-lg font-semibold">Calcul</h2>
            <p className="mt-0.5 text-xs text-muted">{complete ? configLabel : 'Selectează toate dimensiunile pentru calculul prețului.'}</p>
            <div className="mt-4 divide-y divide-line">
              <SummaryRow label="Greutate / bucată" value={complete ? kg(price.unitWeightKg) : '—'} />
              <SummaryRow label="Greutate totală" value={complete ? kg(price.totalWeightKg) : '—'} />
              <SummaryRow label="Preț / kg" value={money(price.pricePerKgRon)} />
              <SummaryRow label="Preț / bucată (fără TVA)" value={complete ? money(price.unitNetRon) : '—'} />
              <SummaryRow label="Total fără TVA" value={complete ? money(price.netRon) : '—'} />
              <SummaryRow label="TVA 21%" value={complete ? money(price.vatRon) : '—'} />
              <SummaryRow label="Total cu TVA" value={complete ? money(price.grossRon) : '—'} strong className="pt-3 text-base" />
            </div>

            <div className="mt-5">
              <Button size="lg" full onClick={addToCart} disabled={!canAdd}>
                <ShoppingCart className="h-4 w-4" /> Adaugă în coș
              </Button>
            </div>
            {!complete && (
              <p className="mt-3 text-xs text-muted">
                Lipsesc: {[...shape.fields.filter((f) => sel[f.key] == null).map((f) => f.label.toLowerCase()), ...shape.ranges.filter((r) => ranges[r.key] == null).map((r) => r.label.toLowerCase())].join(', ')}.
              </p>
            )}
            {overLimit && <p className="mt-3 text-xs font-medium text-warning-ink">Peste {MAX_ONLINE_QTY} buc comanda se face prin consultant.</p>}
            <p className="mt-4 text-[11px] leading-5 text-muted">Prețurile afișate pot fi actualizate până la finalizarea comenzii. Costul transportului se calculează în funcție de greutate și destinație.</p>
          </div>
        </aside>
      </div>

    </div>
  );
}
