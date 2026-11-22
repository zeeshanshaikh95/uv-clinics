/**
 * The starter treatment menu for UV Clinics.
 *
 * Every department and service name comes from the clinic's own public
 * Instagram profile and offer posts: dermatology, aesthetics & PMU, dental,
 * salon, nails and makeup, all under one roof in Miyapur, Hyderabad. Prices are
 * taken only where the clinic has published an offer price; everything else
 * stays empty so the site says "price on request" instead of inventing one.
 *
 * Kept separate from `seed.ts` so the same data can produce the static snapshot
 * the GitHub Pages build ships (see `snapshot.ts`) without a database.
 */
import {
  HERO_SLIDES_DEFAULT,
  WHATSAPP_TEMPLATE_DEFAULT,
  WHATSAPP_TEMPLATE_SINGLE_DEFAULT,
} from '../models/siteSettings.model.js';

const IG = 'https://www.instagram.com/uvclinics/';

export const categories = [
  {
    name: 'Skin & Dermatology',
    slug: 'skin',
    description:
      'Doctor-led facials, peels and pigmentation care — the medical side of glow, without the guesswork.',
    image: '/images/hero-skin.jpg',
    displayOrder: 1,
  },
  {
    name: 'Aesthetics & Laser',
    slug: 'aesthetics',
    description:
      'Carbon peel laser, laser hair reduction and permanent makeup, performed with medical-grade equipment.',
    image: '/images/hero-laser.jpg',
    displayOrder: 2,
  },
  {
    name: 'Dental Care',
    slug: 'dental',
    description:
      'Scaling, polishing and cosmetic dentistry in-house, so the smile is part of the same appointment.',
    image: '/images/hero-dental.jpg',
    displayOrder: 3,
  },
  {
    name: 'Hair Studio',
    slug: 'hair',
    description:
      "Cuts, L'Oréal spa rituals, smoothening and colour — styling with a treatment plan behind it.",
    image: '/images/hero-hair.jpg',
    displayOrder: 4,
  },
  {
    name: 'Nail Studio',
    slug: 'nails',
    description:
      "Hyderabad's first Korean-themed nail studio: gel colour, extensions and hand-painted art.",
    image: '/images/hero-nails.jpg',
    displayOrder: 5,
  },
  {
    name: 'Makeup Studio',
    slug: 'makeup',
    description: 'Bridal, engagement and party makeup built to last the function, not just the photo.',
    image: '/images/hero-makeup.jpg',
    displayOrder: 6,
  },
];

export const lengthBands = () =>
  ['Up to shoulder', 'Shoulder to mid-back', 'Below mid-back'].map((name) => ({
    name,
    price: null as number | null,
    stockStatus: 'in_stock' as const,
  }));

export const serviceOptions = (names: Array<string | { name: string; price: number | null }>) =>
  names.map((option) =>
    typeof option === 'string'
      ? { name: option, price: null as number | null, stockStatus: 'in_stock' as const }
      : { ...option, stockStatus: 'in_stock' as const }
  );

