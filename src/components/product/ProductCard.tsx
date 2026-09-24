import { Link } from 'react-router-dom';
import { ArrowRight, Heart } from 'lucide-react';
import type { Shape } from '@/data/shapes';
import { useFavorites } from '@/context/FavoritesContext';
import { useToast } from '@/context/ToastContext';
import { cls } from '@/lib/format';
import { TechDrawing } from './TechDrawing';

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
        'flex items-center justify-center rounded-full border bg-white/95 shadow-sm transition hover:scale-105',
        size === 'sm' ? 'h-8 w-8' : 'h-10 w-10',
        active ? 'border-brand-gold text-brand-gold' : 'border-line text-ink-soft hover:text-brand-gold',
        className,
      )}
    >
      <Heart className={cls(size === 'sm' ? 'h-4 w-4' : 'h-[18px] w-[18px]', active && 'fill-brand-gold')} />
    </button>
  );
}

/** Card de produs în stilul webshopului actual: desen 2D simplu, nume, descriere scurtă. */
export function ProductCard({ shape }: { shape: Shape }) {
  return (
    <article className="card group relative flex flex-col p-4 transition hover:-translate-y-0.5 hover:shadow-[0_2px_4px_rgba(20,20,20,.05),0_16px_32px_-12px_rgba(20,20,20,.22)] sm:p-5">
      <FavoriteButton slug={shape.slug} name={shape.name} size="sm" className="absolute right-3 top-3 z-10" />
      <div className="flex aspect-[16/9] items-center justify-center overflow-hidden rounded-lg bg-surface px-1">
        <TechDrawing shape={shape} />
      </div>
      <h3 className="mt-3 text-center text-[15px] font-semibold text-ink">
        <Link to={`/produse/${shape.slug}`} className="after:absolute after:inset-0 after:content-['']">
          {shape.name}
        </Link>
      </h3>
      <p className="mt-0.5 text-center text-xs text-muted">{shape.short}</p>
      <span className="mt-3 inline-flex items-center justify-center gap-1 text-[13px] font-semibold text-brand-bronze group-hover:underline">
        Configurează produsul <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
      </span>
    </article>
  );
}
