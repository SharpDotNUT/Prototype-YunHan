<script setup lang="ts">
import { useMusicStore } from './store';

const store = useMusicStore();
</script>

<template>
  <div>
    <div v-for="lyricLine in store.lyric"></div>
  </div>
</template>
