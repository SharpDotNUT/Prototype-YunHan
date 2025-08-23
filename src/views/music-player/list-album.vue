<script setup lang="ts">
import { round } from 'lodash-es';
import { useMusicStore } from './store';

const store = useMusicStore();
const model = defineModel<number>();

const emits = defineEmits<{ select: [number] }>();
</script>

<template>
  <div class="list">
    <div
      class="item"
      v-for="item in store.D_Album"
      :class="{
        selected: model === item.id
      }"
      @click="
        store.fetchAlbum(item.id);
        model = item.id;
      "
      :key="item.id">
      <img
        :src="'https://p1.music.126.net/' + item.cover + '?param=100y100'"
        height="20"
        lazy />
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
          {{ $t('music-player.songs-in-total', [item.count]) }}
          &nbsp;|&nbsp;
          {{ $t('global.time.sec', [round(item.duration / 1000)]) }}
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
@import url('./list.css');
</style>
