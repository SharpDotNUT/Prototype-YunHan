<script setup lang="ts">
import { mdiBullhorn } from '@mdi/js';
import { useHomeStore } from './home';
import SvgIcon from '@jamescoyle/vue-icon';
import { ref } from 'vue';

const store = useHomeStore();
store.fetchData();

const showAnnounce = ref(false);
</script>

<template>
  <div v-if="store.data" class="-home-banner flex">
    <div>
      <var-swipe navigation style="aspect-ratio: 690 / 320" :autoplay="5000">
        <var-swipe-item v-for="banner in store.data.data.content.banners">
          <var-link target="_blank" :href="banner.image.link">
            <img :src="banner.image.url" style="width: 100%" />
          </var-link>
        </var-swipe-item>
      </var-swipe>
      <br />
      <var-button round @click="showAnnounce = true">
        <svg-icon type="mdi" :path="mdiBullhorn" />
      </var-button>
      <var-popup v-model:show="showAnnounce">
        <iframe
          id="browser"
          src="https://sdk.mihoyo.com/hk4e/announcement/index.html?auth_appid=announcement&authkey_ver=1&bundle_id=hk4e_cn&channel_id=1&game=hk4e&game_biz=hk4e_cn&lang={lang}&level=60&platform=pc&region=cn_gf01&sdk_presentation_style=fullscreen&sdk_screen_transparent=true&sign_type=2&uid=1#/" />
      </var-popup>
    </div>
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
