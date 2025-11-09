<script setup lang="ts">
import { NavigationData } from '@/nav';
import ky from 'ky';
import { onMounted } from 'vue';
import { ref, watch } from 'vue';
import dayjs from 'dayjs';

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
watch(
  () => wallpaper.value,
  (val) => {
    if (!val) return;
    const date = dayjs().format('YYYYMMDD');
    console.log(date);
    if (date > val.end_date) {
      getBWMeta(true);
    }
  },
  {
    deep: true
  }
);
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
  getBWMeta();
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
          <router-link
            v-for="item in NavigationData.filter(
              (e) => !['index', 'home'].includes(e.name)
            )"
            :to="item.path">
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
          <p v-if="enableWallpaper && wallpaper">
            <var-link
              type="primary"
              :href="wallpaper.copyright_link"
              target="_blank">
              {{ wallpaper.copyright }}
            </var-link>
          </p>
        </var-card>
      </main>
    </div>
  </div>
</template>

<style lang="css" scoped>
@import url('./home.css');
</style>
