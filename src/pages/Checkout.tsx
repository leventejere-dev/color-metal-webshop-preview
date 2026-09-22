import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, CreditCard, FileText, Landmark, Lock, Truck, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { ordersApi } from '@/lib/api';
import type { Address, PaymentMethod } from '@/lib/types';
import { PaymentBadges } from '@/components/ui/PaymentBadges';
import { Input, Textarea, Checkbox } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { Breadcrumbs, Notice, PageHeader, SummaryRow } from '@/components/ui/misc';
import { SHAPE_BY_ID } from '@/data/shapes';
import { kg, money, cls } from '@/lib/format';
import { round2 } from '@/lib/pricing';
import { itemDescription } from './Cart';
import { write } from '@/lib/storage';

const emptyAddress = (): Address => ({ name: '', company: '', cui: '', street: '', city: '', county: '', postalCode: '', country: 'România', phone: '' });

const PAYMENTS: { id: PaymentMethod; label: string; text: string; icon: typeof Landmark }[] = [
  { id: 'transfer', label: 'Transfer bancar', text: 'Primești o factură proformă; comanda intră în producție după confirmarea plății.', icon: Landmark },
  { id: 'card', label: 'Card online', text: 'Plată securizată cu cardul prin NETOPIA Payments (Visa / Mastercard).', icon: CreditCard },
];

/* ---- card: formatare + validare (Luhn) – datele cardului nu sunt salvate nicăieri ---- */
const onlyDigits = (v: string) => v.replace(/\D/g, '');
const formatCard = (v: string) =>
  onlyDigits(v)
    .slice(0, 19)
    .replace(/(.{4})/g, '$1 ')
    .trim();
const formatExpiry = (v: string) => {
  const d = onlyDigits(v).slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};
const luhn = (num: string) => {
  let sum = 0;
  let dbl = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let n = Number(num[i]);
    if (dbl) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    dbl = !dbl;
  }
  return num.length >= 13 && sum % 10 === 0;
};
const cardBrand = (num: string) => (/^4/.test(num) ? 'Visa' : /^(5[1-5]|2[2-7])/.test(num) ? 'Mastercard' : null);
const expiryValid = (v: string) => {
  const m = /^(\d{2})\/(\d{2})$/.exec(v);
  if (!m) return false;
  const mm = Number(m[1]);
  const yy = 2000 + Number(m[2]);
  if (mm < 1 || mm > 12) return false;
  const now = new Date();
  return yy > now.getFullYear() || (yy === now.getFullYear() && mm >= now.getMonth() + 1);
};

