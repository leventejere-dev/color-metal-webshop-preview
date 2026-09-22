import { useState, type FormEvent } from 'react';
import { Briefcase, HeartHandshake, TrendingUp, Users } from 'lucide-react';
import { Breadcrumbs, Notice, PageHeader } from '@/components/ui/misc';
import { Input, Textarea, Checkbox, Select } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';
import { SITE } from '@/config/site';

/** Pagina de cariere: formular de aplicare (ca pe color-metal.ro/ro/cariere) + prezentare în tonul companiei. */
export function CareersPage() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', phone: '', city: '', area: '', message: '', cv: '' });
  const [agree, setAgree] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email) || !form.phone.trim()) return setError('Completează numele, un email valid și telefonul.');
    if (!agree) return setError('Este necesar acordul pentru prelucrarea datelor.');
    setError('');
    setSent(true);
    toast('Solicitarea a fost transmisă cu succes.');
  };

  return (
    <div className="container-cm py-8">
      <Breadcrumbs items={[{ label: 'Oportunități / Cariere' }]} />
      <PageHeader
        eyebrow="Oportunități / Cariere"
        title="Construiește-ți cariera alături de Color Metal"
        intro="De 20 de ani livrăm semifabricate din metale neferoase pentru industrii diverse. Creștem împreună cu oamenii noștri – în vânzări, logistică, debitare și suport tehnic, în cele trei centre din România."
      />

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {[
          { icon: Users, title: 'Echipă de experți', text: 'Lucrezi cu oameni care cunosc materialele și clienții din industrie.' },
          { icon: TrendingUp, title: 'Creștere', text: 'Companie în expansiune regională: România, Bulgaria, Ungaria, Serbia, Moldova.' },
          { icon: Briefcase, title: 'Stabilitate', text: '20 de ani de activitate și parteneriate solide cu producători recunoscuți.' },
          { icon: HeartHandshake, title: 'Profesionalism și flexibilitate', text: 'Valorile pe care le-am construit împreună cu clienții noștri.' },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="card p-5">
            <Icon className="h-5 w-5 text-brand-gold-dark" />
            <h3 className="mt-3 font-semibold">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-muted">{text}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <section className="card p-6">
          <h2 className="text-xl font-semibold">Aplică spontan</h2>
          <p className="mt-1 text-sm text-muted">
            Trimite-ne datele tale și CV-ul. Pozițiile deschise sunt publicate pe{' '}
            <a href={`${SITE.website}/ro/cariere`} target="_blank" rel="noreferrer" className="font-semibold text-brand-bronze underline-offset-2 hover:underline">
              color-metal.ro/ro/cariere
            </a>
            .
          </p>
          {sent ? (
            <Notice kind="success" className="mt-6">
              Mulțumim! Aplicația ta a fost înregistrată (demonstrativ). Echipa de resurse umane te va contacta.
            </Notice>
          ) : (
            <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Nume și prenume" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <Input label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <Input label="Telefon" type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <Input label="Oraș" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                <Select label="Aria de interes" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })}>
                  <option value="">Alege…</option>
                  <option>Vânzări / consultanță tehnică</option>
                  <option>Logistică și depozit</option>
                  <option>Debitare / producție</option>
                  <option>Administrativ / financiar</option>
                  <option>Altele</option>
                </Select>
                <Select label="Locație preferată" value={form.cv} onChange={(e) => setForm({ ...form, cv: e.target.value })}>
                  <option value="">Alege…</option>
                  <option>Odorheiu Secuiesc</option>
                  <option>București (Mogoșoaia)</option>
                  <option>Timișoara (Ghiroda)</option>
                </Select>
              </div>
              <Textarea label="Mesaj / experiență relevantă" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              <div>
                <label className="label" htmlFor="cv">
                  Curriculum vitae
                </label>
                <input id="cv" type="file" accept=".pdf,.doc,.docx,.odt,.txt,.rtf" className="mt-1.5 block w-full text-sm text-muted file:mr-3 file:rounded-lg file:border file:border-line file:bg-white file:px-3 file:py-2 file:text-sm file:font-semibold file:text-ink hover:file:bg-surface" />
                <p className="mt-1 text-xs text-muted">Un singur fișier: pdf, doc, docx, odt, txt, rtf (în prototip fișierul nu este încărcat).</p>
              </div>
              <Checkbox checked={agree} onChange={(e) => setAgree(e.target.checked)} label={`Sunt de acord ca datele mele să fie colectate și prelucrate de ${SITE.legalName} în scopul recrutării, conform Politicii de confidențialitate.`} />
              {error && <Notice kind="danger">{error}</Notice>}
              <Button type="submit" size="lg">
                Trimite aplicația
              </Button>
            </form>
          )}
        </section>

        <aside className="space-y-4">
          <div className="card p-5 text-sm">
            <h3 className="font-semibold">Unde lucrăm</h3>
            <ul className="mt-3 space-y-3">
              {SITE.locations.map((l) => (
                <li key={l.id}>
                  <p className="font-medium">{l.name}</p>
                  <p className="text-muted">{l.address}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="card bg-surface p-5 text-sm">
            <h3 className="font-semibold">Contact recrutare</h3>
            <p className="mt-1 text-muted">
              Întrebări despre poziții sau proces? Scrie-ne la{' '}
              <a href={`mailto:${SITE.emails.direct}`} className="font-semibold text-brand-bronze">
                {SITE.emails.direct}
              </a>{' '}
              sau sună la {SITE.phones.callCenter1}.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
