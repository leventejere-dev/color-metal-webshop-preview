import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { SHAPE_BY_ID } from '@/data/shapes';
import { ELOX_COLORS, FINISHES, MATERIALS } from '@/data/materials';
import { QuantityField } from '@/components/ui/QuantityField';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Breadcrumbs, EmptyState, Notice, PageHeader, SummaryRow } from '@/components/ui/misc';
import { TechDrawing } from '@/components/product/TechDrawing';
import { MAX_ONLINE_QTY } from '@/config/pricing';
import { kg, money } from '@/lib/format';
import { round2 } from '@/lib/pricing';
import type { CartItem } from '@/lib/types';

export function itemDescription(item: CartItem): string {
  const parts: string[] = [MATERIALS[item.materialId].label];
  if (item.alloy) parts.push(item.alloy);
  if (item.finish) parts.push(FINISHES[item.finish].label + (item.eloxColor ? ` ${ELOX_COLORS.find((c) => c.id === item.eloxColor)?.label ?? ''}` : ''));
  return parts.join(' · ');
}

export function CartPage() {
  const { items, totals, updateQuantity, removeItem, clear } = useCart();
  const navigate = useNavigate();

  return (
    <div className="container-cm py-8">
      <Breadcrumbs items={[{ label: 'Coș de cumpărături' }]} />
      <PageHeader title="Coș de cumpărături" intro="Revizuiește produsele înainte de comandă." />

      {items.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={<ShoppingCart className="h-6 w-6" />}
            title="Coșul este gol."
            text="Alege o formă de produs, materialul și dimensiunile – prețul se calculează automat."
            action={<ButtonLink to="/produse">Începe configurarea</ButtonLink>}
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)]">
          <div className="space-y-3">
            {items.map((item) => {
              const shape = SHAPE_BY_ID[item.shapeId];
              return (
                <article key={item.id} className="card flex gap-4 p-4">
                  <Link to={`/produse/${shape.slug}`} className="hidden shrink-0 sm:block">
                    <span className="flex h-20 w-32 items-center justify-center overflow-hidden rounded-lg bg-surface px-1.5">
                      <TechDrawing shape={shape} />
                    </span>
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-semibold">
                          <Link to={`/produse/${shape.slug}`} className="hover:text-brand-bronze">
                            {shape.name}
                          </Link>
                        </h3>
                        <p className="text-sm text-muted">{itemDescription(item)}</p>
                        <p className="mt-0.5 text-sm text-ink-soft">{item.label.split(' – ').slice(1).join(' – ')}</p>
                        <p className="mt-1 text-xs text-muted">
                          {money(item.unitNetRon)} / buc · {kg(item.unitWeightKg)} / buc · {money(item.pricePerKgRon)} / kg
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted">Total (fără TVA)</p>
                        <p className="font-semibold tabular-nums">{money(round2(item.unitNetRon * item.quantity))}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      {item.sku ? (
                        <span className="text-xs text-muted">
                          1 buc · bucată unică AluShop{item.transportRon != null ? ` · transport orientativ ${money(item.transportRon)}` : ''}
                        </span>
                      ) : (
                        <div className="flex items-center gap-3">
                          <QuantityField value={item.quantity} onChange={(q) => updateQuantity(item.id, q)} min={1} max={MAX_ONLINE_QTY} size="sm" label={`Cantitate ${shape.name}`} />
                          <span className="text-xs text-muted">max. {MAX_ONLINE_QTY} buc online</span>
                        </div>
                      )}
                      <button onClick={() => removeItem(item.id)} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-danger hover:bg-danger/5">
                        <Trash2 className="h-4 w-4" /> Șterge
                      </button>
                    </div>
                    <p className="mt-2 rounded-md bg-warning-bg px-2.5 py-1.5 text-[11px] text-warning-ink">Produsele personalizate nu pot fi returnate din motive de răzgândire.</p>
                  </div>
                </article>
              );
            })}
            <div className="flex flex-wrap justify-between gap-2 pt-2">
              <ButtonLink to="/produse" variant="secondary">
                Continuă configurarea
              </ButtonLink>
              <Button variant="ghost" onClick={clear} className="text-muted">
                Golește coșul
              </Button>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="card p-5 sm:p-6">
              <h2 className="text-lg font-semibold">Sumar comandă</h2>
              <div className="mt-3 divide-y divide-line">
                <SummaryRow label="Subtotal (fără TVA)" value={money(totals.netRon)} />
                <SummaryRow label="Greutate totală" value={kg(totals.weightKg)} />
                <SummaryRow label="TVA 21%" value={money(totals.vatRon)} />
                <SummaryRow label="Total cu TVA" value={money(totals.grossRon)} strong className="pt-3 text-base" />
              </div>
              <p className="mt-2 text-xs text-muted">Costul livrării se calculează la finalizarea comenzii, în funcție de greutate și destinație.</p>
              <Button size="lg" full className="mt-5" onClick={() => navigate('/finalizare-comanda')}>
                Finalizează comanda <ArrowRight className="h-4 w-4" />
              </Button>
              <Notice className="mt-4">Prețurile afișate pot fi actualizate până la finalizarea comenzii.</Notice>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
