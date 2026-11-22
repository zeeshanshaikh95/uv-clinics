import { useState } from 'react';
import { publicApi } from '@/api/endpoints';
import { useApi } from '@/hooks/useApi';
import { useSettings } from '@/context/SettingsContext';
import { EmptyState } from '@/components/EmptyState';
import { Seo } from '@/components/seo/Seo';

export function GalleryPage() {
  const { settings } = useSettings();
  const items = useApi(() => publicApi.listGallery().then((r) => r.items), []);
  const [active, setActive] = useState<string | null>(null);

  const list = items.data ?? [];
  const activeItem = list.find((item) => item._id === active);

  return (
    <>
      <Seo
        title="Gallery — UV Clinics, Miyapur, Hyderabad"
        description="Skin, laser, dental, hair, nails and makeup work from UV Clinics, Miyapur — the clinic's own photographs and transformations."
        canonicalPath="/gallery"
      />

      <section className="border-b border-gold-400/10 bg-obsidian">
        <div className="shell py-16 sm:py-20">
          <p className="eyebrow flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-7 bg-gold-500/70" />
            Gallery
          </p>
          <h1 className="mt-4 font-display text-4xl leading-[1.05] text-plum sm:text-6xl">Work from the clinic</h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted">
            Real clients, real light, no filters added after — skin, hair, nails and smiles from the floor. Tap any frame to open it larger.
          </p>
          <a
            href={settings.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-wide2 text-gold-700"
          >
            @{settings.instagramHandle.replace(/^@/, '')}
            <span className="h-px w-8 bg-gold-400" />
          </a>
        </div>
      </section>

      <section className="shell py-14 sm:py-20">
        {items.loading ? (
          <div className="rise grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="skeleton aspect-[4/5]" />
            ))}
          </div>
        ) : !list.length ? (
          <EmptyState
            title="The gallery is being filled"
            description="Photographs appear here as soon as they are added in the admin panel."
          />
        ) : (
          <div className="rise grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {list.map((item) => (
              <button
                key={item._id}
                type="button"
                onClick={() => setActive(item._id)}
                className="group relative aspect-[4/5] overflow-hidden rounded-md border border-gold-400/20 bg-graphite text-left"
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.caption || 'UV Clinics'}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-silk group-hover:scale-105"
                  />
                ) : null}
                <span className="absolute inset-0 bg-gradient-to-t from-plum/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="absolute inset-x-0 bottom-0 translate-y-2 p-3 text-[9px] uppercase tracking-wide2 text-white/85 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {item.caption || 'View'}
                </span>
                <span className="absolute inset-0 border border-gold-400/0 transition-colors duration-300 group-hover:border-gold-400/50" />
              </button>
            ))}
          </div>
        )}
      </section>

      {activeItem ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-plum/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.caption || 'Gallery image'}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setActive(null)}
            className="absolute inset-0"
          />
          <div className="relative max-h-full w-full max-w-3xl">
            {activeItem.image ? (
              <img
                src={activeItem.image}
                alt={activeItem.caption || 'UV Clinics'}
                className="max-h-[82vh] w-full rounded-sm border border-gold-300/40 object-contain"
              />
            ) : null}
            <div className="mt-4 flex items-center justify-between gap-4">
              <p className="text-[10px] uppercase tracking-wide2 text-white/70">{activeItem.caption}</p>
              <button
                type="button"
                onClick={() => setActive(null)}
                className="text-[10px] uppercase tracking-wide2 text-gold-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
