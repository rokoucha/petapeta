// Vite
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly CLIENT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// GAPI
declare namespace gapi {
  namespace client {
    function load(urlOrObject: string | object): Promise<void>
  }
}
