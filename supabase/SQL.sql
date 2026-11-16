-- ============================================================
-- SECTION 00 : HOW TO USE + RULES FOR AI EDITORS
-- ============================================================
-- STRATA ENG & STRATA CONTROL — Unified Supabase Database Schema
-- Project root path: supabase/SQL.sql (never place SQL inside src/ or public/).
--
-- HOW TO RUN IN SUPABASE:
--   1. Open Supabase Dashboard > SQL Editor.
--   2. Paste the ENTIRE contents of supabase/SQL.sql and click Run.
--   3. Every statement in this file is idempotent and safe to run again.
--
-- RULES FOR AI EDITORS OF THIS FILE
-- 1. All SQL for this project lives ONLY in supabase/SQL.sql. Never create
--    another .sql file. Never put SQL inside src/ or public/.
-- 2. Edit the correct section in place. Never append loose snippets at the
--    end of the file.
-- 3. Everything must stay re-runnable: create table if not exists, add column
--    if not exists, create or replace function, drop policy/trigger if exists
--    before create.
-- 4. Never write destructive statements (drop-table, trun-cate, delete-from,
--    drop-column, changing a column type) unless the owner explicitly asks
--    for it in writing in the prompt.
-- 5. camelCase identifiers are always double-quoted.
-- 6. Do not enable Row Level Security or add policies on existing tables
--    until the owner approves the RLS review.
-- 7. Every change adds one line to SECTION 99 UPDATE LOG (next ID, date,
--    summary, sections touched, RUN IN SUPABASE: YES/NO).
-- 8. Every final report of every task that touches SQL ends with this block:
--    SQL UPDATE REQUIRED: YES or NO
--    Log entries: U-xxx, U-yyy
--    Action for the owner: open Supabase Dashboard > SQL Editor, paste the
--    whole supabase/SQL.sql, Run.
--
-- TABLE OF CONTENTS
--   SECTION 00 : HOW TO USE + RULES FOR AI EDITORS
--   SECTION 01 : EXTENSIONS
--   SECTION 02 : HELPER FUNCTIONS
--   SECTION 03 : TABLES - CATALOG (categories, programs, bundles)
--   SECTION 04 : TABLES - SITE CONTENT (website, store_branding, hero_banners, pricing_plans, pricing_matrix, faqs, academy_videos)
--   SECTION 05 : TABLES - USERS AND COMMERCE (users, user_wallets, purchases)
--   SECTION 06 : TABLES - INBOUND FORMS (contact_messages, trial_requests)
--   SECTION 07 : INDEXES
--   SECTION 08 : TRIGGERS
--   SECTION 09 : RPC FUNCTIONS (PENDING OWNER REVIEW)
--   SECTION 10 : SEED DATA (PLACEHOLDER)
--   SECTION 11 : STORAGE BUCKETS (PLACEHOLDER)
--   SECTION 12 : ROW LEVEL SECURITY (contact_messages, trial_requests, academy_videos; PENDING OWNER REVIEW)
--   SECTION 99 : UPDATE LOG

-- ============================================================
-- SECTION 01 : EXTENSIONS
-- ============================================================
create extension if not exists pgcrypto; -- Provides gen_random_uuid() for UUID primary keys.

-- ============================================================
-- SECTION 02 : HELPER FUNCTIONS
-- ============================================================

-- Automatically sets NEW.updated_at = now() on row updates.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Used by policies in SECTION 12 once approved.
-- Returns true when the authenticated user's row in public.users has role = 'admin'.
-- Defined with language plpgsql so it compiles cleanly even on an empty database before SECTION 05 runs.
create or replace function public.is_admin()
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return exists (
    select 1
    from public.users
    where id = auth.uid()
      and role = 'admin'
  );
end;
$$;

-- ============================================================
-- SECTION 03 : TABLES - CATALOG
-- ============================================================

-- Engineering discipline categories (7 baseline categories merged over src/data/apps.ts).
-- Website reads all rows in src/context/DataContext.tsx to populate navigation, HomePage, and CategoryPage.
-- Strata Control creates, renames, describes, and uploads category icons here.
create table if not exists public.categories (
  id text primary key, -- Slug-like discipline identifier (e.g., structural, water-resources).
  name text not null default '', -- Display name of the engineering discipline.
  description text not null default '', -- Category overview shown on category and catalog pages.
  icon text not null default '', -- Remote asset URL or storage path for the discipline icon.
  created_at timestamptz not null default now(), -- Row creation timestamp.
  updated_at timestamptz not null default now() -- Last update timestamp maintained by trigger.
);
alter table public.categories add column if not exists name text not null default ''; -- Display name of the discipline.
alter table public.categories add column if not exists description text not null default ''; -- Discipline summary text.
alter table public.categories add column if not exists icon text not null default ''; -- Remote URL/path for category icon.
alter table public.categories add column if not exists created_at timestamptz not null default now(); -- Row creation timestamp.
alter table public.categories add column if not exists updated_at timestamptz not null default now(); -- Last update timestamp.

