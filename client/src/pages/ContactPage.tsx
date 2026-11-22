import { useSettings } from '@/context/SettingsContext';
import { Seo } from '@/components/seo/Seo';
import { normaliseNumber, buildOrderLink, buildSingleProductMessage } from '@/lib/whatsapp';
import { ADDRESS_LINE, INSTAGRAM_HANDLE, INSTAGRAM_URL, PHONE_DISPLAY } from '@/lib/brand';

export function ContactPage() {
  const { settings } = useSettings();
  const whatsapp = normaliseNumber(settings.whatsappNumber);
  const instagram = settings.instagramUrl || INSTAGRAM_URL;
  const handle = settings.instagramHandle.replace(/^@/, '') || INSTAGRAM_HANDLE;

  const link = buildOrderLink(
    settings,
    buildSingleProductMessage(settings, {
      productName: 'an appointment',
      variantName: null,
      quantity: 1,
      price: null,
    })
  );

  const mapHref =
    settings.mapsUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${settings.businessName} Mirra Guduru Plaza Miyapur ${settings.city || 'Hyderabad'}`
    )}`;

  return (
    <>
      <Seo
        title="Visit Us — UV Clinics, Miyapur, Hyderabad"
        description="Find UV Clinics at 2nd Floor, Mirra Guduru Plaza, Miyapur Cross Roads, Hyderabad. Call or WhatsApp 88868 68929 to book."
        canonicalPath="/contact"
      />

      <section className="border-b border-gold-400/20 bg-obsidian">
        <div className="shell py-16 sm:py-20">
          <p className="eyebrow flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-7 bg-gold-500/70" />
            Visit us
          </p>
          <h1 className="mt-4 font-display text-4xl leading-[1.05] text-plum sm:text-6xl">
            Come in, sit down,<br />
            <span className="gold-text">let us take it from here</span>
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted">
            Open every day, 11am to 10pm, on the second floor of Mirra Guduru Plaza — above the Kodi Kurra
            restaurant at Miyapur Cross Roads.
          </p>
        </div>
      </section>

      <section className="shell grid gap-12 py-14 sm:py-20 lg:grid-cols-[1fr_1fr]">
        <div>
          <div className="grid gap-px overflow-hidden rounded-md border border-gold-400/20 bg-gold-400/20 sm:grid-cols-2">
            <div className="bg-white p-6 transition-colors duration-500 hover:bg-gold-50">
              <p className="text-[9px] uppercase tracking-micro text-gold-600">The clinic</p>
              <p className="mt-3 text-sm leading-relaxed text-plum/85">
                2nd Floor, Mirra Guduru Plaza,
                <br />
                Miyapur Cross Roads,
                <br />
                Hyderabad, Telangana 500049
              </p>
              <a
                href={mapHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wide2 text-gold-700 hover:text-gold-600"
              >
                Open in maps
                <span className="h-px w-6 bg-gold-400/60" />
              </a>
            </div>

            <div className="bg-white p-6 transition-colors duration-500 hover:bg-gold-50">
              <p className="text-[9px] uppercase tracking-micro text-gold-600">Call &amp; WhatsApp</p>
              {settings.whatsappNumber ? (
                <>
                  <a
                    href={`tel:+${whatsapp}`}
                    className="mt-3 block font-display text-2xl text-plum hover:text-gold-700"
                  >
                    {PHONE_DISPLAY}
                  </a>
                  <a
                    href={`https://wa.me/${whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-[10px] font-semibold uppercase tracking-wide2 text-gold-700"
                  >
                    Message on WhatsApp
                  </a>
                </>
              ) : (
                <p className="mt-3 text-sm text-muted">Number coming soon.</p>
              )}
            </div>

            <div className="bg-white p-6 transition-colors duration-500 hover:bg-gold-50">
              <p className="text-[9px] uppercase tracking-micro text-gold-600">Instagram</p>
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block font-display text-xl text-plum hover:text-gold-700"
              >
                @{handle}
              </a>
              <p className="mt-2 text-[11px] leading-relaxed text-muted">
                The newest work, offers and open slots go up here first.
              </p>
            </div>

            <div className="bg-white p-6 transition-colors duration-500 hover:bg-gold-50">
              <p className="text-[9px] uppercase tracking-micro text-gold-600">Hours</p>
              <p className="mt-3 text-sm leading-relaxed text-plum/85">Monday to Sunday</p>
              <p className="font-display text-xl text-plum">11:00 am – 10:00 pm</p>
              <p className="mt-2 text-[11px] leading-relaxed text-muted">
                Walk-ins welcome; clinical treatments are best booked ahead.
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-md border border-gold-400/20 bg-white p-6 shadow-soft">
            <p className="eyebrow">Before you come in</p>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted">
              <li>Laser, peel and PMU appointments start with a consultation or patch test.</li>
              <li>Come with clean skin for facials and no make-up for dental work.</li>
              <li>Bring any prescriptions or products you are currently using.</li>
              <li>Running late? Message us — we will hold the slot as long as we can.</li>
            </ul>
          </div>
        </div>

        <div>
          {settings.policies.shipping || settings.policies.returns ? (
            <div className="space-y-8">
              {settings.policies.shipping ? (
                <div>
                  <p className="eyebrow">Pricing &amp; payment</p>
                  <div className="prose-editorial mt-4 whitespace-pre-line text-sm text-muted">
                    {settings.policies.shipping}
                  </div>
                </div>
              ) : null}
              {settings.policies.returns ? (
                <div>
                  <p className="eyebrow">Cancellations</p>
                  <div className="prose-editorial mt-4 whitespace-pre-line text-sm text-muted">
                    {settings.policies.returns}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="mt-8 rounded-md border border-gold-400/25 bg-plum p-8 text-night">
            <p className="text-[10px] uppercase tracking-micro text-gold-200">Book in one message</p>
            <h2 className="mt-4 font-display text-3xl leading-tight text-night">
              Tell us the treatment and the day
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-night/70">
              Send a WhatsApp with what you want and when you are free. We reply with the slot, the doctor
              or artist, and the price — nothing is charged until you are in the clinic.
            </p>
            {link ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-solid mt-7 w-full !border-gold-300 !bg-gold-300 !text-plum hover:!bg-gold-200"
              >
                {link.channel === 'whatsapp' ? 'Message on WhatsApp' : 'DM on Instagram'}
              </a>
            ) : null}
            <a
              href={`tel:+${whatsapp}`}
              className="btn mt-3 w-full border-night/25 bg-transparent text-night hover:border-gold-300 hover:text-gold-200"
            >
              Call {PHONE_DISPLAY}
            </a>
          </div>

          <p className="mt-6 text-[10px] uppercase tracking-wide2 text-faint">{ADDRESS_LINE}</p>
        </div>
      </section>
    </>
  );
}
