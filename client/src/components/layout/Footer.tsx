import { Link } from 'react-router-dom';
import { useSettings } from '@/context/SettingsContext';
import { Wordmark } from '@/components/Wordmark';
import { normaliseNumber } from '@/lib/whatsapp';
import { ADDRESS_LINE, INSTAGRAM_HANDLE, INSTAGRAM_URL, PHONE_DISPLAY } from '@/lib/brand';

export function Footer() {
  const { settings } = useSettings();
  const whatsapp = normaliseNumber(settings.whatsappNumber);
  const instagram = settings.instagramUrl || INSTAGRAM_URL;

  return (
    <footer className="mt-24 bg-obsidian">
      <div aria-hidden="true" className="h-px w-full bg-gradient-to-r from-transparent via-gold-400/70 to-transparent" />
      <div className="shell grid gap-12 py-14 md:grid-cols-[1.4fr_1fr_1fr_1.2fr] md:py-16">
        <div>
          <Wordmark size="md" asLink={false} className="items-start" />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted">
            {settings.about.intro ||
              'Six departments under one roof in Miyapur, Hyderabad — dermatology, aesthetics & laser, dental, hair, nails and makeup.'}
          </p>
          <p className="mt-5 text-[9px] uppercase tracking-micro text-faint">
            Where science meets style
          </p>
        </div>

        <div>
          <p className="eyebrow flex items-center gap-2.5">
            <span aria-hidden="true" className="h-px w-5 bg-gold-500/60" />
            Treatments
          </p>
          <ul className="mt-4 space-y-2.5 text-sm text-muted">
            <li><Link to="/services" className="hover:text-gold-700">All treatments</Link></li>
            <li><Link to="/category/skin" className="hover:text-gold-700">Skin &amp; dermatology</Link></li>
            <li><Link to="/category/aesthetics" className="hover:text-gold-700">Aesthetics &amp; laser</Link></li>
            <li><Link to="/category/dental" className="hover:text-gold-700">Dental care</Link></li>
            <li><Link to="/category/nails" className="hover:text-gold-700">Nail studio</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow flex items-center gap-2.5">
            <span aria-hidden="true" className="h-px w-5 bg-gold-500/60" />
            Clinic
          </p>
          <ul className="mt-4 space-y-2.5 text-sm text-muted">
            <li><Link to="/about" className="hover:text-gold-700">About us</Link></li>
            <li><Link to="/gallery" className="hover:text-gold-700">Gallery</Link></li>
            <li><Link to="/reviews" className="hover:text-gold-700">Reviews</Link></li>
            <li><Link to="/contact" className="hover:text-gold-700">Visit &amp; policies</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow flex items-center gap-2.5">
            <span aria-hidden="true" className="h-px w-5 bg-gold-500/60" />
            Reach us
          </p>
          <ul className="mt-4 space-y-2.5 text-sm text-muted">
            <li>
              <a
                href={`tel:+${(settings.whatsappNumber || '').replace(/\D/g, '')}`}
                className="hover:text-gold-700"
              >
                Call · {PHONE_DISPLAY}
              </a>
            </li>
            {whatsapp ? (
              <li>
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold-700"
                >
                  WhatsApp us
                </a>
              </li>
            ) : null}
            <li>
              <a href={instagram} target="_blank" rel="noopener noreferrer" className="hover:text-gold-700">
                Instagram · @{settings.instagramHandle.replace(/^@/, '') || INSTAGRAM_HANDLE}
              </a>
            </li>
            {settings.email ? (
              <li>
                <a href={`mailto:${settings.email}`} className="hover:text-gold-700">
                  {settings.email}
                </a>
              </li>
            ) : null}
            <li className="leading-relaxed">{ADDRESS_LINE}</li>
            <li className="text-[10px] uppercase tracking-wide2 text-faint">Open daily · 11am–10pm</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gold-400/15">
        <div className="shell flex flex-col items-start justify-between gap-3 py-5 text-[10px] uppercase tracking-wide2 text-faint sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} {settings.businessName}. All rights reserved.</span>
          <div className="flex items-center gap-5">
            <Link to="/contact" className="hover:text-gold-700">Policies</Link>
            <Link to="/admin" className="hover:text-gold-700">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
