import { Link } from 'react-router-dom';
import { Seo } from '@/components/seo/Seo';

export function NotFoundPage() {
  return (
    <>
      <Seo title="Page not found — UV Clinics" description="That page has moved." noIndex />
      <section className="shell flex min-h-[62vh] flex-col items-center justify-center py-24 text-center">
        <p className="gold-text font-display text-7xl leading-none">404</p>
        <h1 className="mt-6 font-display text-3xl text-cream sm:text-4xl">That page has been trimmed</h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
          The link you followed does not exist any more. The menu, the gallery and the booking details
          are all still here.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/services" className="btn-solid">
            See the menu
          </Link>
          <Link to="/" className="btn-line">
            Back home
          </Link>
        </div>
      </section>
    </>
  );
}
