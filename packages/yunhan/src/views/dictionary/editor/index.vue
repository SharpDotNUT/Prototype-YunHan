<script setup lang="ts">
import { fileSave } from 'browser-fs-access';

const save = () => {
  const blob = new Blob(['hello'], { type: 'text/plain' });
  fileSave(blob, {
    fileName: 'hello.txt'
  });
};
</script>

<template>
  <var-button type="primary" @click="save">Save File</var-button>
</template>
