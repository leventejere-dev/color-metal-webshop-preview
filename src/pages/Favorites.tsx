import { Link } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';
import { useFavorites } from '@/context/FavoritesContext';
import { useAuth } from '@/context/AuthContext';
import { SHAPE_BY_SLUG } from '@/data/shapes';
import { MATERIALS } from '@/data/materials';
import { ButtonLink } from '@/components/ui/Button';
import { Breadcrumbs, EmptyState, Notice, PageHeader } from '@/components/ui/misc';
import { TechDrawing } from '@/components/product/TechDrawing';

/** Listă de favorite – folosită atât la /favorite (public) cât și în cont (/cont/favorite). */
export function FavoritesList({ embedded }: { embedded?: boolean }) {
  const { slugs, remove } = useFavorites();
  const { user } = useAuth();
  const shapes = slugs.map((s) => SHAPE_BY_SLUG[s]).filter(Boolean);

  return (
    <div>
      {embedded ? (
        <div>
          <h1 className="text-2xl font-semibold">Produse favorite</h1>
          <p className="mt-1 text-sm text-muted">Formele de produs salvate pentru configurare rapidă.</p>
        </div>
      ) : (
        <PageHeader eyebrow="Favorite" title="Produse favorite" intro="Formele de produs salvate. Configurează-le direct din listă." />
      )}

      {!user && !embedded && (
        <Notice className="mt-4">
          Favoritele sunt salvate pe acest dispozitiv.{' '}
          <Link to="/autentificare?next=/favorite" className="font-semibold text-brand-bronze underline-offset-2 hover:underline">
            Autentifică-te
          </Link>{' '}
          pentru a le păstra în cont.
        </Notice>
      )}

      {shapes.length === 0 ? (
        <div className="mt-6">
          <EmptyState icon={<Heart className="h-6 w-6" />} title="Nu ai produse salvate." text="Apasă inima de pe orice produs pentru a-l adăuga aici." action={<ButtonLink to="/produse">Vezi produsele</ButtonLink>} />
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {shapes.map((s) => (
            <li key={s.id} className="card flex items-center gap-4 p-3 sm:p-4">
              <Link to={`/produse/${s.slug}`} className="shrink-0">
                <span className="flex h-16 w-24 items-center justify-center overflow-hidden rounded-lg bg-surface px-1.5">
                  <TechDrawing shape={s} />
                </span>
              </Link>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold">
                  <Link to={`/produse/${s.slug}`} className="hover:text-brand-bronze">
                    {s.name}
                  </Link>
                </h3>
                <p className="text-sm text-muted">{s.short}</p>
                <p className="mt-0.5 text-xs text-muted">{s.materials.map((m) => MATERIALS[m].label).join(' · ')}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-center">
                <ButtonLink to={`/produse/${s.slug}`} size="sm">
                  Configurează
                </ButtonLink>
                <button onClick={() => remove(s.slug)} className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-danger hover:bg-danger/5" aria-label={`Elimină ${s.name} din favorite`}>
                  <Trash2 className="h-4 w-4" /> <span className="hidden sm:inline">Elimină</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function FavoritesPage() {
  return (
    <div className="container-cm py-8">
      <Breadcrumbs items={[{ label: 'Favorite' }]} />
      <FavoritesList />
    </div>
  );
}
