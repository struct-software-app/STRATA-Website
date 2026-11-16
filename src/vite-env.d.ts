/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_ENABLE_CLIENT_PURCHASE_FALLBACK?: string;
  readonly VITE_ACADEMY_MOCK?: string;
  readonly VITE_TOOLBOX_MOCK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
