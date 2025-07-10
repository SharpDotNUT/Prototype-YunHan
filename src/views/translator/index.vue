<script setup lang="ts">
import { ref, watch, computed, nextTick } from 'vue';
import SvgIcon from '@jamescoyle/vue-icon';
import D_FontData from '@/data/fonts/data.json';
import CAutoTextarea from './CAutoTextarea.vue';
import CKeyboardEditor from './CKeyboardEditor.vue';
import { useI18n } from 'vue-i18n';
const { locale } = useI18n();

import {
  mdiContentCopy,
  mdiKeyboard,
  mdiSwapHorizontal,
  mdiTranslate
} from '@mdi/js';
import { copyToClipboard } from '@/script/tools';

const showKeyboard = ref(false);
const text = ref(
  'How gently do the clouds and flowers sway, as dancing winds meander through the vales.'
);
const currentFont = ref(D_FontData[0].id);
const mode = ref(1);
const ref_textarea = ref(null);
const currentFontName = computed(() => {
  const font: any = D_FontData.find((x) => x.id === currentFont.value);
  return font.name[locale.value];
});
watch(mode, () => {
  showKeyboard.value = false;
  nextTick(() => {
    if (!ref_textarea.value) return;
    //@ts-ignore
    ref_textarea.value?.resizeTextarea();
  });
});
watch(showKeyboard, () => {
  nextTick(() => {
    if (!ref_textarea.value || showKeyboard.value) return;
    //@ts-ignore
    ref_textarea.value?.resizeTextarea();
  });
});

function openDeepLToTranslate(text: string) {
  const lang = {
    en: 'en-us',
    ja: 'ja',
    'zh-Hans': 'zh-hans'
  }[locale.value];
  window.open(
    `https://www.deepl.com/zh/translator#en/${lang}/${encodeURIComponent(text)}`
  );
}
</script>

<template>
  <div class="translator">
    <var-card>
      <p>
        导出功能重制中，目前不可使用。Export function is being reconstructed,
        currently not available.
        エクスポート機能は改修中のため、現在ご利用いただけません。
      </p>
      <div id="bar">
        <div id="title">
          <var-chip type="primary" block>
            {{ mode ? $t('global.lang.en') : currentFontName }}
          </var-chip>
          <var-button id="button" round @click="mode = 1 - mode">
            <svg-icon type="mdi" :path="mdiSwapHorizontal" />
          </var-button>
          <var-chip type="primary" block>
            {{ mode ? currentFontName : $t('global.lang.en') }}
          </var-chip>
        </div>
        <var-select style="width: 100%" v-model="currentFont">
          <var-option
            v-for="font in D_FontData as any[]"
            :key="font.id"
            :label="font.name[locale]"
            :value="font.id">
            <div style="display: flex; flex-direction: column; padding: 10px 0">
              <p :class="`font-${font.id}`">{{ font.id }}</p>
              <p>{{ font.name[locale] }}</p>
            </div>
          </var-option>
        </var-select>
      </div>
    </var-card>
    <template id="main">
      <var-card>
        <CAutoTextarea
          ref="ref_textarea"
          variant="standard"
          v-model="text"
          :style="{
            fontFamily: mode ? 'inherit' : currentFont
          }" />
        <template #extra id="actions">
          <var-space align="center">
            <span>{{ text.length }}&nbsp;</span>
            <var-button v-if="!mode" round @click="showKeyboard = true">
              <svg-icon type="mdi" :path="mdiKeyboard" />
            </var-button>
          </var-space>
        </template>
      </var-card>
      <var-card>
        <pre
          ref="el_result"
          :style="{
            fontFamily: !mode ? 'inherit' : currentFont
          }"
          >{{ text }}</pre
        >
        <template #extra id="actions">
          <var-space>
            <var-button v-if="!mode" round @click="openDeepLToTranslate(text)">
              <svg-icon type="mdi" :path="mdiTranslate" />
            </var-button>
            <var-button v-if="!mode" round @click="copyToClipboard(text)">
              <svg-icon type="mdi" :path="mdiContentCopy" />
            </var-button>
          </var-space>
        </template>
      </var-card>
    </template>
    <CKeyboardEditor
      v-model:show-keyboard="showKeyboard"
      v-model:text="text"
      :font="currentFont"></CKeyboardEditor>
  </div>
</template>

<style scoped>
@import url('@/data/fonts/fonts.css');
@import url('./index.css');

textarea,
pre {
  font-family: inherit;
  font-size: 1.5em;
  line-height: 1.5em;
}
</style>
