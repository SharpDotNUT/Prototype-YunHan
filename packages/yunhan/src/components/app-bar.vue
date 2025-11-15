<script setup lang="ts">
import { ref } from 'vue';
import { useMainStore } from '@/stores/main';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiMenu, mdiTranslate } from '@mdi/js';
import { setGameFont, status } from '@/locales/i18n';
import D_GameFontData from 'hoyo-glyphs-with-meta/data';

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
            <div style="text-align: right; padding: 10px">
              <var-cell
                v-for="lang in status.translated"
                :lang="lang.lang"
                border
                @click="
                  setGameFont();
                  $i18n.locale = lang.lang;
                "
                style="font-family: var(--d-font-family)">
                {{ lang.name }}
              </var-cell>
              <var-divider />
              <var-select
                variant="outlined"
                size="small"
                style="width: 200px"
                value="none"
                :placeholder="$t('setting.language.game-font')"
                v-model="mainStore.gameFont">
                <var-option :label="$t('global.action.close')" :value="false">
                  <p style="width: 100%; text-align: end">
                    {{ $t('global.action.close') }}
                  </p>
                </var-option>
                <var-option
                  v-for="lang in D_GameFontData"
                  lang="en"
                  border
                  :value="lang.id"
                  :label="lang.name.en">
                  <div style="width: 100%; text-align: end">
                    <span :style="{ fontFamily: lang.id }">
                      {{ lang.name.en }}
                    </span>
                    <br />
                    <span style="font-family: Noto Sans">
                      ({{ lang.name.en }})
                    </span>
                  </div>
                </var-option>
              </var-select>
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
