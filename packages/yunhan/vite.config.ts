import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
// import { VitePWA } from 'vite-plugin-pwa';
import { createExtraFilesPlugin } from './vite-plugin';
import ViteYaml from '@modyfi/vite-plugin-yaml';

import PackageJSON from './package.json';

const MetaFile = {
  path: '/meta.json',
  content: JSON.stringify({
    version: PackageJSON.version,
    buildTime: new Date().getTime()
  })
};

let commit: any | undefined = undefined;
try {
  const res = await fetch(
    'https://api.github.com/repos/Sharpdotnut/Prototype-YunHan/commits'
  );
  const json: any = await res.json();
  commit = json[0];
} catch (e) {
  console.log(e);
}

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    createExtraFilesPlugin([MetaFile]),
    ViteYaml()
    // VitePWA({
    //   registerType: 'prompt',
    //   devOptions: {
    //     enabled: false
    //   },
    //   manifest: {
    //     name: 'Prototype - YunHan 云翰',
    //     short_name: '云翰·YunHan',
    //     id: 'com.sharpdotnut.yunhan',
    //     background_color: '#000000',
    //     theme_color: '#d1bdff',
    //     icons: [
    //       {
    //         src: '/img/UI_ChapterIcon_Yunjin.png',
    //         sizes: '256x256',
    //         type: 'image/png'
    //       }
    //     ]
    //   }
    // })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0',
    port: 52200
  },
  build: {
    outDir: './dist'
  },
  define: {
    __BUILD_TIME: new Date().getTime(),
    __BUILD_CLIENT: process.env?.CF_PAGES == '1' ? '"Cloudflare"' : '"Unknown"',
    __LAST_COMMIT: commit
  },
  optimizeDeps: {
    include: ['@varlet/ui']
  }
});
