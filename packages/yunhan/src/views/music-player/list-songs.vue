<script setup lang="ts">
import { round } from 'es-toolkit';
import { useMusicStore } from './store';
import type { T_Song } from './types';

const store = useMusicStore();
const props = defineProps<{ list: T_Song[] }>();
</script>

<template>
  <div class="center" v-if="list.length == 0">
    <var-loading></var-loading>
  </div>
  <div v-else class="list">
    <div
      class="item"
      v-for="item in list"
      :class="{
        selected: store.current?.id === item.id
      }"
      @click="
        store.current = item;
        store.currentAlbumID = item.albumId;
      "
      :key="item.id">
      <img :src="store.getCover(item.albumId)" height="20" lazy />
      <div>
        <p class="title">
          <span>
            {{ item.name }}
          </span>
          <span v-if="item.alias" class="sub-title">
            &nbsp;({{ item.alias }})
          </span>
        </p>
        <p class="sub-text">
          {{ $t('global.time.sec', [round(item.duration / 1000)]) }}
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
@import url('./list.css');
</style>
