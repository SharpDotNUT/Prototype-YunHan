<script setup lang="ts">
import { computed } from 'vue';
import { formatTime, useMusicStore } from './store';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiPause, mdiPlay, mdiSkipNext, mdiSkipPrevious } from '@mdi/js';
import { ref } from 'vue';
import Main from './main.vue';
import { round } from 'lodash-es';

const isMobileWidth = computed(() => window.innerWidth <= 800);

const store = useMusicStore();
</script>

<template>
  <div class="container-mp">
    <Main id="main"></Main>
    <div id="bar">
      <img :src="store.getCover(store.current?.albumId, true)" />
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
