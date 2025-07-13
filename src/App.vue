<script setup lang="ts">
import { ref, watch } from 'vue';
import { RouterView, useRoute, useRouter } from 'vue-router';
import AppBar from '@/components/app-bar.vue';
import { useI18n } from 'vue-i18n';
import { Dialog, Locale, Snackbar } from '@varlet/ui';
import { matchLanguages } from '@kuriyota/locale-matcher';

const { locale, t } = useI18n();
const loading = ref(false);
const mainStore = useMainStore();

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

import { useRegisterSW } from 'virtual:pwa-register/vue';
import { status, SupportedLanguages } from './locales/i18n';
import { useMainStore } from './stores/main';
const { needRefresh, updateServiceWorker } = useRegisterSW({
  onRegistered() {
    console.log('Service Worker registered');
  },
  onRegisterError(error: Error) {
    console.log('Service Worker register error:' + error.toString());
    Snackbar.error(t('app.sw-error'));
  }
});

const needUpdate = ref(true);
console.log({ needRefresh, updateServiceWorker });
if (needRefresh.value) {
  needUpdate.value = true;
}
</script>

<template>
  <div id="app">
    <div v-if="needUpdate">
      <var-alert closeable @close="needUpdate = false">
        <var-space justify="space-between">
          <p>
            {{ $t('app.new-version') }}
          </p>
          <var-button size="small" text @click="updateServiceWorker()">
            {{ $t('app.update') }}
          </var-button>
        </var-space>
      </var-alert>
    </div>
    <div id="app-container">
      <div id="app-bar">
        <AppBar />
      </div>
      <div id="content" class="elevation-12">
        <RouterView />
      </div>
    </div>
  </div>
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
