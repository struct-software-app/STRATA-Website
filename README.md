# STRATA ENG

Catalog website and Electron desktop wrapper for the **STRATA Suite** — standalone engineering calculation software across 7 civil and infrastructure disciplines (35 calculation engines built with React 18, TypeScript, Vite 6, Tailwind CSS 3.4, Supabase, and Electron 34).

## Requirements

- **Node.js 20+** (and npm)

## First-Time Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and set your Supabase credentials:
   - `VITE_SUPABASE_URL` — your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` — your Supabase anon / publishable key
   - `VITE_ENABLE_CLIENT_PURCHASE_FALLBACK` — keep `false` in production (only uses the server RPC `purchase_app`)
   - `VITE_ACADEMY_MOCK` — set to `true` in local development to preview STRATA Academy with mock videos when `academy_videos` is empty (`false` or ignored in production)

## Commands

| Script | Description |
| --- | --- |
| `npm run dev:web` | Start the Vite web development server on `http://localhost:5173`. |
| `npm run dev` | Start Vite and launch the Electron desktop window once ready. |
| `npm run build` | Typecheck (`tsc`) and build the web production bundle into `dist/`. |
| `npm run build:electron` | Compile `electron/` TypeScript sources into `dist-electron/`. |
| `npm run electron:preview` | Build web + Electron assets and preview the packaged desktop window locally. |
| `npm run build:app` | Build web + Electron bundles and package installers via `electron-builder` into `release/`. |
| `npm run check:css` | Verify generated CSS contains required utility classes and local font faces. |

## Folder Map

- `src/pages/` — Route views (`HomePage`, `AboutPage`, `CategoryPage`, `AppDetailPage`, `PricingPage`, `GetStartedPage`, `TrialPage`, `DownloadPage`, `ContactPage`, `TermsPage`, `PrivacyPage`, `NotFoundPage`).
- `src/components/` — Shared UI components (`Header`, `Footer`, `HeroSlider`, `CategoryCard`, `AppCard`, `AccountSettingsModal`, `ErrorBoundary`).
- `src/context/DataContext.tsx` — Global catalog, branding, authentication, token wallet, and purchase state synced with Supabase.
- `src/data/apps.ts` — Static baseline definitions for categories (7), tools (35), pricing plans, and FAQs.
- `src/lib/` — Client helpers (`supabaseClient.ts`, `accountBootstrap.ts`, `pricing.ts`, `searchApps.ts`, `url.ts`, `env.ts`).
- `electron/` — Desktop main process (`main.ts`) and hardened preload bridge (`preload.ts`).
- `supabase/` — single unified database schema (`SQL.sql`) and database notes (`README.md`) to review and apply in Supabase.

## SQL

All database SQL lives in [`supabase/SQL.sql`](supabase/SQL.sql) (see [`supabase/README.md`](supabase/README.md) for instructions, pending RLS notes, and permanent SQL rules). To apply updates, open **Supabase Dashboard > SQL Editor**, paste the entire `supabase/SQL.sql` file, and click **Run** (safe to re-run).
For STRATA Academy admin editing rules and field requirements, see [Academy videos: what Strata Control must edit](supabase/README.md#academy-videos-what-strata-control-must-edit) in `supabase/README.md`.

## How Data Works

The application renders immediately using the static baseline in `src/data/apps.ts` (7 categories, 35 tools, pricing plans, and FAQs) and merges live records from Supabase (`categories`, `programs`, `bundles`, `pricing_plans`, `pricing_matrix`, `faqs`, `hero_banners`, `website`, `store_branding`) inside `src/context/DataContext.tsx` once fetched. If a Supabase query fails or a table is empty, the static baseline remains available while logging a warning.

## Pending Items Before Production Launch

- **Supabase Row Level Security (RLS)**: Review and tighten RLS policies across `users`, `user_wallets`, `purchases`, `contact_messages`, and `trial_requests` before going live (apply `supabase/SQL.sql` in the Supabase SQL Editor).
- **Server-side wallet & purchases**: Move the welcome-token grant (`src/lib/accountBootstrap.ts`) and `purchase_app` RPC logic strictly server-side (Edge Functions / database triggers and RPC permissions) so balances and ledger writes cannot be tampered with from clients.
- **Installer download URLs**: Populate real release URLs and optional SHA-256 checksums for Windows, macOS, and Linux installers in Supabase (`website` table) so `DownloadPage.tsx` enables direct downloads.
- **Legal text**: Replace the placeholder copy in `src/pages/TermsPage.tsx` and `src/pages/PrivacyPage.tsx` with counsel-approved Terms of Service and Privacy Policy text.
- **Desktop & app icons**: Add `build/icon.ico` (Windows), `build/icon.icns` (macOS), and `build/icon.png` (512x512 Linux) for `electron-builder`, and ensure per-app icon assets are uploaded.
- **Translations for language switcher**: Provide real localization strings and i18n wiring before setting `ENABLE_LANGUAGE_SWITCHER = true` in `src/config.ts`.
