import mongoose, { Schema, model, type Model } from 'mongoose';

export interface IHeroSlide {
  imageUrl: string;
  eyebrow: string;
  headline: string;
  subheadline: string;
  ctaLabel: string;
  ctaHref: string;
  active: boolean;
}

export const HERO_SLIDES_DEFAULT: IHeroSlide[] = [
  {
    imageUrl: '/images/hero-skin.jpg',
    eyebrow: 'Dermatology · HydraFacial',
    headline: 'Skin that behaves like glass',
    subheadline:
      'HydraFacial, medical peels and laser care prescribed by in-house doctors — not a one-size facial.',
    ctaLabel: 'Explore skin & laser',
    ctaHref: '/category/skin',
    active: true,
  },
  {
    imageUrl: '/images/hero-hair.jpg',
    eyebrow: 'Hair Studio',
    headline: 'Where science meets style',
    subheadline:
      "L'Oréal spa rituals, smoothening and precision cuts — six departments, one appointment.",
    ctaLabel: 'See the hair menu',
    ctaHref: '/category/hair',
    active: true,
  },
  {
    imageUrl: '/images/hero-dental.jpg',
    eyebrow: 'Dental Care',
    headline: 'A smile you do not rehearse',
    subheadline:
      'Scaling, polishing and cosmetic dentistry in the same building — so one visit covers everything.',
    ctaLabel: 'Book dental care',
    ctaHref: '/category/dental',
    active: true,
  },
  {
    imageUrl: '/images/hero-nails.jpg',
    eyebrow: 'Korean Nail Studio',
    headline: 'Seoul, via Miyapur',
    subheadline:
      'Gel colour, extensions and hand-painted art in the city’s first Korean-themed nail studio.',
    ctaLabel: 'See nail art',
    ctaHref: '/category/nails',
    active: true,
  },
];

export const WHATSAPP_TEMPLATE_DEFAULT =
  'Hi UV Clinics! ✨\n' +
  'I would like to book the following:\n' +
  '{{ITEMS}}\n' +
  'Estimated total: {{TOTAL}}\n\n' +
  'Please share the earliest available slot and confirm the price.';

export const WHATSAPP_TEMPLATE_SINGLE_DEFAULT =
  'Hi UV Clinics! ✨\n' +
  'I would like to book:\n' +
  '• {{PRODUCT}}\n' +
  '{{VARIANT_LINE}}{{QTY_LINE}}Price: {{PRICE}}\n\n' +
  'Please share the available slots and confirm the price.';

export interface ISiteSettings {
  businessName: string;
  tagline: string;
  whatsappNumber: string;
  instagramUrl: string;
  instagramHandle: string;
  email: string;
  city: string;
  mapsUrl: string;
  whatsappTemplate: string;
  whatsappSingleProductTemplate: string;
  heroSlides: IHeroSlide[];
  about: {
    intro: string;
    story: string;
    founderImageUrl: string;
  };
  announcements: {
    enabled: boolean;
    text: string;
  };
  policies: {
    shipping: string;
    returns: string;
  };
  updatedAt: Date;
}

const slideSchema = new Schema<IHeroSlide>(
  {
    imageUrl: { type: String, default: '' },
    eyebrow: { type: String, default: '' },
    headline: { type: String, default: '' },
    subheadline: { type: String, default: '' },
    ctaLabel: { type: String, default: 'Explore the menu' },
    ctaHref: { type: String, default: '/services' },
    active: { type: Boolean, default: true },
  },
  { _id: false }
);

const siteSettingsSchema = new Schema<ISiteSettings>(
  {
    businessName: { type: String, default: 'UV Clinics' },
    tagline: { type: String, default: 'Where science meets style' },
    whatsappNumber: { type: String, default: '918886868929' },
    instagramUrl: { type: String, default: 'https://www.instagram.com/uvclinics/' },
    instagramHandle: { type: String, default: 'uvclinics' },
    email: { type: String, default: '' },
    city: { type: String, default: 'Miyapur, Hyderabad' },
    mapsUrl: {
      type: String,
      default:
        'https://www.google.com/maps/search/?api=1&query=UV+Clinics+Mirra+Guduru+Plaza+Miyapur+Hyderabad',
    },
    whatsappTemplate: { type: String, default: WHATSAPP_TEMPLATE_DEFAULT },
    whatsappSingleProductTemplate: { type: String, default: WHATSAPP_TEMPLATE_SINGLE_DEFAULT },
    heroSlides: { type: [slideSchema], default: () => HERO_SLIDES_DEFAULT },
    about: {
      intro: { type: String, default: '' },
      story: { type: String, default: '' },
      founderImageUrl: { type: String, default: '/images/interior.jpg' },
    },
    announcements: {
      enabled: { type: Boolean, default: true },
      text: {
        type: String,
        default:
          'HydraFacial ₹999 · Haircut + L’Oréal hair spa ₹999 · Carbon peel laser ₹1,499 — call 88868 68929',
      },
    },
    policies: {
      shipping: { type: String, default: '' },
      returns: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

export const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings ?? model<ISiteSettings>('SiteSettings', siteSettingsSchema);
