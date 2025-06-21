<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useMainStore } from '@/stores/main';
const mainStore = useMainStore();
import { useI18n } from 'vue-i18n';
const { locale } = useI18n();

const ui_isTeyvatFont = ref(mainStore.isUsingTeyvatFont);
const theme = ref('system');
const router = useRouter();
watch(theme, () => {
  mainStore.setTheme(theme.value);
});

watch(ui_isTeyvatFont, () => {
  if (ui_isTeyvatFont.value) {
    locale.value = 'en';
    mainStore.isUsingTeyvatFont = true;
    router.push({ query: { lang: locale.value } });
    document.documentElement.classList.add('teyvat');
  } else {
    mainStore.isUsingTeyvatFont = false;
    document.documentElement.classList.remove('teyvat');
  }
});
</script>

<template>
  <div>
    <div>
      <h2>{{ $t('setting.theme.title') }}</h2>
      <br />
      <var-select
        variant="outlined"
        v-model="theme"
        :placeholder="$t('setting.theme.select')">
        <template #prepend-icon><var-icon name="palette" /></template>
        <var-option
          :label="$t('setting.theme.light')"
          value="light"></var-option>
        <var-option :label="$t('setting.theme.dark')" value="dark"></var-option>
        <var-option
          :label="$t('setting.theme.system')"
          value="system"></var-option>
        <template #append-icon></template>
      </var-select>
    </div>
    <var-divider />
    <div>
      <h2>{{ $t('setting.language.title') }}</h2>
      <br />
      <var-select
        :disabled="ui_isTeyvatFont"
        variant="outlined"
        v-model="locale"
        :placeholder="$t('setting.language.select')">
        <template #prepend-icon><var-icon name="translate" /></template>
        <var-option label="English" value="en"></var-option>
        <var-option label="中文（简体）" value="zh-Hans"></var-option>
        <var-option label="日本語" value="ja"></var-option>
      </var-select>
      <br />
      <p
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
        <span>{{ $t('setting.language.teyvat') }}</span>
        <var-switch v-model="ui_isTeyvatFont" :variant="true" />
      </p>
    </div>
  </div>
</template>
