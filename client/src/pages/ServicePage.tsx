import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { publicApi } from '@/api/endpoints';
import { useApi } from '@/hooks/useApi';
import { useSettings } from '@/context/SettingsContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { ServiceCard } from '@/components/ServiceCard';
import { EmptyState } from '@/components/EmptyState';
import { Seo } from '@/components/seo/Seo';
import { formatPrice } from '@/lib/format';
import { buildOrderLink, buildSingleProductMessage } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/analytics';

export function ServicePage() {
  const { slug = '' } = useParams();
  const { settings } = useSettings();
  const { addItem } = useCart();
  const { toast } = useToast();

  const service = useApi(() => publicApi.getProduct(slug).then((r) => r.product), [slug]);
  const related = useApi(() => publicApi.getRelated(slug).then((r) => r.products), [slug]);

  const [imageIndex, setImageIndex] = useState(0);
  const [variant, setVariant] = useState<string | null>(null);

  useEffect(() => {
    setImageIndex(0);
    setVariant(null);
  }, [slug]);

  useEffect(() => {
    if (service.data) trackEvent({ type: 'product_view', productSlug: service.data.slug });
  }, [service.data]);

  if (service.loading) {
    return (
      <div className="shell grid gap-10 py-16 lg:grid-cols-2">
        <div className="skeleton aspect-[4/5]" />
        <div className="space-y-4">
          <div className="skeleton h-4 w-24" />
          <div className="skeleton h-10 w-3/4" />
          <div className="skeleton h-24 w-full" />
        </div>
      </div>
    );
  }

  if (service.error || !service.data) {
    return (
      <div className="shell py-24">
        <EmptyState
          tone="error"
          title="That treatment has moved"
          description={service.error ?? 'We could not find this treatment on the menu.'}
          action={
            <Link to="/services" className="btn-line">
              Back to the menu
            </Link>
          }
        />
      </div>
    );
  }

  const product = service.data;
  const images = product.images.length ? product.images : [];
  const price = product.price;
  const variantLine = variant ? ` — ${variant}` : '';

  const bookLink = buildOrderLink(
    settings,
    buildSingleProductMessage(settings, {
      productName: `${product.name}${variantLine}`,
      variantName: variant,
      quantity: 1,
      price,
    })
  );

  const details = [
    { label: 'Duration', value: product.fabric },
    { label: 'Good for', value: product.colour },
    { label: 'Aftercare', value: product.care },
  ].filter((item) => item.value);

  return (
    <>
      <Seo
        title={`${product.name} — UV Clinics`}
        description={
          product.seoDescription ||
          product.description.slice(0, 155) ||
          `${product.name} at UV Clinics, Miyapur, Hyderabad.`
        }
        canonicalPath={`/service/${product.slug}`}
        image={images[0]}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: product.name,
          description: product.description,
          provider: { '@type': 'MedicalClinic', name: settings.businessName },
          ...(price !== null ? { offers: { '@type': 'Offer', price, priceCurrency: 'INR' } } : {}),
        }}
      />

      <div className="shell grid gap-10 py-10 sm:py-14 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        {/* Gallery */}
        <div>
          <div className="relative aspect-[4/5] overflow-hidden border border-gold-400/20 bg-graphite">
            {images[imageIndex] ? (
              <img
                key={images[imageIndex]}
                src={images[imageIndex]}
                alt={product.name}
                className="h-full w-full animate-fade-in object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="gold-text font-display text-5xl">{product.name.slice(0, 2)}</span>
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-plum/35 via-transparent to-transparent" />
            {images.length > 1 ? (
              <div className="absolute bottom-4 right-4 border border-gold-400/30 bg-night/80 px-2.5 py-1 text-[9px] tracking-wide2 text-cream/80 backdrop-blur-sm">
                {imageIndex + 1} / {images.length}
              </div>
            ) : null}
          </div>

          {images.length > 1 ? (
            <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setImageIndex(index)}
                  aria-label={`View image ${index + 1}`}
                  className={`relative aspect-square overflow-hidden border transition-colors ${
                    index === imageIndex
                      ? 'border-gold-400'
                      : 'border-gold-400/15 hover:border-gold-400/50'
                  }`}
                >
                  <img src={image} alt="" className="h-full w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {/* Detail */}
        <div className="lg:pt-4">
          <nav aria-label="Breadcrumb" className="text-[9px] uppercase tracking-wide2 text-faint">
            <Link to="/services" className="hover:text-gold-700">
              Treatments
            </Link>
            {product.category ? (
              <>
                <span className="mx-2">/</span>
                <Link to={`/category/${product.category.slug}`} className="hover:text-gold-700">
                  {product.category.name}
                </Link>
              </>
            ) : null}
          </nav>

          <h1 className="mt-4 font-display text-4xl leading-[1.05] text-plum sm:text-5xl">{product.name}</h1>

          <div className="mt-5 flex flex-wrap items-center gap-4">
            <p className="gold-text font-display text-2xl">
              {price === null ? 'Price on request' : `From ${formatPrice(price)}`}
            </p>
            {product.bestseller ? <span className="badge-line">Most booked</span> : null}
            {product.newArrival ? <span className="badge-dark">New</span> : null}
          </div>

          {product.description ? (
            <p className="mt-6 whitespace-pre-line text-sm leading-[1.9] text-muted">{product.description}</p>
          ) : null}

          {product.variants.length ? (
            <div className="mt-8">
              <p className="field-label">Choose an option</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((option) => (
                  <button
                    key={option.name}
                    type="button"
                    onClick={() => setVariant(option.name)}
                    className={`border px-4 py-2 text-[10px] uppercase tracking-wide2 transition-colors ${
                      variant === option.name
                        ? 'border-gold-400 bg-gold-400 text-plum'
                        : 'border-gold-400/25 text-cream/75 hover:border-gold-400/60'
                    }`}
                  >
                    {option.name}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                addItem(product, variant);
                toast(`${product.name} added to your visit`);
              }}
              className="btn-line flex-1"
            >
              Add to my visit
            </button>
            {bookLink ? (
              <a
                href={bookLink.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent({ type: 'order_whatsapp_click' })}
                className="btn-solid flex-1"
              >
                {bookLink.channel === 'whatsapp' ? 'Book on WhatsApp' : 'DM to book'}
              </a>
            ) : null}
          </div>

          {details.length ? (
            <dl className="mt-10 divide-y divide-gold-400/10 border-y border-gold-400/10">
              {details.map((detail) => (
                <div key={detail.label} className="flex gap-6 py-4">
                  <dt className="w-24 shrink-0 text-[9px] uppercase tracking-wide2 text-faint">
                    {detail.label}
                  </dt>
                  <dd className="text-sm leading-relaxed text-cream/80">{detail.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          <p className="mt-6 text-[11px] leading-relaxed text-faint">
            Prices start from the figure shown and are confirmed at the clinic — session count, treatment
            area and the assessment change the final amount. We always tell you before we begin.
          </p>
        </div>
      </div>

      {related.data?.length ? (
        <section className="shell border-t border-gold-400/10 py-16">
          <p className="eyebrow">You might also like</p>
          <h2 className="mt-3 font-display text-3xl text-plum">Often booked together</h2>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
            {related.data.slice(0, 4).map((item) => (
              <ServiceCard key={item._id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
