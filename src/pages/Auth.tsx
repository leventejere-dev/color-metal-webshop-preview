import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Input, Checkbox } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { Notice } from '@/components/ui/misc';
import { DEMO_USER } from '@/data/demo';

function useNext() {
  const [params] = useSearchParams();
  const next = params.get('next');
  return next && next.startsWith('/') ? next : '/cont';
}

export function LoginPage() {
  const { user, ready, login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const next = useNext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (ready && user) return <Navigate to={next} replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const u = await login(email, password);
      toast(`Bine ai revenit, ${u.name.split(' ')[0]}!`);
      navigate(next, { replace: true });
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  };

  return (
    <div className="container-cm max-w-md py-12">
      <p className="eyebrow">Cont client</p>
      <h1 className="mt-1 text-3xl font-semibold">Autentificare</h1>
      <p className="mt-2 text-sm text-muted">Intră în cont pentru comenzi, facturi, favorite și date de livrare.</p>

      <form onSubmit={submit} className="card mt-6 space-y-4 p-6" noValidate>
        <Input label="Email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="Parolă" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <Notice kind="danger">{error}</Notice>}
        <Button type="submit" size="lg" full loading={busy}>
          Intră în cont
        </Button>
        <p className="text-center text-sm text-muted">
          Nu ai cont?{' '}
          <Link to={`/inregistrare${next !== '/cont' ? `?next=${encodeURIComponent(next)}` : ''}`} className="font-semibold text-brand-bronze hover:underline">
            Creează cont
          </Link>
        </p>
      </form>

      <div className="mt-4 rounded-xl border border-dashed border-line bg-surface p-4 text-sm">
        <p className="font-semibold">Cont demonstrativ</p>
        <p className="mt-1 text-muted">
          Email: <code className="rounded bg-white px-1.5 py-0.5">{DEMO_USER.email}</code> · Parolă: <code className="rounded bg-white px-1.5 py-0.5">{DEMO_USER.password}</code>
        </p>
        <button
          type="button"
          onClick={() => {
            setEmail(DEMO_USER.email);
            setPassword(DEMO_USER.password);
          }}
          className="mt-2 text-xs font-semibold text-brand-bronze hover:underline"
        >
          Completează datele demo
        </button>
      </div>
    </div>
  );
}

export function RegisterPage() {
  const { user, ready, register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const next = useNext();
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', cui: '', password: '', confirm: '' });
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  if (ready && user) return <Navigate to={next} replace />;

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (form.name.trim().length < 3) err.name = 'Introdu numele complet.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) err.email = 'Adresa de email nu este validă.';
    if (form.phone.trim().length < 6) err.phone = 'Introdu un număr de telefon valid.';
    if (form.password.length < 8) err.password = 'Parola trebuie să aibă cel puțin 8 caractere.';
    if (form.password !== form.confirm) err.confirm = 'Parolele nu coincid.';
    if (form.company && !form.cui) err.cui = 'Completează CUI-ul pentru facturare pe firmă.';
    if (!agree) err.agree = 'Este necesar acordul pentru prelucrarea datelor.';
    setErrors(err);
    if (Object.keys(err).length) return;
    setBusy(true);
    try {
      const u = await register({ name: form.name, email: form.email, phone: form.phone, company: form.company, cui: form.cui, password: form.password });
      toast(`Contul a fost creat. Bine ai venit, ${u.name.split(' ')[0]}!`);
      navigate(next, { replace: true });
    } catch (e2) {
      setErrors({ form: (e2 as Error).message });
      setBusy(false);
    }
  };

  return (
    <div className="container-cm max-w-lg py-12">
      <p className="eyebrow">Cont client</p>
      <h1 className="mt-1 text-3xl font-semibold">Creează cont</h1>
      <p className="mt-2 text-sm text-muted">După înregistrare ești autentificat automat și poți salva favorite, adrese și vedea istoricul comenzilor.</p>

      <form onSubmit={submit} className="card mt-6 space-y-4 p-6" noValidate>
        <Input label="Nume și prenume" required autoComplete="name" value={form.name} onChange={set('name')} error={errors.name} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Email" type="email" required autoComplete="email" value={form.email} onChange={set('email')} error={errors.email} />
          <Input label="Telefon" type="tel" required autoComplete="tel" value={form.phone} onChange={set('phone')} error={errors.phone} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Companie" autoComplete="organization" value={form.company} onChange={set('company')} hint="Completează doar dacă facturezi pe firmă." />
          <Input label="CUI" value={form.cui} onChange={set('cui')} error={errors.cui} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Parolă" type="password" required autoComplete="new-password" value={form.password} onChange={set('password')} error={errors.password} hint="Minimum 8 caractere." />
          <Input label="Confirmă parola" type="password" required autoComplete="new-password" value={form.confirm} onChange={set('confirm')} error={errors.confirm} />
        </div>
        <Checkbox
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          label={
            <>
              Sunt de acord cu prelucrarea datelor personale conform{' '}
              <Link to="/politica-de-confidentialitate" target="_blank" className="text-brand-bronze underline underline-offset-2">
                Politicii de confidențialitate
              </Link>{' '}
              și accept{' '}
              <Link to="/termeni-si-conditii" target="_blank" className="text-brand-bronze underline underline-offset-2">
                Termenii și condițiile
              </Link>
              .
            </>
          }
        />
        {errors.agree && <p className="text-xs text-danger">{errors.agree}</p>}
        {errors.form && <Notice kind="danger">{errors.form}</Notice>}
        <Button type="submit" size="lg" full loading={busy}>
          Creează cont
        </Button>
        <p className="text-center text-sm text-muted">
          Ai deja cont?{' '}
          <Link to="/autentificare" className="font-semibold text-brand-bronze hover:underline">
            Intră în cont
          </Link>
        </p>
      </form>
    </div>
  );
}
