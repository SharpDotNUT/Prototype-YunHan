<script setup lang="ts">
import {
  LanguageTextMapDefault,
  SupportedLanguages,
  type T_SupportedLanguage
} from '@/locales/i18n';
import { saveFile } from '@/script/tools';
import { useRM } from '@/stores/resource-manager';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiDownload, mdiImageFilterCenterFocus, mdiOpenInNew } from '@mdi/js';
import { Locale } from '@varlet/ui';
import { computed } from 'vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

export type Emoji = {
  contentTextMapHash: number;
  icon: string;
  id: number;
  order: number;
  setID: number;
};

export type EmojiSet = {
  icon: string;
  id: number;
  nameTextMapHash: number;
  order: number;
};

export type EmojiData = {
  data: Emoji[];
  set: EmojiSet[];
};

const RM = useRM();

const { locale } = useI18n();
const data = ref<EmojiData>();
const search = ref('');
const textMap = ref(structuredClone(LanguageTextMapDefault));
const text = computed(() => textMap.value[locale.value as T_SupportedLanguage]);
const id = ref(0);
RM.get('emotion/meta.json').then((res: EmojiData) => {
  data.value = res;
  id.value = data.value.set[0].id;
});
const result = computed(() => {
  if (!search.value)
    return data.value?.data.filter((item) => item.setID == id.value);
  return data.value?.data.filter((item) =>
    text.value[item.contentTextMapHash]
      .toLowerCase()
      .includes(search.value.toLowerCase())
  );
});
const getUrl = (icon: string) => {
  return (
    'https://yunhan-data.sharpdotnut.com/Static/Genshin-UI/EmotionIcon/' +
    icon +
    '.png'
  );
};
const open = (emoji: Emoji) => {
  window.open(getUrl(emoji.icon), '_blank');
};
const download = async (emoji: Emoji) => {
  const blob = await fetch(getUrl(emoji.icon)).then((res) => res.blob());
  saveFile(`${text.value[emoji.contentTextMapHash]}.png`, blob, 'image/png');
};

SupportedLanguages.forEach(async (lang) => {
  textMap.value[lang] = await RM.get(`emotion/text_${lang}.json`);
});
</script>

<template>
  <div class="container-emotion flex flex-col">
    <var-input :placeholder="$t('global.search')" v-model="search" />
    <div v-if="data" class="flex" id="content">
      <var-tabs
        v-if="!search"
        id="tabs"
        v-model:active="id"
        layout-direction="vertical">
        <var-tab v-for="set in data.set" :key="set.id" :name="set.id">
          <div
            style="margin: 2px; display: flex; gap: 5px; align-items: center">
            <img :src="getUrl(set.icon)" />
            <span class="hidden">
              {{ text?.[set.nameTextMapHash] }}
            </span>
          </div>
        </var-tab>
      </var-tabs>
      <main>
        <div id="list">
          <var-card v-for="item in result">
            <div class="item">
              <img
                :key="id"
                :src="getUrl(item.icon)"
                height="128"
                width="128" />
              <span>
                {{ text?.[item.contentTextMapHash] }}
              </span>
              <span style="display: flex; gap: 5px">
                <var-button round size="small" @click="download(item)">
                  <SvgIcon type="mdi" :path="mdiDownload" />
                </var-button>
                <var-button round size="small" @click="open(item)">
                  <SvgIcon type="mdi" :path="mdiOpenInNew" />
                </var-button>
                <var-button
                  v-if="search"
                  round
                  size="small"
                  @click="
                    search = '';
                    id = item.setID;
                  ">
                  <SvgIcon type="mdi" :path="mdiImageFilterCenterFocus" />
                </var-button>
              </span>
            </div>
          </var-card>
        </div>
      </main>
    </div>
    <div v-else id="content" class="flex" style="justify-content: center">
      <var-loading />
    </div>
  </div>
</template>

<style lang="css" scoped>
@import url('./index.css');
</style>
