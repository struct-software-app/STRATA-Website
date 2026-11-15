-- STRATA ENG — Contact Messages & Trial Requests Migration
-- Review carefully before running in Supabase Dashboard > SQL Editor.

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) between 3 and 254),
  category text not null default 'general' check (char_length(category) <= 100),
  subject text not null default '' check (char_length(subject) <= 150),
  message text not null check (char_length(message) between 1 and 5000),
  user_id uuid null,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

create policy "Allow public insert into contact_messages"
  on public.contact_messages
  for insert
  to anon, authenticated
  with check (user_id is null or user_id = auth.uid());

-- Intentionally no SELECT / UPDATE / DELETE policies on contact_messages.
-- Only the project owner (via Supabase Dashboard / service role) can read submissions.

create table if not exists public.trial_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 1 and 100),
  email text not null check (char_length(email) between 3 and 254),
  company text not null default '' check (char_length(company) <= 150),
  discipline text not null default 'all' check (char_length(discipline) <= 100),
  license_key text not null check (char_length(license_key) between 10 and 64),
  user_id uuid null,
  created_at timestamptz not null default now()
);

alter table public.trial_requests enable row level security;

create policy "Allow public insert into trial_requests"
  on public.trial_requests
  for insert
  to anon, authenticated
  with check (user_id is null or user_id = auth.uid());

-- Intentionally no SELECT / UPDATE / DELETE policies on trial_requests.
-- Only the project owner (via Supabase Dashboard / service role) can read trial requests.

-- ============================================================================
-- PENDING REVIEW NOTES (do not uncomment until reviewed against existing schema)
-- ============================================================================
-- Ensure new rows in public.users get a safe default role from the database
-- rather than relying on the browser payload:
-- alter table public.users alter column role set default 'user';
--
-- Also review:
-- 1. Moving the 50-token welcome balance grant from client code
--    (src/lib/accountBootstrap.ts) into a SECURITY DEFINER database trigger.
-- 2. Auditing the purchase_app RPC function so all token deductions and
--    license inserts happen atomically server-side, then setting
--    VITE_ENABLE_CLIENT_PURCHASE_FALLBACK=false in production.
