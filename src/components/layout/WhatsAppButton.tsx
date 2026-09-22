import { whatsappUrl } from '@/config/site';

/** Icon WhatsApp (SVG inline, fără dependențe externe) */
export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" fill="currentColor">
      <path d="M16.04 3C9.02 3 3.32 8.7 3.32 15.72c0 2.44.69 4.8 2 6.85L3.2 28.9l6.5-2.06a12.7 12.7 0 0 0 6.34 1.68c7.02 0 12.72-5.7 12.72-12.72S23.06 3 16.04 3Zm0 23.2c-1.98 0-3.92-.53-5.6-1.54l-.4-.24-3.86 1.22 1.26-3.76-.26-.39a10.4 10.4 0 0 1-1.6-5.57c0-5.78 4.7-10.48 10.46-10.48 5.78 0 10.48 4.7 10.48 10.48 0 5.78-4.7 10.48-10.48 10.48Zm5.75-7.84c-.31-.16-1.86-.92-2.15-1.02-.29-.1-.5-.16-.7.16-.21.31-.81 1.02-.99 1.23-.18.21-.37.24-.68.08-.31-.16-1.33-.49-2.53-1.56-.94-.83-1.57-1.86-1.75-2.18-.18-.31-.02-.48.14-.64.14-.14.31-.37.47-.55.16-.18.21-.31.31-.52.1-.21.05-.39-.03-.55-.08-.16-.7-1.7-.96-2.33-.25-.61-.51-.53-.7-.54h-.6c-.21 0-.55.08-.83.39-.29.31-1.1 1.07-1.1 2.61s1.12 3.03 1.28 3.24c.16.21 2.21 3.37 5.35 4.72.75.32 1.33.52 1.79.66.75.24 1.43.21 1.97.13.6-.09 1.86-.76 2.12-1.5.26-.73.26-1.36.18-1.5-.08-.13-.29-.21-.6-.37Z" />
    </svg>
  );
}

export function WhatsAppButton() {
  return (
    <a
      href={whatsappUrl()}
      target="_blank"
      rel="noreferrer"
      className="no-print group fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_-6px_rgba(37,211,102,.7)] transition hover:scale-105 hover:bg-[#1ebe5b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] sm:bottom-6 sm:right-6"
      aria-label="Contactează-ne pe WhatsApp"
      title="Contactează-ne pe WhatsApp"
    >
      <WhatsAppIcon className="h-8 w-8" />
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-ink px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow transition group-hover:opacity-100 sm:block">
        Scrie-ne pe WhatsApp
      </span>
    </a>
  );
}
