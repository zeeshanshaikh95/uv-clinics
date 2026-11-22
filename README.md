# UV Clinics — Website

Mobile-first site for **UV Clinics** (@uvclinics) — a six-department skin and beauty clinic on the
second floor of Mirra Guduru Plaza, **Miyapur Cross Roads, Hyderabad**. Primary conversion: browse the
treatment menu → add treatments to a visit → **book on WhatsApp** (no payment gateway, by design).

**Live preview:** https://zeeshanshaikh95.github.io/uv-clinics/ (GitHub Pages — static menu snapshot,
no admin; see [Hosting](#hosting--live-url)).

Built to the same architecture as the client's other house sites (React SPA + Express API + MongoDB,
protected admin panel, WhatsApp ordering), with a completely different design system: **porcelain and
champagne** — a light, clinical-luxe palette with a muted ultraviolet accent — a 3D animated hero with
a photo slider, and a six-department clinic menu model instead of a single-product catalogue.

> **Data policy:** departments, treatment names and the published offer prices come from the clinic's
> own public Instagram profile and offer posts (HydraFacial ₹999, haircut + L'Oréal hair spa ₹999,
> carbon peel laser ₹1,499, full-body laser ₹4,999, gel nails ₹299, nail extensions ₹799, teeth scaling
> ₹999). Everything the clinic has not published is left as **“price on request”** — no price, review,
> policy or business claim is invented. Reviews are deliberately empty until real clients write them.

## Hosting / live URL

| Environment | URL | What works |
| GitHub Pages (live) | https://zeeshanshaikh95.github.io/uv-clinics/ | Menu, filters, treatment pages, visit list, WhatsApp/Instagram booking |
| Local (`npm run dev`) | http://localhost:5173 | Everything, including `/admin` and analytics |

Pages is static, so it cannot run the Express API. The Pages build reads a committed snapshot of the
menu (`client/public/demo/catalogue.json`, enabled by `VITE_DEMO_CATALOGUE=true`) instead of showing
empty states. Regenerate it after editing the seed menu:

```shell
npm run demo:snapshot        # builds the snapshot from server/src/seed/catalogueData.ts
```

Consequences of the preview build: the admin panel has no API behind it, review/analytics writes are
skipped, and booking always goes to WhatsApp. To run it as a real site with a working admin, host the
API and set the `VITE_API_URL` repository variable plus `VITE_DEMO_CATALOGUE=false` — see
[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

Push to `main` and `.github/workflows/deploy-pages.yml` rebuilds and redeploys automatically.

## Tech stack

| Layer | Technology |
| Frontend | React 18 + Vite 6 + TypeScript, Tailwind CSS 3, React Router 6, react-helmet-async |
| Backend | Node + Express 4 + TypeScript, Zod validation |
| Database | MongoDB + Mongoose 8 (Atlas in production; bundled local mongod for dev) |
| Auth | JWT bearer tokens + bcrypt (12 rounds), protected `/api/admin/*` |
| Security | Helmet, CORS allow-list, rate limiting, Zod validation, secrets via env |
| Media | Multer uploads served from `/uploads` (swap in Cloudinary/S3 when the volume grows) |
| Hosting | Static SPA build + Node API + MongoDB Atlas |

## Structure

```
├── client/                  React SPA
│   ├── public/              the clinic's imagery, favicon, robots, sitemap
│   │   └── demo/            catalogue.json — the snapshot the Pages build serves
│   └── src/
│       ├── admin/           Protected admin panel (lazy-loaded bundle)
│       ├── api/             Typed API client + endpoint map + demo snapshot reader
│       ├── components/      HeroSlider (3D), ServiceCard, MiniCart, Wordmark, layout…
│       ├── context/         Visit list / Settings / Toast providers
│       ├── hooks/           useApi, usePageView
│       ├── lib/             WhatsApp builder, analytics, formatting, brand assets
│       └── pages/           Public pages
├── server/
│   └── src/
│       ├── config/          Env config + Mongo connection
│       ├── controllers/     Public + admin handlers
│       ├── middleware/      Auth, errors, rate limits, uploads
│       ├── models/          Mongoose schemas
│       ├── routes/          /api and /api/admin routers
│       ├── seed/            Bootstrap (admin + settings), starter menu, snapshot builder
│       ├── services/        Settings singleton
│       ├── utils/           asyncHandler, slugify
│       └── validation/      Zod schemas for every write
└── .env.example
```

## Quick start

Prerequisites: Node 20+.

```shell
npm install

# 1 — configure the API
cp .env.example server/.env        # then edit JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD

# 2 — local database (downloads a mongod binary on first run, persists in server/.data/mongo)
npm run dev:db

# 3 — in a second terminal: bootstrap admin + settings + starter menu
npm run seed

# 4 — run the API and the client
npm run dev
# Client: http://localhost:5173     API: http://localhost:4000/api/health
```

`npm run dev:all` runs the database, API and client together.

**Admin panel:** http://localhost:5173/admin — sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from
`server/.env`. A freshly bootstrapped account must choose a new password before the panel opens.

## Admin panel

* **Overview** — 7/30/90-day page views, treatment views, list adds, booking messages, top treatments,
  referrers, plus a warning when no WhatsApp number is configured.
* **Treatments** — full CRUD, multi-image upload/reorder, options (session count, body area, package)
  with per-option price and availability, most-booked / featured / new flags, archive & restore, SEO
  fields, display order.
* **Departments (categories)** — CRUD, reordering, live treatment counts. Deleting a department keeps
  its treatments.
* **Reviews** — add, edit, approve, hide, delete. Only approved reviews reach the site.
* **Gallery** — images for the homepage strip and gallery page, with captions and links.
* **Settings** — identity, WhatsApp number, **hero slider slides**, announcement bar, clinic story,
  booking message templates, pricing and cancellation copy.
* **Security** — forced first-login password change, 10 login attempts / 15 min, JWT re-validated
  against the database on every request, Zod validation on all writes.

## Booking behaviour

* Every booking button builds a `wa.me` link to **+91 88868 68929** (the number in her Instagram bio)
  with a pre-filled message listing the treatments, options, quantities and estimated total.
* If the number is ever cleared in Settings, buttons fall back to the clinic's Instagram DMs so the
  site is never a dead end.
* Prices are nullable end to end: blank means “Price on request”, never ₹0.

## Brand assets

* **Logo** — the clinic's mark rebuilt as vector in `client/src/components/Wordmark.tsx`: an
  interlocking U/V monogram inside a double gold ring, above **UV CLINICS** and the line *Where
  science meets style* — the same lockup painted on the clinic's feature wall. `favicon.svg` is drawn
  to match and `client/public/images/logo-avatar.jpg` is the square avatar.
* **Photography** — the eight images in `client/public/images/` are editorial placeholders in the
  clinic's ivory-and-champagne palette, generated for this build because Instagram does not serve its
  media to logged-out requests. Replace them with the clinic's own photographs (or upload through
  Admin → Treatments) before launch.
