<script setup lang="ts">
import { ref, watch } from 'vue';
import { RouterView, useRoute, useRouter } from 'vue-router';
import AppBar from '@/components/app-bar.vue';
import UpdateLog from '@/views/update_log/index.vue';
import NewVersionTip from './components/UpdateTip/UpdateTip.vue';
import { useI18n } from 'vue-i18n';
import { Dialog, Locale, Snackbar } from '@varlet/ui';
import { matchLanguages } from '@kuriyota/locale-matcher';
import ky from 'ky';

const { locale, t } = useI18n();
const loading = ref(false);
const mainStore = useMainStore();

const updateLocale = (lang: string) => {
  if (SupportedLanguages.includes(lang)) {
    if (locale.value !== lang) {
      locale.value = lang;
    }
  } else {
    const langs = matchLanguages(lang, SupportedLanguages);
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

import { useRegisterSW } from 'virtual:pwa-register/vue';
import { status, SupportedLanguages } from './locales/i18n';
const needUpdate = ref(false);
const ui_showUpdateTip = ref(false);
const newVersionInfo = ref<
  | {
      version: string;
      buildTime: string;
    }
  | undefined
>(undefined);
ky.get('/meta.json').then(async (res) => {
  newVersionInfo.value = await res.json();
});
const { needRefresh, updateServiceWorker } = useRegisterSW({
  onNeedRefresh() {
    console.log('New content available');
    needUpdate.value = true;
  },
  onRegistered(r) {
    console.log('Service Worker registered', r);
    setTimeout(
      () => {
        r?.update();
      },
      60 * 60 * 1000
    );
  },
  onRegisterError(error: Error) {
    console.log('Service Worker register error:' + error.toString());
    Snackbar.error(t('app.sw-error'));
  }
});

console.log({ needRefresh, updateServiceWorker });
const ui_showUpdate = ref(
  !localStorage.getItem('YunHan:UV') ||
    mainStore.version !== localStorage.getItem('YunHan:UV')
);
const setVersion = () => {
  localStorage.setItem('YunHan:UV', mainStore.version);
};

if (!localStorage.getItem('YunHan:MetaURL')) {
  mainStore.initTasks.push('res_url');
}
if (mainStore.initTasks.length > 0) {
  router.push({
    path: '/init',
    query: {
      from: route.fullPath
    }
  });
}
</script>

<template>
  <div id="app">
    <NewVersionTip
      :data="newVersionInfo"
      v-model="ui_showUpdateTip"
      @confirm="updateServiceWorker()"
      @cancel="needUpdate = false" />
    <div>
      <var-alert v-if="needUpdate" closeable @close="needUpdate = false">
        <var-space justify="space-between">
          <p>
            {{ $t('app.new-version') }}
          </p>
          <var-button size="small" text @click="ui_showUpdateTip = true">
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
  <var-popup position="bottom" v-model:show="ui_showUpdate">
    <div id="ul">
      <h2>{{ $t('update-log.title') }} | {{ mainStore.version }}</h2>
      <UpdateLog id="log" />
      <div>
        <var-button
          block
          @click="
            ui_showUpdate = false;
            setVersion();
          ">
          {{ $t('global.action.close') }}
        </var-button>
      </div>
    </div>
  </var-popup>
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
