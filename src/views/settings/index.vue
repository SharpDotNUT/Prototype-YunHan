<script setup lang="ts">
import { useMainStore } from '@/stores/main';
import { computed, ref } from 'vue';
import { RouterView, RouterLink } from 'vue-router';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiMenu } from '@mdi/js';

const mainStore = useMainStore();
const showMenu = ref(true);

const isMobile = computed(() => {
  return mainStore.windowSize.width <= 600;
});
</script>

<template>
  <div class="__container_settings">
    <div id="bar">
      <var-button round text v-if="isMobile" @click="showMenu = !showMenu">
        <svg-icon type="mdi" :path="mdiMenu" />
      </var-button>
      <h2>{{ $t('setting.title') }}</h2>
    </div>
    <div id="content">
      <div
        id="tabs"
        :style="{
          position: isMobile ? 'absolute' : 'static',
          transform:
            isMobile && !showMenu ? 'translateX(-100%)' : 'translateX(0)'
        }">
        <router-link v-ripple to="general">
          {{ $t('setting.general') }}
        </router-link>
        <router-link v-ripple to="rm">
          {{ $t('setting.rm') }}
        </router-link>
      </div>
      <div id="view">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('./index.css');
</style>
