<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
const { locale } = useI18n();
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller';
import { useDict } from './store';
import ZhText from './zh-text.vue';

const store = useDict();

const searchText = ref('');
const searchTags = ref<string[]>([]);
</script>

<template>
  <div class="dictionary-main">
    <div id="result">
      <div class="center" v-if="!store.wordsLoaded">
        <var-loading :description="$t('global.loading')" />
      </div>
      <DynamicScroller
        v-else
        id="list"
        :items="store.WordsFiltered"
        :min-item-size="100">
        <template #default="{ item, index, active }">
          <DynamicScrollerItem
            :item="item"
            :active="active"
            :size-dependencies="[
              locale,
              item.text['zh-Hans'],
              item.text.en,
              item.text.ja
            ]"
            :data-index="index">
            <div style="padding: 10px 0">
              <var-cell border class="word">
                <h5>{{ $t('global.lang.zh-Hans') }}</h5>
                <ZhText :word="item" />
                <h5>{{ $t('global.lang.en') }}</h5>
                <p lang="en">{{ item.text.en }}</p>
                <h5>{{ $t('global.lang.ja') }}</h5>
                <p
                  style="display: flex; align-items: baseline; flex-wrap: wrap">
                  <span lang="ja">{{ item.text.ja }}</span>
                  <span lang="ja" class="kana" v-if="item.pronunciationJa">
                    <span>&nbsp(</span>
                    {{ item.pronunciationJa }}
                    <span>)</span>
                  </span>
                </p>
                <br />
                <div>
                  <var-chip
                    type="info"
                    class="tag"
                    v-for="tag in item.tags"
                    @click="
                      searchTags = [tag as string];
                      store.search(searchText, searchTags);
                    ">
                    {{ store.Tags?.[locale]?.[tag] }}
                  </var-chip>
                </div>
              </var-cell>
            </div>
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
    </div>
    <div direction="column" id="search" ref="panel">
      <var-input
        v-model="searchText"
        clearable
        @blur="store.search(searchText, searchTags)"
        @keyup.enter="store.search(searchText, searchTags)"
        :placeholder="$t('dictionary.search-text')" />
      <var-select
        :placeholder="$t('dictionary.filter')"
        chip
        multiple
        v-model="searchTags"
        @change="store.search(searchText, searchTags)">
        <var-option
          v-for="(text, tag) in store.Tags?.[locale]"
          :value="tag"
          :label="text" />
      </var-select>
      <var-button
        block
        type="primary"
        @click="store.search(searchText, searchTags)">
        {{ $t('global.search') }}
      </var-button>
    </div>
  </div>
</template>

<style lang="css" scoped>
@import url('./main.css');
</style>
