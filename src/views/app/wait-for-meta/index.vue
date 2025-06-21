<script setup lang="ts">
import { useRM } from '@/stores/resource-manager';
import { watch } from 'vue';
import { useRouter } from 'vue-router';

const RM = useRM();
const router = useRouter();

watch(
  () => RM.StaticMetaData,
  (newValue) => {
    if (newValue !== null) {
      router.back();
    }
  },
  {
    immediate: true
  }
);
</script>

<template>
  <div
    style="
      display: flex;
      flex-direction: column;
      height: 100%;
      gap: 10px;
      align-items: center;
      justify-content: center;
    ">
    <p>{{ $t('app.wait-for-meta') }}</p>
    <var-loading></var-loading>
  </div>
</template>