export function CheckoutPage() {
  const { items, totals, clear, ready } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [legal, setLegal] = useState<'pf' | 'pj'>(user?.company ? 'pj' : 'pf');
  const [email, setEmail] = useState(user?.email ?? '');
  const [billing, setBilling] = useState<Address>(() => ({ ...emptyAddress(), ...(user?.billing ?? {}), name: user?.billing?.name || user?.name || '', phone: user?.billing?.phone || user?.phone || '', company: user?.company ?? user?.billing?.company ?? '', cui: user?.cui ?? user?.billing?.cui ?? '' }));
  const [sameDelivery, setSameDelivery] = useState(!user?.delivery);
  const [delivery, setDelivery] = useState<Address>(() => ({ ...emptyAddress(), ...(user?.delivery ?? {}) }));
  const [payment, setPayment] = useState<PaymentMethod | null>(null);
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [notes, setNotes] = useState('');
  const [terms, setTerms] = useState({ custom: false, tc: false, gdpr: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (ready && items.length === 0 && !busy) navigate('/cos', { replace: true });
  }, [ready, items.length, busy, navigate]);

  // La încărcare directă a paginii, contul se încarcă după montare → preluăm datele când devin disponibile.
  useEffect(() => {
    if (!user || email) return;
    setEmail(user.email);
    setLegal(user.company ? 'pj' : 'pf');
    setBilling((b) => ({ ...b, ...(user.billing ?? {}), name: user.billing?.name || user.name, phone: user.billing?.phone || user.phone, company: user.company ?? user.billing?.company ?? '', cui: user.cui ?? user.billing?.cui ?? '' }));
    if (user.delivery) {
      setSameDelivery(false);
      setDelivery((d) => ({ ...d, ...user.delivery }));
    }
  }, [user, email]);

  const effectiveDelivery = useMemo<Address>(() => (sameDelivery ? { ...billing, company: undefined, cui: undefined } : delivery), [sameDelivery, billing, delivery]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!billing.name.trim()) e.name = 'Introdu numele complet.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) e.email = 'Adresa de email nu este validă.';
    if (billing.phone.trim().length < 6) e.phone = 'Introdu un număr de telefon.';
    if (legal === 'pj') {
      if (!billing.company?.trim()) e.company = 'Introdu denumirea companiei.';
      if (!billing.cui?.trim()) e.cui = 'Introdu CUI-ul companiei.';
    }
    if (!billing.street.trim()) e.street = 'Introdu adresa.';
    if (!billing.city.trim()) e.city = 'Introdu localitatea.';
    if (!billing.county.trim()) e.county = 'Introdu județul.';
    if (!sameDelivery) {
      if (!delivery.name.trim()) e.dname = 'Introdu numele destinatarului.';
      if (!delivery.street.trim()) e.dstreet = 'Introdu adresa de livrare.';
      if (!delivery.city.trim()) e.dcity = 'Introdu localitatea.';
      if (!delivery.county.trim()) e.dcounty = 'Introdu județul.';
    }
    if (!payment) e.payment = 'Alege o metodă de plată.';
    if (payment === 'card') {
      const num = onlyDigits(card.number);
      if (!luhn(num)) e.cardNumber = 'Numărul cardului nu este valid.';
      if (!expiryValid(card.expiry)) e.cardExpiry = 'Data expirării nu este validă (LL/AA).';
      if (!/^\d{3,4}$/.test(card.cvv)) e.cardCvv = 'Codul CVV are 3–4 cifre.';
      if (card.name.trim().length < 3) e.cardName = 'Introdu numele de pe card.';
    }
    if (!terms.custom || !terms.tc || !terms.gdpr) e.terms = 'Bifează toate confirmările pentru a continua.';
    setErrors(e);
    if (Object.keys(e).length) {
      const first = document.querySelector('[data-error="true"]');
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return Object.keys(e).length === 0;
  };

  const placeOrder = async (mode: 'order' | 'proforma') => {
    if (!validate() || !payment) return;
    setBusy(true);
    try {
      const order = await ordersApi.create({
        userId: user?.id ?? null,
        items,
        payment,
        cardLast4: payment === 'card' ? onlyDigits(card.number).slice(-4) : undefined,
        billing: { ...billing, company: legal === 'pj' ? billing.company : undefined, cui: legal === 'pj' ? billing.cui : undefined },
        delivery: effectiveDelivery,
        customerEmail: email.trim().toLowerCase(),
        notes: notes.trim() || undefined,
      });
      write('lastOrder', order.id);
      clear();
      toast(payment === 'card' ? 'Plata a fost procesată prin NETOPIA Payments (simulare). Comanda a fost înregistrată.' : 'Comanda a fost înregistrată cu succes.', { cta: { label: 'Vezi comanda', to: `/comanda/${order.id}` } });
      navigate(mode === 'proforma' ? `/proforma/${order.id}` : `/comanda/${order.id}`);
    } catch (err) {
      toast((err as Error).message || 'A apărut o eroare temporară. Te rugăm să încerci din nou.', { kind: 'warning' });
      setBusy(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void placeOrder('order');
  };

  const addrFields = (a: Address, set: (a: Address) => void, prefix: string) => (
    <div className="grid gap-4 sm:grid-cols-2">
      <Input label="Nume complet" required value={a.name} onChange={(e) => set({ ...a, name: e.target.value })} error={errors[`${prefix}name`]} data-error={!!errors[`${prefix}name`]} wrapClassName="sm:col-span-2" autoComplete="name" />
      <Input label="Stradă, număr, bloc, apartament" required value={a.street} onChange={(e) => set({ ...a, street: e.target.value })} error={errors[`${prefix}street`]} data-error={!!errors[`${prefix}street`]} wrapClassName="sm:col-span-2" autoComplete="street-address" />
      <Input label="Localitate" required value={a.city} onChange={(e) => set({ ...a, city: e.target.value })} error={errors[`${prefix}city`]} data-error={!!errors[`${prefix}city`]} autoComplete="address-level2" />
      <Input label="Județ" required value={a.county} onChange={(e) => set({ ...a, county: e.target.value })} error={errors[`${prefix}county`]} data-error={!!errors[`${prefix}county`]} autoComplete="address-level1" />
      <Input label="Cod poștal" value={a.postalCode} onChange={(e) => set({ ...a, postalCode: e.target.value })} autoComplete="postal-code" />
      <Input label="Țară" value={a.country} onChange={(e) => set({ ...a, country: e.target.value })} autoComplete="country-name" />
      {prefix === 'd' && <Input label="Telefon destinatar" value={a.phone} onChange={(e) => set({ ...a, phone: e.target.value })} autoComplete="tel" />}
    </div>
  );

  return (
    <div className="container-cm py-8">
      <Breadcrumbs items={[{ label: 'Coș', to: '/cos' }, { label: 'Finalizare comandă' }]} />
      <PageHeader title="Finalizare comandă" intro="Completează datele de facturare și livrare, alege metoda de plată și trimite comanda." />

      {!user && (
        <Notice className="mt-6">
          Ai deja cont?{' '}
          <Link to="/autentificare?next=/finalizare-comanda" className="font-semibold text-brand-bronze underline-offset-2 hover:underline">
            Autentifică-te
          </Link>{' '}
          pentru a prelua automat datele și pentru a vedea comanda în istoricul contului.
        </Notice>
      )}

      <form onSubmit={onSubmit} noValidate className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)]">
        <div className="space-y-6">
          {/* 1. Facturare */}
          <section className="card p-5 sm:p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <User className="h-5 w-5 text-brand-gold-dark" /> 1. Date de facturare
            </h2>
            <div className="mt-4 flex gap-2">
              {(['pf', 'pj'] as const).map((k) => (
                <button key={k} type="button" onClick={() => setLegal(k)} className={cls('rounded-lg border px-4 py-2 text-sm font-semibold', legal === k ? 'border-ink bg-ink text-white' : 'border-line bg-white hover:border-ink/40')}>
                  {k === 'pf' ? 'Persoană fizică' : 'Persoană juridică'}
                </button>
              ))}
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} data-error={!!errors.email} autoComplete="email" />
              <Input label="Telefon" type="tel" required value={billing.phone} onChange={(e) => setBilling({ ...billing, phone: e.target.value })} error={errors.phone} data-error={!!errors.phone} autoComplete="tel" />
              {legal === 'pj' && (
                <>
                  <Input label="Companie" required value={billing.company ?? ''} onChange={(e) => setBilling({ ...billing, company: e.target.value })} error={errors.company} data-error={!!errors.company} autoComplete="organization" />
                  <Input label="CUI" required value={billing.cui ?? ''} onChange={(e) => setBilling({ ...billing, cui: e.target.value })} error={errors.cui} data-error={!!errors.cui} />
                </>
              )}
            </div>
            <div className="mt-4">{addrFields(billing, setBilling, '')}</div>
          </section>

          {/* 2. Livrare */}
          <section className="card p-5 sm:p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Truck className="h-5 w-5 text-brand-gold-dark" /> 2. Adresă de livrare
            </h2>
            <div className="mt-4">
              <Checkbox label="Livrare la adresa de facturare" checked={sameDelivery} onChange={(e) => setSameDelivery(e.target.checked)} />
            </div>
            {!sameDelivery && <div className="mt-4">{addrFields(delivery, setDelivery, 'd')}</div>}
            <p className="mt-3 text-xs text-muted">Costul transportului este calculat în funcție de greutate și destinație și se comunică la confirmarea comenzii.</p>
          </section>

          {/* 3. Plată */}
          <section className="card p-5 sm:p-6" data-error={!!errors.payment}>
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <CreditCard className="h-5 w-5 text-brand-gold-dark" /> 3. Metodă de plată
            </h2>
            <p className="mt-1 text-sm text-muted">Plata se face în avans – card online sau transfer bancar. Nu se acceptă plata ramburs.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {PAYMENTS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPayment(p.id)}
                  aria-pressed={payment === p.id}
                  className={cls('flex flex-col gap-2 rounded-xl border p-4 text-left transition', payment === p.id ? 'border-brand-gold ring-2 ring-brand-gold/30' : 'border-line hover:border-ink/40')}
                >
                  <p.icon className="h-5 w-5 text-brand-gold-dark" />
                  <span className="font-semibold">{p.label}</span>
                  <span className="text-xs leading-5 text-muted">{p.text}</span>
                </button>
              ))}
            </div>
            {errors.payment && <p className="mt-2 text-xs text-danger">{errors.payment}</p>}

            {payment === 'card' && (
              <div className="mt-5 rounded-xl border border-[#1c3f95]/25 bg-[#f4f7fc] p-5" data-error={!!(errors.cardNumber || errors.cardExpiry || errors.cardCvv || errors.cardName)}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">Plată cu cardul</h3>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
                      <Lock className="h-3.5 w-3.5" /> Procesată securizat de NETOPIA Payments. Datele cardului nu sunt salvate în webshop.
                    </p>
                  </div>
                  <PaymentBadges />
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Input
                      label="Număr card"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      placeholder="1234 5678 9012 3456"
                      value={card.number}
                      onChange={(e) => setCard({ ...card, number: formatCard(e.target.value) })}
                      error={errors.cardNumber}
                      hint={cardBrand(onlyDigits(card.number)) ?? undefined}
                    />
                  </div>
                  <Input label="Data expirării (LL/AA)" inputMode="numeric" autoComplete="cc-exp" placeholder="LL/AA" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })} error={errors.cardExpiry} />
                  <Input label="CVV" inputMode="numeric" autoComplete="cc-csc" type="password" placeholder="•••" maxLength={4} value={card.cvv} onChange={(e) => setCard({ ...card, cvv: onlyDigits(e.target.value).slice(0, 4) })} error={errors.cardCvv} />
                  <div className="sm:col-span-2">
                    <Input label="Nume pe card" autoComplete="cc-name" placeholder="NUME PRENUME" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value.toUpperCase() })} error={errors.cardName} />
                  </div>
                </div>
                <p className="mt-3 text-[11px] text-muted">Suma de {money(totals.grossRon)} va fi debitată de pe card la trimiterea comenzii. Prototip: plata este simulată, fără procesator real.</p>
              </div>
            )}

            {payment === 'transfer' && (
              <div className="mt-5 rounded-xl border border-brand-gold/40 bg-brand-gold-light/40 p-5">
                <div className="flex items-start gap-3">
                  <FileText className="mt-0.5 h-5 w-5 shrink-0 text-brand-gold-dark" />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold">Factură proformă</h3>
                    <p className="mt-1 text-sm text-ink-soft">
                      Pentru plata prin transfer bancar generăm o proformă cu datele de mai jos. Comanda va fi procesată după confirmarea plății.
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                  <div className="rounded-lg bg-white p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">Cumpărător</p>
                    <p className="mt-1 font-medium">{legal === 'pj' && billing.company ? billing.company : billing.name || '—'}</p>
                    {legal === 'pj' && billing.cui && <p className="text-muted">CUI {billing.cui}</p>}
                    <p className="text-muted">{[billing.street, billing.city, billing.county].filter(Boolean).join(', ') || 'Adresă necompletată'}</p>
                    <p className="text-muted">{email || '—'} · {billing.phone || '—'}</p>
                  </div>
                  <div className="rounded-lg bg-white p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">Livrare</p>
                    <p className="mt-1 font-medium">{effectiveDelivery.name || '—'}</p>
                    <p className="text-muted">{[effectiveDelivery.street, effectiveDelivery.city, effectiveDelivery.county].filter(Boolean).join(', ') || 'Adresă necompletată'}</p>
                  </div>
                </div>

                <table className="mt-4 w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wide text-muted">
                      <th className="py-1.5 font-semibold">Produs</th>
                      <th className="py-1.5 text-right font-semibold">Cant.</th>
                      <th className="py-1.5 text-right font-semibold">Preț / buc</th>
                      <th className="py-1.5 text-right font-semibold">Valoare</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line/70">
                    {items.map((it) => (
                      <tr key={it.id}>
                        <td className="py-2 pr-2">
                          <span className="font-medium">{SHAPE_BY_ID[it.shapeId].name}</span>
                          <span className="block text-xs text-muted">{itemDescription(it)} · {it.label.split(' – ').slice(1).join(' – ')}</span>
                        </td>
                        <td className="py-2 text-right tabular-nums">{it.quantity} buc</td>
                        <td className="py-2 text-right tabular-nums">{money(it.unitNetRon)}</td>
                        <td className="py-2 text-right tabular-nums">{money(round2(it.unitNetRon * it.quantity))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-2 ml-auto max-w-xs divide-y divide-line/70">
                  <SummaryRow label="Total fără TVA" value={money(totals.netRon)} />
                  <SummaryRow label="TVA 21%" value={money(totals.vatRon)} />
                  <SummaryRow label="Total de plată" value={money(totals.grossRon)} strong />
                </div>
                <Button type="button" className="mt-4" onClick={() => void placeOrder('proforma')} loading={busy}>
                  <FileText className="h-4 w-4" /> Generează proformă
                </Button>
                <p className="mt-2 text-xs text-muted">Generarea proformei înregistrează comanda cu statusul „Așteaptă plata” și deschide documentul pentru descărcare / tipărire.</p>
              </div>
            )}
          </section>

          {/* 4. Observații + confirmări */}
          <section className="card p-5 sm:p-6" data-error={!!errors.terms}>
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Building2 className="h-5 w-5 text-brand-gold-dark" /> 4. Observații și confirmări
            </h2>
            <div className="mt-4">
              <Textarea label="Observații pentru comandă (opțional)" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Ex.: interval orar de livrare, persoană de contact la recepție…" />
            </div>
            <div className="mt-4 space-y-3">
              <Checkbox label="Confirm că am citit și înțeles condițiile privind produsele personalizate (fără drept de retur, OUG 34/2014)." checked={terms.custom} onChange={(e) => setTerms({ ...terms, custom: e.target.checked })} />
              <Checkbox
                label={
                  <>
                    Am citit și accept{' '}
                    <Link to="/termeni-si-conditii" target="_blank" className="text-brand-bronze underline underline-offset-2">
                      Termenii și Condițiile
                    </Link>
                    .
                  </>
                }
                checked={terms.tc}
                onChange={(e) => setTerms({ ...terms, tc: e.target.checked })}
              />
              <Checkbox
                label={
                  <>
                    Sunt de acord cu prelucrarea datelor personale conform{' '}
                    <Link to="/politica-de-confidentialitate" target="_blank" className="text-brand-bronze underline underline-offset-2">
                      Politicii de confidențialitate
                    </Link>
                    .
                  </>
                }
                checked={terms.gdpr}
                onChange={(e) => setTerms({ ...terms, gdpr: e.target.checked })}
              />
              {errors.terms && <p className="text-xs text-danger">{errors.terms}</p>}
            </div>
          </section>
        </div>

        {/* Sumar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-5 sm:p-6">
            <h2 className="text-lg font-semibold">Sumar comandă</h2>
            <ul className="mt-3 divide-y divide-line text-sm">
              {items.map((it) => (
                <li key={it.id} className="flex justify-between gap-3 py-2">
                  <span className="min-w-0">
                    <span className="block font-medium">{SHAPE_BY_ID[it.shapeId].name} × {it.quantity}</span>
                    <span className="block truncate text-xs text-muted">{it.label.split(' – ').slice(1).join(' – ')}</span>
                  </span>
                  <span className="shrink-0 tabular-nums">{money(round2(it.unitNetRon * it.quantity))}</span>
                </li>
              ))}
            </ul>
            <div className="mt-2 divide-y divide-line">
              <SummaryRow label="Subtotal (fără TVA)" value={money(totals.netRon)} />
              <SummaryRow label="Greutate totală" value={kg(totals.weightKg)} />
              <SummaryRow label="TVA 21%" value={money(totals.vatRon)} />
              <SummaryRow label="Total cu TVA" value={money(totals.grossRon)} strong className="pt-3 text-base" />
            </div>
            <Button type="submit" size="lg" full className="mt-5" loading={busy}>
              {payment === 'card' ? `Plătește ${money(totals.grossRon)}` : 'Trimite comanda'}
            </Button>
            <p className="mt-3 text-[11px] leading-5 text-muted">Comanda va fi procesată după confirmarea plății. Prețurile afișate pot fi actualizate până la finalizarea comenzii.</p>
            <Link to="/cos" className="mt-3 block text-center text-sm text-muted hover:text-ink">
              Înapoi la coș
            </Link>
          </div>
        </aside>
      </form>
    </div>
  );
}
