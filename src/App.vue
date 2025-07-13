<script setup lang="ts">
import { ref, watch } from 'vue';
import { RouterView, useRoute, useRouter } from 'vue-router';
import AppBar from '@/components/app-bar.vue';
import { useI18n } from 'vue-i18n';
import { Dialog, Locale, Snackbar } from '@varlet/ui';
import { matchLanguages } from '@kuriyota/locale-matcher';

const { locale, t } = useI18n();
const loading = ref(false);

const updateLocale = (lang: string) => {
  if (SupportedLanguages.includes(lang)) {
    if (locale.value !== lang) {
      locale.value = lang;
      console.log('[App] update locale to ', lang);
    }
  } else {
    const langs = matchLanguages(lang, SupportedLanguages);
    if (lang.length > 0) {
      updateLocale(langs[0]);
    }
  }
};
updateLocale(localStorage.getItem('YunHan:lang') ?? navigator.language);

watch(
  locale,
  (newLocale) => {
    document.title = t('name');
    document.documentElement.lang = newLocale;
    Locale.use(newLocale);
    localStorage.setItem('YunHan:lang', newLocale);
    const data = status.translated.find((item) => item.lang === newLocale);
    if (data && data.len < status.all) {
      Snackbar.info({
        content: t('app.translation-incomplete')
      });
    }
  },
  {
    immediate: true
  }
);
watch(loading, (newLoading) => {
  if (!newLoading) {
    Dialog.close();
  }
});

const LS = localStorage;

import { useRegisterSW } from 'virtual:pwa-register/vue';
import { status, SupportedLanguages } from './locales/i18n';
const { needRefresh, updateServiceWorker } = useRegisterSW({
  onRegistered() {
    console.log('Service Worker registered');
  },
  onRegisterError(error: Error) {
    console.log('Service Worker register error:' + error.toString());
    Snackbar.error(t('app.sw-error'));
  }
});

const needUpdate = ref(false);
console.log({ needRefresh, updateServiceWorker });
if (needRefresh.value) {
  needUpdate.value = true;
}
</script>

<template>
  <div id="app">
    <div id="app-bar">
      <AppBar />
    </div>
    <var-loading :loading="loading" type="wave">
      <div id="content" class="elevation-12">
        <RouterView />
      </div>
      <template #description>
        {{ $t('global.loading') }}
      </template>
    </var-loading>
  </div>
  <var-dialog v-model:show="needUpdate" @confirm="updateServiceWorker(true)">
    <template #title>
      {{ $t('app.update') }}
    </template>
    {{ $t('app.new-version') }}
  </var-dialog>
</template>

<style>
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}
</style>

<style lang="css" scoped>
@import url('./app.css');
</style>
