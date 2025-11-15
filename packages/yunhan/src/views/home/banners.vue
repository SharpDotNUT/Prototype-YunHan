<script setup lang="ts">
import { mdiBullhorn, mdiRefresh } from '@mdi/js';
import { useHomeStore } from './home';
import SvgIcon from '@jamescoyle/vue-icon';
import { ref } from 'vue';
import { AllGames } from '@/data/games';
import { Dialog } from '@varlet/ui';

const store = useHomeStore();
store.fetchData();

const showAnnounce = ref(false);

const TempTip = () => {
  Dialog({
    message:
      '目前只支持查看国服网页公告；' +
      'Only support Chinese Mainland Server Web Announcements；' +
      '中国本土サーバーのウェブ告知のみをサポートします；',
    onConfirm: () => {
      showAnnounce.value = true;
    }
  });
};
</script>

<template>
  <div class="-home-banner flex">
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
        <var-button round @click="TempTip">
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
      <var-loading :loading="store.loading">
        <var-swipe
          v-if="store.data"
          navigation
          style="aspect-ratio: 690 / 320"
          :autoplay="5000">
          <var-swipe-item v-for="banner in store.data.data.content.banners">
            <var-link target="_blank" :href="banner.image.link">
              <img :src="banner.image.url" style="width: 100%" />
            </var-link>
          </var-swipe-item>
        </var-swipe>
      </var-loading>
      <var-popup v-model:show="showAnnounce">
        <iframe id="browser" :src="store.AnnounceURL" />
      </var-popup>
    </main>
    <div id="posts">
      <var-loading :loading="store.loading">
        <p v-if="store.data" v-for="post in store.data.data.content.posts">
          <var-link target="_blank" :href="post.link" type="primary">
            {{ post.title }}
          </var-link>
        </p>
      </var-loading>
    </div>
  </div>
</template>

<style lang="css" scoped>
@import url('./banners.css');
</style>