-- Individual standalone calculation engines across civil disciplines.
-- Website reads all rows in src/context/DataContext.tsx and renders them on HomePage, CategoryPage, and AppDetailPage.
-- Strata Control manages engine metadata, token pricing, release URLs, features, standards, and specs here.
create table if not exists public.programs (
  id text primary key, -- Tool identifier / slug (e.g., con-01, str-01).
  slug text, -- Optional explicit URL slug checked alongside id in DataContext.tsx.
  name text not null default '', -- Product display title.
  description text not null default '', -- Full engineering tool description.
  price numeric not null default 0, -- Perpetual license price denominated in platform tokens.
  version text not null default '1.0.0', -- Published application version string.
  logo text not null default '', -- Remote URL/path for square application logo.
  banner text not null default '', -- Remote URL/path for wide detail banner image.
  "categoryId" text not null default '', -- Parent category id linking into public.categories.id.
  "trailerUrl" text not null default '', -- Video URL for tool walkthrough/demo.
  "trailerThumbnail" text not null default '', -- Poster image URL for demo video.
  "downloadUrl" text not null default '', -- Direct executable/installer URL for licensed desktop download.
  rating numeric not null default 5, -- Catalog display rating (default 5).
  screenshots jsonb not null default '[]'::jsonb, -- Array of screenshot image URLs.
  features jsonb not null default '[]'::jsonb, -- Array of feature highlight strings.
  standards jsonb not null default '[]'::jsonb, -- Array of engineering code/standard strings (ACI, AISC, Eurocode, etc.).
  "techSpecs" jsonb not null default '{}'::jsonb, -- Key/value or structured technical specification object.
  created_at timestamptz not null default now(), -- Row creation timestamp.
  updated_at timestamptz not null default now() -- Last update timestamp maintained by trigger.
);
alter table public.programs add column if not exists slug text; -- Optional explicit slug mapped in DataContext.tsx.
alter table public.programs add column if not exists name text not null default ''; -- Product display title.
alter table public.programs add column if not exists description text not null default ''; -- Product description copy.
alter table public.programs add column if not exists price numeric not null default 0; -- Token price for single license.
alter table public.programs add column if not exists version text not null default '1.0.0'; -- Current release version.
alter table public.programs add column if not exists logo text not null default ''; -- Square icon asset URL/path.
alter table public.programs add column if not exists banner text not null default ''; -- Wide banner image URL/path.
alter table public.programs add column if not exists "categoryId" text not null default ''; -- Foreign discipline key ("categoryId").
alter table public.programs add column if not exists "trailerUrl" text not null default ''; -- Walkthrough video URL ("trailerUrl").
alter table public.programs add column if not exists "trailerThumbnail" text not null default ''; -- Video thumbnail URL ("trailerThumbnail").
alter table public.programs add column if not exists "downloadUrl" text not null default ''; -- Licensed download URL ("downloadUrl").
alter table public.programs add column if not exists rating numeric not null default 5; -- Numeric display rating.
alter table public.programs add column if not exists screenshots jsonb not null default '[]'::jsonb; -- JSON array of screenshot URLs.
alter table public.programs add column if not exists features jsonb not null default '[]'::jsonb; -- JSON array of feature strings.
alter table public.programs add column if not exists standards jsonb not null default '[]'::jsonb; -- JSON array of engineering standards.
alter table public.programs add column if not exists "techSpecs" jsonb not null default '{}'::jsonb; -- JSON object of technical specs ("techSpecs").
alter table public.programs add column if not exists created_at timestamptz not null default now(); -- Row creation timestamp.
alter table public.programs add column if not exists updated_at timestamptz not null default now(); -- Last update timestamp.

-- Discipline software bundles grouping multiple programs at a bundled token price.
-- Website reads all rows in src/context/DataContext.tsx for CategoryPage, PricingPage, purchase ownership checks, and purchase modal history.
-- Strata Control configures bundle membership ("programIds"), pricing, and artwork here.
create table if not exists public.bundles (
  id text primary key, -- Unique bundle identifier.
  "categoryId" text not null default '', -- Associated discipline id ("categoryId").
  name text not null default '', -- Bundle display name.
  price numeric not null default 0, -- Bundle token price.
  banner text not null default '', -- Bundle wide banner URL/path.
  logo text not null default '', -- Bundle square logo URL/path.
  "programIds" jsonb not null default '[]'::jsonb, -- JSON array of included program IDs ("programIds").
  description text not null default '', -- Bundle marketing summary.
  created_at timestamptz not null default now(), -- Row creation timestamp.
  updated_at timestamptz not null default now() -- Last update timestamp maintained by trigger.
);
alter table public.bundles add column if not exists "categoryId" text not null default ''; -- Associated category id ("categoryId").
alter table public.bundles add column if not exists name text not null default ''; -- Bundle title.
alter table public.bundles add column if not exists price numeric not null default 0; -- Bundle token price.
alter table public.bundles add column if not exists banner text not null default ''; -- Bundle wide banner URL/path.
alter table public.bundles add column if not exists logo text not null default ''; -- Bundle square logo URL/path.
alter table public.bundles add column if not exists "programIds" jsonb not null default '[]'::jsonb; -- JSON array of program ids ("programIds").
alter table public.bundles add column if not exists description text not null default ''; -- Bundle description.
alter table public.bundles add column if not exists created_at timestamptz not null default now(); -- Row creation timestamp.
alter table public.bundles add column if not exists updated_at timestamptz not null default now(); -- Last update timestamp.

-- ============================================================
-- SECTION 04 : TABLES - SITE CONTENT
-- ============================================================

