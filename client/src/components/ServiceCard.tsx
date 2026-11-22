import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { formatPrice, truncate } from '@/lib/format';
import type { Product } from '@/types';

/**
 * A treatment tile. Same data as the other house sites' product card (images,
 * badges, option count, price) but tuned for a clinic menu: portrait crop, a
 * champagne hairline that draws in on hover and a one-tap "add to my visit".
 */
export function ServiceCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { addItem } = useCart();
  const outOfStock = product.stockStatus === 'out_of_stock';
  const secondary = product.images[1];

  return (
    <article className="group relative">
      <div className="relative overflow-hidden rounded-lg border border-gold-400/20 bg-white shadow-soft transition-all duration-500 ease-silk group-hover:-translate-y-1.5 group-hover:border-gold-400/45 group-hover:shadow-gold">
        <Link to={`/service/${product.slug}`} aria-label={`View ${product.name}`} className="block">
          <div className="relative aspect-[3/4] overflow-hidden">
            {product.images[0] ? (
              <>
                <img
                  src={product.images[0]}
                  alt={product.name}
                  loading={priority ? 'eager' : 'lazy'}
                  className={`h-full w-full object-cover transition-all duration-[1100ms] ease-silk group-hover:scale-[1.05] ${
                    secondary ? 'group-hover:opacity-0' : ''
                  }`}
                />
                {secondary ? (
                  <img
                    src={secondary}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                  />
                ) : null}
              </>
            ) : (
              <div className="flex h-full items-center justify-center bg-graphite">
                <span className="gold-text font-display text-3xl">{product.name.slice(0, 2)}</span>
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-plum/45 via-transparent to-transparent opacity-80" />
            <div className="pointer-events-none absolute inset-2 rounded-md border border-white/0 transition-colors duration-500 group-hover:border-white/50" />

            {/* A quiet invitation to open the treatment, kept off the artwork
                until the card is hovered. */}
            <span className="pointer-events-none absolute bottom-3 right-3 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-plum opacity-0 shadow-soft backdrop-blur-md transition-all duration-500 ease-silk group-hover:translate-y-0 group-hover:opacity-100">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </Link>

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {product.newArrival ? <span className="badge-dark">New</span> : null}
          {product.bestseller ? <span className="badge-line">Most booked</span> : null}
          {outOfStock ? <span className="badge-line">Waitlist</span> : null}
        </div>

        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-white/95 px-3 py-2.5 backdrop-blur-md transition-transform duration-300 ease-editorial group-hover:translate-y-0">
          <button
            type="button"
            disabled={outOfStock}
            onClick={() => addItem(product)}
            className="w-full text-[10px] font-semibold uppercase tracking-wide2 text-gold-700 transition-opacity hover:opacity-70 disabled:opacity-40"
          >
            {outOfStock ? 'Ask about availability' : 'Add to my visit'}
          </button>
        </div>
      </div>

      <div className="pt-4">
        <Link to={`/service/${product.slug}`} className="block">
          <h3 className="font-display text-[1.12rem] leading-snug text-plum transition-colors hover:text-gold-600">
            {truncate(product.name, 52)}
          </h3>
        </Link>
        <div className="mt-2 flex items-baseline justify-between gap-3 border-t border-gold-400/15 pt-2">
          <p className="text-[9px] uppercase tracking-wide2 text-faint">
            {product.category?.name ?? 'Clinic treatment'}
          </p>
          <p className="text-[11px] font-semibold uppercase tracking-wide2 text-gold-700">
            {formatPrice(product.price)}
          </p>
        </div>
      </div>
    </article>
  );
}
