<script setup lang="ts">
import { ref } from 'vue';
import { useMainStore } from '@/stores/main';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiMenu, mdiTranslate } from '@mdi/js';
import RouterJump from '@/components/router-jump.vue';
import { status } from '@/locales/i18n';

const mainStore = useMainStore();
const ui_showMenu = ref(false);

const emits = defineEmits(['changeIsFullWidth']);
</script>

<template>
  <div style="height: var(--app-bar-height)">
    <var-app-bar>
      <img :src="mainStore.logoURL" style="height: 36px; margin-right: 10px" />
      <span>{{ mainStore.title }}</span>
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
        <var-button round text @click="ui_showMenu = true">
          <svg-icon type="mdi" :path="mdiMenu"></svg-icon>
        </var-button>
        <RouterJump ref="menu" v-model="ui_showMenu" />
      </template>
      <template #left></template>
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
