import { Link } from 'react-router-dom';
import { useSettings } from '@/context/SettingsContext';
import { Seo } from '@/components/seo/Seo';
import { Wordmark } from '@/components/Wordmark';
import { ADDRESS_LINE, assetUrl, FOUNDER_IMAGE } from '@/lib/brand';

const VALUES = [
  {
    title: 'Doctors, not guesswork',
    text: 'Skin, laser and dental work is led by in-house doctors. If a treatment is not right for you, we say so — even when it is the one you came in for.',
  },
  {
    title: 'One roof, six departments',
    text: 'Dermatology, aesthetics, dental, hair, nails and makeup share one reception. One visit can cover a facial, a cleaning and a cut.',
  },
  {
    title: 'Prices said out loud',
    text: 'Published offers are honoured. Anything quoted after a consultation is confirmed before treatment starts, never after.',
  },
  {
    title: 'Aftercare that continues',
    text: 'Every clinical treatment leaves with a written aftercare plan and a follow-up, because results are made between visits.',
  },
];

export function AboutPage() {
  const { settings } = useSettings();

  return (
    <>
      <Seo
        title="About — UV Clinics, Miyapur, Hyderabad"
        description="A six-department skin and beauty clinic in Miyapur, Hyderabad: dermatology, aesthetics & laser, dental, hair, nails and makeup, with doctors in-house."
        canonicalPath="/about"
        image={settings.about.founderImageUrl || FOUNDER_IMAGE}
      />

      <section className="border-b border-gold-400/20 bg-obsidian">
        <div className="shell grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-2">
          <div>
            <p className="eyebrow flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-7 bg-gold-500/70" />
              Our story
            </p>
            <h1 className="mt-5 font-display text-4xl leading-[1.04] text-plum sm:text-6xl">
              Science in the room,<br />
              <span className="gold-text">style on the way out</span>
            </h1>
            <p className="mt-7 max-w-lg text-sm leading-[1.9] text-muted">
              {settings.about.intro ||
                'UV Clinics is a six-department beauty and skin clinic in Miyapur, Hyderabad — dermatology, aesthetics, dental, salon, nails and makeup under one roof, with doctors on site rather than on call.'}
            </p>
            <p className="mt-4 max-w-lg text-sm leading-[1.9] text-muted">
              Most salons can cut hair. Most clinics can treat skin. We built UV Clinics so you do not have
              to choose between the two — or drive across the city between appointments.
            </p>
            <Link to="/contact" className="btn-solid mt-9">
              Find us in Miyapur
            </Link>
          </div>

          <div className="relative">
            <div className="arch-mask relative aspect-[4/5] overflow-hidden border border-gold-400/25 bg-white p-2 shadow-panel">
              <img
                src={settings.about.founderImageUrl || assetUrl(FOUNDER_IMAGE)}
                alt="The interior of UV Clinics, Miyapur"
                className="arch-mask h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden rounded-md border border-gold-400/30 bg-white/95 px-5 py-4 shadow-soft backdrop-blur-md sm:block">
              <Wordmark size="sm" asLink={false} withTagline={false} />
            </div>
          </div>
        </div>
      </section>

      {settings.about.story ? (
        <section className="shell py-16 sm:py-20">
          <div className="prose-editorial mx-auto max-w-2xl whitespace-pre-line text-sm text-muted">
            {settings.about.story}
          </div>
        </section>
      ) : null}

      <section className="border-y border-gold-400/20 bg-obsidian py-16 sm:py-24">
        <div className="shell">
          <p className="eyebrow">How we work</p>
          <h2 className="mt-4 max-w-xl font-display text-3xl leading-tight text-plum sm:text-[2.8rem]">
            Four things we will not compromise on
          </h2>
          <div className="rise mt-12 grid gap-px overflow-hidden rounded-md border border-gold-400/25 bg-gold-400/20 sm:grid-cols-2">
            {VALUES.map((value, index) => (
              <div key={value.title} className="bg-white p-7 sm:p-9">
                <p className="gold-text font-display text-2xl">0{index + 1}</p>
                <h3 className="mt-4 font-display text-2xl text-plum">{value.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="shell py-16 text-center sm:py-24">
        <p className="eyebrow">Come in</p>
        <h2 className="mx-auto mt-4 max-w-xl font-display text-3xl leading-tight text-plum sm:text-5xl">
          Book. Glow. Repeat.
        </h2>
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-muted">
          Message us with the treatment and the day — we will take it from there.
        </p>
        <p className="mx-auto mt-3 text-[10px] uppercase tracking-wide2 text-faint">{ADDRESS_LINE}</p>
        <Link to="/contact" className="btn-solid mt-8">
          Book an appointment
        </Link>
      </section>
    </>
  );
}
