import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { publicApi } from '@/api/endpoints';
import { useApi } from '@/hooks/useApi';
import { ServiceCard } from '@/components/ServiceCard';
import { EmptyState } from '@/components/EmptyState';
import { Seo } from '@/components/seo/Seo';
import { SectionIntro } from '@/components/SectionIntro';

const SORTS = [
  { value: 'featured', label: 'Recommended' },
  { value: 'bestseller', label: 'Most booked' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price · low to high' },
  { value: 'price_desc', label: 'Price · high to low' },
] as const;

type SortValue = (typeof SORTS)[number]['value'];

export function ServicesPage() {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get('search') ?? '');
  const [debounced, setDebounced] = useState(search);

  const category = params.get('category') ?? '';
  const sort = (params.get('sort') as SortValue) ?? 'featured';

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(search.trim()), 280);
    return () => window.clearTimeout(id);
  }, [search]);

  const categories = useApi(() => publicApi.listCategories().then((r) => r.categories), []);
  const services = useApi(
    () =>
      publicApi
        .listProducts({ search: debounced || undefined, category: category || undefined, sort })
        .then((r) => r.products),
    [debounced, category, sort]
  );

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const heading = useMemo(() => {
    if (!category) return 'The full menu';
    const match = categories.data?.find((item) => item.slug === category);
    return match?.name ?? 'The full menu';
  }, [category, categories.data]);

  return (
    <>
      <Seo
        title="Treatments & Pricing — UV Clinics, Miyapur, Hyderabad"
        description="Skin, aesthetics & laser, dental, hair, nails and makeup treatments at UV Clinics, Miyapur — HydraFacial, carbon peel laser, teeth scaling, hair spa and Korean nail art."
        canonicalPath="/services"
      />

      <section className="border-b border-gold-400/10 bg-obsidian">
        <div className="shell py-14 sm:py-20">
          <p className="eyebrow">Treatments</p>
          <h1 className="mt-4 font-display text-4xl leading-[1.05] text-plum sm:text-6xl">{heading}</h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted">
            Published offer prices are shown against the treatment. Everything else is quoted after a
            consultation — session count, area and assessment decide the final amount, and we confirm it
            on WhatsApp before you book.
          </p>
        </div>
      </section>

      <div className="sticky top-[76px] z-30 border-b border-gold-400/10 bg-night/90 backdrop-blur-xl sm:top-20">
        <div className="shell flex flex-col gap-3 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <label htmlFor="service-search" className="sr-only">
              Search treatments
            </label>
            <div className="relative w-full max-w-xs">
              <svg
                viewBox="0 0 24 24"
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="11" cy="11" r="6.5" />
                <path d="M16 16l4 4" strokeLinecap="round" />
              </svg>
              <input
                id="service-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search facial, laser, dental…"
                className="w-full border border-gold-400/20 bg-onyx py-2.5 pl-9 pr-3 text-sm text-cream placeholder:text-faint focus:border-gold-400/70 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => update('category', '')}
              className={`border px-3 py-2 text-[9px] uppercase tracking-wide2 transition-colors ${
                !category
                  ? 'border-gold-400 bg-gold-400 text-plum'
                  : 'border-gold-400/25 text-cream/70 hover:border-gold-400/60'
              }`}
            >
              All
            </button>
            {(categories.data ?? []).map((item) => (
              <button
                key={item._id}
                type="button"
                onClick={() => update('category', item.slug)}
                className={`border px-3 py-2 text-[9px] uppercase tracking-wide2 transition-colors ${
                  category === item.slug
                    ? 'border-gold-400 bg-gold-400 text-plum'
                    : 'border-gold-400/25 text-cream/70 hover:border-gold-400/60'
                }`}
              >
                {item.name}
              </button>
            ))}

            <label htmlFor="service-sort" className="sr-only">
              Sort treatments
            </label>
            <select
              id="service-sort"
              value={sort}
              onChange={(event) => update('sort', event.target.value)}
              className="border border-gold-400/20 bg-onyx px-3 py-2 text-[10px] uppercase tracking-wide2 text-cream/80 focus:border-gold-400/70 focus:outline-none"
            >
              {SORTS.map((option) => (
                <option key={option.value} value={option.value} className="bg-onyx">
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <section className="shell py-12 sm:py-16">
        {services.loading ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="skeleton aspect-[3/4]" />
            ))}
          </div>
        ) : services.error ? (
          <EmptyState
            tone="error"
            title="We couldn't load the menu"
            description={services.error}
            action={
              <button type="button" className="btn-line" onClick={services.refetch}>
                Try again
              </button>
            }
          />
        ) : !services.data?.length ? (
          <EmptyState
            title="Nothing matched that"
            description="Try a different word, or clear the filters and browse the whole menu."
            action={
              <button
                type="button"
                className="btn-line"
                onClick={() => {
                  setSearch('');
                  setParams(new URLSearchParams(), { replace: true });
                }}
              >
                Clear filters
              </button>
            }
          />
        ) : (
          <>
            <p className="mb-8 text-[10px] uppercase tracking-wide2 text-faint">
              {services.data.length} {services.data.length === 1 ? 'treatment' : 'treatments'}
              {debounced ? ` for “${debounced}”` : ''}
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4 lg:gap-x-6">
              {services.data.map((product, index) => (
                <ServiceCard key={product._id} product={product} priority={index < 4} />
              ))}
            </div>
          </>
        )}
      </section>

      <section className="border-t border-gold-400/20 bg-obsidian py-16">
        <div className="shell">
          <SectionIntro
            eyebrow="Not sure what you need?"
            title="Ask before you book"
            description="Tell us the concern — skin, smile or hair — and book a consultation. We will tell you honestly which treatment will help, and which will not."
            align="center"
          />
        </div>
      </section>
    </>
  );
}
