<script setup lang="ts">
import { NavigationData } from '@/nav';
import ky from 'ky';
import { onMounted } from 'vue';
import { ref, watch } from 'vue';
import dayjs from 'dayjs';
import { mdiCog, mdiGithub, mdiInformation, mdiUpdate } from '@mdi/js';
import meta from '@/meta';
import SvgIcon from '@jamescoyle/vue-icon';
import Banners from './banners.vue';

interface Wallpaper {
  start_date: string;
  end_date: string;
  url: string;
  copyright: string;
  copyright_link: string;
}
function openGithub() {
  window.open(`https://github.com/${meta.repo}`, '_blank');
}

const GenshinBG =
  'https://yunhan-data.sharpdotnut.com/Static/Genshin-UI/UI_Download_Bg.png';
const wallpaper = ref<Wallpaper>();
const enableWallpaper = ref<boolean>(false);
enableWallpaper.value = localStorage.getItem('enableWallpaper') === 'true';
watch(enableWallpaper, (val) => {
  localStorage.setItem('enableWallpaper', val.toString());
});
const getBWMeta = (force: boolean = false) => {
  if (localStorage.getItem('BW') && !force) {
    const data = localStorage.getItem('BW');
    if (data) {
      wallpaper.value = JSON.parse(data);
      return;
    }
  }
  ky.get('https://bing.biturl.top/').then(async (wal) => {
    wallpaper.value = await wal.json();
    localStorage.setItem('BW', JSON.stringify(wallpaper.value));
  });
};
onMounted(() => {
  getBWMeta(true);
});
</script>

<template>
  <div class="home-container">
    <img
      id="bg"
      :src="enableWallpaper && wallpaper ? wallpaper?.url : GenshinBG" />
    <div id="content">
      <main>
        <var-card>
          <h1>{{ $t('home.title') }}</h1>
          <br />
          <div class="flex" style="gap: 10px">
            <img
              height="72"
              src="https://yunhan-data.sharpdotnut.com/Static/Genshin-UI/EmotionIcon/UI_EmotionIcon181.png" />
            <p
              v-html="$t('home.welcome', [$t('global.username.traveler')])"></p>
          </div>
        </var-card>
        <var-card>
          <Banners />
        </var-card>
        <div id="extra">
          <var-card ripple class="card" @click="openGithub">
            <a class="app-name">
              <SvgIcon class="icon" type="mdi" :path="mdiGithub" />
              <span>{{ $t('global.github-os-repo') }}</span>
            </a>
          </var-card>
          <var-card ripple class="app var-button">
            <RouterLink class="app-name" to="/settings">
              <SvgIcon class="icon" type="mdi" :path="mdiCog" />
              <span>{{ $t('setting.title') }}</span>
            </RouterLink>
          </var-card>
          <var-card ripple class="app var-button">
            <RouterLink class="app-name" to="/settings/about">
              <SvgIcon class="icon" type="mdi" :path="mdiInformation" />
              <span>{{ $t('global.about') }}</span>
            </RouterLink>
          </var-card>
          <var-card ripple class="app var-button">
            <RouterLink class="app-name" to="/settings/update-log">
              <SvgIcon class="icon" type="mdi" :path="mdiUpdate" />
              <span>{{ $t('setting.update-log') }}</span>
            </RouterLink>
          </var-card>
        </div>
        <var-card>
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
            ">
            <p>{{ $t('home.enable-bw') }}</p>
            <var-switch v-model="enableWallpaper" />
          </div>
          <p v-if="enableWallpaper && wallpaper">
            <var-link
              type="primary"
              :href="wallpaper.copyright_link"
              target="_blank"
              style="text-wrap: wrap">
              {{ wallpaper.copyright }}
            </var-link>
          </p>
        </var-card>
      </main>
    </div>
  </div>
</template>

<style lang="css" scoped>
@import url('./index.css');
</style>
