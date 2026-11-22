import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useSettings } from '@/context/SettingsContext';
import { formatPrice } from '@/lib/format';
import { buildOrderLink, buildOrderMessage } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';

/**
 * "Your list" — the clinic version of the bag. Nobody pays online and nobody
 * needs a size chart: the list is a way to walk in with an enquiry ready, so
 * the only action is a WhatsApp message with the chosen services.
 */
export function MiniCart() {
  const { items, isOpen, closeCart, setQuantity, removeItem, subtotal, count, clear } = useCart();
  const { settings } = useSettings();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeCart();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  const link = items.length ? buildOrderLink(settings, buildOrderMessage(settings, items)) : null;

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Your treatment list">
      <button
        type="button"
        aria-label="Close list"
        onClick={closeCart}
        className="absolute inset-0 bg-plum/65 backdrop-blur-[3px]"
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-gold-400/25 bg-white shadow-panel">
        <header className="flex items-center justify-between border-b border-gold-400/15 px-6 py-5">
          <div>
            <p className="eyebrow">Your list</p>
            <p className="mt-1 font-display text-2xl text-cream">
              {count} {count === 1 ? 'service' : 'services'}
            </p>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="p-2 text-muted transition-colors hover:text-gold-300"
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.3">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <p className="font-display text-2xl text-cream">Nothing on your list yet</p>
              <p className="max-w-[17rem] text-sm leading-relaxed text-muted">
                Add the treatments you are curious about, then send them to us — we will confirm timing
                and pricing on WhatsApp.
              </p>
              <Link to="/services" onClick={closeCart} className="btn-line mt-2">
                Browse treatments
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gold-400/10">
              {items.map((item) => (
                <li key={item.key} className="flex gap-4 py-5">
                  <Link
                    to={`/service/${item.slug}`}
                    onClick={closeCart}
                    className="w-20 shrink-0 bg-graphite"
                  >
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="aspect-[3/4] h-full w-full object-cover" />
                    ) : (
                      <div className="aspect-[3/4]" />
                    )}
                  </Link>

                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link
                          to={`/service/${item.slug}`}
                          onClick={closeCart}
                          className="font-display text-lg leading-tight text-cream hover:text-gold-300"
                        >
                          {item.name}
                        </Link>
                        {item.variantName ? (
                          <p className="mt-1 text-[9px] uppercase tracking-wide2 text-faint">
                            {item.variantName}
                          </p>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.key)}
                        className="text-[9px] uppercase tracking-wide2 text-faint transition-colors hover:text-wine-500"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-auto flex items-end justify-between gap-3 pt-3">
                      <div className="flex items-center border border-gold-400/20">
                        <button
                          type="button"
                          onClick={() => setQuantity(item.key, item.quantity - 1)}
                          className="h-8 w-8 text-muted transition-colors hover:text-gold-300"
                          aria-label={`Reduce ${item.name} quantity`}
                        >
                          −
                        </button>
                        <span className="w-7 text-center text-xs text-cream">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => setQuantity(item.key, item.quantity + 1)}
                          className="h-8 w-8 text-muted transition-colors hover:text-gold-300"
                          aria-label={`Increase ${item.name} quantity`}
                        >
                          +
                        </button>
                      </div>
                      <p className="text-xs text-gold-300/90">{formatPrice(item.unitPrice)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 ? (
          <footer className="border-t border-gold-400/15 px-6 py-5">
            <div className="flex items-baseline justify-between">
              <span className="eyebrow">Estimated total</span>
              <span className="font-display text-xl text-cream">{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-muted">
              Final pricing depends on session count and area treated — we confirm everything on{' '}
              {link?.channel === 'whatsapp' ? 'WhatsApp' : 'Instagram'} before your appointment.
            </p>

            {link ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent({ type: 'order_whatsapp_click' })}
                className="btn-solid mt-4 w-full"
              >
                {link.channel === 'whatsapp' ? 'Send enquiry on WhatsApp' : 'Send enquiry on Instagram'}
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            ) : null}

            <button
              type="button"
              onClick={clear}
              className="mt-3 w-full text-[10px] uppercase tracking-wide2 text-faint transition-colors hover:text-cream"
            >
              Clear list
            </button>
          </footer>
        ) : null}
      </aside>
    </div>
  );
}