-- Global singleton site metadata, About/Mission copy, company contact details, and desktop installer URLs.
-- Website reads row id = 1 in src/context/DataContext.tsx (powers Footer, AboutPage, ContactPage, DownloadPage, TrialPage).
-- Strata Control edits row id = 1 to publish new desktop installers, contact info, and copy without redeploying the web app.
create table if not exists public.website (
  id integer primary key default 1, -- Singleton configuration row id (website queries eq('id', 1)).
  version text not null default '2.4.0-PRO', -- Published suite build tag displayed in Footer and DownloadPage.
  build_shell text not null default 'Electron x64', -- Desktop wrapper runtime label in Footer.
  engines text not null default '35 Verified', -- Engines count summary badge in Footer.
  license text not null default 'Commercial ASD/LRFD', -- License classification string in Footer.
  description text not null default '', -- Footer suite overview paragraph.
  about_title text not null default '', -- Hero heading on AboutPage.
  about_description text not null default '', -- Hero subtitle on AboutPage.
  mission_title text not null default '', -- Core mission section heading on AboutPage.
  mission_subtitle text not null default '', -- Core mission subheading on AboutPage.
  mission_box_title text not null default '', -- Principle callout title on AboutPage.
  mission_box_text text not null default '', -- Principle callout body on AboutPage.
  about_p1 text not null default '', -- Narrative paragraph 1 on AboutPage.
  about_p2 text not null default '', -- Narrative paragraph 2 on AboutPage.
  about_p3 text not null default '', -- Narrative paragraph 3 on AboutPage.
  stats_calculation_engines_label text not null default '', -- KPI 1 label override on AboutPage.
  stats_calculation_engines_sub text not null default '', -- KPI 1 sublabel override on AboutPage.
  stats_civil_disciplines_label text not null default '', -- KPI 2 label override on AboutPage.
  stats_civil_disciplines_sub text not null default '', -- KPI 2 sublabel override on AboutPage.
  stats_solver_latency_label text not null default '', -- KPI 3 label override on AboutPage.
  stats_solver_latency_value text not null default '', -- KPI 3 metric value override on AboutPage.
  stats_solver_latency_sub text not null default '', -- KPI 3 sublabel override on AboutPage.
  stats_cloud_dependency_label text not null default '', -- KPI 4 label override on AboutPage.
  stats_cloud_dependency_value text not null default '', -- KPI 4 metric value override on AboutPage.
  stats_cloud_dependency_sub text not null default '', -- KPI 4 sublabel override on AboutPage.
  support_email text not null default '', -- Technical support email rendered on ContactPage and error fallbacks.
  licensing_email text not null default '', -- Licensing inquiries email rendered on ContactPage.
  support_phone text not null default '', -- Support phone number rendered on ContactPage.
  company_legal_name text not null default '', -- Legal entity name rendered on ContactPage.
  office_address_line1 text not null default '', -- Office street address line 1 on ContactPage.
  office_address_line2 text not null default '', -- Office city/postal address line 2 on ContactPage.
  default_trial_key_template text not null default '', -- Optional default template hint stored for trial key formatting.
  copyright_text text not null default '', -- Footer copyright notice text.
  footer_tagline text not null default '', -- Footer right-hand motto text.
  download_win_filename text not null default '', -- Windows installer file name on DownloadPage.
  download_win_url text not null default '', -- Direct Windows installer URL on DownloadPage.
  download_win_size text not null default '', -- Human-readable Windows installer size label.
  download_win_sha256 text not null default '', -- Optional Windows installer SHA-256 checksum.
  download_mac_filename text not null default '', -- macOS installer file name on DownloadPage.
  download_mac_url text not null default '', -- Direct macOS installer URL on DownloadPage.
  download_mac_size text not null default '', -- Human-readable macOS installer size label.
  download_mac_sha256 text not null default '', -- Optional macOS installer SHA-256 checksum.
  download_linux_filename text not null default '', -- Linux AppImage/package file name on DownloadPage.
  download_linux_url text not null default '', -- Direct Linux installer URL on DownloadPage.
  download_linux_size text not null default '', -- Human-readable Linux installer size label.
  download_linux_sha256 text not null default '', -- Optional Linux installer SHA-256 checksum.
  created_at timestamptz not null default now(), -- Row creation timestamp.
  updated_at timestamptz not null default now() -- Last update timestamp maintained by trigger.
);
alter table public.website add column if not exists version text not null default '2.4.0-PRO'; -- Suite release version label.
alter table public.website add column if not exists build_shell text not null default 'Electron x64'; -- Runtime shell label.
alter table public.website add column if not exists engines text not null default '35 Verified'; -- Engines count badge text.
alter table public.website add column if not exists license text not null default 'Commercial ASD/LRFD'; -- License label text.
alter table public.website add column if not exists description text not null default ''; -- Footer description copy.
alter table public.website add column if not exists about_title text not null default ''; -- About page heading.
alter table public.website add column if not exists about_description text not null default ''; -- About page subtitle.
alter table public.website add column if not exists mission_title text not null default ''; -- Mission section title.
alter table public.website add column if not exists mission_subtitle text not null default ''; -- Mission section subtitle.
alter table public.website add column if not exists mission_box_title text not null default ''; -- Mission highlight box title.
alter table public.website add column if not exists mission_box_text text not null default ''; -- Mission highlight box copy.
alter table public.website add column if not exists about_p1 text not null default ''; -- About narrative paragraph 1.
alter table public.website add column if not exists about_p2 text not null default ''; -- About narrative paragraph 2.
alter table public.website add column if not exists about_p3 text not null default ''; -- About narrative paragraph 3.
alter table public.website add column if not exists stats_calculation_engines_label text not null default ''; -- Stats tile 1 label.
alter table public.website add column if not exists stats_calculation_engines_sub text not null default ''; -- Stats tile 1 subtext.
alter table public.website add column if not exists stats_civil_disciplines_label text not null default ''; -- Stats tile 2 label.
alter table public.website add column if not exists stats_civil_disciplines_sub text not null default ''; -- Stats tile 2 subtext.
alter table public.website add column if not exists stats_solver_latency_label text not null default ''; -- Stats tile 3 label.
alter table public.website add column if not exists stats_solver_latency_value text not null default ''; -- Stats tile 3 value.
alter table public.website add column if not exists stats_solver_latency_sub text not null default ''; -- Stats tile 3 subtext.
alter table public.website add column if not exists stats_cloud_dependency_label text not null default ''; -- Stats tile 4 label.
alter table public.website add column if not exists stats_cloud_dependency_value text not null default ''; -- Stats tile 4 value.
alter table public.website add column if not exists stats_cloud_dependency_sub text not null default ''; -- Stats tile 4 subtext.
alter table public.website add column if not exists support_email text not null default ''; -- Technical support email.
alter table public.website add column if not exists licensing_email text not null default ''; -- Licensing contact email.
alter table public.website add column if not exists support_phone text not null default ''; -- Support telephone string.
alter table public.website add column if not exists company_legal_name text not null default ''; -- Company legal name.
alter table public.website add column if not exists office_address_line1 text not null default ''; -- Office address line 1.
alter table public.website add column if not exists office_address_line2 text not null default ''; -- Office address line 2.
alter table public.website add column if not exists default_trial_key_template text not null default ''; -- Optional trial key template setting.
alter table public.website add column if not exists copyright_text text not null default ''; -- Footer copyright text.
alter table public.website add column if not exists footer_tagline text not null default ''; -- Footer tagline copy.
alter table public.website add column if not exists download_win_filename text not null default ''; -- Windows installer filename.
alter table public.website add column if not exists download_win_url text not null default ''; -- Windows installer download URL.
alter table public.website add column if not exists download_win_size text not null default ''; -- Windows installer display size.
alter table public.website add column if not exists download_win_sha256 text not null default ''; -- Windows installer SHA-256 hash.
alter table public.website add column if not exists download_mac_filename text not null default ''; -- macOS installer filename.
alter table public.website add column if not exists download_mac_url text not null default ''; -- macOS installer download URL.
alter table public.website add column if not exists download_mac_size text not null default ''; -- macOS installer display size.
alter table public.website add column if not exists download_mac_sha256 text not null default ''; -- macOS installer SHA-256 hash.
alter table public.website add column if not exists download_linux_filename text not null default ''; -- Linux installer filename.
alter table public.website add column if not exists download_linux_url text not null default ''; -- Linux installer download URL.
alter table public.website add column if not exists download_linux_size text not null default ''; -- Linux installer display size.
alter table public.website add column if not exists download_linux_sha256 text not null default ''; -- Linux installer SHA-256 hash.
alter table public.website add column if not exists created_at timestamptz not null default now(); -- Row creation timestamp.
alter table public.website add column if not exists updated_at timestamptz not null default now(); -- Last update timestamp.

