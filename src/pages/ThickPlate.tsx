import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Info, ShoppingCart } from 'lucide-react';
import { SHAPE_BY_SLUG } from '@/data/shapes';
import { ALLOY_BY_ID, BETA_ALLOYS, BETA_FORMAT, BETA_THICKNESSES, plateSku, plateWeightKg } from '@/data/betashop';
import { ProductPreview } from '@/components/product/ProductPreview';
import { FavoriteButton } from '@/components/product/ProductCard';
import { ContactConsultant } from '@/components/configurator/ContactConsultant';
import { QuantityField } from '@/components/ui/QuantityField';
import { Button } from '@/components/ui/Button';
import { Breadcrumbs, Notice, SummaryRow } from '@/components/ui/misc';
import { Select } from '@/components/ui/Field';
import { EUR_TO_RON, MARKUP, MAX_ONLINE_QTY, VAT_RATE } from '@/config/pricing';
import { round2 } from '@/lib/pricing';
import { cls, kg, money, n } from '@/lib/format';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

const SHAPE = SHAPE_BY_SLUG['placa-groasa'];

/* ------------------------------------------------------------------ cele două drumuri */

const ROUTES = [
  {
    to: '/alushop',
    name: 'AluShop',
    kicker: 'Promoție',
    text: 'Bucăți unice de aluminiu rămase în urma proceselor de debitare. Dimensiuni unicate, disponibile în limita stocului, la preț promoțional – fiecare placă se comandă o singură dată.',
  },
  {
    to: '/produse/placa-groasa/configurator',
    name: 'BetaShop',
    kicker: 'Configurator',
    text: 'Alegi aliajul, grosimea, lungimea și lățimea, iar noi debităm placa exact după nevoile tale, din formatul standard. Prețul se calculează pe loc.',
  },
];