export const products = [
  {
    name: 'HydraFacial',
    slug: 'hydrafacial',
    description:
      'A medical-grade cleanse, exfoliation and hydration in one pass — blackhead extraction without the picking, and skin that stays plump for days. The clinic\'s most-booked facial, and the one to start with if you have never had a treatment before.',
    price: 999,
    compareAtPrice: null,
    fabric: '45–60 minutes · no downtime',
    care: 'Sunscreen daily for a week. Skip retinol and strong actives for 48 hours after.',
    colour: 'Dull, congested or dehydrated skin; safe for most skin types after consultation',
    categorySlug: 'skin',
    images: ['/images/hero-skin.jpg', '/images/hero-portrait.jpg'],
    variants: serviceOptions(['Classic HydraFacial', 'HydraFacial + LED', 'HydraFacial + peel']),
    bestseller: true,
    featured: true,
    newArrival: false,
    displayOrder: 1,
  },
  {
    name: 'Skin & Hair Consultation',
    slug: 'skin-hair-consultation',
    description:
      'Sit with the in-house doctor before anything is booked. We look at the skin or scalp, explain what is actually happening, and put together a plan — sometimes that plan is one facial, sometimes it is none.',
    price: null,
    compareAtPrice: null,
    fabric: '20–30 minutes',
    care: 'Bring a list of anything you currently use, including prescriptions.',
    colour: 'Acne, pigmentation, hair fall, hair thinning or a second opinion',
    categorySlug: 'skin',
    images: ['/images/interior.jpg'],
    variants: [],
    bestseller: false,
    featured: false,
    newArrival: false,
    displayOrder: 2,
  },
  {
    name: 'Chemical Peel',
    slug: 'chemical-peel',
    description:
      'A controlled peel chosen for your concern — texture, tan, pigmentation or post-acne marks — with the strength decided at the chair rather than on a menu. Series pricing is shared after the consultation.',
    price: null,
    compareAtPrice: null,
    fabric: '30 minutes · light flaking for 3–5 days',
    care: 'Strict sunscreen, no picking, and no waxing or threading for a week.',
    colour: 'Uneven tone, tan, acne marks and mild texture',
    categorySlug: 'skin',
    images: ['/images/hero-skin.jpg'],
    variants: serviceOptions(['Single session', 'Series of 3', 'Series of 6']),
    bestseller: false,
    featured: true,
    newArrival: false,
    displayOrder: 3,
  },
  {
    name: 'Acne & Pigmentation Care',
    slug: 'acne-pigmentation-care',
    description:
      'A treatment plan rather than a single facial: in-clinic work combined with a routine you can actually keep up at home. Reviewed every few weeks so progress is measured, not guessed.',
    price: null,
    compareAtPrice: null,
    fabric: 'Plan length set at consultation',
    care: 'Consistency matters more than intensity — we will tell you what to drop.',
    colour: 'Active acne, hormonal breakouts, melasma and post-inflammatory marks',
    categorySlug: 'skin',
    images: ['/images/hero-portrait.jpg'],
    variants: serviceOptions(['Starter plan', 'Ongoing review']),
    bestseller: false,
    featured: false,
    newArrival: true,
    displayOrder: 4,
  },
  {
    name: 'Carbon Peel Laser',
    slug: 'carbon-peel-laser',
    description:
      'A carbon lotion is laid over the skin, then cleared with a laser pass — the closest thing to a resurfacing facial for oily, textured and acne-prone skin. Pores look tighter immediately; tone improves over the series.',
    price: 1499,
    compareAtPrice: null,
    fabric: '40 minutes · minimal downtime',
    care: 'No make-up for 12 hours, sunscreen daily, avoid heat and swimming for 48 hours.',
    colour: 'Oily skin, enlarged pores, dullness and mild acne scarring',
    categorySlug: 'aesthetics',
    images: ['/images/hero-laser.jpg', '/images/hero-skin.jpg'],
    variants: serviceOptions(['Single session', 'Series of 3', 'Series of 6']),
    bestseller: true,
    featured: true,
    newArrival: false,
    displayOrder: 5,
  },
  {
    name: 'Full Body Laser Hair Reduction',
    slug: 'full-body-laser-hair-reduction',
    description:
      'Medical-grade laser hair reduction for the full body, done in comfortable sessions by trained staff. A patch test and a consultation come first, so the settings suit your skin tone, not a default.',
    price: 4999,
    compareAtPrice: null,
    fabric: 'Per session · 6–8 sessions typically advised',
    care: 'Shave — do not wax or thread — for four weeks before. Sunscreen on exposed areas.',
    colour: 'Unwanted body hair; suitability confirmed at the patch test',
    categorySlug: 'aesthetics',
    images: ['/images/hero-laser.jpg'],
    variants: serviceOptions(['Full body · single session', 'Full body · package of 6', 'Patch test']),
    bestseller: false,
    featured: true,
    newArrival: false,
    displayOrder: 6,
  },
  {
    name: 'Permanent Makeup (PMU)',
    slug: 'permanent-makeup',
    description:
      'Soft, natural permanent makeup for brows and lips — mapped to your face, drawn first in pencil, and built up over two sittings so nothing looks stamped on. Includes the touch-up.',
    price: null,
    compareAtPrice: null,
    fabric: '2–3 hours · touch-up after 4–6 weeks',
    care: 'Keep the area dry for a week, avoid gyms and saunas, and follow the aftercare sheet.',
    colour: 'Sparse brows, asymmetry or lips that need definition rather than colour',
    categorySlug: 'aesthetics',
    images: ['/images/hero-makeup.jpg', '/images/hero-portrait.jpg'],
    variants: serviceOptions(['Brows · microblading', 'Brows · powder', 'Lip blush', 'Touch-up']),
    bestseller: false,
    featured: true,
    newArrival: true,
    displayOrder: 7,
  },
  {
    name: 'Teeth Scaling & Polishing',
    slug: 'teeth-scaling-polishing',
    description:
      'Ultrasonic scaling followed by polishing — the tidy-up that makes whitening treatments actually look like whitening. Includes a short dental check so anything that needs attention is flagged early.',
    price: 999,
    compareAtPrice: null,
    fabric: '30–40 minutes',
    care: 'Avoid very hot or cold food for a day; sensitivity settles within a week.',
    colour: 'Staining, tartar build-up and routine six-monthly cleaning',
    categorySlug: 'dental',
    images: ['/images/hero-dental.jpg'],
    variants: serviceOptions(['Scaling + polishing', 'Scaling + polishing + consultation']),
    bestseller: true,
    featured: true,
    newArrival: false,
    displayOrder: 8,
  },
  {
    name: 'Cosmetic Dental Restoration',
    slug: 'cosmetic-dental-restoration',
    description:
      'Composite bonding and cementation for chipped, spaced or worn front teeth — conservative work that keeps the natural tooth underneath. Shade and shape are matched before anything is set.',
    price: null,
    compareAtPrice: null,
    fabric: 'Varies by tooth · quoted after examination',
    care: 'Avoid biting nails and hard seeds; a six-month polish keeps the edges clean.',
    colour: 'Chips, gaps, discoloured fillings and worn edges',
    categorySlug: 'dental',
    images: ['/images/hero-dental.jpg'],
    variants: serviceOptions(['Single tooth', 'Multiple teeth', 'Consultation']),
    bestseller: false,
    featured: false,
    newArrival: false,
    displayOrder: 9,
  },
  {
    name: "Haircut + L'Oréal Hair Spa",
    slug: 'haircut-loreal-hair-spa',
    description:
      "The clinic's signature salon offer: a cut shaped to your face and hair fall, followed by a L'Oréal spa ritual — warm oil, scalp massage and a mask matched to your hair. Walk out lighter.",
    price: 999,
    compareAtPrice: null,
    fabric: '60–75 minutes',
    care: 'Use a sulphate-free wash and a weekly mask to keep the softness.',
    colour: 'Anyone due for a reset; asked for by both men and women',
    categorySlug: 'hair',
    images: ['/images/hero-hair.jpg', '/images/interior.jpg'],
    variants: serviceOptions([
      { name: 'Men · cut + spa', price: 999 },
      { name: 'Women · cut + spa', price: 999 },
      'Kids · cut',
    ]),
    bestseller: true,
    featured: true,
    newArrival: false,
    displayOrder: 10,
  },
  {
    name: 'Hair Smoothening',
    slug: 'hair-smoothening',
    description:
      "A smoothing treatment sealed in with heat — hair that dries straight, behaves in Hyderabad humidity and still moves. Published as an offer at ₹1,999; the final quote depends on length and density.",
    price: 1999,
    compareAtPrice: null,
    fabric: '3–4 hours depending on length',
    care: 'No washing or tying back for 72 hours. Sulphate-free wash afterwards.',
    colour: 'Frizzy, porous or humidity-sensitive hair',
    categorySlug: 'hair',
    images: ['/images/hero-hair.jpg'],
    variants: lengthBands(),
    bestseller: false,
    featured: true,
    newArrival: false,
    displayOrder: 11,
  },
  {
    name: 'Global Hair Colour',
    slug: 'global-hair-colour',
    description:
      'One considered shade from root to tip, applied in sections and finished with a toner so it suits your skin. Grey coverage, a deep tone change or a refresh before a function.',
    price: null,
    compareAtPrice: null,
    fabric: '2–3 hours including toner',
    care: 'Colour-safe wash, weekly mask, roots refreshed every 4–6 weeks.',
    colour: 'Grey coverage or an all-over tone change',
    categorySlug: 'hair',
    images: ['/images/hero-hair.jpg'],
    variants: lengthBands(),
    bestseller: false,
    featured: false,
    newArrival: false,
    displayOrder: 12,
  },
  {
    name: 'Korean Gel Nail Art',
    slug: 'korean-gel-nail-art',
    description:
      "Hyderabad's first Korean-themed nail studio, and the reason people travel across the city: glossy gel colour with hand-painted art, chrome, syrup and marble finishes. Published at ₹299 for both hands on a plain gel paint.",
    price: 299,
    compareAtPrice: null,
    fabric: '45–75 minutes depending on art',
    care: 'Cuticle oil daily; book a soak-off removal rather than peeling the gel.',
    colour: 'A clean, glossy everyday set or a full art set for an occasion',
    categorySlug: 'nails',
    images: ['/images/hero-nails.jpg'],
    variants: serviceOptions([
      { name: 'Gel paint · both hands', price: 299 },
      'Gel paint + art',
      'Chrome / syrup finish',
    ]),
    bestseller: true,
    featured: true,
    newArrival: true,
    displayOrder: 13,
  },
  {
    name: 'Nail Extensions',
    slug: 'nail-extensions',
    description:
      'Gel and acrylic extensions built to a length you can live with, shaped, then finished with colour or art. Published at ₹799 for a first set.',
    price: 799,
    compareAtPrice: null,
    fabric: '90 minutes',
    care: 'Avoid using your nails as tools; refills every 3–4 weeks.',
    colour: 'Length, an even shape, or repairing a broken nail before an event',
    categorySlug: 'nails',
    images: ['/images/hero-nails.jpg'],
    variants: serviceOptions(['Gel extensions', 'Acrylic extensions', 'Refill']),
    bestseller: false,
    featured: false,
    newArrival: false,
    displayOrder: 14,
  },
  {
    name: 'Luxury Manicure & Pedicure',
    slug: 'luxury-manicure-pedicure',
    description:
      'A proper soak, scrub, cuticle work and massage — the pair that keeps hands and feet looking maintained between nail appointments. The clinic runs a buy-one-get-one offer on the premium pair; ask when booking.',
    price: null,
    compareAtPrice: null,
    fabric: '60–90 minutes for the pair',
    care: 'Moisturise nightly; book the pair every 3–4 weeks.',
    colour: 'Dry hands, tired feet, or prep before a function',
    categorySlug: 'nails',
    images: ['/images/hero-nails.jpg', '/images/hero-skin.jpg'],
    variants: serviceOptions(['Classic pair', 'Premium pair', 'Pedicure only', 'Manicure only']),
    bestseller: false,
    featured: false,
    newArrival: false,
    displayOrder: 15,
  },
  {
    name: 'Bridal & Party Makeup',
    slug: 'bridal-party-makeup',
    description:
      'Makeup that reads well in photographs and still looks like you in person — long-wear base, HD finish and lashes, built to survive a full function. Trials are booked ahead of the date.',
    price: null,
    compareAtPrice: null,
    fabric: '90–150 minutes · trial available',
    care: 'Book the trial at least two weeks before. Come with clean, moisturised skin.',
    colour: 'Bridal, engagement, reception, sangeet and party looks',
    categorySlug: 'makeup',
    images: ['/images/hero-makeup.jpg'],
    variants: serviceOptions(['Party', 'Engagement', 'Bridal', 'Trial']),
    bestseller: false,
    featured: true,
    newArrival: false,
    displayOrder: 16,
  },
];

