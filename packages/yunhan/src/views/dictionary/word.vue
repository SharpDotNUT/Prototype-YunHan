<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useDict } from './store';
import type { Word } from './types';
import ZhText from './zh-text.vue';
import { copyToClipboard } from '@/script/tools';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiContentCopy, mdiVolumeHigh } from '@mdi/js';
import type { TSupportedLanguages } from '@/locales/i18n';

const { locale } = useI18n();
const store = useDict();
defineProps<{ word: Word }>();
defineEmits(['searchTag']);
</script>

<template>
  <div class="word-container">
    <var-cell border class="word">
      <table>
        <tr>
          <td>
            <h5>{{ $t('global.lang.zh-Hans') }}</h5>
          </td>
          <td>
            <ZhText :word="word" />
          </td>
          <td>
            <var-button
              round
              size="small"
              type="primary"
              @click="copyToClipboard(word.text['zh-Hans'])">
              <SvgIcon type="mdi" :path="mdiContentCopy" />
            </var-button>
            <var-button
              round
              size="small"
              type="primary"
              @click="store.read(word.text['zh-Hans'], 'zh')">
              <SvgIcon type="mdi" :path="mdiVolumeHigh" />
            </var-button>
          </td>
        </tr>
        <tr>
          <td>
            <h5>{{ $t('global.lang.en') }}</h5>
          </td>
          <td>
            <p lang="en">{{ word.text.en }}</p>
          </td>
          <td>
            <var-button
              round
              size="small"
              type="primary"
              @click="copyToClipboard(word.text.en)">
              <SvgIcon type="mdi" :path="mdiContentCopy" />
            </var-button>
            <var-button
              round
              size="small"
              type="primary"
              @click="store.read(word.text.en, 'en')">
              <SvgIcon type="mdi" :path="mdiVolumeHigh" />
            </var-button>
          </td>
        </tr>
        <tr>
          <td>
            <h5>{{ $t('global.lang.ja') }}</h5>
          </td>
          <td>
            <p lang="ja">{{ word.text.ja }}</p>
            <p v-if="word.pronunciationJa" class="kana">
              {{ word.pronunciationJa }}
            </p>
          </td>
          <td>
            <var-button
              round
              size="small"
              type="primary"
              @click="copyToClipboard(word.text.ja)">
              <SvgIcon type="mdi" :path="mdiContentCopy" />
            </var-button>
            <var-button
              round
              size="small"
              type="primary"
              @click="store.read(word.pronunciationJa ?? word.text.ja, 'ja')">
              <SvgIcon type="mdi" :path="mdiVolumeHigh" />
            </var-button>
          </td>
        </tr>
      </table>
      <br />
      <p>
        {{ word.note?.[locale as TSupportedLanguages] }}
      </p>
      <br />
      <div>
        <var-chip
          type="info"
          class="tag"
          size="small"
          v-for="tag in word.tags"
          @click="$emit('searchTag', tag)">
          {{ store.Tags?.[locale]?.[tag] }}
        </var-chip>
      </div>
    </var-cell>
  </div>
</template>

<style lang="css" scoped>
@import url('./word.css');
</style>