/** Pagina plăcilor groase: de aici se alege între promoția din stoc și configurarea pe dimensiune. */
export function ThickPlateHubPage() {
  return (
    <div className="container-cm py-6 sm:py-8">
      <Breadcrumbs items={[{ label: 'Produse', to: '/produse' }, { label: SHAPE.name }]} />
      <Link to="/produse" className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Înapoi la produse
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Plăci și table</p>
          <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">
            {SHAPE.name} <span className="font-normal text-muted">· {SHAPE.short}</span>
          </h1>
          <p className="mt-2 max-w-2xl text-[15px] leading-6 text-muted">
            Plăci groase din aluminiu, în două feluri: bucăți gata debitate, la preț promoțional, sau plăci tăiate exact la
            dimensiunea ta. Alege mai jos.
          </p>
        </div>
        <FavoriteButton slug={SHAPE.slug} name={SHAPE.name} className="shrink-0" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-8">
        {/* două butoane, iar sub fiecare explicația pe un panou de sticlă */}
        <div className="relative isolate">
          <span className="pointer-events-none absolute -left-16 -top-10 -z-10 h-64 w-64 rounded-full bg-brand-gold/40 blur-3xl cm-aura" />
          <span className="pointer-events-none absolute -right-12 top-6 -z-10 h-72 w-72 rounded-full bg-brand-bronze/30 blur-3xl cm-aura cm-delayed" />
          <span className="pointer-events-none absolute bottom-0 left-1/3 -z-10 h-48 w-64 rounded-full bg-brand-gold/25 blur-3xl cm-aura" />

          <div className="grid gap-5 sm:grid-cols-2">
            {ROUTES.map(({ to, kicker, name, text }, i) => (
              <div key={to} className="flex h-full flex-col gap-3">
                <Link
                  to={to}
                  className="group relative isolate flex h-16 items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-br from-brand-gold to-brand-gold-dark text-white shadow-[0_10px_26px_-10px_rgba(179,139,52,.75)] ring-1 ring-brand-gold-dark/30 transition duration-300 hover:-translate-y-0.5 hover:from-brand-gold-dark hover:to-brand-bronze hover:shadow-[0_16px_34px_-12px_rgba(179,139,52,.85)] sm:h-[72px]"
                >
                  <span className={cls('pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/55 to-transparent cm-sheen', i === 1 && 'cm-delayed')} />
                  <span className="text-lg font-extrabold uppercase tracking-[0.18em] [text-shadow:0_1px_2px_rgba(0,0,0,.3)] sm:text-xl">{name}</span>
                  <ArrowRight className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>

                <div className="flex-1 rounded-xl border border-white/70 bg-white/55 p-5 shadow-[0_10px_34px_-16px_rgba(20,20,20,.45)] backdrop-blur-xl">
                  <p className="eyebrow">{kicker}</p>
                  <p className="mt-2 text-[13px] leading-6 text-ink-soft">{text}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-sm text-muted">
            Plăcile din AluShop și BetaShop sunt din aluminiu. Ai nevoie de{' '}
            <Link to="/produse/placa-groasa/material" className="font-semibold text-brand-bronze hover:underline">
              placă groasă din cupru sau alamă
            </Link>
            ?
          </p>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <ProductPreview shape={SHAPE} gallery title={SHAPE.name} subtitle="Aluminiu · grosimi 8–150 mm" />
          <Notice className="mt-4 text-xs">
            Plăcile din promoție sunt bucăți unice, disponibile în limita stocului. Plăcile configurate se debitează la
            comandă și nu beneficiază de drept de retur (OUG 34/2014).
          </Notice>
        </aside>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ configuratorul (BetaShop) */

const pricePerKg = (basePriceEurPerKg: number) => round2(basePriceEurPerKg * (1 + MARKUP) * EUR_TO_RON);

/** Configuratorul de plăci groase: aliaj + grosime din listă, lungimea și lățimea tastate. */
export function ThickPlateConfiguratorPage() {
  const { add } = useCart();
  const { toast } = useToast();

  const [alloyId, setAlloyId] = useState('');
  const [thickness, setThickness] = useState<number | ''>('');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [qty, setQty] = useState(1);
  const [corrected, setCorrected] = useState<string | null>(null);

  const alloy = alloyId ? ALLOY_BY_ID[alloyId] : undefined;
  const len = Number(length);
  const wid = Number(width);
  const complete = Boolean(alloy && thickness && len >= BETA_FORMAT.min && wid >= BETA_FORMAT.min);

  const price = useMemo(() => {
    if (!complete || !alloy || !thickness) return null;
    const unitWeightKg = round2(plateWeightKg(len, wid, thickness) * 1000) / 1000;
    const perKg = pricePerKg(alloy.basePriceEurPerKg);
    const unitNet = round2(unitWeightKg * perKg);
    const net = round2(unitNet * qty);
    const vat = round2(net * VAT_RATE);
    return { unitWeightKg, perKg, unitNet, net, vat, gross: round2(net + vat), totalWeightKg: round2(unitWeightKg * qty * 1000) / 1000 };
  }, [complete, alloy, thickness, len, wid, qty]);

  const sku = complete && alloy && thickness ? plateSku(alloy, thickness, len, wid) : '';
  const overLimit = qty > MAX_ONLINE_QTY;
  const canAdd = complete && !overLimit;

  /** ca în sistemul actual: valorile peste formatul standard sunt corectate automat */
  const clamp = (raw: string, max: number, what: string) => {
    const v = Number(raw);
    if (!raw) return '';
    if (v > max) {
      setCorrected(`${what} a fost corectată la maximul disponibil, ${n(max)} mm.`);
      return String(max);
    }
    setCorrected(null);
    return raw;
  };

  const addToCart = () => {
    if (!canAdd || !alloy || !thickness || !price) return;
    add({
      shapeId: 'thick_plate',
      materialId: 'AL',
      dims: { width: wid, thickness },
      length: len,
      quantity: qty,
      unitWeightKg: price.unitWeightKg,
      pricePerKgRon: price.perKg,
      unitNetRon: price.unitNet,
      label: `Placă groasă ${alloy.label} – ${n(len)} × ${n(wid)} × ${thickness} mm`,
      sku,
      alloy: alloy.label,
      source: 'betashop',
    });
    toast('Placa configurată a fost adăugată în coș.', { cta: { label: 'Vezi coșul', to: '/cos' } });
  };

  const numberField = (label: string, symbol: string, value: string, onChange: (v: string) => void, max: number) => (
    <div>
      <label className="label">
        {label}
        <span className="ml-1.5 rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-ink-soft" title="Notația din desen">
          {symbol}
        </span>{' '}
        <span className="font-normal text-muted">(mm)</span>
      </label>
      <input
        type="number"
        inputMode="numeric"
        min={BETA_FORMAT.min}
        max={max}
        value={value}
        onChange={(e) => onChange(clamp(e.target.value, max, label))}
        placeholder={`${BETA_FORMAT.min}–${n(max)}`}
        className="input mt-2 tabular-nums"
      />
    </div>
  );

  return (
    <div className="container-cm py-6 sm:py-8">
      <Breadcrumbs items={[{ label: 'Produse', to: '/produse' }, { label: SHAPE.name, to: '/produse/placa-groasa' }, { label: 'Configurator' }]} />
      <Link to="/produse/placa-groasa" className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Înapoi
      </Link>

      <p className="eyebrow">Configurator</p>
      <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">Configurează placa dorită</h1>
      <p className="mt-2 max-w-2xl text-[15px] leading-6 text-muted">
        Alege aliajul și grosimea, apoi tastează lungimea și lățimea. Placa se debitează din formatul standard de{' '}
        {BETA_FORMAT.sheet}, la dimensiunea cerută de tine.
      </p>

      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-8">
        {/* ---------------- stânga: configurarea */}
        <div className="space-y-4">
          <div className="max-w-sm">
            <ProductPreview shape={SHAPE} dims gallery />
          </div>

          <div className="rounded-xl border border-line bg-white p-4 sm:p-5">
            <Select label="Aliaj" value={alloyId} onChange={(e) => setAlloyId(e.target.value)}>
              <option value="">– Selectează aliajul –</option>
              {BETA_ALLOYS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label}
                </option>
              ))}
            </Select>
            {alloy && (
              <p className="mt-2 flex items-start gap-1.5 text-xs text-muted">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-gold-dark" /> {alloy.note}
              </p>
            )}
          </div>

          <div className="rounded-xl border border-line bg-white p-4 sm:p-5">
            <p className="label">
              Grosime
              <span className="ml-1.5 rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-ink-soft" title="Notația din desen">
                b
              </span>{' '}
              <span className="font-normal text-muted">(mm)</span>
            </p>
            <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Grosime">
              {BETA_THICKNESSES.map((t) => {
                const active = thickness === t;
                return (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setThickness(active ? '' : t)}
                    className={cls(
                      'h-10 min-w-[3.25rem] rounded-lg border px-3.5 text-sm font-semibold tabular-nums transition',
                      active ? 'border-ink bg-ink text-white shadow-sm' : 'border-line bg-white text-ink hover:border-ink/50',
                    )}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-line bg-white p-4 sm:p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              {numberField('Lungime', 'l', length, setLength, BETA_FORMAT.maxLength)}
              {numberField('Lățime', 'd', width, setWidth, BETA_FORMAT.maxWidth)}
            </div>
            <p className="mt-3 text-xs text-muted">
              Dimensiunea minimă de debitare este {BETA_FORMAT.min} mm. Lungimea maximă livrabilă prin curier este{' '}
              {n(BETA_FORMAT.maxLength)} mm, lățimea maximă {n(BETA_FORMAT.maxWidth)} mm (formatul plăcii).
            </p>
            {corrected && (
              <p className="mt-3 flex items-start gap-1.5 text-xs font-medium text-warning-ink" role="status">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {corrected}
              </p>
            )}
          </div>

          <div className="rounded-xl border border-line bg-white p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="label">
                Cantitate <span className="font-normal text-muted">(buc)</span>
              </p>
              <QuantityField value={qty} onChange={setQty} min={1} max={9999} />
            </div>
            {overLimit && (
              <div className="mt-4 rounded-lg border border-brand-gold/50 bg-warning-bg p-4">
                <p className="text-sm font-semibold text-warning-ink">Pentru cantități mai mari de {MAX_ONLINE_QTY} bucăți, vă rugăm să contactați un consultant.</p>
                <div className="mt-3">
                  <ContactConsultant
                    subject={`Ofertă plăci groase – ${alloy?.label ?? 'aluminiu'}`}
                    message={`Bună ziua, doresc o ofertă pentru ${qty} buc placă ${alloy?.label ?? ''} ${thickness || ''} mm, ${length || '—'} × ${width || '—'} mm.`}
                  />
                </div>
              </div>
            )}
          </div>

          <Notice className="text-xs">Plăcile debitate la comandă nu beneficiază de drept de retur conform OUG 34/2014.</Notice>
        </div>

        {/* ---------------- dreapta: calculul */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-5 sm:p-6">
            <h2 className="text-lg font-semibold">Calcul</h2>
            <p className="mt-0.5 text-xs text-muted">
              {complete ? `${alloy?.label} · ${n(len)} × ${n(wid)} × ${thickness} mm` : 'Completează aliajul, grosimea și dimensiunile.'}
            </p>
            <div className="mt-4 divide-y divide-line">
              <SummaryRow label="Cod articol (SKU)" value={sku ? <span className="font-mono text-[11px]">{sku}</span> : '—'} />
              <SummaryRow label="Masă unitară [kg/buc]" value={price ? kg(price.unitWeightKg) : '—'} />
              <SummaryRow label="Greutate totală" value={price ? kg(price.totalWeightKg) : '—'} />
              <SummaryRow label="Preț / kg" value={alloy ? money(pricePerKg(alloy.basePriceEurPerKg)) : '—'} />
              <SummaryRow label="Preț / bucată (fără TVA)" value={price ? money(price.unitNet) : '—'} />
              <SummaryRow label="Total fără TVA" value={price ? money(price.net) : '—'} />
              <SummaryRow label="TVA 21%" value={price ? money(price.vat) : '—'} />
              <SummaryRow label="Total cu TVA" value={price ? money(price.gross) : '—'} strong className="pt-3 text-base" />
            </div>

            <div className="mt-5">
              <Button size="lg" full onClick={addToCart} disabled={!canAdd}>
                <ShoppingCart className="h-4 w-4" /> Adaugă în coș
              </Button>
            </div>
            {!complete && (
              <p className="mt-3 text-xs text-muted">
                Lipsesc: {[!alloy && 'aliajul', !thickness && 'grosimea', !(len >= BETA_FORMAT.min) && 'lungimea', !(wid >= BETA_FORMAT.min) && 'lățimea'].filter(Boolean).join(', ')}.
              </p>
            )}
            {overLimit && <p className="mt-3 text-xs font-medium text-warning-ink">Peste {MAX_ONLINE_QTY} buc comanda se face prin consultant.</p>}
            <p className="mt-4 text-[11px] leading-5 text-muted">
              Prețurile afișate pot fi actualizate până la finalizarea comenzii. Costul transportului se calculează în funcție
              de greutate și destinație.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