export const gallery = [
  { image: '/images/hero-skin.jpg', caption: 'HydraFacial — glass skin, no downtime', externalUrl: IG, displayOrder: 1 },
  { image: '/images/hero-laser.jpg', caption: 'Carbon peel laser at UV Clinics', externalUrl: IG, displayOrder: 2 },
  { image: '/images/hero-hair.jpg', caption: "Cut + L'Oréal hair spa", externalUrl: IG, displayOrder: 3 },
  { image: '/images/hero-nails.jpg', caption: 'Korean nail studio, Miyapur', externalUrl: IG, displayOrder: 4 },
  { image: '/images/interior.jpg', caption: 'Inside the clinic — gold florals, ivory calm', externalUrl: IG, displayOrder: 5 },
  { image: '/images/hero-dental.jpg', caption: 'Dental care under the same roof', externalUrl: IG, displayOrder: 6 },
  { image: '/images/hero-makeup.jpg', caption: 'Bridal & party makeup', externalUrl: IG, displayOrder: 7 },
  { image: '/images/hero-portrait.jpg', caption: 'Skin, in good hands', externalUrl: IG, displayOrder: 8 },
];

/** Mirrors the defaults in `siteSettings.model.ts`, for the static snapshot. */
export const publicSettings = {
  businessName: 'UV Clinics',
  tagline: 'Where science meets style',
  whatsappNumber: '918886868929',
  instagramUrl: IG,
  instagramHandle: 'uvclinics',
  email: '',
  city: 'Miyapur, Hyderabad',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=UV+Clinics+Mirra+Guduru+Plaza+Miyapur+Hyderabad',
  whatsappTemplate: WHATSAPP_TEMPLATE_DEFAULT,
  whatsappSingleProductTemplate: WHATSAPP_TEMPLATE_SINGLE_DEFAULT,
  heroSlides: HERO_SLIDES_DEFAULT,
  about: {
    intro:
      'UV Clinics is a six-department beauty and skin clinic in Miyapur, Hyderabad — dermatology, aesthetics, dental, salon, nails and makeup under one roof, with doctors on site rather than on call.',
    story:
      'Most salons can cut hair. Most clinics can treat skin. UV Clinics was built so you do not have to choose between the two, or drive across the city between appointments.\n\nUnder one roof in Mirra Guduru Plaza: a dermatology and aesthetics floor led by in-house doctors, a dental chair, a full salon, Hyderabad\'s first Korean-themed nail studio and a makeup room. The idea is simple — one visit, one set of records, and a plan that treats the skin, the smile and the hair as parts of the same person.\n\nWhere science meets style.',
    founderImageUrl: '/images/interior.jpg',
  },
  announcements: {
    enabled: true,
    text: 'HydraFacial ₹999 · Haircut + L’Oréal hair spa ₹999 · Carbon peel laser ₹1,499 — call 88868 68929',
  },
  policies: {
    shipping:
      'Offer prices are as published on the clinic\'s Instagram and can change without notice. Final pricing is confirmed at consultation, once skin, hair length and dental needs have been assessed. Payment is taken at the clinic by cash, card or UPI.',
    returns:
      'Laser, peel and PMU appointments need a consultation or patch test first. Please give at least 12 hours notice to move an appointment so the slot can be offered to someone else. Treatment packages are non-refundable once started.',
  },
};
