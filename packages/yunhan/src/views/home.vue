<script setup lang="ts">
import { NavigationData } from '@/nav';
import ky from 'ky';
import { ref, watch } from 'vue';

interface Wallpaper {
  start_date: string;
  end_date: string;
  url: string;
  copyright: string;
  copyright_link: string;
}

const GenshinBG =
  'https://yunhan-data.sharpdotnut.com/Static/Genshin-UI/UI_Download_Bg.png';
const wallpaper = ref<Wallpaper>();
const enableWallpaper = ref<boolean>(false);
enableWallpaper.value = localStorage.getItem('enableWallpaper') === 'true';
watch(enableWallpaper, (val) => {
  localStorage.setItem('enableWallpaper', val.toString());
});
ky.get('https://bing.biturl.top/').then(async (wal) => {
  wallpaper.value = await wal.json();
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
        <nav>
          <router-link v-for="item in NavigationData" :to="item.path">
            <var-card class="card" ripple>
              <h3>{{ $t(item.name + '.title') }}</h3>
              <p>
                {{ $t(item.name + '.description') }}
                <br />
                <var-chip v-if="item.beta" size="small" type="warning">
                  Beta
                </var-chip>
              </p>
            </var-card>
          </router-link>
        </nav>
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
        </var-card>
      </main>
    </div>
  </div>
</template>

<style lang="css" scoped>
@import url('./home.css');
</style>
