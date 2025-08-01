<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useMainStore } from '@/stores/main';
const mainStore = useMainStore();
import { useI18n } from 'vue-i18n';
import { status } from '@/locales/i18n';
import { round } from 'lodash-es';
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
        <var-option
          v-for="lang in status.translated"
          :label="lang.name"
          :value="lang.lang">
          <var-space justify="space-between" style="width: 100%">
            <span>{{ lang.name }}</span>
            <span>
              {{ lang.len }} / {{ status.all }},
              {{ round((lang.len / status.all) * 100, 1) }} %
            </span>
          </var-space>
        </var-option>
      </var-select>
    </div>
    <var-divider />
    <div>
      <h2>{{ $t('setting.language.game-font') }}</h2>
      <br />
      <var-select
        variant="outlined"
        v-model="mainStore.gameFont"
        :placeholder="$t('setting.game-font.select')">
        <var-option :label="$t('global.game.GI')" value="GI"></var-option>
        <var-option :label="$t('global.game.HSR')" value="HSR"></var-option>
        <var-option :label="$t('global.game.ZZZ')" value="ZZZ"></var-option>
      </var-select>
    </div>
  </div>
</template>
