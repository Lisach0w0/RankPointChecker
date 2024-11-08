/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly FIREBASE_API_KEY: string
    readonly FIREBASE_AUTH_DOMAIN: string
    readonly FIREBASE_PROJECT_ID: string
    readonly FIREBASE_STORAGE_BUCKET: string
    readonly FIREBASE_MESSAGING_ID: string
    readonly FIREBASE_APP_ID: string
    readonly FIREBASE_MEASUREMENT_ID: string
    // その他の環境変数...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }