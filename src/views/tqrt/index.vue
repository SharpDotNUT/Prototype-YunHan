<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { renderMessage } from './render';
import { useTQRTStore } from './store';
import { getLanguage } from './util';
import { round } from 'lodash-es';
import { useMainStore } from '@/stores/main';
import { useI18n } from 'vue-i18n';
import { Dialog } from '@varlet/ui';
import Resource from './resource.vue';

const Store = useTQRTStore();
const is_translate = ref(false);
const queryGame = ref('Genshin');
const queryString = ref('云堇');
const queryLanguage = ref('');
const queryTranslateLanguage = ref('');
const result = ref<Array<any>>([]);
const timeUse = ref(0);
const result_display = ref<Array<any>>([]);
const querying = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const ui_showRes = ref(false);

const MainStore = useMainStore();
const { t } = useI18n();

if (MainStore.windowSize.width < 600) {
  Dialog(t('global.tip.not-optimized-narrow'));
}

const languages = computed(() => {
  return Object.values(Store.langData).filter((v) => v.game == queryGame.value);
});

const checkIfLanguageInstalled = (lang: string) => {
  return Store.localLangs?.[`${queryGame.value}.${lang}`] != undefined;
};

const reduceResult = (current: number, size: number) => {
  result_display.value = result.value.slice(
    (current - 1) * size,
    current * size
  );
};

const handleSearch = async () => {
  if (!queryString.value) return;
  const start = performance.now();
  querying.value = true;
  result.value = await Store.searchText(
    queryGame.value,
    queryString.value,
    queryLanguage.value,
    is_translate.value ? queryTranslateLanguage.value : undefined
  );
  reduceResult(currentPage.value, pageSize.value);
  querying.value = false;
  timeUse.value = performance.now() - start;
};

// 监听分页变化
watch([currentPage, pageSize], () => {
  if (result.value.length) {
    reduceResult(currentPage.value, pageSize.value);
  }
});
</script>

<template>
  <div
    class="__container"
    :style="{
      '--font-family':
        queryGame == 'Genshin'
          ? 'var(--font-gi-family)'
          : 'var(--font-hsr-family)'
    }">
    <div id="panel">
      <div id="bar">
        <var-select v-model="queryGame" :placeholder="$t('sp-key.game')">
          <var-option
            value="Genshin"
            :label="
              $t('global.game.GI') + ` ${Store.gameMeta.Genshin.version}`
            " />
          <var-option
            value="StarRail"
            :label="
              $t('global.game.HSR') + ` ${Store.gameMeta.StarRail.version}`
            " />
        </var-select>

        <var-input
          v-model="queryString"
          :placeholder="$t('dictionary.search-text')" />

        <var-select
          v-model="queryLanguage"
          :placeholder="$t('dictionary.search-lang')">
          <var-option
            v-for="item in languages"
            :disabled="!checkIfLanguageInstalled(item.lang)"
            :key="item.lang"
            :value="item.lang"
            :label="getLanguage(item.lang)?.name">
            {{ getLanguage(item.lang)?.name }}
            <span v-if="!checkIfLanguageInstalled(item.lang)">
              &nbsp;({{ $t('global.not-installed') }})
            </span>
          </var-option>
        </var-select>
        <var-select
          v-model="queryTranslateLanguage"
          :disabled="!is_translate"
          :placeholder="$t('tqrt.translate-lang')">
          <var-option
            v-for="item in languages"
            :disabled="!checkIfLanguageInstalled(item.lang)"
            :key="item.lang"
            :value="item.lang"
            :label="getLanguage(item.lang)?.name">
            {{ getLanguage(item.lang)?.name }}
            <span v-if="!checkIfLanguageInstalled(item.lang)">
              &nbsp;({{ $t('global.not-installed') }})
            </span>
          </var-option>
        </var-select>

        <var-checkbox v-model="is_translate">
          {{ $t('tqrt.translate-mode') }}
        </var-checkbox>

        <var-button block type="primary" @click="ui_showRes = true">
          {{ $t('tqrt.manage-text-res') }}
        </var-button>

        <var-button
          block
          type="primary"
          :loading="querying"
          :disabled="
            !queryString ||
            !queryLanguage ||
            (is_translate && !queryTranslateLanguage)
          "
          @click="handleSearch">
          {{ $t('global.search') }}
        </var-button>

        <div>{{ $t('tqrt.using-time', [round(timeUse || 0, 3)]) }}</div>
      </div>
      <var-divider />
      <div id="log">
        <pre>{{ Store.log }}</pre>
      </div>
    </div>
    <div id="main">
      <var-pagination
        v-model:current="currentPage"
        v-model:size="pageSize"
        :total="result?.length || 0"
        :show-total="(total) => `${total}`"
        @change="reduceResult" />

      <div>
        <var-cell v-for="item in result_display" :key="item.id" border>
          <div class="result-row">
            <div
              v-html="renderMessage(item.text)"
              class="text"
              :style="{ width: is_translate ? '50%' : '100%' }" />
            <div
              v-if="is_translate"
              v-html="renderMessage(item.translate)"
              class="text translate-text" />
          </div>
        </var-cell>
      </div>
    </div>
    <Resource v-model="ui_showRes" id="res"></Resource>
  </div>
</template>

<style scoped>
@import url('./index.css');
.__container {
  font-family: var(--font-family);
}
</style>