-- Key/value table of remote branding logo and banner asset URLs.
-- Expected keys read in src/context/DataContext.tsx: storeIcon, storeNameLogo, loginBanner, storeHeroBanner, loginIcon, loginNameLogo, storeLoadingPage.
-- Strata Control updates brand icons, wordmarks, and banners here.
create table if not exists public.store_branding (
  key text primary key, -- Branding asset key name (e.g., storeIcon, storeNameLogo).
  value text not null default '', -- Remote image URL or storage asset path.
  created_at timestamptz not null default now(), -- Row creation timestamp.
  updated_at timestamptz not null default now() -- Last update timestamp maintained by trigger.
);
alter table public.store_branding add column if not exists value text not null default ''; -- Asset URL or path for key.
alter table public.store_branding add column if not exists created_at timestamptz not null default now(); -- Row creation timestamp.
alter table public.store_branding add column if not exists updated_at timestamptz not null default now(); -- Last update timestamp.

-- Homepage hero carousel slides ordered by sort_order.
-- Website reads ordered rows in src/context/DataContext.tsx for HeroSlider.tsx.
-- Strata Control adds, edits, reorders, and removes promotional hero slides here.
create table if not exists public.hero_banners (
  id text primary key, -- Unique slide identifier.
  title text not null default '', -- Slide headline text.
  paragraph text not null default '', -- Optional slide supporting copy.
  image_url text not null default '', -- Slide background/hero image URL or path.
  cta_text text not null default '', -- Optional call-to-action button label.
  cta_link text not null default '', -- Optional call-to-action route or URL.
  sort_order integer not null default 0, -- Ascending slide order on HomePage.
  created_at timestamptz not null default now(), -- Row creation timestamp.
  updated_at timestamptz not null default now() -- Last update timestamp maintained by trigger.
);
alter table public.hero_banners add column if not exists title text not null default ''; -- Slide headline text.
alter table public.hero_banners add column if not exists paragraph text not null default ''; -- Supporting slide copy.
alter table public.hero_banners add column if not exists image_url text not null default ''; -- Hero visual asset URL/path.
alter table public.hero_banners add column if not exists cta_text text not null default ''; -- Call-to-action button label.
alter table public.hero_banners add column if not exists cta_link text not null default ''; -- Call-to-action destination path/URL.
alter table public.hero_banners add column if not exists sort_order integer not null default 0; -- Display order index.
alter table public.hero_banners add column if not exists created_at timestamptz not null default now(); -- Row creation timestamp.
alter table public.hero_banners add column if not exists updated_at timestamptz not null default now(); -- Last update timestamp.

