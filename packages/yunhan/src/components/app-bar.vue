<script setup lang="ts">
import { ref } from 'vue';
import { useMainStore } from '@/stores/main';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiMenu, mdiTranslate } from '@mdi/js';
import { status } from '@/locales/i18n';

const mainStore = useMainStore();

const emits = defineEmits(['openBar']);
</script>

<template>
  <div style="height: var(--app-bar-height)">
    <var-app-bar>
      <img :src="mainStore.logoURL" style="height: 36px; margin-right: 10px" />
      <span>{{ mainStore.title }}</span>
      <template #left v-if="mainStore.windowSize.width < 800">
        <var-button round text @click="$emit('openBar')">
          <svg-icon type="mdi" :path="mdiMenu"></svg-icon>
        </var-button>
        <span>&nbsp;|&nbsp;</span>
      </template>
      <template #right>
        <var-menu placement="bottom-end">
          <var-button round text>
            <svg-icon type="mdi" :path="mdiTranslate"></svg-icon>
          </var-button>
          <template #menu>
            <div style="text-align: right">
              <var-cell
                v-for="lang in status.translated"
                :lang="lang.lang"
                border
                @click="$i18n.locale = lang.lang">
                {{ lang.name }}
              </var-cell>
            </div>
          </template>
        </var-menu>
      </template>
    </var-app-bar>
  </div>
</template>

<style>
#menu {
  width: min(70vw, 600px);
  padding: 10vh 20px;
  top: var(--app-bar-height);
}
</style>