* **Palette** — porcelain paper (`#FBF8F2`), white raised cards, champagne foil (`#C6A15B`), deep plum
  ink (`#3A2A3F`) and a muted ultraviolet accent (`#6E5BA8`) borrowed from the clinic's name.
  Marcellus for display, Manrope for everything else.
* **Hero** — a photo slider inside a CSS 3D scene: an arch-framed portrait on its own plane, a rotating
  gold halo, an orbiting ring, a spinning U/V medallion, floating glass practice chips and glass orbs
  that all tilt with the pointer. Transform/opacity only, and the whole depth effect is disabled under
  `prefers-reduced-motion`.

## Scripts

| Command | Purpose |
| `npm run dev` | API + client together |
| `npm run dev:all` | Database + API + client in one terminal |
| `npm run dev:db` | Local dev MongoDB (persists in `server/.data/mongo`) |
| `npm run seed` | Bootstrap admin + settings, add the starter menu if empty |
| `npm run seed:reset` | Wipe catalogue records and re-create them |
| `npm run demo:snapshot` | Rebuild the static menu snapshot from the seed data |
| `npm run demo:catalogue` | Rebuild the snapshot from a running API instead |
| `npm run build` | Typecheck + build both workspaces |
| `npm run typecheck` | TypeScript project-wide |

## Environment variables

| Variable | Purpose |
| `PORT` | API port (4000) |
| `MONGODB_URI` | Mongo connection string |
| `JWT_SECRET` | Long random string for signing admin JWTs |
| `JWT_EXPIRES_IN` | Token lifetime (12h) |
| `CORS_ORIGINS` | Comma-separated allowed frontend origins |
| `PUBLIC_SITE_URL` / `PUBLIC_API_URL` | Canonical URLs |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | First admin account (seed only) |
| `UPLOAD_MAX_BYTES` / `UPLOAD_MAX_FILES` | Upload limits |

Client (optional): `VITE_API_URL`, `VITE_PUBLIC_SITE_URL`, `VITE_DEMO_CATALOGUE`.

## Roadmap to production

1. Replace the placeholder photography with the clinic's own images.
2. Confirm the current offer prices with the clinic before each campaign; they change often.
3. Add the full treatment menu, gallery and real client reviews in Admin.
4. Set `JWT_SECRET`, a strong admin password and `CORS_ORIGINS` on the host; deploy the SPA build and
   API, and point MongoDB at Atlas.