-- Subscription/license plan cards displayed on PricingPage.
-- Website reads ordered rows in src/context/DataContext.tsx and merges over static PRICING_PLANS.
-- Strata Control manages plan prices, badges, included bullet lists, and ordering here.
create table if not exists public.pricing_plans (
  id text primary key, -- Plan identifier.
  name text not null default '', -- Display title of the plan.
  slug text not null default '', -- Plan slug used for matrix column lookup and routing.
  price numeric not null default 0, -- Monthly token or base price.
  "annualPrice" numeric, -- Optional discounted annual price ("annualPrice").
  period text not null default 'per month', -- Billing period unit label.
  description text not null default '', -- Plan summary copy.
  features jsonb not null default '[]'::jsonb, -- JSON array of feature bullet strings.
  "ctaText" text not null default 'Get Started', -- Primary CTA label ("ctaText").
  popular boolean not null default false, -- Highlights the plan as popular when true.
  highlight boolean not null default false, -- Visual card emphasis flag.
  badge text not null default '', -- Optional short badge text.
  sort_order integer not null default 0, -- Ascending display order on PricingPage.
  created_at timestamptz not null default now(), -- Row creation timestamp.
  updated_at timestamptz not null default now() -- Last update timestamp maintained by trigger.
);
alter table public.pricing_plans add column if not exists name text not null default ''; -- Plan display name.
alter table public.pricing_plans add column if not exists slug text not null default ''; -- Plan lookup slug.
alter table public.pricing_plans add column if not exists price numeric not null default 0; -- Base monthly price.
alter table public.pricing_plans add column if not exists "annualPrice" numeric; -- Optional annual price ("annualPrice").
alter table public.pricing_plans add column if not exists period text not null default 'per month'; -- Billing cadence label.
alter table public.pricing_plans add column if not exists description text not null default ''; -- Plan summary copy.
alter table public.pricing_plans add column if not exists features jsonb not null default '[]'::jsonb; -- JSON array of feature bullets.
alter table public.pricing_plans add column if not exists "ctaText" text not null default 'Get Started'; -- CTA button text ("ctaText").
alter table public.pricing_plans add column if not exists popular boolean not null default false; -- Popular badge toggle.
alter table public.pricing_plans add column if not exists highlight boolean not null default false; -- Highlight border/card toggle.
alter table public.pricing_plans add column if not exists badge text not null default ''; -- Optional promotional badge label.
alter table public.pricing_plans add column if not exists sort_order integer not null default 0; -- Ascending sort order.
alter table public.pricing_plans add column if not exists created_at timestamptz not null default now(); -- Row creation timestamp.
alter table public.pricing_plans add column if not exists updated_at timestamptz not null default now(); -- Last update timestamp.

-- Feature comparison rows rendered in the PricingPage matrix table.
-- Website reads ordered rows in src/context/DataContext.tsx (falls back to built-in 11 rows if empty).
-- Strata Control maintains feature row labels and per-tier values (single, bundle, full, or flexible values map) here.
create table if not exists public.pricing_matrix (
  id text primary key, -- Comparison row identifier.
  feature text not null default '', -- Capability row label shown in the comparison table.
  single text not null default '', -- Single-tool tier text or 'true'/'false'.
  bundle text not null default '', -- Discipline bundle tier text or 'true'/'false'.
  "full" text not null default '', -- Full-suite tier text or 'true'/'false' (quoted: full is a SQL keyword).
  "values" jsonb not null default '{}'::jsonb, -- Optional plan-slug map of string/boolean values.
  sort_order integer not null default 0, -- Ascending row order in PricingPage comparison table.
  created_at timestamptz not null default now(), -- Row creation timestamp.
  updated_at timestamptz not null default now() -- Last update timestamp maintained by trigger.
);
alter table public.pricing_matrix add column if not exists feature text not null default ''; -- Row feature description.
alter table public.pricing_matrix add column if not exists single text not null default ''; -- Single plan cell value.
alter table public.pricing_matrix add column if not exists bundle text not null default ''; -- Bundle plan cell value.
alter table public.pricing_matrix add column if not exists "full" text not null default ''; -- Full suite plan cell value.
alter table public.pricing_matrix add column if not exists "values" jsonb not null default '{}'::jsonb; -- Dynamic plan-keyed values map.
alter table public.pricing_matrix add column if not exists sort_order integer not null default 0; -- Ascending sort order.
alter table public.pricing_matrix add column if not exists created_at timestamptz not null default now(); -- Row creation timestamp.
alter table public.pricing_matrix add column if not exists updated_at timestamptz not null default now(); -- Last update timestamp.

-- Frequently asked questions shown on PricingPage (and HomePage FAQ block if enabled).
-- Website reads ordered rows in src/context/DataContext.tsx.
-- Strata Control adds, edits, and reorders FAQ Q&A entries here.
create table if not exists public.faqs (
  id text primary key, -- Unique FAQ identifier.
  question text not null default '', -- FAQ question text.
  answer text not null default '', -- FAQ answer text.
  sort_order integer not null default 0, -- Ascending display order.
  created_at timestamptz not null default now(), -- Row creation timestamp.
  updated_at timestamptz not null default now() -- Last update timestamp maintained by trigger.
);
alter table public.faqs add column if not exists question text not null default ''; -- FAQ prompt/question.
alter table public.faqs add column if not exists answer text not null default ''; -- FAQ answer copy.
alter table public.faqs add column if not exists sort_order integer not null default 0; -- Ascending sort order.
alter table public.faqs add column if not exists created_at timestamptz not null default now(); -- Row creation timestamp.
alter table public.faqs add column if not exists updated_at timestamptz not null default now(); -- Last update timestamp.

