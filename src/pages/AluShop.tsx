import { useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, Info, Sparkles } from 'lucide-react';
import {
  ALUSHOP_ALLOYS,
  ALUSHOP_ITEMS,
  ALUSHOP_THICKNESSES,
  alushopPrice,
  alushopTransport,
  alushopWeight,
  type AluShopItem,
} from '@/data/alushop';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { Breadcrumbs, Notice } from '@/components/ui/misc';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Field';
import { SITE, telHref } from '@/config/site';
import { kg, money, n } from '@/lib/format';
import { round2 } from '@/lib/pricing';

const PER_PAGE = 20;
const EMPTY = { alloy: '', thickness: '', lengthMin: '', lengthMax: '', widthMin: '', widthMax: '' };

/**
 * AluShop – promoția de plăci debitate: bucăți unice rămase din debitare, în limita stocului.
 * Filtrele și coloanele urmează lista din sistemul actual (aliaj, grosime, lungime, lățime).
 */
export function AluShopPage() {
  const { items, add } = useCart();
  const { toast } = useToast();
  const [draft, setDraft] = useState(EMPTY);
  const [filter, setFilter] = useState(EMPTY);
  const [page, setPage] = useState(1);

  const list = useMemo(() => {
    const min = (v: string) => (v ? Number(v) : -Infinity);
    const max = (v: string) => (v ? Number(v) : Infinity);
    return ALUSHOP_ITEMS.filter(
      (it) =>
        (!filter.alloy || it.alloy === filter.alloy) &&
        (!filter.thickness || it.thickness === Number(filter.thickness)) &&
        it.length >= min(filter.lengthMin) &&
        it.length <= max(filter.lengthMax) &&
        it.width >= min(filter.widthMin) &&
        it.width <= max(filter.widthMax),
    );
  }, [filter]);

  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const current = Math.min(page, pages);
  const rows = list.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const inCart = (sku: string) => items.some((i) => i.sku === sku);

  const addItem = (it: AluShopItem) => {
    if (inCart(it.sku)) return;
    const weightKg = alushopWeight(it);
    const priceRon = alushopPrice(it);
    add({
      shapeId: 'thick_plate',
      materialId: 'AL',
      dims: { width: it.width, thickness: it.thickness },
      length: it.length,
      quantity: 1,
      unitWeightKg: weightKg,
      pricePerKgRon: round2(priceRon / weightKg),
      unitNetRon: priceRon,
      label: `Placă groasă ${it.alloy} – ${n(it.length)} × ${n(it.width)} × ${n(it.thickness)} mm (promoție)`,
      sku: it.sku,
      alloy: it.alloy,
      source: 'alushop',
      transportRon: alushopTransport(it),
    });
    toast('Placa a fost adăugată în coș.', { cta: { label: 'Vezi coșul', to: '/cos' } });
  };

  const apply = (e: FormEvent) => {
    e.preventDefault();
    setFilter(draft);
    setPage(1);
  };
  const reset = () => {
    setDraft(EMPTY);
    setFilter(EMPTY);
    setPage(1);
  };
  const set = (k: keyof typeof EMPTY) => (e: { target: { value: string } }) => setDraft({ ...draft, [k]: e.target.value });

  return (
    <div className="container-cm py-6 sm:py-8">
      <Breadcrumbs items={[{ label: 'Produse', to: '/produse' }, { label: 'Placă groasă', to: '/produse/placa-groasa' }, { label: 'Promoție' }]} />
      <Link to="/produse/placa-groasa" className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Înapoi
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-brand-gold to-brand-gold-dark px-3 py-1.5 text-sm font-extrabold uppercase tracking-[0.08em] text-white">
          <Sparkles className="h-4 w-4" /> Promoție
        </span>
        <h1 className="text-2xl font-semibold sm:text-3xl">Plăci debitate din stoc</h1>
      </div>
      <p className="mt-3 max-w-3xl text-[15px] leading-6 text-muted">
        Plăcile din tabelul de mai jos rezultă din procesele de debitare. Din acest motiv sunt{' '}
        <strong className="font-semibold text-ink">dimensiuni unicate</strong>, disponibile în limita stocului actual – fiecare
        bucată se poate comanda o singură dată.
      </p>

      <Notice className="mt-4">
        Pentru alte tipodimensiuni, contactați serviciul nostru CALL CENTER la{' '}
        <a href={telHref(SITE.phones.callCenter)} className="font-semibold text-brand-bronze">
          {SITE.phones.callCenter}
        </a>{' '}
        sau pe{' '}
        <a href={`mailto:${SITE.emails.direct}`} className="font-semibold text-brand-bronze">
          {SITE.emails.direct}
        </a>
        . Prețurile sunt exprimate în lei și nu conțin TVA; cheltuielile de transport, ambalare și manipulare sunt afișate în
        tabel. Ai nevoie de altă dimensiune?{' '}
        <Link to="/produse/placa-groasa/configurator" className="font-semibold text-brand-bronze hover:underline">
          Configurează placa dorită
        </Link>
        .
      </Notice>

      <section className="card mt-6 p-5">
        <form onSubmit={apply} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Select label="Filtru aliaj" value={draft.alloy} onChange={set('alloy')}>
            <option value="">– Toate –</option>
            {ALUSHOP_ALLOYS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </Select>
          <Select label="Filtru grosime [mm]" value={draft.thickness} onChange={set('thickness')}>
            <option value="">– Toate –</option>
            {ALUSHOP_THICKNESSES.map((t) => (
              <option key={t} value={t}>
                {t} mm
              </option>
            ))}
          </Select>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Lungime de la [mm]" type="number" inputMode="numeric" min={0} placeholder="min" value={draft.lengthMin} onChange={set('lengthMin')} />
            <Input label="până la [mm]" type="number" inputMode="numeric" min={0} placeholder="max" value={draft.lengthMax} onChange={set('lengthMax')} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Lățime de la [mm]" type="number" inputMode="numeric" min={0} placeholder="min" value={draft.widthMin} onChange={set('widthMin')} />
            <Input label="până la [mm]" type="number" inputMode="numeric" min={0} placeholder="max" value={draft.widthMax} onChange={set('widthMax')} />
          </div>
          <div className="flex items-end gap-2">
            <Button type="submit">Aplică</Button>
            <Button type="button" variant="secondary" onClick={reset}>
              Resetează
            </Button>
          </div>
        </form>
      </section>

      <p className="mt-4 text-sm text-muted">
        {list.length} {list.length === 1 ? 'placă disponibilă' : 'plăci disponibile'}
        {pages > 1 && ` · pagina ${current} din ${pages}`}
      </p>

      <div className="card mt-2 overflow-x-auto">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="bg-surface text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-2.5 font-semibold">Aliaj</th>
              <th className="px-4 py-2.5 text-right font-semibold">Grosime</th>
              <th className="px-4 py-2.5 text-right font-semibold">Lungime</th>
              <th className="px-4 py-2.5 text-right font-semibold">Lățime</th>
              <th className="px-4 py-2.5 text-right font-semibold">Greutate</th>
              <th className="px-4 py-2.5 text-right font-semibold">Preț</th>
              <th className="px-4 py-2.5 text-right font-semibold">Transp./amb./manip.</th>
              <th className="px-4 py-2.5 text-right font-semibold">Coș cump.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-muted">
                  <Info className="mx-auto mb-2 h-5 w-5 opacity-60" />
                  Nu există plăci care să corespundă filtrelor. Încearcă alte valori sau{' '}
                  <Link to="/produse/placa-groasa/configurator" className="font-semibold text-brand-bronze hover:underline">
                    configurează placa dorită
                  </Link>
                  .
                </td>
              </tr>
            )}
            {rows.map((it) => {
              const added = inCart(it.sku);
              return (
                <tr key={it.sku} className="hover:bg-surface/60">
                  <td className="px-4 py-3 font-medium">{it.alloy}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{it.thickness} mm</td>
                  <td className="px-4 py-3 text-right tabular-nums">{n(it.length)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{n(it.width)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{kg(alushopWeight(it))}</td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums">{money(alushopPrice(it))}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted">{money(alushopTransport(it))}</td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant={added ? 'secondary' : 'primary'} disabled={added} onClick={() => addItem(it)}>
                      {added ? (
                        <>
                          <Check className="h-4 w-4" /> În coș
                        </>
                      ) : (
                        'Pune în coș'
                      )}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
          <Button size="sm" variant="secondary" disabled={current === 1} onClick={() => setPage(current - 1)}>
            ‹ Anterior
          </Button>
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              aria-current={p === current}
              className={
                p === current
                  ? 'h-9 min-w-9 rounded-lg border border-ink bg-ink px-3 text-sm font-semibold text-white'
                  : 'h-9 min-w-9 rounded-lg border border-line bg-white px-3 text-sm font-semibold text-ink hover:border-ink/50'
              }
            >
              {p}
            </button>
          ))}
          <Button size="sm" variant="secondary" disabled={current === pages} onClick={() => setPage(current + 1)}>
            Următor ›
          </Button>
        </div>
      )}

      <p className="mt-4 text-xs text-muted">
        Fiecare placă este o bucată unică (cantitate 1) și se poate comanda o singură dată. Prețuri promoționale în lei, fără
        TVA; TVA 21% se adaugă în coș.
      </p>
    </div>
  );
}
