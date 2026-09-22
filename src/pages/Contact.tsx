import { useState, type FormEvent } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Breadcrumbs, Notice, PageHeader } from '@/components/ui/misc';
import { Input, Textarea, Checkbox, Select } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { WhatsAppIcon } from '@/components/layout/WhatsAppButton';
import { useToast } from '@/context/ToastContext';
import { SITE, telHref, whatsappUrl } from '@/config/site';

export function ContactPage() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: 'Ofertă / produse', message: '' });
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email) || form.message.trim().length < 5) return setError('Completează numele, un email valid și mesajul.');
    if (!agree) return setError('Este necesar acordul pentru prelucrarea datelor.');
    setError('');
    // În prototip mesajul este predat clientului de email; în producție → POST /api/contact
    const body = `Nume: ${form.name}\nEmail: ${form.email}\nTelefon: ${form.phone}\n\n${form.message}`;
    window.location.href = `mailto:${SITE.emails.direct}?subject=${encodeURIComponent(`[Webshop] ${form.subject}`)}&body=${encodeURIComponent(body)}`;
    setSent(true);
    toast('Solicitarea a fost transmisă cu succes.');
  };

  const item = 'flex items-center gap-3 rounded-lg border border-line bg-white px-4 py-3 text-sm font-semibold text-ink hover:border-ink/40';

  return (
    <div className="container-cm py-8">
      <Breadcrumbs items={[{ label: 'Contact' }]} />
      <PageHeader eyebrow="Contact" title="Echipa Color Metal îți răspunde" intro="Întrebări despre produse, oferte, cantități mari sau comenzi existente – alege canalul preferat." />

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="space-y-3">
          <a href={telHref(SITE.phones.callCenter)} className={item}>
            <Phone className="h-5 w-5 text-brand-gold-dark" />
            <span>
              Call center
              <span className="block font-normal text-muted">{SITE.phones.callCenter}</span>
            </span>
          </a>
          <a href={`mailto:${SITE.emails.direct}`} className={item}>
            <Mail className="h-5 w-5 text-brand-gold-dark" />
            <span>
              Email
              <span className="block font-normal text-muted">{SITE.emails.direct}</span>
            </span>
          </a>
          <a href={whatsappUrl()} target="_blank" rel="noreferrer" className={item}>
            <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
            <span>
              WhatsApp
              <span className="block font-normal text-muted">Mesaj precompletat, răspuns rapid</span>
            </span>
          </a>
          <div className="flex items-start gap-3 rounded-lg border border-line bg-surface px-4 py-3 text-sm">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-gold-dark" />
            <span>
              <span className="font-semibold">{SITE.headquarters.name}</span>
              <span className="block text-muted">{SITE.headquarters.address}</span>
            </span>
          </div>
        </div>

        <section className="card p-6">
          <h2 className="text-xl font-semibold">Trimite-ne un mesaj</h2>
          <p className="mt-1 text-sm text-muted">Pentru comenzi existente, menționează numărul comenzii primit pe email.</p>
          {sent ? (
            <Notice kind="success" className="mt-6">
              Mesajul a fost pregătit în clientul tău de email către {SITE.emails.direct}. Mulțumim!
            </Notice>
          ) : (
            <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Nume" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <Input label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <Input label="Telefon" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <Select label="Subiect" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
                  <option>Ofertă / produse</option>
                  <option>Comandă existentă</option>
                  <option>Post-vânzare / reclamație</option>
                  <option>Colaborare</option>
                </Select>
              </div>
              <Textarea label="Mesaj" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              <Checkbox checked={agree} onChange={(e) => setAgree(e.target.checked)} label="Sunt de acord cu prelucrarea datelor personale conform Politicii de confidențialitate." />
              {error && <Notice kind="danger">{error}</Notice>}
              <Button type="submit" size="lg">
                Trimite mesajul
              </Button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
