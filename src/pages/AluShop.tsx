import { useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Check, HelpCircle, ShoppingCart } from 'lucide-react';
import { ALUSHOP_ALLOYS, ALUSHOP_ITEMS, ALUSHOP_THICKNESSES, type AluShopItem } from '@/data/alushop';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { Breadcrumbs, Notice } from '@/components/ui/misc';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Field';
import { EUR_TO_RON } from '@/config/pricing';
import { SITE, telHref } from '@/config/site';
import { kg, money, n } from '@/lib/format';
import { round2 } from '@/lib/pricing';

const toRon = (eur: number) => round2(eur * EUR_TO_RON);

/** AluShop – promoția de plăci debitate, preluată din webshopul actual (stoc fix, bucăți unice). */
export function AluShopPage() {
  const { items, add, count } = useCart();
  const { toast } = useToast();
  const [draft, setDraft] = useState({ alloy: '', thickness: '', length: '', width: '' });
  const [filter, setFilter] = useState(draft);

  const list = useMemo(
    () =>
      ALUSHOP_ITEMS.filter((it) => {
        if (filter.alloy && it.alloy !== filter.alloy) return false;
        if (filter.thickness && it.thickness !== Number(filter.thickness)) return false;
        if (filter.length && it.length < Number(filter.length)) return false;
        if (filter.width && it.width < Number(filter.width)) return false;
        return true;
      }),
    [filter],
  );

  const inCart = (sku: string) => items.some((i) => i.sku === sku);

  const addItem = (it: AluShopItem) => {
    if (inCart(it.sku)) return;
    add({
      shapeId: 'thick_plate',
      materialId: 'AL',
      dims: { width: it.width, thickness: it.thickness },
      length: it.length,
      quantity: 1,
      unitWeightKg: it.weightKg,
      pricePerKgRon: round2(toRon(it.priceEur) / it.weightKg),
      unitNetRon: toRon(it.priceEur),
      label: `Placă groasă Aluminiu ${it.alloy} – ${n(it.length)} × ${n(it.width)} × ${n(it.thickness)} mm (AluShop)`,
      sku: it.sku,
      alloy: it.alloy,
      source: 'alushop',
      transportRon: toRon(it.transportEur),
    });
    toast('Produsul a fost adăugat în coș.', { cta: { label: 'Vezi coșul', to: '/cos' } });
  };

  const apply = (e: FormEvent) => {
    e.preventDefault();
    setFilter(draft);
  };
  const reset = () => {
    const empty = { alloy: '', thickness: '', length: '', width: '' };
    setDraft(empty);
    setFilter(empty);
  };

  return (
    <div className="container-cm py-6 sm:py-8">
      <Breadcrumbs items={[{ label: 'AluShop' }]} />
      <p className="eyebrow">AluShop</p>
      <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">Promoție plăci debitate</h1>
      <p className="mt-2 max-w-2xl text-[15px] text-muted">Plăci groase din aluminiu, rezultate în urma proceselor de debitare. Dimensiuni unice, disponibile în limita stocului.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="card flex items-center gap-4 p-5">
          <ShoppingCart className="h-6 w-6 shrink-0 text-brand-gold-dark" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold">Coșul tău</p>
            <p className="text-sm text-muted">
              {count} art. · Bucățile selectate apar în coșul principal.
            </p>
          </div>
          <Link to="/cos" className="shrink-0 text-sm font-semibold text-brand-bronze hover:underline">
            Vezi coșul
          </Link>
        </div>
        <div className="card flex items-center gap-4 p-5">
          <HelpCircle className="h-6 w-6 shrink-0 text-brand-gold-dark" />
          <div>
            <p className="font-semibold">Cum comand?</p>
            <p className="text-sm text-muted">Filtrează, alege placa și apasă „Pune în coș”.</p>
          </div>
        </div>
      </div>

      <Notice className="mt-4">
        Pentru alte tipodimensiuni, contactați serviciul nostru CALL CENTER:{' '}
        <a href={telHref(SITE.phones.callCenter)} className="font-semibold text-brand-bronze">
          {SITE.phones.callCenter}
        </a>
        . Prețurile sunt exprimate în lei și nu conțin TVA; cheltuielile de transport se adaugă la confirmarea comenzii.
      </Notice>

      <section className="card mt-6 p-5">
        <h2 className="eyebrow">Ajutor pentru selectarea aliajului</h2>
        <form onSubmit={apply} className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:items-end">
          <Select label="Filtru Aliaj" value={draft.alloy} onChange={(e) => setDraft({ ...draft, alloy: e.target.value })}>
            <option value="">- Any -</option>
            {ALUSHOP_ALLOYS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </Select>
          <Select label="Filtru pt. Grosime [mm]" value={draft.thickness} onChange={(e) => setDraft({ ...draft, thickness: e.target.value })}>
            <option value="">- Any -</option>
            {ALUSHOP_THICKNESSES.map((t) => (
              <option key={t} value={t}>
                {t} mm
              </option>
            ))}
          </Select>
          <Input label="Filtru pt. Lungime [mm]" type="number" inputMode="numeric" min={0} placeholder="minim" value={draft.length} onChange={(e) => setDraft({ ...draft, length: e.target.value })} />
          <Input label="Filtru pt. Lățime [mm]" type="number" inputMode="numeric" min={0} placeholder="minim" value={draft.width} onChange={(e) => setDraft({ ...draft, width: e.target.value })} />
          <div className="flex gap-2">
            <Button type="submit">Aplică</Button>
            <Button type="button" variant="secondary" onClick={reset}>
              Resetează
            </Button>
          </div>
        </form>
      </section>

      <div className="card mt-4 overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-surface text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-2.5 font-semibold">Aliaj</th>
              <th className="px-4 py-2.5 font-semibold">Grosime</th>
              <th className="px-4 py-2.5 text-right font-semibold">Lungime</th>
              <th className="px-4 py-2.5 text-right font-semibold">Lățime</th>
              <th className="px-4 py-2.5 text-right font-semibold">Greutate</th>
              <th className="px-4 py-2.5 text-right font-semibold">Preț</th>
              <th className="px-4 py-2.5 text-right font-semibold">Chelt. transp.</th>
              <th className="px-4 py-2.5 text-right font-semibold">Coș cump.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {list.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-muted">
                  Nu există plăci care corespund filtrelor selectate.
                </td>
              </tr>
            )}
            {list.map((it) => {
              const added = inCart(it.sku);
              return (
                <tr key={it.sku} className="hover:bg-surface/60">
                  <td className="px-4 py-3 font-medium">{it.alloy}</td>
                  <td className="px-4 py-3 tabular-nums">{it.thickness} mm</td>
                  <td className="px-4 py-3 text-right tabular-nums">{n(it.length)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{n(it.width)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{kg(it.weightKg)}</td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums">{money(toRon(it.priceEur))}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted">{money(toRon(it.transportEur))}</td>
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
      <p className="mt-3 text-xs text-muted">Fiecare placă este o bucată unică (cantitate 1). Prețuri fără TVA; TVA 21% se adaugă în coș.</p>
    </div>
  );
}
