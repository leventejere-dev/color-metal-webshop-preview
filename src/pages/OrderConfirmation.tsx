import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, FileText, Landmark } from 'lucide-react';
import { ordersApi } from '@/lib/api';
import { ORDER_STATUS_LABEL, PAYMENT_LABEL, type Order } from '@/lib/types';
import { SHAPE_BY_ID } from '@/data/shapes';
import { ButtonLink } from '@/components/ui/Button';
import { Badge, EmptyState, SummaryRow } from '@/components/ui/misc';
import { dateTimeRo, kg, money } from '@/lib/format';
import { round2 } from '@/lib/pricing';
import { itemDescription } from './Cart';
import { SITE } from '@/config/site';

export function OrderConfirmationPage() {
  const { id = '' } = useParams();
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    ordersApi.get(id).then(setOrder);
  }, [id]);

  if (order === undefined) return <div className="container-cm py-16 text-center text-muted">Se încarcă…</div>;
  if (!order)
    return (
      <div className="container-cm py-12">
        <EmptyState title="Comanda nu a fost găsită." action={<ButtonLink to="/">Înapoi la prima pagină</ButtonLink>} />
      </div>
    );

  return (
    <div className="container-cm max-w-3xl py-10">
      <div className="card p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <CheckCircle2 className="h-10 w-10 shrink-0 text-success" />
          <div>
            <p className="eyebrow">Comanda {order.number}</p>
            <h1 className="mt-1 text-2xl font-semibold">Comanda a fost înregistrată cu succes.</h1>
            <p className="mt-1 text-sm text-muted">
              {dateTimeRo(order.createdAt)} · <Badge tone={order.status === 'asteapta_plata' ? 'warning' : 'success'}>{ORDER_STATUS_LABEL[order.status]}</Badge>
            </p>
          </div>
        </div>

        {order.payment === 'transfer' ? (
          <div className="mt-6 rounded-xl border border-brand-gold/40 bg-brand-gold-light/40 p-5">
            <div className="flex items-start gap-3">
              <Landmark className="mt-0.5 h-5 w-5 text-brand-gold-dark" />
              <div>
                <h2 className="font-semibold">Plată prin transfer bancar</h2>
                <p className="mt-1 text-sm text-ink-soft">
                  Am generat factura proformă <strong>{order.proformaNumber}</strong>. Comanda va fi procesată după confirmarea plății. Proforma a fost trimisă și pe email la {order.customerEmail}.
                </p>
                <div className="mt-3">
                  <ButtonLink to={`/proforma/${order.id}`}>
                    <FileText className="h-4 w-4" /> Vezi / descarcă proforma
                  </ButtonLink>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-6 rounded-xl bg-surface p-4 text-sm text-ink-soft">
            Metodă de plată: <strong>{PAYMENT_LABEL[order.payment]}</strong>. Confirmarea și factura <strong>{order.invoiceNumber}</strong> au fost trimise pe email la {order.customerEmail}.
          </p>
        )}

        <h2 className="mt-8 text-lg font-semibold">Produse comandate</h2>
        <ul className="mt-2 divide-y divide-line text-sm">
          {order.items.map((it) => (
            <li key={it.id} className="flex justify-between gap-3 py-2.5">
              <span>
                <span className="block font-medium">
                  {SHAPE_BY_ID[it.shapeId].name} × {it.quantity}
                </span>
                <span className="block text-xs text-muted">
                  {itemDescription(it)} · {it.label.split(' – ').slice(1).join(' – ')}
                </span>
              </span>
              <span className="tabular-nums">{money(round2(it.unitNetRon * it.quantity))}</span>
            </li>
          ))}
        </ul>
        <div className="mt-2 ml-auto max-w-xs divide-y divide-line">
          <SummaryRow label="Total fără TVA" value={money(order.netRon)} />
          <SummaryRow label="Greutate" value={kg(order.totalWeightKg)} />
          <SummaryRow label="TVA 21%" value={money(order.vatRon)} />
          <SummaryRow label="Total cu TVA" value={money(order.grossRon)} strong />
        </div>

        <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
          <div className="rounded-lg bg-surface p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Facturare</p>
            <p className="mt-1 font-medium">{order.billing.company || order.billing.name}</p>
            {order.billing.cui && <p className="text-muted">CUI {order.billing.cui}</p>}
            <p className="text-muted">{order.billing.street}, {order.billing.city}, {order.billing.county}</p>
          </div>
          <div className="rounded-lg bg-surface p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Livrare</p>
            <p className="mt-1 font-medium">{order.delivery.name}</p>
            <p className="text-muted">{order.delivery.street}, {order.delivery.city}, {order.delivery.county}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {order.userId ? (
            <ButtonLink to="/cont/comenzi" variant="secondary">
              Comenzile mele
            </ButtonLink>
          ) : (
            <ButtonLink to="/inregistrare" variant="secondary">
              Creează cont pentru istoric comenzi
            </ButtonLink>
          )}
          <ButtonLink to="/produse" variant="ghost">
            Continuă configurarea
          </ButtonLink>
        </div>
        <p className="mt-6 text-xs text-muted">
          Întrebări despre comandă? Call center {SITE.phones.callCenter1} · {SITE.emails.direct}. Folosește numărul comenzii {order.number}.
        </p>
      </div>
      <p className="mt-4 text-center text-xs text-muted">
        <Link to="/" className="hover:text-ink">
          Înapoi la prima pagină
        </Link>
      </p>
    </div>
  );
}
