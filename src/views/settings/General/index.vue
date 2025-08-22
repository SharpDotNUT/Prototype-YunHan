<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useMainStore } from '@/stores/main';
const mainStore = useMainStore();
import { useI18n } from 'vue-i18n';
import { status } from '@/locales/i18n';
import { round } from 'lodash-es';
import { useRM } from '@/stores/resource-manager';
const { locale } = useI18n();

const ui_isTeyvatFont = ref(mainStore.isUsingTeyvatFont);
const theme = ref('system');
const router = useRouter();
watch(theme, () => {
  mainStore.setTheme(theme.value);
});

const RM = useRM();

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
  <div class="container">
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
      <br />
      <div style="display: flex; gap: 5px; flex-wrap: wrap">
        <span>{{ $t('setting.translation-progress-online') }}</span>
        <img
          alt="en translation"
          src="https://img.shields.io/badge/dynamic/json?color=blue&label=en&style=flat&logo=crowdin&query=%24.progress.0.data.translationProgress&url=https%3A%2F%2Fbadges.awesome-crowdin.com%2Fstats-15913271-813246.json" />
        <img
          alt="ja translation"
          src="https://img.shields.io/badge/dynamic/json?color=blue&label=ja&style=flat&logo=crowdin&query=%24.progress.1.data.translationProgress&url=https%3A%2F%2Fbadges.awesome-crowdin.com%2Fstats-15913271-813246.json" />
        <img
          alt="zh-TW translation"
          src="https://img.shields.io/badge/dynamic/json?color=blue&label=zh-Hant&style=flat&logo=crowdin&query=%24.progress.2.data.translationProgress&url=https%3A%2F%2Fbadges.awesome-crowdin.com%2Fstats-15913271-813246.json" />
        <span>|</span>
        <span>
          <var-link
            target="_blank"
            href="https://zh.crowdin.com/project/protype-yunhan/">
            {{ $t('setting.contribute-translation') }}
          </var-link>
        </span>
      </div>
    </div>
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
    <div>
      <h2>{{ $t('setting.res.url') }}</h2>
      <br />
      <var-radio-group v-model="RM.MetaURL">
        <div v-for="URLOption in RM.MetaURLOptions" class="radio-item">
          <var-radio :checked-value="URLOption.base"></var-radio>
          <div>
            <pre>{{ URLOption.base }}</pre>
            <p>by {{ URLOption.provider }}</p>
            <p>
              {{ $t('global.status') }}:
              <span v-if="URLOption.status === 'CANNOT_USE'">
                {{ $t('global.offline') }}
              </span>
              <span v-else-if="URLOption.status === 'UNKNOWN'">
                {{ $t('global.unknown') }}
              </span>
              <span v-else>{{ round(URLOption.status, 2) }} ms</span>
            </p>
            <var-button
              size="small"
              @click="RM.testNetStatusSync(URLOption.base)">
              {{ $t('global.test') }}
            </var-button>
          </div>
        </div>
      </var-radio-group>
    </div>
  </div>
</template>

<style lang="css" scoped>
@import url('./index.css');
</style>
