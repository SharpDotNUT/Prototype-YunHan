<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})
</script>

<template>
  <div class="__container_title">
    <h2 lang="zh-Hans">
      {{ data.name }}
    </h2>
    <p lang="zh-Hans" style="color: #777">
      {{ data.alias }}
    </p>
  </div>
</template>

<style lang="css" scoped>
.__container_title {
  text-align: center;
  margin: 20px 0;
}
</style>
