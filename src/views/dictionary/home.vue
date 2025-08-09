<script setup lang="ts">
import { RouterLink } from 'vue-router';
import CMarkdown from '@/components/markdown.vue';

import ZhHansIntro from '@/locales/text/zh-Hans/dictionary.md?raw';
import ZhHantIntro from '@/locales/text/zh-Hant/dictionary.md?raw';
import EnIntro from '@/locales/text/en/dictionary.md?raw';
import JaIntro from '@/locales/text/ja/dictionary.md?raw';

import { useI18n } from 'vue-i18n';
const { locale } = useI18n();

const Intro: any = {
  'zh-Hans': ZhHansIntro,
  'zh-Hant': ZhHantIntro,
  en: EnIntro,
  ja: JaIntro
};
</script>

<template>
  <div class="dictionary-home">
    <h1>{{ $t('dictionary.title') }}</h1>
    <p>{{ $t('dictionary.description') }}</p>
    <router-link to="/dictionary/main">
      <var-card>{{ $t('dictionary.genshin-dict') }}</var-card>
    </router-link>
    <var-card>
      <CMarkdown :content="Intro[locale]" />
    </var-card>
  </div>
</template>

<style lang="css" scoped>
@import url('./home.css');
</style>
