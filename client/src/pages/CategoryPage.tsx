import { Link, useParams } from 'react-router-dom';
import { publicApi } from '@/api/endpoints';
import { useApi } from '@/hooks/useApi';
import { ServiceCard } from '@/components/ServiceCard';
import { EmptyState } from '@/components/EmptyState';
import { Seo } from '@/components/seo/Seo';

export function CategoryPage() {
  const { slug = '' } = useParams();
  const data = useApi(() => publicApi.getCategory(slug), [slug]);

  if (data.loading) {
    return (
      <div className="shell py-20">
        <div className="skeleton h-10 w-64" />
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="skeleton aspect-[3/4]" />
          ))}
        </div>
      </div>
    );
  }

  if (data.error || !data.data) {
    return (
      <div className="shell py-24">
        <EmptyState
          tone="error"
          title="We couldn't find that department"
          description={data.error ?? 'This department is not on the menu any more.'}
          action={
            <Link to="/services" className="btn-line">
              Browse all treatments
            </Link>
          }
        />
      </div>
    );
  }

  const { category, products } = data.data;

  return (
    <>
      <Seo
                  title={`${category.name} — UV Clinics, Miyapur`}
        description={
          category.description || `${category.name} at UV Clinics, Mirra Guduru Plaza, Miyapur, Hyderabad.`
        }
        canonicalPath={`/category/${category.slug}`}
        image={category.image}
      />

      <section className="relative overflow-hidden border-b border-gold-400/20">
        {category.image ? (
          <img
            src={category.image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-r from-plum/90 via-plum/75 to-plum/25" />
        <div className="shell relative py-20 sm:py-28">
          <nav aria-label="Breadcrumb" className="text-[9px] uppercase tracking-wide2 text-white/60">
            <Link to="/services" className="hover:text-gold-200">
              Treatments
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gold-200">{category.name}</span>
          </nav>
          <h1 className="mt-5 max-w-2xl font-display text-4xl leading-[1.05] text-white sm:text-6xl">
            {category.name}
          </h1>
          {category.description ? (
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/75">{category.description}</p>
          ) : null}
        </div>
      </section>

      <section className="shell py-14 sm:py-20">
        {!products.length ? (
          <EmptyState
            title="Nothing published here yet"
            description="Treatments for this department will appear as soon as they are added in the admin panel."
          />
        ) : (
          <>
            <p className="mb-8 text-[10px] uppercase tracking-wide2 text-faint">
              {products.length} {products.length === 1 ? 'treatment' : 'treatments'}
            </p>
            <div className="rise grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4 lg:gap-x-6">
              {products.map((product, index) => (
                <ServiceCard key={product._id} product={product} priority={index < 4} />
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}
