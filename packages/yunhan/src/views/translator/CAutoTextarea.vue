<script setup lang="ts">
import { ref, onMounted, type Ref, nextTick } from 'vue';

const text = defineModel<string>();

const textareaRef: Ref<any> = ref(null);
const height = ref('auto');

function resizeTextarea() {
  if (!textareaRef.value) return;
  height.value = 'auto';
  nextTick(() => {
    height.value = textareaRef.value.scrollHeight + 'px';
  });
}

function handleInput() {
  resizeTextarea();
}

onMounted(() => {
  resizeTextarea();
});

defineExpose({
  resizeTextarea,
  focus: () => textareaRef.value.focus(),
  blur: () => textareaRef.value.blur()
});
</script>
<template>
  <textarea
    class="--textarea"
    ref="textareaRef"
    v-model="text"
    :style="{
      height: height,
      resize: 'none'
    }"
    @input="handleInput"
    v-bind="$attrs"></textarea>
</template>

<style lang="css" scoped>
@import url('./CAutoTextarea.css');
</style>
