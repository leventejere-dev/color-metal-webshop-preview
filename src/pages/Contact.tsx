import { useState, type FormEvent } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Breadcrumbs, Notice, PageHeader } from '@/components/ui/misc';
import { Input, Textarea, Checkbox, Select } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { ContactConsultant } from '@/components/configurator/ContactConsultant';
import { useToast } from '@/context/ToastContext';
import { SITE, telHref } from '@/config/site';

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

  return (
    <div className="container-cm py-8">
      <Breadcrumbs items={[{ label: 'Contact' }]} />
      <PageHeader eyebrow="Contact" title="Echipa Color Metal îți răspunde" intro="Întrebări despre produse, oferte personalizate, cantități mari sau comenzi existente – alege canalul preferat." />

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)]">
        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="font-semibold">Call center</h2>
            <p className="mt-1 text-sm text-muted">Luni–vineri, pentru oferte, comenzi și informații tehnice.</p>
            <div className="mt-3 flex flex-wrap gap-2 text-sm font-semibold">
              <a href={telHref(SITE.phones.callCenter1)} className="inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 hover:border-ink/40">
                <Phone className="h-4 w-4 text-brand-gold-dark" /> {SITE.phones.callCenter1}
              </a>
              <a href={telHref(SITE.phones.callCenter2)} className="inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 hover:border-ink/40">
                <Phone className="h-4 w-4 text-brand-gold-dark" /> {SITE.phones.callCenter2}
              </a>
            </div>
          </div>

          {SITE.locations.map((l) => (
            <div key={l.id} className="card p-5 text-sm">
              <h2 className="font-semibold">{l.name}</h2>
              <ul className="mt-2 space-y-1.5 text-ink-soft">
                <li className="flex gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold-dark" /> {l.address}
                </li>
                <li className="flex gap-2">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold-dark" />
                  <a href={telHref(l.phone)} className="hover:text-brand-bronze">
                    {l.phone}
                  </a>
                </li>
                <li className="flex gap-2">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold-dark" />
                  <a href={`mailto:${l.email}`} className="hover:text-brand-bronze">
                    {l.email}
                  </a>
                </li>
              </ul>
            </div>
          ))}

          <div className="card bg-surface p-5">
            <h2 className="font-semibold">Contact rapid</h2>
            <p className="mt-1 text-sm text-muted">Telefon, email sau WhatsApp – cu mesaj precompletat.</p>
            <div className="mt-3">
              <ContactConsultant compact />
            </div>
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
