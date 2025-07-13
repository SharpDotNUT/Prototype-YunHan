<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useDict } from './store';
import type { Word } from './types';
import ZhText from './zh-text.vue';
import { copyToClipboard } from '@/script/tools';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiContentCopy } from '@mdi/js';

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
          <td class="text">
            <ZhText :word="word" />
          </td>
          <td>
            <var-button
              size="small"
              type="primary"
              @click="copyToClipboard(word.text['zh-Hans'])">
              <SvgIcon type="mdi" :path="mdiContentCopy" />
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
              size="small"
              type="primary"
              @click="copyToClipboard(word.text.en)">
              <SvgIcon type="mdi" :path="mdiContentCopy" />
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
              size="small"
              type="primary"
              @click="copyToClipboard(word.text.ja)">
              <SvgIcon type="mdi" :path="mdiContentCopy" />
            </var-button>
            <template v-if="word.pronunciationJa">
              <br />
              <var-button
                size="small"
                type="primary"
                @click="copyToClipboard(word.pronunciationJa)">
                <SvgIcon type="mdi" :path="mdiContentCopy" />
              </var-button>
            </template>
          </td>
        </tr>
      </table>
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
