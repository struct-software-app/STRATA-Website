# Supabase SQL Setup Notes

## What these files are

- `migrations/001_contact_and_trial_tables.sql`: SQL migration creating the `contact_messages` and `trial_requests` tables with length constraints and insert-only Row Level Security (RLS) policies.

## How to apply

Run in **Supabase Dashboard > SQL Editor** only after reading the SQL file in full.

## Which features need them

- **Contact form** (`src/pages/ContactPage.tsx`) inserts inquiries into `public.contact_messages`.
- **Trial key form** (`src/pages/TrialPage.tsx`) stores generated evaluation keys and requester details in `public.trial_requests`.

## Environment variables

The frontend `.env` file must define:

- `VITE_SUPABASE_URL` — your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — your Supabase anon / publishable key
- `VITE_ENABLE_CLIENT_PURCHASE_FALLBACK` — keep `false` in production once the `purchase_app` RPC function is deployed and verified

## Pending security work

A full Row Level Security (RLS) review of the existing tables (`users`, `user_wallets`, `purchases`, `programs`, `bundles`, `categories`, `pricing_plans`, `pricing_matrix`, `faqs`, `hero_banners`, `website`, `store_branding`), as well as moving the welcome-token grant to a database trigger and auditing the `purchase_app` RPC function, is a separate, still-pending step.
