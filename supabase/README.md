# Supabase SQL Setup Notes

## Single SQL File

- [`supabase/SQL.sql`](./SQL.sql): The **only** SQL file for **STRATA ENG** and the future **Strata Control** admin application. Contains all extensions, helper functions, tables (catalog, site content, users/commerce, inbound forms), indexes, triggers, pending RPC notes, RLS for `contact_messages` and `trial_requests`, and the update log.

## How to Run

1. Open **Supabase Dashboard > SQL Editor**.
2. Paste the **entire** contents of `supabase/SQL.sql` and click **Run**.
3. Every statement is idempotent (`create table if not exists`, `add column if not exists`, `create or replace function`, `drop trigger/policy if exists` before `create`), so it is safe to run again.

## What SECTION 99 : UPDATE LOG Is

`SECTION 99 : UPDATE LOG` at the bottom of `supabase/SQL.sql` tracks every schema edit (`ID | DATE | SUMMARY | SECTIONS TOUCHED | RUN IN SUPABASE`) so the owner always knows what changed and whether `supabase/SQL.sql` needs to be pasted into Supabase again.

## Pending Security Review

- **RLS review is still pending** on all pre-existing tables (`categories`, `programs`, `bundles`, `website`, `store_branding`, `hero_banners`, `pricing_plans`, `pricing_matrix`, `faqs`, `users`, `user_wallets`, `purchases`). Only `contact_messages`, `trial_requests`, `academy_videos`, `toolbox_categories`, and `toolbox_programs` currently have Row Level Security enabled (insert-only on inbound forms; public read of published rows on `academy_videos` and Toolbox tables). Do **not** enable RLS on other existing tables until the owner approves the RLS review.
- **RPC & welcome-token review is still pending**: `purchase_app` concurrency/price lookup (documented in `SECTION 09`) and moving the 50-token welcome balance grant from client code (`src/lib/accountBootstrap.ts`) into a `SECURITY DEFINER` database trigger. Keep `VITE_ENABLE_CLIENT_PURCHASE_FALLBACK=false` in production once `purchase_app` is verified.

## Academy videos: what Strata Control must edit

- **Table**: `public.academy_videos` (defined in `supabase/SQL.sql`).
- **Fields**: `title`, `description` (the bio), `video_url` (a YouTube link), `program_id` (pick from `programs`), `category_id` (auto-filled from the selected program, editable), `sort_order`, `is_published`.
- **Link validation & editor controls**: Strata Control must validate `video_url` with the exact same rules as `src/lib/youtube.ts` (supported `youtube.com`, `youtu.be`, and `youtube-nocookie.com` URL shapes and an 11-character ID matching `/^[A-Za-z0-9_-]{11}$/`), show a live preview of the video, and let the owner reorder (`sort_order`) and unpublish (`is_published`).
- **Website updates**: the website fetches published rows when loaded and shows any edit on the next page load.

## Toolbox: what Strata Control must edit

- **Tables & fields**:
  - `public.toolbox_categories`: `slug`, `name`, `description`, `logo_url`, `sort_order`, `is_published`.
  - `public.toolbox_programs`: `category_id`, `slug`, `name`, `short_description`, `full_description`, `logo_url`, `website_url`, `sort_order`, `is_published`.
- **Slugs**: lowercase-with-dashes (`^[a-z0-9]+(-[a-z0-9]+)*$`); globally unique on `toolbox_categories` and unique per `category_id` on `toolbox_programs`.
- **Logos, links & controls**: `logo_url` fields store image URLs; optional `website_url` must start with `http://` or `https://` when non-empty. Strata Control lets the owner add any number of categories and programs (no fixed limits), reorder them with `sort_order`, and publish/unpublish via `is_published`.
- **Website updates**: completely separate from engineering tools; changes appear on the next page load.

## Environment Variables (`.env`)

- `VITE_SUPABASE_URL` — your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — your Supabase anon / publishable key
- `VITE_ENABLE_CLIENT_PURCHASE_FALLBACK` — keep `false` in production

## Permanent SQL Rules

RULES FOR AI EDITORS OF THIS FILE
1. All SQL for this project lives ONLY in supabase/SQL.sql. Never create another .sql file. Never put SQL inside src/ or public/.
2. Edit the correct section in place. Never append loose snippets at the end of the file.
3. Everything must stay re-runnable: create table if not exists, add column if not exists, create or replace function, drop policy/trigger if exists before create.
4. Never write destructive statements (drop table, truncate, delete from, drop column, changing a column type) unless the owner explicitly asks for it in writing in the prompt.
5. camelCase identifiers are always double-quoted.
6. Do not enable Row Level Security or add policies on existing tables until the owner approves the RLS review.
7. Every change adds one line to SECTION 99 UPDATE LOG (next ID, date, summary, sections touched, RUN IN SUPABASE: YES/NO).
8. Every final report of every task that touches SQL ends with this block:
   SQL UPDATE REQUIRED: YES or NO
   Log entries: U-xxx, U-yyy
   Action for the owner: open Supabase Dashboard > SQL Editor, paste the whole supabase/SQL.sql, Run.
