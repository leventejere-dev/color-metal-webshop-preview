import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Heart, Package } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useToast } from '@/context/ToastContext';
import { ordersApi } from '@/lib/api';
import { ORDER_STATUS_LABEL, PAYMENT_LABEL, type Address, type Order } from '@/lib/types';
import { SHAPE_BY_ID } from '@/data/shapes';
import { Input, Checkbox } from '@/components/ui/Field';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Badge, EmptyState, Notice, SummaryRow } from '@/components/ui/misc';
import { dateRo, dateTimeRo, kg, money } from '@/lib/format';
import { round2 } from '@/lib/pricing';
import { itemDescription } from '../Cart';
import { ACCOUNT_NAV } from './AccountLayout';

const statusTone = (s: Order['status']) => (s === 'livrata' ? 'success' : s === 'asteapta_plata' ? 'warning' : s === 'anulata' ? 'danger' : 'gold');

function useOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);
  useEffect(() => {
    if (user) ordersApi.list(user.id).then(setOrders);
  }, [user]);
  return orders;
}

/* ------------------------------------------------------------ Contul meu */
export function AccountOverviewPage() {
  const { user } = useAuth();
  const { slugs } = useFavorites();
  const orders = useOrders();
  if (!user) return null;
  const last = orders?.[0];
  return (
    <div>
      <h1 className="text-2xl font-semibold">Bună, {user.name.split(' ')[0]}!</h1>
      <p className="mt-1 text-sm text-muted">Cont creat la {dateRo(user.createdAt)} · {user.company ? `Facturare pe ${user.company}` : 'Persoană fizică'}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Link to="/cont/comenzi" className="card p-5 transition hover:border-ink/40">
          <Package className="h-5 w-5 text-brand-gold-dark" />
          <p className="mt-3 text-2xl font-semibold tabular-nums">{orders?.length ?? '–'}</p>
          <p className="text-sm text-muted">Comenzi plasate</p>
        </Link>
        <Link to="/cont/facturi" className="card p-5 transition hover:border-ink/40">
          <FileText className="h-5 w-5 text-brand-gold-dark" />
          <p className="mt-3 text-2xl font-semibold tabular-nums">{orders?.filter((o) => o.invoiceNumber || o.proformaNumber).length ?? '–'}</p>
          <p className="text-sm text-muted">Facturi și proforme</p>
        </Link>
        <Link to="/cont/favorite" className="card p-5 transition hover:border-ink/40">
          <Heart className="h-5 w-5 text-brand-gold-dark" />
          <p className="mt-3 text-2xl font-semibold tabular-nums">{slugs.length}</p>
          <p className="text-sm text-muted">Produse favorite</p>
        </Link>
      </div>

      {last && (
        <div className="card mt-6 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-semibold">Ultima comandă · {last.number}</h2>
            <Badge tone={statusTone(last.status)}>{ORDER_STATUS_LABEL[last.status]}</Badge>
          </div>
          <p className="mt-1 text-sm text-muted">
            {dateTimeRo(last.createdAt)} · {last.items.length} {last.items.length === 1 ? 'produs' : 'produse'} · {money(last.grossRon)} cu TVA
          </p>
          <Link to="/cont/comenzi" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-bronze hover:underline">
            Vezi toate comenzile <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        {ACCOUNT_NAV.filter((n) => !n.end).map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} className="flex items-center gap-3 rounded-lg border border-line px-4 py-3 text-sm font-medium hover:border-ink/40">
            <Icon className="h-4 w-4 text-brand-gold-dark" /> {label}
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- Comenzile mele */
export function OrdersPage() {
  const orders = useOrders();
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div>
      <h1 className="text-2xl font-semibold">Comenzile mele</h1>
      <p className="mt-1 text-sm text-muted">Istoricul comenzilor plasate din acest cont.</p>
      {orders && orders.length === 0 && (
        <div className="mt-6">
          <EmptyState icon={<Package className="h-6 w-6" />} title="Nu ai nicio comandă înregistrată." action={<ButtonLink to="/produse">Configurează un produs</ButtonLink>} />
        </div>
      )}
      <div className="mt-6 space-y-3">
        {orders?.map((o) => (
          <article key={o.id} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold">{o.number}</h2>
                <p className="text-sm text-muted">
                  {dateTimeRo(o.createdAt)} · {PAYMENT_LABEL[o.payment]}
                </p>
              </div>
              <div className="text-right">
                <Badge tone={statusTone(o.status)}>{ORDER_STATUS_LABEL[o.status]}</Badge>
                <p className="mt-1 font-semibold tabular-nums">{money(o.grossRon)}</p>
              </div>
            </div>
            <ul className="mt-3 space-y-1 text-sm text-ink-soft">
              {o.items.slice(0, open === o.id ? undefined : 2).map((it) => (
                <li key={it.id} className="flex justify-between gap-3">
                  <span>
                    {SHAPE_BY_ID[it.shapeId].name} × {it.quantity} <span className="text-muted">· {itemDescription(it)} · {it.label.split(' – ').slice(1).join(' – ')}</span>
                  </span>
                  <span className="shrink-0 tabular-nums">{money(round2(it.unitNetRon * it.quantity))}</span>
                </li>
              ))}
              {o.items.length > 2 && open !== o.id && (
                <li>
                  <button onClick={() => setOpen(o.id)} className="text-xs font-semibold text-brand-bronze hover:underline">
                    + încă {o.items.length - 2} {o.items.length - 2 === 1 ? 'produs' : 'produse'}
                  </button>
                </li>
              )}
            </ul>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              <span className="text-muted">Greutate {kg(o.totalWeightKg)} · fără TVA {money(o.netRon)}</span>
              <span className="ml-auto flex gap-3">
                {o.proformaNumber && (
                  <Link to={`/proforma/${o.id}`} className="font-semibold text-brand-bronze hover:underline">
                    Proformă {o.proformaNumber}
                  </Link>
                )}
                {o.invoiceNumber && (
                  <Link to={`/factura/${o.id}`} className="font-semibold text-brand-bronze hover:underline">
                    Factura {o.invoiceNumber}
                  </Link>
                )}
                <Link to={`/comanda/${o.id}`} className="font-semibold hover:underline">
                  Detalii
                </Link>
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- Facturi */
export function InvoicesPage() {
  const orders = useOrders();
  const docs = (orders ?? []).flatMap((o) => [
    ...(o.invoiceNumber ? [{ kind: 'Factură', number: o.invoiceNumber, date: o.invoiceDate ?? o.createdAt, to: `/factura/${o.id}`, order: o }] : []),
    ...(o.proformaNumber ? [{ kind: 'Proformă', number: o.proformaNumber, date: o.createdAt, to: `/proforma/${o.id}`, order: o }] : []),
  ]);
  return (
    <div>
      <h1 className="text-2xl font-semibold">Facturi</h1>
      <p className="mt-1 text-sm text-muted">Facturile și proformele emise pentru comenzile tale. Documentele se pot tipări sau salva ca PDF.</p>
      {orders && docs.length === 0 && (
        <div className="mt-6">
          <EmptyState icon={<FileText className="h-6 w-6" />} title="Nu există documente emise." />
        </div>
      )}
      {docs.length > 0 && (
        <div className="card mt-6 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-2.5 font-semibold">Document</th>
                <th className="px-4 py-2.5 font-semibold">Data</th>
                <th className="px-4 py-2.5 font-semibold">Comanda</th>
                <th className="px-4 py-2.5 text-right font-semibold">Total cu TVA</th>
                <th className="px-4 py-2.5 font-semibold">Status</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {docs.map((d) => (
                <tr key={d.number}>
                  <td className="px-4 py-3 font-medium">
                    {d.kind} {d.number}
                  </td>
                  <td className="px-4 py-3 text-muted">{dateRo(d.date)}</td>
                  <td className="px-4 py-3 text-muted">{d.order.number}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{money(d.order.grossRon)}</td>
                  <td className="px-4 py-3">
                    <Badge tone={statusTone(d.order.status)}>{ORDER_STATUS_LABEL[d.order.status]}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link to={d.to} className="font-semibold text-brand-bronze hover:underline">
                      Vezi / descarcă
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------- Date de contact */
export function ContactDataPage() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: user?.name ?? '', email: user?.email ?? '', phone: user?.phone ?? '', company: user?.company ?? '', cui: user?.cui ?? '' });
  const [billing, setBilling] = useState<Address>(user?.billing ?? { name: user?.name ?? '', street: '', city: '', county: '', postalCode: '', country: 'România', phone: user?.phone ?? '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await updateProfile({ ...form, company: form.company || undefined, cui: form.cui || undefined, billing: { ...billing, name: billing.name || form.name, phone: billing.phone || form.phone, company: form.company || undefined, cui: form.cui || undefined } });
      toast('Modificările au fost salvate.');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6" noValidate>
      <div>
        <h1 className="text-2xl font-semibold">Date de contact</h1>
        <p className="mt-1 text-sm text-muted">Datele folosite pentru comunicare și facturare.</p>
      </div>
      <section className="card grid gap-4 p-5 sm:grid-cols-2">
        <Input label="Nume și prenume" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} wrapClassName="sm:col-span-2" />
        <Input label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input label="Telefon" type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <Input label="Companie" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} hint="Completează doar dacă facturezi pe firmă." />
        <Input label="CUI" value={form.cui} onChange={(e) => setForm({ ...form, cui: e.target.value })} />
      </section>
      <section className="card p-5">
        <h2 className="font-semibold">Adresă de facturare</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input label="Stradă, număr" value={billing.street} onChange={(e) => setBilling({ ...billing, street: e.target.value })} wrapClassName="sm:col-span-2" />
          <Input label="Localitate" value={billing.city} onChange={(e) => setBilling({ ...billing, city: e.target.value })} />
          <Input label="Județ" value={billing.county} onChange={(e) => setBilling({ ...billing, county: e.target.value })} />
          <Input label="Cod poștal" value={billing.postalCode} onChange={(e) => setBilling({ ...billing, postalCode: e.target.value })} />
          <Input label="Țară" value={billing.country} onChange={(e) => setBilling({ ...billing, country: e.target.value })} />
        </div>
      </section>
      {error && <Notice kind="danger">{error}</Notice>}
      <Button type="submit" loading={busy}>
        Salvează modificările
      </Button>
    </form>
  );
}

/* ------------------------------------------------------ Adresa de livrare */
export function DeliveryAddressPage() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [a, setA] = useState<Address>(user?.delivery ?? { name: user?.name ?? '', street: '', city: '', county: '', postalCode: '', country: 'România', phone: user?.phone ?? '' });
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await updateProfile({ delivery: a });
      toast('Adresa de livrare a fost salvată.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6" noValidate>
      <div>
        <h1 className="text-2xl font-semibold">Adresa de livrare</h1>
        <p className="mt-1 text-sm text-muted">Adresa implicită propusă la finalizarea comenzii.</p>
      </div>
      <section className="card grid gap-4 p-5 sm:grid-cols-2">
        <Input label="Nume destinatar" required value={a.name} onChange={(e) => setA({ ...a, name: e.target.value })} />
        <Input label="Telefon destinatar" value={a.phone} onChange={(e) => setA({ ...a, phone: e.target.value })} />
        <Input label="Stradă, număr, bloc, apartament" required value={a.street} onChange={(e) => setA({ ...a, street: e.target.value })} wrapClassName="sm:col-span-2" />
        <Input label="Localitate" required value={a.city} onChange={(e) => setA({ ...a, city: e.target.value })} />
        <Input label="Județ" required value={a.county} onChange={(e) => setA({ ...a, county: e.target.value })} />
        <Input label="Cod poștal" value={a.postalCode} onChange={(e) => setA({ ...a, postalCode: e.target.value })} />
        <Input label="Țară" value={a.country} onChange={(e) => setA({ ...a, country: e.target.value })} />
      </section>
      <Button type="submit" loading={busy}>
        Salvează adresa
      </Button>
    </form>
  );
}

/* ------------------------------------------------------------ Setări cont */
export function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [s, setS] = useState(user?.settings ?? { newsletter: false, orderEmails: true, invoiceCompany: false });
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await updateProfile({ settings: s });
      toast('Setările au fost salvate.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <form onSubmit={submit} className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Setări cont</h1>
        <p className="mt-1 text-sm text-muted">Preferințe de comunicare și facturare.</p>
      </div>
      <section className="card space-y-4 p-5">
        <Checkbox label="Primesc notificări pe email despre statusul comenzilor." checked={s.orderEmails} onChange={(e) => setS({ ...s, orderEmails: e.target.checked })} />
        <Checkbox label="Doresc să primesc noutăți și oferte Color Metal (newsletter)." checked={s.newsletter} onChange={(e) => setS({ ...s, newsletter: e.target.checked })} />
        <Checkbox label="Facturare implicită pe companie (datele companiei din „Date de contact”)." checked={s.invoiceCompany} onChange={(e) => setS({ ...s, invoiceCompany: e.target.checked })} />
      </section>
      <section className="card p-5 text-sm">
        <h2 className="font-semibold">Date cont</h2>
        <div className="mt-2 divide-y divide-line">
          <SummaryRow label="Email" value={user?.email} />
          <SummaryRow label="Cont creat" value={user ? dateRo(user.createdAt) : ''} />
          <SummaryRow label="Stocare" value="localStorage (prototip)" />
        </div>
      </section>
      <Button type="submit" loading={busy}>
        Salvează setările
      </Button>
    </form>
  );
}

/* ------------------------------------------------------- Schimbare parolă */
export function ChangePasswordPage() {
  const { changePassword } = useAuth();
  const { toast } = useToast();
  const [f, setF] = useState({ current: '', next: '', confirm: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (f.next.length < 8) return setError('Parola nouă trebuie să aibă cel puțin 8 caractere.');
    if (f.next !== f.confirm) return setError('Parolele nu coincid.');
    setBusy(true);
    try {
      await changePassword(f.current, f.next);
      toast('Parola a fost schimbată.');
      setF({ current: '', next: '', confirm: '' });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <form onSubmit={submit} className="max-w-md space-y-6" noValidate>
      <div>
        <h1 className="text-2xl font-semibold">Schimbare parolă</h1>
        <p className="mt-1 text-sm text-muted">Alege o parolă de cel puțin 8 caractere.</p>
      </div>
      <section className="card space-y-4 p-5">
        <Input label="Parola actuală" type="password" autoComplete="current-password" required value={f.current} onChange={(e) => setF({ ...f, current: e.target.value })} />
        <Input label="Parola nouă" type="password" autoComplete="new-password" required value={f.next} onChange={(e) => setF({ ...f, next: e.target.value })} />
        <Input label="Confirmă parola nouă" type="password" autoComplete="new-password" required value={f.confirm} onChange={(e) => setF({ ...f, confirm: e.target.value })} />
        {error && <Notice kind="danger">{error}</Notice>}
      </section>
      <Button type="submit" loading={busy}>
        Schimbă parola
      </Button>
    </form>
  );
}
