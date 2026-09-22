import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { SITE, telHref } from '@/config/site';
import { asset } from '@/lib/format';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <div className="container-cm grid gap-10 py-12 md:grid-cols-3">
        <div>
          <img src={asset('/assets/brand/color-metal-logo.png')} alt="Color Metal – Partner in engineering" className="h-6 w-auto" />
          <p className="mt-4 max-w-xs text-sm leading-6 text-muted">Semifabricate din aluminiu, cupru, alamă și bronz, debitate la dimensiune.</p>
        </div>

        <div>
          <h3 className="eyebrow mb-3">Informații</h3>
          <ul className="space-y-1.5 text-sm">
            {[
              ['/despre-noi', 'Despre noi'],
              ['/contact', 'Contact'],
              ['/termeni-si-conditii', 'Termeni și condiții'],
              ['/politica-de-confidentialitate', 'Politica de confidențialitate'],
              ['/politica-de-retur', 'Politica de retur'],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="text-ink-soft hover:text-brand-bronze">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <h3 className="eyebrow mb-3 mt-6">Protecția consumatorului</h3>
          <ul className="space-y-1.5 text-sm">
            <li>
              <a href="https://anpc.ro/" target="_blank" rel="noreferrer" className="text-ink-soft hover:text-brand-bronze">
                ANPC
              </a>
            </li>
            <li>
              <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noreferrer" className="text-ink-soft hover:text-brand-bronze">
                SOL – Soluționarea online a litigiilor
              </a>
            </li>
            <li>
              <a href="https://legislatie.just.ro/Public/DetaliiDocument/257649" target="_blank" rel="noreferrer" className="text-ink-soft hover:text-brand-bronze">
                SAL – Soluționarea alternativă a litigiilor
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="eyebrow mb-3">Contact</h3>
          <ul className="space-y-2.5 text-sm text-ink-soft">
            <li className="flex gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold-dark" />
              <span>
                Call center:{' '}
                <a href={telHref(SITE.phones.callCenter)} className="hover:text-brand-bronze">
                  {SITE.phones.callCenter}
                </a>
              </span>
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold-dark" />
              <a href={`mailto:${SITE.emails.direct}`} className="hover:text-brand-bronze">
                {SITE.emails.direct}
              </a>
            </li>
            <li className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold-dark" />
              <span>{SITE.headquarters.address}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-cm flex flex-col gap-2 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {SITE.legalName}. Toate drepturile rezervate.</p>
          <p>Plăți online securizate · Prețuri afișate în lei, cu TVA 21% · RO</p>
        </div>
      </div>
    </footer>
  );
}
