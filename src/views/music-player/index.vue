<script setup lang="ts">
import { computed } from 'vue';
import { formatTime, useMusicStore } from './store';
import SvgIcon from '@jamescoyle/vue-icon';
import {
  mdiPause,
  mdiPlay,
  mdiSkipNext,
  mdiSkipPrevious,
  mdiText
} from '@mdi/js';
import Main from './main.vue';
import Lyric from './lyric.vue';
import { ref } from 'vue';

const isMobileWidth = computed(() => window.innerWidth <= 800);
const store = useMusicStore();

const ui_showLyric = ref(false);
</script>

<template>
  <div class="container-mp">
    <Main v-if="!ui_showLyric" id="main" />
    <Lyric v-if="ui_showLyric" id="main" />
    <div id="bar">
      <img
        :src="store.getCover(store.current?.albumId, true)"
        @click="ui_showLyric = !ui_showLyric" />
      <div id="controller">
        <div id="controls">
          <p style="flex-grow: 1">
            <span id="title">
              {{ store.current?.name }}
            </span>
            <br />
            <span id="lyric-container">
              <Transition name="lyric">
                <span
                  :key="store.lyric?.[store.currentLyricIndex]?.lyric"
                  class="lyric">
                  {{ store.lyric?.[store.currentLyricIndex]?.lyric }}
                </span>
              </Transition>
              <br />
            </span>
          </p>
          <div id="actions">
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
            <var-button round @click="ui_showLyric = !ui_showLyric">
              <SvgIcon type="mdi" :path="mdiText" />
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
