import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '@/context/SettingsContext';
import { assetUrl } from '@/lib/brand';
import type { HeroSlide } from '@/types';

const FALLBACK_SLIDES: HeroSlide[] = [
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

const AUTOPLAY_MS = 7000;

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Hero: a photo slider inside a real CSS 3D scene.
 *
 * The stage is built from separate translateZ planes — an arch-framed portrait,
 * a rotating gold halo, an orbiting ring, glass practice chips and a spinning
 * U/V coin — so moving the pointer (or swiping) moves the foreground faster
 * than the photograph. Transform/opacity only, and every depth effect is
 * switched off under prefers-reduced-motion.
 */
export function HeroSlider() {
  const { settings } = useSettings();

  const slides = useMemo(() => {
    const configured = (settings.heroSlides ?? []).filter(
      (slide) => slide.active && (slide.imageUrl || slide.headline)
    );
    return configured.length ? configured : FALLBACK_SLIDES;
  }, [settings.heroSlides]);

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const touchStart = useRef<number | null>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const reduced = useRef(false);

  const total = slides.length;
  const slide = slides[Math.min(index, total - 1)] ?? FALLBACK_SLIDES[0];

  const go = useCallback((next: number) => setIndex(((next % total) + total) % total), [total]);

  useEffect(() => {
    reduced.current = prefersReducedMotion();
  }, []);

  useEffect(() => {
    if (index > total - 1) setIndex(0);
  }, [index, total]);

  useEffect(() => {
    setProgress(0);
    if (total < 2 || paused || reduced.current) return;
    const started = Date.now();
    const tick = window.setInterval(() => {
      setProgress(Math.min(1, (Date.now() - started) / AUTOPLAY_MS));
    }, 80);
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % total);
    }, AUTOPLAY_MS);
    return () => {
      window.clearInterval(tick);
      window.clearInterval(timer);
    };
  }, [index, total, paused]);

  useEffect(() => {
    if (reduced.current) return;
    const onMove = (event: PointerEvent) => {
      const el = sceneRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      setTilt({ x: Math.max(-0.5, Math.min(0.5, px)), y: Math.max(-0.5, Math.min(0.5, py)) });
    };
    const onLeave = () => setTilt({ x: 0, y: 0 });
    const el = sceneRef.current;
    el?.addEventListener('pointermove', onMove);
    el?.addEventListener('pointerleave', onLeave);
    return () => {
      el?.removeEventListener('pointermove', onMove);
      el?.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  const shift = (depth: number) =>
    `translate3d(${tilt.x * depth}px, ${tilt.y * depth}px, 0) rotateY(${tilt.x * 5}deg) rotateX(${-tilt.y * 5}deg)`;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="UV Clinics highlights"
      className="relative isolate overflow-hidden bg-night"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') go(index + 1);
        if (event.key === 'ArrowLeft') go(index - 1);
      }}
      onTouchStart={(event) => {
        touchStart.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        if (touchStart.current === null) return;
        const delta = (event.changedTouches[0]?.clientX ?? 0) - touchStart.current;
        if (Math.abs(delta) > 45) go(index + (delta < 0 ? 1 : -1));
        touchStart.current = null;
      }}
    >
      {/* Paper grain: a faint dotted grid that keeps the light ground from going flat. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            'radial-gradient(rgba(198,161,91,0.22) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
          maskImage: 'radial-gradient(70% 60% at 50% 30%, #000 0%, transparent 78%)',
          WebkitMaskImage: 'radial-gradient(70% 60% at 50% 30%, #000 0%, transparent 78%)',
        }}
      />
      <div className="pointer-events-none absolute -left-40 top-10 h-[34rem] w-[34rem] rounded-full bg-gold-300/25 blur-[130px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[30rem] w-[30rem] rounded-full bg-uv-300/25 blur-[130px]" />

      <div className="shell relative grid items-center gap-12 pb-16 pt-14 sm:pb-20 sm:pt-16 lg:grid-cols-12 lg:gap-8 lg:pb-24 lg:pt-20">
        {/* ── Copy ──────────────────────────────────────────────── */}
        <div className="order-2 lg:order-1 lg:col-span-6 lg:pr-6">
          <div key={index} className="max-w-xl">
            <span
              className="animate-fade-up inline-flex items-center gap-2.5 rounded-full border border-gold-400/30 bg-white/70 px-3.5 py-1.5 backdrop-blur-sm"
              style={{ animationDelay: '30ms' }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
              <span className="text-[9px] uppercase tracking-micro text-gold-700">
                {slide.eyebrow || 'Miyapur · Hyderabad'}
              </span>
            </span>

            <h1
              className="animate-fade-up mt-6 font-display text-[2.6rem] leading-[1.03] text-plum text-balance sm:text-[3.6rem] lg:text-[4.2rem]"
              style={{ animationDelay: '110ms' }}
            >
              {slide.headline || 'Where science meets style'}
            </h1>

            {slide.subheadline ? (
              <p
                className="animate-fade-up mt-6 max-w-md text-[15px] leading-relaxed text-muted"
                style={{ animationDelay: '200ms' }}
              >
                {slide.subheadline}
              </p>
            ) : null}

            <div
              className="animate-fade-up mt-9 flex flex-wrap items-center gap-3"
              style={{ animationDelay: '300ms' }}
            >
              <Link to={slide.ctaHref || '/services'} className="btn-solid group">
                {slide.ctaLabel || 'Explore treatments'}
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-line"
              >
                WhatsApp us
              </a>
            </div>

            <dl
              className="animate-fade-up mt-10 grid max-w-md grid-cols-3 gap-px overflow-hidden rounded-md border border-gold-400/20 bg-gold-400/20"
              style={{ animationDelay: '400ms' }}
            >
              {[
                ['6', 'departments'],
                ['4.7★', 'Google rating'],
                ['11am–10pm', 'open daily'],
              ].map(([value, label]) => (
                <div key={label} className="bg-white/85 px-3 py-3.5 text-center sm:px-4">
                  <dt className="font-display text-lg text-plum sm:text-xl">{value}</dt>
                  <dd className="mt-0.5 text-[8px] uppercase tracking-wide2 text-faint">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Slider controls */}
          <div className="mt-10 flex items-center justify-between gap-4 border-t border-gold-400/20 pt-5">
            <div className="flex items-center gap-3">
              <span className="font-display text-xl text-gold-600">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="relative h-[2px] w-24 overflow-hidden rounded-full bg-gold-400/25 sm:w-36">
                <span
                  className="absolute inset-y-0 left-0 rounded-full bg-gold-500 transition-[width] duration-100 ease-linear"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>
              <span className="text-[10px] tracking-wide2 text-faint">
                {String(total).padStart(2, '0')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {total > 1 ? (
                <div className="mr-2 hidden items-center gap-1.5 sm:flex" role="tablist" aria-label="Hero slides">
                  {slides.map((item, itemIndex) => (
                    <button
                      key={`dot-${itemIndex}`}
                      type="button"
                      role="tab"
                      aria-selected={itemIndex === index}
                      aria-label={`Go to slide ${itemIndex + 1}${item.eyebrow ? `: ${item.eyebrow}` : ''}`}
                      onClick={() => go(itemIndex)}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        itemIndex === index ? 'w-7 bg-gold-500' : 'w-1.5 bg-plum/20 hover:bg-plum/40'
                      }`}
                    />
                  ))}
                </div>
              ) : null}

              <button
                type="button"
                aria-label="Previous slide"
                onClick={() => go(index - 1)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-plum/15 bg-white/70 text-plum transition-colors hover:border-gold-400 hover:bg-gold-400"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Next slide"
                onClick={() => go(index + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-plum/15 bg-white/70 text-plum transition-colors hover:border-gold-400 hover:bg-gold-400"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ── 3D stage ──────────────────────────────────────────── */}
        <div ref={sceneRef} className="scene relative order-1 mx-auto w-full max-w-[480px] lg:order-2 lg:col-span-6 lg:max-w-none">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[440px] lg:max-w-[480px]">
            {/* rotating halo */}
            <div
              aria-hidden="true"
              className="absolute inset-x-6 bottom-6 top-10 animate-spin-slow rounded-full opacity-70 blur-[1px]"
              style={{ transform: 'translateZ(-70px) scale(1.06)' }}
            >
              <div className="halo h-full w-full" />
            </div>

            {/* photographic arch */}
            <div
              className="layer-3d absolute inset-x-5 bottom-0 top-6 transition-transform duration-300 ease-out"
              style={{ transform: `${shift(14)} translateZ(40px)` }}
            >
              <div className="arch-mask relative h-full w-full border border-white/80 bg-white/60 p-2 shadow-panel">
                <div className="arch-mask relative h-full w-full overflow-hidden bg-graphite">
                  {slides.map((item, itemIndex) => {
                    const isActive = itemIndex === index % total;
                    const src = item.imageUrl
                      ? item.imageUrl.startsWith('http')
                        ? item.imageUrl
                        : assetUrl(item.imageUrl)
                      : '';
                    return (
                      <div
                        key={`${item.imageUrl}-${itemIndex}`}
                        aria-hidden={!isActive}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-editorial ${
                          isActive ? 'opacity-100' : 'pointer-events-none opacity-0'
                        }`}
                      >
                        {src ? (
                          <img
                            src={src}
                            alt={item.headline || 'UV Clinics'}
                            loading={itemIndex === 0 ? 'eager' : 'lazy'}
                            className={`h-full w-full object-cover object-[center_40%] ${
                              isActive ? 'animate-ken-burns' : ''
                            }`}
                          />
                        ) : null}
                      </div>
                    );
                  })}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-plum/45 via-transparent to-transparent" />

                  {/* caption plate inside the frame */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    <p className="text-[8px] uppercase tracking-micro text-white/70">
                      {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                    </p>
                    <p className="mt-1 font-display text-lg leading-tight text-white sm:text-xl">
                      {slide.eyebrow || 'UV Clinics'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* gold orbit ring, standing on edge */}
            <div
              aria-hidden="true"
              className="layer-3d pointer-events-none absolute inset-[-6%] transition-transform duration-700 ease-out"
              style={{ transform: `${shift(22)} translateZ(120px) rotateX(74deg)` }}
            >
              <div className="ring-3d h-full w-full animate-spin-slow" />
            </div>

            {/* spinning U/V coin */}
            <div
              aria-hidden="true"
              className="layer-3d absolute -right-3 top-8 sm:-right-6 lg:-right-4"
              style={{ transform: `${shift(30)} translateZ(170px)` }}
            >
              <div className="relative h-20 w-20 animate-float sm:h-24 sm:w-24" style={{ transformStyle: 'preserve-3d' }}>
                <div className="medallion absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-2xl tracking-[0.08em] text-plum/80 sm:text-3xl">UV</span>
                </div>
                <div className="absolute -inset-3 animate-pulse-ring rounded-full border border-gold-400/50" />
                <div className="absolute -inset-6 rounded-full border border-gold-400/20" />
              </div>
            </div>

            {/* floating glass practice chips */}
            <div
              className="layer-3d absolute -left-2 top-[22%] sm:-left-6 lg:-left-10"
              style={{ transform: `${shift(40)} translateZ(180px)` }}
            >
              <div className="animate-float-slow rounded-full border border-white/70 bg-white/80 px-3.5 py-2 shadow-soft backdrop-blur-md">
                <span className="text-[9px] uppercase tracking-wide2 text-plum/80">Dermatology</span>
              </div>
            </div>

            <div
              className="layer-3d absolute -right-1 bottom-[26%] sm:-right-4"
              style={{ transform: `${shift(34)} translateZ(150px)` }}
            >
              <div className="animate-float rounded-full border border-white/70 bg-white/80 px-3.5 py-2 shadow-soft backdrop-blur-md">
                <span className="text-[9px] uppercase tracking-wide2 text-plum/80">Dental · Salon</span>
              </div>
            </div>

            {/* glass orbs + shards */}
            <div
              className="layer-3d absolute bottom-[8%] left-[6%]"
              style={{ transform: `${shift(48)} translateZ(200px)` }}
            >
              <div className="h-11 w-11 animate-float-slow rounded-full orb sm:h-14 sm:w-14" />
            </div>
            <div
              className="layer-3d absolute right-[10%] top-[4%]"
              style={{ transform: `${shift(54)} translateZ(210px)` }}
            >
              <div className="h-7 w-7 animate-float rounded-full orb-gold sm:h-9 sm:w-9" />
            </div>
            <div
              aria-hidden="true"
              className="layer-3d absolute -left-6 bottom-[38%] h-24 w-1.5 rounded-full shard"
              style={{ transform: `${shift(26)} translateZ(90px) rotate(-14deg)` }}
            />
            <div
              aria-hidden="true"
              className="layer-3d absolute -right-4 top-[42%] h-16 w-1 rounded-full shard opacity-70"
              style={{ transform: `${shift(18)} translateZ(70px) rotate(9deg)` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
