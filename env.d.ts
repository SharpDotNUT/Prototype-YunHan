/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />
declare module 'vue-virtual-scroller'
declare module '@jamescoyle/vue-icon'
declare const __BUILD_TIME: string
declare const __LAST_COMMIT:
  | {
      sha: string
      comments_url: string
      commit: {
        message: string
        author: {
          name: string
          email: string
          date: string
        }
      }
    }
  | undefined
