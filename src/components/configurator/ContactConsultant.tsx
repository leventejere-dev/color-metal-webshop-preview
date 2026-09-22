import { Mail, Phone } from 'lucide-react';
import { SITE, telHref, whatsappUrl } from '@/config/site';
import { WhatsAppIcon } from '@/components/layout/WhatsAppButton';
import { cls } from '@/lib/format';

/** Opțiuni de contact funcționale (telefon, e-mail, WhatsApp) – folosite la cantități > 100 buc și la „Cere ofertă”. */
export function ContactConsultant({ subject, message }: { subject?: string; message?: string }) {
  const mail = `mailto:${SITE.emails.direct}?subject=${encodeURIComponent(subject ?? 'Solicitare ofertă – Color Metal Webshop')}${message ? `&body=${encodeURIComponent(message)}` : ''}`;
  const wa = whatsappUrl(message ? `${SITE.whatsapp.message}\n\n${message}` : SITE.whatsapp.message);
  const item = 'flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold text-ink hover:border-ink/40';
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      <a href={telHref(SITE.phones.callCenter)} className={item}>
        <Phone className="h-4 w-4 text-brand-gold-dark" /> {SITE.phones.callCenter}
      </a>
      <a href={mail} className={item}>
        <Mail className="h-4 w-4 text-brand-gold-dark" /> {SITE.emails.direct}
      </a>
      <a href={wa} target="_blank" rel="noreferrer" className={cls(item, 'border-[#25D366]/50')}>
        <WhatsAppIcon className="h-5 w-5 text-[#25D366]" /> WhatsApp
      </a>
    </div>
  );
}
