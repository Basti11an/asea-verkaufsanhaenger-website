/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_EMAILJS_SERVICE_ID?: string;
  readonly VITE_EMAILJS_PUBLIC_KEY?: string;
  readonly VITE_EMAILJS_INTERNAL_TEMPLATE_ID?: string;
  readonly VITE_EMAILJS_CUSTOMER_TEMPLATE_ID?: string;
  readonly VITE_EMAILJS_INTERNAL_RECIPIENT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
