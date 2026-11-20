import React from 'react';

export const WHATSAPP_NUMBER = '923222338001';

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const WhatsAppIcon: React.FC<{className?: string}> = ({className = 'w-6 h-6'}) => (
  <svg
    viewBox="0 0 32 32"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M16.01 2.67C8.65 2.67 2.68 8.64 2.68 16c0 2.35.62 4.64 1.78 6.66L2.58 29.5l7.01-1.84a13.28 13.28 0 0 0 6.42 1.65h.01c7.36 0 13.33-5.97 13.33-13.33 0-3.56-1.39-6.91-3.9-9.42a13.25 13.25 0 0 0-9.44-3.89Zm7.77 18.92c-.33.92-1.92 1.76-2.66 1.87-.69.1-1.56.14-2.51-.16-.58-.18-1.32-.43-2.27-.84-3.99-1.72-6.6-5.73-6.8-6-.2-.26-1.62-2.16-1.62-4.12 0-1.96 1.03-2.92 1.4-3.32.37-.4.8-.5 1.07-.5.27 0 .53 0 .76.01.24.01.57-.09.89.68.33.79 1.12 2.74 1.22 2.94.1.2.17.43.03.69-.13.26-.2.43-.4.66-.2.23-.42.52-.6.7-.2.2-.41.42-.17.82.23.4 1.04 1.71 2.23 2.77 1.53 1.37 2.83 1.79 3.23 1.99.4.2.63.17.87-.1.23-.27 1-.17 1.27.1.27.27.58.65.68.82.1.17.16.41.03.67Z" />
  </svg>
);

export const FloatingWhatsAppButton: React.FC = () => {
  const defaultHref =
    'https://wa.me/923222338001?text=Hello%20H.S%20Electronics%2C%20I%20have%20a%20question%20about%20a%20product';

  return (
    <div className="fixed bottom-5 right-5 z-40 group">
      <a
        href={defaultHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="relative w-[52px] h-[52px] rounded-full bg-[#25D366] hover:bg-[#1EBE5B] text-white shadow-[0_6px_20px_rgba(37,211,102,0.4)] flex items-center justify-center transition-transform duration-150 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
      >
        <WhatsAppIcon className="w-7 h-7" />

        {/* Subtle hover/focus tooltip */}
        <span
          role="tooltip"
          className="pointer-events-none absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-[#212121] text-white text-xs font-semibold whitespace-nowrap shadow-lg opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-focus-within:opacity-100 group-focus-within:translate-x-0 transition-all duration-150"
        >
          Chat with us
        </span>
      </a>
    </div>
  );
};
