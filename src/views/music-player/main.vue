<script setup lang="ts">
import { computed } from 'vue';
import { useMusicStore } from './store';
import { ref } from 'vue';
import ListAlbum from './list-album.vue';
import ListSongs from './list-songs.vue';

const store = useMusicStore();

const ui_currentAlbum = ref(195683561);
store.fetchAlbum(195683561);
const ui_albums = computed(() =>
  store.D_Song.filter((a) => a.albumId === ui_currentAlbum.value)
);
</script>

<template>
  <div class="container-main">
    <div>
      <h3>{{ $t('music-player.album') }}</h3>
      <ListAlbum v-model="ui_currentAlbum" />
    </div>
    <div>
      <h3>{{ $t('music-player.songs') }}</h3>
      <ListSongs :list="ui_albums" />
    </div>
  </div>
</template>

<style lang="css" scoped>
@import url('./main.css');
</style>
