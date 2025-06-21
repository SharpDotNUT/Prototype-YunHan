<script setup lang="ts">
import { ref, watch, provide } from 'vue'
import { RouterView } from 'vue-router'
import AppBar from '@/components/app-bar.vue'
import { useI18n } from 'vue-i18n'
import { Dialog, Locale } from '@varlet/ui'
import { useMainStore } from '@/stores/main'

const { locale, t } = useI18n()
const mainStore = useMainStore()
const loading = ref(false)

watch(locale, (newLocale) => {
  document.title = t('name')
  document.documentElement.lang = newLocale
  Locale.use(newLocale)
})
watch(loading, (newLoading) => {
  if (!newLoading) {
    Dialog.close()
  }
})

import { useRegisterSW } from 'virtual:pwa-register/vue'
import { THEME_KEY } from 'vue-echarts'
const { needRefresh, updateServiceWorker } = useRegisterSW({
  onRegistered() {
    console.log('SW已注册')
  },
  onRegisterError(error: Error) {
    Dialog('Service Worker register error:' + error.toString())
  }
})

console.log({ needRefresh, updateServiceWorker })
if (needRefresh.value) {
  Dialog({
    message: t('app.new-version'),
    confirmButtonText: t('app.update'),
    onConfirm: () => {
      updateServiceWorker(true)
    }
  })
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
