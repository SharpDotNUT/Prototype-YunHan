import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

let commit: any | undefined = undefined
try {
  const res = await fetch(
    'https://api.github.com/repos/Sharpdotnut/prototype/commits'
  )
  const json: any = await res.json()
  commit = json[0]
} catch (e) {
  console.log(e)
}

export default defineConfig({
  mode: 'development',
  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({
      registerType: 'prompt',
      devOptions: {
        enabled: false
      },
      manifest: {
        name: 'Prototype',
        short_name: 'Prototype',
        id: 'sharpdotnut-prototype',
        background_color: '#000000',
        theme_color: '#d1bdff',
        icons: [
          {
            src: '/img/UI_ChapterIcon_Yunjin.png',
            sizes: '256x256',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0'
  },
  build: {
    outDir: './dist'
  },
  define: {
    __BUILD_TIME: new Date().getTime(),
    __LAST_COMMIT: commit
  },
  optimizeDeps: {
    include: ['@varlet/ui']
  }
})
