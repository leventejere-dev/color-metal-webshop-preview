import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Heart, LogOut, Menu, Package, Search, ShoppingCart, User as UserIcon, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { searchShapes } from '@/lib/search';
import { asset, cls } from '@/lib/format';
import { ShapeIcon } from '@/components/product/ShapeIcon';

const NAV = [
  { to: '/produse', label: 'Produse' },
  { to: '/alushop', label: 'AluShop' },
  { to: '/despre-noi', label: 'Despre noi' },
  { to: '/contact', label: 'Contact' },
];

const ACCOUNT_LINKS = [
  { to: '/cont', label: 'Contul meu' },
  { to: '/cont/comenzi', label: 'Comenzile mele' },
  { to: '/cont/facturi', label: 'Facturi' },
  { to: '/cont/favorite', label: 'Produse favorite' },
  { to: '/cont/date-contact', label: 'Date de contact' },
];

export function Header() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const { slugs } = useFavorites();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [focus, setFocus] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMenuOpen(false);
    setAccountOpen(false);
    setFocus(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const suggestions = useMemo(() => (query.trim().length >= 2 ? searchShapes(query).slice(0, 5) : []), [query]);

  const submitSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    navigate(`/cautare?q=${encodeURIComponent(q)}`);
    setQuery('');
  };

  const firstName = user?.name.split(' ')[0] ?? '';
  const linkCls = (isActive: boolean) => cls('whitespace-nowrap rounded-md px-2 py-1.5 text-[13px] font-medium transition hover:text-brand-bronze', isActive ? 'text-brand-bronze' : 'text-ink-soft');

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="container-cm flex h-14 items-center gap-2 lg:h-16 lg:gap-3">
        {/* Logo (mic) + Acasă */}
        <div className="flex shrink-0 items-center gap-2 lg:gap-3">
          <Link to="/" className="flex shrink-0 items-center" aria-label="Color Metal – Acasă">
            <img src={asset('/assets/brand/color-metal-logo.png')} alt="Color Metal – Partner in engineering" className="h-3.5 w-auto sm:h-4 lg:h-[18px]" width={1200} height={158} />
          </Link>
          <NavLink to="/" end className={({ isActive }) => cls('hidden whitespace-nowrap rounded-md px-2 py-1.5 text-[13px] font-semibold transition hover:text-brand-bronze md:block', isActive ? 'text-brand-bronze' : 'text-ink')}>
            Acasă
          </NavLink>
        </div>

        {/* Navigare desktop */}
        <nav className="hidden shrink-0 items-center gap-0.5 lg:flex" aria-label="Navigare principală">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} className={({ isActive }) => linkCls(isActive)}>
              {n.label}
            </NavLink>
          ))}
        </nav>

        {/* Căutare */}
        <form onSubmit={submitSearch} className="relative ml-auto hidden w-full min-w-[140px] max-w-[200px] md:block xl:max-w-[260px]" role="search">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocus(true)}
            onBlur={() => setTimeout(() => setFocus(false), 150)}
            placeholder="Caută produse"
            aria-label="Caută produse"
            className="input h-9 pl-9 text-[13px]"
          />
          {focus && suggestions.length > 0 && (
            <ul className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-line bg-white shadow-[var(--shadow-card)]">
              {suggestions.map((s) => (
                <li key={s.id}>
                  <Link to={`/produse/${s.slug}`} className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-surface" onMouseDown={(e) => e.preventDefault()} onClick={() => setQuery('')}>
                    <ShapeIcon type={s.id} className="!h-9 !w-12 shrink-0 rounded" />
                    <span>
                      <span className="block font-medium">{s.name}</span>
                      <span className="block text-xs text-muted">{s.short}</span>
                    </span>
                  </Link>
                </li>
              ))}
              <li className="border-t border-line">
                <button type="submit" className="w-full px-3 py-2 text-left text-xs font-semibold text-brand-bronze hover:bg-surface" onMouseDown={(e) => e.preventDefault()}>
                  Vezi toate rezultatele pentru „{query.trim()}”
                </button>
              </li>
            </ul>
          )}
        </form>

        {/* Cont + RO + favorite + coș */}
        <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1 md:ml-0">
          {user ? (
            <div className="relative hidden md:block" ref={accountRef}>
              <button onClick={() => setAccountOpen((o) => !o)} className="flex h-9 items-center gap-1.5 rounded-lg border border-line px-2.5 text-[13px] font-semibold hover:bg-surface" aria-haspopup="menu" aria-expanded={accountOpen}>
                <UserIcon className="h-4 w-4" />
                <span className="hidden max-w-[7rem] truncate xl:inline">{firstName}</span>
                <ChevronDown className="h-3.5 w-3.5 text-muted" />
              </button>
              {accountOpen && (
                <div className="absolute right-0 top-full z-50 mt-1 w-56 overflow-hidden rounded-xl border border-line bg-white py-1 shadow-[var(--shadow-card)]" role="menu">
                  {ACCOUNT_LINKS.map((l) => (
                    <Link key={l.to} to={l.to} className="block px-4 py-2 text-sm hover:bg-surface" role="menuitem">
                      {l.label}
                    </Link>
                  ))}
                  <button onClick={() => void logout().then(() => navigate('/'))} className="flex w-full items-center gap-2 border-t border-line px-4 py-2 text-left text-sm text-danger hover:bg-surface" role="menuitem">
                    <LogOut className="h-4 w-4" /> Ieșire din cont
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="hidden items-center xl:flex">
                <Link to="/autentificare" className="whitespace-nowrap rounded-md px-2 py-1.5 text-[13px] font-semibold text-ink hover:text-brand-bronze">
                  Autentificare
                </Link>
                <Link to="/inregistrare" className="whitespace-nowrap rounded-md px-2 py-1.5 text-[13px] font-semibold text-brand-bronze hover:underline">
                  Înregistrare
                </Link>
              </div>
              <Link to="/autentificare" className="hidden h-9 w-9 items-center justify-center rounded-lg hover:bg-surface md:flex xl:hidden" aria-label="Autentificare / Înregistrare">
                <UserIcon className="h-5 w-5" />
              </Link>
            </>
          )}

          <Link to="/favorite" className="relative flex h-9 w-9 items-center justify-center rounded-lg hover:bg-surface" aria-label={`Favorite (${slugs.length})`}>
            <Heart className={cls('h-5 w-5', slugs.length > 0 && 'fill-brand-gold text-brand-gold')} />
            {slugs.length > 0 && <span className="absolute -right-0.5 -top-0.5 min-w-[18px] rounded-full bg-ink px-1 text-center text-[10px] font-bold leading-[18px] text-white">{slugs.length}</span>}
          </Link>

          <Link to="/cos" className="flex h-9 items-center gap-1.5 rounded-lg bg-brand-bronze px-2.5 text-[13px] font-semibold text-white hover:bg-brand-bronze-dark sm:px-3" aria-label={`Coș (${count})`}>
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Coș</span>
            <span className="rounded-full bg-white/20 px-1.5 text-xs tabular-nums">{count}</span>
          </Link>

          <button onClick={() => setMenuOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-surface lg:hidden" aria-label="Deschide meniul">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Meniu mobil */}
      {menuOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Meniu">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <img src={asset('/assets/brand/color-metal-logo.png')} alt="Color Metal" className="h-5 w-auto" />
              <button onClick={() => setMenuOpen(false)} className="rounded-lg p-2 hover:bg-surface" aria-label="Închide meniul">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={submitSearch} className="border-b border-line p-4" role="search">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Caută produse" aria-label="Caută produse" className="input h-11 pl-9" />
              </div>
            </form>
            <nav className="flex-1 overflow-y-auto p-2" aria-label="Navigare mobilă">
              <NavLink to="/" end className={({ isActive }) => cls('block rounded-lg px-3 py-2.5 text-[15px] font-semibold', isActive ? 'bg-surface text-brand-bronze' : 'text-ink')}>
                Acasă
              </NavLink>
              {NAV.map((n) => (
                <NavLink key={n.to} to={n.to} className={({ isActive }) => cls('block rounded-lg px-3 py-2.5 text-[15px] font-medium', isActive ? 'bg-surface text-brand-bronze' : 'text-ink')}>
                  {n.label}
                </NavLink>
              ))}
              <div className="my-2 border-t border-line" />
              <Link to="/favorite" className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-[15px] font-medium">
                <Heart className="h-4 w-4" /> Favorite ({slugs.length})
              </Link>
              <Link to="/cos" className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-[15px] font-medium">
                <ShoppingCart className="h-4 w-4" /> Coș ({count})
              </Link>
              <div className="my-2 border-t border-line" />
              {user ? (
                <>
                  <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-muted">Bună, {firstName}</p>
                  {ACCOUNT_LINKS.map((l) => (
                    <Link key={l.to} to={l.to} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-[15px] font-medium">
                      <Package className="h-4 w-4 text-muted" /> {l.label}
                    </Link>
                  ))}
                  <button onClick={() => void logout().then(() => navigate('/'))} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-[15px] font-medium text-danger">
                    <LogOut className="h-4 w-4" /> Ieșire din cont
                  </button>
                </>
              ) : (
                <div className="flex gap-2 p-2">
                  <Link to="/autentificare" className="flex h-11 flex-1 items-center justify-center rounded-lg border border-line text-sm font-semibold">
                    Autentificare
                  </Link>
                  <Link to="/inregistrare" className="flex h-11 flex-1 items-center justify-center rounded-lg bg-ink text-sm font-semibold text-white">
                    Înregistrare
                  </Link>
                </div>
              )}
            </nav>
            <p className="border-t border-line px-4 py-3 text-xs text-muted">Color Metal Webshop</p>
          </div>
        </div>
      )}
    </header>
  );
}
