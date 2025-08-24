<script setup lang="ts">
import { onMounted, ref, useTemplateRef, watch } from 'vue';
import { useMusicStore } from './store';
import gsap from 'gsap';

const store = useMusicStore();

const lyrics = useTemplateRef('lyrics');
const containerLyric = useTemplateRef('containerLyric');

const isUserScrolling = ref(false);

const scrollToLyric = () => {
  if (!lyrics.value || !containerLyric.value) return;
  const currentLine = lyrics.value[store.currentLyricIndex];
  const container = containerLyric.value;
  const lineTop = currentLine.offsetTop;
  const containerHeight = container.clientHeight;
  const scrollPosition = lineTop - containerHeight / 2;
  gsap.to(container, {
    duration: 0.5,
    scrollTop: scrollPosition,
    ease: 'power2.out'
  });
};

watch(() => store.currentLyricIndex, scrollToLyric);
onMounted(scrollToLyric);
</script>

<template>
  <div
    class="container-lyric"
    ref="containerLyric"
    @wheel="isUserScrolling = true"
    @touchmove="isUserScrolling = true">
    <div style="height: 50%"></div>
    <div
      class="lyric-body"
      ref="lyrics"
      v-for="(lyricLine, index) in store.lyric"
      @click="store.setProgress(lyricLine.time / 1000)"
      :class="{
        now: index === store.currentLyricIndex
      }">
      <p class="lyric">{{ lyricLine.lyric }}</p>
      <p v-if="lyricLine.translation" class="translation">
        {{ lyricLine.translation }}
      </p>
      <p v-if="lyricLine.romaji" class="translation">{{ lyricLine.romaji }}</p>
    </div>
    <div style="height: 50%"></div>
  </div>
</template>

<style lang="css" scoped>
@import url('./lyric.css');
</style>
