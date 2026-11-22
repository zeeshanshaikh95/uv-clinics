const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '');

/** Fallback hero image when no slide is configured. */
export const HERO_IMAGE = `${BASE}/images/hero-portrait.jpg`;

/** Clinic interior visual used when settings hold no custom image. */
export const FOUNDER_IMAGE = `${BASE}/images/interior.jpg`;

export const OG_IMAGE = `${BASE}/images/hero-skin.jpg`;

export const SITE_URL =
  (import.meta.env.VITE_PUBLIC_SITE_URL ?? '').trim() || 'http://localhost:5173';

/** The clinic's own Instagram — the source of every brand fact on this site. */
export const INSTAGRAM_URL = 'https://www.instagram.com/uvclinics/';
export const INSTAGRAM_HANDLE = 'uvclinics';

/** Public contact details, taken from the clinic's Instagram bio and offers. */
export const PHONE_DISPLAY = '+91 88868 68929';
export const ADDRESS_LINE =
  '2nd Floor, Mirra Guduru Plaza, Miyapur Cross Roads, Hyderabad 500049';

/**
 * Absolute asset URL that respects Vite's BASE_URL — and is safe to call on a
 * value that was already resolved (project sites are served from /<repo>/, so
 * double-prefixing would 404).
 */
export function assetUrl(path: string): string {
  if (!path) return '';
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  if (!path.startsWith('/')) return `${BASE}/${path}`;
  if (!BASE || path === BASE || path.startsWith(`${BASE}/`)) return path;
  return `${BASE}${path}`;
}
