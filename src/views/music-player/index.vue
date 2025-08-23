<script setup lang="ts">
import { computed } from 'vue';
import { useMusicStore } from './store';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiPause, mdiPlay, mdiSkipNext, mdiSkipPrevious } from '@mdi/js';
import { ref } from 'vue';
import Main from './main.vue';

const isMobileWidth = computed(() => window.innerWidth <= 800);

const store = useMusicStore();
</script>

<template>
  <div class="container-mp">
    <Main id="main"></Main>
    <div id="controller">
      <div id="controls">
        <var-button>
          <SvgIcon type="mdi" :path="mdiSkipPrevious" />
        </var-button>
        <var-button size="large" @click="store.pause = !store.pause">
          <SvgIcon v-if="store.pause" type="mdi" :path="mdiPlay" />
          <SvgIcon v-else type="mdi" :path="mdiPause" />
        </var-button>
        <var-button>
          <SvgIcon type="mdi" :path="mdiSkipNext" />
        </var-button>
      </div>
      <div id="progress">
        <var-slider
          v-model="store.progress.current"
          :max="store.progress.duration"
          @change="store.setProgress($event as number)" />
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
@import url('./index.css');
</style>
