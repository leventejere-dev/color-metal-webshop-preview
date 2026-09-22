import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import { ordersApi } from '@/lib/api';
import type { Order } from '@/lib/types';
import { PAYMENT_LABEL } from '@/lib/types';
import { SHAPE_BY_ID } from '@/data/shapes';
import { SITE } from '@/config/site';
import { Button, ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/misc';
import { asset, dateRo, kg, money } from '@/lib/format';
import { round2 } from '@/lib/pricing';
import { itemDescription } from './Cart';

/**
 * Document printabil: factură proformă (transfer bancar) sau factură (demo).
 * „Descarcă PDF” folosește dialogul de tipărire al browserului (Salvează ca PDF);
 * „Descarcă HTML” salvează documentul ca fișier HTML autonom.
 */
export function DocumentPage({ kind }: { kind: 'proforma' | 'factura' }) {
  const { id = '' } = useParams();
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    ordersApi.get(id).then(setOrder);
  }, [id]);

  useEffect(() => {
    if (order) document.title = `${kind === 'proforma' ? 'Proformă' : 'Factură'} ${kind === 'proforma' ? order.proformaNumber : order.invoiceNumber} – Color Metal`;
    return () => {
      document.title = 'Color Metal Webshop – Semifabricate metalice';
    };
  }, [order, kind]);

  if (order === undefined) return <div className="container-cm py-16 text-center text-muted">Se încarcă…</div>;
  if (!order || (kind === 'proforma' && !order.proformaNumber) || (kind === 'factura' && !order.invoiceNumber)) {
    return (
      <div className="container-cm py-12">
        <EmptyState title="Documentul nu a fost găsit." action={<ButtonLink to="/">Înapoi la prima pagină</ButtonLink>} />
      </div>
    );
  }

  const number = kind === 'proforma' ? order.proformaNumber! : order.invoiceNumber!;
  const title = kind === 'proforma' ? 'FACTURĂ PROFORMĂ' : 'FACTURĂ';
  const date = kind === 'proforma' ? order.createdAt : order.invoiceDate ?? order.createdAt;

  const downloadHtml = () => {
    const page = document.getElementById('print-doc');
    if (!page) return;
    const html = `<!doctype html><html lang="ro"><head><meta charset="utf-8"><title>${title} ${number}</title>
<style>body{font-family:Montserrat,Segoe UI,Arial,sans-serif;color:#1a1a1a;margin:32px;font-size:13px}table{border-collapse:collapse;width:100%}th,td{padding:6px 8px;border-bottom:1px solid #e3e3e0;text-align:left}th{font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:#6b6b6b}.r{text-align:right}h1{font-size:20px;margin:0}img{max-height:36px}.muted{color:#6b6b6b}.grid{display:flex;gap:24px}.grid>div{flex:1}</style></head><body>${page.innerHTML.replace(/src="([^"]+)"/g, (_m, s: string) => `src="${new URL(s, location.href).href}"`)}</body></html>`;
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${number}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container-cm max-w-4xl py-6 sm:py-10">
      <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link to={order.userId ? '/cont/facturi' : `/comanda/${order.id}`} className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
          <ArrowLeft className="h-4 w-4" /> Înapoi
        </Link>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={downloadHtml}>
            <Download className="h-4 w-4" /> Descarcă HTML
          </Button>
          <Button onClick={() => window.print()}>
            <Printer className="h-4 w-4" /> Tipărește / Salvează PDF
          </Button>
        </div>
      </div>

      <div id="print-doc" className="print-page card bg-white p-6 sm:p-10">
        <div className="grid flex-wrap items-start justify-between gap-6 sm:flex">
          <div>
            <img src={asset('/assets/brand/color-metal-logo.png')} alt="Color Metal" className="h-9 w-auto" />
            <p className="mt-3 text-sm font-semibold">{SITE.legalName}</p>
            <p className="text-xs text-muted">{SITE.headquarters.address}</p>
            <p className="text-xs text-muted">
              {SITE.emails.direct} · {SITE.phones.callCenter}
            </p>
          </div>
          <div className="sm:text-right">
            <h1 className="text-xl font-semibold tracking-wide">{title}</h1>
            <p className="mt-1 text-sm">
              Nr. <strong>{number}</strong>
            </p>
            <p className="text-sm">Data: {dateRo(date)}</p>
            <p className="text-sm">Comanda: {order.number}</p>
            <p className="mt-1 text-xs text-muted">Plată: {PAYMENT_LABEL[order.payment]}</p>
          </div>
        </div>

        <div className="grid mt-8 gap-6 sm:grid-cols-2">
          <div className="rounded-lg border border-line p-4 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Cumpărător</p>
            <p className="mt-1 font-semibold">{order.billing.company || order.billing.name}</p>
            {order.billing.company && <p>{order.billing.name}</p>}
            {order.billing.cui && <p>CUI: {order.billing.cui}</p>}
            <p className="text-muted">
              {order.billing.street}, {order.billing.city}, jud. {order.billing.county}
              {order.billing.postalCode ? `, ${order.billing.postalCode}` : ''}, {order.billing.country}
            </p>
            <p className="text-muted">
              {order.customerEmail} · {order.billing.phone}
            </p>
          </div>
          <div className="rounded-lg border border-line p-4 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Adresă de livrare</p>
            <p className="mt-1 font-semibold">{order.delivery.name}</p>
            <p className="text-muted">
              {order.delivery.street}, {order.delivery.city}, jud. {order.delivery.county}
              {order.delivery.postalCode ? `, ${order.delivery.postalCode}` : ''}, {order.delivery.country}
            </p>
            {order.delivery.phone && <p className="text-muted">{order.delivery.phone}</p>}
          </div>
        </div>

        <table className="mt-8 w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-[11px] uppercase tracking-wide text-muted">
              <th className="py-2 pr-2 font-semibold">#</th>
              <th className="py-2 pr-2 font-semibold">Produs / configurație</th>
              <th className="r py-2 pr-2 text-right font-semibold">Cant.</th>
              <th className="r py-2 pr-2 text-right font-semibold">Greutate</th>
              <th className="r py-2 pr-2 text-right font-semibold">Preț / buc</th>
              <th className="r py-2 text-right font-semibold">Valoare (fără TVA)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {order.items.map((it, i) => (
              <tr key={it.id} className="align-top">
                <td className="py-2.5 pr-2 text-muted">{i + 1}</td>
                <td className="py-2.5 pr-2">
                  <span className="font-medium">{SHAPE_BY_ID[it.shapeId].name}</span>
                  <span className="block text-xs text-muted">
                    {itemDescription(it)} · {it.label.split(' – ').slice(1).join(' – ')}
                  </span>
                </td>
                <td className="r py-2.5 pr-2 text-right tabular-nums">{it.quantity} buc</td>
                <td className="r py-2.5 pr-2 text-right tabular-nums">{kg(round2(it.unitWeightKg * it.quantity * 1000) / 1000)}</td>
                <td className="r py-2.5 pr-2 text-right tabular-nums">{money(it.unitNetRon)}</td>
                <td className="r py-2.5 text-right tabular-nums">{money(round2(it.unitNetRon * it.quantity))}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 ml-auto w-full max-w-xs text-sm">
          <div className="flex justify-between py-1">
            <span className="text-muted">Total fără TVA</span>
            <span className="tabular-nums">{money(order.netRon)}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-muted">TVA 21%</span>
            <span className="tabular-nums">{money(order.vatRon)}</span>
          </div>
          <div className="flex justify-between border-t border-ink py-2 text-base font-semibold">
            <span>Total de plată</span>
            <span className="tabular-nums">{money(order.grossRon)}</span>
          </div>
          <p className="text-xs text-muted">Greutate totală: {kg(order.totalWeightKg)}</p>
        </div>

        <div className="mt-8 rounded-lg bg-surface p-4 text-xs leading-5 text-muted">
          {kind === 'proforma' ? (
            <>
              <p>
                <strong className="text-ink">Instrucțiuni de plată:</strong> vă rugăm să achitați suma de {money(order.grossRon)} prin transfer bancar, menționând numărul proformei {number} la detalii plată. Datele bancare (IBAN) vor fi completate de Color Metal pe documentul final.
              </p>
              <p className="mt-1">Proforma nu este document fiscal. Factura fiscală se emite după încasarea plății. Comanda va fi procesată după confirmarea plății.</p>
            </>
          ) : (
            <p>Document demonstrativ generat de prototipul webshop. Factura fiscală finală este emisă de sistemul de facturare Color Metal.</p>
          )}
          <p className="mt-1">Produsele configurate se realizează conform specificațiilor clientului și nu beneficiază de drept de retur (OUG 34/2014).</p>
          {order.notes && <p className="mt-1">Observații client: {order.notes}</p>}
        </div>
      </div>
    </div>
  );
}
