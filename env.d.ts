/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OAUTH_ID: string

}

interface ImportMeta {
  readonly env: ImportMetaEnv
}