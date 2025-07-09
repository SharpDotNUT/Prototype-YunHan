<template>
  <div class="update-log-container">
    <var-card>
      <CMarkdown :content="Log"></CMarkdown>
    </var-card>
  </div>
</template>

<script setup lang="ts">
import CMarkdown from '@/components/markdown.vue';
import Log from '@/docs/update-log.md?raw';
</script>

<style scoped>
@import url('./index.css');
</style>
