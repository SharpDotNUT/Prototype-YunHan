<script setup lang="ts">
import { formatTime, useMusicStore } from './store';
import SvgIcon from '@jamescoyle/vue-icon';
import {
  mdiMagnify,
  mdiPause,
  mdiPlay,
  mdiShare,
  mdiSkipNext,
  mdiSkipPrevious,
  mdiText
} from '@mdi/js';
import Main from './main.vue';
import Lyric from './lyric.vue';
import Search from './search.vue';
import { ref } from 'vue';
import { copyToClipboard } from '@/script/tools';
import { useMainStore } from '@/stores/main';
import { computed } from 'vue';

const mainStore = useMainStore();
const store = useMusicStore();

const isMobile = computed(() => mainStore.windowSize.width <= 600);

const ui_showLyric = ref(false);
const ui_showSearch = ref(false);

const share = () => {
  copyToClipboard(window.location.href);
};
</script>

<template>
  <div class="container-mp">
    <Main v-if="!ui_showLyric" id="main" />
    <Lyric v-if="ui_showLyric" id="main" />
    <Search v-model="ui_showSearch" style="z-index: 20" />
    <div id="bar" style="z-index: 0">
      <img
        v-if="!isMobile"
        :src="store.getCover(store.current?.albumId, true)"
        @click="ui_showLyric = !ui_showLyric" />
      <div id="controller">
        <div id="controls">
          <div id="info">
            <p id="title">
              {{ store.current?.name }}
            </p>
            <p id="lyric-container">
              <Transition name="lyric">
                <p
                  :key="store.lyric?.[store.currentLyricIndex]?.lyric"
                  class="lyric">
                  {{ store.lyric?.[store.currentLyricIndex]?.lyric }}
                </p>
              </Transition>
              <br />
            </p>
          </div>
          <div id="actions" style="z-index: 10">
            <var-button round @click="ui_showLyric = !ui_showLyric">
              <SvgIcon type="mdi" :path="mdiText" />
            </var-button>
            <var-button round @click="ui_showSearch = !ui_showSearch">
              <SvgIcon type="mdi" :path="mdiMagnify" />
            </var-button>
            <var-button round @click="share">
              <SvgIcon type="mdi" :path="mdiShare" />
            </var-button>
            <var-button round v-if="false">
              <SvgIcon type="mdi" :path="mdiSkipPrevious" />
            </var-button>
            <var-button round size="large" @click="store.pause = !store.pause">
              <SvgIcon
                v-if="store.pause"
                type="mdi"
                :path="mdiPlay"
                size="32" />
              <SvgIcon v-else type="mdi" :path="mdiPause" size="32" />
            </var-button>
            <var-button round v-if="false">
              <SvgIcon type="mdi" :path="mdiSkipNext" />
            </var-button>
          </div>
        </div>
        <div id="progress">
          <span>{{ formatTime(store.progress.current) }}</span>
          <var-slider
            style="flex: 1"
            v-model="store.progress.current"
            :max="store.progress.duration"
            @change="store.setProgress($event as number)" />
          <span>{{ formatTime(store.progress.duration) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
@import url('./index.css');
</style>
