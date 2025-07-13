<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Word } from './types';

const { word } = defineProps<{ word: Word }>();

const text = ref('');

const update = () => {
  text.value = '';
  if (Object.keys(word.pinyinZHS).length == 0) {
    text.value += word.text['zh-Hans'];
  } else {
    const iterator = word.text['zh-Hans'][Symbol.iterator]();
    for (const char of iterator) {
      if (word.pinyinZHS[char]) {
        text.value += `<ruby>${char}<rt>${word.pinyinZHS[char]}</rt></ruby>`;
      } else {
        text.value += char;
      }
    }
  }
};
update();

watch(
  () => word.id,
  () => {
    update();
  }
);
</script>

<template>
  <p lang="zh-Hans" v-html="text"></p>
</template>