-- STRATA Academy tutorial video entries embedded directly inside the site without sending users away.
-- Website reads published rows in src/context/DataContext.tsx ordered by sort_order asc, created_at desc.
-- Strata Control manages tutorial titles, bios, source video links, program/category tags, ordering, and publish status.
create table if not exists public.academy_videos (
  id uuid primary key default gen_random_uuid(), -- Unique tutorial video identifier.
  title text not null check (char_length(title) between 1 and 200), -- Video display title (1..200 chars).
  description text not null default '' check (char_length(description) <= 5000), -- Video bio / description (max 5000 chars).
  video_url text not null check (video_url ~* '^https?://([a-z0-9-]+\.)?(youtube\.com|youtu\.be|youtube-nocookie\.com)/'), -- Video source link parsed by src/lib/youtube.ts.
  program_id text null, -- Optional program id matching public.programs.id.
  category_id text null, -- Optional category id matching public.categories.id (may be empty when program_id is set).
  sort_order integer not null default 0, -- Ascending display order in Academy listings.
  is_published boolean not null default true, -- Publication toggle; website only selects rows where is_published = true.
  created_at timestamptz not null default now(), -- Row creation timestamp.
  updated_at timestamptz not null default now() -- Last update timestamp maintained by trigger.
);
alter table public.academy_videos add column if not exists title text not null default ''; -- Video display title.
alter table public.academy_videos add column if not exists description text not null default ''; -- Video bio / description.
alter table public.academy_videos add column if not exists video_url text not null default ''; -- Video source URL.
alter table public.academy_videos add column if not exists program_id text null; -- Optional linked public.programs.id.
alter table public.academy_videos add column if not exists category_id text null; -- Optional linked public.categories.id.
alter table public.academy_videos add column if not exists sort_order integer not null default 0; -- Ascending sort order.
alter table public.academy_videos add column if not exists is_published boolean not null default true; -- Published visibility flag.
alter table public.academy_videos add column if not exists created_at timestamptz not null default now(); -- Row creation timestamp.
alter table public.academy_videos add column if not exists updated_at timestamptz not null default now(); -- Last update timestamp.

-- Sample row (commented out):
-- insert into public.academy_videos (title, description, video_url, program_id, category_id, sort_order, is_published)
-- values ('Footing Bearing & Punching Shear Walkthrough', 'Step-by-step calculation workflow for ACI 318 isolated footings.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'str-01', 'structural', 1, true);

-- ============================================================
-- SECTION 05 : TABLES - USERS AND COMMERCE
-- ============================================================

-- Registered user profiles synced 1:1 with Supabase auth.users.
-- Website reads/upserts/updates own profile in src/context/DataContext.tsx and src/lib/accountBootstrap.ts.
-- Strata Control inspects user accounts, roles, and customer profile records here.
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade, -- Matches auth.users.id.
  username text not null default '', -- Public/display handle shown with @ in account UI.
  "firstName" text not null default '', -- User given name ("firstName").
  "secondName" text not null default '', -- User family name ("secondName").
  email text not null default '', -- Contact/login email copied from auth user.
  birthdate text, -- Optional ISO date string (YYYY-MM-DD) or null.
  avatar text not null default '', -- Direct profile avatar URL/path.
  character jsonb, -- Optional avatar/character payload resolved by src/lib/profile.ts.
  role text not null default 'user', -- Account role ('user' or 'admin'; checked by public.is_admin()).
  created_at timestamptz not null default now(), -- Profile creation timestamp.
  updated_at timestamptz not null default now() -- Last profile update timestamp maintained by trigger.
);
alter table public.users add column if not exists username text not null default ''; -- Handle displayed in account menus.
alter table public.users add column if not exists "firstName" text not null default ''; -- Given name ("firstName").
alter table public.users add column if not exists "secondName" text not null default ''; -- Surname ("secondName").
alter table public.users add column if not exists email text not null default ''; -- Account email address.
alter table public.users add column if not exists birthdate text; -- Optional birthdate string.
alter table public.users add column if not exists avatar text not null default ''; -- Avatar image URL/path.
alter table public.users add column if not exists character jsonb; -- Optional structured character avatar data.
alter table public.users add column if not exists role text not null default 'user'; -- Role column checked by public.is_admin().
alter table public.users add column if not exists created_at timestamptz not null default now(); -- Row creation timestamp.
alter table public.users add column if not exists updated_at timestamptz not null default now(); -- Last update timestamp.

-- Non-negative engineering token balance per user.
-- Website reads tokens in src/context/DataContext.tsx (and dev-fallback bootstrap/deduction when enabled).
-- Strata Control credits, audits, or adjusts user token wallets here.
create table if not exists public.user_wallets (
  user_id uuid primary key references auth.users(id) on delete cascade, -- Owner user uuid (1:1 with auth.users).
  tokens numeric not null default 0 check (tokens >= 0), -- Current spendable token balance (non-negative).
  created_at timestamptz not null default now(), -- Wallet creation timestamp.
  updated_at timestamptz not null default now() -- Last balance modification timestamp maintained by trigger.
);
alter table public.user_wallets add column if not exists tokens numeric not null default 0; -- Available token balance.
alter table public.user_wallets add column if not exists created_at timestamptz not null default now(); -- Row creation timestamp.
alter table public.user_wallets add column if not exists updated_at timestamptz not null default now(); -- Last update timestamp.

-- Completed license purchase ledger for single tools and discipline bundles.
-- Website reads user purchases ordered by purchased_at desc in src/context/DataContext.tsx (renders in AccountSettingsModal).
-- Strata Control audits user license ownership and transaction history here.
create table if not exists public.purchases (
  id bigint generated by default as identity primary key, -- Sequential purchase record id.
  user_id uuid not null references auth.users(id) on delete cascade, -- Buyer auth user id.
  program_id text, -- Purchased program id (null when purchasing a bundle).
  bundle_id text, -- Purchased bundle id (null when purchasing a single program).
  tokens_paid numeric not null default 0, -- Token amount debited at purchase time.
  purchased_at timestamptz not null default now() -- Timestamp when license was granted.
);
alter table public.purchases add column if not exists user_id uuid; -- Buyer user id.
alter table public.purchases add column if not exists program_id text; -- Optional single program id.
alter table public.purchases add column if not exists bundle_id text; -- Optional discipline bundle id.
alter table public.purchases add column if not exists tokens_paid numeric not null default 0; -- Tokens paid for the license.
alter table public.purchases add column if not exists purchased_at timestamptz not null default now(); -- Purchase timestamp.

-- ============================================================
-- SECTION 06 : TABLES - INBOUND FORMS
-- ============================================================

