import { Navigate, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FileText, Heart, KeyRound, LogOut, MapPin, Package, Settings, User, UserCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Breadcrumbs } from '@/components/ui/misc';
import { cls } from '@/lib/format';

export const ACCOUNT_NAV = [
  { to: '/cont', label: 'Contul meu', icon: UserCircle2, end: true },
  { to: '/cont/comenzi', label: 'Comenzile mele', icon: Package },
  { to: '/cont/facturi', label: 'Facturi', icon: FileText },
  { to: '/cont/favorite', label: 'Produse favorite', icon: Heart },
  { to: '/cont/date-contact', label: 'Date de contact', icon: User },
  { to: '/cont/adresa-livrare', label: 'Adresa de livrare', icon: MapPin },
  { to: '/cont/setari', label: 'Setări cont', icon: Settings },
  { to: '/cont/schimbare-parola', label: 'Schimbare parolă', icon: KeyRound },
];

export function AccountLayout() {
  const { user, ready, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!ready) return <div className="container-cm py-16 text-center text-muted">Se încarcă…</div>;
  if (!user) return <Navigate to={`/autentificare?next=${encodeURIComponent(location.pathname)}`} replace />;

  const current = ACCOUNT_NAV.find((n) => (n.end ? location.pathname === n.to : location.pathname.startsWith(n.to)));

  return (
    <div className="container-cm py-8">
      <Breadcrumbs items={[{ label: 'Contul meu', to: '/cont' }, ...(current && !current.end ? [{ label: current.label }] : [])]} />
      <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside>
          <div className="card p-4">
            <div className="flex items-center gap-3 border-b border-line px-2 pb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-gold-light text-base font-bold text-brand-gold-dark">
                {user.name
                  .split(' ')
                  .slice(0, 2)
                  .map((p) => p[0])
                  .join('')
                  .toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold">{user.name}</p>
                <p className="truncate text-xs text-muted">{user.email}</p>
              </div>
            </div>
            <nav className="mt-3 flex flex-col gap-0.5" aria-label="Meniu cont">
              {ACCOUNT_NAV.map(({ to, label, icon: Icon, end }) => (
                <NavLink key={to} to={to} end={end} className={({ isActive }) => cls('flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition', isActive ? 'bg-ink text-white' : 'text-ink-soft hover:bg-surface')}>
                  <Icon className="h-4 w-4" /> {label}
                </NavLink>
              ))}
              <button onClick={() => void logout().then(() => navigate('/'))} className="mt-2 flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-danger hover:bg-danger/5">
                <LogOut className="h-4 w-4" /> Ieșire din cont
              </button>
            </nav>
          </div>
        </aside>
        <section className="min-w-0">
          <Outlet />
        </section>
      </div>
    </div>
  );
}
