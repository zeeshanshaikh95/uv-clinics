import { Link } from 'react-router-dom';
import { publicApi } from '@/api/endpoints';
import { useApi } from '@/hooks/useApi';
import { useSettings } from '@/context/SettingsContext';
import { EmptyState } from '@/components/EmptyState';
import { Seo } from '@/components/seo/Seo';
import { Stars } from '@/components/Stars';
import { buildOrderLink, buildSingleProductMessage } from '@/lib/whatsapp';

export function ReviewsPage() {
  const { settings } = useSettings();
  const reviews = useApi(() => publicApi.listReviews().then((r) => r.reviews), []);

  const list = reviews.data ?? [];
  const average = list.length
    ? Math.round((list.reduce((sum, item) => sum + item.rating, 0) / list.length) * 10) / 10
    : 0;

  const link = buildOrderLink(
    settings,
    buildSingleProductMessage(settings, {
      productName: 'an appointment',
      variantName: null,
      quantity: 1,
      price: null,
    })
  );

  return (
    <>
      <Seo
        title="Reviews — UV Clinics, Miyapur, Hyderabad"
        description="What clients say after their visit — reviews of UV Clinics, Mirra Guduru Plaza, Miyapur, Hyderabad."
        canonicalPath="/reviews"
      />

      <section className="border-b border-gold-400/10 bg-obsidian">
        <div className="shell py-16 sm:py-20">
          <p className="eyebrow flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-7 bg-gold-500/70" />
            Reviews
          </p>
          <h1 className="mt-4 font-display text-4xl leading-[1.05] text-plum sm:text-6xl">After the visit</h1>
          <div className="mt-6 flex items-center gap-4">
            <Stars rating={Math.round(average)} />
            <p className="text-[10px] uppercase tracking-wide2 text-muted">
              {list.length ? `${average} / 5 from ${list.length} ${list.length === 1 ? 'client' : 'clients'}` : 'No reviews published yet'}
            </p>
          </div>
        </div>
      </section>

      <section className="shell py-14 sm:py-20">
        {reviews.loading ? (
          <div className="rise grid gap-4 md:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="skeleton h-48" />
            ))}
          </div>
        ) : !list.length ? (
          <EmptyState
            title="Reviews open soon"
            description="We only publish reviews written by real clients. Until then, the work on Instagram speaks for us."
            action={
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-line"
              >
                See our work on Instagram
              </a>
            }
          />
        ) : (
          <div className="rise grid gap-4 md:grid-cols-3">
            {list.map((review) => (
              <figure key={review._id} className="panel flex flex-col p-6">
                <Stars rating={review.rating} />
                <blockquote className="mt-4 flex-1 text-sm leading-[1.85] text-plum/85">
                  “{review.text}”
                </blockquote>
                {review.image ? (
                  <img
                    src={review.image}
                    alt={`${review.customerName} at UV Clinics`}
                    loading="lazy"
                    className="mt-5 aspect-[4/3] w-full border border-gold-400/10 object-cover"
                  />
                ) : null}
                <figcaption className="mt-5 text-[9px] uppercase tracking-wide2 text-faint">
                  {review.customerName}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </section>

      <section className="shell border-t border-gold-400/10 py-16 text-center">
        <p className="eyebrow">Been in recently?</p>
        <h2 className="mx-auto mt-4 max-w-lg font-display text-3xl leading-tight text-plum sm:text-4xl">
          Tell us how it went
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted">
          Send us a message — we read every one, and the good ones go on this page with your permission.
        </p>
        {link ? (
          <a href={link.href} target="_blank" rel="noopener noreferrer" className="btn-solid mt-8">
            Message us
          </a>
        ) : (
          <Link to="/contact" className="btn-solid mt-8">
            Contact us
          </Link>
        )}
      </section>
    </>
  );
}
