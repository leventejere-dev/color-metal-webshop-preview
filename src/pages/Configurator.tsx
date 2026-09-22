import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Info, ShoppingCart, FileText, Ruler } from 'lucide-react';
import { SHAPE_BY_SLUG, TOLERANCES, type Shape } from '@/data/shapes';
import { ELOX_COLORS, FINISHES, MATERIALS, type EloxColorId, type FinishId, type MaterialId } from '@/data/materials';
import { OptionGroup } from '@/components/configurator/OptionGroup';
import { ContactConsultant } from '@/components/configurator/ContactConsultant';
import { RangeField } from '@/components/ui/RangeField';
import { QuantityField } from '@/components/ui/QuantityField';
import { TechPreview } from '@/components/product/TechPreview';
import { FavoriteButton } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Breadcrumbs, Notice, SummaryRow } from '@/components/ui/misc';
import { effectiveDims, fieldValues, isAvailable, isComplete, isPlate, rangeBounds, type RangeValues, type Selection } from '@/lib/configurator';
import { dimsLabel, pieceWeightKg } from '@/lib/geometry';
import { computePrice } from '@/lib/pricing';
import { MAX_ONLINE_QTY } from '@/config/pricing';
import { asset, kg, money, n } from '@/lib/format';
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
  const navigate = useNavigate();
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
  const [offerOpen, setOfferOpen] = useState(false);

  // reset când se schimbă produsul
  useEffect(() => {
    setSel({});
    setRanges({});
    setQty(1);
    setNotices({});
  }, [shape.id, materialId]);

  const bounds = useMemo(() => Object.fromEntries(shape.ranges.map((r) => [r.key, rangeBounds(shape, r, sel)])) as Record<'length' | 'width', { min: number; max: number }>, [shape, sel]);

  // Dacă o selecție discretă (ex. grosimea plăcii) restrânge intervalul, valoarea continuă se ajustează automat + mesaj.
  useEffect(() => {
    setRanges((prev) => {
      let changed = false;
      const next = { ...prev };
      const msgs: Record<string, string> = {};
      for (const r of shape.ranges) {
        const v = prev[r.key];
        const b = bounds[r.key];
        if (v != null && v > b.max) {
          next[r.key] = b.max;
          msgs[r.key] = `Valoarea a fost ajustată la maximul disponibil (${n(b.max)} mm) pentru grosimea selectată.`;
          changed = true;
        }
      }
      if (changed) setNotices((m) => ({ ...m, ...msgs }));
      return changed ? next : prev;
    });
  }, [bounds, shape.ranges]);

  // Dacă o valoare continuă (lățime/lungime la plăci) face incompatibilă grosimea selectată → se deselectează + mesaj.
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

  const setRange = useCallback((key: 'length' | 'width', value: number | null) => {
    setRanges((r) => ({ ...r, [key]: value }));
    setNotices((m) => ({ ...m, [key]: '' }));
  }, []);

  const complete = isComplete(shape, sel, ranges);
  const dims = effectiveDims(shape, sel, ranges);
  const lengthMm = ranges.length ?? 0;
  const unitWeight = complete ? Math.round(pieceWeightKg(shape.id, dims, lengthMm, material.density) * 1000) / 1000 : 0;
  const price = computePrice(materialId, unitWeight, qty);
  const overLimit = qty > MAX_ONLINE_QTY;
  const canAdd = complete && !overLimit && unitWeight > 0;
  const tol = TOLERANCES[shape.tolerance];

  const configLabel = complete
    ? `${shape.name} ${material.label}${finish ? ` (${FINISHES[finish].label}${eloxColor ? ` ${ELOX_COLORS.find((c) => c.id === eloxColor)?.label}` : ''})` : ''} – ${dimsLabel(shape, dims, { length: lengthMm, width: ranges.width ?? undefined })}`
    : `${shape.name} ${material.label}`;

  const addToCart = () => {
    if (!canAdd) return;
    add({
      shapeId: shape.id,
      materialId,
      finish,
      eloxColor,
      dims: Object.fromEntries(shape.fields.map((f) => [f.key, sel[f.key] as number])),
      length: lengthMm,
      width: isPlate(shape) ? (ranges.width as number) : undefined,
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
    <div className="container-cm py-8">
      <Breadcrumbs items={[{ label: 'Produse', to: '/produse' }, { label: shape.name, to: `/produse/${shape.slug}` }, { label: 'Configurator' }]} />
      <Link to={`/produse/${shape.slug}`} className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Înapoi la material
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="eyebrow">Pasul 2 din 2 · Dimensiuni</p>
          <div className="mt-1 flex items-start justify-between gap-3">
            <h1 className="text-2xl font-semibold sm:text-3xl">
              {shape.name} <span className="text-muted">· {material.label}</span>
            </h1>
            <FavoriteButton slug={shape.slug} name={shape.name} className="shrink-0" />
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-line bg-white px-3 py-1">Formă: <strong>{shape.name}</strong></span>
            <span className="rounded-full border border-line bg-white px-3 py-1">Material: <strong>{material.label}</strong></span>
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
      </div>
      <p className="mt-3 text-sm text-muted">Sistemul permite doar combinații reale din baza de produse. Opțiunile incompatibile cu selecția curentă rămân vizibile, dar estompate.</p>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)]">
        {/* ---------------- stânga */}
        <div className="space-y-4">
          <div className="card grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
            <TechPreview shape={shape} dims={dims} width={ranges.width ?? null} />
            <figure className="flex flex-col">
              <div className="flex min-h-[200px] flex-1 items-center justify-center rounded-xl bg-white p-3">
                <img src={asset(shape.images.tech)} alt={`Ilustrație tehnică oficială – ${shape.name}`} className="max-h-52 w-full object-contain" />
              </div>
              <figcaption className="mt-2 text-center text-xs text-muted">Ilustrație tehnică – notațiile dimensiunilor (calculatorul de greutate Color Metal)</figcaption>
            </figure>
            <p className="text-xs text-muted sm:col-span-2">Previzualizare tehnică live – forma urmărește dimensiunile principale. Fotografiile produsului aparțin formei și nu se schimbă cu dimensiunile.</p>
          </div>

          {shape.fields.map((f) => (
            <div key={f.key}>
              <OptionGroup
                label={f.label}
                hint={f.hint}
                values={fieldValues(shape, f.key)}
                selected={sel[f.key]}
                isAvailable={(v) => isAvailable(shape, f.key, v, sel, ranges)}
                onSelect={(v) => select(f.key, v)}
              />
              {notices[f.key] && (
                <p className="mt-2 flex items-start gap-1.5 text-xs font-medium text-warning-ink">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {notices[f.key]}
                </p>
              )}
            </div>
          ))}

          {shape.ranges.map((r) => (
            <RangeField
              key={r.key}
              label={r.label}
              value={ranges[r.key] ?? null}
              min={bounds[r.key].min}
              max={bounds[r.key].max}
              step={r.step}
              presets={r.presets}
              hint={r.key === 'length' ? 'Introdu lungimea la milimetru sau folosește slider-ul / valorile uzuale.' : 'Lățimea se debitează din formatul de stoc.'}
              notice={notices[r.key] || null}
              onChange={(v) => setRange(r.key, v)}
            />
          ))}

          {/* Toleranță */}
          <div className="flex gap-3 rounded-xl border border-brand-gold/40 bg-brand-gold-light/60 p-4 text-sm">
            <Ruler className="mt-0.5 h-5 w-5 shrink-0 text-brand-gold-dark" />
            <div>
              <p className="font-semibold text-ink">{tol.title}</p>
              <p className="mt-0.5 text-ink-soft">{tol.text}</p>
            </div>
          </div>

          {/* Cantitate */}
          <div className="rounded-xl border border-line bg-white p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="label">
                  Cantitate <span className="font-normal text-muted">({shape.unitLabel})</span>
                </p>
                <p className="mt-0.5 text-xs text-muted">Introdu numărul de bucăți solicitate. Comandă online: maximum {MAX_ONLINE_QTY} buc.</p>
              </div>
              <QuantityField value={qty} onChange={setQty} min={1} max={9999} />
            </div>
            {overLimit && (
              <div className="mt-4 rounded-lg border border-brand-gold/50 bg-warning-bg p-4">
                <p className="text-sm font-semibold text-warning-ink">Pentru cantități mai mari de {MAX_ONLINE_QTY} bucăți, vă rugăm să contactați un consultant.</p>
                <p className="mt-1 text-xs text-warning-ink/90">Un consultant Color Metal vă pregătește o ofertă personalizată, cu preț și termen de livrare.</p>
                <div className="mt-3">
                  <ContactConsultant subject={`Ofertă cantitate mare – ${shape.name} ${material.label}`} message={offerMessage} />
                </div>
              </div>
            )}
          </div>

          <Notice>Produsele personalizate nu beneficiază de drept de retur conform OUG 34/2014.</Notice>
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

            <div className="mt-5 space-y-2">
              <Button size="lg" full onClick={addToCart} disabled={!canAdd}>
                <ShoppingCart className="h-4 w-4" /> Adaugă în coș
              </Button>
              <Button size="lg" full variant="secondary" onClick={() => setOfferOpen(true)}>
                <FileText className="h-4 w-4" /> Cere ofertă
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

      <Modal open={offerOpen} onClose={() => setOfferOpen(false)} title="Cere ofertă">
        <p className="text-sm text-ink-soft">Trimite configurația către echipa de vânzări Color Metal. Un consultant îți răspunde cu o ofertă personalizată.</p>
        <div className="mt-4 rounded-lg bg-surface p-4 text-sm">
          <p className="font-semibold">{shape.name} · {material.label}</p>
          <p className="mt-1 text-muted">{complete ? dimsLabel(shape, dims, { length: lengthMm, width: ranges.width ?? undefined }) : 'Dimensiuni: neselectate încă'}</p>
          <p className="mt-1 text-muted">Cantitate: {qty} {shape.unitLabel}</p>
        </div>
        <div className="mt-4">
          <ContactConsultant subject={`Cerere ofertă – ${shape.name} ${material.label}`} message={offerMessage} />
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setOfferOpen(false)}>
            Închide
          </Button>
          <Button onClick={() => navigate('/contact')}>Formular de contact</Button>
        </div>
      </Modal>
    </div>
  );
}
