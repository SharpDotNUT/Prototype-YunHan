<script setup lang="ts">
import { computed } from 'vue';
import { useMusicStore } from './store';
import { ref } from 'vue';

import './main.css';

const store = useMusicStore();

const ui_currentAlbum = ref(0);
const ui_albums = computed(() =>
  store.D_Song.filter((a) => a.albumId === ui_currentAlbum.value)
);
</script>

<template>
  <div class="container-main">
    {{ ui_currentAlbum }}
    <div class="list">
      <div
        v-for="album in store.D_Album"
        @click="
          ui_currentAlbum = album.id;
          store.fetchAlbum(album.id);
        "
        :key="album.id">
        <img
          :src="'https://p1.music.126.net/' + album.cover + '?param=100y100'"
          height="20"
          lazy />
        {{ album.name }}
      </div>
    </div>
    <div class="list">
      <var-loading v-if="ui_albums.length == 0" />
      <div
        v-else
        v-for="song in ui_albums"
        :key="song.id"
        @click="
          store.setSong(song);
          store.pause = false;
        ">
        {{ song.name }}
      </div>
    </div>
  </div>
</template>
