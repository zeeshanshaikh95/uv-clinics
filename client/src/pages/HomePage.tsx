import { Link } from 'react-router-dom';
import { publicApi } from '@/api/endpoints';
import { useApi } from '@/hooks/useApi';
import { useSettings } from '@/context/SettingsContext';
import { HeroSlider } from '@/components/HeroSlider';
import { ServiceCard } from '@/components/ServiceCard';
import { SectionIntro } from '@/components/SectionIntro';
import { Seo } from '@/components/seo/Seo';
import { EmptyState } from '@/components/EmptyState';
import { Stars } from '@/components/Stars';
import { ADDRESS_LINE, assetUrl, FOUNDER_IMAGE } from '@/lib/brand';
import { buildOrderLink, buildSingleProductMessage } from '@/lib/whatsapp';

/** The published offers from the clinic's own Instagram posts. */
const OFFERS = [
  { label: 'HydraFacial', price: '₹999', note: 'Signature glow facial' },
  { label: "Haircut + L'Oréal spa", price: '₹999', note: 'Cut, wash and spa ritual' },
  { label: 'Carbon peel laser', price: '₹1,499', note: 'Per session' },
  { label: 'Teeth scaling + consult', price: '₹999', note: 'Dental cleaning' },
  { label: 'Korean gel nails', price: '₹299', note: 'Both hands, plain gel' },
  { label: 'Full body laser', price: '₹4,999', note: 'Hair reduction, per session' },
];

const PROMISES = [
  {
    title: 'Doctors in the building',
    text: 'Dermatology and dental care are led by in-house doctors, so a treatment plan is signed off by someone qualified to give one.',
  },
  {
    title: 'Six departments, one visit',
    text: 'Skin, laser, dental, hair, nails and makeup share one reception and one set of records. No driving between appointments.',
  },
  {
    title: 'Prices said out loud',
    text: 'Published offers are honoured, and anything quoted after a consultation is confirmed before the treatment starts.',
  },
];

const DEPARTMENTS = [
  { title: 'Skin', note: 'HydraFacial · peels' },
  { title: 'Laser', note: 'Carbon peel · hair reduction' },
  { title: 'Dental', note: 'Scaling · cosmetic' },
  { title: 'Hair', note: 'Cut · spa · smoothening' },
  { title: 'Nails', note: 'Korean gel · extensions' },
  { title: 'Makeup', note: 'Bridal · party' },
];

