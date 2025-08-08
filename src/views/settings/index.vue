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

const settings = ref(['general', 'rm']);
const tab = ref('general');
</script>

<template>
  <div class="__container_settings">
    <div id="bar" v-if="isMobile">
      <var-button round text @click="showMenu = !showMenu">
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
        <h2 v-if="!isMobile">{{ $t('setting.title') }}</h2>
        <router-link
          v-for="set in settings"
          v-ripple
          :to="set"
          :class="{
            active: $route.path === `/settings/${set}`
          }">
          {{ $t('setting.' + set) }}
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