-- Public/authenticated contact inquiries submitted from ContactPage.
-- Website inserts rows directly from src/pages/ContactPage.tsx (no public SELECT/UPDATE/DELETE).
-- Strata Control reads and triages customer support messages via service role or admin policy (once approved).
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(), -- Unique inquiry id.
  name text not null check (char_length(name) between 1 and 100), -- Sender full name (1..100 chars).
  email text not null check (char_length(email) between 3 and 254), -- Sender email address (3..254 chars).
  category text not null default 'general' check (char_length(category) <= 100), -- Inquiry category slug/label.
  subject text not null default '' check (char_length(subject) <= 150), -- Optional subject line (max 150 chars).
  message text not null check (char_length(message) between 1 and 5000), -- Inquiry body (1..5000 chars).
  user_id uuid null, -- Authenticated sender auth.uid() when signed in, otherwise null.
  created_at timestamptz not null default now() -- Submission timestamp.
);
alter table public.contact_messages add column if not exists name text not null default ''; -- Sender name.
alter table public.contact_messages add column if not exists email text not null default ''; -- Sender email.
alter table public.contact_messages add column if not exists category text not null default 'general'; -- Inquiry category.
alter table public.contact_messages add column if not exists subject text not null default ''; -- Subject line.
alter table public.contact_messages add column if not exists message text not null default ''; -- Inquiry text body.
alter table public.contact_messages add column if not exists user_id uuid null; -- Optional linked auth user id.
alter table public.contact_messages add column if not exists created_at timestamptz not null default now(); -- Submission timestamp.

-- Evaluation trial license key requests submitted from TrialPage.
-- Website generates a client key and inserts rows in src/pages/TrialPage.tsx (no public SELECT/UPDATE/DELETE).
-- Strata Control inspects issued evaluation trial keys and requester organizations.
create table if not exists public.trial_requests (
  id uuid primary key default gen_random_uuid(), -- Unique trial request id.
  full_name text not null check (char_length(full_name) between 1 and 100), -- Requester full name (1..100 chars).
  email text not null check (char_length(email) between 3 and 254), -- Work/requester email (3..254 chars).
  company text not null default '' check (char_length(company) <= 150), -- Optional company or organization name.
  discipline text not null default 'all' check (char_length(discipline) <= 100), -- Requested discipline slug or 'all'.
  license_key text not null check (char_length(license_key) between 10 and 64), -- Generated trial key (10..64 chars).
  user_id uuid null, -- Authenticated requester auth.uid() when signed in, otherwise null.
  created_at timestamptz not null default now() -- Submission timestamp.
);
alter table public.trial_requests add column if not exists full_name text not null default ''; -- Requester full name.
alter table public.trial_requests add column if not exists email text not null default ''; -- Requester email.
alter table public.trial_requests add column if not exists company text not null default ''; -- Company name.
alter table public.trial_requests add column if not exists discipline text not null default 'all'; -- Target engineering discipline.
alter table public.trial_requests add column if not exists license_key text not null default ''; -- Generated evaluation key.
alter table public.trial_requests add column if not exists user_id uuid null; -- Optional linked auth user id.
alter table public.trial_requests add column if not exists created_at timestamptz not null default now(); -- Submission timestamp.

-- ============================================================
-- SECTION 07 : INDEXES
-- ============================================================
create index if not exists idx_programs_category_id on public.programs ("categoryId"); -- Fast category filtering on CategoryPage.
create index if not exists idx_bundles_category_id on public.bundles ("categoryId"); -- Fast discipline bundle lookup.
create index if not exists idx_hero_banners_sort_order on public.hero_banners (sort_order); -- Ordered HomePage hero carousel fetch.
create index if not exists idx_pricing_plans_sort_order on public.pricing_plans (sort_order); -- Ordered PricingPage plans fetch.
create index if not exists idx_pricing_matrix_sort_order on public.pricing_matrix (sort_order); -- Ordered PricingPage matrix fetch.
create index if not exists idx_faqs_sort_order on public.faqs (sort_order); -- Ordered FAQ fetch.
create index if not exists idx_purchases_user_date on public.purchases (user_id, purchased_at desc); -- Fast user purchase history fetch.
create index if not exists idx_contact_messages_created_at on public.contact_messages (created_at desc); -- Admin inbox chronological sorting.
create index if not exists idx_trial_requests_created_at on public.trial_requests (created_at desc); -- Admin trial log chronological sorting.
create index if not exists idx_academy_videos_published_sort on public.academy_videos (is_published, sort_order); -- Fast published Academy video ordering.
create index if not exists idx_academy_videos_program_id on public.academy_videos (program_id); -- Fast per-program Academy video filtering.
create index if not exists idx_academy_videos_category_id on public.academy_videos (category_id); -- Fast per-category Academy video filtering.

-- ============================================================
-- SECTION 08 : TRIGGERS
-- ============================================================
drop trigger if exists trg_categories_updated_at on public.categories;
create trigger trg_categories_updated_at before update on public.categories for each row execute function public.set_updated_at();

drop trigger if exists trg_programs_updated_at on public.programs;
create trigger trg_programs_updated_at before update on public.programs for each row execute function public.set_updated_at();

drop trigger if exists trg_bundles_updated_at on public.bundles;
create trigger trg_bundles_updated_at before update on public.bundles for each row execute function public.set_updated_at();

drop trigger if exists trg_website_updated_at on public.website;
create trigger trg_website_updated_at before update on public.website for each row execute function public.set_updated_at();

drop trigger if exists trg_store_branding_updated_at on public.store_branding;
create trigger trg_store_branding_updated_at before update on public.store_branding for each row execute function public.set_updated_at();