export function HomePage() {
  const { settings } = useSettings();
  const menu = useApi(() => publicApi.listProducts({ sort: 'featured' }).then((r) => r.products), []);

  // The signature strip shows what the clinic has flagged as featured; the second
  // strip shows the rest of the menu so the two never repeat the same cards.
  const allServices = menu.data ?? [];
  const featured = { ...menu, data: allServices.filter((item) => item.featured).slice(0, 4) };
  const restOfMenu = allServices.filter((item) => !item.featured).slice(0, 4);
  const categories = useApi(() => publicApi.listCategories().then((r) => r.categories), []);
  const reviews = useApi(() => publicApi.listReviews().then((r) => r.reviews), []);
  const gallery = useApi(() => publicApi.listGallery().then((r) => r.items), []);

  const orderLink = buildOrderLink(
    settings,
    buildSingleProductMessage(settings, {
      productName: 'a consultation',
      variantName: null,
      quantity: 1,
      price: null,
    })
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    name: settings.businessName,
    description:
      settings.about.intro ||
      'Dermatology, aesthetics, dental, salon, nails and makeup under one roof in Miyapur, Hyderabad.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '2nd Floor, Mirra Guduru Plaza, Miyapur Cross Roads',
      addressLocality: 'Hyderabad',
      addressRegion: 'Telangana',
      postalCode: '500049',
      addressCountry: 'IN',
    },
    ...(settings.whatsappNumber
      ? { telephone: `+91${settings.whatsappNumber.replace(/\D/g, '').slice(-10)}` }
      : {}),
    ...(settings.instagramUrl ? { sameAs: [settings.instagramUrl] } : {}),
    openingHours: 'Mo-Su 11:00-22:00',
  };

  return (
    <>
      <Seo
        title="UV Clinics — Dermatology, Aesthetics, Dental & Salon in Miyapur, Hyderabad"
        description="Six departments under one roof: dermatology, aesthetics & laser, dental, hair, nails and makeup. HydraFacial ₹999, hair spa, carbon peel laser and Korean nail art at UV Clinics, Miyapur."
        canonicalPath="/"
        jsonLd={jsonLd}
      />

      <HeroSlider />

      {/* ── Department ticker ───────────────────────────────────── */}
      <section className="overflow-hidden border-y border-gold-400/25 bg-white/70 py-4">
        <div className="flex shrink-0 items-center gap-10 whitespace-nowrap px-5">
          {[...DEPARTMENTS, ...DEPARTMENTS].map((department, index) => (
            <span key={`${department.title}-${index}`} className="flex items-center gap-10">
              <span className="font-display text-lg text-plum/85">{department.title}</span>
              <span className="text-[9px] uppercase tracking-micro text-gold-600/80">
                {department.note}
              </span>
              <span className="h-1 w-1 rotate-45 bg-gold-400/70" />
            </span>
          ))}
        </div>
      </section>

      {/* ── Signature treatments ────────────────────────────────── */}
      <section className="shell py-16 sm:py-24">
        <SectionIntro
          eyebrow="The menu"
          title="Treatments worth the appointment"
          description="Skin, smile and hair, handled by people who do each one all day — with a doctor behind the clinical work."
          linkTo="/services"
          linkLabel="See every treatment"
        />

        {featured.loading ? (
          <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="skeleton aspect-[3/4]" />
            ))}
          </div>
        ) : featured.error ? (
          <div className="mt-12">
            <EmptyState
              tone="error"
              title="We couldn't load the menu"
              description={featured.error}
              action={
                <button type="button" className="btn-line" onClick={featured.refetch}>
                  Try again
                </button>
              }
            />
          </div>
        ) : !featured.data?.length ? (
          <div className="mt-12">
            <EmptyState
              title="The menu is being photographed"
              description="Treatments appear here as soon as they are published. Our Instagram has the latest work in the meantime."
            />
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
            {featured.data.slice(0, 4).map((product, index) => (
              <ServiceCard key={product._id} product={product} priority={index < 2} />
            ))}
          </div>
        )}
      </section>

      {/* ── Departments ─────────────────────────────────────────── */}
      <section className="border-y border-gold-400/15 bg-obsidian py-16 sm:py-24">
        <div className="shell">
          <SectionIntro
            eyebrow="Six departments"
            title="One roof, one reception"
            description="Walk in for a facial and leave with the dental check done too — everything sits on the same floor."
            linkTo="/services"
            linkLabel="Everything on the menu"
          />

          {categories.loading ? (
            <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-3">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="skeleton aspect-[4/3]" />
              ))}
            </div>
          ) : !categories.data?.length ? (
            <div className="mt-12">
              <EmptyState
                title="Departments are on their way"
                description="They appear here once the menu is published in the admin panel."
              />
            </div>
          ) : (
            <div className="mt-12 grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-5">
              {categories.data.slice(0, 6).map((category, index) => (
                <Link
                  key={category._id}
                  to={`/category/${category.slug}`}
                  className="group relative block aspect-[4/3] overflow-hidden rounded-lg border border-gold-400/20 bg-white"
                >
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1200ms] ease-silk group-hover:scale-110"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-plum/80 via-plum/20 to-transparent" />
                  <div className="pointer-events-none absolute inset-2 rounded-md border border-white/0 transition-colors duration-500 group-hover:border-gold-200/60" />
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    <p className="text-[9px] uppercase tracking-micro text-gold-200/90">
                      {String(index + 1).padStart(2, '0')} — Department
                    </p>
                    <h3 className="mt-1.5 font-display text-xl leading-tight text-white sm:text-2xl">
                      {category.name}
                    </h3>
                    <span className="mt-2.5 inline-flex items-center gap-2 text-[9px] uppercase tracking-wide2 text-white/80">
                      Explore
                      <span className="h-px w-5 bg-gold-200/80 transition-all duration-300 group-hover:w-9" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Offers ──────────────────────────────────────────────── */}
      <section className="shell py-16 sm:py-24">
        <SectionIntro
          eyebrow="On right now"
          title="Offers, as published"
          description="Every price here comes from the clinic's own Instagram. Offers rotate — confirm the current one on WhatsApp before you travel."
        />
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {OFFERS.map((offer) => (
            <div
              key={offer.label}
              className="group relative flex items-center justify-between gap-4 overflow-hidden rounded-lg border border-gold-400/25 bg-white p-5 shadow-soft transition-shadow duration-500 hover:shadow-gold"
            >
              <div className="pointer-events-none absolute inset-0 translate-x-[-120%] skew-x-[-18deg] bg-gradient-to-r from-transparent via-gold-200/40 to-transparent transition-transform duration-1000 ease-silk group-hover:translate-x-[220%]" />
              <div>
                <p className="font-display text-lg leading-tight text-plum">{offer.label}</p>
                <p className="mt-1 text-[9px] uppercase tracking-wide2 text-faint">{offer.note}</p>
              </div>
              <p className="gold-text shrink-0 font-display text-2xl">{offer.price}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 text-[10px] uppercase tracking-wide2 text-faint">
          * Offer pricing from @uvclinics posts; subject to assessment and change.
        </p>
      </section>

      {/* ── The clinic ──────────────────────────────────────────── */}
      <section className="border-y border-gold-400/15 bg-obsidian py-16 sm:py-24">
        <div className="shell grid items-center gap-12 lg:grid-cols-12">
          <div className="relative lg:col-span-6">
            <div className="arch-mask relative aspect-[4/5] overflow-hidden border border-gold-400/25 bg-white p-2 shadow-panel">
              <img
                src={settings.about.founderImageUrl || assetUrl(FOUNDER_IMAGE)}
                alt="Inside UV Clinics, Miyapur — ivory walls with gold florals and the UV monogram"
                loading="lazy"
                className="arch-mask h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-2 rounded-[inherit] bg-gradient-to-t from-plum/40 via-transparent to-transparent" />
            </div>

            <div className="absolute -bottom-8 -right-4 hidden rounded-md border border-gold-400/30 bg-white/95 px-6 py-5 shadow-soft backdrop-blur-md sm:block lg:-right-8">
              <p className="gold-text font-display text-3xl leading-none">4.7★</p>
              <p className="mt-2 text-[9px] uppercase tracking-micro text-faint">172 Google reviews</p>
            </div>

            <div className="absolute -left-4 top-10 hidden rounded-md border border-gold-400/20 bg-white/95 px-5 py-4 shadow-soft backdrop-blur-md sm:block">
              <p className="font-display text-2xl leading-none text-gold-700">11am–10pm</p>
              <p className="mt-1 text-[9px] uppercase tracking-micro text-faint">Open all week</p>
            </div>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <p className="eyebrow">The clinic</p>
            <h2 className="mt-4 font-display text-4xl leading-[1.05] text-plum sm:text-5xl">
              Science in the treatment room. Style on the way out.
            </h2>
            <p className="mt-6 text-sm leading-[1.9] text-muted">
              {settings.about.intro ||
                'UV Clinics is a six-department beauty and skin clinic in Miyapur, Hyderabad — dermatology, aesthetics, dental, salon, nails and makeup under one roof, with doctors on site rather than on call.'}
            </p>
            <Link
              to="/about"
              className="mt-8 inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-wide2 text-gold-700"
            >
              Read our story
              <span className="h-px w-8 bg-gold-500" />
            </Link>

            <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-gold-400/20 bg-gold-400/20">
              {[
                ['385+', 'posts of real work'],
                ['6', 'departments'],
                ['In-house', 'doctors'],
                ['Miyapur', 'cross roads'],
              ].map(([title, note]) => (
                <div key={title} className="bg-white px-5 py-4">
                  <p className="font-display text-base text-plum">{title}</p>
                  <p className="mt-1 text-[9px] uppercase tracking-wide2 text-faint">{note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Rest of the menu ───────────────────────────────────── */}
      <section className="shell py-16 sm:py-24">
        <SectionIntro
          eyebrow="Also booked"
          title="More reasons to walk in"
          linkTo="/services"
          linkLabel="See everything"
        />

        {menu.loading ? (
          <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="skeleton aspect-[3/4]" />
            ))}
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
            {restOfMenu.map((product) => (
              <ServiceCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ── Promises ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-y border-gold-400/15 bg-obsidian py-16 sm:py-24">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-uv-300/25 blur-[100px]" />
        <div className="shell">
          <div className="max-w-2xl">
            <p className="eyebrow">How we work</p>
            <h2 className="mt-4 font-display text-3xl leading-tight text-plum sm:text-[2.8rem]">
              Clinical standards, salon finish
            </h2>
          </div>
          <div className="relative mt-12 grid gap-px overflow-hidden rounded-md border border-gold-400/20 bg-gold-400/20 sm:grid-cols-3">
            {PROMISES.map((promise, index) => (
              <div key={promise.title} className="bg-white p-6 sm:p-8">
                <p className="gold-text font-display text-2xl">0{index + 1}</p>
                <h3 className="mt-4 font-display text-2xl text-plum">{promise.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{promise.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gallery ────────────────────────────────────────────── */}
      {gallery.data?.length ? (
        <section className="shell py-16 sm:py-24">
          <SectionIntro
            eyebrow={`@${settings.instagramHandle.replace(/^@/, '')}`}
            title="Work from the clinic"
            linkTo="/gallery"
            linkLabel="Open the gallery"
          />
          <div className="mt-12 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-4">
            {gallery.data.slice(0, 8).map((item) => (
              <a
                key={item._id}
                href={item.externalUrl || settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-[4/5] overflow-hidden rounded-md border border-gold-400/15 bg-graphite"
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.caption || 'UV Clinics on Instagram'}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-silk group-hover:scale-110"
                  />
                ) : null}
                <span className="absolute inset-0 bg-plum/0 transition-colors duration-300 group-hover:bg-plum/25" />
                <span className="absolute inset-2 rounded border border-white/0 transition-colors duration-300 group-hover:border-gold-200/70" />
              </a>
            ))}
          </div>
        </section>
      ) : null}

      {/* ── Reviews ────────────────────────────────────────────── */}
      {reviews.data?.length ? (
        <section className="shell pb-16 sm:pb-24">
          <SectionIntro eyebrow="In their words" title="After the visit" linkTo="/reviews" linkLabel="All reviews" />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {reviews.data.slice(0, 3).map((review) => (
              <figure key={review._id} className="panel flex flex-col p-6">
                <Stars rating={review.rating} />
                <blockquote className="mt-4 flex-1 font-display text-xl leading-snug text-plum">
                  “{review.text}”
                </blockquote>
                <figcaption className="mt-5 text-[9px] uppercase tracking-wide2 text-faint">
                  {review.customerName}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      {/* ── Booking CTA ────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-plum py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_70%_at_50%_0%,rgba(198,161,91,0.28)_0%,rgba(58,42,63,0)_70%)]" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full border border-gold-300/25" />
        <div className="pointer-events-none absolute left-1/2 top-10 h-[22rem] w-[22rem] -translate-x-1/2 rounded-full border border-gold-300/15" />

        <div className="shell relative flex flex-col items-center text-center">
          <div className="medallion mb-9 flex h-16 w-16 animate-float items-center justify-center" aria-hidden="true">
            <span className="font-display text-xl text-plum/80">UV</span>
          </div>
          <p className="text-[10px] uppercase tracking-micro text-gold-200">Appointments</p>
          <h2 className="mt-5 max-w-2xl font-display text-4xl leading-[1.05] text-night text-balance sm:text-6xl">
            Book. Glow. Repeat.
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-night/70">
            Send the treatment and the day that suits you. We will confirm the slot, the doctor or artist,
            and the final price before you come in.
          </p>
          {orderLink ? (
            <a href={orderLink.href} target="_blank" rel="noopener noreferrer" className="btn-solid mt-9 !border-gold-300 !bg-gold-300 !text-plum hover:!bg-gold-200">
              {orderLink.channel === 'whatsapp' ? 'Message us on WhatsApp' : 'Message us on Instagram'}
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          ) : null}
          <p className="mt-5 text-[10px] uppercase tracking-wide2 text-night/50">
            {settings.city || 'Miyapur, Hyderabad'} · {ADDRESS_LINE}
          </p>
        </div>
      </section>
    </>
  );
}
