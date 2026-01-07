/// <reference types="vite/client" />

declare const GITHUB_RUNTIME_PERMANENT_NAME: string;
declare const BASE_KV_SERVICE_URL: string;

interface ImportMetaEnv {
  readonly VITE_PUBLIC_POSTHOG_KEY: string;
  readonly VITE_PUBLIC_POSTHOG_HOST: string;
  // other environment variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}