<script setup lang="ts">
import { ref, watch } from 'vue';
import { RouterView, useRoute, useRouter } from 'vue-router';
import AppBar from '@/components/app-bar.vue';
import { useI18n } from 'vue-i18n';
import { Dialog, Locale, Snackbar } from '@varlet/ui';
import { matchLanguages } from '@kuriyota/locale-matcher';
import RouterJump from '@/components/router-jump.vue';
import {
  status,
  SupportedLanguages,
  type T_SupportedLanguage
} from './locales/i18n';

const { locale, t } = useI18n();
const loading = ref(false);
const mainStore = useMainStore();
const ui_showMenu = ref(true);

const updateLocale = (lang: string) => {
  if (SupportedLanguages.includes(lang as T_SupportedLanguage)) {
    if (locale.value !== lang) {
      locale.value = lang;
    }
  } else {
    const langs = matchLanguages(
      lang,
      SupportedLanguages as unknown as string[]
    );
    if (lang.length > 0) {
      updateLocale(langs[0]);
    }
  }
};
updateLocale(localStorage.getItem('YunHan:lang') ?? navigator.language);

import { useMainStore } from './stores/main';
const Store = useMainStore();
const router = useRouter();
const route = useRoute();

const updateIP = () => {
  if (!route.path.startsWith('/yae')) {
    Store.title = t('name');
    document.title = t('name');
    Store.logoURL = '/img/UI_ChapterIcon_Yunjin.png';
  } else {
    Store.title = t('yae.name');
    document.title = t('yae.name');
    Store.logoURL = '/img/YAE.svg';
  }
};
router.afterEach((to) => {
  updateIP();
});

watch(
  locale,
  (newLocale) => {
    updateIP();
    document.documentElement.lang = newLocale;
    Locale.use(newLocale);
    localStorage.setItem('YunHan:lang', newLocale);
    const data = status.translated.find((item) => item.lang === newLocale);
    if (data && data.len < status.all) {
      Snackbar.warning({
        content: t('app.translation-incomplete'),
        position: 'bottom'
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

const setVersion = () => {
  localStorage.setItem('YunHan:UV', mainStore.version);
};

if (!localStorage.getItem('YunHan:MetaURL')) {
  mainStore.initTasks.push('res_url');
}
if (!localStorage.getItem('YunHan:Font')) {
  mainStore.initTasks.push('font');
}
if (mainStore.initTasks.length > 0) {
  // router.push({
  //   path: '/init',
  //   query: {
  //     from: route.fullPath
  //   }
  // });
}
</script>

<template>
  <div id="app">
    <div id="app-container">
      <div id="app-bar">
        <AppBar @open-bar="ui_showMenu = !ui_showMenu" />
      </div>
      <div id="content" class="elevation-12">
        <RouterJump
          :style="{
            position: Store.windowSize.width >= 800 ? undefined : 'absolute',
            transform:
              Store.windowSize.width >= 800 || !ui_showMenu
                ? undefined
                : 'translateX(-100%)'
          }"
          v-if="$route.name != 'index'"
          v-model="ui_showMenu" />
        <RouterView style="width: 100%" />
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
