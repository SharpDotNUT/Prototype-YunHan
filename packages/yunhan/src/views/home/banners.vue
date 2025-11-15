<script setup lang="ts">
import { mdiBullhorn, mdiRefresh } from '@mdi/js';
import { useHomeStore } from './home';
import SvgIcon from '@jamescoyle/vue-icon';
import { ref } from 'vue';
import { AllGames } from '@/data/games';

const store = useHomeStore();
store.fetchData();

const showAnnounce = ref(false);
</script>

<template>
  <div v-if="store.data" class="-home-banner flex">
    <main>
      <div id="control">
        <var-select
          style="flex-grow: 1"
          size="small"
          v-model="store.server"
          :placeholder="$t('global.data-source')">
          <var-option :label="$t('global.server.china')" value="china" />
          <var-option :label="$t('global.server.global')" value="global" />
        </var-select>
        <var-button round @click="showAnnounce = true">
          <svg-icon type="mdi" :path="mdiBullhorn" />
        </var-button>
        <var-button round @click="store.fetchData()">
          <svg-icon type="mdi" :path="mdiRefresh" />
        </var-button>
      </div>
      <var-select
        size="small"
        v-model="store.game"
        :placeholder="$t('sp-key.game')">
        <var-option
          v-for="(game, key) in AllGames"
          :label="$t('global.game.' + key)"
          :value="game" />
      </var-select>
      <var-swipe navigation style="aspect-ratio: 690 / 320" :autoplay="5000">
        <var-swipe-item v-for="banner in store.data.data.content.banners">
          <var-link target="_blank" :href="banner.image.link">
            <img :src="banner.image.url" style="width: 100%" />
          </var-link>
        </var-swipe-item>
      </var-swipe>
      <var-popup v-model:show="showAnnounce">
        <iframe
          id="browser"
          src="https://sdk.mihoyo.com/hk4e/announcement/index.html?auth_appid=announcement&authkey_ver=1&bundle_id=hk4e_cn&channel_id=1&game=hk4e&game_biz=hk4e_cn&lang={lang}&level=60&platform=pc&region=cn_gf01&sdk_presentation_style=fullscreen&sdk_screen_transparent=true&sign_type=2&uid=1#/" />
      </var-popup>
    </main>
    <div id="posts">
      <p v-for="post in store.data.data.content.posts">
        <var-link target="_blank" :href="post.link" type="primary">
          {{ post.title }}
        </var-link>
      </p>
    </div>
  </div>
</template>

<style lang="css" scoped>
@import url('./banners.css');
</style>
