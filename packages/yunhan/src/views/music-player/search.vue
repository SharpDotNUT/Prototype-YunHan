<script setup lang="ts">
import { computed, ref } from 'vue';
import Songs from './list-songs.vue';
import { useMusicStore } from './store';

const ui_show = defineModel<Boolean>({
  default: false
});

const store = useMusicStore();

const searchString = ref('');
const debouncedSearch = ref('');
let searchTimer: number | null = null;

const handleSearchInput = (value: string) => {
  if (searchTimer) {
    clearTimeout(searchTimer);
  }
  searchTimer = setTimeout(() => {
    debouncedSearch.value = value;
  }, 500);
};

const searchResults = computed(() => {
  if (!debouncedSearch.value) return [];
  return store.D_Song.filter(
    (song) =>
      song.name.toLowerCase().includes(debouncedSearch.value.toLowerCase()) ||
      (song?.alias &&
        song.alias.toLowerCase().includes(debouncedSearch.value.toLowerCase()))
  );
});
</script>

<template>
  <Transition name="fade">
    <div v-if="ui_show" id="search">
      <div id="back" @click="ui_show = false" style="z-index: 25"></div>
      <div id="main" style="z-index: 30">
        <var-input
          v-model="searchString"
          :placeholder="$t('global.search')"
          @input="handleSearchInput" />
        <div>
          <var-button block type="primary" @click="ui_show = false">
            {{ $t('global.action.close') }}
          </var-button>
        </div>
        <Songs
          v-if="searchResults.length > 0"
          id="list"
          :list="searchResults"></Songs>
      </div>
    </div>
  </Transition>
</template>

<style lang="css" scoped>
@import url('./search.css');
</style>
