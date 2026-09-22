import { Link } from 'react-router-dom';
import { ArrowRight, Heart } from 'lucide-react';
import type { Shape } from '@/data/shapes';
import { MATERIALS } from '@/data/materials';
import { useFavorites } from '@/context/FavoritesContext';
import { useToast } from '@/context/ToastContext';
import { asset, cls } from '@/lib/format';

export function FavoriteButton({ slug, name, size = 'md', className }: { slug: string; name: string; size?: 'sm' | 'md'; className?: string }) {
  const { has, toggle } = useFavorites();
  const { toast } = useToast();
  const active = has(slug);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const next = toggle(slug);
        toast(next ? `${name} a fost adăugat la favorite.` : `${name} a fost eliminat din favorite.`, {
          kind: next ? 'success' : 'info',
          cta: next ? { label: 'Vezi favoritele', to: '/favorite' } : undefined,
        });
      }}
      aria-pressed={active}
      aria-label={active ? `Elimină ${name} din favorite` : `Adaugă ${name} la favorite`}
      title={active ? 'Elimină din favorite' : 'Adaugă la favorite'}
      className={cls(
        'flex items-center justify-center rounded-full border bg-white/95 shadow-sm backdrop-blur transition hover:scale-105',
        size === 'sm' ? 'h-9 w-9' : 'h-10 w-10',
        active ? 'border-brand-gold text-brand-gold' : 'border-line text-ink-soft hover:text-brand-gold',
        className,
      )}
    >
      <Heart className={cls('h-[18px] w-[18px]', active && 'fill-brand-gold')} />
    </button>
  );
}

export function ProductCard({ shape }: { shape: Shape }) {
  return (
    <article className="card group relative flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-[0_2px_4px_rgba(20,20,20,.05),0_16px_32px_-12px_rgba(20,20,20,.22)]">
      <Link to={`/produse/${shape.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-surface">
        <img src={asset(shape.images.card)} alt={shape.images.closeAlt} loading="lazy" width={640} height={480} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
        <img src={asset(shape.images.icon)} alt="" className="absolute bottom-3 left-3 h-9 w-9 rounded-md bg-ink/70 p-1.5 backdrop-blur-sm" aria-hidden="true" />
      </Link>
      <FavoriteButton slug={shape.slug} name={shape.name} size="sm" className="absolute right-3 top-3" />
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-semibold text-ink">
          <Link to={`/produse/${shape.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {shape.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-muted">{shape.short}</p>
        <p className="mt-2 text-xs text-muted">
          {shape.materials.map((m) => MATERIALS[m].label).join(' · ')}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-bronze group-hover:underline">
          Configurează produsul <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </article>
  );
}
