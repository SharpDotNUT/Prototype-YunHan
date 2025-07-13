<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
const { locale } = useI18n();
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller';
import { useDict } from './store';
import CWord from './word.vue';

const store = useDict();

const searchText = ref('');
const searchTags = ref<string[]>([]);
const search = () => {
  store.search(searchText.value, searchTags.value);
};
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
            <CWord
              :word="item"
              @search-tag="
                searchTags = [$event];
                search();
              " />
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
    </div>
    <div direction="column" id="search" ref="panel">
      <var-input
        v-model="searchText"
        clearable
        @blur="search()"
        @keyup.enter="search()"
        :placeholder="$t('dictionary.search-text')" />
      <var-select
        :placeholder="$t('dictionary.filter')"
        chip
        multiple
        v-model="searchTags"
        @change="search()">
        <var-option
          v-for="(text, tag) in store.Tags?.[locale]"
          :value="tag"
          :label="text" />
      </var-select>
      <var-button block type="primary" @click="search()">
        {{ $t('global.search') }}
      </var-button>
    </div>
  </div>
</template>

<style lang="css" scoped>
@import url('./main.css');
</style>