drop trigger if exists trg_hero_banners_updated_at on public.hero_banners;
create trigger trg_hero_banners_updated_at before update on public.hero_banners for each row execute function public.set_updated_at();

drop trigger if exists trg_pricing_plans_updated_at on public.pricing_plans;
create trigger trg_pricing_plans_updated_at before update on public.pricing_plans for each row execute function public.set_updated_at();

drop trigger if exists trg_pricing_matrix_updated_at on public.pricing_matrix;
create trigger trg_pricing_matrix_updated_at before update on public.pricing_matrix for each row execute function public.set_updated_at();

drop trigger if exists trg_faqs_updated_at on public.faqs;
create trigger trg_faqs_updated_at before update on public.faqs for each row execute function public.set_updated_at();

drop trigger if exists trg_users_updated_at on public.users;
create trigger trg_users_updated_at before update on public.users for each row execute function public.set_updated_at();

drop trigger if exists trg_user_wallets_updated_at on public.user_wallets;
create trigger trg_user_wallets_updated_at before update on public.user_wallets for each row execute function public.set_updated_at();

drop trigger if exists trg_academy_videos_updated_at on public.academy_videos;
create trigger trg_academy_videos_updated_at before update on public.academy_videos for each row execute function public.set_updated_at();

-- ============================================================
-- SECTION 09 : RPC FUNCTIONS
-- ============================================================
-- PENDING OWNER REVIEW
-- DO NOT define purchase_app here until the owner reviews wallet debit/credit
-- concurrency and server-side welcome-token trigger rules.
--
-- Exact RPC call made by the website (src/context/DataContext.tsx lines 702-713):
--   const { error } = await supabase.rpc('purchase_app', {
--     p_program_id: programId || null,
--     p_bundle_id: bundleId || null,
--   });
--
-- Parameters expected by the website:
--   p_program_id text  (nullable; set when buying an individual program)
--   p_bundle_id  text  (nullable; set when buying a discipline bundle)
--   Buyer identity: resolved server-side via auth.uid() (must require authenticated user).
--
-- Expected result / error handling in src/context/DataContext.tsx:
--   - Success: no PostgREST error (`error` is null); DataContext does not inspect data
--     fields directly and immediately calls `await refreshUserData()` to reload
--     `user_wallets` and `purchases`.
--   - Error messages explicitly handled by DataContext.tsx:
--       * message containing 'insufficient' or 'Insufficient'
--           -> mapped to "Insufficient tokens in your wallet. Please top up."
--       * message containing 'Already owned'
--           -> mapped to "You already own this license."
--   - Any server-side implementation MUST lock the wallet row (`for update`), verify
--     non-duplicate ownership, look up the price authoritatively from `programs` or
--     `bundles`, deduct tokens atomically, and insert into `purchases`.

-- ============================================================
-- SECTION 10 : SEED DATA
-- ============================================================
-- Optional seed of categories and programs from src/data/apps.ts - not generated yet.

-- ============================================================
-- SECTION 11 : STORAGE BUCKETS
-- ============================================================
-- Optional Supabase Storage bucket setup and public/signed read policies for
-- program icons, banners, user avatars, and desktop installers - not generated yet.

-- ============================================================
-- SECTION 12 : ROW LEVEL SECURITY
-- ============================================================
-- PENDING OWNER REVIEW.
-- Do NOT enable RLS on any other table in this file until the owner approves
-- the RLS review: enabling RLS on a table without policies blocks the website
-- from reading it.

alter table public.contact_messages enable row level security;

drop policy if exists "Allow public insert into contact_messages" on public.contact_messages;
create policy "Allow public insert into contact_messages"
  on public.contact_messages
  for insert
  to anon, authenticated
  with check (user_id is null or user_id = auth.uid());

-- Intentionally no SELECT / UPDATE / DELETE policies on contact_messages.
-- Only the project owner (via Supabase Dashboard / service role, or future is_admin() policy) can read submissions.

alter table public.trial_requests enable row level security;

drop policy if exists "Allow public insert into trial_requests" on public.trial_requests;
create policy "Allow public insert into trial_requests"
  on public.trial_requests
  for insert
  to anon, authenticated
  with check (user_id is null or user_id = auth.uid());

-- Intentionally no SELECT / UPDATE / DELETE policies on trial_requests.
-- Only the project owner (via Supabase Dashboard / service role, or future is_admin() policy) can read trial requests.

alter table public.academy_videos enable row level security;

drop policy if exists "academy_videos public read" on public.academy_videos;
create policy "academy_videos public read"
  on public.academy_videos
  for select
  to anon, authenticated
  using (is_published = true);

-- PENDING: Strata Control write policies (use public.is_admin()) after the RLS review

-- PENDING REVIEW NOTES (do not uncomment until reviewed against existing schema):
-- Ensure new rows in public.users get a safe default role from the database
-- rather than relying on the browser payload:
-- alter table public.users alter column role set default 'user';
--
-- Also review:
-- 1. Moving the 50-token welcome balance grant from client code
--    (src/lib/accountBootstrap.ts) into a SECURITY DEFINER database trigger.
-- 2. Auditing the purchase_app RPC function in SECTION 09 and setting
--    VITE_ENABLE_CLIENT_PURCHASE_FALLBACK=false in production.

-- ============================================================
-- SECTION 99 : UPDATE LOG
-- ============================================================
-- ID    | DATE       | SUMMARY                                                        | SECTIONS TOUCHED | RUN IN SUPABASE
-- ------+------------+----------------------------------------------------------------+------------------+----------------
-- U-001 | 2026-11-15 | Initial organized file; contact_messages and trial_requests    | 00-12, 99        | YES
-- U-002 | 2026-11-16 | Add academy_videos table, indexes, trigger, and public read RLS | 00, 04, 07, 08, 12, 99 | YES
